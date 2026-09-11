"use client";
import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Filter,
  MapPin,
  Clock,
  ShieldAlert,
  Search,
  CheckCircle2,
} from "lucide-react";
import { GhostHazard, HazardCategory, HAZARD_META } from "@/types/ghostHazard";
import { ghostHazardStore } from "@/lib/ghostHazardStore";
import ReportHazardModal from "@/components/community/ReportHazardModal";
import GhostHazardOverlay from "@/components/community/GhostHazardOverlay";

export default function CommunityHazardsPage() {
  const [hazards, setHazards] = useState<GhostHazard[]>(ghostHazardStore.getHazards());
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [inspectedHazard, setInspectedHazard] = useState<GhostHazard | null>(null);

  useEffect(() => {
    const unsub = ghostHazardStore.subscribe(() => {
      setHazards([...ghostHazardStore.getHazards()]);
    });
    return () => unsub();
  }, []);

  const filteredHazards = hazards.filter((h) => {
    if (selectedFilter !== "all" && h.category !== selectedFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        h.title.toLowerCase().includes(q) ||
        h.locationName.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Community &quot;Ghost Hazard&quot; Crowdsourcing
              </h1>
              <p className="text-xs text-[#8A9BA8] mt-0.5">
                Real-time unmapped hazard radar verified by commuters and highway drivers
              </p>
            </div>
          </div>
        </div>

        {/* Report Button */}
        <button
          onClick={() => setShowReportModal(true)}
          className="px-4 py-3 rounded-2xl bg-[#E15A2B] hover:bg-[#D04F22] text-white text-xs font-bold shadow-lg shadow-[#E15A2B]/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Report New Hazard (1-Tap)</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8A9BA8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search potholes, oil spills, stray animals, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111A20] border border-[#243743] text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {['all', 'oil_spill', 'pothole', 'broken_vehicle', 'stray_animals', 'waterlogging'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-bold uppercase whitespace-nowrap transition-all ${
                selectedFilter === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#111A20] text-[#8A9BA8] hover:text-white border border-[#243743]'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Ghost Hazards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHazards.map((h) => {
          const meta = HAZARD_META[h.category];
          const isCritical = h.severity === 'critical';

          return (
            <div
              key={h.id}
              onClick={() => setInspectedHazard(h)}
              className="bg-[#111A20] border border-[#243743] hover:border-blue-500 rounded-2xl p-4 shadow-xl cursor-pointer transition-all hover:-translate-y-0.5 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      isCritical
                        ? 'bg-red-950 text-red-400 border border-red-500/40'
                        : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    {meta.label}
                  </span>

                  <span className="text-[10px] text-[#8A9BA8]">
                    {new Date(h.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-1">{h.title}</h3>

                <div className="flex items-center gap-1.5 text-xs text-[#8A9BA8]">
                  <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  <span className="truncate">{h.locationName}</span>
                </div>

                <p className="text-xs text-[#64748B] line-clamp-2">{h.description}</p>
              </div>

              {/* Action advice & votes */}
              <div className="pt-2 border-t border-[#1E2931] flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-semibold text-[11px] truncate">
                  {h.suggestedAction}
                </span>

                <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" /> {h.upvotes}
                  </span>
                  <span className="text-[11px] font-bold text-red-400 flex items-center gap-1">
                    <ThumbsDown className="w-3 h-3" /> {h.downvotes}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showReportModal && (
        <ReportHazardModal onClose={() => setShowReportModal(false)} />
      )}

      {inspectedHazard && (
        <GhostHazardOverlay
          hazard={inspectedHazard}
          onClose={() => setInspectedHazard(null)}
        />
      )}
    </div>
  );
}
