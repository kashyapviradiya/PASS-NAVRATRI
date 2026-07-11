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
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-[#E53935] text-xs font-[800] rounded-full tracking-wide uppercase">
                <span className="w-1.5 h-1.5 bg-[#E53935] rounded-full animate-pulse"></span> Live
              </span>
            )}
          </h1>
          <p className="text-gray-500 font-[500] mt-1 text-sm">Real-time feed of ticket validations across all active gates.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-[600] text-gray-400">Last updated: {lastUpdated.toLocaleTimeString()}</span>
          <button 
            onClick={() => setIsLive(!isLive)}
            className={`px-4 py-2 rounded-xl font-[700] text-sm transition-all border ${
              isLive ? 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50' : 'bg-[#E53935] text-white border-[#E53935] shadow-md shadow-[#E53935]/20'
            }`}
          >
            {isLive ? 'Pause Live Feed' : 'Resume Live Feed'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        {loading && checkins.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#E53935] animate-spin" />
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
          <div className="divide-y divide-gray-50">
            {checkins.map((scan) => (
              <div key={scan.id} className="p-4 sm:p-5 hover:bg-gray-50/50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    scan.status === 'valid' ? 'bg-green-50 text-green-600' : 
                    scan.status === 'used' ? 'bg-red-50 text-[#E53935]' : 'bg-orange-50 text-orange-600'
                  }`}>
                    {scan.status === 'valid' ? <CheckCircle className="w-6 h-6" /> : <ScanLine className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="text-base font-[800] text-[#111111]">{scan.ticketDetails?.customerName || 'Unknown Customer'}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-[700] text-gray-500 uppercase tracking-wide bg-gray-100 px-2 py-0.5 rounded">
                        {scan.ticketDetails?.ticketType || 'Pass'}
                      </span>
                      <span className="text-xs font-[600] text-gray-400 font-mono">
                        {scan.ticketId || 'No ID'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 sm:gap-1">
                  <div className="flex items-center gap-1.5 text-sm font-[600] text-gray-700 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
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
        )}
      </div>
    </div>
  );
}
