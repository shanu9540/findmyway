import React from 'react';
import { FileText, Clock, User, ArrowRight } from 'lucide-react';

const POSTS = [
  {
    title: 'Top 10 Packing Secrets for Solo Backpackers',
    excerpt: 'Packing light is an art form. Here are the top 10 items you should always carry, and what you should leave behind to avoid excess luggage baggage fees.',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
    date: 'Aug 10, 2026',
    author: 'Elena Rostova',
    readTime: '5 min read',
  },
  {
    title: 'Budgeting 101: Travel Europe for under $50/day',
    excerpt: 'Europe doesn’t have to break your bank. Discover cheap train tickets, hostel networks, and street food markets across Prague, Budapest, and Berlin.',
    image: 'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?auto=format&fit=crop&w=800&q=80',
    date: 'Aug 04, 2026',
    author: 'David Carter',
    readTime: '8 min read',
  },
  {
    title: 'How to Choose Your Next Destination Using AI',
    excerpt: 'Stuck in decision fatigue? Discover how feeding your budget parameters and activity preferences into FindMyWay AI helper can reveal hidden travel gems.',
    image: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=800&q=80',
    date: 'Jul 28, 2026',
    author: 'FindMyWay Team',
    readTime: '4 min read',
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <FileText className="h-8 w-8 text-indigo-650" />
          Travel Guides & Blog
        </h1>
        <p className="text-slate-500 mt-1">Explore expert recommendations, local tips, and travel news.</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {POSTS.map((post, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl overflow-hidden border border-slate-105 shadow-sm hover:shadow-md transition-shadow flex flex-col group"
          >
            <div className="h-48 relative overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
            </div>
            <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {post.readTime}
                  </span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">{post.excerpt}</p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-50 text-xs font-bold">
                <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                  <User className="h-4 w-4 text-indigo-500" /> {post.author}
                </span>
                <button className="text-indigo-650 hover:text-indigo-805 flex items-center gap-0.5 hover:underline">
                  Read Article <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
