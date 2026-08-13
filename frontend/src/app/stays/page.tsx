"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Hotel, Calendar, Users, MapPin, Loader2, Star, Sparkles, Filter, SlidersHorizontal, ArrowUpDown, Compass } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function StaysPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search parameters from URL or defaults
  const initialCity = searchParams.get('cityCode') || 'PAR';
  const initialCheckIn = searchParams.get('checkIn') || '2026-10-15';
  const initialCheckOut = searchParams.get('checkOut') || '2026-10-20';
  const initialGuests = parseInt(searchParams.get('guests') || '1') || 1;

  const [cityCode, setCityCode] = useState(initialCity);
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);

  // Stays list, loading, error states
  const [stays, setStays] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Filters State
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [priceSort, setPriceSort] = useState<'asc' | 'desc' | 'rating'>('asc');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(100000);

  const amenitiesList = [
    'Free WiFi',
    'Pool',
    'Spa & Wellness',
    'Fitness Center',
    'Michelin Restaurant',
    'Bar',
    'Sea View',
    'Eiffel Tower View',
    '24-hour Room Service'
  ];

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    setSearchTriggered(true);

    try {
      const query = new URLSearchParams({
        cityCode: cityCode.toUpperCase().trim(),
        checkIn,
        checkOut,
        guests: String(guests)
      });

      // Update URL parameters
      router.push(`/stays?${query.toString()}`);

      const response = await fetch(`${API_URL}/stays/search?${query.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setStays(data);
      } else {
        const errJson = await response.json();
        setError(errJson.message || 'Failed to search accommodations.');
      }
    } catch (err) {
      setError('Connection to stay service failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Perform search on mount if url params exist
  useEffect(() => {
    if (searchParams.get('cityCode')) {
      handleSearch();
    }
  }, []);

  const toggleAmenity = (name: string) => {
    setSelectedAmenities(prev =>
      prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
    );
  };

  // Apply filters client-side
  const filteredStays = stays
    .filter(stay => {
      // Star Rating Filter
      if (starFilter && stay.starRating !== starFilter) return false;
      // Max Price Filter (approximate starting price by deluxe room prepaid rate)
      const startingPrice = stay.rooms?.[0]?.rates?.[0]?.totalPrice || 15000;
      if (startingPrice > maxPrice) return false;
      // Amenities Filter
      if (selectedAmenities.length > 0) {
        const hasAll = selectedAmenities.every(a => stay.amenities.includes(a));
        if (!hasAll) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const priceA = a.rooms?.[0]?.rates?.[0]?.totalPrice || 15000;
      const priceB = b.rooms?.[0]?.rates?.[0]?.totalPrice || 15000;

      if (priceSort === 'asc') return priceA - priceB;
      if (priceSort === 'desc') return priceB - priceA;
      if (priceSort === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="mb-10 text-left">
          <span className="text-emerald-700 font-extrabold text-[10px] uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
            ACCOMMODATIONS
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
            Find Stays & Luxury Resorts
          </h1>
          <p className="text-slate-500 text-sm mt-1.5">
            Query live provider tariffs normalized through secure travel registries.
          </p>
        </div>

        {/* Dynamic Search Parameters Bar */}
        <form onSubmit={handleSearch} className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm mb-10 flex flex-col md:flex-row gap-4 items-end text-left">
          <div className="w-full md:flex-1">
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400" /> City IATA Code
            </label>
            <input
              type="text"
              required
              maxLength={3}
              value={cityCode}
              onChange={(e) => setCityCode(e.target.value.toUpperCase())}
              placeholder="e.g. PAR"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold uppercase tracking-wider focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="w-full md:w-44">
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" /> Check In
            </label>
            <input
              type="date"
              required
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-xs font-bold focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="w-full md:w-44">
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" /> Check Out
            </label>
            <input
              type="date"
              required
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-xs font-bold focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="w-full md:w-32">
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-slate-400" /> Guests
            </label>
            <input
              type="number"
              min={1}
              max={8}
              required
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold focus:outline-none focus:border-emerald-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-extrabold px-8 py-3.5 rounded-2xl text-sm transition tracking-wider flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span>SEARCH STAYS</span>
          </button>
        </form>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-emerald-700" /> Filter Criteria
              </h3>
              {searchTriggered && (
                <button
                  onClick={() => {
                    setStarFilter(null);
                    setSelectedAmenities([]);
                    setMaxPrice(100000);
                  }}
                  className="text-xs text-emerald-700 font-bold hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Price Sort Selection */}
            <div className="mb-6">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <ArrowUpDown className="h-3.5 w-3.5" /> Sort Results
              </label>
              <select
                value={priceSort}
                onChange={(e: any) => setPriceSort(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold focus:outline-none focus:border-emerald-600"
              >
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
                <option value="rating">Rating: High to Low</option>
              </select>
            </div>

            {/* Price Cap Filter */}
            <div className="mb-6">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                Max Price per Night (₹{maxPrice.toLocaleString()})
              </label>
              <input
                type="range"
                min={5000}
                max={100000}
                step={5000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                <span>₹5,000</span>
                <span>₹100,000+</span>
              </div>
            </div>

            {/* Star Rating Selection */}
            <div className="mb-6">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                Star Rating
              </label>
              <div className="flex gap-2">
                {[3, 4, 5].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setStarFilter(starFilter === stars ? null : stars)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 border ${
                      starFilter === stars
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{stars}</span>
                    <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities Checklist */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-3.5">
                Key Amenities
              </label>
              <div className="space-y-2">
                {amenitiesList.map((name) => (
                  <label key={name} className="flex items-center gap-3 cursor-pointer group text-xs font-semibold text-slate-600">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(name)}
                      onChange={() => toggleAmenity(name)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <span className="group-hover:text-slate-900 transition">{name}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Results Block */}
          <main className="flex-1 w-full text-left">
            {error && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-slate-800 rounded-2xl flex items-start text-xs font-semibold shadow-sm">
                <Compass className="h-5 w-5 text-emerald-600 mr-3 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-slate-900">Developer API Update Notice</p>
                  <p className="text-slate-500 text-[11px] font-normal leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            {loading ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm flex flex-col items-center justify-center h-96">
                <Loader2 className="h-8 w-8 text-emerald-700 animate-spin mb-4" />
                <h4 className="font-bold text-slate-900">Querying live stays registry...</h4>
                <p className="text-slate-400 text-xs mt-1">Normalizing accommodations and tariffs adapter data.</p>
              </div>
            ) : !searchTriggered ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm h-96 flex flex-col items-center justify-center">
                <Hotel className="h-12 w-12 text-slate-300 mb-4" />
                <h4 className="font-extrabold text-slate-900 text-base">Find Accommodations</h4>
                <p className="text-slate-400 text-xs mt-1.5 max-w-sm leading-relaxed">
                  Enter your target IATA city code (like PAR, LON, or DEL) and dates to locate accommodations.
                </p>
              </div>
            ) : filteredStays.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm h-96 flex flex-col items-center justify-center">
                <Hotel className="h-10 w-10 text-slate-350 mb-3" />
                <h4 className="font-bold text-slate-800">No matching accommodations</h4>
                <p className="text-slate-400 text-xs mt-1">Try broadening your pricing cap or reducing amenity filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredStays.map((stay: any) => {
                  const startingPrice = stay.rooms?.[0]?.rates?.[0]?.totalPrice || 15000;
                  const displayImage = stay.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

                  return (
                    <div key={stay.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col h-full">
                      {/* Image Frame */}
                      <div className="relative h-48 w-full bg-slate-100 shrink-0">
                        <img
                          src={displayImage}
                          alt={stay.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-amber-400 font-bold text-[10px] py-1 px-3 rounded-full flex items-center shadow-sm">
                          <Star className="h-3.5 w-3.5 fill-amber-400 mr-1.5" />
                          <span>{stay.rating} ({stay.reviewCount} reviews)</span>
                        </div>
                        {stay.provider === 'mock' && (
                          <div className="absolute top-4 right-4 bg-emerald-700 text-white font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                            DEMO MODE
                          </div>
                        )}
                      </div>

                      {/* Info Details */}
                      <div className="p-6 flex-grow flex flex-col justify-between text-left">
                        <div>
                          <div className="flex items-center gap-1 mb-2">
                            {Array.from({ length: stay.starRating }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <h3 className="font-extrabold text-slate-900 text-lg leading-snug mb-1">{stay.name}</h3>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                            <MapPin className="h-3.5 w-3.5 text-slate-350" /> {stay.address}
                          </span>

                          {/* Features */}
                          <div className="flex flex-wrap gap-1.5 mt-4">
                            {stay.amenities?.slice(0, 4).map((a: string) => (
                              <span key={a} className="bg-slate-50 text-slate-500 border border-slate-100 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                                {a}
                              </span>
                            ))}
                            {stay.amenities?.length > 4 && (
                              <span className="text-[10px] text-slate-400 font-bold px-1.5 py-0.5">
                                +{stay.amenities.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="flex justify-between items-end border-t border-slate-100 pt-4 mt-6">
                          <div>
                            <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Starting per night</span>
                            <span className="text-lg font-black text-slate-900">₹{startingPrice.toLocaleString('en-IN')}</span>
                          </div>
                          <Link
                            href={`/stays/${stay.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-sm transition"
                          >
                            VIEW ROOMS
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
