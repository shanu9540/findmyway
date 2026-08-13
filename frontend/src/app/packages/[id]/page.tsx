"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, Clock, MapPin, Bed, Utensils, Car, Check, X, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const API_URL = typeof window === 'undefined'
  ? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api` : 'http://localhost:5000/api')
  : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:5000/api'
      : 'https://backend-blue-psi-76.vercel.app/api');

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token, wishlist, toggleWishlist } = useAuth();
  const pkgId = String(params?.id || '');

  const [travelPackage, setTravelPackage] = useState<any>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Booking Calculator States
  const [travelDate, setTravelDate] = useState('');
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [roomsCount, setRoomsCount] = useState(1);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/packages/${pkgId}`);
        if (response.ok) {
          const data = await response.json();
          setTravelPackage(data);
          setActiveImage(data.image || '');
        }
      } catch (err) {
        console.error('Failed to load package details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (pkgId) {
      fetchPackageDetails();
    }
  }, [pkgId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-teal-700 mb-4"></div>
        <span className="text-slate-500 font-bold text-sm tracking-wider">Loading Package Details...</span>
      </div>
    );
  }

  if (!travelPackage) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 flex flex-col items-center justify-center text-center px-4">
        <ShieldCheck className="h-12 w-12 text-rose-500 mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-1">Package details not found</h3>
        <p className="text-slate-500 text-sm mb-6">This package may have been removed or does not exist.</p>
        <Link href="/packages" className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition">
          Back to Packages
        </Link>
      </div>
    );
  }

  const isSavedInWishlist = wishlist?.some((item) => item.id === travelPackage.destinationId);

  // Dynamic Price Calculations (in INR)
  const childRate = Math.round(travelPackage.originalPrice * 0.65);
  const rawSubtotal = (adultsCount * travelPackage.originalPrice) + (childrenCount * childRate);
  const rawDiscount = Math.round(rawSubtotal * (travelPackage.discount / 100));
  const rawTaxes = Math.round((rawSubtotal - rawDiscount) * 0.10); // 10% tax rate
  const finalTotal = rawSubtotal - rawDiscount + rawTaxes;

  const handleBookNowRedirect = () => {
    if (!travelDate) {
      alert('Please select a travel date.');
      return;
    }
    const params = new URLSearchParams({
      packageId: pkgId,
      travelDate,
      adults: String(adultsCount),
      children: String(childrenCount),
      rooms: String(roomsCount),
    });
    router.push(`/booking?${params.toString()}`);
  };

  const inclusions = travelPackage.inclusions || [];
  const exclusions = travelPackage.exclusions || [];
  const activities = travelPackage.activities || [];
  const dates = travelPackage.availableDates || [];
  const galleryList = travelPackage.gallery ? travelPackage.gallery : [];
  const allImages = [travelPackage.image, ...galleryList].filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* 1. Header Banner */}
      <div 
        className="relative h-[45vh] bg-cover bg-center flex items-end pt-24"
        style={{ backgroundImage: `url('${activeImage || travelPackage.image}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 text-white flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="text-left">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/25 border border-teal-400/30 text-teal-300 mb-2">
              {travelPackage.duration} Days / {travelPackage.nights} Nights
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">{travelPackage.title}</h1>
            <div className="flex items-center text-xs font-semibold text-slate-300 mt-2">
              <MapPin className="h-4 w-4 mr-1 text-teal-400" />
              <Link href={`/destinations/${travelPackage.destinationId}`} className="underline hover:text-white mr-1">
                {travelPackage.destination?.name}
              </Link>
              &bull; <span className="ml-1">{travelPackage.country}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 backdrop-blur px-4 py-2 rounded-xl border border-slate-700 shadow text-left">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Overall Rating</span>
              <div className="flex items-center text-amber-400 font-extrabold text-lg mt-0.5">
                <Star className="h-5 w-5 fill-amber-400 mr-1.5" />
                {travelPackage.rating?.toFixed(1) || '0.0'}
              </div>
            </div>
            <button
              onClick={() => toggleWishlist(travelPackage.destinationId)}
              className={`flex items-center justify-center p-3 rounded-xl border transition-all ${
                isSavedInWishlist
                  ? 'bg-rose-500 border-transparent text-white shadow-lg shadow-rose-500/20'
                  : 'bg-slate-900/80 backdrop-blur border-slate-700 text-slate-300 hover:text-rose-400'
              }`}
            >
              <Heart className={`h-5 w-5 ${isSavedInWishlist ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left column: Overview, Itinerary, Inclusions */}
        <div className="flex-1 space-y-8 text-left">
          
          {/* Overview */}
          <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Tour Overview</h2>
            <p className="text-slate-600 text-sm leading-relaxed">{travelPackage.description}</p>

            {/* Quick specifications */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
              <span className="flex items-center text-xs font-semibold text-slate-600">
                <Bed className="h-5 w-5 text-teal-700 mr-2 shrink-0" />
                {travelPackage.hotel}
              </span>
              <span className="flex items-center text-xs font-semibold text-slate-600">
                <Utensils className="h-5 w-5 text-teal-700 mr-2 shrink-0" />
                {travelPackage.meals}
              </span>
              <span className="flex items-center text-xs font-semibold text-slate-600">
                <Car className="h-5 w-5 text-teal-700 mr-2 shrink-0" />
                {travelPackage.transportation}
              </span>
              <span className="flex items-center text-xs font-semibold text-slate-600">
                <Clock className="h-5 w-5 text-teal-700 mr-2 shrink-0" />
                Available dates: {dates.length} options
              </span>
            </div>
          </div>

          {/* Photo Gallery */}
          {allImages.length > 1 && (
            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Gallery Grid</h2>
              <div className="grid grid-cols-3 gap-4">
                {allImages.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${
                      (activeImage || travelPackage.image) === img
                        ? 'border-teal-700 shadow-md scale-102'
                        : 'border-transparent hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Day-by-Day Itinerary */}
          {travelPackage.itineraryJson?.itinerary && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Day-by-Day Itinerary</h2>
              <div className="space-y-4">
                {travelPackage.itineraryJson.itinerary.map((day: any) => (
                  <div key={day.day} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-slate-900 text-white py-3 px-6 flex justify-between items-center">
                      <h3 className="font-extrabold text-sm uppercase tracking-wide text-amber-400">Day {day.day}</h3>
                      <span className="text-xs font-semibold text-slate-200">{day.theme}</span>
                    </div>
                    <div className="p-6 divide-y divide-slate-100">
                      {day.activities?.map((activity: any, actIdx: number) => (
                        <div key={actIdx} className={`py-3 flex gap-4 items-start ${actIdx === 0 ? 'pt-0' : ''} ${actIdx === day.activities.length - 1 ? 'pb-0' : ''}`}>
                          <div className="bg-teal-55 text-teal-800 p-2 rounded-lg border border-teal-100 shrink-0 mt-0.5">
                            <Clock className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">{activity.activity}</h4>
                            <span className="text-[10px] text-slate-400 font-bold block mt-1 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {activity.location}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inclusions / Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center text-teal-700">
                <Check className="h-5 w-5 mr-2" /> What's Included
              </h3>
              <ul className="space-y-2">
                {inclusions.map((inc: string, idx: number) => (
                  <li key={idx} className="text-xs font-bold text-slate-600 flex items-start">
                    <Check className="h-4 w-4 text-emerald-600 mr-2 shrink-0 mt-0.5" />
                    {inc}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center text-rose-700">
                <X className="h-5 w-5 mr-2" /> What's Excluded
              </h3>
              <ul className="space-y-2">
                {exclusions.map((exc: string, idx: number) => (
                  <li key={idx} className="text-xs font-bold text-slate-600 flex items-start">
                    <X className="h-4 w-4 text-rose-500 mr-2 shrink-0 mt-0.5" />
                    {exc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right column: Sticky Booking Form / Invoice Calculator */}
        <div className="w-full lg:w-96 shrink-0 space-y-6">
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-md space-y-6 sticky top-24">
            
            {/* Price section */}
            <div className="pb-4 border-b border-slate-100 text-left">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Starts From</span>
              <div className="flex items-baseline mt-1">
                <span className="text-3xl font-extrabold text-slate-900">₹{travelPackage.pricePerAdult?.toLocaleString('en-IN')}</span>
                <span className="text-xs text-slate-400 font-semibold ml-1.5">/ adult</span>
              </div>
              {travelPackage.discount > 0 && (
                <div className="flex items-center gap-1.5 mt-1 text-xs">
                  <span className="text-slate-450 line-through">₹{travelPackage.originalPrice?.toLocaleString('en-IN')}</span>
                  <span className="text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                    {travelPackage.discount}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Config inputs */}
            <div className="space-y-4 text-left">
              {/* Travel Date */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Travel Date</label>
                <select
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                >
                  <option value="">Select Date</option>
                  {dates.map((d: string) => (
                    <option key={d} value={d}>{new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</option>
                  ))}
                </select>
              </div>

              {/* Guest Counts */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Adults (12+ yrs)</label>
                  <input
                    type="number"
                    min="1"
                    value={adultsCount}
                    onChange={(e) => setAdultsCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Children (2-12 yrs)</label>
                  <input
                    type="number"
                    min="0"
                    value={childrenCount}
                    onChange={(e) => setChildrenCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Rooms count */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Rooms Count</label>
                <input
                  type="number"
                  min="1"
                  value={roomsCount}
                  onChange={(e) => setRoomsCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Dynamic Billing Breakdown */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-left space-y-3">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block border-b border-slate-200 pb-1">
                Estimated Billing (INR)
              </span>
              
              <div className="flex justify-between text-xs font-semibold text-slate-650">
                <span>Subtotal</span>
                <span>₹{rawSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-amber-700">
                <span>Savings Discount</span>
                <span>-₹{rawDiscount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-650">
                <span>Taxes & GST (10%)</span>
                <span>+₹{rawTaxes.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-teal-800 border-t border-slate-200 pt-2">
                <span>Total Cost</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Book trigger */}
            <button
              onClick={handleBookNowRedirect}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold py-3 rounded-lg text-sm transition-all duration-200 shadow hover:shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="h-4 w-4" />
              <span>Proceed to Booking</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
