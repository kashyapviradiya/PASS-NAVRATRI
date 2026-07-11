import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { Ticket } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { ticketId, token } = await request.json();

    if (!ticketId || !token) {
      return NextResponse.json({ success: false, status: 'invalid', message: 'Invalid QR Code payload.' }, { status: 400 });
    }

    const ticketRef = adminDb.collection('tickets').doc(ticketId);
    const ticketDoc = await ticketRef.get();

    if (!ticketDoc.exists) {
      return NextResponse.json({ success: false, status: 'invalid', message: 'Ticket does not exist.' }, { status: 404 });
    }

    const ticket = ticketDoc.data() as Ticket;

    if (ticket.secureToken !== token) {
      return NextResponse.json({ success: false, status: 'invalid', message: 'Security token mismatch. Counterfeit ticket.' }, { status: 403 });
    }

    if (ticket.status === 'cancelled') {
      return NextResponse.json({ success: false, status: 'cancelled', message: 'Ticket has been cancelled.' }, { status: 403 });
    }

    if (ticket.isUsed) {
      return NextResponse.json({ success: false, status: 'already_used', message: `Ticket already scanned at ${ticket.entryTime ? new Date(ticket.entryTime).toLocaleString() : 'unknown time'}.`, ticket }, { status: 200 });
    }

    return NextResponse.json({ success: true, status: 'valid', message: 'Ticket is valid.', ticket });
  } catch (error: any) {
    console.error('Verify ticket error:', error);
    return NextResponse.json({ success: false, status: 'invalid', message: 'Internal server error' }, { status: 500 });
  }
}
