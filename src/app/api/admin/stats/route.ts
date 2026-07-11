import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // 1. Fetch Events
    const eventsSnapshot = await adminDb.collection('events').get();
    const events = eventsSnapshot.docs.map(doc => doc.data());
    
    // 2. Fetch Orders
    const ordersSnapshot = await adminDb.collection('orders').get();
    const orders = ordersSnapshot.docs.map(doc => doc.data());

    // 3. Fetch Tickets
    const ticketsSnapshot = await adminDb.collection('tickets').get();
    const tickets = ticketsSnapshot.docs.map(doc => doc.data());
    
    // 4. Fetch Checkins
    const checkinsSnapshot = await adminDb.collection('checkins').get();
    const checkins = checkinsSnapshot.docs.map(doc => doc.data());

    // Calculate Stats
    let totalRevenue = 0;
    let todaySales = 0;
    const today = new Date().toISOString().slice(0, 10);

    orders.forEach((o: any) => {
      if (o.paymentStatus === 'paid' || o.paymentStatus === 'success') {
        totalRevenue += o.amount || 0;
        if (o.createdAt && o.createdAt.startsWith(today)) {
          todaySales += o.amount || 0;
        }
      }
    });

    const successfulEntries = checkins.length;
    const pendingEntries = tickets.length - successfulEntries;

    const stats = {
      totalEvents: events.length,
      totalPassesSold: tickets.length,
      totalRevenue,
      todaySales,
      totalCustomers: new Set(orders.map((o: any) => o.mobile)).size,
      totalScans: successfulEntries, 
      successfulEntries,
      pendingEntries,
      invalidScans: 0,
      duplicateScans: 0,
    };

    return NextResponse.json({ success: true, stats, events, orders, tickets, checkins });
  } catch (error: any) {
    console.error('Fetch admin stats error:', error);
    const message = error.message?.includes('FIREBASE_NOT_CONFIGURED') 
      ? 'Database not configured. Please add Firebase keys to .env.local' 
      : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
