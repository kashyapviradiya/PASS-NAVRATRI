import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import bcrypt from 'bcryptjs';

// GET - List all organizers
export async function GET() {
  try {
    const snapshot = await adminDb.collection('organizers').orderBy('createdAt', 'desc').get();
    const organizers = snapshot.docs.map(doc => {
      const data = doc.data();
      // Never return passwordHash to frontend, but return plainPassword for admin
      const { passwordHash, ...safe } = data;
      return { ...safe, id: doc.id };
    });

    return NextResponse.json({ success: true, organizers });
  } catch (error: any) {
    console.error('Fetch organizers error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST - Create a new organizer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, companyName, mobile, assignedEventIds, permissions } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: 'Name, email and password are required' }, { status: 400 });
    }

    // Check if organizer email already exists
    const existing = await adminDb.collection('organizers').where('email', '==', email.toLowerCase()).limit(1).get();
    if (!existing.empty) {
      return NextResponse.json({ success: false, message: 'An organizer with this email already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const orgId = `org-${Date.now()}`;

    const organizer = {
      id: orgId,
      name,
      companyName: companyName || '',
      email: email.toLowerCase(),
      mobile: mobile || '',
      role: 'organizer',
      active: true,
      assignedEventIds: assignedEventIds || [],
      permissions: permissions || {
        canViewBookings: true,
        canManageStaff: true,
        canManageGates: true,
        canExportReports: true,
        canViewAnalytics: true,
        canEditInventory: false
      },
      passwordHash,
      plainPassword: password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await adminDb.collection('organizers').doc(orgId).set(organizer);

    // Link the organizer to the assigned events
    if (assignedEventIds && assignedEventIds.length > 0) {
      const batch = adminDb.batch();
      for (const eventId of assignedEventIds) {
        const eventRef = adminDb.collection('events').doc(eventId);
        const eventDoc = await eventRef.get();
        if (eventDoc.exists) {
          const eventData = eventDoc.data()!;
          const existingOrgIds = eventData.organizerIds || [];
          if (!existingOrgIds.includes(orgId)) {
            batch.update(eventRef, {
              organizerId: orgId,
              organizerIds: [...existingOrgIds, orgId]
            });
          }
        }
      }
      await batch.commit();
    }

    // Return without passwordHash
    const { passwordHash: _, ...safeOrganizer } = organizer;

    return NextResponse.json({ success: true, organizer: safeOrganizer, message: 'Organizer created successfully' });
  } catch (error: any) {
    console.error('Create organizer error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE - Delete an organizer
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get('id');

    if (!orgId) {
      return NextResponse.json({ success: false, message: 'Organizer ID is required' }, { status: 400 });
    }

    const orgRef = adminDb.collection('organizers').doc(orgId);
    const orgDoc = await orgRef.get();

    if (!orgDoc.exists) {
      return NextResponse.json({ success: false, message: 'Organizer not found' }, { status: 404 });
    }

    const orgData = orgDoc.data()!;

    // Remove organizer link from assigned events
    if (orgData.assignedEventIds && orgData.assignedEventIds.length > 0) {
      const batch = adminDb.batch();
      for (const eventId of orgData.assignedEventIds) {
        const eventRef = adminDb.collection('events').doc(eventId);
        const eventDoc = await eventRef.get();
        if (eventDoc.exists) {
          const eventData = eventDoc.data()!;
          const updatedIds = (eventData.organizerIds || []).filter((id: string) => id !== orgId);
          batch.update(eventRef, { organizerIds: updatedIds });
        }
      }
      await batch.commit();
    }

    await orgRef.delete();

    return NextResponse.json({ success: true, message: 'Organizer deleted successfully' });
  } catch (error: any) {
    console.error('Delete organizer error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PATCH - Toggle active status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, active } = body;

    if (!id || typeof active !== 'boolean') {
      return NextResponse.json({ success: false, message: 'ID and active status required' }, { status: 400 });
    }

    await adminDb.collection('organizers').doc(id).update({ active, updatedAt: new Date().toISOString() });

    return NextResponse.json({ success: true, message: `Organizer ${active ? 'activated' : 'deactivated'}` });
  } catch (error: any) {
    console.error('Toggle organizer error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
