"use client";
import React from "react";
import { Waves, AlertTriangle, ShieldCheck, Gauge } from "lucide-react";
import { calculateAquaplaningRisk, AquaplaningAssessment } from "@/lib/aquaplaningEngine";

interface AquaplaningAlertBadgeProps {
  precipitationMmPerHour?: number;
  vehicleSpeedKmh?: number;
  onClick?: () => void;
  className?: string;
}

export default function AquaplaningAlertBadge({
  precipitationMmPerHour = 18,
  vehicleSpeedKmh = 55,
  onClick,
  className = "",
}: AquaplaningAlertBadgeProps) {
  const assessment: AquaplaningAssessment = calculateAquaplaningRisk(
    precipitationMmPerHour,
    vehicleSpeedKmh
  );

  const isCritical = assessment.advisoryLevel === 'critical';
  const isWarning = assessment.advisoryLevel === 'warning';

  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-2xl border transition-all cursor-pointer shadow-xl backdrop-blur-md ${
        isCritical
          ? 'bg-red-950/70 border-red-500 text-red-100 ring-2 ring-red-500/40'
          : isWarning
          ? 'bg-amber-950/70 border-amber-500 text-amber-100 ring-1 ring-amber-500/40'
          : 'bg-[#111A20] border-[#243743] text-slate-100'
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg ${
              isCritical
                ? 'bg-red-600 text-white animate-bounce-short'
                : isWarning
                ? 'bg-amber-600 text-white'
                : 'bg-blue-600 text-white'
            }`}
          >
            <Waves className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 block">
              Predictive Aquaplaning AI
            </span>
            <span className="text-xs font-black">
              {isCritical
                ? '⚠ DANGER: Hydroplaning Imminent'
                : isWarning
                ? '⚡ Warning: Standing Water Friction Drop'
                : '✓ Optimal Tire Road Grip'}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-black block">
            Cap: {assessment.safeSpeedCapKmh} km/h
          </span>
          <span className="text-[9px] opacity-75">
            Rain: {precipitationMmPerHour} mm/h
          </span>
        </div>
      </div>

      {(isCritical || isWarning) && (
        <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
          <span>Stopping Distance: +{assessment.brakingDistanceIncreasePercentage}%</span>
          <span className="font-bold underline">Adjust Speed</span>
        </div>
      )}
    </div>
  );
}
