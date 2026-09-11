"use client";
import React, { useState } from "react";
import {
  AlertTriangle,
  X,
  MapPin,
  Camera,
  ShieldCheck,
  CheckCircle2,
  Droplet,
  Car,
  PawPrint,
  Activity,
  CloudFog,
  Waves,
  Construction,
} from "lucide-react";
import { HazardCategory, HAZARD_META } from "@/types/ghostHazard";
import { ghostHazardStore } from "@/lib/ghostHazardStore";

interface ReportHazardModalProps {
  currentCoordinates?: [number, number];
  currentLocationName?: string;
  onClose: () => void;
  onHazardReported?: () => void;
}

export default function ReportHazardModal({
  currentCoordinates = [21.1124, 79.0682], // Chhatrapati Nagpur
  currentLocationName = "Wardha Road, near Chhatrapati Square, Nagpur",
  onClose,
  onHazardReported,
}: ReportHazardModalProps) {
  const [category, setCategory] = useState<HazardCategory>("oil_spill");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories: HazardCategory[] = [
    'pothole',
    'broken_vehicle',
    'oil_spill',
    'stray_animals',
    'unlit_speedbreaker',
    'dense_fog',
    'waterlogging',
    'road_debris',
  ];

  const getCategoryIcon = (cat: HazardCategory) => {
    switch (cat) {
      case 'oil_spill': return <Droplet className="w-4 h-4" />;
      case 'pothole': return <AlertTriangle className="w-4 h-4" />;
      case 'broken_vehicle': return <Car className="w-4 h-4" />;
      case 'stray_animals': return <PawPrint className="w-4 h-4" />;
      case 'unlit_speedbreaker': return <Activity className="w-4 h-4" />;
      case 'dense_fog': return <CloudFog className="w-4 h-4" />;
      case 'waterlogging': return <Waves className="w-4 h-4" />;
      case 'road_debris': return <Construction className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const meta = HAZARD_META[category];

    ghostHazardStore.addHazard({
      category,
      title: title || `${meta.label} Reported`,
      description: description || meta.defaultAdvice,
      coordinates: currentCoordinates,
      locationName: currentLocationName,
      severity,
      reportedBy: "Gaurav (Live Driver)",
      suggestedAction: meta.defaultAdvice,
      recommendedSpeedCapKmh: severity === 'critical' ? 25 : 35,
    });

    setIsSubmitted(true);
    if (onHazardReported) onHazardReported();
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#111A20] border border-[#243743] rounded-3xl max-w-lg w-full shadow-2xl p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1E2931]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Report Live &quot;Ghost Hazard&quot;
              </h3>
              <p className="text-[11px] text-[#8A9BA8]">
                Instant crowdsourced hazard warning for all incoming drivers
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

        {isSubmitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce-short" />
            <h4 className="text-base font-black text-white">Ghost Hazard Broadcasted!</h4>
            <p className="text-xs text-[#8A9BA8]">
              Live GPS beacon placed on map. Incoming drivers will receive audio proximity radar.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* GPS Location pill */}
            <div className="p-2.5 rounded-xl bg-[#16222A] border border-[#243743] flex items-center gap-2 text-xs">
              <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-[#C5D1DC] truncate font-medium">{currentLocationName}</span>
            </div>

            {/* Category Grid */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">
                Select Hazard Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {categories.map((cat) => {
                  const meta = HAZARD_META[cat];
                  const isSelected = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1E2E3B] border-blue-500 text-white font-bold'
                          : 'bg-[#141E26] border-[#243743] text-[#8A9BA8] hover:text-white'
                      }`}
                    >
                      <span className={isSelected ? 'text-blue-400' : 'text-[#8A9BA8]'}>
                        {getCategoryIcon(cat)}
                      </span>
                      <span className="truncate text-[11px]">{meta.label.split('/')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Severity selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">
                Threat Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['low', 'medium', 'high', 'critical'] as const).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`py-1.5 rounded-lg text-xs font-bold uppercase border transition-all ${
                      severity === sev
                        ? sev === 'critical'
                          ? 'bg-red-600 text-white border-red-400'
                          : sev === 'high'
                          ? 'bg-amber-600 text-white border-amber-400'
                          : 'bg-blue-600 text-white border-blue-400'
                        : 'bg-[#141E26] border-[#243743] text-[#8A9BA8]'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Title / Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">
                Quick Description / Note
              </label>
              <input
                type="text"
                placeholder={HAZARD_META[category].defaultAdvice}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#16222A] border border-[#243743] text-white text-xs font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#E15A2B] hover:bg-[#D04F22] text-white font-bold text-xs shadow-lg shadow-[#E15A2B]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Broadcast Ghost Hazard to Live Radar</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
