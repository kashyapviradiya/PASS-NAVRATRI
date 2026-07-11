import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { DEMO_EVENTS, DEMO_BOOKINGS, DEMO_TICKETS, DEMO_SCAN_LOGS } from '@/lib/demo-data';

export async function POST(req: Request) {
  try {
    if (process.env.DEMO_MODE !== 'true') {
      return NextResponse.json({ success: false, message: 'Seeding only allowed in DEMO_MODE' }, { status: 403 });
    }

    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer seed_secret_123`) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const batch = adminDb.batch();

    // Seed Events
    for (const event of DEMO_EVENTS) {
      const eventRef = adminDb.collection('events').doc(event.id);
      batch.set(eventRef, { ...event, createdAt: adminDb.collection('events').doc().id ? new Date().toISOString() : event.createdAt });
    }

    // Seed Bookings
    for (const booking of DEMO_BOOKINGS) {
      const bookingRef = adminDb.collection('bookings').doc(booking.id);
      batch.set(bookingRef, booking);
    }

    // Seed Tickets
    for (const ticket of DEMO_TICKETS) {
      const ticketRef = adminDb.collection('tickets').doc(ticket.id);
      batch.set(ticketRef, ticket);
    }

    // Seed Scan Logs
    for (const log of DEMO_SCAN_LOGS) {
      const logRef = adminDb.collection('scanLogs').doc(log.id);
      batch.set(logRef, log);
    }

    // Add a demo Admin
    const adminRef = adminDb.collection('admins').doc('admin_123');
    batch.set(adminRef, {
      email: 'admin@passnavratri.com',
      role: 'admin',
      active: true,
      createdAt: new Date().toISOString()
    });

    // Add a demo Staff
    const staffRef = adminDb.collection('staff').doc('staff_5678');
    batch.set(staffRef, {
      email: 'staff@passnavratri.com',
      role: 'scanner_staff',
      pin: '5678',
      assignedEvents: DEMO_EVENTS.map(e => e.id),
      active: true,
      createdAt: new Date().toISOString()
    });

    await batch.commit();

    return NextResponse.json({ success: true, message: 'Database seeded successfully' });
  } catch (error: any) {
    console.error('Seed Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
