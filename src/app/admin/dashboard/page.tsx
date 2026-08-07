'use client';

import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';
import { IndianRupee, TrendingUp, Ticket, CheckCircle2, Download, Plus, ExternalLink, CalendarDays, Loader2, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [filter, setFilter] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/dashboard-stats');
      const data = await res.json();
      if (data.success) {
        setStats(data);
      } else {
        toast.error('Failed to load dashboard data');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)] bg-navratri-bg">
        <Loader2 className="w-8 h-8 animate-spin text-navratri-accent" />
      </div>
    );
  }

  const { stats: kpis, events = [], bookings = [], tickets = [] } = stats || {};

  // Computed metrics
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysRevenue = bookings
    .filter((b: any) => new Date(b.createdAt) >= today)
    .reduce((sum: number, b: any) => sum + (b.amount || b.totalAmount || b.grandTotal || 0), 0);

  const todaysCheckins = tickets
    .filter((t: any) => {
      if (!t.checkedIn && !t.scanned) return false;
      const entryTime = new Date(t.scannedAt || t.checkedInAt || t.updatedAt || t.createdAt);
      return entryTime >= today;
    }).length;

  const checkedInCount = tickets.filter((t: any) => t.checkedIn || t.scanned).length;
  const totalTicketsCount = tickets.length || 1; 
  const occupancyPct = ((checkedInCount / totalTicketsCount) * 100).toFixed(1);

  // KPI Cards
  const statCards = [
    { label: "Today's Revenue", value: formatCurrency(todaysRevenue), icon: IndianRupee, gradient: 'bg-gradient-premium' },
    { label: "Today's Check-ins", value: todaysCheckins.toLocaleString(), icon: CheckCircle2, gradient: 'bg-gradient-cyan' },
    { label: "Occupancy %", value: `${occupancyPct}%`, icon: TrendingUp, gradient: 'bg-gradient-dark' },
    { label: 'Total Issued Tickets', value: (kpis?.totalTicketsSold || 0).toLocaleString(), icon: Ticket, gradient: 'bg-gradient-premium' },
    { label: 'Valid / Unused', value: (kpis?.validTickets || 0).toLocaleString(), icon: Ticket, gradient: 'bg-gradient-cyan' },
    { label: 'Scanned / Used', value: (kpis?.successfulEntries || 0).toLocaleString(), icon: CheckCircle2, gradient: 'bg-emerald-500' },
  ];

  // Advanced Pass Distribution logic
  const passDistributionMap = tickets.reduce((acc: Record<string, number>, t: any) => {
    const type = t.passType || t.ticketType || t.name || 'Regular';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  
  const chartColors = ['#7C3AED', '#FF4D6D', '#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#EC4899'];
  const passDistribution = Object.keys(passDistributionMap).map((key, idx) => ({
    name: key,
    value: passDistributionMap[key],
    color: chartColors[idx % chartColors.length]
  }));

  // Computed Revenue Chart Data
  const last7DaysData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { 
      dateStrKey: d.toDateString(), 
      name: d.toLocaleDateString('en-US', { weekday: 'short' }), 
      revenue: 0 
    };
  });

  bookings.forEach((b: any) => {
    const bDate = new Date(b.createdAt).toDateString();
    const dayObj = last7DaysData.find(d => d.dateStrKey === bDate);
    if (dayObj) {
      dayObj.revenue += (b.amount || b.totalAmount || b.grandTotal || 0);
    }
  });
  const revenueData = last7DaysData.map(d => ({ name: d.name, revenue: d.revenue }));

  const exportCSV = () => {
    if (bookings.length === 0) return toast.error('No bookings to export');
    const headers = ['Booking ID', 'Customer', 'Phone', 'Event', 'Amount', 'Status', 'Date'];
    const rows = bookings.map((b: any) => [
      b.id, b.customerName, b.customerPhone, b.eventId, b.totalAmount, b.status, new Date(b.createdAt).toLocaleDateString()
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto selection:bg-navratri-accent selection:text-white">
      
      {/* Quick Actions Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[32px] font-display font-[800] text-navratri-text tracking-tight">Overview</h1>
          <p className="text-navratri-muted font-[500] text-[15px] mt-1">Welcome back to the Admin Dashboard.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={exportCSV} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 px-5 py-2.5 rounded-[12px] text-[14px] font-[700] shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <Link href="/" target="_blank" className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 px-5 py-2.5 rounded-[12px] text-[14px] font-[700] shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
            <ExternalLink className="w-4 h-4" /> Public Site
          </Link>
          <Link href="/admin/events/new" className="flex items-center gap-2 bg-[#0F172A] text-white hover:bg-slate-800 px-5 py-2.5 rounded-[12px] text-[14px] font-[700] shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 relative overflow-hidden">
            <span className="relative z-10 flex items-center gap-2"><Plus className="w-4 h-4" /> Create Event</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <motion.div 
        initial="hidden" animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
      >
        {statCards.map((stat, idx) => (
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
            }}
            key={idx} 
            className="bg-white rounded-[20px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-100/50 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${stat.gradient}`} />
            <div className="relative z-10 pl-3">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-slate-50 rounded-[12px] flex items-center justify-center border border-slate-100 text-slate-500 group-hover:scale-110 group-hover:text-slate-800 transition-all duration-300">
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[32px] font-display font-[800] tracking-tight mb-1 text-slate-800 leading-none">{stat.value}</p>
              <p className="text-[12px] font-[700] uppercase tracking-widest text-slate-400 mt-2">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-card p-6 shadow-sm hover:shadow-premium transition-shadow duration-300 border border-navratri-lightGrey group">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[20px] font-display font-[800] text-navratri-text group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-premium transition-all w-fit">Revenue Performance</h3>
            <div className="bg-slate-50 p-1.5 rounded-[12px] border border-navratri-lightGrey flex text-[12px] font-[700] text-navratri-muted">
              {['daily', 'weekly', 'monthly'].map(f => (
                <button key={f} onClick={() => setFilter(f as any)} className={`px-4 py-2 rounded-[8px] uppercase tracking-widest transition-all ${filter === f ? 'bg-white shadow-sm text-navratri-primary' : 'hover:text-navratri-text'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          
          {bookings.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-navratri-muted">
              <TrendingUp className="w-8 h-8 mb-2 opacity-50 text-navratri-primary" />
              <p className="text-[14px] font-[600] uppercase tracking-widest">No revenue data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B', fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B', fontWeight: 700 }} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip cursor={{ fill: '#F8FAFC' }} formatter={(value: any) => formatCurrency(Number(value) || 0)} contentStyle={{ borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)', backdropFilter: 'blur(12px)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }} labelStyle={{ fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-outfit)' }} itemStyle={{ fontWeight: 700, color: '#7C3AED' }} />
                <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FF4D6D" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pass Distribution */}
        <div className="bg-white rounded-card p-6 shadow-sm hover:shadow-premium transition-shadow duration-300 border border-navratri-lightGrey group">
          <h3 className="text-[20px] font-display font-[800] text-navratri-text mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-premium transition-all w-fit">Pass Distribution</h3>
          {passDistribution.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-navratri-muted">
              <PieChart className="w-8 h-8 mb-2 opacity-50 text-navratri-primary" />
              <p className="text-[14px] font-[600] uppercase tracking-widest">No tickets sold yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={passDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                  {passDistribution.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)', backdropFilter: 'blur(12px)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }} itemStyle={{ fontWeight: 700 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
          {passDistribution.length > 0 && (
             <div className="flex flex-wrap justify-center gap-4 mt-4">
               {passDistribution.map(d => (
                 <div key={d.name} className="flex items-center gap-2 text-[12px] font-[800] text-navratri-muted uppercase tracking-widest">
                   <div className="w-3.5 h-3.5 rounded-[4px]" style={{ backgroundColor: d.color }}></div>
                   {d.name}
                 </div>
               ))}
             </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        
        {/* Recent Bookings */}
        <div className="bg-white rounded-card shadow-sm hover:shadow-premium transition-shadow duration-300 border border-navratri-lightGrey overflow-hidden group">
          <div className="p-6 border-b border-navratri-lightGrey flex justify-between items-center bg-slate-50/50">
            <h3 className="text-[20px] font-display font-[800] text-navratri-text group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-premium transition-all">Recent Bookings</h3>
            <button className="text-[14px] font-[800] text-navratri-primary hover:text-navratri-secondary flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {bookings.length === 0 ? (
            <div className="p-12 text-center text-navratri-muted">
              <Ticket className="w-8 h-8 mx-auto mb-3 opacity-50 text-navratri-primary" />
              <p className="text-[14px] font-[600] uppercase tracking-widest">No recent bookings</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-navratri-muted font-[800] text-[10px] uppercase tracking-widest">
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navratri-lightGrey text-[14px]">
                  {bookings.slice(0, 5).map((booking: any) => (
                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-[700] text-navratri-text">{booking.customerName}</p>
                        <p className="text-[11px] text-navratri-muted font-mono mt-0.5">{booking.id}</p>
                      </td>
                      <td className="px-6 py-4 font-[800] text-navratri-text">{formatCurrency(booking.amount || booking.totalAmount || booking.grandTotal || 0)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-[8px] text-[10px] font-[800] uppercase tracking-widest border ${booking.paymentStatus === 'paid' || booking.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                          {booking.paymentStatus || booking.status || 'unknown'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-card shadow-sm hover:shadow-premium transition-shadow duration-300 border border-navratri-lightGrey overflow-hidden group">
          <div className="p-6 border-b border-navratri-lightGrey flex justify-between items-center bg-slate-50/50">
            <h3 className="text-[20px] font-display font-[800] text-navratri-text group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-premium transition-all">Upcoming Events</h3>
            <Link href="/admin/events" className="text-[14px] font-[800] text-navratri-primary hover:text-navratri-secondary flex items-center gap-1 transition-colors">
              Manage <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {events.length === 0 ? (
            <div className="p-12 text-center text-navratri-muted">
              <CalendarDays className="w-8 h-8 mx-auto mb-3 opacity-50 text-navratri-primary" />
              <p className="text-[14px] font-[600] uppercase tracking-widest">No upcoming events</p>
            </div>
          ) : (
            <div className="divide-y divide-navratri-lightGrey">
              {events.slice(0, 4).map((event: any) => {
                const sold = (event.ticketTypes || []).reduce((sum: number, tt: any) => sum + (tt.soldQuantity || 0), 0);
                const total = (event.ticketTypes || []).reduce((sum: number, tt: any) => sum + (tt.totalInventory || 0), 0);
                const pct = total > 0 ? (sold / total) * 100 : 0;
                
                return (
                  <div key={event.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-[800] text-navratri-text line-clamp-1 text-[16px]">{event.title}</h4>
                        <p className="text-[12px] text-navratri-muted mt-1 font-[600] flex items-center gap-1.5">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {new Date(event.startDate).toLocaleDateString()} • {event.venue}
                        </p>
                      </div>
                      <span className={`px-3 py-1.5 rounded-[8px] text-[10px] font-[800] uppercase tracking-widest shrink-0 border ${event.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                        {event.status}
                      </span>
                    </div>
                    <div className="space-y-2 bg-slate-50 p-3 rounded-[12px] border border-slate-100">
                      <div className="flex justify-between text-[11px] font-[800] uppercase tracking-widest">
                        <span className="text-navratri-muted">Tickets Sold</span>
                        <span className="text-navratri-primary">{sold} / {total}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-premium" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
