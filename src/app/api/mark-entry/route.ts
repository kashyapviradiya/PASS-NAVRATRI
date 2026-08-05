import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { ticketId, scannedBy, gateName } = await request.json();

    if (!ticketId || !scannedBy || !gateName) {
      return NextResponse.json({ success: false, message: 'Missing required parameters.' }, { status: 400 });
    }

    const ticketRef = adminDb.collection('tickets').doc(ticketId);

    const result = await adminDb.runTransaction(async (transaction) => {
      const ticketDoc = await transaction.get(ticketRef);

      if (!ticketDoc.exists) {
        throw new Error('Ticket not found.');
      }

      const ticketData = ticketDoc.data()!;

      if (ticketData.status === 'cancelled') {
        throw new Error('Ticket is cancelled.');
      }

      if (ticketData.checkedIn || ticketData.isUsed || ticketData.status === 'used') {
        // Log duplicate attempt inside transaction
        const scanLogRef = adminDb.collection('scanLogs').doc();
        transaction.set(scanLogRef, {
          id: scanLogRef.id,
          ticketId,
          eventId: ticketData.eventId,
          result: 'already_used',
          scannedBy,
          scannedAt: new Date().toISOString(),
          gateName,
          isDuplicateAttempt: true
        });
        
        throw new Error(`Ticket already marked as used at ${new Date(ticketData.checkedInAt || ticketData.entryTime || Date.now()).toLocaleString()} by ${ticketData.scannedBy || 'unknown staff'} at ${ticketData.gateName || 'unknown gate'}.`);
      }

      const checkedInAt = new Date().toISOString();

      transaction.update(ticketRef, {
        checkedIn: true,
        isUsed: true, // keep for backward compatibility
        status: 'used',
        checkedInAt,
        entryTime: checkedInAt, // keep for backward compatibility
        scannedBy,
        gateName
      });

      // Log the scan
      const scanLogRef = adminDb.collection('scanLogs').doc();
      transaction.set(scanLogRef, {
        id: scanLogRef.id,
        ticketId,
        eventId: ticketData.eventId,
        result: 'valid',
        scannedBy,
        scannedAt: checkedInAt,
        gateName,
        isDuplicateAttempt: false
      });

      return { ...ticketData, checkedIn: true, status: 'used', checkedInAt, scannedBy, gateName };
    });

    return NextResponse.json({ success: true, ticket: result, message: 'Entry successfully recorded.' });
  } catch (error: any) {
    console.error('Mark entry error:', error);
    if (error.message.includes('already marked as used')) {
       return NextResponse.json({ success: false, status: 'already_used', message: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}
