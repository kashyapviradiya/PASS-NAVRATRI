'use client';

import { useState, useEffect } from 'react';
import { ScanLine, Loader2, Calendar, Search, MapPin, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrganizerCheckins() {
  const [checkins, setCheckins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState(true);

  const fetchCheckins = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const res = await fetch('/api/organizer/checkins?limit=100');
      const data = await res.json();
      if (res.ok && data.success) {
        setCheckins(data.checkins);
        setLastUpdated(new Date());
      }
    } catch (error) {
      toast.error('Network error fetching checkins');
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckins(true);
    
    let interval: NodeJS.Timeout;
    if (isLive) {
      interval = setInterval(() => {
        fetchCheckins(false);
      }, 5000); // poll every 5 seconds for "live" feel
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive]);

  return (
    <div className="p-6 lg:p-10 max-w-[1000px] mx-auto space-y-8 pb-20 bg-[#F7F7F8] min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-[900] tracking-tight text-[#111111] flex items-center gap-3">
            Live Check-ins
            {isLive && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-[#9333EA] text-xs font-[800] rounded-full tracking-wide uppercase">
                <span className="w-1.5 h-1.5 bg-[#9333EA] rounded-full animate-pulse"></span> Live
              </span>
            )}
          </h1>
          <p className="text-gray-500 font-[500] mt-1 text-sm">Real-time feed of ticket validations across all active gates.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-[600] text-gray-400">Last updated: {lastUpdated.toLocaleTimeString()}</span>
          <button 
            onClick={() => setIsLive(!isLive)}
            className={`btn-primary px-4 py-2 ${!isLive ? '' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
          >
            {isLive ? 'Pause Live Feed' : 'Resume Live Feed'}
          </button>
        </div>
      </div>

      <div className="card-base overflow-hidden">
        {loading && checkins.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#9333EA] animate-spin" />
          </div>
        ) : checkins.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
              <ScanLine className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-[800] text-[#111111]">No check-ins yet</h3>
            <p className="text-gray-500 font-[500] text-sm mt-1 max-w-sm">When staff scan tickets at the gates, they will appear here in real-time.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 hidden md:block">
            <table className="w-full">
              <thead className="bg-white border-b border-gray-100">
                <tr>
                  <th className="table-header">Customer & Ticket</th>
                  <th className="table-header">Gate</th>
                  <th className="table-header">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {checkins.map((scan) => (
                  <tr key={scan.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="table-cell">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                          scan.status === 'valid' ? 'bg-green-50 text-green-600' : 
                          scan.status === 'used' ? 'bg-red-50 text-[#9333EA]' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {scan.status === 'valid' ? <CheckCircle className="w-5 h-5" /> : <ScanLine className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-[800] text-[#111111]">{scan.ticketDetails?.customerName || 'Unknown Customer'}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-[700] text-gray-500 uppercase tracking-wide bg-gray-100 px-1.5 py-0.5 rounded">
                              {scan.ticketDetails?.ticketType || 'Pass'}
                            </span>
                            <span className="text-[10px] font-[600] text-gray-400 font-mono">
                              {scan.ticketId || 'No ID'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1.5 text-xs font-[600] text-gray-700 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 inline-flex">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {scan.gateName || 'Main Gate'}
                      </div>
                    </td>
                    <td className="table-cell text-xs font-[600] text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {scan.timestamp ? new Date(scan.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}) : 'Just now'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Mobile cards view */}
        <div className="md:hidden divide-y divide-gray-50">
          {checkins.map((scan) => (
             <div key={scan.id} className="p-4 hover:bg-gray-50/50 transition-colors flex flex-col gap-3">
               <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    scan.status === 'valid' ? 'bg-green-50 text-green-600' : 
                    scan.status === 'used' ? 'bg-red-50 text-[#9333EA]' : 'bg-orange-50 text-orange-600'
                  }`}>
                    {scan.status === 'valid' ? <CheckCircle className="w-5 h-5" /> : <ScanLine className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-[800] text-[#111111]">{scan.ticketDetails?.customerName || 'Unknown Customer'}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-[700] text-gray-500 uppercase tracking-wide bg-gray-100 px-1.5 py-0.5 rounded">
                        {scan.ticketDetails?.ticketType || 'Pass'}
                      </span>
                      <span className="text-[10px] font-[600] text-gray-400 font-mono">
                        {scan.ticketId || 'No ID'}
                      </span>
                    </div>
                  </div>
               </div>
               <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1.5 text-xs font-[600] text-gray-700 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 inline-flex">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    {scan.gateName || 'Main Gate'}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-[600] text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    {scan.timestamp ? new Date(scan.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}) : 'Just now'}
                  </div>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
