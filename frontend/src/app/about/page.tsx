import React from 'react';
import { Compass, Users, Globe, Trophy } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 flex-grow space-y-12">
      {/* Intro */}
      <div className="text-center space-y-4">
        <div className="bg-indigo-50 p-4 rounded-full inline-block">
          <Compass className="h-10 w-10 text-indigo-650" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">About FindMyWay</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
          We are on a mission to democratize custom holiday planning. By blending relational booking data with state-of-the-art AI systems, we help travelers build dream itineraries in seconds.
        </p>
      </div>

      <hr className="border-slate-100" />

      {/* Grid Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
          <div className="bg-indigo-50 text-indigo-600 h-10 w-10 rounded-xl flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-800">Traveler Centric</h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            Your travel preferences shape our recommendations. Every itinerary is customized to match individual budgets and interests.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
          <div className="bg-sky-50 text-sky-600 h-10 w-10 rounded-xl flex items-center justify-center">
            <Globe className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-800">Global Coverage</h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            From the metropolitan grids of Tokyo to the sandy retreats of Bali, we curate packages and guidebooks for global hotspots.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
          <div className="bg-amber-50 text-amber-600 h-10 w-10 rounded-xl flex items-center justify-center">
            <Trophy className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-800">Award Winning AI</h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            Our specialized prompt-construction models yield detailed travel plans, saving hours of manual holiday planning.
          </p>
        </div>
      </div>
    </div>
  );
}
