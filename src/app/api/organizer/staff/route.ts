import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifySession } from '@/lib/session';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const session = await verifySession(token);
    if (!session || session.role !== 'organizer') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const orgDoc = await adminDb.collection('organizers').doc(session.id).get();
    if (!orgDoc.exists) return NextResponse.json({ success: false, message: 'Organizer not found' }, { status: 404 });
    const assignedEventIds: string[] = orgDoc.data()?.assignedEventIds || [];

    if (assignedEventIds.length === 0) {
      return NextResponse.json({ success: true, staff: [] });
    }

    // A simple query: we fetch staff whose organizerId matches this organizer
    const snapshot = await adminDb.collection('staff')
      .where('organizerId', '==', session.id)
      .orderBy('createdAt', 'desc')
      .get();
    
    const staff = snapshot.docs.map(doc => {
      const data = doc.data();
      delete data.passwordHash; // Never send password hash to client
      return { id: doc.id, ...data };
    });

    return NextResponse.json({ success: true, staff });

  } catch (error: any) {
    console.error('Organizer staff fetch error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const session = await verifySession(token);
    if (!session || session.role !== 'organizer') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const orgDoc = await adminDb.collection('organizers').doc(session.id).get();
    if (!orgDoc.exists) return NextResponse.json({ success: false, message: 'Organizer not found' }, { status: 404 });
    const assignedEventIds: string[] = orgDoc.data()?.assignedEventIds || [];

    const { name, mobile, password, assignedEvents, assignedGates } = await request.json();

    if (!name || !mobile || !password || !assignedEvents || !assignedGates) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // Verify the organizer is only assigning staff to their own events
    for (const evId of assignedEvents) {
      if (!assignedEventIds.includes(evId)) {
        return NextResponse.json({ success: false, message: `Forbidden: Cannot assign staff to event ${evId}` }, { status: 403 });
      }
    }

    // Check if mobile is already used
    const existing = await adminDb.collection('staff').where('mobile', '==', mobile).get();
    if (!existing.empty) {
      return NextResponse.json({ success: false, message: 'Mobile number already registered for a staff member' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newStaff = {
      name,
      mobile,
      passwordHash,
      role: 'scanner_staff',
      organizerId: session.id,
      assignedEvents,
      assignedGates,
      active: true,
      createdAt: new Date().toISOString()
    };

    const docRef = await adminDb.collection('staff').add(newStaff);

    // Create audit log
    await adminDb.collection('auditLogs').add({
      organizerId: session.id,
      action: 'STAFF_ADDED',
      details: `Added staff ${name} to gates: ${assignedGates.join(', ')}`,
      timestamp: newStaff.createdAt
    });

    return NextResponse.json({ 
      success: true, 
      staff: {
        id: docRef.id,
        name,
        mobile,
        role: 'scanner_staff',
        organizerId: session.id,
        assignedEvents,
        assignedGates,
        active: true,
        createdAt: newStaff.createdAt
      }
    });

  } catch (error: any) {
    console.error('Organizer staff create error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
