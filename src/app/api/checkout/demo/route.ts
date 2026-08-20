import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { generateSignature } from '@/lib/crypto';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { eventId, ticketTypes, customer, paymentMode } = data;

    if (!eventId || !ticketTypes || !customer) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // Generate IDs
    const bookingId = `RP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderId = `ord-${uuidv4()}`;

    let totalAmount = 0;
    const ticketDocsToCreate: any[] = [];
    const passesSummary: any[] = [];

    // Run Firestore Transaction
    await adminDb.runTransaction(async (transaction) => {
      const eventRef = adminDb.collection('events').doc(eventId);
      const eventDoc = await transaction.get(eventRef);

      if (!eventDoc.exists) {
        throw new Error('Event not found');
      }

      const eventData = eventDoc.data()!;
      if (eventData.status !== 'published') {
        throw new Error('Event is not published');
      }

      let updatedTicketTypes = [...(eventData.ticketTypes || [])];

      // Check each requested ticket type
      for (const passId of Object.keys(ticketTypes)) {
        const qty = ticketTypes[passId];
        if (qty <= 0) continue;

        const passIndex = updatedTicketTypes.findIndex((t: any) => t.id === passId);
        if (passIndex === -1) {
          throw new Error(`Ticket type ${passId} not found`);
        }

        const passData = updatedTicketTypes[passIndex];

        if (passData.status !== 'available') {
          throw new Error(`Ticket type ${passData.name} is currently not available`);
        }

        if (passData.remainingQuantity < qty) {
          throw new Error(`Insufficient inventory for ${passData.name}. Only ${passData.remainingQuantity} left.`);
        }

        // Add to total
        totalAmount += passData.price * qty;
        passesSummary.push({
          ticketTypeId: passId,
          ticketTypeName: passData.name,
          quantity: qty,
          unitPrice: passData.price,
          subtotal: passData.price * qty,
          gateRestriction: passData.gateRestriction,
          gateId: passData.gateId,
          gateName: passData.gateName,
          entryCount: passData.entryCount
        });

        // Update inventory in array
        updatedTicketTypes[passIndex] = {
          ...passData,
          remainingQuantity: passData.remainingQuantity - qty,
          soldQuantity: (passData.soldQuantity || 0) + qty
        };

        // Prepare ticket documents
        for (let i = 0; i < qty; i++) {
          const ticketId = `RPT-2026-${Math.floor(10000000 + Math.random() * 90000000)}`;
          
          const qrPayload = JSON.stringify({
            v: 1,
            ticketId,
            eventId,
            nonce: uuidv4().substring(0, 8)
          });
          const signature = generateSignature(qrPayload);
          
          const finalQrValue = JSON.stringify({ p: qrPayload, s: signature });

          ticketDocsToCreate.push({
            ticketId,
            bookingId,
            orderId,
            eventId,
            eventTitle: eventData.title,
            customerName: customer.name,
            mobile: customer.phone,
            email: customer.email,
            ticketTypeId: passId,
            ticketTypeName: passData.name,
            gateRestriction: passData.gateRestriction || false,
            gateId: passData.gateId || null,
            gateName: passData.gateName || null,
            entryCount: passData.entryCount || 1,
            status: 'valid',
            qrValue: finalQrValue,
            demo: true,
            checkedIn: false,
            createdAt: new Date().toISOString()
          });
        }
      }

      // Update event document ticketTypes array
      transaction.update(eventRef, { ticketTypes: updatedTicketTypes });

      // We apply a 4% convenience fee in this system
      const convenienceFee = Math.round(totalAmount * 0.04);
      const grandTotal = totalAmount + convenienceFee;

      // Create Order document
      const orderRef = adminDb.collection('orders').doc(orderId);
      transaction.set(orderRef, {
        id: orderId,
        bookingId,
        eventId,
        eventTitle: eventData.title,
        organizerId: eventData.organizerId || null,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        customerCity: customer.city,
        ticketTypes: passesSummary,
        totalAmount,
        convenienceFee,
        grandTotal,
        paymentMode: paymentMode || 'demo',
        paymentStatus: 'paid',
        bookingStatus: 'confirmed',
        demo: true,
        createdAt: new Date().toISOString()
      });

      // Create Ticket documents
      for (const ticket of ticketDocsToCreate) {
        const tRef = adminDb.collection('tickets').doc(ticket.ticketId);
        transaction.set(tRef, ticket);
      }
      
      // Update Event overall stats (optional, but good for dashboard)
      const totalTicketsInThisOrder = ticketDocsToCreate.length;
      transaction.update(eventRef, {
        totalTicketsSold: (eventData.totalTicketsSold || 0) + totalTicketsInThisOrder,
        totalRevenue: (eventData.totalRevenue || 0) + grandTotal
      });
    });

    return NextResponse.json({ success: true, bookingId });

  } catch (error: any) {
    console.error('Demo booking error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
