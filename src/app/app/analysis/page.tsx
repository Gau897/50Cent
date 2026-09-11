"use client";
import React, { useState } from "react";
import { mockRoutes } from "@/mock/mockRoutes";
import { mockRiskZones } from "@/mock/mockRiskZones";
import { mockAccidents } from "@/mock/mockAccidents";
import { Activity, ShieldCheck, AlertTriangle, BarChart3, CloudRain, Car } from "lucide-react";

export default function AnalysisPage() {
  const [selectedRouteId, setSelectedRouteId] = useState("route-2");
  const selectedRoute = mockRoutes.find((r) => r.id === selectedRouteId) || mockRoutes[1];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Activity className="w-7 h-7 text-[#10B981]" />
          <span>Corridor Risk Analysis & Safety Scoring</span>
        </h1>
        <p className="text-sm text-[#94A3B8] mt-1">
          Multi-factor weighted evaluation comparing road grade, historical crash records, weather friction, and bottleneck density.
        </p>
      </div>

      {/* Route Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockRoutes.map((r) => {
          const isSelected = r.id === selectedRouteId;
          return (
            <div
              key={r.id}
              onClick={() => setSelectedRouteId(r.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#162229] border-[#10B981] ring-2 ring-[#10B981]/40 shadow-xl"
                  : "bg-[#111A1F] border-[#243742] hover:bg-[#162229]/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-black/40 text-emerald-400">
                  {r.tag}
                </span>
                <span className="text-sm font-black text-white">{r.riskScore}% Risk</span>
              </div>
              <h3 className="text-base font-bold text-white">{r.name}</h3>
              <p className="text-xs text-[#94A3B8] mt-1 line-clamp-1">{r.via}</p>
            </div>
          );
        })}
      </div>

      {/* Safety Score Breakdown Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111A1F] border border-[#243742] rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#10B981]" />
            <span>Category Factor Weights for {selectedRoute.name}</span>
          </h3>

          <div className="space-y-4 pt-2">
            {selectedRoute.riskFactors.map((rf, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{rf.label}</span>
                  <span className="text-[#94A3B8]">{rf.score}% Hazard Index</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#162229] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      rf.score > 40 ? "bg-red-500" : rf.score > 20 ? "bg-amber-500" : "bg-[#10B981]"
                    }`}
                    style={{ width: `${rf.score}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#64748B]">{rf.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Historical Danger Zones */}
        <div className="bg-[#111A1F] border border-[#243742] rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Identified Risk Sectors along Corridor ({mockRiskZones.length})</span>
          </h3>

          <div className="space-y-3 pt-2">
            {mockRiskZones.map((zone) => (
              <div key={zone.id} className="p-3.5 rounded-2xl bg-[#162229] border border-[#243742]">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-white">{zone.name}</h4>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                    {zone.level}
                  </span>
                </div>
                <p className="text-[11px] text-[#94A3B8]">{zone.reason}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-[#64748B]">
                  <span>{zone.accidentCount} crash reports</span>
                  <span>•</span>
                  <span>Rec. Speed: {zone.recommendedSpeedKmh} km/h</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
