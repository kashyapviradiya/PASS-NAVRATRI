import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const passwordHash = await bcrypt.hash('password123', 10);
    
    await adminDb.collection('staff').doc('staff-1').set({
      id: 'staff-1',
      name: 'John Scanner',
      mobile: '9876543210',
      passwordHash,
      role: 'scanner_staff',
      assignedEvents: ['evt-ahmedabad-royal-garba'],
      assignedGates: ['Main Entry', 'VIP Gate'],
      active: true,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, message: 'Staff seeded' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
