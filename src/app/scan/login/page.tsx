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
    <div className="min-h-screen bg-[#111111] flex flex-col justify-center px-6 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#E53935] rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(229,57,53,0.4)]">
            <ScanLine className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-center text-2xl font-[800] leading-9 tracking-tight text-white">
          RaasPass Scanner
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400 font-[500]">
          Staff Entry Validation System
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-[600] leading-6 text-gray-300">
              Mobile Number
            </label>
            <div className="mt-2">
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="block w-full rounded-xl border-0 bg-gray-900 py-3.5 px-4 text-white shadow-sm ring-1 ring-inset ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-[#E53935] sm:text-sm sm:leading-6"
                placeholder="Enter 10-digit number"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-[600] leading-6 text-gray-300">
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border-0 bg-gray-900 py-3.5 px-4 text-white shadow-sm ring-1 ring-inset ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-[#E53935] sm:text-sm sm:leading-6"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center items-center rounded-xl bg-[#E53935] px-3 py-3.5 text-sm font-[800] leading-6 text-white shadow-sm hover:bg-[#D32F2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E53935] disabled:opacity-70 transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In to Scanner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
