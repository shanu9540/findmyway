"use client";

export const dynamic = 'force-dynamic';

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Filter, Star, Compass, AlertCircle, MapPin, SlidersHorizontal } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const REGION_OPTIONS = [
  { label: 'Middle East', value: 'Middle East' },
  { label: 'South Asia', value: 'South Asia' },
  { label: 'Southeast Asia', value: 'Southeast Asia' },
  { label: 'East Asia', value: 'East Asia' },
  { label: 'Europe', value: 'Europe' },
  { label: 'North America', value: 'North America' },
  { label: 'South America', value: 'South America' },
  { label: 'Africa', value: 'Africa' },
  { label: 'Oceania', value: 'Oceania' }
];

function DestinationsListingPageContent() {
  const searchParams = useSearchParams();
  
  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [region, setRegion] = useState(searchParams.get('region') || '');
  const [maxPrice, setMaxPrice] = useState<number>(300000); // 3L INR
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (category) query.append('category', category);
      if (region) query.append('region', region);
      if (maxPrice) query.append('maxPrice', String(maxPrice));

      const response = await fetch(`${API_URL}/destinations?${query.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setDestinations(data);
        setIsUsingFallback(false);
      } else {
        throw new Error('Non-ok response');
      }
    } catch (err) {
      console.warn('Backend API connection failed, showing empty state.');
      setDestinations([]);
      setIsUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [searchParams]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setRegion('');
    setMaxPrice(300000);
    const router = window.history;
    router.replaceState({}, '', '/destinations');
    fetchDestinations();
  };

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDestinations();
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-10 text-left">
          <span className="text-teal-700 font-extrabold text-xs uppercase tracking-widest bg-teal-100 px-3 py-1 rounded-full">
            Exploration
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
            Explore Destinations
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Browse through 150+ worldwide destinations and plan your next tour.
          </p>
        </div>

        {/* Fallback Warning Banner */}
        {isUsingFallback && (
          <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start text-rose-900">
            <AlertCircle className="h-5 w-5 mr-3 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-sm block">Database connection lost</span>
              <span className="text-xs font-semibold text-rose-800">
                Please check that your backend server is active to access all 150+ destinations.
              </span>
            </div>
          </div>
        )}

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

              {/* Text Search */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Country, city, attraction..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                />
              </div>

              {/* Region Dropdown */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                >
                  <option value="">All Regions</option>
                  {REGION_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              {/* Category Dropdown */}
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
                </select>
              </div>

              {/* Price Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">Max Budget (INR)</label>
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

              {/* Search Trigger */}
              <button
                type="submit"
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center justify-center shadow"
              >
                Apply Filters
              </button>
            </form>
          </aside>

          {/* 2. Listings Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-2xl h-96 overflow-hidden flex flex-col skeleton">
                    <div className="h-56 bg-slate-200"></div>
                    <div className="p-6 flex-1 space-y-4">
                      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                      <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : destinations.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
                <Compass className="h-12 w-12 text-slate-400 mx-auto mb-4 animate-bounce" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">No destinations found</h3>
                <p className="text-slate-500 text-sm mb-6">Try adjusting your filters or search keywords.</p>
                <button
                  onClick={handleResetFilters}
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-5 py-2 rounded-lg text-sm transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {destinations.map((dest) => {
                  return (
                    <div key={dest.id} className="custom-card flex flex-col overflow-hidden h-full">
                      {/* Image */}
                      <div className="relative h-52 w-full overflow-hidden group bg-slate-100">
                        <img
                          src={dest.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'}
                          alt={dest.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'; }}
                        />
                        <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-sm text-amber-400 font-bold text-xs py-1 px-2.5 rounded-full flex items-center shadow">
                          <Star className="h-3.5 w-3.5 fill-amber-400 mr-1" />
                          {dest.rating.toFixed(1)} ({dest.reviewCount})
                        </div>
                        <div className="absolute bottom-4 right-4 bg-teal-700 text-white font-extrabold text-xs py-1.5 px-3 rounded-lg shadow-md">
                          Est. Budget: ₹{dest.estimatedBudget?.toLocaleString('en-IN')}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center text-teal-800 text-xs font-extrabold uppercase tracking-wider mb-2">
                          <MapPin className="h-3.5 w-3.5 mr-1 text-teal-650" />
                          {dest.country} &bull; {dest.region}
                        </div>
                        <h3 className="text-lg font-bold text-slate-905 mb-2 leading-tight">
                          {dest.name}
                        </h3>
                        <p className="text-slate-600 text-sm mb-6 flex-1 line-clamp-3">
                          {dest.description}
                        </p>
                        <Link
                          href={`/destinations/${dest.id}`}
                          className="w-full text-center bg-teal-50 hover:bg-teal-700 text-teal-800 hover:text-white font-bold py-2.5 px-4 rounded-lg text-sm border border-teal-700/20 hover:border-transparent transition-all duration-200"
                        >
                          Explore Details
                        </Link>
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


export default function DestinationsListingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 pt-32 flex flex-col items-center justify-center text-slate-800">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600 mb-2"></div>
        <p className="text-xs text-slate-400">Loading specs...</p>
      </div>
    }>
      <DestinationsListingPageContent />
    </Suspense>
  );
}
