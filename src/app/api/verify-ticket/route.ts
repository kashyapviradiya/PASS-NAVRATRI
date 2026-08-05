import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { Ticket } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { ticketId, token } = await request.json();

    console.log(`[Scanner API] Verification requested for ticketId: ${ticketId}`);

    if (!ticketId || !token) {
      return NextResponse.json({ success: false, status: 'invalid', message: 'Invalid QR Code payload.' }, { status: 400 });
    }

    const ticketRef = adminDb.collection('tickets').doc(ticketId);
    const ticketDoc = await ticketRef.get();

    if (!ticketDoc.exists) {
      console.log(`[Scanner API] Ticket not found: ${ticketId}`);
      return NextResponse.json({ success: false, status: 'invalid', message: 'TICKET_NOT_FOUND' }, { status: 404 });
    }

    const ticket = ticketDoc.data() as Ticket;
    
    console.log(`[Scanner API] Matched Ticket: id=${ticket.ticketId}, bookingId=${ticket.bookingId}, status=${ticket.status}, checkedIn=${ticket.checkedIn}, demo=${ticket.demo}`);

    // Verify Booking/Order status
    let orderDoc = await adminDb.collection('orders').doc(ticket.bookingId).get();
    
    // If order not found by bookingId, try by orderId if the ticket has it (Demo fallback)
    if (!orderDoc.exists && (ticket as any).orderId) {
      orderDoc = await adminDb.collection('orders').doc((ticket as any).orderId).get();
    }

    if (orderDoc.exists) {
      const order = orderDoc.data() as any;
      
      // Some orders might only use paymentStatus. If paymentStatus is paid, we consider it confirmed.
      const isConfirmed = order.status === 'confirmed' || order.bookingStatus === 'confirmed' || order.paymentStatus === 'paid' || order.paymentStatus === 'demo-paid';
      
      if (!isConfirmed) {
         console.log(`[Scanner API] Order not confirmed: ${ticket.bookingId}`);
         return NextResponse.json({ success: false, status: 'invalid', message: 'BOOKING_NOT_CONFIRMED' }, { status: 403 });
      }
      
      if (order.paymentStatus !== 'paid' && order.paymentStatus !== 'demo-paid') {
         console.log(`[Scanner API] Order not paid: ${ticket.bookingId} - ${order.paymentStatus}`);
         return NextResponse.json({ success: false, status: 'invalid', message: 'PAYMENT_NOT_PAID' }, { status: 403 });
      }
    }

    let isValidToken = false;
    
    if (!token || token === ticketId) {
      isValidToken = true;
    } else {
      try {
        const parsedQr = JSON.parse(ticket.qrValue);
        if (parsedQr.token === token) {
          isValidToken = true;
        } else if (parsedQr.s === token) {
          // Demo Format
          isValidToken = true;
        }
      } catch {
        if (ticket.qrValue === token) {
          isValidToken = true;
        }
      }
    }

    if (!isValidToken && (ticket as any).secureToken && (ticket as any).secureToken === token) {
      isValidToken = true;
    }

    if (!isValidToken) {
      console.log(`[Scanner API] Invalid signature for ticket: ${ticketId}`);
      return NextResponse.json({ success: false, status: 'invalid', message: 'INVALID_SIGNATURE' }, { status: 403 });
    }

    if (ticket.status === 'cancelled') {
      return NextResponse.json({ success: false, status: 'cancelled', message: 'CANCELLED' }, { status: 403 });
    }

    if (ticket.checkedIn || (ticket as any).isUsed) {
      // Async log duplicate scan attempt without blocking the response
      adminDb.collection('scanLogs').add({
          ticketId,
          eventId: ticket.eventId,
          result: 'already_used',
          scannedBy: 'scanner-verify',
          scannedAt: new Date().toISOString(),
          gateName: 'verification-check',
          isDuplicateAttempt: true
      }).catch(console.error);

      return NextResponse.json({ 
        success: false, 
        status: 'already_used', 
        message: `Duplicate Scan - Ticket Already Used at ${new Date(ticket.checkedInAt || (ticket as any).entryTime || Date.now()).toLocaleString()} by ${ticket.scannedBy || 'unknown staff'} at ${ticket.gateName || 'unknown gate'}`, 
        ticket 
      }, { status: 200 });
    }

    return NextResponse.json({ success: true, status: 'valid', message: 'Ticket is valid.', ticket });
  } catch (error: any) {
    console.error('Verify ticket error:', error);
    return NextResponse.json({ success: false, status: 'invalid', message: 'Internal server error' }, { status: 500 });
  }
}
