import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Premium Ticket',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TicketLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans selection:bg-navratri-accent selection:text-white">
      {children}
    </div>
  );
}
