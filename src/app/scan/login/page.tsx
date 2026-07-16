'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScanLine, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ScannerLogin() {
  const router = useRouter();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/staff-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, password }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Login successful');
        // We will store the staff name locally just for display purposes, security is handled by the httpOnly cookie
        localStorage.setItem('scanner_staff_name', data.staff.name);
        if (data.staff.assignedGates && data.staff.assignedGates.length > 0) {
          localStorage.setItem('scanner_gates', JSON.stringify(data.staff.assignedGates));
        }
        if (data.staff.assignedEvents && data.staff.assignedEvents.length > 0) {
          localStorage.setItem('scanner_events', JSON.stringify(data.staff.assignedEvents));
        }
        router.push('/scan');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navratri-primary flex flex-col justify-center px-6 py-12 selection:bg-navratri-accent selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-navratri-accent/10 rounded-[16px] flex items-center justify-center shadow-lg shadow-navratri-accent/20 border border-navratri-accent/20">
            <ScanLine className="w-8 h-8 text-navratri-accent" />
          </div>
        </div>
        <h2 className="text-center text-[28px] font-display font-[700] leading-9 tracking-tight text-white">
          RasPass Scanner
        </h2>
        <p className="mt-2 text-center text-[15px] text-white/60 font-[500]">
          Staff Entry Validation System
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-[13px] font-[600] leading-6 text-white/80 uppercase tracking-widest">
              Mobile Number
            </label>
            <div className="mt-2">
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="block w-full rounded-[14px] border-0 bg-white/5 py-3.5 px-4 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-1 focus:ring-inset focus:ring-navratri-accent sm:text-[15px] sm:leading-6 font-[500] outline-none transition-all"
                placeholder="Enter 10-digit number"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-[13px] font-[600] leading-6 text-white/80 uppercase tracking-widest">
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-[14px] border-0 bg-white/5 py-3.5 px-4 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-1 focus:ring-inset focus:ring-navratri-accent sm:text-[15px] sm:leading-6 font-[500] outline-none transition-all"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center items-center rounded-button bg-navratri-accent px-3 py-4 text-[15px] font-[700] leading-6 text-white shadow-sm hover:bg-navratri-darkAccent disabled:opacity-70 transition-all hover:-translate-y-0.5 mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In to Scanner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
