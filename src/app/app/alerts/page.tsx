"use client";
import React, { useState } from "react";
import { mockRiskZones } from "@/mock/mockRiskZones";
import { mockAccidents } from "@/mock/mockAccidents";
import { AlertTriangle, ShieldAlert, Filter, ImageIcon, MapPin } from "lucide-react";
import AccidentModal from "@/components/accidents/AccidentModal";
import { Accident } from "@/types/accident";

export default function AlertsRadarPage() {
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [selectedAccident, setSelectedAccident] = useState<Accident | null>(null);

  const filteredAccidents = mockAccidents.filter((a) => {
    if (filterSeverity === "all") return true;
    return a.severity === filterSeverity;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-7 h-7 text-amber-400" />
            <span>Hazard Radar & Historical Crash Repository</span>
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Real-time sector safety warnings and verified crash investigations.
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2 bg-[#111A1F] border border-[#243742] p-1.5 rounded-2xl">
          <Filter className="w-4 h-4 text-[#94A3B8] ml-2" />
          {["all", "severe", "moderate", "minor"].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 rounded-xl text-xs font-bold uppercase transition-all ${
                filterSeverity === sev
                  ? "bg-[#10B981] text-white"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Incidents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAccidents.map((acc) => (
          <div
            key={acc.id}
            onClick={() => setSelectedAccident(acc)}
            className="group bg-[#111A1F] border border-[#243742] hover:border-[#10B981] rounded-2xl overflow-hidden shadow-xl cursor-pointer transition-all hover:-translate-y-1"
          >
            <div className="relative h-44 w-full bg-black overflow-hidden">
              <img
                src={acc.imageUrl}
                alt={acc.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111A1F] via-transparent to-black/30" />
              <span
                className={`absolute top-3 left-3 text-[10px] font-black uppercase px-2.5 py-1 rounded-md text-white ${
                  acc.severity === "severe" ? "bg-red-600" : "bg-amber-600"
                }`}
              >
                {acc.severity}
              </span>
              <span className="absolute bottom-2 right-3 text-[10px] font-bold text-white bg-black/60 px-2 py-0.5 rounded">
                {acc.formattedDate}
              </span>
            </div>

            <div className="p-4 space-y-2">
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                {acc.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
                <MapPin className="w-3.5 h-3.5 text-[#EF4444]" />
                <span className="truncate">{acc.locationName}</span>
              </div>
              <p className="text-xs text-[#64748B] line-clamp-2">{acc.description}</p>
            </div>
          </div>
        ))}
      </div>

      <AccidentModal accident={selectedAccident} onClose={() => setSelectedAccident(null)} />
    </div>
  );
}
