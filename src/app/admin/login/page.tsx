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
    <div className="min-h-screen bg-navratri-bg flex items-center justify-center p-4 font-sans relative overflow-hidden selection:bg-navratri-accent selection:text-white">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-navratri-accent/5 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-card shadow-sm border border-navratri-lightGrey p-8 sm:p-12">
          
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-navratri-accent/10 rounded-[16px] flex items-center justify-center mx-auto mb-6 shadow-sm border border-navratri-accent/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-10 h-10 bg-white/40 rounded-full blur-md"></div>
              <Shield className="w-10 h-10 text-navratri-accent relative z-10" />
            </div>
            <h1 className="text-[32px] font-display font-[700] text-navratri-text tracking-tight mb-2">Admin Portal</h1>
            <p className="text-navratri-muted font-[500] text-[15px]">Enter your secure credentials</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navratri-muted" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Admin Email" 
                  className="w-full pl-12 pr-4 py-4 bg-navratri-bg border border-navratri-lightGrey rounded-[14px] focus:outline-none focus:ring-1 focus:ring-navratri-accent focus:border-navratri-accent font-[500] text-navratri-text transition-all placeholder:text-navratri-muted text-[15px]"
                  required
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navratri-muted" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password" 
                  className="w-full pl-12 pr-4 py-4 bg-navratri-bg border border-navratri-lightGrey rounded-[14px] focus:outline-none focus:ring-1 focus:ring-navratri-accent focus:border-navratri-accent font-[500] text-navratri-text transition-all placeholder:text-navratri-muted text-[15px]"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-navratri-accent text-white font-[700] py-4 rounded-button flex items-center justify-center gap-2 hover:bg-navratri-darkAccent hover:-translate-y-0.5 shadow-sm transition-all text-[15px] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-6"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Authenticating...</>
              ) : (
                <>Access Dashboard <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-[12px] text-navratri-muted font-[600]">
            <p>&copy; {new Date().getFullYear()} RasPass Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
