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

    const orgDoc = await adminDb.collection('organizers').doc(session.id).get();
    if (!orgDoc.exists) return NextResponse.json({ success: false, message: 'Organizer not found' }, { status: 404 });
    const assignedEventIds: string[] = orgDoc.data()?.assignedEventIds || [];

    if (assignedEventIds.length === 0) {
      return NextResponse.json({ success: true, checkins: [] });
    }

    const searchParams = request.nextUrl.searchParams;
    const eventId = searchParams.get('eventId');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    let query: FirebaseFirestore.Query = adminDb.collection('checkins');

    if (eventId) {
      if (!assignedEventIds.includes(eventId)) {
        return NextResponse.json({ success: false, message: 'Forbidden event' }, { status: 403 });
      }
      query = query.where('eventId', '==', eventId);
    } else {
      query = query.where('eventId', 'in', assignedEventIds.slice(0, 10));
    }

    query = query.orderBy('timestamp', 'desc').limit(limit);
    const snapshot = await query.get();
    
    const checkins = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ success: true, checkins });

  } catch (error: any) {
    console.error('Organizer checkins error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
