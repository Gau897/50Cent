"use client";
import React from "react";
import { mockTripHistory } from "@/mock/mockHistory";
import { History, MapPin, Calendar, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
          <History className="w-7 h-7 text-[#10B981]" />
          <span>Navigation Trip History</span>
        </h1>
        <p className="text-sm text-[#94A3B8] mt-1">
          Historical log of safety sessions, risk encounters, and recorded travel parameters.
        </p>
      </div>

      <div className="space-y-3">
        {mockTripHistory.map((trip) => (
          <div
            key={trip.id}
            className="p-5 rounded-2xl bg-[#111A1F] border border-[#243742] hover:border-[#334E5D] transition-all shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#243742]">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Session {trip.id}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{trip.routeName}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50 font-semibold">
                  {trip.status.toUpperCase()}
                </span>
                <Link
                  href={`/app/navigation?routeId=${trip.routeId}`}
                  className="p-2 rounded-xl bg-[#162229] hover:bg-[#243742] text-[#94A3B8] hover:text-white transition-colors"
                  title="Re-run route"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
              <div>
                <span className="text-[10px] text-[#64748B] block font-medium">Origin → Destination</span>
                <span className="font-semibold text-white truncate block">
                  {trip.originName.split(",")[0]} → {trip.destinationName.split(",")[0]}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] block font-medium">Distance & Time</span>
                <span className="font-semibold text-white">
                  {trip.totalDistanceKm} km · {trip.totalDurationMinutes} min
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] block font-medium">Risk Zones Passed</span>
                <span className="font-semibold text-white">{trip.riskZonesEncountered} Sectors</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] block font-medium">Alerts Triggered</span>
                <span className="font-semibold text-emerald-400">{trip.alertsTriggered} Warnings</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
