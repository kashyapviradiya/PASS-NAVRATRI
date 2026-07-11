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
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    orders.forEach(order => {
      if (order.status === 'confirmed') {
        totalRevenue += order.totalAmount || order.grandTotal || 0;
        
        const orderDate = new Date(order.createdAt);
        if (orderDate >= today) {
          todaySales += order.totalAmount || order.grandTotal || 0;
        }
      }
    });

    const totalPassesSold = tickets.length;
    const entriesDone = tickets.filter(t => t.status === 'used' || t.isUsed).length;

    return NextResponse.json({
      success: true,
      stats: {
        totalEvents,
        totalRevenue,
        todaySales,
        totalPassesSold,
        entriesDone
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
