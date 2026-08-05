import { adminDb } from '@/lib/firebase-admin';

export async function logAdminAction(
  action: string,
  targetId: string,
  targetType: 'booking' | 'event' | 'ticket',
  details: string,
  actor: string = 'Super Admin' // Defaults to Super Admin for now
) {
  try {
    const logRef = adminDb.collection('admin_logs').doc();
    await logRef.set({
      id: logRef.id,
      action,
      targetId,
      targetType,
      actor,
      details,
      date: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to write admin log:', error);
  }
}
