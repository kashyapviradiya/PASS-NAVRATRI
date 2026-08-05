'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScanFace, Key, Loader2, ArrowRight, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StaffLogin() {
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
        body: JSON.stringify({ email, password, role: 'scanner_staff' })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        toast.success('Scanner Access Granted');
        router.push('/staff/scanner');
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
    <div className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden selection:bg-navratri-accent selection:text-white" style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 60%, #312E81 100%)' }}>
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-navratri-accent/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-navratri-primary/20 rounded-full blur-[120px]"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-[28px] shadow-glass border border-white/10 p-8 sm:p-12 relative overflow-hidden">
          
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white/[0.06] rounded-[16px] flex items-center justify-center mx-auto mb-6 shadow-sm relative overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 w-10 h-10 bg-navratri-accent/20 rounded-full blur-md"></div>
              <ScanFace className="w-10 h-10 text-navratri-accent relative z-10" />
            </div>
            <h1 className="text-[32px] font-display font-[800] text-white mb-2 tracking-tight">Staff Portal</h1>
            <p className="text-slate-300 font-[500] text-[15px]">Enter your secure credentials to access the ticket scanner</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-slate-300 text-[13px] font-[700] uppercase tracking-widest mb-2">Staff Email</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@passnavratri.com" 
                  className="w-full pl-12 pr-5 py-4 bg-white/[0.06] border border-white/10 rounded-[16px] focus:outline-none focus:ring-1 focus:ring-navratri-primary/30 focus:border-navratri-primary/50 font-[500] text-[15px] text-white transition-all placeholder-slate-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-300 text-[13px] font-[700] uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-5 py-4 bg-white/[0.06] border border-white/10 rounded-[16px] focus:outline-none focus:ring-1 focus:ring-navratri-primary/30 focus:border-navratri-primary/50 font-[500] text-[15px] text-white transition-all placeholder-slate-500"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-premium text-white font-[800] py-4 rounded-button flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 shadow-premium transition-all text-[15px] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-6"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Authenticating...</>
              ) : (
                <>Access Scanner <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-[12px] text-slate-400 font-[600]">
            <p>&copy; {new Date().getFullYear()} RasPass Staff</p>
          </div>
        </div>
      </div>
    </div>
  );
}
