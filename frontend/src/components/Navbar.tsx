"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Heart, User, LogOut, Compass, LayoutDashboard, Settings } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout, wishlist } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Check if we are on the landing page
  const isLandingPage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'Tour Packages', href: '/packages' },
    { name: 'Flights', href: '/flights-hotels' },
    { name: 'Stays', href: '/stays' },
    { name: 'AI Planner', href: '/ai-planner' },
    { name: 'AI Budgeter', href: '/ai-budgeter' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isLandingPage
          ? isScrolled
            ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-md py-3'
            : 'bg-transparent py-5'
          : 'bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-md py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-white font-extrabold text-2xl tracking-wider hover:opacity-90">
              <Compass className="h-8 w-8 text-amber-500 animate-spin-slow" />
              <span className="bg-gradient-to-r from-teal-400 to-amber-500 bg-clip-text text-transparent">FindMyWay</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold tracking-wide transition-colors duration-250 ${
                    isActive
                      ? 'text-amber-400 border-b-2 border-amber-400 pb-1'
                      : 'text-slate-200 hover:text-amber-400'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* User Auth Buttons / Dropdown */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="flex items-center text-slate-200 hover:text-amber-400 text-sm font-medium transition-colors"
                  title="My Dashboard"
                >
                  <LayoutDashboard className="h-5 w-5 mr-1 text-teal-400" />
                  <span>Dashboard</span>
                </Link>
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="flex items-center text-slate-200 hover:text-amber-400 text-sm font-medium transition-colors"
                    title="Admin Panel"
                  >
                    <Settings className="h-5 w-5 mr-1 text-amber-500" />
                    <span>Admin</span>
                  </Link>
                )}
                <span className="text-slate-400 text-sm">|</span>
                <span className="text-teal-400 text-sm font-semibold flex items-center">
                  <User className="h-4 w-4 mr-1 text-slate-300" />
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center text-slate-200 hover:text-rose-400 text-sm font-semibold transition-colors bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-rose-500/50"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-slate-200 hover:text-white px-4 py-2 text-sm font-semibold rounded-lg hover:bg-slate-800/50 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 text-sm font-semibold rounded-lg shadow-md shadow-teal-900/30 hover:shadow-teal-900/40 hover:-translate-y-0.5 transition duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-200 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 shadow-xl px-2 pt-2 pb-4 space-y-1 sm:px-3 animate-fade-in">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? 'text-amber-400 bg-slate-800'
                    : 'text-slate-200 hover:text-amber-400 hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="border-t border-slate-800 my-2 pt-2">
            {user ? (
              <div className="space-y-1">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:text-amber-400 hover:bg-slate-800"
                >
                  Dashboard
                </Link>
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:text-amber-400 hover:bg-slate-800"
                  >
                    Admin Panel
                  </Link>
                )}
                <div className="px-3 py-2 text-teal-400 font-semibold flex items-center text-sm">
                  <User className="h-4 w-4 mr-2" />
                  Signed in as: {user.name}
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-rose-400 hover:bg-slate-800"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 px-3 py-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2 text-base font-medium text-slate-200 border border-slate-700 rounded-md hover:bg-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2 text-base font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 shadow"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
