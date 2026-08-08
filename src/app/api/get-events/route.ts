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
      const mockEvents = [
        {
          id: 'demo-sachi',
          title: 'Sachi Navaratri',
          startDate: new Date('2026-10-10T19:00:00').toISOString(),
          endDate: new Date('2026-10-19T23:59:00').toISOString(),
          venue: 'AC Dome Navratri, Sachi Entertainment',
          city: 'Ahmedabad',
          bannerImage: '/demo/events/poster-navratri.jpg',
          category: 'Navratri',
          views: '1.2K',
          status: 'published',
          ticketTypes: [{ price: 899 }]
        },
        {
          id: 'demo-aishwarya',
          title: "Aishwarya Majmudar's Rangtali",
          startDate: new Date('2026-10-14T19:00:00').toISOString(),
          venue: 'GMDC Ground',
          city: 'Ahmedabad',
          bannerImage: '/demo/events/poster-cultural.jpg',
          category: 'Navratri',
          views: '850',
          status: 'published',
          ticketTypes: [{ price: 999 }]
        },
        {
          id: 'demo-hariom',
          title: 'Hariom Gadhavi Sacred Raas',
          startDate: new Date('2026-10-21T19:00:00').toISOString(),
          venue: 'Narayani Heights',
          city: 'Ahmedabad',
          bannerImage: '/demo/events/poster-livemusic.jpg',
          category: 'Music',
          views: '540',
          status: 'published',
          ticketTypes: [{ price: 1200 }]
        },
        {
          id: 'demo-dj',
          title: 'Sunburn Arena ft. DJ Snake',
          startDate: new Date('2026-11-05T18:00:00').toISOString(),
          venue: 'Kensville Golf Club',
          city: 'Ahmedabad',
          bannerImage: '/demo/events/poster-dj.jpg',
          category: 'Party',
          views: '2.5K',
          status: 'published',
          ticketTypes: [{ price: 2500 }]
        },
        {
          id: 'demo-comedy',
          title: 'Zakir Khan Live',
          startDate: new Date('2026-11-15T20:00:00').toISOString(),
          venue: 'Pandit Dindayal Upadhyay Auditorium',
          city: 'Ahmedabad',
          bannerImage: '/demo/events/poster-comedy.jpg',
          category: 'Comedy',
          views: '3.1K',
          status: 'published',
          ticketTypes: [{ price: 499 }]
        }
      ];

      return NextResponse.json({ success: true, events: mockEvents });
    }
  } catch (error: any) {
    console.error('Fetch events error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
