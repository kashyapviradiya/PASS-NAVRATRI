import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifySession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) return new NextResponse('Unauthorized', { status: 401 });

    const session = await verifySession(token);
    if (!session || session.role !== 'organizer') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const orgDoc = await adminDb.collection('organizers').doc(session.id).get();
    if (!orgDoc.exists) return new NextResponse('Organizer not found', { status: 404 });
    const assignedEventIds: string[] = orgDoc.data()?.assignedEventIds || [];

    if (assignedEventIds.length === 0) {
      return new NextResponse('No events assigned', { status: 400 });
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'bookings';
    const eventId = searchParams.get('eventId');

    let targetEventIds = assignedEventIds;
    if (eventId) {
      if (!assignedEventIds.includes(eventId)) {
        return new NextResponse('Forbidden event', { status: 403 });
      }
      targetEventIds = [eventId];
    } else {
      targetEventIds = targetEventIds.slice(0, 10);
    }

    if (type === 'bookings') {
      const ordersSnapshot = await adminDb.collection('orders')
        .where('eventId', 'in', targetEventIds)
        .where('paymentStatus', '==', 'paid')
        .get();

      let csv = 'Booking ID,Date,Customer Name,Mobile,Email,Passes,Amount,Status\n';
      ordersSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const date = data.createdAt ? new Date(data.createdAt).toLocaleDateString() : '';
        const name = `"${data.customerName || ''}"`;
        const email = `"${data.customerEmail || ''}"`;
        csv += `${doc.id},${date},${name},${data.mobile || ''},${email},${data.totalQuantity || 0},${data.amount || 0},${data.paymentStatus}\n`;
      });

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="bookings_report_${new Date().getTime()}.csv"`
        }
      });
    }

    if (type === 'checkins') {
      const checkinsSnapshot = await adminDb.collection('checkins')
        .where('eventId', 'in', targetEventIds)
        .get();

      let csv = 'Scan ID,Date,Time,Gate,Staff ID,Customer Name,Ticket Type,Status\n';
      checkinsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const ts = data.timestamp ? new Date(data.timestamp) : new Date();
        const date = ts.toLocaleDateString();
        const time = ts.toLocaleTimeString();
        const name = `"${data.ticketDetails?.customerName || ''}"`;
        const ticketType = `"${data.ticketDetails?.ticketType || ''}"`;
        csv += `${doc.id},${date},${time},${data.gateName || ''},${data.staffId || ''},${name},${ticketType},${data.status}\n`;
      });

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="checkins_report_${new Date().getTime()}.csv"`
        }
      });
    }

    return new NextResponse('Invalid report type', { status: 400 });

  } catch (error: any) {
    console.error('Organizer export error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
