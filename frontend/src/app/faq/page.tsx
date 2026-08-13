"use client";

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "How does the AI Itinerary Planner work?",
    a: "Our AI Itinerary Planner takes your target destination, duration in days, estimated total budget, and personal interest categories (like Food, Nature, Adventure) to compile a customized day-by-day vacation plan. It splits the day into morning, afternoon, and evening slots and adds coordinates, estimates, and tips.",
  },
  {
    q: "Is the Stripe integration secure?",
    a: "Yes! All package bookings checkout via Stripe's encrypted secure checkout screens. We do not store card credentials on our servers. For local testing, a fallback mock checkout screen is provided if Stripe keys are not configured.",
  },
  {
    q: "Can I cancel or reschedule my holiday booking?",
    a: "Rescheduling requests can be made directly from your User Dashboard. Cancellations are subject to package terms, and refunds will be processed directly to the original card.",
  },
  {
    q: "How does the AI Budget Estimator calculate costs?",
    a: "The Budget Estimator queries flight indices, accommodation rates, and dining indices for your selected destination. It then breaks down costs into flights, hotels, food, local transit, and sightseeing based on whether you choose Budget, Mid-range, or Luxury travel style.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 flex-grow space-y-10">
      <div className="text-center space-y-4">
        <div className="bg-indigo-50 p-4 rounded-full inline-block">
          <HelpCircle className="h-10 w-10 text-indigo-650" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-905 text-slate-900 tracking-tight">Frequently Asked Questions</h1>
        <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed">
          Quick answers to common questions about our AI vacation helpers, payment systems, and trip packages.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-5 text-left flex justify-between items-center font-bold text-slate-800 text-sm focus:outline-none"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="h-4 w-4 text-indigo-600" /> : <ChevronDown className="h-4 w-4 text-indigo-600" />}
              </button>
              {isOpen && (
                <div className="px-6 pb-5 text-xs text-slate-500 leading-relaxed border-t border-slate-50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
