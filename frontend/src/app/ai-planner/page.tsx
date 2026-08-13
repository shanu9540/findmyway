"use client";

export const dynamic = 'force-dynamic';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Calendar, DollarSign, ListTodo, MapPin, Info, Save, Clock, ChevronRight } from 'lucide-react';

const API_URL = typeof window === 'undefined'
  ? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api` : 'http://localhost:5000/api')
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');

const INTEREST_OPTIONS = ['Adventure', 'Food', 'Culture', 'Relaxation', 'Shopping', 'Nature'];

function AIPlannerPageContent() {
  const searchParams = useSearchParams();
  const { user, token } = useAuth();

  // Input states
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState('3');
  const [budget, setBudget] = useState('1000');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Response states
  const [itinerary, setItinerary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedId, setSavedId] = useState<string | null>(null);

  // Pre-fill from URL parameters if present
  useEffect(() => {
    const destParam = searchParams.get('destination');
    if (destParam) {
      setDestination(destParam);
    }
  }, [searchParams]);

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || loading) return;

    setLoading(true);
    setError('');
    setItinerary(null);
    setSavedId(null);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/ai/generate-itinerary`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          destination,
          days: parseInt(days),
          budget: parseFloat(budget),
          interests: selectedInterests,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Itinerary generation failed.');
      }

      setItinerary(data.itinerary);
      setSavedId(data.savedId);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-10">
          <span className="text-teal-700 font-extrabold text-xs uppercase tracking-widest bg-teal-100 px-3 py-1 rounded-full">
            AI Assistant
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 flex items-center">
            <Sparkles className="h-8 w-8 text-amber-500 mr-2" />
            AI Itinerary Planner
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Build your personalized holiday schedule in seconds using GPT-4o intelligence.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* 1. Configuration Panel (Sidebar style) */}
          <div className="w-full lg:w-96 shrink-0 bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
            <div>
              <span className="font-extrabold text-slate-900 text-base flex items-center">
                Configure Trip
              </span>
              <p className="text-slate-400 text-xs mt-1">Specify parameters to formulate your schedule.</p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-5">
              {/* Destination */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Destination</label>
                <input
                  type="text"
                  required
                  placeholder="Paris, Tokyo, Bali..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-slate-800 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                />
              </div>

              {/* Days & Budget Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    required
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-slate-800 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Budget (USD)</label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-slate-800 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Interests Checklist */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Travel Style / Interests</label>
                <div className="grid grid-cols-2 gap-2">
                  {INTEREST_OPTIONS.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        type="button"
                        key={interest}
                        onClick={() => handleInterestToggle(interest)}
                        className={`text-xs font-bold py-2 px-3 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'bg-teal-50 border-teal-500 text-teal-800 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Generate Trigger */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-700 hover:bg-teal-800 disabled:bg-slate-300 text-white font-extrabold py-3 rounded-lg text-sm transition-all duration-200 shadow flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Generating plan...</span>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Compile Itinerary</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* 2. Results Screen (Right Column) */}
          <div className="flex-grow w-full space-y-6">
            {loading && (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 skeleton">
                <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                <div className="space-y-4 pt-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-slate-100 rounded-xl"></div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-900 p-6 rounded-2xl flex items-start">
                <Info className="h-5 w-5 text-rose-500 mr-3 shrink-0 mt-0.5" />
                <span className="text-sm font-semibold">{error}</span>
              </div>
            )}

            {!itinerary && !loading && !error && (
              <div className="bg-white border border-slate-200 p-12 rounded-2xl text-center shadow-sm">
                <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-1">Your Trip Plan Will Appear Here</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  Fill in your travel preferences on the left and submit to compile a custom schedule.
                </p>
              </div>
            )}

            {itinerary && (
              <div className="space-y-6 animate-fade-in text-left">
                {/* Result Header Info */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Generated Trip Plan</span>
                    <h2 className="text-2xl font-bold text-slate-900 mt-0.5">{itinerary.destination}</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estimated Budget</span>
                      <span className="text-lg font-extrabold text-teal-700">${itinerary.totalEstimatedCost || budget}</span>
                    </div>
                    {savedId && (
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center">
                        <Save className="h-3.5 w-3.5 mr-1" />
                        Saved in Dashboard
                      </span>
                    )}
                  </div>
                </div>

                {/* Day-by-Day Timeline */}
                <div className="space-y-6">
                  {itinerary.itinerary?.map((day: any) => (
                    <div key={day.day} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                      <div className="bg-slate-900 text-white py-3 px-6 flex justify-between items-center">
                        <h3 className="font-extrabold text-sm uppercase tracking-wide text-amber-400">Day {day.day}</h3>
                        <span className="text-xs font-semibold text-slate-200">{day.theme}</span>
                      </div>

                      {/* Activities Stack */}
                      <div className="p-6 divide-y divide-slate-100">
                        {day.activities?.map((activity: any, actIdx: number) => (
                          <div key={actIdx} className={`py-4 flex gap-4 items-start ${actIdx === 0 ? 'pt-0' : ''} ${actIdx === day.activities.length - 1 ? 'pb-0' : ''}`}>
                            <div className="bg-teal-50 text-teal-800 p-2.5 rounded-lg border border-teal-100 shrink-0">
                              <Clock className="h-4 w-4" />
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between items-start gap-4">
                                <h4 className="font-bold text-slate-900 text-sm">{activity.activity}</h4>
                                <span className="text-xs font-bold text-slate-500 shrink-0">${activity.cost}</span>
                              </div>
                              <div className="flex items-center text-xs text-slate-400 font-semibold mt-1">
                                <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400" />
                                {activity.location}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}


export default function AIPlannerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 pt-32 flex flex-col items-center justify-center text-slate-800">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600 mb-2"></div>
        <p className="text-xs text-slate-400">Loading specs...</p>
      </div>
    }>
      <AIPlannerPageContent />
    </Suspense>
  );
}
