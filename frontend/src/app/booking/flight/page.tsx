"use client";

export const dynamic = 'force-dynamic';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { Plane, Star, ArrowRight, ShieldCheck, CreditCard, Loader2, Compass, AlertCircle } from 'lucide-react';

const API_URL = typeof window === 'undefined'
  ? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api` : 'http://localhost:5000/api')
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');

function FlightBookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, user, logout } = useAuth();

  const offerId = searchParams.get('offerId') || '';
  const adultsCount = parseInt(searchParams.get('adults') || '1') || 1;

  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [offer, setOffer] = useState<any>(null);

  // Passengers Form State
  const [passengers, setPassengers] = useState<any[]>([]);

  useEffect(() => {
    if (!token) {
      router.push('/login?redirect=/booking/flight?offerId=' + offerId + '&adults=' + adultsCount);
      return;
    }

    const fetchOfferDetails = async () => {
      try {
        setLoading(true);
        setError('');
        // Revalidate / retrieve the latest offer information before booking
        const res = await fetch(`${API_URL}/flights/revalidate/${offerId}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Failed to fetch the latest flight offers from Duffel.');
        }
        const data = await res.json();
        setOffer(data);

        // Prepopulate passenger list structures
        const initialPassengers = Array.from({ length: adultsCount }, () => ({
          title: 'mr',
          firstName: '',
          lastName: '',
          gender: 'Male',
          bornOn: '',
          email: user?.email || '',
          phoneNumber: '',
          nationality: 'IN',
          passportNumber: '',
          passportExpiry: '',
          passportIssuingCountry: 'IN'
        }));
        setPassengers(initialPassengers);

      } catch (err: any) {
        setError(err.message || 'Error connecting to flight database.');
      } finally {
        setLoading(false);
      }
    };

    if (offerId) {
      fetchOfferDetails();
    } else {
      setError('Missing flight Offer ID parameter.');
      setLoading(false);
    }
  }, [offerId, adultsCount, token]);

  const handlePassengerChange = (index: number, field: string, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleBookFlight = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    setError('');

    // Check if token exists
    if (!token) {
      setError('Your session has expired. Please log in again.');
      setBookingLoading(false);
      setTimeout(() => {
        router.push(`/login?redirect=/booking/flight?offerId=${offerId}&adults=${adultsCount}`);
      }, 2000);
      return;
    }

    // Client-side validations
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.firstName || !p.lastName || !p.bornOn || !p.phoneNumber) {
        setError(`Please fill in all mandatory details for passenger #${i + 1}.`);
        setBookingLoading(false);
        return;
      }
    }

    try {
      const response = await fetch(`${API_URL}/flights/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          offerId,
          passengers
        })
      });

      if (!response.ok) {
        const errJson = await response.json();
        // If user not found, deleted, or token invalid, handle explicitly
        if (response.status === 401 || response.status === 404 || errJson.message === 'User not found or deleted') {
          logout(); // Clear stale user tokens and session data!
          setError('Your user session is invalid or has been deleted. Please login to continue.');
          setBookingLoading(false);
          setTimeout(() => {
            router.push(`/login?redirect=/booking/flight?offerId=${offerId}&adults=${adultsCount}`);
          }, 2500);
          return;
        }
        throw new Error(errJson.message || 'Failed to confirm flight booking.');
      }

      const data = await response.json();
      // Redirect to success modal or order confirmation
      router.push(`/dashboard?tab=bookings&bookingSuccess=true&pnr=${data.order?.bookingReference}&orderId=${data.order?.orderId}`);

    } catch (err: any) {
      if (err.message === 'User not found or deleted') {
        logout(); // Clear stale user tokens and session data!
        setError('Your user account was not found or deleted. Please login to continue.');
        setTimeout(() => {
          router.push(`/login?redirect=/booking/flight?offerId=${offerId}&adults=${adultsCount}`);
        }, 2500);
      } else {
        console.warn('[Flight Checkout Warning]:', err.message);
        setError(err.message || 'A network error occurred while booking with Duffel.');
      }
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-teal-700 animate-spin mb-4" />
        <span className="text-slate-500 font-bold text-sm tracking-wider">Revalidating flight pricing with Duffel API...</span>
      </div>
    );
  }

  if (error && !offer) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 flex flex-col items-center justify-center">
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h3 className="font-black text-slate-900 text-lg">Failed to load flight offer</h3>
          <p className="text-slate-500 text-xs mt-2 mb-6">{error}</p>
          <button onClick={() => router.push('/flights-hotels')} className="bg-teal-700 hover:bg-teal-800 text-white font-bold py-2 px-6 rounded-lg text-sm transition">
            Return to search
          </button>
        </div>
      </div>
    );
  }

  // Parse slice details
  const slice = offer?.slices?.[0];
  const segments = slice?.segments || [];
  const carrier = offer?.owner || {};
  const totalAmount = offer?.total_amount;
  const currency = offer?.total_currency || 'INR';

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Passenger & Checkout</h1>
          <p className="text-slate-500 text-sm mt-1">Complete your Duffel flight ticket issuance securely.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl flex items-start text-xs font-semibold text-left">
            <AlertCircle className="h-5 w-5 text-rose-500 mr-2 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Passenger details form */}
          <div className="flex-1 w-full space-y-6">
            <form onSubmit={handleBookFlight} className="space-y-6 text-left">
              {passengers.map((p, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                    <span className="bg-teal-700 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    Passenger Details (Adult)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Title</label>
                      <select
                        value={p.title}
                        onChange={(e) => handlePassengerChange(index, 'title', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-teal-500 font-semibold"
                      >
                        <option value="mr">Mr.</option>
                        <option value="mrs">Mrs.</option>
                        <option value="ms">Ms.</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">First Name</label>
                      <input
                        type="text"
                        required
                        value={p.firstName}
                        onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none"
                        placeholder="e.g. John"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Last Name</label>
                      <input
                        type="text"
                        required
                        value={p.lastName}
                        onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none"
                        placeholder="e.g. Doe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Gender</label>
                      <select
                        value={p.gender}
                        onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none font-semibold"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Date of Birth</label>
                      <input
                        type="date"
                        required
                        value={p.bornOn}
                        onChange={(e) => handlePassengerChange(index, 'bornOn', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Nationality</label>
                      <input
                        type="text"
                        required
                        maxLength={2}
                        value={p.nationality}
                        onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value.toUpperCase())}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none"
                        placeholder="e.g. IN / GB"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                      <input
                        type="email"
                        required
                        value={p.email}
                        onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none"
                        placeholder="john.doe@gmail.com"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number (with Country Code)</label>
                      <input
                        type="tel"
                        required
                        value={p.phoneNumber}
                        onChange={(e) => handlePassengerChange(index, 'phoneNumber', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none"
                        placeholder="e.g. +919876543210"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 mt-4">
                    <h4 className="text-xs font-bold text-slate-600 mb-3">Passport Information (Optional unless required by airline)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Passport Number</label>
                        <input
                          type="text"
                          value={p.passportNumber}
                          onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none"
                          placeholder="e.g. Z1234567"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Passport Expiry</label>
                        <input
                          type="date"
                          value={p.passportExpiry}
                          onChange={(e) => handlePassengerChange(index, 'passportExpiry', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Issuing Country</label>
                        <input
                          type="text"
                          maxLength={2}
                          value={p.passportIssuingCountry}
                          onChange={(e) => handlePassengerChange(index, 'passportIssuingCountry', e.target.value.toUpperCase())}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none"
                          placeholder="e.g. IN"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              ))}

              {/* Payment Section */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-teal-700" />
                  Duffel Test-Mode Payment
                </h3>
                
                <div className="p-4 bg-teal-50 border border-teal-150 rounded-xl text-xs font-semibold text-teal-800 flex gap-2">
                  <ShieldCheck className="h-5 w-5 text-teal-600 shrink-0" />
                  <div>
                    <span className="font-bold block">Instant settled via balance</span>
                    This order will be processed in Duffel Test Mode and paid directly using the mock agency balance, in full compliance with Duffel v2 requirements.
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full bg-teal-700 hover:bg-teal-800 disabled:bg-slate-350 text-white font-bold py-3.5 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow"
                >
                  {bookingLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Issuing actual Duffel ticket order...</span>
                    </>
                  ) : (
                    <span>Confirm & Pay Flight ticket</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Flight Summary panel */}
          <aside className="w-full lg:w-96 shrink-0 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-left space-y-6">
            <h3 className="font-extrabold text-slate-900 text-lg leading-tight">Flight Details</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✈️</span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-none">{carrier.name || 'Airline'}</h4>
                    <span className="text-[10px] text-slate-400 font-extrabold mt-1 block">OFFER ID: {offerId.slice(0, 12)}...</span>
                  </div>
                </div>
              </div>

              {segments.map((seg: any, sIdx: number) => (
                <div key={sIdx} className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px]">Segment #{sIdx + 1}</span>
                    <span className="text-slate-400">Class: {offer?.slices?.[0]?.cabin_class || 'Economy'}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold">DEPART</span>
                      <span className="font-bold text-slate-800">{seg.origin?.iata_code}</span>
                      <span className="text-xs text-slate-500 block">{seg.departing_at ? seg.departing_at.split('T')[1].slice(0, 5) : '08:00'}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                    <div className="space-y-1 text-right">
                      <span className="text-[10px] text-slate-400 block font-bold">ARRIVE</span>
                      <span className="font-bold text-slate-800">{seg.destination?.iata_code}</span>
                      <span className="text-xs text-slate-500 block">{seg.arriving_at ? seg.arriving_at.split('T')[1].slice(0, 5) : '12:00'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Fare Breakdown</h4>
              <div className="flex justify-between text-xs text-slate-500 font-semibold">
                <span>Passengers ({adultsCount} Adult)</span>
                <span>₹{Math.round(totalAmount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 font-semibold">
                <span>Taxes & Carrier Fees</span>
                <span className="text-emerald-700 font-bold">Included</span>
              </div>
              <div className="border-t border-dashed border-slate-200 pt-3 flex justify-between items-center font-black">
                <span className="text-sm">Total Fare</span>
                <span className="text-lg text-teal-800">₹{Math.round(totalAmount).toLocaleString('en-IN')} {currency}</span>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}


export default function FlightBookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 pt-32 flex flex-col items-center justify-center text-slate-800">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600 mb-2"></div>
        <p className="text-xs text-slate-400">Loading specs...</p>
      </div>
    }>
      <FlightBookingPageContent />
    </Suspense>
  );
}
