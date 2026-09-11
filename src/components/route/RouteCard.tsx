"use client";
import React from "react";
import { Route } from "@/types/route";
import { Clock, ShieldCheck, AlertTriangle, Navigation, ArrowRight } from "lucide-react";
import Link from "next/link";

interface RouteCardProps {
  route: Route;
  isSelected: boolean;
  onSelect: () => void;
}

export default function RouteCard({ route, isSelected, onSelect }: RouteCardProps) {
  const isSafest = route.isRecommended || route.type === "safest";

  return (
    <div
      onClick={onSelect}
      className={`relative p-4 rounded-2xl border transition-all cursor-pointer ${
        isSelected
          ? isSafest
            ? "bg-emerald-950/40 border-[#10B981] ring-2 ring-[#10B981]/40 shadow-xl shadow-[#10B981]/15"
            : "bg-[#162229] border-blue-500 ring-2 ring-blue-500/40 shadow-xl"
          : "bg-[#111A1F] border-[#243742] hover:border-[#334E5D] hover:bg-[#162229]/60"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                isSafest
                  ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40"
                  : route.type === "fastest"
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                  : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
              }`}
            >
              {route.tag}
            </span>
            {isSafest && (
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                ★ Safest Choice
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold text-white mt-1">{route.name}</h3>
          <p className="text-xs text-[#94A3B8] line-clamp-1">{route.via}</p>
        </div>

        {/* Risk Percentage Badge */}
        <div
          className={`flex flex-col items-end px-2.5 py-1 rounded-xl border ${
            route.riskScore <= 15
              ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300"
              : route.riskScore <= 25
              ? "bg-blue-950/60 border-blue-500/50 text-blue-300"
              : "bg-amber-950/60 border-amber-500/50 text-amber-300"
          }`}
        >
          <span className="text-xs font-black">{route.riskScore}%</span>
          <span className="text-[9px] uppercase tracking-wider font-semibold opacity-80">Risk Score</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="flex items-center justify-between text-xs pt-3 mt-3 border-t border-[#243742]/70 text-[#94A3B8]">
        <div className="flex items-center gap-1.5 font-semibold text-white">
          <Clock className="w-3.5 h-3.5 text-[#10B981]" />
          <span>{route.durationMinutes} min</span>
        </div>
        <div className="flex items-center gap-1">
          <span>{route.distanceKm} km</span>
          <span>·</span>
          <span>{route.averageSpeedKmh} km/h avg</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{route.safetyScore}% Safe</span>
        </div>
      </div>

      {/* Start Nav CTA button on selected card */}
      {isSelected && (
        <div className="mt-3 pt-3 border-t border-[#243742]/80 flex justify-end">
          <Link
            href={`/app/navigation?routeId=${route.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold shadow-lg shadow-[#10B981]/25 transition-all hover:scale-105"
          >
            <span>Start Live Navigation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
