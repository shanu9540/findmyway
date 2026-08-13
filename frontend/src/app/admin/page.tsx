"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, BarChart3, MapPin, Calendar, Users, DollarSign, Plus, Edit2, Trash2, Settings, ShieldAlert, Sparkles, Check, X } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminPanelPage() {
  const router = useRouter();
  const { user, token, loading } = useAuth();

  // Admin Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'destinations' | 'packages' | 'bookings' | 'users'>('overview');

  // Stats / Overview State
  const [stats, setStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  // Resource lists
  const [destinations, setDestinations] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);

  const [panelLoading, setPanelLoading] = useState(true);
  const [actionError, setActionError] = useState('');

  // Destination Form State
  const [destName, setDestName] = useState('');
  const [destCountry, setDestCountry] = useState('');
  const [destCategory, setDestCategory] = useState('Adventure');
  const [destPrice, setDestPrice] = useState('');
  const [destDescription, setDestDescription] = useState('');
  const [destImageUrl, setDestImageUrl] = useState('');
  const [editingDestId, setEditingDestId] = useState<string | null>(null);

  // Package Form State
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgDestId, setPkgDestId] = useState('');
  const [pkgDuration, setPkgDuration] = useState('5');
  const [pkgPrice, setPkgPrice] = useState('');
  const [pkgInclusions, setPkgInclusions] = useState(''); // comma-separated
  const [editingPkgId, setEditingPkgId] = useState<string | null>(null);

  useEffect(() => {
    // Role protection check
    if (!loading && (!token || user?.role !== 'ADMIN')) {
      router.push('/dashboard');
    }
  }, [user, token, loading, router]);

  const loadAllAdminData = async () => {
    if (!token) return;
    setPanelLoading(true);
    setActionError('');
    try {
      // 1. Fetch Stats & Recent bookings
      const statsRes = await fetch(`${API_URL}/admin/dashboard-stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
        setRecentBookings(statsData.recentBookings || []);
        setDestinations(statsData.destinations || []);
      }

      // 2. Fetch all users
      const usersRes = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsersList(usersData);
      }

      // 3. Fetch all packages
      const pkgRes = await fetch(`${API_URL}/packages`);
      if (pkgRes.ok) {
        const pkgData = await pkgRes.json();
        setPackages(pkgData);
      }

      // 4. Fetch all bookings
      const bookRes = await fetch(`${API_URL}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (bookRes.ok) {
        const bookData = await bookRes.json();
        setBookings(bookData);
      }
    } catch (err) {
      console.error('Failed to load administrative analytics:', err);
      setActionError('Failed to fetch full admin metrics from server.');
    } finally {
      setPanelLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.role === 'ADMIN') {
      loadAllAdminData();
    }
  }, [token, user]);

  // Destination operations
  const handleDestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setActionError('');

    try {
      const url = editingDestId ? `${API_URL}/destinations/${editingDestId}` : `${API_URL}/destinations`;
      const method = editingDestId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: destName,
          country: destCountry,
          category: destCategory,
          price: parseFloat(destPrice),
          description: destDescription,
          images: destImageUrl ? [destImageUrl] : [],
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save destination');
      }

      // Clear Form
      setDestName('');
      setDestCountry('');
      setDestPrice('');
      setDestDescription('');
      setDestImageUrl('');
      setEditingDestId(null);

      // Reload
      await loadAllAdminData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to save destination.');
    }
  };

  const handleDestEditStart = (dest: any) => {
    setEditingDestId(dest.id);
    setDestName(dest.name);
    setDestCountry(dest.country);
    setDestCategory(dest.category);
    setDestPrice(String(dest.price));
    setDestDescription(dest.description);
    setDestImageUrl(dest.images?.[0] || '');
  };

  const handleDestDelete = async (id: string) => {
    if (!token || !window.confirm('Are you sure you want to delete this destination? All linked packages will be cascadingly deleted.')) return;
    try {
      const response = await fetch(`${API_URL}/destinations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        await loadAllAdminData();
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to delete destination.');
    }
  };

  // Package operations
  const handlePkgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setActionError('');

    try {
      const url = editingPkgId ? `${API_URL}/packages/${editingPkgId}` : `${API_URL}/packages`;
      const method = editingPkgId ? 'PUT' : 'POST';

      const inclusionsArr = pkgInclusions.split(',').map((i) => i.trim()).filter(Boolean);

      // Generate a mock Day-by-Day Itinerary JSON
      const mockDays = parseInt(pkgDuration);
      const itineraryArr = [];
      for (let i = 1; i <= mockDays; i++) {
        itineraryArr.push({
          day: i,
          theme: `Day ${i} Scheduled Excursion`,
          activities: [
            { time: 'Morning', activity: 'Breakfast followed by guided neighborhood walk', location: 'City Center', cost: 0 },
            { time: 'Afternoon', activity: 'Museum visit and traditional dining', location: 'Local Hotspot', cost: 40 },
          ],
        });
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          destinationId: pkgDestId,
          title: pkgTitle,
          durationDays: mockDays,
          price: parseFloat(pkgPrice),
          inclusions: inclusionsArr,
          itineraryJson: {
            destination: pkgTitle,
            daysCount: mockDays,
            totalEstimatedCost: parseFloat(pkgPrice),
            itinerary: itineraryArr,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save package');
      }

      // Clear Form
      setPkgTitle('');
      setPkgDestId('');
      setPkgPrice('');
      setPkgInclusions('');
      setEditingPkgId(null);

      // Reload
      await loadAllAdminData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to save package.');
    }
  };

  const handlePkgDelete = async (id: string) => {
    if (!token || !window.confirm('Delete this package?')) return;
    try {
      const response = await fetch(`${API_URL}/packages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        await loadAllAdminData();
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to delete package.');
    }
  };

  // Booking operations
  const handleBookingStatusChange = async (id: string, newStatus: string) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/bookings/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await loadAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // User operations
  const handleToggleUserRole = async (targetUser: any) => {
    if (!token) return;
    const newRole = targetUser.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!window.confirm(`Change ${targetUser.name}'s role to ${newRole}?`)) return;

    try {
      const response = await fetch(`${API_URL}/admin/users/${targetUser.id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        await loadAllAdminData();
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to update user role.');
    }
  };

  const handleUserDelete = async (id: string) => {
    if (!token || !window.confirm('Permanently delete this user profile?')) return;
    try {
      const response = await fetch(`${API_URL}/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        await loadAllAdminData();
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to delete user.');
    }
  };

  const getBookingBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center flex-grow">
        <ShieldAlert className="h-10 w-10 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold mt-2">Checking Credentials...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Control Panel */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl h-fit space-y-6 shadow-sm">
        <div className="text-center space-y-3 pb-6 border-b border-slate-100">
          <div className="bg-teal-50 text-teal-800 h-16 w-16 rounded-full flex items-center justify-center mx-auto shadow border border-teal-100 font-extrabold">
            <ShieldCheck className="h-8 w-8 text-teal-700" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg leading-tight">Admin Portal</h3>
            <span className="text-xs font-semibold text-slate-400">System Control Desk</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          {(['overview', 'destinations', 'packages', 'bookings', 'users'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full py-2.5 px-4 rounded-xl text-sm font-bold text-left transition-all capitalize ${
                activeTab === tab
                  ? 'bg-teal-700 text-white shadow'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Details Panel */}
      <div className="lg:col-span-3 space-y-8">
        {actionError && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-2xl flex items-center gap-2 text-xs font-semibold">
            <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {panelLoading ? (
          <div className="bg-white border border-slate-100 p-8 rounded-3xl h-96 animate-pulse space-y-4 shadow-sm" />
        ) : (
          <>
            {/* OVERVIEW PANEL */}
            {activeTab === 'overview' && stats && (
              <div className="space-y-8">
                <h3 className="font-extrabold text-xl text-slate-805">Analytics Dashboard</h3>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Revenue</span>
                    <p className="text-xl sm:text-2xl font-black text-teal-700 mt-1">${stats.totalRevenue}</p>
                  </div>
                  <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bookings</span>
                    <p className="text-xl sm:text-2xl font-black text-slate-800 mt-1">{stats.totalBookings}</p>
                  </div>
                  <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Users</span>
                    <p className="text-xl sm:text-2xl font-black text-slate-800 mt-1">{stats.totalUsers}</p>
                  </div>
                  <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Destinations</span>
                    <p className="text-xl sm:text-2xl font-black text-slate-800 mt-1">{stats.totalDestinations}</p>
                  </div>
                </div>

                {/* Recent Bookings List */}
                <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <BarChart3 className="h-5 w-5 text-teal-700" /> Recent Bookings
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                          <th className="py-2.5">User</th>
                          <th className="py-2.5">Trip Package</th>
                          <th className="py-2.5">Travel Date</th>
                          <th className="py-2.5 text-right">Price</th>
                          <th className="py-2.5 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentBookings.map((b) => (
                          <tr key={b.id} className="border-b border-slate-50 last:border-0 text-slate-600">
                            <td className="py-3 font-semibold">{b.user?.name}</td>
                            <td className="py-3">{b.package?.title}</td>
                            <td className="py-3">{new Date(b.travelDate).toLocaleDateString()}</td>
                            <td className="py-3 text-right font-bold text-slate-800">${b.totalPrice}</td>
                            <td className="py-3 text-right">
                              <span className={`inline-block border px-2 py-0.5 rounded-full text-[9px] font-bold ${getBookingBadge(b.status)}`}>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* DESTINATIONS PANEL */}
            {activeTab === 'destinations' && (
              <div className="space-y-8">
                <h3 className="font-extrabold text-xl text-slate-805">Manage Destinations</h3>

                {/* CRUD Form */}
                <form onSubmit={handleDestSubmit} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
                  <h4 className="font-bold text-slate-800 text-sm">{editingDestId ? 'Edit Destination' : 'Add New Destination'}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Destination Name (e.g. Paris)"
                      value={destName}
                      onChange={(e) => setDestName(e.target.value)}
                      className="w-full text-xs font-semibold outline-none bg-slate-50 focus:bg-white border border-slate-100 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-slate-700"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Country (e.g. France)"
                      value={destCountry}
                      onChange={(e) => setDestCountry(e.target.value)}
                      className="w-full text-xs font-semibold outline-none bg-slate-50 focus:bg-white border border-slate-100 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-slate-700"
                    />
                    <select
                      value={destCategory}
                      onChange={(e) => setDestCategory(e.target.value)}
                      className="w-full text-xs font-semibold outline-none bg-slate-50 focus:bg-white border border-slate-105 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-slate-700"
                    >
                      <option value="Adventure">Adventure</option>
                      <option value="Relaxation">Relaxation</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Food">Food</option>
                    </select>
                    <input
                      type="number"
                      required
                      placeholder="Starting Price (USD)"
                      value={destPrice}
                      onChange={(e) => setDestPrice(e.target.value)}
                      className="w-full text-xs font-semibold outline-none bg-slate-50 focus:bg-white border border-slate-100 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-slate-700"
                    />
                    <input
                      type="text"
                      placeholder="Image URL (Unsplash link)"
                      value={destImageUrl}
                      onChange={(e) => setDestImageUrl(e.target.value)}
                      className="w-full text-xs font-semibold outline-none bg-slate-50 focus:bg-white border border-slate-100 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-slate-700 md:col-span-2"
                    />
                    <textarea
                      required
                      rows={2}
                      placeholder="Granular Description..."
                      value={destDescription}
                      onChange={(e) => setDestDescription(e.target.value)}
                      className="w-full text-xs font-semibold outline-none bg-slate-50 focus:bg-white border border-slate-100 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-slate-700 md:col-span-2 resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-755 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-sm transition-all"
                    >
                      {editingDestId ? 'Update' : 'Create'}
                    </button>
                    {editingDestId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingDestId(null);
                          setDestName('');
                          setDestCountry('');
                          setDestPrice('');
                          setDestDescription('');
                          setDestImageUrl('');
                        }}
                        className="border border-slate-205 text-slate-600 py-2.5 px-4 rounded-xl text-xs font-bold"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                {/* Destinations Grid */}
                <div className="grid grid-cols-1 gap-4">
                  {destinations.map((dest) => (
                    <div key={dest.id} className="bg-white border border-slate-100 p-4 rounded-2xl flex justify-between items-center shadow-sm">
                      <div className="space-y-1">
                        <h5 className="font-bold text-sm text-slate-800">{dest.name}, <span className="text-slate-400 font-semibold">{dest.country}</span></h5>
                        <p className="text-[10px] text-slate-450">{dest.category} • Starts at ${dest.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDestEditStart(dest)}
                          className="p-2 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-500 rounded-lg transition-all"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDestDelete(dest.id)}
                          className="p-2 border border-rose-200 hover:bg-rose-50 text-rose-500 rounded-lg transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PACKAGES PANEL */}
            {activeTab === 'packages' && (
              <div className="space-y-8">
                <h3 className="font-extrabold text-xl text-slate-805">Curate Travel Packages</h3>

                {/* CRUD Form */}
                <form onSubmit={handlePkgSubmit} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
                  <h4 className="font-bold text-slate-800 text-sm">Add New Package</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Package Title (e.g. Summer in Louvre)"
                      value={pkgTitle}
                      onChange={(e) => setPkgTitle(e.target.value)}
                      className="w-full text-xs font-semibold outline-none bg-slate-50 focus:bg-white border border-slate-100 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-slate-700"
                    />
                    <select
                      required
                      value={pkgDestId}
                      onChange={(e) => setPkgDestId(e.target.value)}
                      className="w-full text-xs font-semibold outline-none bg-slate-50 focus:bg-white border border-slate-105 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-slate-750"
                    >
                      <option value="">Select Destination</option>
                      {destinations.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.country})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      required
                      placeholder="Duration Days"
                      value={pkgDuration}
                      onChange={(e) => setPkgDuration(e.target.value)}
                      className="w-full text-xs font-semibold outline-none bg-slate-50 focus:bg-white border border-slate-100 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-slate-700"
                    />
                    <input
                      type="number"
                      required
                      placeholder="Package Price (USD)"
                      value={pkgPrice}
                      onChange={(e) => setPkgPrice(e.target.value)}
                      className="w-full text-xs font-semibold outline-none bg-slate-50 focus:bg-white border border-slate-100 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-slate-700"
                    />
                    <input
                      type="text"
                      placeholder="Inclusions (comma separated e.g. Flights, Hotel, Entry Passes)"
                      value={pkgInclusions}
                      onChange={(e) => setPkgInclusions(e.target.value)}
                      className="w-full text-xs font-semibold outline-none bg-slate-50 focus:bg-white border border-slate-100 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-slate-700 md:col-span-2"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-755 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-sm transition-all"
                  >
                    Create Package
                  </button>
                </form>

                {/* Packages List */}
                <div className="grid grid-cols-1 gap-4">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="bg-white border border-slate-100 p-4 rounded-2xl flex justify-between items-center shadow-sm">
                      <div className="space-y-1">
                        <h5 className="font-bold text-sm text-slate-800">{pkg.title}</h5>
                        <p className="text-[10px] text-slate-450">
                          Destination: {pkg.destination?.name} • Duration: {pkg.durationDays} Days • Price: ${pkg.price}
                        </p>
                      </div>
                      <button
                        onClick={() => handlePkgDelete(pkg.id)}
                        className="p-2 border border-rose-200 hover:bg-rose-50 text-rose-505 text-rose-500 rounded-lg transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BOOKINGS PANEL */}
            {activeTab === 'bookings' && (
              <div className="space-y-8">
                <h3 className="font-extrabold text-xl text-slate-805">Manage Booking Orders</h3>
                <div className="grid grid-cols-1 gap-4">
                  {bookings.map((b) => (
                    <div key={b.id} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1 flex-grow">
                        <div className="flex gap-2 items-center">
                          <span className={`inline-block border px-2 py-0.5 rounded-full text-[9px] font-bold ${getBookingBadge(b.status)}`}>
                            {b.status}
                          </span>
                          <span className="text-[10px] text-slate-400">Order ID: #{b.id.slice(0, 8)}</span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm mt-1">{b.package?.title}</h4>
                        <p className="text-[11px] text-slate-500">
                          User: <strong>{b.user?.name}</strong> ({b.user?.email}) • Travelers: <strong>{b.travelersCount}</strong>
                        </p>
                        <p className="text-[10px] text-slate-400">Date: {new Date(b.travelDate).toLocaleDateString()}</p>
                      </div>

                      <div className="flex flex-row md:flex-col items-center md:items-end gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6 shrink-0 w-full md:w-auto justify-between md:justify-center">
                        <div className="md:text-right">
                          <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Revenue</span>
                          <p className="text-base font-extrabold text-slate-800">${b.totalPrice}</p>
                        </div>
                        {b.status === 'PENDING' && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleBookingStatusChange(b.id, 'CONFIRMED')}
                              className="bg-emerald-605 bg-emerald-600 text-white font-bold p-1.5 rounded-lg hover:scale-105 active:scale-95 shadow-sm transition-all"
                              title="Confirm Booking"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleBookingStatusChange(b.id, 'CANCELLED')}
                              className="bg-rose-600 text-white font-bold p-1.5 rounded-lg hover:scale-105 active:scale-95 shadow-sm transition-all"
                              title="Cancel Booking"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* USERS PANEL */}
            {activeTab === 'users' && (
              <div className="space-y-8">
                <h3 className="font-extrabold text-xl text-slate-805">Manage Users</h3>
                <div className="grid grid-cols-1 gap-4">
                  {usersList.map((u) => (
                    <div key={u.id} className="bg-white border border-slate-100 p-5 rounded-2xl flex justify-between items-center shadow-sm">
                      <div className="space-y-0.5">
                        <div className="flex gap-2 items-center">
                          <h5 className="font-bold text-sm text-slate-800">{u.name}</h5>
                          <span className={`text-[8px] font-bold border px-2 rounded-full ${u.role === 'ADMIN' ? 'bg-indigo-900 text-white border-slate-900' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                            {u.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{u.email}</p>
                        <p className="text-[9px] text-slate-400">Created: {new Date(u.createdAt).toLocaleDateString()}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleUserRole(u)}
                          className="text-xs font-bold border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-600 py-1.5 px-3 rounded-lg transition-all"
                        >
                          Toggle Role
                        </button>
                        <button
                          onClick={() => handleUserDelete(u.id)}
                          className="p-1.5 border border-rose-200 hover:bg-rose-50 text-rose-500 rounded-lg transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
