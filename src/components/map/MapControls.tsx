"use client";
import React from "react";
import { Locate, Layers, Shield, Eye } from "lucide-react";

interface MapControlsProps {
  followUser: boolean;
  onToggleFollow: () => void;
  mapTheme: "dark" | "standard" | "satellite";
  onChangeTheme: (theme: "dark" | "standard" | "satellite") => void;
  showRiskZones: boolean;
  onToggleRiskZones: () => void;
  showAccidents: boolean;
  onToggleAccidents: () => void;
}

export default function MapControls({
  followUser,
  onToggleFollow,
  mapTheme,
  onChangeTheme,
  showRiskZones,
  onToggleRiskZones,
  showAccidents,
  onToggleAccidents,
}: MapControlsProps) {
  const toggleTheme = () => {
    if (mapTheme === "dark") onChangeTheme("standard");
    else if (mapTheme === "standard") onChangeTheme("satellite");
    else onChangeTheme("dark");
  };

  return (
    <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
      <button
        onClick={onToggleFollow}
        title="Re-center on user location"
        className={`p-2.5 rounded-xl border backdrop-blur-md shadow-xl transition-all ${
          followUser
            ? "bg-[#10B981] text-white border-emerald-400 shadow-[#10B981]/30"
            : "bg-[#111A1F]/90 text-[#94A3B8] hover:text-white border-[#243742] hover:bg-[#162229]"
        }`}
      >
        <Locate className="w-5 h-5" />
      </button>

      <button
        onClick={toggleTheme}
        title={`Current theme: ${mapTheme}. Click to switch.`}
        className="p-2.5 rounded-xl bg-[#111A1F]/90 text-[#94A3B8] hover:text-white border border-[#243742] hover:bg-[#162229] backdrop-blur-md shadow-xl transition-all"
      >
        <Layers className="w-5 h-5" />
      </button>

      <button
        onClick={onToggleRiskZones}
        title="Toggle Risk Zones Overlay"
        className={`p-2.5 rounded-xl border backdrop-blur-md shadow-xl transition-all ${
          showRiskZones
            ? "bg-rose-950/80 text-rose-300 border-rose-600/60"
            : "bg-[#111A1F]/90 text-[#94A3B8] hover:text-white border-[#243742] hover:bg-[#162229]"
        }`}
      >
        <Shield className="w-5 h-5" />
      </button>

      <button
        onClick={onToggleAccidents}
        title="Toggle Historical Accident Markers"
        className={`p-2.5 rounded-xl border backdrop-blur-md shadow-xl transition-all ${
          showAccidents
            ? "bg-amber-950/80 text-amber-300 border-amber-600/60"
            : "bg-[#111A1F]/90 text-[#94A3B8] hover:text-white border-[#243742] hover:bg-[#162229]"
        }`}
      >
        <Eye className="w-5 h-5" />
      </button>
    </div>
  );
}
