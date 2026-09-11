"use client";
import React from "react";
import { ShieldCheck, Zap, ArrowRight, Gauge, AlertCircle, Eye } from "lucide-react";

interface ActionRecommendationsCardProps {
  recommendedSpeedCapKmh?: number;
  laneAdvice?: string;
  brakingAdvice?: string;
  hasAlternativeRoute?: boolean;
  alternativeRouteSavings?: {
    timeSavedMinutes: number;
    riskReductionPercent: number;
    routeId: string;
    routeName: string;
  };
  onSwitchRoute?: (routeId: string) => void;
  className?: string;
}

export default function ActionRecommendationsCard({
  recommendedSpeedCapKmh = 40,
  laneAdvice = "Avoid Lane 2 (Waterlogging reported)",
  brakingAdvice = "Maintain extra braking distance",
  hasAlternativeRoute = true,
  alternativeRouteSavings = {
    timeSavedMinutes: 6,
    riskReductionPercent: 42,
    routeId: "route-2",
    routeName: "Dharampeth & West Arterial",
  },
  onSwitchRoute,
  className = "",
}: ActionRecommendationsCardProps) {
  return (
    <div
      className={`bg-[#0E161C] border border-[#1E2E3B] rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl space-y-4 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 pb-2.5 border-b border-[#243743]">
        <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">
            Contextual Safety Advice
          </span>
          <h3 className="text-sm font-black text-white uppercase tracking-tight">
            Safety Action Recommendations
          </h3>
        </div>
      </div>

      {/* Bulleted Action Instructions matching screenshot */}
      <div className="space-y-2 text-xs">
        <div className="flex items-start gap-2.5 p-2 rounded-xl bg-[#141F27] border border-[#243743]">
          <Gauge className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <span className="text-white font-semibold">
            Reduce speed to <span className="text-emerald-400 font-bold">{recommendedSpeedCapKmh} km/h</span>
          </span>
        </div>

        <div className="flex items-start gap-2.5 p-2 rounded-xl bg-[#141F27] border border-[#243743]">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span className="text-white font-semibold">{laneAdvice}</span>
        </div>

        <div className="flex items-start gap-2.5 p-2 rounded-xl bg-[#141F27] border border-[#243743]">
          <Eye className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <span className="text-white font-semibold">{brakingAdvice}</span>
        </div>
      </div>

      {/* Alternative Route Switcher matching screenshot */}
      {hasAlternativeRoute && alternativeRouteSavings && (
        <div className="pt-2 border-t border-[#243743]">
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-950/50 to-indigo-950/50 border border-blue-500/40 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-blue-300">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Alternative Route Available:</span>
            </div>

            <button
              onClick={() => onSwitchRoute && onSwitchRoute(alternativeRouteSavings.routeId)}
              className="w-full py-2 px-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center justify-between transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5">
                <span className="group-hover:translate-x-0.5 transition-transform">↓ Tap to switch</span>
                <span className="text-blue-200 text-[11px]">|</span>
                <span className="text-emerald-300">
                  Save {alternativeRouteSavings.timeSavedMinutes} min + {alternativeRouteSavings.riskReductionPercent}% lower risk
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
