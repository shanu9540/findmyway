"use client";

export const dynamic = 'force-dynamic';

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Filter, Star, Clock, MapPin, SlidersHorizontal, Bed, Utensils, Car, Sparkles } from 'lucide-react';

const API_URL = typeof window === 'undefined'
  ? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api` : 'http://localhost:5000/api')
  : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:5000/api'
      : 'https://backend-blue-psi-76.vercel.app/api');

const CONTINENT_OPTIONS = [
  { label: 'Asia', value: 'Asia' },
  { label: 'Europe', value: 'Europe' },
  { label: 'North America', value: 'North America' },
  { label: 'South America', value: 'South America' },
  { label: 'Africa', value: 'Africa' },
  { label: 'Australia & Oceania', value: 'Australia & Oceania' },
  { label: 'Middle East', value: 'Middle East' },
  { label: 'India', value: 'India' }
];

function PackagesListingPageContent() {
  const searchParams = useSearchParams();

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [continent, setContinent] = useState(searchParams.get('continent') || '');
  const [maxPrice, setMaxPrice] = useState<number>(400000); // 4L INR
  const [duration, setDuration] = useState(searchParams.get('duration') || '');
  const [sortBy, setSortBy] = useState('recommended');

  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (category) query.append('category', category);
      if (continent) query.append('continent', continent);
      if (maxPrice) query.append('maxPrice', String(maxPrice));
      if (duration) query.append('duration', duration);
      if (sortBy) query.append('sortBy', sortBy);

      const response = await fetch(`${API_URL}/packages?${query.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setPackages(data);
      }
    } catch (err) {
      console.error('Failed to fetch packages:', err);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [searchParams, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setContinent('');
    setDuration('');
    setMaxPrice(400000);
    setSortBy('recommended');
    const router = window.history;
    router.replaceState({}, '', '/packages');
    fetchPackages();
  };

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPackages();
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div className="text-left">
            <span className="text-teal-700 font-extrabold text-xs uppercase tracking-widest bg-teal-100 px-3 py-1 rounded-full">
              Deal Bookings
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              Worldwide Tour Packages
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Select and book dynamic, curated packages with instant discounts.
            </p>
          </div>
          
          {/* Sorting */}
          <div className="flex items-center gap-2 shrink-0">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-teal-500"
            >
              <option value="recommended">Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="popularity">Most Popular</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* 1. Sidebar Filters */}
          <aside className="w-full lg:w-72 shrink-0">
            <form 
              onSubmit={handleApplyFilters}
              className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6 sticky top-24"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="font-extrabold text-slate-900 text-base flex items-center">
                  <SlidersHorizontal className="h-4 w-4 mr-2 text-teal-700" />
                  Filters
                </span>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900"
                >
                  Reset All
                </button>
              </div>

              {/* Keyword Search */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Search Destination</label>
                <input
                  type="text"
                  placeholder="Paris, Dubai, Delhi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                />
              </div>

              {/* Continent Select */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Continent</label>
                <select
                  value={continent}
                  onChange={(e) => setContinent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                >
                  <option value="">All Continents</option>
                  {CONTINENT_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Duration Filter */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Trip Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                >
                  <option value="">Any Duration</option>
                  <option value="short">1 - 3 Days</option>
                  <option value="medium">4 - 6 Days</option>
                  <option value="long">7+ Days</option>
                </select>
              </div>

              {/* Category Select */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                >
                  <option value="">All Categories</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Relaxation">Relaxation</option>
                  <option value="Food">Food</option>
                  <option value="Romantic">Romantic</option>
                  <option value="Trending">Trending</option>
                  <option value="Nature">Nature</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>

              {/* Budget slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">Max Price (INR)</label>
                  <span className="text-sm font-bold text-teal-700">₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="400000"
                  step="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
                  <span>₹5K</span>
                  <span>₹400K</span>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-2.5 rounded-lg text-sm transition shadow"
              >
                Apply Filters
              </button>
            </form>
          </aside>

          {/* 2. Listings Grid */}
          <main className="flex-grow flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-2xl h-[420px] overflow-hidden skeleton">
                    <div className="h-56 bg-slate-200"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-slate-200 w-1/3 rounded"></div>
                      <div className="h-6 bg-slate-200 w-3/4 rounded"></div>
                      <div className="h-4 bg-slate-200 w-full rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : packages.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
                <Clock className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">No tour packages found</h3>
                <p className="text-slate-500 text-sm mb-6">Try clearing or adjusting filters.</p>
                <button
                  onClick={handleResetFilters}
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-5 py-2 rounded-lg text-sm transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {packages.map((pkg) => {
                  return (
                    <div key={pkg.id} className="custom-card flex flex-col overflow-hidden h-full">
                      {/* Image */}
                      <div className="relative h-56 w-full overflow-hidden group bg-slate-100">
                        <img
                          src={pkg.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'}
                          alt={pkg.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'; }}
                        />
                        <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-sm text-amber-400 font-bold text-xs py-1 px-2.5 rounded-full flex items-center shadow">
                          <Star className="h-3.5 w-3.5 fill-amber-400 mr-1" />
                          {pkg.rating.toFixed(1)} ({pkg.reviewCount})
                        </div>
                        {pkg.discount > 0 && (
                          <div className="absolute top-4 right-4 bg-amber-500 text-slate-950 font-extrabold text-xs py-1 px-2 rounded-lg shadow">
                            {pkg.discount}% OFF
                          </div>
                        )}
                        <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-sm text-white text-[10px] font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 border border-slate-700/50">
                          <Clock className="h-3.5 w-3.5 text-teal-400" />
                          <span>{pkg.duration}D / {pkg.nights}N</span>
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="p-6 flex-grow flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-extrabold text-teal-800 bg-teal-50 border border-teal-150 py-0.5 px-2.5 rounded-md uppercase tracking-wider">
                            {pkg.category}
                          </span>
                          <h3 className="text-lg font-bold text-slate-900 mt-2 mb-2 leading-tight">
                            {pkg.title}
                          </h3>
                          <div className="flex items-center text-xs text-slate-400 font-semibold mb-3">
                            <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400" />
                            {pkg.destination?.name}, {pkg.country}
                          </div>
                          
                          {/* Quick inclusions badges */}
                          <div className="flex gap-4 text-xs font-semibold text-slate-500 mb-6 py-2 border-y border-slate-100">
                            <span className="flex items-center"><Bed className="h-4 w-4 mr-1 text-teal-600" /> Hotel</span>
                            <span className="flex items-center"><Utensils className="h-4 w-4 mr-1 text-teal-600" /> Meals</span>
                            <span className="flex items-center"><Car className="h-4 w-4 mr-1 text-teal-600" /> Transit</span>
                          </div>
                        </div>

                        {/* CTA Pricing row */}
                        <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto">
                          <div>
                            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Adult Rate</span>
                            <div className="flex items-center gap-1.5">
                              {pkg.discount > 0 && (
                                <span className="text-xs text-slate-400 line-through">₹{pkg.originalPrice?.toLocaleString('en-IN')}</span>
                              )}
                              <span className="text-lg font-extrabold text-slate-900">₹{pkg.pricePerAdult?.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link
                              href={`/packages/${pkg.id}`}
                              className="bg-teal-50 hover:bg-teal-700 text-teal-800 hover:text-white border border-teal-700/20 hover:border-transparent font-bold py-2 px-3 rounded-lg text-xs transition-all duration-200"
                            >
                              Details
                            </Link>
                            <Link
                              href={`/booking?packageId=${pkg.id}`}
                              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold py-2 px-4 rounded-lg text-xs transition shadow"
                            >
                              Book Now
                            </Link>
                          </div>
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


export default function PackagesListingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 pt-32 flex flex-col items-center justify-center text-slate-800">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600 mb-2"></div>
        <p className="text-xs text-slate-400">Loading specs...</p>
      </div>
    }>
      <PackagesListingPageContent />
    </Suspense>
  );
}
