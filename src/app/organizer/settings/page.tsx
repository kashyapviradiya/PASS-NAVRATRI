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
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8 pb-20 bg-navratri-bg min-h-screen">
      <div>
        <h1 className="text-[32px] font-display font-bold tracking-tight text-navratri-dark">Settings</h1>
        <p className="text-navratri-muted font-medium mt-1 text-[15px]">Manage your organizer account preferences and security.</p>
      </div>

      <div className="card-base overflow-hidden">
        <div className="p-6 border-b border-navratri-border flex items-center gap-3 bg-navratri-softBg/50">
          <Lock className="w-5 h-5 text-navratri-muted" />
          <h2 className="text-lg font-bold text-navratri-dark">Security & Password</h2>
        </div>
        
        <form onSubmit={handlePasswordUpdate} className="p-6 space-y-5">
          <div className="max-w-md space-y-5">
            <div>
              <label className="block text-xs font-bold text-navratri-muted uppercase tracking-wide mb-2">Current Password</label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
                className="input-field"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-navratri-muted uppercase tracking-wide mb-2">New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                className="input-field"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-navratri-muted uppercase tracking-wide mb-2">Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="input-field"
                placeholder="Confirm new password"
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              disabled={updating}
              className="btn-primary flex items-center gap-2"
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
