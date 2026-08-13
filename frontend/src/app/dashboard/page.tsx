"use client";

export const dynamic = 'force-dynamic';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Heart, Sparkles, User, Settings, LayoutDashboard, ChevronRight, X, ArrowUpRight, LogOut, FileText, MapPin, Plane } from 'lucide-react';

const API_URL = typeof window === 'undefined'
  ? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api` : 'http://localhost:5000/api')
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');

function UserDashboardPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token, logout, wishlist, toggleWishlist } = useAuth();

  // Tab State
  const initialTab = searchParams.get('tab') || 'bookings';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Content States
  const [bookings, setBookings] = useState<any[]>([]);
  const [duffelBookings, setDuffelBookings] = useState<any[]>([]);
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State for viewing saved AI Itinerary details
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  useEffect(() => {
    if (!token && !loading) {
      router.push('/login');
    }
  }, [token, loading, router]);

  const loadDashboardData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // 1. Fetch Bookings
      const bookRes = await fetch(`${API_URL}/bookings/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (bookRes.ok) {
        const bookData = await bookRes.json();
        setBookings(bookData);
      }

      // 1.5 Fetch Duffel Bookings
      const duffelRes = await fetch(`${API_URL}/flights/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (duffelRes.ok) {
        const duffelData = await duffelRes.json();
        setDuffelBookings(duffelData);
      }

      // 2. Fetch Saved Itineraries
      const itinRes = await fetch(`${API_URL}/ai/my-itineraries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (itinRes.ok) {
        const itinData = await itinRes.json();
        setItineraries(itinData);
      }
    } catch (error) {
      console.error('Failed to load dashboard statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const response = await fetch(`${API_URL}/bookings/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Cancelled' })
      });
      if (response.ok) {
        alert('Booking cancelled successfully.');
        loadDashboardData();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to cancel booking.');
      }
    } catch (err) {
      alert('Error connecting to server.');
    }
  };

  useEffect(() => {
    if (token) {
      loadDashboardData();
    }
  }, [token]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-teal-700 mb-4"></div>
        <span className="text-slate-500 font-bold text-sm tracking-wider">Verifying Credentials...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-10">
          <span className="text-teal-700 font-extrabold text-xs uppercase tracking-widest bg-teal-100 px-3 py-1 rounded-full">
            Client Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 flex items-center">
            <LayoutDashboard className="h-8 w-8 text-amber-500 mr-2" />
            My Dashboard
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* 1. Sidebar Control Panel */}
          <div className="w-full lg:w-80 shrink-0 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6">
            
            {/* User Profile info */}
            <div className="text-center space-y-3 pb-6 border-b border-slate-100">
              <div className="bg-teal-50 text-teal-800 h-16 w-16 rounded-full flex items-center justify-center mx-auto shadow border border-teal-100 font-extrabold text-xl">
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg leading-tight">{user.name}</h3>
                <span className="text-xs font-semibold text-slate-400 block mt-1">{user.email}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 mt-2 border border-teal-200 uppercase">
                  {user.role}
                </span>
              </div>
            </div>

            {/* Menu Tabs */}
            <div className="flex flex-col space-y-1.5">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`w-full text-left py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-between transition ${
                  activeTab === 'bookings'
                    ? 'bg-teal-700 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center">
                  <Calendar className="h-4.5 w-4.5 mr-2.5" />
                  My Bookings
                </span>
                <span className="text-xs bg-black/15 px-2 py-0.5 rounded-full">{bookings.length + duffelBookings.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('itineraries')}
                className={`w-full text-left py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-between transition ${
                  activeTab === 'itineraries'
                    ? 'bg-teal-700 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center">
                  <Sparkles className="h-4.5 w-4.5 mr-2.5" />
                  Saved Itineraries
                </span>
                <span className="text-xs bg-black/15 px-2 py-0.5 rounded-full">{itineraries.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full text-left py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-between transition ${
                  activeTab === 'wishlist'
                    ? 'bg-teal-700 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center">
                  <Heart className="h-4.5 w-4.5 mr-2.5" />
                  My Wishlist
                </span>
                <span className="text-xs bg-black/15 px-2 py-0.5 rounded-full">{wishlist?.length || 0}</span>
              </button>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="w-full text-left py-2.5 px-4 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 flex items-center transition border border-transparent hover:border-rose-200/50"
            >
              <LogOut className="h-4.5 w-4.5 mr-2.5" />
              Sign Out
            </button>
          </div>

          {/* 2. Main Dashboard Content (Tabs display) */}
          <div className="flex-grow w-full">
            {loading ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 skeleton">
                <div className="h-6 bg-slate-200 rounded w-1/4"></div>
                <div className="h-20 bg-slate-100 rounded-xl"></div>
                <div className="h-20 bg-slate-100 rounded-xl"></div>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* A. BOOKINGS TAB */}
                {activeTab === 'bookings' && (
                  <div className="space-y-6">
                    {/* Success message banner */}
                    {searchParams.get('bookingSuccess') === 'true' && (
                      <div className="p-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-start text-xs font-semibold text-left shadow-sm mb-6 animate-pulse">
                        <span className="text-2xl mr-3">🎉</span>
                        <div>
                          <strong className="block text-emerald-950 font-black text-sm mb-0.5">Flight Tickets Issued Successfully!</strong>
                          Your booking is confirmed with Duffel. 
                          <span className="block mt-1">
                            PNR / Reference: <span className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded font-black text-emerald-900">{searchParams.get('pnr')}</span>
                          </span>
                          <span className="block mt-0.5">
                            Duffel Order ID: <span className="font-mono text-slate-500 font-bold">{searchParams.get('orderId')}</span>
                          </span>
                        </div>
                      </div>
                    )}

                    <h2 className="text-xl font-bold text-slate-900">Booking History</h2>
                    
                    {bookings.length === 0 && duffelBookings.length === 0 ? (
                      <div className="bg-white border border-slate-200 p-12 rounded-2xl text-center shadow-sm">
                        <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h4 className="font-bold text-slate-800 mb-1">No bookings found</h4>
                        <p className="text-slate-400 text-xs mb-6">You haven't reserved any flights, hotels, or vacation tours yet.</p>
                        <div className="flex justify-center gap-4">
                          <Link href="/packages" className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-2.5 rounded-lg text-xs transition">
                            Browse Tour Packages
                          </Link>
                          <Link href="/flights-hotels" className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-6 py-2.5 rounded-lg text-xs transition">
                            Search Flights
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* 1. Tour Package Bookings */}
                        {bookings.length > 0 && (
                          <div className="space-y-4">
                            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 text-left">Vacation Packages</h3>
                            {bookings.map((booking) => (
                              <div key={booking.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left">
                                <div className="space-y-2 flex-grow">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getStatusColor(booking.status)}`}>
                                      {booking.status}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                      ID: #{booking.id.slice(0, 8)}
                                    </span>
                                  </div>
                                  <h3 className="font-bold text-slate-900 text-lg leading-tight">
                                    {booking.package?.title || 'Tour Package'}
                                  </h3>
                                  <span className="text-xs text-slate-400 font-semibold block">
                                    Destination: {booking.package?.destination?.name}, {booking.package?.country}
                                  </span>
                                  
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 text-xs font-semibold text-slate-600 border-t border-slate-100">
                                    <div>
                                      <span className="block text-[10px] text-slate-400 uppercase font-bold">Travel Date</span>
                                      <span className="text-slate-900 font-bold">{new Date(booking.travelDate).toLocaleDateString('en-IN')}</span>
                                    </div>
                                    <div>
                                      <span className="block text-[10px] text-slate-400 uppercase font-bold">Travelers</span>
                                      <span className="text-slate-900 font-bold">
                                        {booking.adultsCount} Adult(s) {booking.childrenCount > 0 && `& ${booking.childrenCount} Child`}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="block text-[10px] text-slate-400 uppercase font-bold">Rooms/Stay</span>
                                      <span className="text-slate-900 font-bold">{booking.roomsCount} Room / {booking.package?.hotel}</span>
                                    </div>
                                    <div>
                                      <span className="block text-[10px] text-slate-400 uppercase font-bold">Total Paid</span>
                                      <span className="text-teal-700 font-extrabold text-sm">₹{booking.totalPrice?.toLocaleString('en-IN')}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="w-full md:w-auto shrink-0 flex flex-row md:flex-col items-center md:items-end justify-between gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-150">
                                  <Link
                                    href={`/booking/mock-pay?bookingId=${booking.id}`}
                                    className="bg-teal-50 hover:bg-teal-700 text-teal-800 hover:text-white border border-teal-700/20 hover:border-transparent font-bold py-2 px-4 rounded-xl text-xs transition shadow-sm text-center shrink-0"
                                  >
                                    View Invoice
                                  </Link>
                                  {booking.status !== 'Cancelled' && (
                                    <button
                                      onClick={() => handleCancelBooking(booking.id)}
                                      className="bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200/50 hover:border-transparent font-bold py-2 px-4 rounded-xl text-xs transition shadow-sm text-center shrink-0"
                                    >
                                      Cancel Booking
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 2. Duffel Flight & Stays Bookings */}
                        {duffelBookings.length > 0 && (
                          <div className="space-y-4 pt-4 border-t border-slate-200">
                            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 text-left">Flights & stays (Duffel API)</h3>
                            {duffelBookings.map((dbBooking) => {
                              const segments = dbBooking.itinerary?.[0]?.segments || dbBooking.itinerary || [];
                              const firstSeg = segments[0] || {};
                              const lastSeg = segments[segments.length - 1] || {};
                              const passengers = dbBooking.passengerInfo || [];

                              return (
                                <div key={dbBooking.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                  <div className="space-y-3 flex-grow">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize bg-teal-50 text-teal-700 border-teal-100">
                                        {dbBooking.status}
                                      </span>
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-500 uppercase">
                                        {dbBooking.type}
                                      </span>
                                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                        PNR: <span className="font-mono text-slate-700 font-extrabold">{dbBooking.bookingReference}</span>
                                      </span>
                                    </div>

                                    <div>
                                      <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                        <Plane className="h-5 w-5 text-teal-600" />
                                        Flight from {firstSeg.origin?.iata_code || firstSeg.departure?.iata || 'Origin'} to {lastSeg.destination?.iata_code || lastSeg.arrival?.iata || 'Destination'}
                                      </h3>
                                      <p className="text-xs font-semibold text-slate-400 mt-0.5">Duffel Order: {dbBooking.providerOrderId}</p>
                                    </div>

                                    <div className="border-t border-slate-100 pt-3 space-y-2">
                                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Passenger list</span>
                                      <div className="flex flex-wrap gap-2">
                                        {passengers.map((p: any, pIdx: number) => (
                                          <span key={pIdx} className="bg-slate-50 border border-slate-150 px-2 py-1 rounded text-xs font-bold text-slate-700">
                                            👤 {p.title?.toUpperCase() || 'MR'}. {p.first_name} {p.last_name}
                                          </span>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 text-xs font-semibold text-slate-600 border-t border-slate-100">
                                      <div>
                                        <span className="block text-[10px] text-slate-400 uppercase font-bold">Departure Date</span>
                                        <span className="text-slate-900 font-bold">
                                          {firstSeg.departing_at ? new Date(firstSeg.departing_at).toLocaleDateString('en-IN') : (firstSeg.departure?.date || 'N/A')}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="block text-[10px] text-slate-400 uppercase font-bold">Flight Carrier</span>
                                        <span className="text-slate-900 font-bold">
                                          {firstSeg.operating_carrier?.name || firstSeg.airline || 'Partner Carrier'} ({firstSeg.operating_carrier?.iata_code || firstSeg.airlineCode || 'XX'})
                                        </span>
                                      </div>
                                      <div>
                                        <span className="block text-[10px] text-slate-400 uppercase font-bold">Total Fare</span>
                                        <span className="text-teal-700 font-extrabold text-sm">₹{Math.round(dbBooking.amount).toLocaleString('en-IN')} {dbBooking.currency}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* B. ITINERARIES TAB */}
                {activeTab === 'itineraries' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900">Saved AI Itineraries</h2>
                    {itineraries.length === 0 ? (
                      <div className="bg-white border border-slate-200 p-12 rounded-2xl text-center shadow-sm">
                        <Sparkles className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h4 className="font-bold text-slate-800 mb-1">No itineraries saved</h4>
                        <p className="text-slate-400 text-xs mb-6">Create and save trip plans using the AI planner tool.</p>
                        <Link href="/ai-planner" className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition">
                          Launch AI Planner
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {itineraries.map((itin) => (
                          <div key={itin.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between h-full">
                            <div>
                              <span className="text-[10px] font-extrabold text-teal-800 uppercase tracking-widest bg-teal-50 border border-teal-100 py-0.5 px-2 rounded-md">
                                {itin.days} Days
                              </span>
                              <h3 className="font-bold text-slate-900 text-lg mt-3 mb-1">{itin.destination}</h3>
                              <p className="text-xs font-semibold text-slate-500">Budget: ${itin.budget}</p>
                            </div>
                            <button
                              onClick={() => setSelectedPlan(itin)}
                              className="mt-6 flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-lg text-xs transition border border-slate-200/50"
                            >
                              <span>View Itinerary Details</span>
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* C. WISHLIST TAB */}
                {activeTab === 'wishlist' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900">Saved Wishlist</h2>
                    {(!wishlist || wishlist.length === 0) ? (
                      <div className="bg-white border border-slate-200 p-12 rounded-2xl text-center shadow-sm">
                        <Heart className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h4 className="font-bold text-slate-800 mb-1">Your wishlist is empty</h4>
                        <p className="text-slate-400 text-xs mb-6">Browse packages and click the heart icon to save.</p>
                        <Link href="/destinations" className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition">
                          Browse Destinations
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {wishlist.map((dest) => (
                          <div key={dest.id} className="custom-card overflow-hidden flex flex-col h-full text-left">
                            <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                              <img
                                src={Array.isArray(dest.images) ? dest.images[0] : (dest.images ? dest.images.split(',')[0] : '')}
                                alt={dest.name}
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={() => toggleWishlist(dest.id)}
                                className="absolute top-4 right-4 bg-white/90 hover:bg-rose-500 p-2.5 rounded-full text-rose-500 hover:text-white transition shadow"
                              >
                                <X className="h-4.5 w-4.5" />
                              </button>
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-between">
                              <div>
                                <h3 className="font-bold text-slate-900 text-base leading-tight">{dest.name}</h3>
                                <p className="text-xs font-semibold text-slate-400 mt-1">{dest.country} &bull; {dest.category}</p>
                              </div>
                              <Link
                                href={`/destinations/${dest.id}`}
                                className="mt-4 w-full text-center bg-teal-50 hover:bg-teal-700 text-teal-800 hover:text-white font-bold py-2 rounded-lg text-xs border border-teal-700/20 hover:border-transparent transition"
                              >
                                View Packages
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}
          </div>

        </div>
      </div>

      {/* D. Saved Itinerary Modal Details View */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up text-left">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 flex justify-between items-center border-b border-slate-800">
              <div>
                <span className="text-[10px] font-extrabold text-teal-400 uppercase tracking-widest block mb-1">
                  AI Plan Details &bull; {selectedPlan.days} Days
                </span>
                <h3 className="text-xl font-bold">{selectedPlan.destination}</h3>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white p-2 rounded-xl border border-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50">
              <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-xl">
                <span className="text-xs font-semibold text-slate-500">Trip Budget: ${selectedPlan.budget}</span>
                <span className="text-xs font-semibold text-slate-500">Created: {new Date(selectedPlan.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Day-by-day itineraries */}
              <div className="space-y-6">
                {selectedPlan.generatedPlanJson?.itinerary?.map((day: any) => (
                  <div key={day.day} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-slate-100 py-2.5 px-6 flex justify-between items-center border-b border-slate-200">
                      <h4 className="font-extrabold text-xs uppercase tracking-wide text-teal-800">Day {day.day}</h4>
                      <span className="text-xs font-bold text-slate-700">{day.theme}</span>
                    </div>

                    <div className="p-6 divide-y divide-slate-100">
                      {day.activities?.map((activity: any, actIdx: number) => (
                        <div key={actIdx} className={`py-3 flex justify-between items-start gap-4 ${actIdx === 0 ? 'pt-0' : ''} ${actIdx === day.activities.length - 1 ? 'pb-0' : ''}`}>
                          <div className="text-slate-800 text-xs font-semibold">
                            <span className="font-bold text-teal-800 mr-2">{activity.time || 'Activity'}:</span>
                            {activity.activity}
                            <span className="block text-[10px] text-slate-400 font-bold mt-1 flex items-center">
                              <MapPin className="h-3 w-3 mr-1 text-slate-400" />
                              {activity.location}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-slate-500 shrink-0">${activity.cost}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}


export default function UserDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 pt-32 flex flex-col items-center justify-center text-slate-800">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600 mb-2"></div>
        <p className="text-xs text-slate-400">Loading specs...</p>
      </div>
    }>
      <UserDashboardPageContent />
    </Suspense>
  );
}
