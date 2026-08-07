import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { ticketId: string } }) {
  try {
    const { ticketId } = params;

    const ticketDoc = await adminDb.collection('tickets').doc(ticketId).get();
    if (!ticketDoc.exists) {
      return NextResponse.json({ success: false, message: 'Ticket not found', code: 'INVALID' }, { status: 404 });
    }

    const ticketData = ticketDoc.data()!;

    // Fetch parent order to ensure payment is valid and not cancelled
    const orderDoc = await adminDb.collection('orders').doc(ticketData.bookingId).get();
    let paymentStatus = 'pending';
    let orderStatus = 'confirmed';
    
    if (orderDoc.exists) {
      const orderData = orderDoc.data()!;
      paymentStatus = orderData.paymentStatus;
      orderStatus = orderData.status;
    }

    // Determine final status
    let finalStatus = ticketData.status;
    if (orderStatus === 'cancelled') finalStatus = 'cancelled';
    if (ticketData.checkedIn) finalStatus = 'used';

    // Strip out any admin/secure fields and send only what's needed for the ticket UI
    const sanitizedTicket = {
      ticketId: ticketData.ticketId,
      bookingId: ticketData.bookingId,
      eventId: ticketData.eventId,
      eventName: ticketData.eventName,
      eventDate: ticketData.eventDate,
      eventEndDate: ticketData.eventEndDate || ticketData.eventDate,
      venue: ticketData.venue,
      eventBanner: ticketData.eventBanner,
      customerName: ticketData.customerName,
      ticketType: ticketData.ticketType,
      status: finalStatus,
      qrValue: ticketData.qrValue, // This is the cryptographic token encoded into the QR
      paymentStatus,
      orderStatus,
      gateId: ticketData.gateId || '',
      gateName: ticketData.gateName || '',
      gateNumber: ticketData.gateNumber || '',
      gateInstructions: ticketData.gateInstructions || '',
      gateRestriction: ticketData.gateRestriction || false,
      entryCount: ticketData.entryCount || ((ticketData.ticketType || '').toLowerCase().includes('couple') || (ticketData.ticketType || '').toLowerCase().includes('pair') ? 2 : 1),
      checkedIn: ticketData.checkedIn || false,
      checkedInAt: ticketData.checkedInAt || ticketData.entryTime || '',
      scannedBy: ticketData.scannedBy || '',
      checkInGateName: ticketData.gateName || '',
    };

    return NextResponse.json({ success: true, ticket: sanitizedTicket });
  } catch (error: any) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
