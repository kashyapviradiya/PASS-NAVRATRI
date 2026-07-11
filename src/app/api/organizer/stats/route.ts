import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifySession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const session = await verifySession(token);
    if (!session || session.role !== 'organizer') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    // Fetch organizer profile to get assignedEventIds
    const orgDoc = await adminDb.collection('organizers').doc(session.id).get();
    if (!orgDoc.exists) return NextResponse.json({ success: false, message: 'Organizer not found' }, { status: 404 });
    const orgData = orgDoc.data();
    const assignedEventIds: string[] = orgData?.assignedEventIds || [];

    if (assignedEventIds.length === 0) {
      return NextResponse.json({
        success: true,
        stats: { totalRevenue: 0, ticketsSold: 0, remainingInventory: 0, totalCheckins: 0, todaySales: 0 }
      });
    }

    let totalRevenue = 0;
    let ticketsSold = 0;
    let remainingInventory = 0;
    let totalCheckins = 0;
    let todaySales = 0;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Using Promise.all to fetch stats for all assigned events concurrently
    await Promise.all(assignedEventIds.map(async (eventId) => {
      // 1. Tickets (sold & inventory)
      const ticketsSnapshot = await adminDb.collection('events').doc(eventId).collection('ticketTypes').get();
      ticketsSnapshot.docs.forEach(doc => {
        const type = doc.data();
        ticketsSold += (type.sold || 0);
        remainingInventory += (type.totalInventory - (type.sold || 0));
      });

      // 2. Revenue from Orders (Only paid orders)
      const ordersSnapshot = await adminDb.collection('orders')
        .where('eventId', '==', eventId)
        .where('paymentStatus', '==', 'paid')
        .get();

      ordersSnapshot.docs.forEach(doc => {
        const order = doc.data();
        totalRevenue += order.amount || 0;
        
        const orderDate = order.createdAt ? new Date(order.createdAt) : new Date(0);
        if (orderDate >= todayStart) {
          todaySales += order.amount || 0;
        }
      });

      // 3. Check-ins
      const checkinsSnapshot = await adminDb.collection('checkins')
        .where('eventId', '==', eventId)
        .get();
      totalCheckins += checkinsSnapshot.size;
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        ticketsSold,
        remainingInventory,
        totalCheckins,
        todaySales
      }
    });

  } catch (error: any) {
    console.error('Organizer stats error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
