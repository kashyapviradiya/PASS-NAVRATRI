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
    
    // 4. Fetch ScanLogs for Duplicates
    const scanLogsSnapshot = await adminDb.collection('scanLogs').where('isDuplicateAttempt', '==', true).get();
    const duplicateScanAttempts = scanLogsSnapshot.docs.length;

    // Calculate Stats
    let totalRevenue = 0;
    let todaySales = 0;
    const today = new Date().toISOString().slice(0, 10);

    orders.forEach((o: any) => {
      if (o.paymentStatus === 'paid' || o.paymentStatus === 'demo-paid' || o.paymentStatus === 'success' || o.status === 'confirmed') {
        totalRevenue += o.amount || o.totalAmount || o.grandTotal || 0;
        if (o.createdAt && o.createdAt.startsWith(today)) {
          todaySales += o.amount || o.totalAmount || o.grandTotal || 0;
        }
      }
    });

    let validTickets = 0;
    let scannedTickets = 0;
    let cancelledTickets = 0;

    tickets.forEach((t: any) => {
      const isScanned = t.status === 'used' || t.checkedIn === true || t.isUsed === true;
      const isCancelled = t.status === 'cancelled';
      const isValid = t.status === 'valid' && !isScanned && !isCancelled;

      if (isScanned) scannedTickets++;
      else if (isCancelled) cancelledTickets++;
      else if (isValid) validTickets++;
    });

    const totalTickets = validTickets + scannedTickets + cancelledTickets;
    const checkinPercentage = (validTickets + scannedTickets) > 0 
      ? (scannedTickets / (validTickets + scannedTickets)) * 100 
      : 0;

    const stats = {
      totalEvents: events.length,
      totalTicketsSold: totalTickets,
      totalRevenue,
      todaySales,
      totalCustomers: new Set(orders.map((o: any) => o.mobile || o.customerPhone)).size,
      totalScans: scannedTickets, 
      successfulEntries: scannedTickets,
      validTickets,
      cancelledTickets,
      pendingEntries: validTickets,
      duplicateScanAttempts,
      checkinPercentage: checkinPercentage.toFixed(1)
    };

    return NextResponse.json({ success: true, stats, events, orders, tickets });
  } catch (error: any) {
    console.error('Fetch admin stats error:', error);
    const message = error.message?.includes('FIREBASE_NOT_CONFIGURED') 
      ? 'Database not configured. Please add Firebase keys to .env.local' 
      : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
