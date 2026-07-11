import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'create') {
      return await createDemoSetup();
    } else if (action === 'reset') {
      return await resetDemoData();
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });

  } catch (error: any) {
    console.error('Demo setup error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

async function createDemoSetup() {
  const eventId = 'evt-raaspass-demo-garba';
  
  // 1. Create Demo Event
  const eventRef = adminDb.collection('events').doc(eventId);
  const eventDoc = await eventRef.get();
  
  if (!eventDoc.exists) {
    // Set future date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const startDateStr = futureDate.toISOString().split('T')[0];

    await eventRef.set({
      id: eventId,
      name: 'RaasPass Demo Garba Night',
      slug: 'raaspass-demo-garba-night',
      city: 'Ahmedabad',
      venue: 'RaasPass Demo Arena',
      address: 'SG Highway, Ahmedabad, Gujarat',
      dates: `${startDateStr}`,
      startDate: startDateStr,
      endDate: startDateStr,
      timings: '8:00 PM - 12:00 AM',
      description: 'Experience the complete RaasPass booking and QR entry flow through this demo event.',
      status: 'published',
      isDemo: true,
      organizerId: 'org-demo',
      createdAt: new Date().toISOString()
    });

    // Add Ticket Types
    const passes = [
      { id: 'pass-regular', name: 'Regular Pass', price: 99, originalPrice: 150, totalInventory: 100, sold: 0, available: 100, maxPerUser: 10, enabled: true },
      { id: 'pass-vip', name: 'VIP Pass', price: 199, originalPrice: 250, totalInventory: 50, sold: 0, available: 50, maxPerUser: 10, enabled: true },
      { id: 'pass-couple', name: 'Couple Pass', price: 299, originalPrice: 400, totalInventory: 25, sold: 0, available: 25, maxPerUser: 5, enabled: true }
    ];

    for (const pass of passes) {
      await eventRef.collection('ticketTypes').doc(pass.id).set(pass);
    }
  }

  // 2. Create Demo Organizer
  const orgRef = adminDb.collection('organizers').doc('org-demo');
  if (!(await orgRef.get()).exists) {
    const passwordHash = await bcrypt.hash('organizer123', 10);
    await orgRef.set({
      id: 'org-demo',
      name: 'RaasPass Demo Organizer',
      companyName: 'RaasPass Demo Organizer',
      email: 'organizer@demo.raaspass.local',
      role: 'organizer',
      active: true,
      assignedEventIds: [eventId],
      passwordHash,
      createdAt: new Date().toISOString()
    });
  }

  // 3. Create Demo Scanner Staff
  const staffEmail = process.env.DEMO_SCANNER_EMAIL || 'scanner@demo.raaspass.local';
  const staffPassword = process.env.DEMO_SCANNER_PASSWORD || 'demo-password-123';
  
  const staffSnapshot = await adminDb.collection('staff').where('mobile', '==', staffEmail).get();
  if (staffSnapshot.empty) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(staffPassword, salt);
    await adminDb.collection('staff').add({
      name: 'Demo Scanner',
      mobile: staffEmail, // Using email field as login id for demo ease
      passwordHash,
      role: 'scanner_staff',
      organizerId: 'org-demo',
      assignedEvents: [eventId],
      assignedGates: ['Main Gate'],
      active: true,
      createdAt: new Date().toISOString()
    });
  }

  return NextResponse.json({ success: true, message: 'Demo setup completed' });
}

async function resetDemoData() {
  const eventId = 'evt-raaspass-demo-garba';
  
  // 1. Delete Demo Orders
  const ordersSnap = await adminDb.collection('orders').where('eventId', '==', eventId).get();
  const batch = adminDb.batch();
  ordersSnap.docs.forEach(doc => batch.delete(doc.ref));

  // 2. Delete Demo Tickets
  const ticketsSnap = await adminDb.collection('tickets').where('eventId', '==', eventId).get();
  ticketsSnap.docs.forEach(doc => batch.delete(doc.ref));

  // 3. Delete Demo Checkins
  const checkinsSnap = await adminDb.collection('checkins').where('eventId', '==', eventId).get();
  checkinsSnap.docs.forEach(doc => batch.delete(doc.ref));

  // Execute deletions
  await batch.commit();

  // 4. Reset Inventory
  const eventRef = adminDb.collection('events').doc(eventId);
  const passesSnap = await eventRef.collection('ticketTypes').get();
  
  const invBatch = adminDb.batch();
  passesSnap.docs.forEach(doc => {
    const data = doc.data();
    invBatch.update(doc.ref, {
      sold: 0,
      available: data.totalInventory
    });
  });
  await invBatch.commit();

  return NextResponse.json({ success: true, message: 'Demo data reset successfully' });
}
