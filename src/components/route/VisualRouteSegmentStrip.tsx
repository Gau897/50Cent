"use client";
import React, { useState } from "react";
import { CloudRain, Skull, Construction, ShieldCheck, MapPin, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

export interface RouteTimelineHazard {
  id: string;
  kmPosition: number;
  type: 'rain' | 'blackspot' | 'roadblock' | 'pothole' | 'ghost';
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detail: string;
}

interface VisualRouteSegmentStripProps {
  totalDistanceKm?: number;
  originName?: string;
  destinationName?: string;
  hazards?: RouteTimelineHazard[];
  compact?: boolean;
  className?: string;
}

export default function VisualRouteSegmentStrip({
  totalDistanceKm = 15.8,
  originName = "START (MIHAN)",
  destinationName = "DESTINATION (Sitabuldi)",
  hazards = [
    {
      id: 'h1',
      kmPosition: 1.2,
      type: 'blackspot',
      title: 'Accident Blackspot',
      severity: 'critical',
      detail: 'Chhatrapati Flyover exit merge point',
    },
    {
      id: 'h2',
      kmPosition: 3.0,
      type: 'rain',
      title: 'Rain / Aquaplaning Zone',
      severity: 'high',
      detail: 'High precipitation water pooling sector',
    },
    {
      id: 'h3',
      kmPosition: 7.5,
      type: 'roadblock',
      title: 'Metro Construction',
      severity: 'medium',
      detail: 'Lane narrowed to single carriageway',
    },
    {
      id: 'h4',
      kmPosition: 12.4,
      type: 'ghost',
      title: 'Ghost Hazard Reported',
      severity: 'high',
      detail: 'Oil spill verified by 19 community drivers',
    },
  ],
  compact = false,
  className = "",
}: VisualRouteSegmentStripProps) {
  const [activeHazard, setActiveHazard] = useState<RouteTimelineHazard | null>(hazards[0] || null);
  const [isExpanded, setIsExpanded] = useState(!compact);

  // Segment colors along the journey
  const segments = [
    { color: '#22C55E', label: 'Safe Segment (0-1 km)' },
    { color: '#EF4444', label: 'High Risk Blackspot (1-2.5 km)' },
    { color: '#F59E0B', label: 'Rain / Slick (2.5-5 km)' },
    { color: '#3B82F6', label: 'Optimal Corridor (5-10 km)' },
    { color: '#EF4444', label: 'Ghost Hazard Sector (10-13 km)' },
    { color: '#22C55E', label: 'Clear Approach (13-15.8 km)' },
  ];

  if (compact) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between text-[11px] font-bold">
          <div className="flex items-center gap-2">
            <span className="text-white">Route Risk Timeline</span>
            <span className="text-emerald-400 font-normal">({originName} → {destinationName})</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[10px] text-[#8A9BA8] hover:text-white flex items-center gap-1 bg-[#16222A] px-2 py-0.5 rounded border border-[#243743]"
          >
            <span>{isExpanded ? "Hide Details" : "Inspect Markers"}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* The Multi-Segment Bar */}
        <div className="relative h-2.5 rounded-full bg-[#1A2630] flex overflow-hidden p-0.5 shadow-inner">
          {segments.map((seg, idx) => (
            <div
              key={idx}
              className="h-full flex-1 first:rounded-l-full last:rounded-r-full transition-all hover:brightness-125 cursor-pointer"
              style={{ backgroundColor: seg.color }}
              title={seg.label}
            />
          ))}
        </div>

        {isExpanded && (
          <div className="pt-1">
            {/* Horizontal Hazard Pills */}
            <div className="flex flex-wrap gap-1.5">
              {hazards.map((h) => {
                const isSelected = activeHazard?.id === h.id;
                return (
                  <button
                    key={h.id}
                    onClick={() => setActiveHazard(h)}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${
                      isSelected
                        ? "bg-white text-black ring-1 ring-blue-500"
                        : "bg-[#141F28] text-[#C5D1DC] border border-[#243743] hover:border-white"
                    }`}
                  >
                    {h.type === 'rain' && <CloudRain className="w-3 h-3 text-blue-400" />}
                    {h.type === 'blackspot' && <Skull className="w-3 h-3 text-red-500" />}
                    {h.type === 'roadblock' && <Construction className="w-3 h-3 text-amber-400" />}
                    {h.type === 'ghost' && <AlertTriangle className="w-3 h-3 text-orange-400" />}
                    <span>{h.title}</span>
                    <span className="opacity-75">({h.kmPosition} km)</span>
                  </button>
                );
              })}
            </div>

            {activeHazard && (
              <div className="mt-1.5 p-2 rounded-lg bg-[#141F28] border border-[#243743] flex items-center justify-between text-[11px]">
                <span className="text-white font-semibold truncate">
                  ⚠ {activeHazard.title}: {activeHazard.detail}
                </span>
                <span className="text-emerald-400 font-bold ml-2 flex-shrink-0">
                  {activeHazard.kmPosition} km
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-[#0F171E] border border-[#1E2E3B] rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl space-y-4 ${className}`}>
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-[#243743]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-emerald-500/20 text-emerald-400 font-bold text-xs">
            3
          </div>
          <h3 className="text-sm font-black text-white uppercase tracking-tight">
            Risk Map (Visual Route Segmentation)
          </h3>
        </div>
        <span className="text-[10px] text-[#8A9BA8] font-bold">
          Total: {totalDistanceKm} km
        </span>
      </div>

      <p className="text-xs text-[#8A9BA8]">
        Color-coded route strip showing real-time hazard markers across the journey timeline from start to destination.
      </p>

      {/* Visual Timeline Strip */}
      <div className="pt-4 pb-6 px-2">
        <div className="flex items-center justify-between text-xs font-black text-white mb-3">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            {originName}
          </span>
          <span className="flex items-center gap-1.5 text-blue-400">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            {destinationName}
          </span>
        </div>

        <div className="relative h-4 rounded-full bg-[#1A2630] flex overflow-hidden p-0.5 shadow-inner">
          {segments.map((seg, idx) => (
            <div
              key={idx}
              className="h-full flex-1 first:rounded-l-full last:rounded-r-full transition-all hover:brightness-125 cursor-pointer relative group"
              style={{ backgroundColor: seg.color }}
              title={seg.label}
            />
          ))}
        </div>

        <div className="relative h-14 mt-2">
          {hazards.map((h) => {
            const leftPercent = Math.min(92, Math.max(8, (h.kmPosition / totalDistanceKm) * 100));
            const isSelected = activeHazard?.id === h.id;

            return (
              <div
                key={h.id}
                onClick={() => setActiveHazard(h)}
                className="absolute -translate-x-1/2 flex flex-col items-center cursor-pointer group transition-all"
                style={{ left: `${leftPercent}%` }}
              >
                <div
                  className={`w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] ${
                    isSelected ? "border-b-white" : "border-b-[#8A9BA8]"
                  }`}
                />

                <div
                  className={`mt-0.5 px-2 py-1 rounded-md text-[10px] font-black flex items-center gap-1 shadow-lg transition-all ${
                    isSelected
                      ? "bg-white text-black ring-2 ring-blue-500 scale-105"
                      : "bg-[#16242E] text-white border border-[#2B3E4D] group-hover:border-white"
                  }`}
                >
                  {h.type === 'rain' && <CloudRain className="w-3 h-3 text-blue-400" />}
                  {h.type === 'blackspot' && <Skull className="w-3 h-3 text-red-500" />}
                  {h.type === 'roadblock' && <Construction className="w-3 h-3 text-amber-400" />}
                  {h.type === 'ghost' && <AlertTriangle className="w-3 h-3 text-orange-400" />}
                  <span>{h.type === 'blackspot' ? 'Blackspot' : h.type === 'rain' ? 'Rain' : h.type === 'ghost' ? 'Ghost' : 'Block'}</span>
                </div>

                <span className="text-[9px] font-bold text-[#8A9BA8] mt-0.5">
                  {h.kmPosition} km
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {activeHazard && (
        <div className="p-3 rounded-xl bg-[#141F28] border border-[#243743] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-lg text-white ${
                activeHazard.severity === 'critical'
                  ? 'bg-red-600'
                  : activeHazard.severity === 'high'
                  ? 'bg-amber-600'
                  : 'bg-blue-600'
              }`}
            >
              {activeHazard.type === 'rain' && <CloudRain className="w-4 h-4" />}
              {activeHazard.type === 'blackspot' && <Skull className="w-4 h-4" />}
              {activeHazard.type === 'roadblock' && <Construction className="w-4 h-4" />}
              {activeHazard.type === 'ghost' && <AlertTriangle className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white">{activeHazard.title}</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded">
                  at {activeHazard.kmPosition} km
                </span>
              </div>
              <p className="text-[11px] text-[#8A9BA8] mt-0.5">{activeHazard.detail}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
