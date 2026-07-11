import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('id');

    if (eventId) {
      const eventDoc = await adminDb.collection('events').doc(eventId).get();
      if (!eventDoc.exists) {
        return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
      }
      const eventData = eventDoc.data() as any;
      eventData.id = eventDoc.id;
      const passesSnap = await adminDb.collection('events').doc(eventId).collection('ticketTypes').where('enabled', '==', true).get();
      eventData.passes = passesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      return NextResponse.json({ success: true, event: eventData });
    } else {
      const eventsSnapshot = await adminDb.collection('events').where('status', '==', 'published').get();
      const events = await Promise.all(eventsSnapshot.docs.map(async (doc) => {
        const eventData = doc.data() as any;
        eventData.id = doc.id;
        const passesSnap = await adminDb.collection('events').doc(doc.id).collection('ticketTypes').where('enabled', '==', true).get();
        eventData.passes = passesSnap.docs.map(p => ({ id: p.id, ...p.data() }));
        return eventData;
      }));
      return NextResponse.json({ success: true, events });
    }
  } catch (error: any) {
    console.error('Fetch events error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
