"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, ChevronDown, Users, ShieldAlert, Navigation } from "lucide-react";

export default function AppNavbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Planner & Safety Hub", href: "/app" },
    { name: "Live Nav Radar", href: "/app/navigation" },
    { name: "Ghost Hazards", href: "/app/community" },
    { name: "Guardian Stream", href: "/app/guardian" },
    { name: "Analysis", href: "/app/analysis" },
    { name: "Alerts", href: "/app/alerts" },
    { name: "History", href: "/app/history" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0E1418] border-b border-[#1E2931] px-4 lg:px-8 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link href="/app" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/20 border border-[#10B981]/50 flex items-center justify-center text-[#10B981]">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-lg font-black text-white tracking-tight">
              Risk<span className="text-[#10B981]">Route</span>
            </span>
          </Link>

          {/* Nav Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3.5 py-2 text-xs font-bold transition-colors ${
                    isActive ? "text-white" : "text-[#8A9BA8] hover:text-white"
                  }`}
                >
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="absolute bottom-[-13px] left-0 right-0 h-[3px] bg-[#E15A2B] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right User Profile & Quick Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/app/navigation"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-900/60 transition-colors shadow-lg"
          >
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="hidden sm:inline">Live Nav Radar</span>
            <span className="sm:hidden">Nav</span>
          </Link>

          <div className="flex items-center gap-2.5 pl-3 border-l border-[#1E2931]">
            <div className="w-8 h-8 rounded-full bg-[#1E2931] border border-[#2B3B47] overflow-hidden flex items-center justify-center text-white text-xs font-bold">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Gaurav"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-bold text-white hidden sm:inline">Gaurav</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#8A9BA8]" />
          </div>
        </div>
      </div>
    </header>
  );
}
