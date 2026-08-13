"use client";

import React, { useState } from 'react';
import { DollarSign, Landmark, Sparkles, Plane, Hotel, Utensils, Compass, Footprints, Info, Lightbulb } from 'lucide-react';

const API_URL = typeof window === 'undefined'
  ? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api` : 'http://localhost:5000/api')
  : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:5000/api'
      : 'https://backend-blue-psi-76.vercel.app/api');

export default function AIBudgeterPage() {
  // Input states
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('5');
  const [travelStyle, setTravelStyle] = useState('Mid-range');

  // Response states
  const [budgetData, setBudgetData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || loading) return;

    setLoading(true);
    setError('');
    setBudgetData(null);

    try {
      const response = await fetch(`${API_URL}/ai/estimate-budget`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          duration: parseInt(duration),
          travelStyle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Budget estimation failed.');
      }

      setBudgetData(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (key: string) => {
    switch (key) {
      case 'flights':
        return <Plane className="h-5 w-5 text-teal-600" />;
      case 'accommodation':
        return <Hotel className="h-5 w-5 text-teal-600" />;
      case 'food':
        return <Utensils className="h-5 w-5 text-teal-600" />;
      case 'activities':
        return <Compass className="h-5 w-5 text-teal-600" />;
      case 'localTransport':
        return <Footprints className="h-5 w-5 text-teal-600" />;
      default:
        return <DollarSign className="h-5 w-5 text-teal-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-10">
          <span className="text-teal-700 font-extrabold text-xs uppercase tracking-widest bg-teal-100 px-3 py-1 rounded-full">
            Financials
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 flex items-center">
            <Landmark className="h-8 w-8 text-amber-500 mr-2" />
            AI Budget Estimator
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Get instant projected travel costs for flights, hotels, food, and tours tailored to your travel style.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* 1. Configuration Sidebar (Form) */}
          <div className="w-full lg:w-96 shrink-0 bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
            <div>
              <span className="font-extrabold text-slate-900 text-base flex items-center">
                Configure Budget
              </span>
              <p className="text-slate-400 text-xs mt-1">Provide trip parameters to calculate estimates.</p>
            </div>

            <form onSubmit={handleEstimate} className="space-y-5">
              {/* Destination */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Destination</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paris, Tokyo, Bali..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-slate-800 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                />
              </div>

              {/* Duration (Days) */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Duration (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  required
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-slate-800 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                />
              </div>

              {/* Travel Style Select */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Travel Style</label>
                <select
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                >
                  <option value="Budget">Budget (Hostels, local transport, street food)</option>
                  <option value="Mid-range">Mid-range (3-Star hotels, casual restaurants, tours)</option>
                  <option value="Luxury">Luxury (5-Star accommodation, fine dining, private tours)</option>
                </select>
              </div>

              {/* Estimate Trigger */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-700 hover:bg-teal-800 disabled:bg-slate-300 text-white font-extrabold py-3 rounded-lg text-sm transition-all duration-200 shadow flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Calculating...</span>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    <span>Estimate Budget</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* 2. Results Screen (Right Column) */}
          <div className="flex-grow w-full space-y-6">
            {loading && (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 skeleton">
                <div className="h-6 bg-slate-200 rounded w-1/4"></div>
                <div className="h-10 bg-slate-200 rounded w-1/2"></div>
                <div className="space-y-4 pt-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 bg-slate-100 rounded-xl"></div>
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

            {!budgetData && !loading && !error && (
              <div className="bg-white border border-slate-200 p-12 rounded-2xl text-center shadow-sm">
                <DollarSign className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-1">Your Budget Estimate Will Appear Here</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  Specify your travel style and duration on the left to see projected costs and breakdown charts.
                </p>
              </div>
            )}

            {budgetData && (
              <div className="space-y-6 animate-fade-in text-left">
                {/* Grand Total Info */}
                <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Estimated Trip Cost</span>
                    <h2 className="text-3xl font-extrabold text-slate-900 mt-1">{budgetData.destination}</h2>
                    <span className="text-xs font-semibold text-slate-400 block mt-1">
                      {budgetData.duration} Days &bull; {budgetData.travelStyle} Style
                    </span>
                  </div>
                  <div className="bg-teal-50 border border-teal-200 px-6 py-4 rounded-xl text-left shrink-0">
                    <span className="block text-[10px] text-teal-800 font-bold uppercase tracking-wider">Total Projected Cost</span>
                    <span className="text-3xl font-extrabold text-teal-700">${budgetData.totalEstimatedCost}</span>
                  </div>
                </div>

                {/* Categories Cost Grid */}
                <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
                  <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">Cost Breakdown</h3>
                  <div className="space-y-5">
                    {Object.entries(budgetData.breakdown || {}).map(([key, value]: [string, any]) => {
                      const percentage = Math.round((value / budgetData.totalEstimatedCost) * 100);
                      const keyLabel = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
                      return (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between items-center text-sm font-semibold">
                            <div className="flex items-center text-slate-700">
                              <span className="mr-3 bg-slate-100 p-1.5 rounded-lg border border-slate-200/50">
                                {getIcon(key)}
                              </span>
                              {keyLabel}
                            </div>
                            <div className="text-right">
                              <span className="text-slate-900 font-extrabold">${value}</span>
                              <span className="text-slate-400 text-xs ml-1.5">({percentage}%)</span>
                            </div>
                          </div>
                          {/* Progress Bar */}
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-teal-700 h-full rounded-full transition-all duration-500" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recommendations Box */}
                {budgetData.recommendations && budgetData.recommendations.length > 0 && (
                  <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl shadow-sm space-y-4">
                    <h3 className="font-bold text-amber-900 text-base flex items-center">
                      <Lightbulb className="h-5 w-5 text-amber-600 mr-2 shrink-0" />
                      Smart Savings Tips
                    </h3>
                    <ul className="space-y-2 text-xs font-semibold text-amber-800 list-disc pl-5">
                      {budgetData.recommendations.map((rec: string, idx: number) => (
                        <li key={idx} className="leading-relaxed">{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
