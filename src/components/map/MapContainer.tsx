"use client";
import React from "react";
import dynamic from "next/dynamic";
import { Route, Coordinates } from "@/types/route";
import { RiskZone } from "@/types/riskZone";
import { Accident } from "@/types/accident";
import { GhostHazard } from "@/types/ghostHazard";
import { RouteTimelineHazard } from "@/components/route/VisualRouteSegmentStrip";

export interface MapContainerProps {
  routes?: Route[];
  selectedRouteId?: string;
  onSelectRoute?: (id: string) => void;
  riskZones?: RiskZone[];
  accidents?: Accident[];
  ghostHazards?: GhostHazard[];
  timelineHazards?: RouteTimelineHazard[];
  userLocation?: Coordinates;
  userHeading?: number;
  showRiskZones?: boolean;
  showAccidents?: boolean;
  showGhostHazards?: boolean;
  onSelectZone?: (zone: RiskZone) => void;
  onSelectAccident?: (accident: Accident) => void;
  onSelectGhostHazard?: (hazard: GhostHazard) => void;
  followUser?: boolean;
  mapTheme?: "satellite" | "standard" | "dark";
  className?: string;
  showFloatingRouteBadges?: boolean;
}

const LeafletMapCore = dynamic(() => import("./LeafletMapCore"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center bg-[#0B1115] border border-[#1E2931] rounded-2xl relative overflow-hidden w-full h-full min-h-[400px]">
      <div className="flex flex-col items-center gap-3 text-[#8A9BA8]">
        <div className="w-10 h-10 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold tracking-wider uppercase">Loading Satellite Canvas...</span>
      </div>
    </div>
  ),
});

export default function MapContainer(props: MapContainerProps) {
  return <LeafletMapCore {...props} />;
}
