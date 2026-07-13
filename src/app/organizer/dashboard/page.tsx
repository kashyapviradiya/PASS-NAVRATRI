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
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-[#F7F7F8]">
        <Loader2 className="w-8 h-8 text-[#9333EA] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 pb-20 bg-[#F7F7F8] min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-[900] tracking-tight text-[#111111]">Dashboard</h1>
          <p className="text-gray-500 font-[500] mt-1 text-sm">Welcome back! Here's what's happening across your assigned events.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <BarChart3 className="w-6 h-6" />
            </div>
            <span className="flex items-center text-green-600 text-sm font-[700] bg-green-50 px-2 py-1 rounded-lg">
              <ArrowUpRight className="w-4 h-4 mr-1" /> Today: {formatCurrency(stats?.todaySales || 0)}
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-[600]">Total Revenue</h3>
          <p className="text-3xl font-[900] text-[#111111] tracking-tight mt-1">{formatCurrency(stats?.totalRevenue || 0)}</p>
        </div>

        <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-[#9333EA]/10 rounded-xl flex items-center justify-center text-[#9333EA]">
              <Ticket className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-[600]">Tickets Sold</h3>
          <p className="text-3xl font-[900] text-[#111111] tracking-tight mt-1">{stats?.ticketsSold || 0} <span className="text-sm font-[600] text-gray-400">passes</span></p>
        </div>

        <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-[600]">Total Check-ins</h3>
          <p className="text-3xl font-[900] text-[#111111] tracking-tight mt-1">{stats?.totalCheckins || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-[600]">Remaining Inventory</h3>
          <p className="text-3xl font-[900] text-[#111111] tracking-tight mt-1">{stats?.remainingInventory || 0} <span className="text-sm font-[600] text-gray-400">passes</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Charts */}
        <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <h3 className="text-lg font-[800] text-[#111111] mb-6">Revenue Over Time</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dx={-10} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 700, color: '#111111' }}
                  itemStyle={{ fontWeight: 600 }}
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <h3 className="text-lg font-[800] text-[#111111] mb-6">Ticket Sales Over Time</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 700, color: '#111111' }}
                  itemStyle={{ fontWeight: 600, color: '#9333EA' }}
                  cursor={{ fill: '#F3F4F6' }}
                />
                <Bar dataKey="tickets" fill="#9333EA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
