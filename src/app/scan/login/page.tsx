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
    <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center px-6 py-12 selection:bg-[#00E5FF] selection:text-white relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-sm relative z-10">
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-[28px] shadow-2xl border border-slate-800 p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 shadow-inner">
              <ScanLine className="w-8 h-8 text-[#00E5FF]" />
            </div>
          </div>
          <h2 className="text-center text-[28px] font-display font-[800] leading-9 tracking-tight text-white mb-2">
            Scanner Portal
          </h2>
          <p className="text-center text-[14px] text-slate-400 font-[500] mb-8">
            Staff Entry Validation System
          </p>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-[12px] font-[700] leading-6 text-slate-400 uppercase tracking-widest mb-1">
                Mobile Number
              </label>
              <div className="mt-2">
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="block w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3.5 px-4 text-white placeholder-slate-500 focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] sm:text-[15px] outline-none transition-all"
                  placeholder="Enter 10-digit number"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-[700] leading-6 text-slate-400 uppercase tracking-widest mb-1">
                Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3.5 px-4 text-white placeholder-slate-500 focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] sm:text-[15px] outline-none transition-all"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center items-center rounded-xl bg-[#00E5FF] hover:bg-[#00B4D8] px-3 py-4 text-[15px] font-[800] text-slate-900 shadow-[0_0_20px_rgba(0,229,255,0.3)] disabled:opacity-70 transition-all hover:-translate-y-0.5"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In to Scanner'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
