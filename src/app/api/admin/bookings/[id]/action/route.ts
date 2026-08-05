import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { logAdminAction } from '@/lib/admin-logger';
import { TimelineEvent } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { action } = body;

    const orderRef = adminDb.collection('orders').doc(id);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
    }

    const orderData = orderDoc.data()!;
    let currentTimeline: TimelineEvent[] = orderData.timeline || [];

    if (action === 'delete') {
      const batch = adminDb.batch();
      batch.delete(orderRef);
      
      const ticketsSnapshot = await adminDb.collection('tickets').where('bookingId', '==', id).get();
      ticketsSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      const eventRef = adminDb.collection('events').doc(orderData.eventId);
      const eventDoc = await eventRef.get();
      if (eventDoc.exists) {
        const eventData = eventDoc.data()!;
        let updatedTicketTypes = [...(eventData.ticketTypes || [])];
        for (const pass of (orderData.ticketTypes || [])) {
          const passIndex = updatedTicketTypes.findIndex((t: any) => t.id === pass.ticketTypeId);
          if (passIndex !== -1) {
            updatedTicketTypes[passIndex] = {
              ...updatedTicketTypes[passIndex],
              remainingQuantity: updatedTicketTypes[passIndex].remainingQuantity + pass.quantity,
              soldQuantity: Math.max(0, updatedTicketTypes[passIndex].soldQuantity - pass.quantity)
            };
          }
        }
        batch.update(eventRef, {
          ticketTypes: updatedTicketTypes,
          totalTicketsSold: Math.max(0, (eventData.totalTicketsSold || 0) - (orderData.ticketCount || 0)),
          totalRevenue: Math.max(0, (eventData.totalRevenue || 0) - (orderData.grandTotal || orderData.amount || 0))
        });
      }

      await batch.commit();
      await logAdminAction('delete_booking', id, 'booking', `Deleted booking for ${orderData.customerName}`);
      return NextResponse.json({ success: true, message: 'Booking deleted successfully' });
    }

    if (action === 'cancel') {
      const batch = adminDb.batch();
      const newTimelineEvent: TimelineEvent = { action: 'Cancelled Booking', date: new Date().toISOString(), actor: 'Super Admin' };
      
      batch.update(orderRef, { status: 'cancelled', timeline: [...currentTimeline, newTimelineEvent] });
      
      const ticketsSnapshot = await adminDb.collection('tickets').where('bookingId', '==', id).get();
      ticketsSnapshot.forEach(doc => {
        batch.update(doc.ref, { status: 'cancelled' });
      });

      const eventRef = adminDb.collection('events').doc(orderData.eventId);
      const eventDoc = await eventRef.get();
      if (eventDoc.exists) {
        const eventData = eventDoc.data()!;
        let updatedTicketTypes = [...(eventData.ticketTypes || [])];
        for (const pass of (orderData.ticketTypes || [])) {
          const passIndex = updatedTicketTypes.findIndex((t: any) => t.id === pass.ticketTypeId);
          if (passIndex !== -1) {
            updatedTicketTypes[passIndex] = {
              ...updatedTicketTypes[passIndex],
              remainingQuantity: updatedTicketTypes[passIndex].remainingQuantity + pass.quantity,
              soldQuantity: Math.max(0, updatedTicketTypes[passIndex].soldQuantity - pass.quantity)
            };
          }
        }
        batch.update(eventRef, {
          ticketTypes: updatedTicketTypes,
          totalTicketsSold: Math.max(0, (eventData.totalTicketsSold || 0) - (orderData.ticketCount || 0)),
          totalRevenue: Math.max(0, (eventData.totalRevenue || 0) - (orderData.grandTotal || orderData.amount || 0))
        });
      }

      await batch.commit();
      await logAdminAction('cancel_booking', id, 'booking', `Cancelled booking for ${orderData.customerName}`);
      return NextResponse.json({ success: true, message: 'Booking cancelled and inventory restored' });
    }

    if (action === 'confirm') {
      const newTimelineEvent: TimelineEvent = { action: 'Confirmed Booking', date: new Date().toISOString(), actor: 'Super Admin' };
      await orderRef.update({ status: 'confirmed', timeline: [...currentTimeline, newTimelineEvent] });
      await logAdminAction('confirm_booking', id, 'booking', `Manually confirmed booking`);
      return NextResponse.json({ success: true, message: 'Booking confirmed' });
    }

    if (action === 'mark_paid') {
      const newTimelineEvent: TimelineEvent = { action: 'Marked as Paid', date: new Date().toISOString(), actor: 'Super Admin' };
      await orderRef.update({ paymentStatus: 'paid', timeline: [...currentTimeline, newTimelineEvent] });
      await logAdminAction('mark_paid', id, 'booking', `Marked booking as paid`);
      return NextResponse.json({ success: true, message: 'Marked as paid' });
    }

    if (action === 'mark_unpaid') {
      const newTimelineEvent: TimelineEvent = { action: 'Marked as Unpaid', date: new Date().toISOString(), actor: 'Super Admin' };
      await orderRef.update({ paymentStatus: 'pending', timeline: [...currentTimeline, newTimelineEvent] });
      await logAdminAction('mark_unpaid', id, 'booking', `Marked booking as unpaid`);
      return NextResponse.json({ success: true, message: 'Marked as unpaid' });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error processing booking action:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
