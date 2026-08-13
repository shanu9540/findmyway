"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, LayoutDashboard, Compass, Sparkles } from 'lucide-react';

export default function BookingSuccessPage() {
  const router = useRouter();

  return (
    <div className="flex-grow flex flex-col justify-center items-center py-16 px-4 bg-slate-50 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-100/30 rounded-full filter blur-3xl" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-100/30 rounded-full filter blur-3xl" />

      <div className="max-w-md w-full bg-white border border-slate-100 rounded-3xl p-8 shadow-2xl text-center space-y-6 relative z-10">
        <div className="bg-emerald-50 p-4 rounded-full inline-block relative">
          <CheckCircle2 className="h-14 w-14 text-emerald-500 animate-bounce" />
          <Sparkles className="absolute top-1 right-1 h-5 w-5 text-indigo-500 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h2 className="font-extrabold text-2xl text-slate-800">Trip Booking Confirmed!</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Congratulations! Your holiday package booking has been successfully processed and confirmed. A confirmation receipt has been saved.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-sm py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-150 transition-all hover:scale-[1.01]"
          >
            <LayoutDashboard className="h-4.5 w-4.5" />
            Go to My Dashboard
          </button>
          <button
            onClick={() => router.push('/destinations')}
            className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Compass className="h-4.5 w-4.5 text-indigo-600" />
            Explore More Destinations
          </button>
        </div>
      </div>
    </div>
  );
}
