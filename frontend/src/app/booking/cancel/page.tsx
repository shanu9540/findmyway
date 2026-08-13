"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldAlert, RefreshCw, Compass } from 'lucide-react';

export default function BookingCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId') || '';

  return (
    <div className="flex-grow flex flex-col justify-center items-center py-16 px-4 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-72 h-72 bg-rose-100/30 rounded-full filter blur-3xl" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-slate-200/30 rounded-full filter blur-3xl" />

      <div className="max-w-md w-full bg-white border border-slate-100 rounded-3xl p-8 shadow-2xl text-center space-y-6 relative z-10">
        <div className="bg-rose-50 p-4 rounded-full inline-block">
          <ShieldAlert className="h-14 w-14 text-rose-500" />
        </div>

        <div className="space-y-2">
          <h2 className="font-extrabold text-2xl text-slate-800">Checkout Cancelled</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Your payment session was cancelled. No charges were made. If you experienced technical issues, you can attempt payment again.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {bookingId && (
            <button
              onClick={() => router.push(`/booking/mock-pay?bookingId=${bookingId}`)}
              className="w-full bg-indigo-650 bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-sm py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-150 transition-all hover:scale-[1.01]"
            >
              <RefreshCw className="h-4.5 w-4.5" />
              Retry Payment
            </button>
          )}
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
