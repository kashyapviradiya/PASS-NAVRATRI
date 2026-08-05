import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const eventsSnap = await adminDb.collection('events').get();
    const ordersSnap = await adminDb.collection('orders').get();
    const ticketsSnap = await adminDb.collection('tickets').get();

    const events = eventsSnap.docs.map(d => d.data());
    const orders = ordersSnap.docs.map(d => d.data());
    const tickets = ticketsSnap.docs.map(d => d.data());

    // Basic Aggregation
    const totalEvents = events.length;
    let totalRevenue = 0;
    let todaySales = 0;
    let todayBookings = 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    orders.forEach(order => {
      if (order.paymentStatus === 'paid' || order.status === 'confirmed') {
        const orderAmount = order.amount || order.totalAmount || order.grandTotal || 0;
        totalRevenue += orderAmount;
        
        const orderDate = new Date(order.createdAt);
        if (orderDate >= today) {
          todaySales += orderAmount;
          todayBookings++;
        }
      }
    });

    const totalTicketsSold = tickets.length;
    const entriesDone = tickets.filter(t => t.status === 'used' || t.checkedIn).length;
    
    let totalInventory = 0;
    events.forEach(event => {
      (event.ticketTypes || []).forEach((tt: any) => {
        totalInventory += (tt.totalInventory || 0);
      });
    });
    const remainingTickets = Math.max(0, totalInventory - totalTicketsSold);

    return NextResponse.json({
      success: true,
      stats: {
        totalEvents,
        totalRevenue,
        todaySales,
        totalTicketsSold,
        entriesDone,
        totalBookings: orders.length,
        todayBookings,
        remainingTickets
      },
      events,
      bookings: orders,
      tickets
    });

  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
