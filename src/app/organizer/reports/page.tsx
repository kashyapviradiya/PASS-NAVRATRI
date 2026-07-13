'use client';

import { useState } from 'react';
import { Download, FileText, Ticket, ScanLine, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrganizerReports() {
  const [downloading, setDownloading] = useState(false);

  const handleExport = async (type: 'bookings' | 'checkins') => {
    setDownloading(true);
    try {
      const res = await fetch(`/api/organizer/reports/export?type=${type}`);
      if (!res.ok) throw new Error('Export failed');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      toast.success(`${type === 'bookings' ? 'Bookings' : 'Check-ins'} report downloaded`);
    } catch (error) {
      toast.error('Failed to export report');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8 pb-20 bg-[#F7F7F8] min-h-screen">
      <div>
        <h1 className="text-3xl font-[900] tracking-tight text-[#111111]">Reports & Exports</h1>
        <p className="text-gray-500 font-[500] mt-1 text-sm">Download your event data in CSV format for accounting and analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Bookings Report */}
        <div className="bg-white p-6 sm:p-8 rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#9333EA]/10 rounded-2xl flex items-center justify-center mb-6">
            <Ticket className="w-8 h-8 text-[#9333EA]" />
          </div>
          <h2 className="text-xl font-[800] text-[#111111] mb-2">Bookings Report</h2>
          <p className="text-gray-500 text-sm font-[500] mb-8">
            Export all paid bookings including customer details, ticket types, and revenue amounts.
          </p>
          <button 
            onClick={() => handleExport('bookings')}
            disabled={downloading}
            className="w-full bg-[#111111] text-white px-6 py-3.5 rounded-xl font-[800] text-sm shadow-md hover:bg-gray-900 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <Download className="w-4 h-4" /> Download Bookings CSV
          </button>
        </div>

        {/* Check-ins Report */}
        <div className="bg-white p-6 sm:p-8 rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
            <ScanLine className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-[800] text-[#111111] mb-2">Check-ins Report</h2>
          <p className="text-gray-500 text-sm font-[500] mb-8">
            Export a complete log of all ticket scans, including timestamps, gates, and staff IDs.
          </p>
          <button 
            onClick={() => handleExport('checkins')}
            disabled={downloading}
            className="w-full bg-white border border-gray-200 text-[#111111] px-6 py-3.5 rounded-xl font-[800] text-sm shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <Download className="w-4 h-4" /> Download Check-ins CSV
          </button>
        </div>

      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-[1.5rem] p-6 flex gap-4 mt-8">
        <AlertCircle className="w-6 h-6 text-blue-600 shrink-0" />
        <div>
          <h3 className="font-[800] text-blue-900 text-sm">Data Privacy Notice</h3>
          <p className="text-sm text-blue-800/80 font-[500] mt-1">
            Downloaded reports contain sensitive customer data including names and contact information. Ensure you handle this data securely and in compliance with your local privacy regulations.
          </p>
        </div>
      </div>
    </div>
  );
}
