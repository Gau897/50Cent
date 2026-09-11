"use client";
import React from "react";
import { Search, ArrowUpDown, MapPin, Navigation, RotateCcw } from "lucide-react";

interface RouteSearchProps {
  fromLocation: string;
  toLocation: string;
  onFromChange: (val: string) => void;
  onToChange: (val: string) => void;
  onSearch: () => void;
  onSwap: () => void;
  onUseCurrentLocation: () => void;
  onClear: () => void;
  isLoading?: boolean;
}

export default function RouteSearch({
  fromLocation,
  toLocation,
  onFromChange,
  onToChange,
  onSearch,
  onSwap,
  onUseCurrentLocation,
  onClear,
  isLoading = false,
}: RouteSearchProps) {
  const presets = [
    { from: "Hinjewadi, Pune", to: "Hadapsar, Pune" },
    { from: "Kothrud, Pune", to: "Viman Nagar, Pune" },
    { from: "Wakad, Pune", to: "Magarpatta City" },
  ];

  return (
    <div className="bg-[#111A1F] border border-[#243742] rounded-2xl p-4 sm:p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Navigation className="w-4 h-4 text-[#10B981]" />
          <span>Find Your Route</span>
        </h2>
        <button
          onClick={onClear}
          className="text-xs text-[#94A3B8] hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-[#162229]"
          title="Reset inputs"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear</span>
        </button>
      </div>

      <div className="relative space-y-3">
        {/* From Input */}
        <div className="relative flex items-center">
          <div className="absolute left-3 text-[#10B981]">
            <MapPin className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={fromLocation}
            onChange={(e) => onFromChange(e.target.value)}
            placeholder="Starting location (e.g. Hinjewadi Phase 1)"
            className="w-full pl-9 pr-24 py-2.5 rounded-xl bg-[#162229] border border-[#243742] text-white text-sm placeholder-[#64748B] focus:outline-none focus:border-[#10B981] transition-colors"
          />
          <button
            onClick={onUseCurrentLocation}
            className="absolute right-2 px-2.5 py-1 rounded-lg bg-[#243742] hover:bg-[#2D4552] text-[#94A3B8] hover:text-white text-xs font-semibold transition-colors"
          >
            My GPS
          </button>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-1">
          <button
            onClick={onSwap}
            className="p-1.5 rounded-lg bg-[#162229] hover:bg-[#243742] border border-[#243742] text-[#94A3B8] hover:text-white transition-all hover:scale-110"
            title="Swap Origin & Destination"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* To Input */}
        <div className="relative flex items-center">
          <div className="absolute left-3 text-[#EF4444]">
            <MapPin className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={toLocation}
            onChange={(e) => onToChange(e.target.value)}
            placeholder="Destination (e.g. Hadapsar Magarpatta)"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#162229] border border-[#243742] text-white text-sm placeholder-[#64748B] focus:outline-none focus:border-[#10B981] transition-colors"
          />
        </div>

        {/* Search Action */}
        <button
          onClick={onSearch}
          disabled={isLoading || !fromLocation || !toLocation}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#10B981] to-[#3A6B65] hover:from-[#059669] hover:to-[#2D534E] disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-[#10B981]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span>Calculate Safe Routes</span>
        </button>
      </div>

      {/* Quick Presets */}
      <div className="mt-4 pt-3 border-t border-[#243742]/60">
        <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block mb-2">
          Popular Corridors:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p, i) => (
            <button
              key={i}
              onClick={() => {
                onFromChange(p.from);
                onToChange(p.to);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-[#162229] hover:bg-[#243742] text-[#94A3B8] hover:text-white border border-[#243742] transition-colors"
            >
              {p.from.split(",")[0]} → {p.to.split(",")[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
