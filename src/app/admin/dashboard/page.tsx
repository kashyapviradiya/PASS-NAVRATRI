'use client';

import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';
import { IndianRupee, TrendingUp, Ticket, CheckCircle2, Download, Plus, ExternalLink, CalendarDays, Loader2, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Link from 'next/link';
import toast from 'react-hot-toast';

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

  // KPI Cards
  const statCards = [
    { label: 'Total Revenue', value: formatCurrency(kpis?.totalRevenue || 0), icon: IndianRupee, color: 'bg-green-500 text-white shadow-green-500/20' },
    { label: "Today's Sales", value: formatCurrency(kpis?.todaySales || 0), icon: TrendingUp, color: 'bg-navratri-accent text-white shadow-navratri-accent/20' },
    { label: 'Passes Sold', value: (kpis?.totalPassesSold || 0).toLocaleString(), icon: Ticket, color: 'bg-navratri-darkAccent text-white shadow-navratri-darkAccent/20' },
    { label: 'Entries Done', value: (kpis?.entriesDone || 0).toLocaleString(), icon: CheckCircle2, color: 'bg-blue-600 text-white shadow-blue-600/20' },
  ];

  // Dummy Chart Data until complex aggregations are built
  const revenueData = [
    { name: 'Mon', revenue: 15000 }, { name: 'Tue', revenue: 20000 },
    { name: 'Wed', revenue: 45000 }, { name: 'Thu', revenue: 30000 },
    { name: 'Fri', revenue: 65000 }, { name: 'Sat', revenue: 85000 }, { name: 'Sun', revenue: 55000 }
  ];

  const passDistribution = tickets.length > 0 ? [
    { name: 'VIP', value: tickets.filter((t: any) => t.passType?.includes('VIP')).length || 10, color: '#E53935' },
    { name: 'Regular', value: tickets.filter((t: any) => !t.passType?.includes('VIP')).length || 40, color: '#B71C1C' }
  ] : [];

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
          <h1 className="text-[32px] font-display font-[700] text-navratri-text tracking-tight">Overview</h1>
          <p className="text-navratri-muted font-[500] text-[15px] mt-1">Welcome back to the Admin Dashboard.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={exportCSV} className="flex items-center gap-2 bg-white border border-navratri-lightGrey text-navratri-text hover:bg-navratri-bg px-4 py-2.5 rounded-[12px] text-[14px] font-[700] shadow-sm transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <Link href="/" target="_blank" className="flex items-center gap-2 bg-white border border-navratri-lightGrey text-navratri-text hover:bg-navratri-bg px-4 py-2.5 rounded-[12px] text-[14px] font-[700] shadow-sm transition-colors">
            <ExternalLink className="w-4 h-4" /> Public Site
          </Link>
          <Link href="/admin/events/new" className="flex items-center gap-2 bg-navratri-accent text-white hover:bg-navratri-darkAccent px-4 py-2.5 rounded-[12px] text-[14px] font-[700] shadow-sm shadow-navratri-accent/20 transition-all hover:-translate-y-0.5">
            <Plus className="w-4 h-4" /> Create Event
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className={`rounded-card p-6 shadow-sm border border-navratri-lightGrey ${stat.color} relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-black/10 rounded-[12px] flex items-center justify-center mb-4 backdrop-blur-sm">
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-[32px] font-display font-[700] tracking-tight mb-1">{stat.value}</p>
              <p className="text-[13px] font-[700] uppercase tracking-widest opacity-80">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-card p-6 shadow-sm border border-navratri-lightGrey">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[18px] font-display font-[700] text-navratri-text">Revenue Performance</h3>
            <div className="bg-navratri-bg p-1 rounded-[10px] border border-navratri-lightGrey flex text-[12px] font-[700] text-navratri-muted">
              {['daily', 'weekly', 'monthly'].map(f => (
                <button key={f} onClick={() => setFilter(f as any)} className={`px-3 py-1.5 rounded-[8px] uppercase tracking-widest ${filter === f ? 'bg-white shadow-sm text-navratri-text' : 'hover:text-navratri-text'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          
          {bookings.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-navratri-muted">
              <TrendingUp className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-[14px] font-[500]">No revenue data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#A3A3A3', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#A3A3A3', fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip cursor={{ fill: '#F8F7F4' }} formatter={(value: any) => formatCurrency(Number(value) || 0)} contentStyle={{ borderRadius: '16px', border: '1px solid #E8E8E8', boxShadow: '0 4px 20px rgb(0 0 0 / 0.05)' }} labelStyle={{ fontWeight: 700, color: '#090909', fontFamily: 'var(--font-outfit)' }} itemStyle={{ fontWeight: 600, color: '#E53935' }} />
                <Bar dataKey="revenue" fill="#B71C1C" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pass Distribution */}
        <div className="bg-white rounded-card p-6 shadow-sm border border-navratri-lightGrey">
          <h3 className="text-[18px] font-display font-[700] text-navratri-text mb-6">Pass Distribution</h3>
          {passDistribution.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-navratri-muted">
              <PieChart className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-[14px] font-[500]">No tickets sold yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={passDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                  {passDistribution.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #E8E8E8', boxShadow: '0 4px 20px rgb(0 0 0 / 0.05)' }} itemStyle={{ fontWeight: 600 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
          {passDistribution.length > 0 && (
             <div className="flex justify-center gap-4 mt-4">
               {passDistribution.map(d => (
                 <div key={d.name} className="flex items-center gap-2 text-[12px] font-[700] text-navratri-muted uppercase tracking-widest">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                   {d.name}
                 </div>
               ))}
             </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Bookings */}
        <div className="bg-white rounded-card shadow-sm border border-navratri-lightGrey overflow-hidden">
          <div className="p-6 border-b border-navratri-lightGrey flex justify-between items-center">
            <h3 className="text-[18px] font-display font-[700] text-navratri-text">Recent Bookings</h3>
            <button className="text-[14px] font-[700] text-navratri-accent hover:text-navratri-darkAccent flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {bookings.length === 0 ? (
            <div className="p-12 text-center text-navratri-muted">
              <Ticket className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-[14px] font-[500]">No recent bookings</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-navratri-bg text-navratri-muted font-[700] text-[10px] uppercase tracking-widest">
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navratri-lightGrey text-[14px]">
                  {bookings.slice(0, 5).map((booking: any) => (
                    <tr key={booking.id} className="hover:bg-navratri-bg/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-[700] text-navratri-text">{booking.customerName}</p>
                        <p className="text-[11px] text-navratri-muted font-mono mt-0.5">{booking.id}</p>
                      </td>
                      <td className="px-6 py-4 font-[700] text-navratri-text">{formatCurrency(booking.totalAmount || booking.grandTotal || 0)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-[6px] text-[10px] font-[700] uppercase tracking-widest ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-navratri-lightGrey text-navratri-muted'}`}>
                          {booking.status}
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
        <div className="bg-white rounded-card shadow-sm border border-navratri-lightGrey overflow-hidden">
          <div className="p-6 border-b border-navratri-lightGrey flex justify-between items-center">
            <h3 className="text-[18px] font-display font-[700] text-navratri-text">Upcoming Events</h3>
            <Link href="/admin/events" className="text-[14px] font-[700] text-navratri-accent hover:text-navratri-darkAccent flex items-center gap-1 transition-colors">
              Manage <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {events.length === 0 ? (
            <div className="p-12 text-center text-navratri-muted">
              <CalendarDays className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-[14px] font-[500]">No upcoming events</p>
            </div>
          ) : (
            <div className="divide-y divide-navratri-lightGrey">
              {events.slice(0, 4).map((event: any) => {
                const sold = (event.ticketTypes || []).reduce((sum: number, tt: any) => sum + (tt.soldQuantity || 0), 0);
                const total = (event.ticketTypes || []).reduce((sum: number, tt: any) => sum + (tt.totalInventory || 0), 0);
                const pct = total > 0 ? (sold / total) * 100 : 0;
                
                return (
                  <div key={event.id} className="p-6 hover:bg-navratri-bg/50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-[700] text-navratri-text line-clamp-1 text-[15px]">{event.title}</h4>
                        <p className="text-[12px] text-navratri-muted mt-0.5">{new Date(event.startDate).toLocaleDateString()} • {event.venue}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-[6px] text-[10px] font-[700] uppercase tracking-widest shrink-0 ${event.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-navratri-lightGrey text-navratri-muted'}`}>
                        {event.status}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-[700] uppercase tracking-widest">
                        <span className="text-navratri-muted">Tickets Sold</span>
                        <span className="text-navratri-accent">{sold} / {total}</span>
                      </div>
                      <div className="w-full h-1.5 bg-navratri-lightGrey rounded-full overflow-hidden">
                        <div className="h-full bg-navratri-accent" style={{ width: `${pct}%` }}></div>
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
