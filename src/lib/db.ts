import { db } from './firebase';
import { collection, doc } from 'firebase/firestore';

// Collection References
export const usersRef = collection(db, 'users');
export const adminsRef = collection(db, 'admins');
export const organizersRef = collection(db, 'organizers');
export const staffRef = collection(db, 'staff');
export const eventsRef = collection(db, 'events');
export const passTypesRef = collection(db, 'passTypes');
export const bookingsRef = collection(db, 'bookings');
export const ticketsRef = collection(db, 'tickets');
export const paymentsRef = collection(db, 'payments');
export const scanLogsRef = collection(db, 'scanLogs');
export const settlementsRef = collection(db, 'settlements');
export const couponsRef = collection(db, 'coupons');

// Document References Helpers
export const getEventRef = (id: string) => doc(db, 'events', id);
export const getBookingRef = (id: string) => doc(db, 'bookings', id);
export const getTicketRef = (id: string) => doc(db, 'tickets', id);
export const getUserRef = (id: string) => doc(db, 'users', id);
