"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Compass, Calendar, Users, Sparkles, DollarSign, MessageCircle, Star, ShieldCheck, MapPin } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const DEFAULT_DESTINATIONS = [
  {
    id: '1',
    name: 'Paris',
    country: 'France',
    category: 'Cultural',
    estimatedBudget: 140000,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 32,
    description: 'The City of Light is a global center for art, fashion, gastronomy, and culture.',
  },
  {
    id: '2',
    name: 'Bali',
    country: 'Indonesia',
    category: 'Relaxation',
    estimatedBudget: 45000,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 28,
    description: 'A tropical paradise famed for its forested volcanic mountains, beaches, and coral reefs.',
  },
  {
    id: '3',
    name: 'Tokyo',
    country: 'Japan',
    category: 'Adventure',
    estimatedBudget: 140000,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 45,
    description: 'Japan’s busy capital mixes ultra-modern neon skyscrapers with historic Shinto temples.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah Jenkins',
    role: 'Solo Backpacker',
    content: 'The AI Itinerary Planner generated a 5-day Tokyo schedule that was absolutely perfect. It suggested spots I would have never found in normal blogs!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
  },
  {
    name: 'Marcus & Elena',
    role: 'Honeymooners',
    content: 'We booked the Bali package directly from FindMyWay. The payment process was seamless, and the custom day-by-day plan helped us enjoy our stay stress-free.',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
  },
  {
    name: 'David Carter',
    role: 'Family of 4',
    content: 'The AI Budget Estimator gave us a breakdown that matched our final costs to within 5%. An indispensable tool for family planning!',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<any[]>(DEFAULT_DESTINATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [travelers, setTravelers] = useState('2');

  useEffect(() => {
    // Fetch featured destinations from backend
    const fetchDestinations = async () => {
      try {
        const response = await fetch(`${API_URL}/destinations?limit=3`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setDestinations(data.slice(0, 3));
          }
        }
      } catch (err) {
        console.warn('Backend API connection failed, showing default local destinations instead.');
      }
    };
    fetchDestinations();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (category) params.append('category', category);
    params.append('travelers', travelers);
    router.push(`/destinations?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* 1. Hero Section */}
      <div 
        className="relative min-h-[90vh] flex items-center justify-center bg-cover bg-center pt-24"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80')` 
        }}
      >
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/85"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center text-white flex flex-col items-center">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-teal-500/25 border border-teal-400/30 text-teal-300 mb-6 animate-pulse">
            <Sparkles className="h-3.5 w-3.5 mr-1 text-amber-400" />
            Discover Your Next Destination
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none mb-6">
            EXPLORE THE WORLD WITH <span className="bg-gradient-to-r from-teal-400 to-amber-500 bg-clip-text text-transparent">AI INTELLIGENCE</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-200 max-w-3xl mb-8 font-medium">
            Plan custom day-by-day itineraries, estimate holiday budgets, book verified local packages, and get direct smart guidance.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link
              href="/destinations"
              className="bg-teal-700 hover:bg-teal-800 text-white font-extrabold px-6 py-3.5 rounded-xl text-sm transition shadow hover:shadow-lg"
            >
              Explore 150+ Destinations
            </Link>
            <Link
              href="/packages"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl text-sm transition shadow hover:shadow-lg"
            >
              Find Your Perfect Tour
            </Link>
          </div>

          {/* Redesigned Search Panel */}
          <form 
            onSubmit={handleSearch} 
            className="w-full max-w-4xl bg-slate-900/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-slate-700 shadow-2xl flex flex-col md:flex-row gap-4 text-slate-800"
          >
            {/* Search Input */}
            <div className="flex-1 relative">
              <label className="block text-xs font-bold text-teal-400 uppercase tracking-wider mb-1.5 text-left">Where to?</label>
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Paris, Tokyo, Bali..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Category Select */}
            <div className="w-full md:w-56">
              <label className="block text-xs font-bold text-teal-400 uppercase tracking-wider mb-1.5 text-left">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              >
                <option value="">All Categories</option>
                <option value="Adventure">Adventure</option>
                <option value="Cultural">Cultural</option>
                <option value="Relaxation">Relaxation</option>
                <option value="Food">Food</option>
              </select>
            </div>

            {/* Travelers Select */}
            <div className="w-full md:w-40">
              <label className="block text-xs font-bold text-teal-400 uppercase tracking-wider mb-1.5 text-left">Travelers</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 text-slate-400 h-5 w-5" />
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                >
                  <option value="1">1 Person</option>
                  <option value="2">2 People</option>
                  <option value="3">3 People</option>
                  <option value="4">4 People</option>
                  <option value="5">5+ People</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-8 py-3 rounded-lg text-sm transition-all duration-200 shadow-md shadow-amber-500/25 hover:shadow-amber-500/35 hover:-translate-y-0.5"
              >
                Explore Now
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 2. Popular Destinations Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-16">
          <span className="text-teal-700 font-extrabold text-sm uppercase tracking-widest bg-teal-100 px-3 py-1 rounded-full">
            Featured Destinations
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4">
            Awaited Adventures Around The World
          </h2>
          <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
            Choose from our top-rated destinations or use our smart tools to build a custom journey.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {destinations.map((dest) => {
            const hasReviews = dest.reviewCount !== undefined;
            return (
              <div key={dest.id} className="custom-card flex flex-col overflow-hidden h-full">
                {/* Image Wrapper */}
                <div className="relative h-64 w-full overflow-hidden group">
                  <img
                    src={dest.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'; }}
                  />
                  <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-sm text-amber-400 font-bold text-xs py-1 px-2.5 rounded-full flex items-center shadow">
                    <Star className="h-3.5 w-3.5 fill-amber-400 mr-1" />
                    {dest.rating.toFixed(1)} {hasReviews && `(${dest.reviewCount})`}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-teal-700 text-white font-extrabold text-sm py-1.5 px-3 rounded-lg shadow-lg">
                    Est. Budget: ₹{dest.estimatedBudget?.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Details Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center text-teal-805 text-xs font-extrabold uppercase tracking-wider mb-2">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-teal-650" />
                    {dest.country} &bull; {dest.region}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
                    {dest.name}
                  </h3>
                  <p className="text-slate-600 text-sm mb-6 flex-1 line-clamp-3">
                    {dest.description}
                  </p>
                  <Link
                    href={`/destinations/${dest.id}`}
                    className="w-full text-center bg-teal-50 hover:bg-teal-700 text-teal-800 hover:text-white font-bold py-2.5 px-4 rounded-lg text-sm border border-teal-700/20 hover:border-transparent transition-all duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Why Choose Us / Statistics Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-16">
            <span className="text-amber-400 font-bold text-xs uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-4">
              Smart Features For Modern Explorers
            </h2>
            <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
              FindMyWay combines local tour experiences with advanced artificial intelligence to save you time and money.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Box 1 */}
            <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl hover:border-teal-500/50 transition-all duration-300">
              <div className="bg-teal-500/15 p-4 rounded-xl w-14 h-14 flex items-center justify-center text-teal-400 mb-6">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Itinerary Planner</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Create a customized day-by-day vacation schedule matching your travel pace, budget, and specific hobbies in seconds.
              </p>
            </div>

            {/* Box 2 */}
            <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl hover:border-teal-500/50 transition-all duration-300">
              <div className="bg-amber-500/15 p-4 rounded-xl w-14 h-14 flex items-center justify-center text-amber-400 mb-6">
                <DollarSign className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Budget Estimator</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Receive visual expense estimates detailing local hotels, food, transportation, and tours to help structure your savings.
              </p>
            </div>

            {/* Box 3 */}
            <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl hover:border-teal-500/50 transition-all duration-300">
              <div className="bg-teal-500/15 p-4 rounded-xl w-14 h-14 flex items-center justify-center text-teal-400 mb-6">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Local Bookings</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Book structured tour packages with local guides. Complete your checkout securely via simulated payment test environments.
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-slate-800 text-center">
            <div>
              <div className="text-4xl font-extrabold text-teal-400">12k+</div>
              <div className="text-slate-400 text-sm mt-1">Happy Travelers</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-amber-400">150+</div>
              <div className="text-slate-400 text-sm mt-1">Curated Destinations</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-teal-400">99.4%</div>
              <div className="text-slate-400 text-sm mt-1">Accuracy Rating</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-amber-400">24/7</div>
              <div className="text-slate-400 text-sm mt-1">AI Companion Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Testimonials Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-16">
            <span className="text-teal-700 font-extrabold text-sm uppercase tracking-widest bg-teal-100 px-3 py-1 rounded-full">
              Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4">
              What Our Travelers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow duration-250">
                <div className="flex items-center mb-6">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-12 w-12 rounded-full object-cover mr-4 ring-2 ring-teal-500/20"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900">{t.name}</h4>
                    <span className="text-slate-500 text-xs font-semibold">{t.role}</span>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed flex-1 italic">
                  "{t.content}"
                </p>
                <div className="flex text-amber-500 mt-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Call-To-Action (CTA) Section */}
      <section className="py-16 bg-gradient-to-r from-teal-800 to-teal-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-700/20 via-transparent to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Ready to Begin Your Next Adventure?
          </h2>
          <p className="text-teal-200 text-base max-w-2xl mb-8 font-medium">
            Register an account today, consult with our chatbot assistant, and generate your dream holiday plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold px-8 py-3 rounded-lg text-sm transition shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20"
            >
              Sign Up For Free
            </Link>
            <Link
              href="/ai-planner"
              className="bg-slate-800 hover:bg-slate-700 text-white font-extrabold px-8 py-3 rounded-lg text-sm border border-slate-700 hover:border-slate-600 transition"
            >
              Try AI Planner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
