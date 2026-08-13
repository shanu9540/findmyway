"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Compass, Mail, User, ShieldAlert, LogIn, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { user, register, loading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFormLoading(true);

    try {
      await register(name, email);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try a different email.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-16 px-4 bg-slate-50 relative overflow-hidden">
      {/* Ambient lights */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-200/20 rounded-full filter blur-3xl" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-sky-200/20 rounded-full filter blur-3xl" />

      <div className="max-w-md w-full bg-white border border-slate-100 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="bg-indigo-50 p-3 rounded-2xl inline-block">
            <Compass className="h-8 w-8 text-indigo-650 animate-spin-slow" />
          </div>
          <h2 className="font-extrabold text-2xl text-slate-800">Create FindMyWay Account</h2>
          <p className="text-xs text-slate-400">Join us to save plans, write reviews, and book holiday packages.</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3.5 rounded-xl flex items-center gap-2 text-xs font-semibold">
            <ShieldAlert className="h-4.5 w-4.5 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase text-slate-400">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full text-sm font-semibold outline-none bg-slate-50 focus:bg-white border border-slate-100 focus:border-indigo-500 rounded-xl pl-11 pr-4 py-3 text-slate-700"
              />
            </div>
          </div>

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
            <p className="text-[10px] text-slate-400">We will auto-generate a secure demo password for you.</p>
          </div>

          <button
            type="submit"
            disabled={formLoading || loading}
            className="w-full bg-indigo-600 hover:bg-indigo-750 disabled:opacity-50 text-white font-bold text-sm py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-150 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <Compass className="h-4.5 w-4.5" />
            {formLoading ? 'Creating Profile...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-xs text-slate-400 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-650 font-bold hover:underline inline-flex items-center gap-0.5">
            Sign In <ArrowRight className="h-3 w-3" />
          </Link>
        </p>
      </div>
    </div>
  );
}
