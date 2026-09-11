"use client";
import React from "react";
import { Route } from "@/types/route";
import { ArrowUpRight, Clock, Gauge, MapPin } from "lucide-react";

interface NavigationPanelProps {
  route: Route;
  destination: string;
  distanceRemainingKm: number;
  etaMinutes: number;
  currentSpeed: number;
}

export default function NavigationPanel({
  route,
  destination,
  distanceRemainingKm,
  etaMinutes,
  currentSpeed,
}: NavigationPanelProps) {
  const now = new Date();
  const arrivalDate = new Date(now.getTime() + etaMinutes * 60000);
  const etaFormatted = arrivalDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="absolute top-4 left-4 right-4 md:left-6 md:right-auto md:w-[420px] z-[450]">
      <div className="bg-[#111A1F]/95 backdrop-blur-xl border border-[#243742] rounded-2xl p-4 shadow-2xl">
        {/* Turn Direction Banner */}
        <div className="flex items-center gap-3 pb-3 border-b border-[#243742]">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#10B981] to-[#3A6B65] flex items-center justify-center text-white shadow-lg shadow-[#10B981]/30">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">In 450 meters</span>
            <h2 className="text-sm font-black text-white line-clamp-1">Continue on {route.via.split("&")[0]}</h2>
          </div>
        </div>

        {/* Destination & ETA row */}
        <div className="flex items-center justify-between mt-3 mb-3 text-xs">
          <div className="flex items-center gap-1.5 text-white font-semibold truncate max-w-[240px]">
            <MapPin className="w-3.5 h-3.5 text-[#EF4444] flex-shrink-0" />
            <span className="truncate">{destination || "Hadapsar Magarpatta"}</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/40">
            {route.tag}
          </span>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#243742]/70 text-center">
          <div className="p-2 rounded-xl bg-[#162229]">
            <span className="text-[10px] text-[#64748B] block font-semibold">ETA</span>
            <span className="text-sm font-black text-white">{etaFormatted}</span>
            <span className="text-[10px] text-emerald-400 block font-medium">({etaMinutes}m)</span>
          </div>

          <div className="p-2 rounded-xl bg-[#162229]">
            <span className="text-[10px] text-[#64748B] block font-semibold">Remaining</span>
            <span className="text-sm font-black text-white">{distanceRemainingKm}</span>
            <span className="text-[10px] text-[#94A3B8] block font-medium">km</span>
          </div>

          <div className="p-2 rounded-xl bg-[#162229]">
            <span className="text-[10px] text-[#64748B] block font-semibold">Speed</span>
            <span className="text-sm font-black text-white">{currentSpeed}</span>
            <span className="text-[10px] text-[#94A3B8] block font-medium">km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
}
