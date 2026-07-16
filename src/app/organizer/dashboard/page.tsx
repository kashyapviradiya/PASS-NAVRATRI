'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Users, Ticket, ArrowUpRight, Loader2, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export default function OrganizerDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Dummy chart data for now
  const revenueData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 2000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 1890 },
    { name: 'Sat', revenue: 2390 },
    { name: 'Sun', revenue: 3490 },
  ];

  const salesData = [
    { name: 'Mon', tickets: 40 },
    { name: 'Tue', tickets: 30 },
    { name: 'Wed', tickets: 20 },
    { name: 'Thu', tickets: 27 },
    { name: 'Fri', tickets: 18 },
    { name: 'Sat', tickets: 23 },
    { name: 'Sun', tickets: 34 },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/organizer/stats');
      const data = await res.json();
      if (res.ok && data.success) {
        setStats(data.stats);
      } else {
        toast.error('Failed to load stats');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-navratri-bg">
        <Loader2 className="w-8 h-8 text-navratri-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 selection:bg-navratri-accent selection:text-white max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[32px] font-display font-[700] tracking-tight text-navratri-text">Dashboard</h1>
          <p className="text-navratri-muted font-[500] mt-1 text-[15px]">Welcome back! Here's what's happening across your assigned events.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-card border border-navratri-lightGrey shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-[12px] flex items-center justify-center text-green-600 border border-green-100">
              <BarChart3 className="w-6 h-6" />
            </div>
            <span className="flex items-center text-green-600 text-[12px] font-[700] bg-green-50 px-2.5 py-1 rounded-[8px] border border-green-100 uppercase tracking-widest">
              <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> Today: {formatCurrency(stats?.todaySales || 0)}
            </span>
          </div>
          <h3 className="text-navratri-muted text-[13px] font-[700] uppercase tracking-widest">Total Revenue</h3>
          <p className="text-[32px] font-display font-[700] text-navratri-text tracking-tight mt-1">{formatCurrency(stats?.totalRevenue || 0)}</p>
        </div>

        <div className="bg-white p-6 rounded-card border border-navratri-lightGrey shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-navratri-accent/10 rounded-[12px] flex items-center justify-center text-navratri-accent border border-navratri-accent/20">
              <Ticket className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-navratri-muted text-[13px] font-[700] uppercase tracking-widest">Tickets Sold</h3>
          <p className="text-[32px] font-display font-[700] text-navratri-text tracking-tight mt-1">{stats?.ticketsSold || 0} <span className="text-[14px] font-[600] text-navratri-muted font-sans tracking-normal lowercase">passes</span></p>
        </div>

        <div className="bg-white p-6 rounded-card border border-navratri-lightGrey shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center text-blue-600 border border-blue-100">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-navratri-muted text-[13px] font-[700] uppercase tracking-widest">Total Check-ins</h3>
          <p className="text-[32px] font-display font-[700] text-navratri-text tracking-tight mt-1">{stats?.totalCheckins || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-card border border-navratri-lightGrey shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-[12px] flex items-center justify-center text-orange-600 border border-orange-100">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-navratri-muted text-[13px] font-[700] uppercase tracking-widest">Remaining Inventory</h3>
          <p className="text-[32px] font-display font-[700] text-navratri-text tracking-tight mt-1">{stats?.remainingInventory || 0} <span className="text-[14px] font-[600] text-navratri-muted font-sans tracking-normal lowercase">passes</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Charts */}
        <div className="bg-white p-6 rounded-card border border-navratri-lightGrey shadow-sm">
          <h3 className="text-[18px] font-display font-[700] text-navratri-text mb-6">Revenue Over Time</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E8E8" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A3A3A3', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A3A3A3', fontWeight: 600 }} dx={-10} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: '1px solid #E8E8E8', boxShadow: '0 4px 20px rgb(0 0 0 / 0.05)' }}
                  labelStyle={{ fontWeight: 700, color: '#090909', fontFamily: 'var(--font-outfit)' }}
                  itemStyle={{ fontWeight: 600 }}
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-card border border-navratri-lightGrey shadow-sm">
          <h3 className="text-[18px] font-display font-[700] text-navratri-text mb-6">Ticket Sales Over Time</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E8E8" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A3A3A3', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A3A3A3', fontWeight: 600 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: '1px solid #E8E8E8', boxShadow: '0 4px 20px rgb(0 0 0 / 0.05)' }}
                  labelStyle={{ fontWeight: 700, color: '#090909', fontFamily: 'var(--font-outfit)' }}
                  itemStyle={{ fontWeight: 600, color: '#E53935' }}
                  cursor={{ fill: '#F8F7F4' }}
                />
                <Bar dataKey="tickets" fill="#E53935" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
