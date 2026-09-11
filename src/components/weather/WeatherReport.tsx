"use client";
import React from "react";
import { WeatherCondition } from "@/types/weather";
import { CloudRain, Wind, Eye, Droplets, Thermometer, AlertCircle, CheckCircle } from "lucide-react";

interface WeatherReportProps {
  weather: WeatherCondition | null;
  routeName?: string;
}

export default function WeatherReport({ weather, routeName }: WeatherReportProps) {
  if (!weather) return null;

  return (
    <div className="bg-[#111A1F] border border-[#243742] rounded-2xl p-4 sm:p-5 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CloudRain className="w-4 h-4 text-[#10B981]" />
          <h3 className="text-sm font-bold text-white">Environmental Conditions</h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#162229] border border-[#243742] text-[#94A3B8]">
          {weather.condition}
        </span>
      </div>

      {/* Warning Message Banner */}
      {weather.warningMessage && (
        <div
          className={`mb-3 p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
            weather.warningLevel === "severe"
              ? "bg-red-950/60 border-red-500/50 text-red-200"
              : weather.warningLevel === "moderate"
              ? "bg-amber-950/60 border-amber-500/50 text-amber-200"
              : "bg-emerald-950/60 border-emerald-500/50 text-emerald-200"
          }`}
        >
          {weather.warningLevel === "severe" || weather.warningLevel === "moderate" ? (
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
          ) : (
            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
          )}
          <p className="leading-relaxed font-medium">{weather.warningMessage}</p>
        </div>
      )}

      {/* Weather Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-2.5 rounded-xl bg-[#162229] border border-[#243742] flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-orange-400" />
          <div>
            <span className="text-[10px] text-[#64748B] block">Temperature</span>
            <span className="font-bold text-white">{weather.temperatureC}°C</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#162229] border border-[#243742] flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-400" />
          <div>
            <span className="text-[10px] text-[#64748B] block">Precipitation</span>
            <span className="font-bold text-white">{weather.precipitationPercent}%</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#162229] border border-[#243742] flex items-center gap-2">
          <Eye className="w-4 h-4 text-teal-400" />
          <div>
            <span className="text-[10px] text-[#64748B] block">Visibility</span>
            <span className="font-bold text-white">{weather.visibilityKm} km</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#162229] border border-[#243742] flex items-center gap-2">
          <Wind className="w-4 h-4 text-purple-400" />
          <div>
            <span className="text-[10px] text-[#64748B] block">Wind Speed</span>
            <span className="font-bold text-white">{weather.windSpeedKmh} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
}
