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
      return NextResponse.json({ success: true, bookings: [] });
    }

    // Parse filters
    const searchParams = request.nextUrl.searchParams;
    const eventId = searchParams.get('eventId');
    const paymentStatus = searchParams.get('paymentStatus');
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    // Build query
    let query: FirebaseFirestore.Query = adminDb.collection('orders');

    // Filter by assigned events (In-array max size is 10, but usually organizers have 1-5 events)
    // For safety, we filter manually if they have > 10, or just use the first 10
    if (eventId) {
      if (!assignedEventIds.includes(eventId)) {
        return NextResponse.json({ success: false, message: 'Forbidden event' }, { status: 403 });
      }
      query = query.where('eventId', '==', eventId);
    } else {
      // If no specific event requested, query for up to 10 of their assigned events
      query = query.where('eventId', 'in', assignedEventIds.slice(0, 10));
    }

    if (paymentStatus) {
      query = query.where('paymentStatus', '==', paymentStatus);
    }

    query = query.orderBy('createdAt', 'desc').limit(limit);

    const snapshot = await query.get();
    
    const bookings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ success: true, bookings });

  } catch (error: any) {
    console.error('Organizer bookings error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
