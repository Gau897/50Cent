"use client";
import React from "react";
import { Play, Pause, Volume2, VolumeX, Smartphone, RotateCcw, StopCircle } from "lucide-react";

interface NavigationControlsProps {
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onResetSimulation: () => void;
  onEndNavigation: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  vibrationEnabled: boolean;
  onToggleVibration: () => void;
}

export default function NavigationControls({
  isSimulating,
  onToggleSimulation,
  onResetSimulation,
  onEndNavigation,
  soundEnabled,
  onToggleSound,
  voiceEnabled,
  onToggleVoice,
  vibrationEnabled,
  onToggleVibration,
}: NavigationControlsProps) {
  return (
    <div className="absolute bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto z-[450]">
      <div className="bg-[#111A1F]/95 backdrop-blur-xl border border-[#243742] rounded-2xl p-3 shadow-2xl flex items-center justify-center gap-2 sm:gap-3">
        {/* Play/Pause Simulator */}
        <button
          onClick={onToggleSimulation}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all ${
            isSimulating
              ? "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/30"
              : "bg-[#10B981] hover:bg-[#059669] text-white shadow-[#10B981]/30"
          }`}
        >
          {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isSimulating ? "Pause Simulator" : "Simulate Drive"}</span>
        </button>

        {/* Restart Simulator */}
        <button
          onClick={onResetSimulation}
          className="p-2.5 rounded-xl bg-[#162229] hover:bg-[#243742] border border-[#243742] text-[#94A3B8] hover:text-white transition-colors"
          title="Restart Route Simulation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Audio Toggle */}
        <button
          onClick={onToggleSound}
          className={`p-2.5 rounded-xl border transition-colors ${
            soundEnabled
              ? "bg-emerald-950/80 text-emerald-300 border-emerald-600/60"
              : "bg-[#162229] text-[#64748B] border-[#243742]"
          }`}
          title={soundEnabled ? "Sound Alerts: ON" : "Sound Alerts: OFF"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Vibrate Toggle */}
        <button
          onClick={onToggleVibration}
          className={`p-2.5 rounded-xl border transition-colors ${
            vibrationEnabled
              ? "bg-emerald-950/80 text-emerald-300 border-emerald-600/60"
              : "bg-[#162229] text-[#64748B] border-[#243742]"
          }`}
          title={vibrationEnabled ? "Haptic Vibration: ON" : "Haptic Vibration: OFF"}
        >
          <Smartphone className="w-4 h-4" />
        </button>

        {/* End Route */}
        <button
          onClick={onEndNavigation}
          className="px-4 py-2.5 rounded-xl bg-red-600/90 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-red-600/30 transition-all"
        >
          <StopCircle className="w-4 h-4" />
          <span>Exit Nav</span>
        </button>
      </div>
    </div>
  );
}
