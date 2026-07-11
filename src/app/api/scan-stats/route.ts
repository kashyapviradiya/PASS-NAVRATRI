import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-dev-only-do-not-use-in-prod');

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('staff_token')?.value;
    if (!token) return NextResponse.json({ success: false }, { status: 401 });
    
    try {
      await jwtVerify(token, JWT_SECRET);
    } catch(e) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    
    if (!eventId) return NextResponse.json({ success: false }, { status: 400 });

    const snapshot = await adminDb.collection('checkins')
      .where('eventId', '==', eventId)
      .get();

    let total = 0;
    let vip = 0;
    let regular = 0;

    snapshot.docs.forEach(doc => {
      total++;
      const data = doc.data();
      if (data.ticketType && data.ticketType.toLowerCase().includes('vip')) {
        vip++;
      } else {
        regular++;
      }
    });

    return NextResponse.json({ success: true, stats: { total, vip, regular } });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
