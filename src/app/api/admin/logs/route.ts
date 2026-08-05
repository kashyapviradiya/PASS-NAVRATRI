import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const snapshot = await adminDb.collection('admin_logs').orderBy('date', 'desc').limit(100).get();
    
    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error('Error fetching admin logs:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
