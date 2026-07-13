'use client';

import { useState } from 'react';
import { Settings, Lock, User, Building, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrganizerSettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updating, setUpdating] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setUpdating(true);
    try {
      const res = await fetch('/api/organizer/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.message || 'Failed to update password');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8 pb-20 bg-[#F7F7F8] min-h-screen">
      <div>
        <h1 className="text-3xl font-[900] tracking-tight text-[#111111]">Settings</h1>
        <p className="text-gray-500 font-[500] mt-1 text-sm">Manage your organizer account preferences and security.</p>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <Lock className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-[800] text-[#111111]">Security & Password</h2>
        </div>
        
        <form onSubmit={handlePasswordUpdate} className="p-6 space-y-5">
          <div className="max-w-md space-y-5">
            <div>
              <label className="block text-xs font-[800] text-gray-500 uppercase tracking-wide mb-2">Current Password</label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9333EA]/20 focus:border-[#9333EA] font-[500] text-sm"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-xs font-[800] text-gray-500 uppercase tracking-wide mb-2">New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9333EA]/20 focus:border-[#9333EA] font-[500] text-sm"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-xs font-[800] text-gray-500 uppercase tracking-wide mb-2">Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9333EA]/20 focus:border-[#9333EA] font-[500] text-sm"
                placeholder="Confirm new password"
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              disabled={updating}
              className="px-6 py-3 bg-[#111111] text-white font-[800] rounded-xl hover:bg-gray-900 shadow-md transition-all text-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
