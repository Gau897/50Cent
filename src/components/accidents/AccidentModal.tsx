"use client";
import React from "react";
import { Accident } from "@/types/accident";
import { X, Calendar, MapPin, AlertTriangle, ShieldCheck, Car } from "lucide-react";

interface AccidentModalProps {
  accident: Accident | null;
  onClose: () => void;
}

export default function AccidentModal({ accident, onClose }: AccidentModalProps) {
  if (!accident) return null;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#111A1F] border border-[#243742] rounded-3xl overflow-hidden shadow-2xl">
        {/* Modal Header Image */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-black">
          <img src={accident.imageUrl} alt={accident.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111A1F] via-transparent to-black/40" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Severity Badge */}
          <span
            className={`absolute top-4 left-4 text-xs font-black uppercase px-3 py-1 rounded-full shadow-lg ${
              accident.severity === "severe" || accident.severity === "fatal"
                ? "bg-red-600 text-white"
                : "bg-amber-600 text-white"
            }`}
          >
            {accident.severity} incident
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <h3 className="text-lg font-black text-white">{accident.title}</h3>
            <div className="flex items-center gap-2 text-xs text-[#94A3B8] mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
              <span>{accident.locationName}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed bg-[#162229] p-3 rounded-xl border border-[#243742]">
            {accident.description}
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#162229] border border-[#243742]">
              <span className="text-[10px] text-[#64748B] block font-semibold">Incident Date</span>
              <span className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#10B981]" />
                {accident.formattedDate}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#162229] border border-[#243742]">
              <span className="text-[10px] text-[#64748B] block font-semibold">Vehicles Involved</span>
              <span className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                <Car className="w-3.5 h-3.5 text-blue-400" />
                {accident.vehiclesInvolved} Units
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-600/40 text-xs">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
              Root Cause Investigation
            </span>
            <p className="text-amber-200 font-medium">{accident.cause}</p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-[#162229] hover:bg-[#243742] border border-[#243742] text-white font-bold text-xs transition-colors"
          >
            Close Incident Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
