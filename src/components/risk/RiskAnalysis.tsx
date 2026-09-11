"use client";
import React from "react";
import { Route } from "@/types/route";
import { computeRouteRisk } from "@/lib/riskCalculator";
import { ShieldCheck, Activity, AlertTriangle, CheckCircle2 } from "lucide-react";

interface RiskAnalysisProps {
  route: Route;
}

export default function RiskAnalysis({ route }: RiskAnalysisProps) {
  const summary = computeRouteRisk(route.riskFactors);

  return (
    <div className="bg-[#111A1F] border border-[#243742] rounded-2xl p-4 sm:p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#10B981]" />
          <h3 className="text-sm font-bold text-white">Risk Factor Analysis</h3>
        </div>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-xl border"
          style={{ color: summary.riskColor, borderColor: `${summary.riskColor}60`, backgroundColor: `${summary.riskColor}15` }}
        >
          {summary.riskRating}
        </span>
      </div>

      {/* Safety Score Meter */}
      <div className="mb-4 p-3 rounded-xl bg-[#162229] border border-[#243742]">
        <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
          <span className="text-[#94A3B8]">Overall Safety Index</span>
          <span className="text-emerald-400">{summary.overallSafetyScore} / 100</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-[#0B1114] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${summary.overallSafetyScore}%`, backgroundColor: summary.riskColor }}
          />
        </div>
      </div>

      {/* Risk Category Breakdown */}
      <div className="space-y-3">
        {route.riskFactors.map((rf, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-[#162229]/60 border border-[#243742]/80">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-white">{rf.label}</span>
              <span
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                  rf.impact === "severe"
                    ? "bg-red-950 text-red-400 border border-red-800"
                    : rf.impact === "high"
                    ? "bg-orange-950 text-orange-400 border border-orange-800"
                    : rf.impact === "moderate"
                    ? "bg-amber-950 text-amber-400 border border-amber-800"
                    : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                }`}
              >
                {rf.impact} ({rf.score}%)
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">{rf.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
