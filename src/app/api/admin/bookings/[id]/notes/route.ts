import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { notes } = body;

    const orderRef = adminDb.collection('orders').doc(id);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
    }

    await orderRef.update({ notes });

    return NextResponse.json({ success: true, message: 'Notes updated successfully' });
  } catch (error: any) {
    console.error('Error updating booking notes:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
