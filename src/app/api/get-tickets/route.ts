import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mobile = searchParams.get('mobile');
    const bookingId = searchParams.get('bookingId');

    if (!mobile && !bookingId) {
      return NextResponse.json({ success: false, message: 'Missing mobile or bookingId parameter' }, { status: 400 });
    }

    let query: any = adminDb.collection('tickets');
    if (bookingId) {
      query = query.where('bookingId', '==', bookingId);
    } else if (mobile) {
      query = query.where('mobile', '==', mobile);
    }

    const ticketsSnapshot = await query.get();

    if (ticketsSnapshot.empty) {
      // Return empty array, client handles it
      return NextResponse.json({ success: true, tickets: [] });
    }

    const tickets = ticketsSnapshot.docs.map(doc => doc.data());
    return NextResponse.json({ success: true, tickets });
  } catch (error: any) {
    console.error('Fetch tickets error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
