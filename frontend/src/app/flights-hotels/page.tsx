"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Compass, Plane, Hotel, Calendar, Users, MapPin, Loader2, Sparkles, Star } from 'lucide-react';

const API_URL = typeof window === 'undefined'
  ? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api` : 'http://localhost:5000/api')
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');

export default function FlightsHotelsPage() {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels'>('flights');
  
  // Flight Query States
  const [origin, setOrigin] = useState('DEL');
  const [destination, setDestination] = useState('PAR');
  const [flightDate, setFlightDate] = useState('2026-10-15');
  const [adults, setAdults] = useState(1);
  const [flights, setFlights] = useState<any[]>([]);

  // Hotel Query States
  const [cityCode, setCityCode] = useState('PAR');
  const [checkIn, setCheckIn] = useState('2026-10-15');
  const [checkOut, setCheckOut] = useState('2026-10-20');
  const [guests, setGuests] = useState(1);
  const [hotels, setHotels] = useState<any[]>([]);

  // Loader & Error States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFlightSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFlights([]);

    try {
      const query = new URLSearchParams({
        origin: origin.trim(),
        destination: destination.trim(),
        date: flightDate,
        passengers: String(adults)
      });

      const response = await fetch(`${API_URL}/flights/search?${query.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setFlights(data);
      } else {
        const errData = await response.json();
        setError(errData.message || 'Failed to search flights.');
      }
    } catch (err) {
      setError('Connection to travel search server failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleHotelSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setHotels([]);

    try {
      const query = new URLSearchParams({
        cityCode: cityCode.trim(),
        checkIn,
        checkOut,
        guests: String(guests)
      });

      const response = await fetch(`${API_URL}/hotels/search?${query.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setHotels(data);
      } else {
        const errData = await response.json();
        setError(errData.message || 'Failed to search hotels.');
      }
    } catch (err) {
      setError('Connection to hotel search server failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-left">
          <span className="text-teal-700 font-extrabold text-xs uppercase tracking-widest bg-teal-100 px-3 py-1 rounded-full">
            Real-time Travel Rates
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-905 mt-3">
            Flights & Hotels Finder
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Compare live airlines and stay offers powered by secure Amadeus integrations.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 mb-8 max-w-md">
          <button
            onClick={() => { setActiveTab('flights'); setError(''); }}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'flights' ? 'border-teal-700 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plane className="h-4.5 w-4.5" />
            <span>Search Flights</span>
          </button>
          <button
            onClick={() => { setActiveTab('hotels'); setError(''); }}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'hotels' ? 'border-teal-700 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Hotel className="h-4.5 w-4.5" />
            <span>Search Hotels</span>
          </button>
        </div>

        {/* Forms & Results */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Query Forms sidebar */}
          <aside className="w-full lg:w-80 shrink-0">
            {activeTab === 'flights' ? (
              <form onSubmit={handleFlightSearch} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4 text-left">
                <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                  <Plane className="h-4 w-4 text-teal-700" /> Flight Parameters
                </h3>
                
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Origin (IATA)</label>
                  <input
                    type="text"
                    required
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-teal-500"
                    placeholder="e.g. DEL"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Destination (IATA)</label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value.toUpperCase())}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-teal-500"
                    placeholder="e.g. PAR"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Departure Date</label>
                  <input
                    type="date"
                    required
                    value={flightDate}
                    onChange={(e) => setFlightDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Adult Passengers</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={adults}
                    onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-700 hover:bg-teal-800 disabled:bg-slate-350 text-white font-bold py-2.5 rounded-lg text-sm transition mt-4"
                >
                  {loading ? 'Searching...' : 'Search Flights'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleHotelSearch} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4 text-left">
                <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                  <Hotel className="h-4 w-4 text-teal-700" /> Hotel Parameters
                </h3>
                
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">City Code (IATA)</label>
                  <input
                    type="text"
                    required
                    value={cityCode}
                    onChange={(e) => setCityCode(e.target.value.toUpperCase())}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-teal-500"
                    placeholder="e.g. PAR"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Check In</label>
                    <input
                      type="date"
                      required
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-2 text-[11px] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Check Out</label>
                    <input
                      type="date"
                      required
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-2 text-[11px] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Guests count</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={guests}
                    onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-700 hover:bg-teal-800 disabled:bg-slate-350 text-white font-bold py-2.5 rounded-lg text-sm transition mt-4"
                >
                  {loading ? 'Searching...' : 'Search Hotels'}
                </button>
              </form>
            )}
          </aside>

          {/* Results Grid list */}
          <main className="flex-1 w-full text-left">
            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl flex items-start text-xs font-semibold">
                <Compass className="h-5 w-5 text-rose-500 mr-2 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {loading ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center h-80">
                <Loader2 className="h-8 w-8 text-teal-700 animate-spin mb-4" />
                <h4 className="font-bold text-slate-805">Contacting IATA travel directories...</h4>
                <p className="text-slate-400 text-xs mt-1">Fetching flight availability and hotel stays from Amadeus.</p>
              </div>
            ) : activeTab === 'flights' ? (
              flights.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm h-80 flex flex-col items-center justify-center">
                  <Plane className="h-10 w-10 text-slate-300 mb-3" />
                  <h4 className="font-bold text-slate-805">No flights queried yet</h4>
                  <p className="text-slate-400 text-xs mt-1">Configure your destination codes and click search.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {flights.map((f: any) => (
                    <div key={f.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                      <div className="flex gap-4 items-center flex-grow text-left">
                        <div className="relative h-12 w-12 rounded-xl flex items-center justify-center bg-teal-50 border border-teal-100/50 shrink-0 overflow-hidden">
                          {f.logo ? (
                            <img
                              src={f.logo}
                              alt={`${f.airline} logo`}
                              className="w-10 h-10 object-contain airline-logo"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const fallback = e.currentTarget.parentElement?.querySelector('.airline-fallback');
                                if (fallback) {
                                  fallback.classList.remove('hidden');
                                }
                              }}
                            />
                          ) : null}
                          <div className={`airline-fallback ${f.logo ? 'hidden' : ''} text-teal-700`}>
                            <Plane className="h-6 w-6" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-black text-slate-900 text-base leading-none">{f.airline}</h4>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Flight: {f.flightNumber}</span>
                          
                          <div className="flex gap-6 pt-2 text-xs font-semibold text-slate-600">
                            <div>
                              <span className="block text-[9px] text-slate-400 font-bold uppercase">Departure ({f.departure.iata})</span>
                              <span className="text-slate-900 font-bold">{f.departure.time}</span>
                            </div>
                            <div className="text-center">
                              <span className="block text-[9px] text-slate-400 font-bold uppercase">Duration</span>
                              <span className="text-slate-500">{f.duration} &bull; {f.stops}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] text-slate-400 font-bold uppercase">Arrival ({f.arrival.iata})</span>
                              <span className="text-slate-900 font-bold">{f.arrival.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="w-full sm:w-auto text-left sm:text-right shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100 flex sm:flex-col justify-between items-center sm:items-end gap-3">
                        <div>
                          <span className="block text-[10px] text-slate-400 font-bold uppercase">Total Fare ({adults} Pax)</span>
                          <span className="text-xl font-extrabold text-teal-800">₹{f.totalPrice?.toLocaleString('en-IN')}</span>
                        </div>
                        <Link
                          href={`/booking/flight?offerId=${f.id}&adults=${adults}`}
                          className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-4 py-2 rounded-lg text-xs shadow transition text-center"
                        >
                          Select Flight
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : hotels.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm h-80 flex flex-col items-center justify-center">
                <Hotel className="h-10 w-10 text-slate-300 mb-3" />
                <h4 className="font-bold text-slate-805">No hotels queried yet</h4>
                <p className="text-slate-400 text-xs mt-1">Enter your city IATA code to inspect vacation rooms.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hotels.map((h: any) => (
                  <div key={h.id} className="custom-card flex flex-col overflow-hidden h-full">
                    <div className="relative h-44 w-full bg-slate-100">
                      <img src={h.image} alt={h.name} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-sm text-amber-400 font-bold text-xs py-0.5 px-2 rounded-full flex items-center">
                        <Star className="h-3 w-3 fill-amber-400 mr-1" />
                        {h.rating} ({h.stars} Stars)
                      </div>
                    </div>
                    
                    <div className="p-5 flex-grow flex flex-col justify-between text-left">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base leading-tight">{h.name}</h4>
                        <span className="text-[10px] text-slate-400 font-bold block mt-1 flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1" /> {h.address}
                        </span>
                        
                        <div className="mt-3 space-y-1 text-xs text-slate-500 font-semibold border-t border-slate-100 pt-3">
                          <div>Room: {h.roomType} ({h.bedType})</div>
                          <div className="text-teal-700 font-bold text-[11px] flex items-center gap-1">
                            <Sparkles className="h-3 w-3 animate-pulse" />
                            {h.inclusions}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-5">
                        <div>
                          <span className="block text-[9px] text-slate-400 font-bold uppercase">Per Night</span>
                          <span className="text-base font-extrabold text-slate-900">₹{h.pricePerNight?.toLocaleString('en-IN')}</span>
                        </div>
                        <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs shadow transition">
                          Select Room
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
