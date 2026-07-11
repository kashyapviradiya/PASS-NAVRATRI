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

      if (ticketData.isUsed) {
        throw new Error(`Ticket already marked as used at ${new Date(ticketData.entryTime).toLocaleString()}.`);
      }

      const entryTime = new Date().toISOString();

      transaction.update(ticketRef, {
        isUsed: true,
        status: 'used',
        entryTime,
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
        scannedAt: entryTime,
        gateName
      });

      return { ...ticketData, isUsed: true, status: 'used', entryTime, scannedBy, gateName };
    });

    return NextResponse.json({ success: true, ticket: result, message: 'Entry successfully recorded.' });
  } catch (error: any) {
    console.error('Mark entry error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}
