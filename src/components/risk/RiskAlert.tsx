"use client";
import React from "react";
import { ProximityAlert } from "@/types/navigation";
import { AlertTriangle, ShieldAlert, X } from "lucide-react";

interface RiskAlertProps {
  alert: ProximityAlert | null;
  onDismiss: () => void;
}

export default function RiskAlert({ alert, onDismiss }: RiskAlertProps) {
  if (!alert) return null;

  const isCritical = alert.level === "imminent" || alert.level === "inside" || alert.zone.level === "critical";

  return (
    <div className="absolute top-20 left-4 right-4 md:left-6 md:right-auto md:w-[420px] z-[500] animate-bounce-short">
      <div
        className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all ${
          isCritical
            ? "bg-red-950/95 border-red-500 shadow-red-900/60 ring-2 ring-red-500/50"
            : "bg-amber-950/95 border-amber-500 shadow-amber-900/60"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl text-white ${isCritical ? "bg-red-600 animate-pulse" : "bg-amber-600"}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-wider uppercase text-white bg-black/40 px-2 py-0.5 rounded-md">
                  ⚠ RISK ZONE AHEAD
                </span>
                <span className="text-xs font-extrabold text-white">{alert.distanceMeters}m</span>
              </div>
              <h4 className="text-sm font-black text-white mt-1">{alert.zone.title}</h4>
              <p className="text-xs text-white/90 font-medium mt-1 leading-relaxed">{alert.advice}</p>
              <div className="flex items-center gap-3 mt-2.5 text-[11px] font-semibold text-white/80">
                <span>{alert.zone.accidentCount} historical incidents</span>
                <span>•</span>
                <span>Max {alert.zone.recommendedSpeedKmh} km/h</span>
              </div>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-black/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
