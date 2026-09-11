"use client";
import React from "react";
import Link from "next/link";
import { Shield, ArrowRight, ChevronDown } from "lucide-react";

export default function LandingPage() {
  const steps = [
    { number: "1", title: "Enter your starting location", desc: "Specify origin point or let GPS locate you." },
    { number: "2", title: "Enter your destination", desc: "Select destination across urban or highway links." },
    { number: "3", title: "We find all possible routes", desc: "Our engine maps expressways, arterial links, and bypasses." },
    { number: "4", title: "We analyze weather, traffic & road conditions", desc: "Precipitation, wind shear, road surface friction evaluated." },
    { number: "5", title: "Each route gets a risk score", desc: "Multi-factor weighted safety rating computed in real time." },
    { number: "6", title: "You choose the safest route", desc: "Drive with turn-by-turn live proximity radar alerts." },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-slate-800 flex flex-col selection:bg-[#E15A2B] selection:text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981]">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              Risk<span className="text-[#10B981]">Route</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link href="/" className="text-slate-900 hover:text-[#E15A2B] transition-colors">Home</Link>
            <a href="#how-it-works" className="hover:text-[#E15A2B] transition-colors">How It Works</a>
            <a href="#about" className="hover:text-[#E15A2B] transition-colors">About</a>
            <Link href="/app" className="hover:text-[#E15A2B] transition-colors">Login</Link>
          </nav>

          <Link
            href="/app"
            className="px-5 py-2 rounded-xl bg-[#E15A2B] hover:bg-[#D04F22] text-white text-xs font-bold shadow-md shadow-[#E15A2B]/20 transition-all hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                Safe Roads. Smart Choices.
              </span>

              <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-[1.1]">
                Navigate Smarter. <br />
                <span className="text-[#E15A2B]">Travel Safer.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                RiskRoute helps you find the safest routes by analyzing real-time weather, traffic, road conditions and accident history.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/app"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#1B3632] hover:bg-[#132825] text-white font-bold text-sm shadow-xl transition-all hover:scale-105"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-sm shadow-sm hover:bg-slate-50 transition-all"
                >
                  <span>How It Works</span>
                  <ChevronDown className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Hero Graphic / Winding Road Graphic */}
            <div className="lg:col-span-6 relative">
              <div className="relative w-full h-[320px] sm:h-[400px] rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-100/60 via-teal-50 to-amber-50 border border-slate-200/80 shadow-2xl flex items-center justify-center p-6">
                <img
                  src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80"
                  alt="Scenic Highway"
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-2xl" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/95 backdrop-blur-md shadow-lg border border-slate-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Pune Highway Corridor</span>
                    <span className="font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">12% Low Risk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-16 md:py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E15A2B]">HOW IT WORKS</span>
            <h2 className="text-3xl font-black text-slate-900 mt-1">Simple Steps for a Safer Journey</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-black text-xs flex items-center justify-center mb-3">
                    {step.number}
                  </div>
                  <h3 className="text-xs font-bold text-slate-900">{step.title}</h3>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAFETY BANNER SECTION */}
      <section id="about" className="py-16 bg-[#162D28] text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Your safety is our priority.</h2>
          <p className="text-sm text-emerald-200/80 max-w-lg mx-auto">
            Make every journey a safe one with RiskRoute.
          </p>
          <div className="pt-4">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E15A2B] hover:bg-[#D04F22] text-white font-bold text-xs shadow-xl transition-all"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-white border-t border-slate-200 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-slate-900 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#10B981]" /> RiskRoute
          </span>
          <p>© {new Date().getFullYear()} RiskRoute. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
