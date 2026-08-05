import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { logAdminAction } from '@/lib/admin-logger';
import crypto from 'crypto';
import { Order, Ticket, TimelineEvent } from '@/types';

export const dynamic = 'force-dynamic';

function generateRandomId(prefix: string) {
  return `${prefix}-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { 
      customerName, mobile, email, city, eventId, 
      ticketTypes, paymentMode, notes, walkIn 
    } = data;

    if (!eventId || !ticketTypes || ticketTypes.length === 0 || !customerName || !mobile) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const eventRef = adminDb.collection('events').doc(eventId);
    const eventDoc = await eventRef.get();
    if (!eventDoc.exists) {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
    }

    const eventData = eventDoc.data()!;
    let totalAmount = 0;
    let ticketCount = 0;
    const finalBookingPasses: any[] = [];
    const generatedTickets: Ticket[] = [];

    // Process inventory
    let updatedTicketTypes = [...(eventData.ticketTypes || [])];
    
    for (const requestedPass of ticketTypes) {
      const passIndex = updatedTicketTypes.findIndex((t: any) => t.id === requestedPass.ticketTypeId);
      if (passIndex === -1) {
        return NextResponse.json({ success: false, message: `Ticket type ${requestedPass.ticketTypeId} not found` }, { status: 400 });
      }

      const available = updatedTicketTypes[passIndex].remainingQuantity;
      if (available < requestedPass.quantity) {
        return NextResponse.json({ success: false, message: `Not enough inventory for ${updatedTicketTypes[passIndex].name}` }, { status: 400 });
      }

      const subtotal = requestedPass.quantity * updatedTicketTypes[passIndex].price;
      totalAmount += subtotal;
      ticketCount += requestedPass.quantity;

      finalBookingPasses.push({
        ticketTypeId: updatedTicketTypes[passIndex].id,
        ticketTypeName: updatedTicketTypes[passIndex].name,
        quantity: requestedPass.quantity,
        unitPrice: updatedTicketTypes[passIndex].price,
        subtotal
      });

      // Update inventory locally before batch
      updatedTicketTypes[passIndex] = {
        ...updatedTicketTypes[passIndex],
        remainingQuantity: available - requestedPass.quantity,
        soldQuantity: (updatedTicketTypes[passIndex].soldQuantity || 0) + requestedPass.quantity
      };
    }

    const orderId = `RP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const timeline: TimelineEvent[] = [
      { action: 'Booking Created (Manual)', date: new Date().toISOString(), actor: 'Super Admin' }
    ];

    if (paymentMode !== 'unpaid') {
      timeline.push({ action: `Marked as Paid (${paymentMode})`, date: new Date().toISOString(), actor: 'Super Admin' });
    }

    const newOrder: Order = {
      id: orderId,
      eventId,
      customerName,
      mobile,
      email: email || '',
      city: city || '',
      amount: totalAmount,
      paymentStatus: paymentMode === 'unpaid' ? 'pending' : 'paid',
      ticketCount,
      ticketTypes: finalBookingPasses,
      paymentMode,
      status: 'confirmed',
      notes: notes || '',
      timeline,
      createdAt: new Date().toISOString()
    };

    // Generate tickets
    for (const pass of finalBookingPasses) {
      for (let i = 0; i < pass.quantity; i++) {
        const ticketId = generateRandomId('TK');
        const secureToken = crypto.randomBytes(16).toString('hex');
        
        generatedTickets.push({
          ticketId,
          bookingId: orderId,
          eventId,
          eventName: eventData.title,
          eventDate: eventData.startDate,
          venue: `${eventData.venue}, ${eventData.city}`,
          eventBanner: eventData.bannerImage,
          customerName,
          mobile,
          email: email || '',
          ticketType: pass.ticketTypeName,
          status: walkIn ? 'used' : 'valid',
          checkedIn: walkIn,
          qrValue: secureToken,
          createdAt: new Date().toISOString()
        });
      }
    }

    if (walkIn) {
      newOrder.timeline?.push({ action: 'Walk-in Check-in Auto-applied', date: new Date().toISOString(), actor: 'Super Admin' });
    }

    // Atomic batch write
    const batch = adminDb.batch();
    
    // Save Order
    batch.set(adminDb.collection('orders').doc(orderId), newOrder);
    
    // Save Tickets
    generatedTickets.forEach(ticket => {
      batch.set(adminDb.collection('tickets').doc(ticket.ticketId), ticket);
    });

    // Update Event
    batch.update(eventRef, {
      ticketTypes: updatedTicketTypes,
      totalTicketsSold: (eventData.totalTicketsSold || 0) + ticketCount,
      totalRevenue: (eventData.totalRevenue || 0) + totalAmount
    });

    await batch.commit();

    // Log Action
    await logAdminAction(
      'manual_booking_created', 
      orderId, 
      'booking', 
      `Created manual booking for ${customerName} (${ticketCount} tickets, Walk-in: ${walkIn})`
    );

    return NextResponse.json({ success: true, orderId });
  } catch (error: any) {
    console.error('Manual booking error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
