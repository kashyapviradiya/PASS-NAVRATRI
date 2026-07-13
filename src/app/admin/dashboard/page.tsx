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
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <Loader2 className="w-8 h-8 animate-spin text-navratri-primary" />
      </div>
    );
  }

  const { stats: kpis, events = [], bookings = [], tickets = [] } = stats || {};

  // KPI Cards
  const statCards = [
    { label: 'Total Revenue', value: formatCurrency(kpis?.totalRevenue || 0), icon: IndianRupee, color: 'bg-green-500 text-white shadow-green-500/20' },
    { label: "Today's Sales", value: formatCurrency(kpis?.todaySales || 0), icon: TrendingUp, color: 'bg-navratri-gold text-navratri-primary shadow-navratri-gold/20' },
    { label: 'Passes Sold', value: (kpis?.totalPassesSold || 0).toLocaleString(), icon: Ticket, color: 'bg-navratri-primary text-white shadow-navratri-primary/20' },
    { label: 'Entries Done', value: (kpis?.entriesDone || 0).toLocaleString(), icon: CheckCircle2, color: 'bg-blue-600 text-white shadow-blue-600/20' },
  ];

  // Dummy Chart Data until complex aggregations are built
  const revenueData = [
    { name: 'Mon', revenue: 15000 }, { name: 'Tue', revenue: 20000 },
    { name: 'Wed', revenue: 45000 }, { name: 'Thu', revenue: 30000 },
    { name: 'Fri', revenue: 65000 }, { name: 'Sat', revenue: 85000 }, { name: 'Sun', revenue: 55000 }
  ];

  const passDistribution = tickets.length > 0 ? [
    { name: 'VIP', value: tickets.filter((t: any) => t.passType?.includes('VIP')).length || 10, color: '#D4AF37' },
    { name: 'Regular', value: tickets.filter((t: any) => !t.passType?.includes('VIP')).length || 40, color: '#5A0000' }
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
    <div className="p-8 space-y-8">
      
      {/* Quick Actions Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Overview</h1>
          <p className="text-gray-500 text-sm">Welcome back to the Admin Dashboard.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={exportCSV} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <Link href="/" target="_blank" className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors">
            <ExternalLink className="w-4 h-4" /> Public Site
          </Link>
          <Link href="/admin/events/new" className="flex items-center gap-2 bg-navratri-primary text-white hover:bg-red-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm shadow-purple-500/20 transition-all">
            <Plus className="w-4 h-4" /> Create Event
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className={`rounded-3xl p-6 shadow-sm border border-gray-100/50 ${stat.color} relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-black/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-serif font-bold mb-1">{stat.value}</p>
              <p className="text-sm font-medium opacity-80">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-serif font-bold text-gray-900">Revenue Performance</h3>
            <div className="bg-gray-50 p-1 rounded-lg border border-gray-100 flex text-xs font-bold text-gray-500">
              {['daily', 'weekly', 'monthly'].map(f => (
                <button key={f} onClick={() => setFilter(f as any)} className={`px-3 py-1.5 rounded-md capitalize ${filter === f ? 'bg-white shadow-sm text-navratri-primary' : 'hover:text-gray-900'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          
          {bookings.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400">
              <TrendingUp className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm font-medium">No revenue data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip cursor={{ fill: '#f9fafb' }} formatter={(value: any) => formatCurrency(Number(value) || 0)} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="revenue" fill="#5A0000" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pass Distribution */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-serif font-bold text-gray-900 mb-6">Pass Distribution</h3>
          {passDistribution.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400">
              <PieChart className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm font-medium">No tickets sold yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={passDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                  {passDistribution.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
          {passDistribution.length > 0 && (
             <div className="flex justify-center gap-4 mt-4">
               {passDistribution.map(d => (
                 <div key={d.name} className="flex items-center gap-2 text-xs font-bold text-gray-600">
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
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-serif font-bold text-gray-900">Recent Bookings</h3>
            <button className="text-sm font-bold text-navratri-primary hover:text-red-700 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {bookings.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Ticket className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">No recent bookings</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-500 font-bold text-xs uppercase tracking-wider">
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.slice(0, 5).map((booking: any) => (
                    <tr key={booking.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{booking.customerName}</p>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{booking.id}</p>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">{formatCurrency(booking.totalAmount || booking.grandTotal || 0)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
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
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-serif font-bold text-gray-900">Upcoming Events</h3>
            <Link href="/admin/events" className="text-sm font-bold text-navratri-primary hover:text-red-700 flex items-center gap-1">
              Manage <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {events.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <CalendarDays className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">No upcoming events</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {events.slice(0, 4).map((event: any) => {
                const sold = (event.ticketTypes || []).reduce((sum: number, tt: any) => sum + (tt.soldQuantity || 0), 0);
                const total = (event.ticketTypes || []).reduce((sum: number, tt: any) => sum + (tt.totalInventory || 0), 0);
                const pct = total > 0 ? (sold / total) * 100 : 0;
                
                return (
                  <div key={event.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900 line-clamp-1">{event.title}</h4>
                        <p className="text-xs text-gray-500">{new Date(event.startDate).toLocaleDateString()} • {event.venue}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${event.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {event.status}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-gray-500">Tickets Sold</span>
                        <span className="text-navratri-primary">{sold} / {total}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-navratri-gold" style={{ width: `${pct}%` }}></div>
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
