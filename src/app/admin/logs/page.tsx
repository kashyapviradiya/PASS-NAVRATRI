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
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-navratri-dark flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-navratri-primary" /> Audit Logs
        </h1>
        <p className="text-navratri-muted font-medium mt-1 text-sm">Permanent record of all sensitive admin actions.</p>
      </div>

      <div className="card-base overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-navratri-muted">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-navratri-primary" />
            <p className="font-semibold text-sm">Loading logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-navratri-muted">
            <Activity className="w-12 h-12 mb-4 text-navratri-border" />
            <p className="font-semibold text-sm">No activity logged yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="table-header">Timestamp</th>
                  <th className="table-header">Actor</th>
                  <th className="table-header">Action</th>
                  <th className="table-header">Target ID</th>
                  <th className="table-header">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-navratri-softBg/50 transition-colors">
                    <td className="table-cell">
                      <p className="font-bold text-sm text-navratri-dark">{formatDate(log.date)}</p>
                      <p className="text-xs text-navratri-muted font-medium mt-0.5">{new Date(log.date).toLocaleTimeString()}</p>
                    </td>
                    <td className="table-cell">
                      <span className="badge-neutral">
                        {log.actor}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="badge-primary">
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="table-cell font-mono text-xs text-navratri-muted">
                      {log.targetId}
                    </td>
                    <td className="table-cell text-sm text-navratri-text">
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
