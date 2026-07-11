import { Booking, Ticket, ScanLog } from '@/types';
import { DEMO_BOOKINGS, DEMO_TICKETS, DEMO_SCAN_LOGS } from '@/lib/demo-data';
import { generateTicketId, generateSecureToken } from '@/lib/utils';

class TicketStore {
  private bookings: Booking[] = [...DEMO_BOOKINGS];
  private tickets: Ticket[] = [...DEMO_TICKETS];
  private scanLogs: ScanLog[] = [...DEMO_SCAN_LOGS];

  getBookings(): Booking[] {
    return this.bookings;
  }

  getBookingById(id: string): Booking | undefined {
    return this.bookings.find(b => b.id === id);
  }

  addBooking(booking: Booking): void {
    if (this.bookings.find(b => b.id === booking.id)) return;
    this.bookings.push(booking);
  }

  getTickets(): Ticket[] {
    return this.tickets;
  }

  getTicketById(id: string): Ticket | undefined {
    return this.tickets.find(t => t.id === id);
  }

  getTicketByToken(token: string): Ticket | undefined {
    return this.tickets.find(t => t.secureToken === token);
  }

  getTicketsByBookingId(bookingId: string): Ticket[] {
    return this.tickets.filter(t => t.bookingId === bookingId);
  }

  addTicket(ticket: Ticket): void {
    if (this.tickets.find(t => t.id === ticket.id)) return;
    this.tickets.push(ticket);
  }

  markTicketUsed(ticketId: string, scannedBy: string, gateName: string): { success: boolean; message: string; ticket?: Ticket } {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (!ticket) {
      return { success: false, message: 'Ticket not found. Invalid QR code.' };
    }
    if (ticket.status === 'cancelled') {
      return { success: false, message: 'This ticket has been cancelled.' };
    }
    if (ticket.isUsed) {
      return { success: false, message: `Already used at ${ticket.gateName} on ${ticket.entryTime}` };
    }
    ticket.isUsed = true;
    ticket.status = 'used';
    ticket.entryTime = new Date().toISOString();
    ticket.scannedBy = scannedBy;
    ticket.gateName = gateName;
    return { success: true, message: 'Entry granted successfully!', ticket };
  }

  getScanLogs(): ScanLog[] {
    return this.scanLogs;
  }

  addScanLog(log: ScanLog): void {
    this.scanLogs.push(log);
  }

  generateTicketsForBooking(booking: Booking, eventName: string, eventDate: string, venue: string, city: string): Ticket[] {
    const newTickets: Ticket[] = [];
    for (const pass of booking.passes) {
      const count = pass.passName === 'Couple Pass' ? pass.quantity * 2 : pass.quantity;
      for (let i = 0; i < count; i++) {
        const ticket: Ticket = {
          id: generateTicketId(city),
          bookingId: booking.id,
          eventId: booking.eventId,
          eventName,
          eventDate,
          venue,
          customerName: booking.customerName,
          customerPhone: booking.customerPhone,
          passType: pass.passName,
          passDate: new Date().toISOString().slice(0, 10),
          status: 'valid',
          secureToken: generateSecureToken(),
          isUsed: false,
          entryTime: null,
          scannedBy: null,
          gateName: null,
          createdAt: new Date().toISOString(),
        };
        this.addTicket(ticket);
        newTickets.push(ticket);
      }
    }
    return newTickets;
  }
}

let storeInstance: TicketStore | null = null;

export function getTicketStore(): TicketStore {
  if (!storeInstance) {
    storeInstance = new TicketStore();
  }
  return storeInstance;
}
