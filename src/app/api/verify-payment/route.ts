import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { generateSecureToken, generateTicketId } from '@/lib/utils';
import { Order, Ticket, BookingPass } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
      eventId,
      customerName,
      customerPhone,
      customerEmail,
      customerCity,
      passes,
      totalAmount,
    } = body;

    const isDemoMock = process.env.DEMO_MODE === 'true' && razorpay_order_id?.startsWith('order_mock_');

    if (!isDemoMock) {
      // Verify signature
      if (!razorpay_signature || !verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
        return NextResponse.json({ success: false, message: 'Invalid payment signature' }, { status: 400 });
      }
    }

    // Run a Firestore Transaction to ensure inventory is available and booking is atomic
    const result = await adminDb.runTransaction(async (transaction) => {
      // 1. Prevent duplicate order processing
      const orderRef = adminDb.collection('orders').doc(bookingId);
      const orderDoc = await transaction.get(orderRef);
      if (orderDoc.exists && orderDoc.data()?.paymentStatus === 'paid') {
        throw new Error('Order already exists and is confirmed.');
      }

      // 2. Fetch event to verify inventory
      const eventRef = adminDb.collection('events').doc(eventId);
      const eventDoc = await transaction.get(eventRef);
      if (!eventDoc.exists) {
        throw new Error('Event not found');
      }

      const eventData = eventDoc.data()!;
      let updatedTicketTypes = [...(eventData.ticketTypes || [])];
      let totalTicketCount = 0;

      // 3. Verify and deduct inventory
      for (const reqPass of passes as BookingPass[]) {
        const passIndex = updatedTicketTypes.findIndex(p => p.id === reqPass.passTypeId);
        if (passIndex === -1) throw new Error(`Pass type ${reqPass.passName} not found`);
        
        const dbPass = updatedTicketTypes[passIndex];
        if (dbPass.remainingQuantity < reqPass.quantity) {
          throw new Error(`Insufficient inventory for ${reqPass.passName}. Only ${dbPass.remainingQuantity} left.`);
        }

        // Deduct inventory
        updatedTicketTypes[passIndex] = {
          ...dbPass,
          remainingQuantity: dbPass.remainingQuantity - reqPass.quantity,
          soldQuantity: (dbPass.soldQuantity || 0) + reqPass.quantity
        };
        totalTicketCount += reqPass.quantity;
      }

      // 4. Update Event Document Inventory
      transaction.update(eventRef, { ticketTypes: updatedTicketTypes });

      // 5. Create Order Document
      const order: Order = {
        id: bookingId,
        eventId,
        customerName,
        mobile: customerPhone,
        email: customerEmail,
        city: customerCity,
        amount: totalAmount,
        paymentStatus: 'paid',
        ticketCount: totalTicketCount,
        passes,
        razorpayOrderId: razorpay_order_id || `order_mock_${Date.now()}`,
        razorpayPaymentId: razorpay_payment_id || `pay_mock_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      transaction.set(orderRef, order);

      // 6. Generate Individual Tickets
      const generatedTickets: Ticket[] = [];
      for (const pass of passes as BookingPass[]) {
        for (let i = 0; i < pass.quantity; i++) {
          const ticketId = generateTicketId();
          const qrValue = generateSecureToken();
          const ticketRef = adminDb.collection('tickets').doc(ticketId);
          
          const ticket: Ticket = {
            ticketId,
            bookingId: order.id,
            eventId,
            eventName: eventData.title,
            eventDate: eventData.startDate,
            venue: eventData.venue,
            eventBanner: eventData.bannerImage || '',
            customerName,
            mobile: customerPhone,
            email: customerEmail,
            ticketType: pass.passName,
            status: 'valid',
            checkedIn: false,
            qrValue,
            createdAt: new Date().toISOString(),
          };
          transaction.set(ticketRef, ticket);
          generatedTickets.push(ticket);
        }
      }

      return { order, tickets: generatedTickets };
    });

    return NextResponse.json({
      success: true,
      order: result.order,
      tickets: result.tickets,
      message: `${result.tickets.length} ticket(s) generated successfully!`,
    });
  } catch (error: any) {
    console.error('Verify payment error:', error);
    if (error.message.includes('Order already exists')) {
      return NextResponse.json({ success: false, message: 'Order already processed.' }, { status: 409 });
    }
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}
