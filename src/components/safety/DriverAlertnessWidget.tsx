"use client";
import React, { useState, useEffect } from "react";
import { Coffee, Moon, Zap, AlertTriangle, ShieldCheck } from "lucide-react";
import { calculateFatigueState } from "@/lib/fatiguePredictor";
import { DriverAlertnessState } from "@/types/fatigue";
import DriverFatigueModal from "./DriverFatigueModal";

interface DriverAlertnessWidgetProps {
  continuousDriveMinutes?: number;
  onTakeBreak?: () => void;
  className?: string;
}

export default function DriverAlertnessWidget({
  continuousDriveMinutes = 75,
  onTakeBreak,
  className = "",
}: DriverAlertnessWidgetProps) {
  const [driveTime, setDriveTime] = useState(continuousDriveMinutes);
  const [fatigueState, setFatigueState] = useState<DriverAlertnessState>(() =>
    calculateFatigueState(continuousDriveMinutes)
  );
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setFatigueState(calculateFatigueState(driveTime));
  }, [driveTime]);

  const getStatusColor = (level: string) => {
    if (level === 'optimal') return 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40';
    if (level === 'mild_drowsiness') return 'text-amber-400 bg-amber-950/80 border-amber-500/40';
    return 'text-red-400 bg-red-950/80 border-red-500/40';
  };

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className={`bg-[#0E151A] border border-[#1E2931] hover:border-[#3B82F6] rounded-2xl p-3.5 shadow-xl backdrop-blur-md cursor-pointer transition-all hover:scale-[1.01] ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-[#8A9BA8] font-bold block uppercase">
                Driver Alertness AI
              </span>
              <span className="text-xs font-black text-white">
                Alertness Score: {fatigueState.alertnessScore}%
              </span>
            </div>
          </div>

          <span
            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${getStatusColor(
              fatigueState.level
            )}`}
          >
            {fatigueState.level.replace('_', ' ')}
          </span>
        </div>

        {/* Meter progress bar */}
        <div className="mt-2.5 space-y-1">
          <div className="w-full h-2 rounded-full bg-[#17232B] overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                fatigueState.alertnessScore > 75
                  ? 'bg-emerald-500'
                  : fatigueState.alertnessScore > 50
                  ? 'bg-amber-500'
                  : 'bg-red-500 animate-pulse'
              }`}
              style={{ width: `${fatigueState.alertnessScore}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#8A9BA8]">
            <span>Continuous: {driveTime} min</span>
            <span className="text-white font-semibold flex items-center gap-1">
              <Coffee className="w-3 h-3 text-amber-400" />
              Rest In: {fatigueState.recommendedRestInMinutes} min
            </span>
          </div>
        </div>
      </div>

      {showModal && (
        <DriverFatigueModal
          driveMinutes={driveTime}
          onUpdateDriveMinutes={(m) => setDriveTime(m)}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
