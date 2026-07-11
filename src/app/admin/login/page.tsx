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
    <div className="min-h-screen bg-navratri-bg flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-navratri-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-navratri-gold/20 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(90,0,0,0.1)] border border-gray-100 p-8 sm:p-12">
          
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-navratri-primary rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-navratri-primary/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-10 h-10 bg-white/10 rounded-full blur-md"></div>
              <Shield className="w-10 h-10 text-navratri-gold relative z-10" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-navratri-text mb-2">Admin Portal</h1>
            <p className="text-gray-500 font-light">Enter your secure credentials</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Admin Email" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-navratri-gold focus:border-transparent font-medium text-navratri-text shadow-inner transition-all placeholder:text-gray-400"
                  required
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-navratri-gold focus:border-transparent font-medium text-navratri-text shadow-inner transition-all placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-navratri-gold text-navratri-primary font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-all text-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
            >
              {loading ? (
                <><Loader2 className="w-6 h-6 animate-spin" /> Authenticating...</>
              ) : (
                <>Access Dashboard <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-gray-400 font-medium">
            <p>&copy; {new Date().getFullYear()} Pass Navratri Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
