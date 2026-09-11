"use client";
import React from "react";
import { AlertTriangle, CloudRain, Construction, Skull, Clock, ShieldAlert } from "lucide-react";

interface RiskAheadAlertCardProps {
  distanceAheadKm?: number;
  etaMinutes?: number;
  hazards?: {
    type: 'rain' | 'blockage' | 'blackspot' | 'ghost';
    title: string;
    detail: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}

export default function RiskAheadAlertCard({
  distanceAheadKm = 2.4,
  etaMinutes = 8,
  hazards = [
    {
      type: 'rain',
      title: 'Heavy Rain',
      detail: 'Precipitation: 18mm/hr',
    },
    {
      type: 'blockage',
      title: 'Road Blockage',
      detail: 'Construction ahead',
    },
    {
      type: 'blackspot',
      title: 'Accident Blackspot',
      detail: 'High fatality zone',
    },
  ],
  className = "",
}: RiskAheadAlertCardProps) {
  return (
    <div
      className={`bg-[#0D151C] border-2 border-[#EF4444] rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden ${className}`}
    >
      {/* Top Banner: High Risk Ahead */}
      <div className="flex items-center justify-between pb-3 border-b border-red-500/30">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-red-500/20 text-red-500 animate-pulse">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-red-400 font-black tracking-widest uppercase block">
              Proximity & ETA Warning
            </span>
            <h3 className="text-sm sm:text-base font-black text-white tracking-tight">
              HIGH RISK AHEAD ({distanceAheadKm} km ahead)
            </h3>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-red-500/20 text-red-400 border border-red-500/40">
          Critical Radar
        </span>
      </div>

      {/* Hazard items list */}
      <div className="py-3.5 space-y-2.5">
        {hazards.map((h, i) => (
          <div key={i} className="flex items-center gap-3 text-xs">
            <div className="w-6 h-6 rounded-lg bg-[#17232B] border border-[#2B3B47] flex items-center justify-center text-slate-300 flex-shrink-0">
              {h.type === 'rain' && <CloudRain className="w-3.5 h-3.5 text-blue-400" />}
              {h.type === 'blockage' && <Construction className="w-3.5 h-3.5 text-amber-400" />}
              {h.type === 'blackspot' && <Skull className="w-3.5 h-3.5 text-red-400" />}
              {h.type === 'ghost' && <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-bold text-white">{h.title}</span>
              <span className="text-[#8A9BA8]">({h.detail})</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom ETA to Danger Zone */}
      <div className="pt-3 border-t border-[#1E2931] flex items-center justify-between text-xs bg-red-950/20 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-3 sm:px-5">
        <div className="flex items-center gap-2 text-red-300 font-bold">
          <Clock className="w-4 h-4 text-red-400 animate-spin-slow" />
          <span>ETA to Danger Zone:</span>
        </div>
        <span className="text-sm font-black text-white bg-red-600/40 px-2.5 py-0.5 rounded-lg border border-red-500/50">
          {etaMinutes} minutes
        </span>
      </div>
    </div>
  );
}
