"use client";
import React, { useState } from "react";
import { Settings, Volume2, Smartphone, Mic, Layers, ShieldCheck, Check } from "lucide-react";

export default function SettingsPage() {
  const [voiceAlerts, setVoiceAlerts] = useState(true);
  const [soundBeeps, setSoundBeeps] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [safetyBufferMeters, setSafetyBufferMeters] = useState("350");
  const [mapTheme, setMapTheme] = useState("dark");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-[#10B981]" />
          <span>Preferences & Telemetry Configuration</span>
        </h1>
        <p className="text-sm text-[#94A3B8] mt-1">
          Configure real-time audio warnings, hazard detection radii, and interface themes.
        </p>
      </div>

      <div className="bg-[#111A1F] border border-[#243742] rounded-3xl p-6 shadow-xl space-y-6">
        {/* Audio Alerts */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#94A3B8]">
            Warning & Proximity Alerts
          </h3>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#162229] border border-[#243742]">
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5 text-[#10B981]" />
              <div>
                <h4 className="text-sm font-bold text-white">Spoken Voice Advisories</h4>
                <p className="text-xs text-[#94A3B8]">Announce danger zones via hands-free text-to-speech</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={voiceAlerts}
              onChange={(e) => setVoiceAlerts(e.target.checked)}
              className="w-5 h-5 accent-[#10B981] rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#162229] border border-[#243742]">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-blue-400" />
              <div>
                <h4 className="text-sm font-bold text-white">Audible Sonar Beeps</h4>
                <p className="text-xs text-[#94A3B8]">Frequency modulated tone when entering high risk sectors</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={soundBeeps}
              onChange={(e) => setSoundBeeps(e.target.checked)}
              className="w-5 h-5 accent-[#10B981] rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#162229] border border-[#243742]">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-purple-400" />
              <div>
                <h4 className="text-sm font-bold text-white">Haptic Vibration Signals</h4>
                <p className="text-xs text-[#94A3B8]">Vibrate mobile devices when approaching hazard</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={vibration}
              onChange={(e) => setVibration(e.target.checked)}
              className="w-5 h-5 accent-[#10B981] rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Proximity Distance */}
        <div className="space-y-2 pt-4 border-t border-[#243742]">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#94A3B8]">
            Proximity Radar Buffer Distance
          </h3>
          <select
            value={safetyBufferMeters}
            onChange={(e) => setSafetyBufferMeters(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#162229] border border-[#243742] text-white text-sm focus:outline-none focus:border-[#10B981]"
          >
            <option value="200">200 meters (Urban Tight)</option>
            <option value="350">350 meters (Standard Balanced)</option>
            <option value="500">500 meters (Early Warning / Highway)</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm shadow-xl shadow-[#10B981]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {saved ? <Check className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
          <span>{saved ? "Preferences Saved" : "Save Preferences"}</span>
        </button>
      </div>
    </div>
  );
}
