"use client";
import React, { useState, useEffect } from "react";
import {
  AlertOctagon,
  X,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Lock,
  HeartPulse,
  MapPin,
  Flame,
} from "lucide-react";
import { CrashDetectionPayload } from "@/types/emergency";
import { playVoiceAlert } from "@/lib/audioAlerts";

interface EmergencySosModalProps {
  onClose: () => void;
  simulatedGForce?: number;
  locationName?: string;
  coordinates?: [number, number];
}

export default function EmergencySosModal({
  onClose,
  simulatedGForce = 5.8,
  locationName = "Wardha Road near Chhatrapati Flyover Blackspot, Nagpur",
  coordinates = [21.1124, 79.0682],
}: EmergencySosModalProps) {
  const [countdown, setCountdown] = useState(15);
  const [isDispatched, setIsDispatched] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  useEffect(() => {
    playVoiceAlert("Warning: High impact deceleration detected. Emergency SOS initiated. 15 seconds to cancel.");
  }, []);

  useEffect(() => {
    if (isCancelled || isDispatched) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setIsDispatched(true);
      playVoiceAlert("Emergency SOS broadcast sent to emergency contacts and highway patrol with live GPS coordinates.");
    }
  }, [countdown, isCancelled, isDispatched]);

  const handleCancel = () => {
    setIsCancelled(true);
    playVoiceAlert("Emergency SOS cancelled. Driver confirmed safe.");
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleManualDispatchNow = () => {
    setCountdown(0);
    setIsDispatched(true);
  };

  // WhatsApp SOS generator
  const sosMessage = `🚨 EMERGENCY CRASH SOS ALERT 🚨%0A%0AHigh impact collision detected (${simulatedGForce}G).%0A%0ADriver: Gaurav%0ABlood Group: O+ve%0ALocation: ${encodeURIComponent(locationName)}%0AGPS Coordinates: ${coordinates[0]}, ${coordinates[1]}%0ALive Map Link: https://maps.google.com/?q=${coordinates[0]},${coordinates[1]}%0A%0APlease dispatch immediate ambulance/police assistance!`;

  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-200">
      <div className="bg-[#12181F] border-2 border-red-500 rounded-3xl max-w-lg w-full shadow-2xl p-5 sm:p-6 space-y-5 text-white relative overflow-hidden">
        {/* Top Warning Ribbon */}
        <div className="flex items-center justify-between pb-3 border-b border-red-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-red-600 text-white animate-bounce-short">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-red-400 font-black tracking-widest uppercase block">
                Impact Shock Detected &bull; {simulatedGForce}G
              </span>
              <h2 className="text-lg font-black tracking-tight">
                Emergency Crash Auto-SOS
              </h2>
            </div>
          </div>
          <span className="text-xs font-black bg-red-600/30 border border-red-500 text-red-400 px-2.5 py-1 rounded-full uppercase">
            Crash-Lock Active
          </span>
        </div>

        {isCancelled ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-black">SOS Cancelled — Driver Safe</h3>
            <p className="text-xs text-[#8A9BA8]">No emergency services dispatched.</p>
          </div>
        ) : !isDispatched ? (
          <div className="space-y-5">
            {/* 15-Second Countdown Graphic */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-red-950/40 border border-red-500/40 text-center">
              <span className="text-xs text-red-300 font-bold uppercase tracking-wider">
                Automatic Dispatch In
              </span>
              <span className="text-6xl font-black text-red-500 my-2 animate-pulse">
                {countdown}s
              </span>
              <p className="text-xs text-[#C5D1DC] max-w-xs">
                If you are unhurt, tap below to cancel before automatic GPS emergency broadcast.
              </p>
            </div>

            {/* Cancel Button */}
            <button
              onClick={handleCancel}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>I AM SAFE &bull; CANCEL SOS</span>
            </button>

            {/* Immediate Trigger Option */}
            <button
              onClick={handleManualDispatchNow}
              className="w-full py-2.5 rounded-xl bg-[#1E2730] hover:bg-[#2A3744] text-[#8A9BA8] hover:text-red-400 text-xs font-bold transition-colors"
            >
              Dispatch SOS Immediately (Skip Countdown)
            </button>
          </div>
        ) : (
          /* Dispatched State */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-black text-emerald-300">SOS Broadcast Sent!</h4>
                <p className="text-xs text-[#C5D1DC]">
                  GPS beacon, medical profile, and blackbox telemetry transmitted.
                </p>
              </div>
            </div>

            {/* Location & Medical payload summary */}
            <div className="p-3.5 rounded-2xl bg-[#17232C] border border-[#2B3B48] space-y-2 text-xs">
              <div className="flex items-center gap-2 text-white">
                <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span className="truncate">{locationName}</span>
              </div>
              <div className="flex items-center justify-between text-[#8A9BA8] pt-1.5 border-t border-[#243743]">
                <span className="flex items-center gap-1"><HeartPulse className="w-3.5 h-3.5 text-red-400" /> Blood Group: <strong className="text-white">O+ve</strong></span>
                <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-amber-400" /> Blackbox Secured</span>
              </div>
            </div>

            {/* Quick 1-Touch Hotlines */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#8A9BA8] uppercase tracking-wider block">
                1-Touch Emergency Direct Hotlines:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <a
                  href="tel:112"
                  className="p-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs text-center block shadow-lg"
                >
                  <Phone className="w-4 h-4 mx-auto mb-1" />
                  <span>112 All-India</span>
                </a>
                <a
                  href="tel:108"
                  className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs text-center block shadow-lg"
                >
                  <HeartPulse className="w-4 h-4 mx-auto mb-1" />
                  <span>108 Ambulance</span>
                </a>
                <a
                  href="tel:1033"
                  className="p-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs text-center block shadow-lg"
                >
                  <Flame className="w-4 h-4 mx-auto mb-1" />
                  <span>1033 NHAI</span>
                </a>
              </div>
            </div>

            {/* WhatsApp SOS link */}
            <a
              href={`https://wa.me/?text=${sosMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-black font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all block text-center"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Broadcast Live SOS on WhatsApp</span>
            </a>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[#17232B] hover:bg-[#20313C] text-[#8A9BA8] hover:text-white text-xs font-bold transition-colors"
            >
              Close Emergency Hub
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
