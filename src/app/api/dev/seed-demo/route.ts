import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import bcrypt from 'bcryptjs';

export async function GET() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') {
    return NextResponse.json({ message: 'Demo mode is not enabled' }, { status: 403 });
  }

  try {
    const batch = adminDb.batch();

    // 1. Seed Demo Scanner Staff
    const staffEmail = 'staff@royalevents.com';
    const scannerStaffRef = adminDb.collection('staff').doc('demo-scanner');
    
    batch.set(scannerStaffRef, {
      id: 'demo-scanner',
      name: 'Demo Scanner',
      email: staffEmail,
      mobile: '9999999999',
      passwordHash: await bcrypt.hash('scanner123', 10),
      role: 'scanner_staff',
      active: true,
      assignedGates: ['VIP Gate', 'Main Entry'],
      assignedEvents: ['demo-event-1'], // Will be created below
      createdAt: new Date().toISOString()
    });

    // 2. Seed Organizer (if not exists from previous steps)
    const organizerEmail = 'organizer@royalevents.com';
    const organizerRef = adminDb.collection('organizers').doc('demo-organizer');
    
    batch.set(organizerRef, {
      id: 'demo-organizer',
      name: 'Royal Events Ltd',
      email: organizerEmail,
      phone: '8888888888',
      passwordHash: await bcrypt.hash('organizer123', 10),
      role: 'organizer',
      active: true,
      status: 'active',
      createdAt: new Date().toISOString()
    });

    // 3. Seed Demo Event
    const eventRef = adminDb.collection('events').doc('demo-event-1');
    const eventData = {
      id: 'demo-event-1',
      title: 'Royal Garba Navratri 2026',
      slug: 'royal-garba-2026',
      organizerId: 'demo-organizer',
      organizerName: 'Royal Events Ltd',
      status: 'published',
      startDate: '2026-10-10T19:00:00.000Z',
      endDate: '2026-10-10T23:59:59.000Z',
      venue: 'Sardar Patel Stadium',
      city: 'Ahmedabad',
      address: 'Navrangpura, Ahmedabad, Gujarat 380014',
      description: 'Experience the most premium Garba night in Ahmedabad with live celebrity singers and massive prizes.',
      bannerImage: 'https://images.unsplash.com/photo-1540039155733-d7696d4eb98e?q=80&w=1974&auto=format&fit=crop',
      createdAt: new Date().toISOString()
    };
    batch.set(eventRef, eventData);

    // Seed Event Ticket Types (passes)
    const pass1Ref = eventRef.collection('ticketTypes').doc('pass-regular');
    batch.set(pass1Ref, {
      id: 'pass-regular',
      name: 'Regular Entry',
      price: 499,
      total: 1000,
      available: 1000,
      sold: 0,
      enabled: true
    });

    const pass2Ref = eventRef.collection('ticketTypes').doc('pass-vip');
    batch.set(pass2Ref, {
      id: 'pass-vip',
      name: 'VIP Entry',
      price: 1499,
      total: 200,
      available: 200,
      sold: 0,
      enabled: true
    });

    await batch.commit();

    return NextResponse.json({ 
      success: true, 
      message: 'Demo data seeded successfully!',
      credentials: {
        scanner: { email: staffEmail, password: 'scanner123' },
        organizer: { email: organizerEmail, password: 'organizer123' }
      },
      eventId: 'demo-event-1'
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
