'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, Loader2, Activity } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { AdminLog } from '@/types';
import toast from 'react-hot-toast';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/logs');
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      } else {
        toast.error('Failed to load audit logs');
      }
    } catch (error) {
      toast.error('Error fetching logs');
    }
    setLoading(false);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-[800] text-navratri-text flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-navratri-accent" /> Audit Logs
        </h1>
        <p className="text-[#6B7280] font-[500] mt-1">Permanent record of all sensitive admin actions.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-navratri-accent" />
            <p className="font-[600]">Loading logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Activity className="w-12 h-12 mb-4 text-gray-200" />
            <p className="font-[600]">No activity logged yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-[800] text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Actor</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Target ID</th>
                  <th className="px-6 py-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-[600] text-sm text-[#111111]">{formatDate(log.date)}</p>
                      <p className="text-xs text-gray-500">{new Date(log.date).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-bold">
                        {log.actor}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-sm text-navratri-accent uppercase tracking-wider text-[11px]">{log.action.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500 font-bold">
                      {log.targetId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
