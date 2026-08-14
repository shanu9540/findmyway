"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Compass, Mail, Lock, LogIn, ArrowRight, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, googleLogin, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // If already logged in, redirect to target page or dashboard
  useEffect(() => {
    if (user) {
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get('redirect');
      if (redirectUrl) {
        router.push(decodeURIComponent(redirectUrl));
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFormLoading(true);

    try {
      await login(email, password);
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get('redirect');
      if (redirectUrl) {
        router.push(decodeURIComponent(redirectUrl));
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleGoogleMockLogin = async () => {
    setError('');
    setFormLoading(true);
    try {
      // Simulate Google Sign-in data payload
      await googleLogin('travelexplorer@gmail.com', 'Travel Explorer', 'g-oauth-1004928');
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get('redirect');
      if (redirectUrl) {
        router.push(decodeURIComponent(redirectUrl));
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Google mock login failed.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-16 px-4 bg-slate-50 relative overflow-hidden">
      {/* Ambient backgrounds */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-200/20 rounded-full filter blur-3xl" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-sky-200/20 rounded-full filter blur-3xl" />

      <div className="max-w-md w-full bg-white border border-slate-100 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="bg-indigo-50 p-3 rounded-2xl inline-block">
            <Compass className="h-8 w-8 text-indigo-650 animate-spin-slow" />
          </div>
          <h2 className="font-extrabold text-2xl text-slate-800">Sign In to FindMyWay</h2>
          <p className="text-xs text-slate-400">Welcome back! Manage your bookings and custom itineraries.</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3.5 rounded-xl flex items-center gap-2 text-xs font-semibold">
            <ShieldAlert className="h-4.5 w-4.5 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full text-sm font-semibold outline-none bg-slate-50 focus:bg-white border border-slate-100 focus:border-indigo-500 rounded-xl pl-11 pr-4 py-3 text-slate-700"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase text-slate-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm font-semibold outline-none bg-slate-50 focus:bg-white border border-slate-100 focus:border-indigo-500 rounded-xl pl-11 pr-4 py-3 text-slate-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={formLoading || loading}
            className="w-full bg-indigo-600 hover:bg-indigo-750 disabled:opacity-50 text-white font-bold text-sm py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-150 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <LogIn className="h-4.5 w-4.5" />
            {formLoading ? 'Verifying Details...' : 'Sign In'}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-150"></div>
          <span className="flex-shrink mx-4 text-xs font-bold text-slate-350 uppercase">Or</span>
          <div className="flex-grow border-t border-slate-150"></div>
        </div>

        {/* Mock Google Login */}
        <button
          type="button"
          onClick={handleGoogleMockLogin}
          className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
        >
          {/* Simple custom Google logo SVG */}
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.428-2.519 4.114-5.136 4.114-3.478 0-6.3-2.822-6.3-6.3 0-3.478 2.822-6.3 6.3-6.3 1.506 0 2.88.536 3.96 1.439l3.033-3.033C18.966 2.376 15.786 1 12.24 1 6.037 1 1 6.037 1 12.24s5.037 11.24 11.24 11.24c5.808 0 10.748-4.148 10.748-11.24 0-.668-.063-1.31-.18-1.954H12.24z"
            />
          </svg>
          Google Fast Login (Demo)
        </button>

        <p className="text-xs text-slate-400 text-center">
          Don't have an account?{' '}
          <Link href="/register" className="text-indigo-650 font-bold hover:underline inline-flex items-center gap-0.5">
            Create account <ArrowRight className="h-3 w-3" />
          </Link>
        </p>
      </div>
    </div>
  );
}
