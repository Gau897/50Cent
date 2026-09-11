"use client";
import React from "react";
import { ThumbsUp, ThumbsDown, CheckCircle2, X, AlertTriangle, MapPin, Clock } from "lucide-react";
import { GhostHazard, HAZARD_META } from "@/types/ghostHazard";
import { ghostHazardStore } from "@/lib/ghostHazardStore";

interface GhostHazardOverlayProps {
  hazard: GhostHazard | null;
  onClose: () => void;
}

export default function GhostHazardOverlay({ hazard, onClose }: GhostHazardOverlayProps) {
  if (!hazard) return null;

  const meta = HAZARD_META[hazard.category];

  const handleVote = (type: 'up' | 'down') => {
    ghostHazardStore.vote(hazard.id, type);
  };

  const handleClear = () => {
    ghostHazardStore.markCleared(hazard.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#111A20] border border-[#243743] rounded-3xl max-w-md w-full shadow-2xl p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#1E2931]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider block">
                Community Ghost Hazard
              </span>
              <h3 className="text-base font-black text-white">{hazard.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#17232B] hover:bg-[#20313C] text-[#8A9BA8] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Location & Time */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2 text-[#C5D1DC]">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>{hazard.locationName}</span>
          </div>
          <div className="flex items-center gap-2 text-[#8A9BA8]">
            <Clock className="w-3.5 h-3.5" />
            <span>Reported {new Date(hazard.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} by {hazard.reportedBy}</span>
          </div>
        </div>

        {/* Description & Advice */}
        <div className="p-3.5 rounded-2xl bg-[#141F28] border border-[#243743] space-y-2 text-xs">
          <p className="text-white font-medium">{hazard.description}</p>
          <div className="pt-2 border-t border-[#243743] flex items-center justify-between text-[11px]">
            <span className="text-amber-400 font-bold">Action: {hazard.suggestedAction}</span>
            {hazard.recommendedSpeedCapKmh && (
              <span className="text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded">
                Cap: {hazard.recommendedSpeedCapKmh} km/h
              </span>
            )}
          </div>
        </div>

        {/* Verification / Voting Controls */}
        <div className="pt-2 border-t border-[#1E2931] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8A9BA8]">
            <span className="font-bold text-white">Is this hazard still there?</span>
            <span>{hazard.verifiedCount} drivers verified</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleVote('up')}
              className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                hazard.userVoted === 'up'
                  ? 'bg-emerald-600 border-emerald-400 text-white'
                  : 'bg-[#16222A] border-[#243743] text-emerald-400 hover:bg-[#1E2E38]'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Still There ({hazard.upvotes})</span>
            </button>

            <button
              onClick={() => handleVote('down')}
              className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                hazard.userVoted === 'down'
                  ? 'bg-red-600 border-red-400 text-white'
                  : 'bg-[#16222A] border-[#243743] text-red-400 hover:bg-[#1E2E38]'
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>Cleared / Gone ({hazard.downvotes})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
