import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { eventId, status } = await request.json();

    if (!eventId || !status) {
      return NextResponse.json({ success: false, message: 'Missing parameters' }, { status: 400 });
    }

    await adminDb.collection('events').doc(eventId).update({ status });

    return NextResponse.json({ success: true, message: 'Event status updated' });
  } catch (error: any) {
    console.error('Update event status error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
