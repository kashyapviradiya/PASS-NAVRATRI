export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  bannerImage: string;
  gallery: string[];
  city: string;
  venue: string;
  address: string;
  startDate: string;
  endDate: string;
  status: 'published' | 'draft' | 'sold_out';
  ticketTypes: TicketType[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  benefits: string[];
  totalInventory: number;
  soldQuantity: number;
  remainingQuantity: number;
  maxPerBooking: number;
  status: 'available' | 'sold_out' | 'hidden';
}

export interface Order {
  id: string; // The RP-2026-000001 format
  eventId: string;
  customerName: string;
  mobile: string;
  email: string;
  city: string;
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  ticketCount: number;
  ticketTypes: BookingPass[]; // Keep this to know what was purchased
  paymentMode?: string;
  status: 'confirmed' | 'cancelled' | 'refunded';
  demo?: boolean;
  notes?: string;
  timeline?: TimelineEvent[];
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
}

export interface TimelineEvent {
  action: string;
  date: string;
  actor: string;
}

export interface AdminLog {
  id: string;
  action: string;
  targetId: string;
  targetType: 'booking' | 'event' | 'ticket';
  actor: string;
  date: string;
  details: string;
}

export interface BookingPass {
  ticketTypeId: string;
  ticketTypeName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Ticket {
  ticketId: string;
  bookingId: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  venue: string;
  eventBanner: string;
  customerName: string;
  mobile: string;
  email: string;
  ticketType: string;
  status: 'valid' | 'used' | 'cancelled';
  checkedIn: boolean;
  qrValue: string; // The secure value encoded in QR
  createdAt: string;
}

export interface ScanLog {
  id: string;
  ticketId: string;
  eventId: string;
  result: 'valid' | 'invalid' | 'already_used';
  scannedBy: string;
  scannedAt: string;
  gateName: string;
}

export interface AdminStats {
  totalEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  todaySales: number;
  totalCustomers: number;
  totalScans: number;
  successfulEntries: number;
  pendingEntries: number;
  invalidScans: number;
  duplicateScans: number;
}

export type Role = 'admin' | 'organizer' | 'scanner_staff' | 'customer';

export interface User {
  id: string; // Firebase Auth UID
  email: string;
  phone?: string;
  name?: string;
  role: Role;
  createdAt: string;
}

export interface Staff {
  id: string; // Firebase Auth UID
  email: string;
  name: string;
  role: 'scanner_staff';
  assignedEvents: string[]; // Event IDs
  gateName?: string;
  active: boolean;
  createdAt: string;
}

export interface Organizer {
  id: string; // Firebase Auth UID
  email: string;
  name: string;
  companyName: string;
  role: 'organizer';
  active: boolean;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  eventId?: string; // If specific to an event
  active: boolean;
  createdAt: string;
}

export interface Settlement {
  id: string;
  organizerId: string;
  eventId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  utrNumber?: string;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
  updatedAt: string;
}

export interface Enquiry {
  id: string;
  type: 'demo' | 'partner' | 'contact';
  name: string;
  email: string;
  phone: string;
  company?: string;
  message?: string;
  status: 'new' | 'reviewed' | 'approved' | 'rejected';
  createdAt: string;
}
