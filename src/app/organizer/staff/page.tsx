'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Loader2, ShieldAlert, Key, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrganizerStaff() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [assignedEventsStr, setAssignedEventsStr] = useState('');
  const [assignedGatesStr, setAssignedGatesStr] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/organizer/staff');
      const data = await res.json();
      if (res.ok && data.success) {
        setStaff(data.staff);
      } else {
        toast.error('Failed to load staff');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    
    // Parse comma separated values
    const assignedEvents = assignedEventsStr.split(',').map(s => s.trim()).filter(s => s);
    const assignedGates = assignedGatesStr.split(',').map(s => s.trim()).filter(s => s);

    if (assignedEvents.length === 0 || assignedGates.length === 0) {
      toast.error('Must provide at least one event ID and one gate name');
      setAdding(false);
      return;
    }

    try {
      const res = await fetch('/api/organizer/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobile, password, assignedEvents, assignedGates })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        toast.success('Staff added successfully');
        setStaff([data.staff, ...staff]);
        setIsAddModalOpen(false);
        // Reset form
        setName('');
        setMobile('');
        setPassword('');
        setAssignedEventsStr('');
        setAssignedGatesStr('');
      } else {
        toast.error(data.message || 'Failed to add staff');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 pb-20 bg-[#F7F7F8] min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-[900] tracking-tight text-[#111111]">Staff & Gates</h1>
          <p className="text-gray-500 font-[500] mt-1 text-sm">Manage scanner staff credentials and their assigned gates.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#111111] text-white px-5 py-2.5 rounded-xl font-[700] text-sm shadow-sm hover:bg-gray-900 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex h-64 items-center justify-center">
               <Loader2 className="w-8 h-8 text-[#9333EA] animate-spin" />
             </div>
          ) : staff.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                <Users className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-[800] text-[#111111]">No staff accounts found</h3>
              <p className="text-gray-500 font-[500] text-sm mt-1 max-w-sm mb-6">Create credentials for your event staff so they can use the RaasPass Scanner app.</p>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-[#9333EA] text-white px-6 py-3 rounded-xl font-[800] text-sm shadow-[0_0_20px_rgba(229,57,53,0.2)] hover:bg-[#7E22CE] transition-all"
              >
                Create Staff Account
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-white border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] font-[800] text-gray-500 uppercase tracking-wider">Staff Details</th>
                  <th className="px-6 py-4 text-left text-[11px] font-[800] text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-[11px] font-[800] text-gray-500 uppercase tracking-wider">Assigned Events</th>
                  <th className="px-6 py-4 text-left text-[11px] font-[800] text-gray-500 uppercase tracking-wider">Assigned Gates</th>
                  <th className="px-6 py-4 text-left text-[11px] font-[800] text-gray-500 uppercase tracking-wider">Added On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {staff.map((s: any) => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-[800] text-gray-600 border border-gray-200">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-[800] text-[#111111]">{s.name}</div>
                          <div className="text-xs font-[600] text-gray-500 font-mono mt-0.5">{s.mobile}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-[800] rounded-lg tracking-wide uppercase ${
                        s.active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {s.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(s.assignedEvents || []).map((ev: string) => (
                          <span key={ev} className="px-2 py-1 text-[10px] font-[700] bg-gray-100 text-gray-600 rounded-md border border-gray-200">
                            {ev}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(s.assignedGates || []).map((g: string) => (
                          <span key={g} className="px-2 py-1 text-[10px] font-[800] bg-[#9333EA]/10 text-[#9333EA] rounded-md border border-[#9333EA]/20 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {g}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-[600] text-gray-500">
                      {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-xl font-[900] text-[#111111]">Add Scanner Staff</h2>
                <p className="text-xs font-[600] text-gray-500 mt-1">Create credentials for the RaasPass Scanner App</p>
              </div>
              <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center shadow-sm">
                <ShieldAlert className="w-6 h-6 text-[#9333EA]" />
              </div>
            </div>
            
            <form onSubmit={handleAddStaff} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-[800] text-gray-500 uppercase tracking-wide mb-2">Staff Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9333EA]/20 focus:border-[#9333EA] font-[500] text-sm"
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
                <div>
                  <label className="block text-xs font-[800] text-gray-500 uppercase tracking-wide mb-2">Mobile Number</label>
                  <input 
                    type="tel" 
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9333EA]/20 focus:border-[#9333EA] font-[500] text-sm"
                    placeholder="10 digit mobile"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-[800] text-gray-500 uppercase tracking-wide mb-2">Login Password</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9333EA]/20 focus:border-[#9333EA] font-[500] text-sm"
                    placeholder="Set a secure password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-[800] text-gray-500 uppercase tracking-wide mb-2">Assigned Events (IDs)</label>
                <input 
                  type="text" 
                  value={assignedEventsStr}
                  onChange={e => setAssignedEventsStr(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9333EA]/20 focus:border-[#9333EA] font-[500] text-sm"
                  placeholder="e.g. evt-ahmedabad-royal-garba (comma separated)"
                />
                <p className="text-[10px] text-gray-400 font-[600] mt-1.5">Only include events assigned to you.</p>
              </div>

              <div>
                <label className="block text-xs font-[800] text-gray-500 uppercase tracking-wide mb-2">Assigned Gates</label>
                <input 
                  type="text" 
                  value={assignedGatesStr}
                  onChange={e => setAssignedGatesStr(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9333EA]/20 focus:border-[#9333EA] font-[500] text-sm"
                  placeholder="e.g. VIP Gate, Gate 1, Gate 2 (comma separated)"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-[700] rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={adding}
                  className="flex-1 px-4 py-3 bg-[#9333EA] text-white font-[800] rounded-xl hover:bg-[#7E22CE] shadow-[0_0_20px_rgba(229,57,53,0.2)] transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
