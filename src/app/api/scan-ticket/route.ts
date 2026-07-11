import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-dev-only-do-not-use-in-prod');

export async function POST(request: NextRequest) {
  try {
    // 1. Verify Staff Session
    const token = request.cookies.get('staff_token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    let staff;
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      staff = payload;
    } catch (e) {
      return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 });
    }

    const { qrValue, gateName, eventId } = await request.json();

    if (!qrValue || !gateName || !eventId) {
      return NextResponse.json({ success: false, message: 'Missing qrValue, gateName, or eventId' }, { status: 400 });
    }

    let parsedQr;
    let ticketId;
    let ticketEventId;
    
    try {
      parsedQr = JSON.parse(qrValue);
      // For legacy mock tickets
      if (!parsedQr.p || !parsedQr.s) {
         ticketId = qrValue.split(':')[1];
      } else {
        // Real signed tickets
        const crypto = require('crypto');
        const hmac = crypto.createHmac('sha256', process.env.QR_SIGNING_SECRET || 'demo-qr-signing-secret-key-replace-in-prod');
        hmac.update(parsedQr.p);
        const expectedSignature = hmac.digest('hex');
        
        if (expectedSignature !== parsedQr.s) {
          return NextResponse.json({ success: false, message: 'Invalid QR signature' }, { status: 400 });
        }
        
        const payload = JSON.parse(parsedQr.p);
        ticketId = payload.ticketId;
        ticketEventId = payload.eventId;
      }
    } catch (e) {
       // fallback for simple strings if any
       ticketId = qrValue;
    }

    // 2. Perform Firestore Transaction to guarantee atomic check-in
    const result = await adminDb.runTransaction(async (transaction) => {
      // Find ticket by ticketId if we have it, else try qrValue
      const ticketsRef = adminDb.collection('tickets');
      let querySnapshot;
      if (ticketId && ticketId.startsWith('RP')) {
        const docRef = ticketsRef.doc(ticketId);
        const docSnap = await transaction.get(docRef);
        if (docSnap.exists) {
          querySnapshot = { empty: false, docs: [docSnap] };
        } else {
          querySnapshot = { empty: true };
        }
      } else {
        querySnapshot = await transaction.get(ticketsRef.where('qrValue', '==', qrValue).limit(1));
      }

      if (querySnapshot.empty) {
        throw new Error('INVALID_TICKET');
      }

      const ticketDoc = querySnapshot.docs[0];
      const ticket = ticketDoc.data();

      if (ticket.eventId !== eventId && ticketEventId !== eventId) {
        throw new Error('WRONG_EVENT');
      }

      // Check if ticket is already used
      if (ticket.status === 'used' || ticket.checkedIn === true) {
        // We throw a specific error with data we can parse to show the RED warning
        throw new Error(JSON.stringify({
          code: 'ALREADY_USED',
          customerName: ticket.customerName,
          bookingId: ticket.bookingId,
          ticketType: ticket.ticketType
        }));
      }

      if (ticket.status === 'cancelled') {
         throw new Error('CANCELLED_TICKET');
      }

      // Update Ticket Status
      transaction.update(ticketDoc.ref, {
        status: 'used',
        checkedIn: true
      });

      // Create Check-in Record
      const checkinRef = adminDb.collection('checkins').doc();
      const checkinData = {
        id: checkinRef.id,
        ticketId: ticket.ticketId,
        bookingId: ticket.bookingId,
        eventId: ticket.eventId,
        customerName: ticket.customerName,
        ticketType: ticket.ticketType,
        qrValue: ticket.qrValue,
        scannedBy: staff.name,
        gateName: gateName,
        scannedAt: new Date().toISOString()
      };
      
      transaction.set(checkinRef, checkinData);

      return { ticket, checkinData };
    });

    return NextResponse.json({ 
      success: true, 
      ticket: result.ticket,
      checkin: result.checkinData
    });

  } catch (error: any) {
    if (error.message === 'INVALID_TICKET' || error.message === 'CANCELLED_TICKET') {
      return NextResponse.json({ 
        success: false, 
        code: error.message, 
        message: 'This pass is not recognized or has been cancelled.' 
      }, { status: 400 });
    }

    if (error.message === 'WRONG_EVENT') {
      return NextResponse.json({ 
        success: false, 
        code: 'WRONG_EVENT', 
        message: 'This pass is for a different event.' 
      }, { status: 400 });
    }

    try {
      const parsedError = JSON.parse(error.message);
      if (parsedError.code === 'ALREADY_USED') {
        return NextResponse.json({
          success: false,
          code: 'ALREADY_USED',
          ticket: {
            customerName: parsedError.customerName,
            bookingId: parsedError.bookingId,
            ticketType: parsedError.ticketType
          },
          message: 'Ticket already used.'
        }, { status: 400 });
      }
    } catch (e) {
      // Not JSON
    }

    console.error('Scan ticket error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
