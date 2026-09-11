"use client";
import React, { useState } from "react";
import { RiskZone } from "@/types/riskZone";
import { Accident } from "@/types/accident";
import { X, ShieldAlert, AlertTriangle, ChevronRight, Gauge, Car, Calendar, ExternalLink } from "lucide-react";
import AccidentModal from "./AccidentModal";

interface HighRiskZonePanelProps {
  zone: RiskZone | null;
  accidents: Accident[];
  onClose: () => void;
}

export default function HighRiskZonePanel({ zone, accidents, onClose }: HighRiskZonePanelProps) {
  const [inspectedAccident, setInspectedAccident] = useState<Accident | null>(null);

  if (!zone) return null;

  const zoneAccidents = accidents.filter((a) => a.riskZoneId === zone.id);

  return (
    <>
      <div className="absolute top-4 left-4 right-4 md:left-auto md:right-4 md:w-[440px] z-[460] bg-[#111A20]/95 backdrop-blur-2xl border border-[#EF4444]/60 rounded-2xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#243743]">
          <div className="flex items-start gap-2.5">
            <div className="p-2.5 rounded-xl bg-red-600/20 border border-red-500/50 text-red-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-red-400 tracking-wider bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                  {zone.level.toUpperCase()} HAZARD ZONE
                </span>
                <span className="text-xs font-bold text-white">{zone.accidentCount} Incidents</span>
              </div>
              <h3 className="text-sm font-black text-white mt-1">{zone.name}</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#8A9BA8] hover:text-white hover:bg-[#1E2E38]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hazard Reason & Speed Limit */}
        <div className="py-3 space-y-2.5 border-b border-[#243743]">
          <p className="text-xs text-[#C5D1DC] leading-relaxed">{zone.description}</p>

          <div className="p-3 rounded-xl bg-red-950/40 border border-red-900/60 text-xs">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-1">
              Primary Hazard Factor:
            </span>
            <p className="text-red-200 font-medium">{zone.reason}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[#16222A] border border-[#243743]">
              <span className="text-[10px] text-[#8A9BA8] block">Speed Limit</span>
              <span className="text-sm font-black text-white">{zone.speedLimitKmh} km/h</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#16222A] border border-emerald-500/40">
              <span className="text-[10px] text-emerald-400 block font-bold">Recommended Speed</span>
              <span className="text-sm font-black text-emerald-400">{zone.recommendedSpeedKmh} km/h</span>
            </div>
          </div>
        </div>

        {/* Recorded Past Accidents in this Area */}
        <div className="pt-3 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Historical Crash Records</span>
              <span className="text-[#8A9BA8]">({zoneAccidents.length})</span>
            </h4>
            <span className="text-[10px] text-[#64748B]">Click to inspect photo</span>
          </div>

          <div className="space-y-2">
            {zoneAccidents.length > 0 ? (
              zoneAccidents.map((acc) => (
                <div
                  key={acc.id}
                  onClick={() => setInspectedAccident(acc)}
                  className="group flex items-center gap-3 p-2.5 rounded-xl bg-[#16222A] hover:bg-[#1E2E38] border border-[#243743] hover:border-[#10B981] cursor-pointer transition-all"
                >
                  <div className="relative w-16 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-black">
                    <img src={acc.imageUrl} alt={acc.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        acc.severity === "fatal" || acc.severity === "severe" ? "bg-red-950 text-red-400" : "bg-amber-950 text-amber-400"
                      }`}>
                        {acc.severity}
                      </span>
                      <span className="text-[10px] text-[#8A9BA8]">{acc.formattedDate.split(',')[0]}</span>
                    </div>
                    <h5 className="text-xs font-bold text-white truncate mt-0.5 group-hover:text-emerald-400 transition-colors">
                      {acc.title}
                    </h5>
                    <span className="text-[10px] text-[#8A9BA8] line-clamp-1">{acc.cause}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8A9BA8] group-hover:text-white flex-shrink-0" />
                </div>
              ))
            ) : (
              <p className="text-xs text-[#8A9BA8] py-2">No detailed records uploaded for this sector yet.</p>
            )}
          </div>
        </div>
      </div>

      <AccidentModal accident={inspectedAccident} onClose={() => setInspectedAccident(null)} />
    </>
  );
}
