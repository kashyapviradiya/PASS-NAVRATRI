import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const passwordHash = await bcrypt.hash('organizer123', 10);
    
    const organizer = {
      id: 'org-1',
      name: 'Royal Events',
      companyName: 'Royal Events Gujarat',
      email: 'organizer@royalevents.com',
      mobile: '9988776655',
      role: 'organizer',
      active: true,
      assignedEventIds: ['evt-ahmedabad-royal-garba'],
      permissions: {
        canViewBookings: true,
        canManageStaff: true,
        canManageGates: true,
        canExportReports: true,
        canViewAnalytics: true,
        canEditInventory: false
      },
      passwordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await adminDb.collection('organizers').doc('org-1').set(organizer);

    const eventRef = adminDb.collection('events').doc('evt-ahmedabad-royal-garba');
    const eventDoc = await eventRef.get();
    
    if (eventDoc.exists) {
      await eventRef.update({
        organizerId: 'org-1',
        organizerIds: ['org-1']
      });
    } else {
      await eventRef.set({
        id: 'evt-ahmedabad-royal-garba',
        name: 'Royal Garba Mahotsav',
        organizerId: 'org-1',
        organizerIds: ['org-1'],
        status: 'published',
        date: '2026-10-15',
        venue: 'Ahmedabad'
      });
    }

    return NextResponse.json({ success: true, message: 'Organizer org-1 seeded along with event' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, stack: error.stack });
  }
}
