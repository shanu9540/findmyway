"use client";

export const dynamic = 'force-dynamic';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, ShieldAlert, Phone, Mail, User, MapPin } from 'lucide-react';

const API_URL = typeof window === 'undefined'
  ? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api` : 'http://localhost:5000/api')
  : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:5000/api'
      : 'https://backend-blue-psi-76.vercel.app/api');

function BookingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token, user, logout } = useAuth();

  const packageId = searchParams.get('packageId') || '';
  const initialDate = searchParams.get('travelDate') || '';
  const initialAdults = parseInt(searchParams.get('adults') || '2');
  const initialChildren = parseInt(searchParams.get('children') || '0');
  const initialRooms = parseInt(searchParams.get('rooms') || '1');

  // Form States (Pre-filled with requested fallbacks)
  const [fullName, setFullName] = useState('Travel Explorer');
  const [email, setEmail] = useState('travelexplorer@gmail.com');
  const [phone, setPhone] = useState('9319984242');
  const [travelDate, setTravelDate] = useState(initialDate || '2026-10-12');
  const [adultsCount, setAdultsCount] = useState(initialAdults);
  const [childrenCount, setChildrenCount] = useState(initialChildren);
  const [roomsCount, setRoomsCount] = useState(initialRooms);
  const [specialRequests, setSpecialRequests] = useState('');

  // Fetch package details with a default placeholder matching Mumbai Highlight Holiday
  const [travelPackage, setTravelPackage] = useState<any>({
    title: "Mumbai Highlight Holiday",
    destination: { name: "Mumbai" },
    country: "India",
    duration: 3,
    nights: 2,
    originalPrice: 17250,
    discount: 0,
    availableDates: ["2026-10-12"]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Verification & Error Banner States
  const [showUserNotFoundError, setShowUserNotFoundError] = useState(false);
  const [isValidatingSession, setIsValidatingSession] = useState(true);

  useEffect(() => {
    const verifyUserSession = async () => {
      if (!token) {
        setIsValidatingSession(false);
        router.push('/login?redirect=' + encodeURIComponent(`/booking?packageId=${packageId}&travelDate=${initialDate}&adults=${initialAdults}&children=${initialChildren}&rooms=${initialRooms}`));
        return;
      }

      try {
        setIsValidatingSession(true);
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.status === 401) {
          logout(); // Clear stale user tokens and session data!
          router.push('/login?redirect=' + encodeURIComponent(`/booking?packageId=${packageId}&travelDate=${initialDate}&adults=${initialAdults}&children=${initialChildren}&rooms=${initialRooms}`));
          return;
        }

        if (res.ok) {
          const userData = await res.json();
          setFullName(userData.name || 'Travel Explorer');
          setEmail(userData.email || 'travelexplorer@gmail.com');
          if (userData.phone) setPhone(userData.phone);
        } else {
          if (user) {
            setFullName(user.name || 'Travel Explorer');
            setEmail(user.email || 'travelexplorer@gmail.com');
            const usrAny = user as any;
            if (usrAny.phone) setPhone(usrAny.phone);
          }
        }
      } catch (err) {
        console.warn('Network issue during user verify, keeping placeholders.');
        if (user) {
          setFullName(user.name || 'Travel Explorer');
          setEmail(user.email || 'travelexplorer@gmail.com');
          const usrAny = user as any;
          if (usrAny.phone) setPhone(usrAny.phone);
        }
      } finally {
        setIsValidatingSession(false);
      }
    };

    verifyUserSession();
  }, [token, user]);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      if (!packageId) return;
      try {
        const response = await fetch(`${API_URL}/packages/${packageId}`);
        if (response.ok) {
          const data = await response.json();
          setTravelPackage(data);
        }
      } catch (err) {
        console.warn('Backend API connection failed, using default package mockup details.');
      }
    };

    fetchPackageDetails();
  }, [packageId]);

  // Dynamic price calculation
  const getPricing = () => {
    const mainPrice = travelPackage?.originalPrice || 17250;
    const childRate = Math.round(mainPrice * 0.65);
    const subtotal = (adultsCount * mainPrice) + (childrenCount * childRate);
    const discountAmount = Math.round(subtotal * ((travelPackage?.discount || 0) / 100));
    const taxes = Math.round((subtotal - discountAmount) * 0.10); // 10% tax rate
    const total = subtotal - discountAmount + taxes;

    return { subtotal, discountAmount, taxes, total, childRate };
  };

  const { subtotal, discountAmount, taxes, total, childRate } = getPricing();

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!fullName.trim() || !email.trim() || !phone.trim() || !travelDate) {
      setError('Please fill in all required customer details.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          packageId: packageId || 'mumbai-default',
          travelDate,
          fullName,
          email,
          phone,
          adultsCount,
          childrenCount,
          roomsCount,
          specialRequests,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/booking/mock-pay?bookingId=${data.booking.id}`);
      } else {
        if (response.status === 401 || data.message === 'User not found or deleted') {
          logout();
          setShowUserNotFoundError(true);
        } else {
          setError(data.message || 'Booking submission failed.');
        }
      }
    } catch (err: any) {
      if (err.message === 'User not found or deleted') {
        logout();
        setShowUserNotFoundError(true);
      } else {
        setError('Connection to server failed. Using mock success redirection.');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Safe formatting helpers for display
  const pkgTitle = travelPackage?.title || "Mumbai Highlight Holiday";
  const pkgCity = travelPackage?.destination?.name || "Mumbai";
  const pkgCountry = travelPackage?.country || "India";
  const pkgDuration = travelPackage ? `${travelPackage.duration} Days / ${travelPackage.nights} Nights` : "3 Days / 2 Nights";
  const pkgDateStr = travelDate ? new Date(travelDate).toLocaleDateString('en-IN') : "10/12/2026";
  const adultPrice = travelPackage?.originalPrice || 17250;
  const childPrice = travelPackage ? Math.round(travelPackage.originalPrice * 0.65) : 11213;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8 text-left">
          <span className="inline-block bg-green-100 text-green-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            RESERVATION
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
            Secure Booking Checkout
          </h1>
        </div>

        {/* Top Alert / Notification Banner */}
        {showUserNotFoundError && (
          <div className="mb-8 p-4 bg-[#FDF2F2] border border-red-200 text-red-950 rounded-xl flex items-center text-left">
            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-red-600 mr-3 shrink-0">
              <span className="font-extrabold text-sm leading-none">!</span>
            </div>
            <span className="text-sm font-semibold text-red-700">User not found or deleted</span>
          </div>
        )}

        {/* Dynamic validation error display */}
        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-start text-left">
            <ShieldAlert className="h-5 w-5 mr-3 text-rose-500 shrink-0 mt-0.5" />
            <span className="text-xs font-bold">{error}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column: Traveler Information Card */}
          <form onSubmit={handleBookingSubmit} className="flex-1 bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6 text-left">
            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Traveler Information</h2>
              <p className="text-slate-400 text-xs mt-1">Please fill in details matching your passport or ID proofs.</p>
            </div>

            {/* FULL NAME */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-slate-200 rounded-lg py-2.5 px-3 pl-10 text-slate-800 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                  placeholder="Travel Explorer"
                />
              </div>
            </div>

            {/* EMAIL ADDRESS & PHONE NUMBER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F9FAFB] border border-slate-200 rounded-lg py-2.5 px-3 pl-10 text-slate-800 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                    placeholder="travelexplorer@gmail.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#F9FAFB] border border-slate-200 rounded-lg py-2.5 px-3 pl-10 text-slate-800 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                    placeholder="9319984242"
                  />
                </div>
              </div>
            </div>

            {/* Guest Configurations Form controls */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Guest Details</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Adults</label>
                  <input
                    type="number"
                    min="1"
                    value={adultsCount}
                    onChange={(e) => setAdultsCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-[#F9FAFB] border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Children</label>
                  <input
                    type="number"
                    min="0"
                    value={childrenCount}
                    onChange={(e) => setChildrenCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-[#F9FAFB] border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Rooms</label>
                  <input
                    type="number"
                    min="1"
                    value={roomsCount}
                    onChange={(e) => setRoomsCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-[#F9FAFB] border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Travel Date</label>
                  <input
                    type="date"
                    value={travelDate}
                    min="2026-01-01"
                    max="2031-12-31"
                    onChange={(e) => setTravelDate(e.target.value)}
                    required
                    className="w-full bg-[#F9FAFB] border border-slate-200 text-slate-800 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>

              </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">Special Requests / Preferences</label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Diabetic meals, ground floor room, wheelchair accessibility, etc."
                className="w-full bg-[#F9FAFB] border border-slate-200 rounded-lg p-3 text-slate-800 text-sm focus:outline-none focus:border-teal-500 focus:bg-white h-24 transition resize-none"
              />
            </div>

            {/* Submit Checkout */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-teal-700 hover:bg-teal-800 disabled:bg-slate-350 text-white font-extrabold py-3.5 rounded-lg text-sm transition-all duration-200 shadow hover:shadow-md flex items-center justify-center gap-1.5"
            >
              <span>{submitting ? 'Processing...' : 'Proceed to Payment'}</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </form>

          {/* Right Column: Booking Summary Card */}
          <aside className="w-full lg:w-96 shrink-0 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6 text-left">
            <div>
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Booking Summary</h3>
              <span className="text-[10px] text-slate-400 font-bold block mt-3">Package Selected</span>
              <span className="font-extrabold text-slate-905 block mt-0.5">{pkgTitle}</span>
              <div className="flex items-center text-xs font-semibold text-slate-400 mt-2">
                <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400" />
                {pkgCity}, {pkgCountry}
              </div>
            </div>

            {/* Specs List */}
            <div className="space-y-2.5 text-xs font-semibold text-slate-600 py-4 border-y border-slate-100">
              <div className="flex justify-between">
                <span>Duration</span>
                <span className="text-slate-900">{pkgDuration}</span>
              </div>
              <div className="flex justify-between">
                <span>Travel Date</span>
                <span className="text-slate-900">{pkgDateStr}</span>
              </div>
              <div className="flex justify-between">
                <span>Adults (₹{adultPrice.toLocaleString('en-IN')})</span>
                <span className="text-slate-900">{adultsCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Children (₹{childPrice.toLocaleString('en-IN')})</span>
                <span className="text-slate-900">{childrenCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Rooms Selected</span>
                <span className="text-slate-900">{roomsCount}</span>
              </div>
            </div>

            {/* Dynamic Prices Breakdown */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-xs font-semibold text-amber-700">
                  <span>Savings ({travelPackage?.discount || 0}%)</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-semibold text-slate-650">
                <span>GST/Taxes (10%)</span>
                <span>+₹{taxes.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-base font-black text-teal-800 border-t border-slate-200 pt-3">
                <span>Final Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}


export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 pt-32 flex flex-col items-center justify-center text-slate-800">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600 mb-2"></div>
        <p className="text-xs text-slate-400">Loading specs...</p>
      </div>
    }>
      <BookingPageContent />
    </Suspense>
  );
}
