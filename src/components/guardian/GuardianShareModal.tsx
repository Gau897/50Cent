"use client";
import React, { useState } from "react";
import { ShieldCheck, Copy, Check, Share2, X, Users, Smartphone, MapPin } from "lucide-react";

interface GuardianShareModalProps {
  tripId?: string;
  driverName?: string;
  origin?: string;
  destination?: string;
  onClose: () => void;
}

export default function GuardianShareModal({
  tripId = "TRIP-NGP-9482",
  driverName = "Gaurav",
  origin = "MIHAN SEZ, Nagpur",
  destination = "Sitabuldi Metro, Nagpur",
  onClose,
}: GuardianShareModalProps) {
  const [copied, setCopied] = useState(false);
  const sharePin = "842-195";
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/app/guardian?trip=${tripId}&pin=${sharePin}` : `https://riskroute.app/app/guardian?trip=${tripId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#111A20] border border-[#243743] rounded-3xl max-w-md w-full shadow-2xl p-5 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1E2931]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Fleet & Family Guardian Mode
              </h3>
              <p className="text-xs text-[#8A9BA8]">
                Real-time trip telemetry & Safe Arrival assurance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#17232B] hover:bg-[#20313C] text-[#8A9BA8] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PIN Box */}
        <div className="p-4 rounded-2xl bg-[#141F28] border border-[#243743] text-center space-y-1">
          <span className="text-[10px] text-[#8A9BA8] font-bold uppercase tracking-wider block">
            Guardian Live Tracking PIN
          </span>
          <span className="text-3xl font-black text-emerald-400 tracking-widest block font-mono">
            {sharePin}
          </span>
          <span className="text-[10px] text-[#8A9BA8]">
            Share with family members or fleet manager to stream live safety status
          </span>
        </div>

        {/* Trip details preview */}
        <div className="p-3 rounded-xl bg-[#16222A] border border-[#243743] space-y-1.5 text-xs text-[#8A9BA8]">
          <div className="flex justify-between"><span>Driver:</span><span className="text-white font-bold">{driverName}</span></div>
          <div className="flex justify-between"><span>Origin:</span><span className="text-white">{origin}</span></div>
          <div className="flex justify-between"><span>Destination:</span><span className="text-white">{destination}</span></div>
          <div className="flex justify-between"><span>Geofence Safe Arrival:</span><span className="text-emerald-400 font-bold">Enabled</span></div>
        </div>

        {/* Copy Link button */}
        <div className="space-y-2">
          <button
            onClick={handleCopy}
            className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Tracking Link Copied!" : "Copy Live Guardian Link"}</span>
          </button>

          <a
            href={`/app/guardian?trip=${tripId}&pin=${sharePin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl bg-[#1E2E38] hover:bg-[#2A3E4D] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all block text-center"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Open Guardian Remote Dashboard</span>
          </a>
        </div>
      </div>
    </div>
  );
}
