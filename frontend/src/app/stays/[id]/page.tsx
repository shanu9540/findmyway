"use client";

export const dynamic = 'force-dynamic';

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { Hotel, Calendar, Users, MapPin, Loader2, Star, Sparkles, ShieldCheck, HelpCircle, ArrowLeft, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const API_URL = typeof window === 'undefined'
  ? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api` : 'http://localhost:5000/api')
  : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:5000/api'
      : 'https://backend-blue-psi-76.vercel.app/api');

function StayDetailPageContent() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toggleWishlist, wishlist } = useAuth();

  // Search parameters for navigation checks
  const checkIn = searchParams.get('checkIn') || '2026-10-15';
  const checkOut = searchParams.get('checkOut') || '2026-10-20';
  const guests = parseInt(searchParams.get('guests') || '1') || 1;

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activePhoto, setActivePhoto] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/stays/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProperty(data);
          
          // Verify initial wishlist status
          const match = wishlist?.some((item: any) => item.id === id);
          setIsWishlisted(!!match);
        } else {
          setError('Accommodation details could not be loaded from database.');
        }
      } catch (err) {
        setError('Network connectivity issue. Failed to retrieve stays catalog.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, wishlist]);

  const handleWishlist = async () => {
    if (!id) return;
    const res = await toggleWishlist(String(id));
    setIsWishlisted(res);
  };

  const getNightCount = () => {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diff = d2.getTime() - d1.getTime();
    return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24))) || 5;
  };

  const nights = getNightCount();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-emerald-700 animate-spin mb-4" />
        <span className="text-slate-500 font-bold text-sm tracking-wider">Loading hotel specifications and tariffs...</span>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 flex flex-col items-center justify-center px-4">
        <div className="bg-white border border-slate-200 p-8 rounded-3xl text-center shadow-sm max-w-md">
          <Hotel className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h4 className="font-bold text-slate-800">Stay details unavailable</h4>
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{error || 'The requested property ID does not exist.'}</p>
          <button onClick={() => router.back()} className="mt-6 bg-slate-900 text-white text-xs font-bold py-2 px-5 rounded-xl shadow">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const images = property.images?.length > 0 ? property.images : [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80'
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Navigation Breadcrumb */}
        <button onClick={() => router.back()} className="mb-6 text-xs text-slate-500 font-bold hover:text-slate-900 flex items-center gap-1.5 transition">
          <ArrowLeft className="h-4 w-4" /> Back to search results
        </button>

        {/* Header Summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {property.provider === 'mock' ? 'MOCK PARTNER' : 'DUFFEL CONNECTED'}
              </span>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: property.starRating }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{property.name}</h1>
            <span className="text-xs font-bold text-slate-450 flex items-center gap-1 mt-2 uppercase tracking-wide">
              <MapPin className="h-4 w-4 text-slate-350" /> {property.address}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleWishlist}
              className={`p-3 rounded-full border border-slate-200 bg-white transition hover:scale-105 shadow-sm flex items-center justify-center ${
                isWishlisted ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
              }`}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
            </button>
            <div className="text-right">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Starting per night</span>
              <span className="text-2xl font-black text-slate-900">₹{(property.rooms?.[0]?.rates?.[0]?.totalPrice || 15000).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="lg:col-span-2 relative h-96 bg-slate-100 rounded-3xl overflow-hidden shadow-sm">
            <img src={images[activePhoto]} alt="Property feature" className="w-full h-full object-cover" />
            
            {/* Carousel Navigation */}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={() => setActivePhoto(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="bg-slate-900/70 hover:bg-slate-900 text-white p-2 rounded-full backdrop-blur-sm transition"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setActivePhoto(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="bg-slate-900/70 hover:bg-slate-900 text-white p-2 rounded-full backdrop-blur-sm transition"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Side Thumbnail List */}
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-4 h-32 lg:h-96">
            {images.slice(0, 3).map((photo: string, index: number) => (
              <button
                key={index}
                onClick={() => setActivePhoto(index)}
                className={`relative rounded-2xl overflow-hidden border-2 h-full transition ${
                  activePhoto === index ? 'border-emerald-600' : 'border-transparent hover:border-slate-300'
                }`}
              >
                <img src={photo} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Detail Splits */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column: Specs */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h2 className="font-extrabold text-slate-900 text-lg mb-4">Property Description</h2>
              <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h2 className="font-extrabold text-slate-900 text-lg mb-4">Key Amenities & Services</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities?.map((amenity: string) => (
                  <div key={amenity} className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 py-2.5 px-3.5 rounded-xl border border-slate-100">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Policies & Meta Info */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">Check-in / Check-out Policies</h3>
              
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-400">Check In time</span>
                <span className="text-slate-800 font-bold">{property.policies?.checkIn || '14:00 (2:00 PM)'}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-400">Check Out time</span>
                <span className="text-slate-800 font-bold">{property.policies?.checkOut || '12:00 (12:00 PM)'}</span>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-[11px] leading-relaxed text-slate-500 flex items-start gap-2">
                <HelpCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Guests are requested to submit passport copies or active ID proof validations at the reception counter during check-in.</span>
              </div>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 text-left space-y-3">
              <h4 className="font-bold text-emerald-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-emerald-600" /> Security Guarantee
              </h4>
              <p className="text-[11px] leading-relaxed text-slate-600">
                Tariffs verified through the provider abstraction layer are locked. No hidden resort fees or dynamic post-reservation price surges.
              </p>
            </div>
          </div>
        </div>

        {/* Accommodation Room Categories Selection Grid */}
        <div className="border-t border-slate-200 pt-10">
          <h2 className="font-extrabold text-slate-900 text-xl mb-6">Choose Your Room & Pricing Category</h2>
          
          {property.rooms && property.rooms.length > 0 ? (
            <div className="space-y-6">
              {property.rooms.map((room: any) => (
                <div key={room.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col xl:flex-row gap-6">
                  {/* Room Cover Frame */}
                  <div className="w-full xl:w-80 h-52 xl:h-auto bg-slate-100 shrink-0 relative">
                    <img
                      src={room.images?.[0] || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Room Info */}
                  <div className="p-6 flex-grow flex flex-col justify-between text-left space-y-6">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg leading-none mb-2">{room.name}</h3>
                      <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-3">Bed Plan: {room.beds} &bull; Occupancy: Max {room.occupancy} Adults</p>
                      <p className="text-slate-500 text-xs leading-relaxed max-w-2xl">{room.description}</p>
                      
                      {/* Room Amenities */}
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {room.amenities?.map((am: string) => (
                          <span key={am} className="bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                            {am}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Room Rates Mapping list */}
                    <div className="border-t border-slate-100 pt-4 space-y-4">
                      <h4 className="text-[10px] font-extrabold text-slate-450 uppercase tracking-widest">Available Rate Options</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {room.rates?.map((rate: any) => {
                          const totalStayPrice = rate.totalPrice * nights;
                          return (
                            <div key={rate.id} className="border border-slate-100 hover:border-slate-200 bg-slate-50/50 p-4 rounded-2xl flex flex-col justify-between h-full hover:shadow-sm transition">
                              <div>
                                <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider mb-2 ${
                                  rate.refundable
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {rate.refundable ? 'Flexible / Refundable' : 'Prepaid / Non-Refundable'}
                                </span>
                                <p className="text-slate-900 font-bold text-xs">{rate.mealPlan}</p>
                                <p className="text-slate-400 text-[10px] mt-1 leading-snug">{rate.cancellationPolicy}</p>
                              </div>

                              <div className="flex justify-between items-end border-t border-slate-100 pt-3 mt-4">
                                <div>
                                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Tariff ({nights} nights)</span>
                                  <span className="text-base font-black text-slate-900">₹{totalStayPrice.toLocaleString('en-IN')}</span>
                                  <span className="block text-[8px] text-slate-400 font-bold">Includes ₹{rate.taxes?.toLocaleString()} taxes</span>
                                </div>
                                <Link
                                  href={`/booking/stay?propertyId=${property.id}&roomId=${room.id}&rateId=${rate.id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
                                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-4 py-2 rounded-lg text-[10px] shadow-sm transition"
                                >
                                  RESERVE ROOM
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-400 text-xs">
              No active room configurations found for the selected check-in criteria.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}


export default function StayDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 pt-32 flex flex-col items-center justify-center text-slate-800">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600 mb-2"></div>
        <p className="text-xs text-slate-400">Loading specs...</p>
      </div>
    }>
      <StayDetailPageContent />
    </Suspense>
  );
}
