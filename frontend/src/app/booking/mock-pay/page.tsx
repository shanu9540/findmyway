"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { CreditCard, ShieldAlert, Sparkles, CheckCircle2, ArrowLeft, ArrowUpRight, Check, Printer, ShieldCheck } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function MockPayPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token } = useAuth();
  const bookingId = searchParams.get('bookingId') || '';

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Payment States
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | 'wallet'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Form Fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('sbi');
  const [selectedWallet, setSelectedWallet] = useState('paytm');

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchBookingDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const bookingsList = await response.json();
          const target = bookingsList.find((b: any) => b.id === bookingId);
          if (target) {
            setBooking(target);
            if (target.status === 'Confirmed') {
              setIsConfirmed(true);
            }
          } else {
            setError('Booking reference not found.');
          }
        }
      } catch (err) {
        setError('Failed to reach server.');
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId, token]);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing || !token) return;

    setIsProcessing(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/bookings/${bookingId}/confirm-mock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBooking(data.booking);
        setIsConfirmed(true);
      } else {
        const errData = await response.json();
        setError(errData.message || 'Payment processing failed.');
      }
    } catch (err) {
      setError('Connection failed during transaction.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-teal-700 mb-4"></div>
        <span className="text-slate-500 font-bold text-sm tracking-wider">Verifying Order Summary...</span>
      </div>
    );
  }

  // Confirmed Receipt View
  if (isConfirmed && booking) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 pb-16 print:bg-white print:pt-6">
        <div className="max-w-2xl mx-auto px-4 print:max-w-full">
          <div className="bg-white border border-slate-200 p-8 sm:p-10 rounded-2xl shadow-sm space-y-8 print:border-0 print:shadow-none text-left">
            
            {/* Header Success Status */}
            <div className="text-center pb-6 border-b border-slate-100 flex flex-col items-center print:border-b-2">
              <div className="bg-emerald-50 text-emerald-600 h-16 w-16 rounded-full flex items-center justify-center mb-4 border border-emerald-100 print:bg-transparent print:border-2">
                <Check className="h-8 w-8 stroke-[3]" />
              </div>
              <h1 className="text-2xl font-black text-slate-905">Booking Confirmed! 🎉</h1>
              <p className="text-slate-400 text-xs font-semibold mt-1">Thank you for booking with FindMyWay. Your transaction was completed successfully.</p>
            </div>

            {/* Receipt Summary Grid */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Invoice Details</h3>
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-650 bg-slate-50 p-6 rounded-xl border border-slate-200/50 print:bg-transparent print:border-2">
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Booking ID</span>
                  <span className="text-slate-900 font-extrabold break-all">{booking.id}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Trip Package</span>
                  <span className="text-slate-900 font-extrabold">{booking.package?.title}</span>
                </div>
                <div className="mt-2">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Destination</span>
                  <span className="text-slate-900 font-extrabold">{booking.package?.destination?.name}, {booking.package?.country}</span>
                </div>
                <div className="mt-2">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Travel Date</span>
                  <span className="text-slate-900 font-extrabold">{new Date(booking.travelDate).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="mt-2">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Travelers</span>
                  <span className="text-slate-900 font-extrabold">
                    {booking.adultsCount} Adult(s) {booking.childrenCount > 0 && `& ${booking.childrenCount} Child(ren)`}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Rooms</span>
                  <span className="text-slate-900 font-extrabold">{booking.roomsCount} Room(s)</span>
                </div>
              </div>
            </div>

            {/* Bill Table */}
            <div className="space-y-3 pt-4 border-t border-slate-100 print:border-t-2">
              <h3 className="font-extrabold text-sm text-slate-905 uppercase tracking-wider">Billing Statement</h3>
              <div className="space-y-2 text-xs font-semibold text-slate-650">
                <div className="flex justify-between">
                  <span>Fare Subtotal</span>
                  <span>₹{booking.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-amber-700">
                  <span>Promotional Savings</span>
                  <span>-₹{booking.discount?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST / Tax Charges (10%)</span>
                  <span>+₹{booking.taxes?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-base font-black text-teal-800 border-t border-slate-200 pt-3 print:border-t-2">
                  <span>Total Amount Paid</span>
                  <span>₹{booking.totalPrice?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100 print:hidden">
              <button
                onClick={handlePrintReceipt}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-lg text-sm transition flex items-center justify-center gap-1.5 border border-slate-200"
              >
                <Printer className="h-4 w-4" />
                <span>Print Receipt</span>
              </button>
              <Link
                href="/dashboard?tab=bookings"
                className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 rounded-lg text-sm transition text-center flex items-center justify-center gap-1"
              >
                <span>My Dashboard</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16 text-slate-800">
      <div className="max-w-md mx-auto px-4">
        
        {/* Error notification */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-start text-left">
            <ShieldAlert className="h-5 w-5 mr-3 text-rose-500 shrink-0 mt-0.5" />
            <span className="text-xs font-bold">{error}</span>
          </div>
        )}

        {booking && (
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6 text-left">
            {/* Header info */}
            <div className="pb-4 border-b border-slate-100">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Checkout Payment</span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">₹{booking.totalPrice?.toLocaleString('en-IN')}</h2>
              <span className="text-xs font-semibold text-slate-500 block mt-1">Package: {booking.package?.title}</span>
            </div>

            {/* Payment Options Selection Tabs */}
            <div className="grid grid-cols-4 gap-2 bg-slate-150 p-1 rounded-xl">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`py-2 px-1 text-[10px] font-extrabold rounded-lg transition ${
                  paymentMethod === 'card' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`py-2 px-1 text-[10px] font-extrabold rounded-lg transition ${
                  paymentMethod === 'upi' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                UPI ID
              </button>
              <button
                onClick={() => setPaymentMethod('netbanking')}
                className={`py-2 px-1 text-[10px] font-extrabold rounded-lg transition ${
                  paymentMethod === 'netbanking' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Net Banking
              </button>
              <button
                onClick={() => setPaymentMethod('wallet')}
                className={`py-2 px-1 text-[10px] font-extrabold rounded-lg transition ${
                  paymentMethod === 'wallet' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Wallets
              </button>
            </div>

            {/* Form payment detail */}
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              
              {/* Card Inputs */}
              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-550 uppercase tracking-wider mb-1.5">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Sameer Sharma"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-sm focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-550 uppercase tracking-wider mb-1.5">Card Number</label>
                    <input
                      type="text"
                      required
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-sm focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-550 uppercase tracking-wider mb-1.5">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        required
                        placeholder="12/28"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-sm focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-550 uppercase tracking-wider mb-1.5">CVV</label>
                      <input
                        type="password"
                        required
                        placeholder="***"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-sm focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Inputs */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-550 uppercase tracking-wider mb-1.5">Enter UPI ID</label>
                    <input
                      type="text"
                      required
                      placeholder="sharma@ybl"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-sm focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-200/50">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Or Scan QR code</span>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 w-36 h-36 mx-auto flex items-center justify-center font-extrabold text-slate-400 text-xs shadow-inner">
                      [ Simulated QR ]
                    </div>
                  </div>
                </div>
              )}

              {/* Net banking Inputs */}
              {paymentMethod === 'netbanking' && (
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-550 uppercase tracking-wider mb-1.5">Select Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-teal-500"
                  >
                    <option value="sbi">State Bank of India (SBI)</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                  </select>
                </div>
              )}

              {/* Wallets Inputs */}
              {paymentMethod === 'wallet' && (
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-550 uppercase tracking-wider mb-1.5">Select Wallet Provider</label>
                  <select
                    value={selectedWallet}
                    onChange={(e) => setSelectedWallet(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-teal-500"
                  >
                    <option value="paytm">Paytm Wallet</option>
                    <option value="phonepe">PhonePe Wallet</option>
                    <option value="amazon">Amazon Pay</option>
                  </select>
                </div>
              )}

              {/* Submit Trigger */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-teal-700 hover:bg-teal-800 disabled:bg-slate-350 text-white font-extrabold py-3.5 rounded-lg text-sm transition-all duration-200 shadow hover:shadow-md flex items-center justify-center gap-1.5 mt-6"
              >
                {isProcessing ? (
                  <span>Processing transaction...</span>
                ) : (
                  <>
                    <ShieldCheck className="h-4.5 w-4.5 text-amber-400" />
                    <span>Pay ₹{booking.totalPrice?.toLocaleString('en-IN')} Now</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
