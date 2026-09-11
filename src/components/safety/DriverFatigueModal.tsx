"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Moon,
  Coffee,
  X,
  Clock,
  Zap,
  MapPin,
  Volume2,
  AlertTriangle,
  CheckCircle2,
  Play,
  RotateCcw,
} from "lucide-react";
import { calculateFatigueState, MOCK_REST_STOPS } from "@/lib/fatiguePredictor";
import { RestStop } from "@/types/fatigue";
import { playVoiceAlert } from "@/lib/audioAlerts";

interface DriverFatigueModalProps {
  driveMinutes: number;
  onUpdateDriveMinutes?: (minutes: number) => void;
  onClose: () => void;
}

export default function DriverFatigueModal({
  driveMinutes,
  onUpdateDriveMinutes,
  onClose,
}: DriverFatigueModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'reaction_test' | 'rest_stops'>('overview');
  const [currentMinutes, setCurrentMinutes] = useState(driveMinutes);
  const [reactionTimeMs, setReactionTimeMs] = useState<number | null>(null);

  // Reaction Test States
  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'ready' | 'finished'>('idle');
  const [testStartTime, setTestStartTime] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fatigueState = calculateFatigueState(currentMinutes, undefined, reactionTimeMs);

  const startReactionTest = () => {
    setGameState('waiting');
    const delay = Math.floor(Math.random() * 2500) + 1500; // 1.5 - 4 seconds delay
    timerRef.current = setTimeout(() => {
      setGameState('ready');
      setTestStartTime(Date.now());
    }, delay);
  };

  const handleTestTap = () => {
    if (gameState === 'waiting') {
      if (timerRef.current) clearTimeout(timerRef.current);
      setGameState('idle');
      alert('Too early! Wait for the signal to turn GREEN.');
    } else if (gameState === 'ready') {
      const elapsed = Date.now() - testStartTime;
      setReactionTimeMs(elapsed);
      setGameState('finished');
    }
  };

  const triggerVoiceWarning = () => {
    playVoiceAlert(`Driver alertness alert. ${fatigueState.suggestedAction}`);
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#111A20] border border-[#243743] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-5 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1E2931]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>Fatigue & Sleep-Deprivation AI</span>
                <span className="text-xs bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded-full">
                  Circadian Radar
                </span>
              </h2>
              <p className="text-xs text-[#8A9BA8]">
                Real-time driver vigilance modeling & micro-sleep prevention system
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#17232B] hover:bg-[#20313C] text-[#8A9BA8] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-[#0D1419] p-1 rounded-xl border border-[#1E2931] text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-[#1E2E3B] text-white shadow-md'
                : 'text-[#8A9BA8] hover:text-white'
            }`}
          >
            Vigilance Status
          </button>
          <button
            onClick={() => setActiveTab('reaction_test')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'reaction_test'
                ? 'bg-[#1E2E3B] text-white shadow-md'
                : 'text-[#8A9BA8] hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Reflex Reaction Test</span>
          </button>
          <button
            onClick={() => setActiveTab('rest_stops')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'rest_stops'
                ? 'bg-[#1E2E3B] text-white shadow-md'
                : 'text-[#8A9BA8] hover:text-white'
            }`}
          >
            <Coffee className="w-3.5 h-3.5 text-emerald-400" />
            <span>Safe Rest Stops ({MOCK_REST_STOPS.length})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Score Metric Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-[#16222A] border border-[#243743] text-center">
                <span className="text-[10px] text-[#8A9BA8] font-bold block uppercase">
                  Alertness Index
                </span>
                <span
                  className={`text-3xl font-black mt-1 block ${
                    fatigueState.alertnessScore > 75
                      ? 'text-emerald-400'
                      : fatigueState.alertnessScore > 50
                      ? 'text-amber-400'
                      : 'text-red-400 animate-pulse'
                  }`}
                >
                  {fatigueState.alertnessScore}%
                </span>
                <span className="text-[10px] font-bold uppercase text-[#8A9BA8]">
                  {fatigueState.level.replace('_', ' ')}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#16222A] border border-[#243743] text-center">
                <span className="text-[10px] text-[#8A9BA8] font-bold block uppercase">
                  Drive Duration
                </span>
                <span className="text-3xl font-black text-white mt-1 block">
                  {currentMinutes}m
                </span>
                <span className="text-[10px] font-bold text-amber-400">
                  Continuous Wheel Time
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#16222A] border border-[#243743] text-center">
                <span className="text-[10px] text-[#8A9BA8] font-bold block uppercase">
                  Circadian Risk Multiplier
                </span>
                <span className="text-3xl font-black text-indigo-400 mt-1 block">
                  {fatigueState.timeOfDayRiskMultiplier}x
                </span>
                <span className="text-[10px] font-bold text-[#8A9BA8]">
                  Time-of-day Weight
                </span>
              </div>
            </div>

            {/* Simulated Drive Duration Slider */}
            <div className="p-4 rounded-2xl bg-[#141E26] border border-[#243743] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8A9BA8] font-bold">Simulate Drive Duration:</span>
                <span className="text-white font-black">{currentMinutes} minutes ({Math.floor(currentMinutes / 60)}h {currentMinutes % 60}m)</span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={currentMinutes}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCurrentMinutes(val);
                  if (onUpdateDriveMinutes) onUpdateDriveMinutes(val);
                }}
                className="w-full accent-[#3B82F6] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#8A9BA8]">
                <span>10 min (Fresh)</span>
                <span>120 min (Recommended Break)</span>
                <span>300 min (Severe Exhaustion)</span>
              </div>
            </div>

            {/* Circadian Rhythm Insight */}
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
                <Clock className="w-4 h-4" />
                <span>Circadian Sleep-Wake Cycle Analysis</span>
              </div>
              <p className="text-[#C5D1DC] text-[11px] leading-relaxed">
                {fatigueState.circadianRiskDescription}
              </p>
            </div>

            {/* Action advice */}
            <div className="p-3.5 rounded-2xl bg-[#16222A] border border-[#243743] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-[#8A9BA8] font-bold uppercase block">
                    AI Safety Recommendation
                  </span>
                  <p className="text-xs font-bold text-white">{fatigueState.suggestedAction}</p>
                </div>
              </div>

              <button
                onClick={triggerVoiceWarning}
                className="px-3 py-2 rounded-xl bg-[#1E2E38] hover:bg-[#2A3E4D] text-[#8A9BA8] hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Play Audio Voice Alert"
              >
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>Audio Alert</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: REACTION TEST */}
        {activeTab === 'reaction_test' && (
          <div className="space-y-4 text-center">
            <p className="text-xs text-[#8A9BA8]">
              Test your cognitive reaction speed. When the circle turns <strong className="text-emerald-400">GREEN</strong>, tap it as fast as you can.
            </p>

            <div
              onClick={handleTestTap}
              className={`h-52 rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all border-4 select-none ${
                gameState === 'idle'
                  ? 'bg-[#16222A] border-[#243743] hover:border-blue-500'
                  : gameState === 'waiting'
                  ? 'bg-red-950/80 border-red-500 animate-pulse'
                  : gameState === 'ready'
                  ? 'bg-emerald-600 border-white ring-8 ring-emerald-400/50'
                  : 'bg-[#141E26] border-emerald-500'
              }`}
            >
              {gameState === 'idle' && (
                <div className="space-y-2">
                  <Play className="w-12 h-12 text-blue-400 mx-auto" />
                  <span className="text-sm font-black text-white block">TAP TO START TEST</span>
                </div>
              )}

              {gameState === 'waiting' && (
                <div className="space-y-1">
                  <span className="text-xl font-black text-white">WAIT FOR GREEN...</span>
                  <span className="text-xs text-red-300 block">Do not tap yet</span>
                </div>
              )}

              {gameState === 'ready' && (
                <div className="space-y-1">
                  <span className="text-2xl font-black text-white tracking-wider">TAP NOW!</span>
                </div>
              )}

              {gameState === 'finished' && reactionTimeMs && (
                <div className="space-y-1">
                  <span className="text-xs text-[#8A9BA8] font-bold block uppercase">Reaction Time</span>
                  <span className="text-4xl font-black text-emerald-400 block">{reactionTimeMs} ms</span>
                  <span className="text-xs font-bold text-white block">
                    {reactionTimeMs < 350
                      ? '⚡ Razor Sharp Alertness!'
                      : reactionTimeMs < 480
                      ? '✓ Normal Reflex Speed'
                      : '⚠ Slow Reflexes - Break Strongly Recommended'}
                  </span>
                </div>
              )}
            </div>

            {gameState === 'idle' && (
              <button
                onClick={startReactionTest}
                className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-lg transition-all"
              >
                Begin 5-Second Alertness Assessment
              </button>
            )}

            {gameState === 'finished' && (
              <button
                onClick={() => {
                  setGameState('idle');
                  setReactionTimeMs(null);
                }}
                className="w-full py-2.5 rounded-xl bg-[#1E2E38] hover:bg-[#2A3E4D] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retest Reflexes</span>
              </button>
            )}
          </div>
        )}

        {/* TAB 3: REST STOPS */}
        {activeTab === 'rest_stops' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#8A9BA8]">
              <span>Verified 24/7 Rest Havens near your corridor</span>
              <span className="text-emerald-400 font-bold">Nagpur NH-44 Sector</span>
            </div>

            <div className="space-y-3">
              {MOCK_REST_STOPS.map((stop) => (
                <div
                  key={stop.id}
                  className="p-4 rounded-2xl bg-[#16222A] border border-[#243743] hover:border-[#10B981] transition-all space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-white">{stop.name}</h4>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                          {stop.open24x7 ? '24x7 Open' : 'Open'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#8A9BA8] mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-red-400" />
                        <span>{stop.address}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-white">{stop.distanceKm} km</span>
                      <span className="text-[10px] text-[#8A9BA8] block">~{stop.driveTimeMinutes} min drive</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {stop.amenities.map((amenity, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold text-[#8A9BA8] bg-[#0E151A] px-2 py-0.5 rounded-md border border-[#1E2931]"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  {/* Navigate CTA */}
                  <button
                    onClick={() => {
                      alert(`Route diverted to ${stop.name}. Navigating via safest access link.`);
                      onClose();
                    }}
                    className="w-full py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold shadow-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Divert Route to this Rest Haven</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
