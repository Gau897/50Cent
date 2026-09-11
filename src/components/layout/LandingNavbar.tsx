"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Shield, Menu, X, ArrowRight, Activity, MapPin } from "lucide-react";

export default function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B1114]/90 backdrop-blur-md border-b border-[#243742]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3A6B65] to-[#10B981] flex items-center justify-center text-white shadow-lg shadow-[#10B981]/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
              Risk<span className="text-[#10B981]">Route</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#94A3B8] font-medium -mt-1">
              Safety-First Navigation
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#94A3B8]">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="hover:text-white transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection("about-safety")}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Safety Intelligence
          </button>
          <Link href="/app/analysis" className="hover:text-white transition-colors">
            Risk Analysis
          </Link>
          <Link href="/app/alerts" className="hover:text-white transition-colors">
            Alerts Radar
          </Link>
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#10B981] to-[#3A6B65] hover:from-[#059669] hover:to-[#2D534E] text-white text-sm font-semibold shadow-lg shadow-[#10B981]/20 hover:shadow-[#10B981]/30 transition-all hover:scale-105 active:scale-95"
          >
            <span>Launch App</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#94A3B8] hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111A1F] border-b border-[#243742] px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-[#162229]"
          >
            Home
          </Link>
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="w-full text-left block px-3 py-2 rounded-lg text-base font-medium text-[#94A3B8] hover:text-white hover:bg-[#162229]"
          >
            How It Works
          </button>
          <Link
            href="/app"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-emerald-400 hover:bg-[#162229]"
          >
            Launch Route Planner
          </Link>
        </div>
      )}
    </header>
  );
}
