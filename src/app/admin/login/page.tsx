'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Key, Loader2, ArrowRight, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'admin' })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        toast.success('Access Granted');
        router.push('/admin/dashboard');
      } else {
        toast.error(data.message || 'Invalid credentials');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden selection:bg-navratri-accent selection:text-white bg-navratri-bg">
      
      <div className="w-full max-w-md relative z-10">
        <div className="card-base p-8 sm:p-12 relative overflow-hidden">
          
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-navratri-lightGrey rounded-[16px] flex items-center justify-center mx-auto mb-6 shadow-sm relative overflow-hidden">
              <img src="/brand/raaspass-logo.svg" alt="RaasPass Logo" className="h-12 w-auto object-contain relative z-10" />
            </div>
            <h1 className="text-[32px] font-display font-[800] text-navratri-text tracking-tight mb-2">Admin Portal</h1>
            <p className="text-navratri-muted font-[500] text-[15px]">Enter your secure credentials</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-navratri-muted text-[13px] font-[700] uppercase tracking-widest mb-2">Admin Email</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navratri-muted" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@passnavratri.com" 
                  className="input-field w-full pl-12"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-navratri-muted text-[13px] font-[700] uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navratri-muted" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="input-field w-full pl-12"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 mt-6 flex justify-center items-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Authenticating...</>
              ) : (
                <>Access Dashboard <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-[12px] text-slate-400 font-[600]">
            <p>&copy; {new Date().getFullYear()} RaasPass Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
