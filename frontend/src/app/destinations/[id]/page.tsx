"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { Star, MapPin, Calendar, Heart, ShieldAlert, Sparkles, AlertCircle, CloudSun, Send, Check } from 'lucide-react';

const API_URL = typeof window === 'undefined'
  ? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api` : 'http://localhost:5000/api')
  : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:5000/api'
      : 'https://backend-blue-psi-76.vercel.app/api');

export default function DestinationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token, wishlist, toggleWishlist } = useAuth();
  const destId = String(params?.id || '');

  const [destination, setDestination] = useState<any>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  // Review form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const fetchDestinationDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/destinations/${destId}`);
      if (response.ok) {
        const data = await response.json();
        setDestination(data);
        setActiveImage(data.image || '');
        setIsUsingFallback(false);
      } else {
        throw new Error('Destination details fetch error');
      }
    } catch (err) {
      console.warn('Backend API connection failed.');
      setDestination(null);
      setIsUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (destId) {
      fetchDestinationDetails();
    }
  }, [destId]);

  const handleToggleWishlist = async () => {
    if (!token) {
      router.push('/login?redirect=' + encodeURIComponent(`/destinations/${destId}`));
      return;
    }
    await toggleWishlist(destId);
  };

  const isSavedInWishlist = wishlist?.some((item) => item.id === destId);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      router.push('/login?redirect=' + encodeURIComponent(`/destinations/${destId}`));
      return;
    }

    if (!comment.trim()) {
      setReviewError('Review comment cannot be empty.');
      return;
    }

    setSubmittingReview(true);
    setReviewError('');

    try {
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          destinationId: destId,
          rating,
          comment,
        }),
      });

      if (response.ok) {
        const newReview = await response.json();
        setDestination((prev: any) => ({
          ...prev,
          reviews: [
            {
              ...newReview,
              user: { name: 'You' },
            },
            ...(prev.reviews || []),
          ],
        }));
        setComment('');
        setRating(5);
      } else {
        const errorData = await response.json();
        setReviewError(errorData.message || 'Failed to submit review');
      }
    } catch (err: any) {
      setReviewError('Failed to connect to server.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-teal-700 mb-4"></div>
        <span className="text-slate-500 font-bold text-sm tracking-wider">Loading Destination Details...</span>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 flex flex-col items-center justify-center text-center px-4">
        <ShieldAlert className="h-12 w-12 text-rose-500 mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-1">Destination details not found</h3>
        <p className="text-slate-500 text-sm mb-6">This destination may have been deleted or does not exist.</p>
        <Link href="/destinations" className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition">
          Back to Listings
        </Link>
      </div>
    );
  }

  const isSaved = isSavedInWishlist;
  const galleryList = destination.gallery ? destination.gallery : [];
  const allImages = [destination.image, ...galleryList].filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* 1. Header Banner */}
      <div 
        className="relative h-[50vh] bg-cover bg-center flex items-end pt-24"
        style={{ backgroundImage: `url('${activeImage || destination.image}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 text-white flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center text-teal-300 text-xs font-extrabold uppercase tracking-wider mb-2">
              <MapPin className="h-4 w-4 mr-1 text-teal-400" />
              {destination.country} &bull; <span className="ml-1 text-slate-300">{destination.region}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">{destination.name}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-slate-900/80 backdrop-blur px-4 py-2 rounded-xl border border-slate-700 shadow text-left">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Overall Rating</span>
              <div className="flex items-center text-amber-400 font-extrabold text-lg mt-0.5">
                <Star className="h-5 w-5 fill-amber-400 mr-1.5" />
                {destination.rating?.toFixed(1) || '0.0'}
              </div>
            </div>
            <button
              onClick={handleToggleWishlist}
              className={`flex items-center justify-center p-3 rounded-xl border transition-all ${
                isSaved
                  ? 'bg-rose-500 border-transparent text-white shadow-lg shadow-rose-500/20'
                  : 'bg-slate-900/80 backdrop-blur border-slate-700 text-slate-300 hover:text-rose-400'
              }`}
              title={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`h-5 w-5 ${isSaved ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Details, Gallery, Packages */}
        <div className="flex-1 space-y-10">
          
          {/* About / Overview */}
          <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Overview</h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{destination.description}</p>
            </div>
            
            {/* Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100 text-left">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Best Time to Visit</span>
                <span className="text-sm font-extrabold text-slate-950 mt-1 block">{destination.bestTimeToVisit || 'Year-round'}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Trip Duration</span>
                <span className="text-sm font-extrabold text-slate-950 mt-1 block">{destination.averageDuration || '3-5 Days'}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Est. Budget</span>
                <span className="text-sm font-extrabold text-teal-700 mt-1 block">₹{destination.estimatedBudget?.toLocaleString('en-IN') || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</span>
                <span className="text-sm font-extrabold text-slate-950 mt-1 block">{destination.category}</span>
              </div>
            </div>
          </div>

          {/* Attractions & Things To Do */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold text-slate-905 mb-4">Popular Attractions</h3>
              <div className="flex flex-wrap gap-2">
                {destination.popularAttractions?.map((attr: string, idx: number) => (
                  <span key={idx} className="inline-flex items-center text-xs font-bold text-slate-700 bg-slate-100 py-1.5 px-3 rounded-lg border border-slate-200/50">
                    <Check className="h-3.5 w-3.5 text-teal-650 mr-1.5" />
                    {attr}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold text-slate-905 mb-4">Things To Do</h3>
              <div className="flex flex-wrap gap-2">
                {destination.thingsToDo?.map((todo: string, idx: number) => (
                  <span key={idx} className="inline-flex items-center text-xs font-bold text-slate-700 bg-slate-100 py-1.5 px-3 rounded-lg border border-slate-200/50">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500 mr-1.5 animate-pulse" />
                    {todo}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Photo Gallery */}
          {allImages.length > 1 && (
            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Photo Gallery</h2>
              <div className="grid grid-cols-3 gap-4">
                {allImages.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${
                      (activeImage || destination.image) === img
                        ? 'border-teal-700 shadow-md scale-102'
                        : 'border-transparent hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${destination.name} preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Available Packages */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-905">Available Tour Packages</h2>
            {(!destination.packages || destination.packages.length === 0) ? (
              <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center shadow-sm">
                <Calendar className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                <h4 className="font-bold text-slate-805 mb-1">No packages available</h4>
                <p className="text-slate-500 text-xs">Check back later or custom plan with our AI Assistant.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {destination.packages.map((pkg: any) => {
                  return (
                    <div key={pkg.id} className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="space-y-4">
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                            {pkg.duration} Days &bull; {pkg.nights} Nights
                          </span>
                          <h3 className="text-xl font-bold text-slate-900 mt-2">{pkg.title}</h3>
                          <span className="text-xs text-slate-400 font-semibold block mt-1">Hotel: {pkg.hotel}</span>
                        </div>

                        {/* Inclusions */}
                        <div className="flex flex-wrap gap-2">
                          {pkg.inclusions?.map((inc: string, idx: number) => (
                            <span key={idx} className="inline-flex items-center text-xs font-bold text-slate-600 bg-slate-100 py-1 px-2.5 rounded-lg border border-slate-200/50">
                              <Check className="h-3 w-3 text-teal-600 mr-1.5" />
                              {inc}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Pricing & Booking CTA */}
                      <div className="w-full md:w-auto text-left md:text-right shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 flex md:flex-col justify-between items-center md:items-end gap-4">
                        <div>
                          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Per Person</span>
                          {pkg.discount > 0 && (
                            <span className="text-xs text-slate-400 line-through mr-1.5">₹{pkg.originalPrice?.toLocaleString('en-IN')}</span>
                          )}
                          <span className="text-2xl font-extrabold text-slate-900">₹{pkg.pricePerAdult?.toLocaleString('en-IN')}</span>
                        </div>
                        <Link
                          href={`/packages/${pkg.id}`}
                          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold px-6 py-2.5 rounded-xl text-sm shadow hover:shadow-md transition text-center"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Sidebar Widgets (Weather, Reviews, Related) */}
        <div className="w-full lg:w-96 shrink-0 space-y-8">
          
          {/* Weather Widget */}
          <div className="bg-gradient-to-r from-teal-800 to-teal-950 text-white p-6 rounded-2xl shadow-md relative overflow-hidden text-left">
            <div className="absolute right-4 top-4 text-teal-400 opacity-20">
              <CloudSun className="h-20 w-20" />
            </div>
            <span className="text-[10px] font-bold tracking-widest text-teal-300 uppercase block mb-1">Local Climate</span>
            <h3 className="text-lg font-bold mb-4">Current Weather</h3>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-4xl font-extrabold tracking-tight">26°C</span>
                <span className="block text-xs font-bold text-teal-200 mt-1">Sunny & Warm</span>
              </div>
              <div className="text-right text-xs text-teal-200 font-bold space-y-1">
                <div>Humidity: 60%</div>
                <div>Best: {destination.bestTimeToVisit}</div>
              </div>
            </div>
          </div>

          {/* Related Destinations */}
          {destination.relatedDestinations && destination.relatedDestinations.length > 0 && (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4 text-left">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Related Destinations</h3>
              <div className="space-y-4">
                {destination.relatedDestinations.map((rel: any) => (
                  <Link key={rel.id} href={`/destinations/${rel.id}`} className="flex gap-3 group hover:opacity-90">
                    <img src={rel.image} alt={rel.name} className="h-14 w-20 object-cover rounded-lg bg-slate-100" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 leading-tight">{rel.name}</h4>
                      <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">{rel.country}</span>
                      <span className="text-xs font-extrabold text-teal-700 mt-1 block">Est. ₹{rel.estimatedBudget?.toLocaleString('en-IN')}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Widget */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
              Community Reviews
            </h3>

            {/* Submit Review Form */}
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Your Rating</label>
                <div className="flex items-center space-x-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-0.5 transition"
                    >
                      <Star className={`h-6 w-6 ${rating >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Comment</label>
                <textarea
                  placeholder="Share your travel experiences..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 text-xs focus:outline-none focus:border-teal-500 focus:bg-white h-20 transition resize-none"
                />
              </div>

              {reviewError && <p className="text-rose-500 text-xs font-semibold">{reviewError}</p>}

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-2 rounded-lg text-xs transition flex items-center justify-center shadow"
              >
                {submittingReview ? 'Submitting...' : 'Post Review'}
                <Send className="h-3 w-3 ml-1.5" />
              </button>
            </form>

            {/* List Reviews */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              {(!destination.reviews || destination.reviews.length === 0) ? (
                <p className="text-slate-400 text-center text-xs py-4">No reviews posted yet.</p>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {destination.reviews.map((rev: any) => (
                    <div key={rev.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-900 text-xs">{rev.user?.name || 'Anonymous'}</span>
                        <div className="flex text-amber-400 scale-90">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${rev.rating >= i + 1 ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
