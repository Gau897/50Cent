"use client";
import React, { useState } from "react";
import { CloudRain, Wind, Droplets, Waves, Gauge, AlertTriangle, ShieldCheck, X } from "lucide-react";
import { calculateAquaplaningRisk, AquaplaningAssessment } from "@/lib/aquaplaningEngine";

interface MicroWeatherRadarProps {
  initialRainMmPerHour?: number;
  initialSpeedKmh?: number;
  onClose?: () => void;
  className?: string;
}

export default function MicroWeatherRadar({
  initialRainMmPerHour = 18,
  initialSpeedKmh = 60,
  onClose,
  className = "",
}: MicroWeatherRadarProps) {
  const [rainMm, setRainMm] = useState(initialRainMmPerHour);
  const [speedKmh, setSpeedKmh] = useState(initialSpeedKmh);
  const [tirePressure, setTirePressure] = useState(32);
  const [treadDepth, setTreadDepth] = useState(4.0);

  const assessment: AquaplaningAssessment = calculateAquaplaningRisk(
    rainMm,
    speedKmh,
    tirePressure,
    treadDepth
  );

  return (
    <div className={`bg-[#0F171E] border border-[#1E2E3B] rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-5 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#243743]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Waves className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white">Predictive Aquaplaning & Micro-Weather AI</h3>
              <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
                Horne Formula Simulator
              </span>
            </div>
            <p className="text-xs text-[#8A9BA8]">
              Dynamic tire hydroplaning calculation factoring precipitation intensity and road water film thickness
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#16222A] hover:bg-[#20313C] text-[#8A9BA8] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: Critical Aquaplaning Speed */}
        <div className="p-3.5 rounded-2xl bg-[#141F28] border border-[#243743] text-center">
          <span className="text-[10px] text-[#8A9BA8] font-bold uppercase block">Critical Slip Speed</span>
          <span className="text-2xl font-black text-amber-400 mt-1 block">
            {assessment.criticalAquaplaningSpeedKmh} km/h
          </span>
          <span className="text-[10px] text-[#8A9BA8]">Hydroplaning Threshold</span>
        </div>

        {/* Metric 2: Safe Speed Cap */}
        <div className="p-3.5 rounded-2xl bg-[#141F28] border border-[#243743] text-center">
          <span className="text-[10px] text-[#8A9BA8] font-bold uppercase block">Recommended Speed Cap</span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">
            {assessment.safeSpeedCapKmh} km/h
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold">Active Speed Buffer</span>
        </div>

        {/* Metric 3: Water Film Depth */}
        <div className="p-3.5 rounded-2xl bg-[#141F28] border border-[#243743] text-center">
          <span className="text-[10px] text-[#8A9BA8] font-bold uppercase block">Road Water Film</span>
          <span className="text-2xl font-black text-blue-400 mt-1 block">
            {assessment.waterFilmDepthMm} mm
          </span>
          <span className="text-[10px] text-[#8A9BA8]">Surface Standing Water</span>
        </div>

        {/* Metric 4: Braking Extension */}
        <div className="p-3.5 rounded-2xl bg-[#141F28] border border-[#243743] text-center">
          <span className="text-[10px] text-[#8A9BA8] font-bold uppercase block">Braking Distance</span>
          <span className="text-2xl font-black text-red-400 mt-1 block">
            +{assessment.brakingDistanceIncreasePercentage}%
          </span>
          <span className="text-[10px] text-red-400 font-semibold">Stopping Distance Lag</span>
        </div>
      </div>

      {/* Interactive Controls Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#121B22] border border-[#243743]">
        {/* Slider 1: Rain Intensity */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-[#8A9BA8] font-bold flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-blue-400" /> Rain Rate:
            </span>
            <span className="text-white font-black">{rainMm} mm/hr</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={rainMm}
            onChange={(e) => setRainMm(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer"
          />
        </div>

        {/* Slider 2: Vehicle Speed */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-[#8A9BA8] font-bold flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" /> Vehicle Speed:
            </span>
            <span className="text-white font-black">{speedKmh} km/h</span>
          </div>
          <input
            type="range"
            min="20"
            max="120"
            step="5"
            value={speedKmh}
            onChange={(e) => setSpeedKmh(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Advisory recommendations */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-white uppercase tracking-wider block">
          AI Preventive Driving Instructions:
        </span>
        <div className="space-y-1.5">
          {assessment.recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-2 text-xs p-2 rounded-xl bg-[#141F28] border border-[#243743]">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
              <span className="text-[#C5D1DC]">{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
