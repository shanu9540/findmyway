"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 flex-grow grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Contact Info Card */}
      <div className="space-y-6 flex flex-col justify-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Contact Us</h1>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            Have questions about booking travel packages, customizing AI schedules, or billing? Drop us a note, and our support team will reply within 24 hours.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm text-slate-650">
            <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-650 shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-slate-800">Support Desk</p>
              <p className="text-xs text-slate-500">support@findmyway.com</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-650">
            <div className="bg-sky-50 p-2.5 rounded-xl text-sky-650 shrink-0">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-slate-800">Phone Hotline</p>
              <p className="text-xs text-slate-500">+1 (555) 123-4567</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-650">
            <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-650 shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-slate-800">Corporate HQ</p>
              <p className="text-xs text-slate-500">123 Wanderlust Way, Travel City</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Card */}
      <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm h-fit space-y-6">
        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="font-bold text-slate-800">Message Received!</h3>
            <p className="text-xs text-slate-400">Thanks for reaching out. We have logged your query and will contact you shortly.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-xs font-bold text-indigo-650 hover:underline pt-2"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-slate-400">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full text-xs font-semibold outline-none bg-slate-50 focus:bg-white border border-slate-105 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-slate-400">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full text-xs font-semibold outline-none bg-slate-50 focus:bg-white border border-slate-105 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-slate-400">Message</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your request..."
                className="w-full text-xs font-semibold outline-none bg-slate-50 focus:bg-white border border-slate-105 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-slate-700 resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-xs py-3 px-5 rounded-xl flex items-center justify-center gap-1.5 transition-all w-full shadow-md shadow-indigo-100"
            >
              <Send className="h-3.5 w-3.5" />
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
