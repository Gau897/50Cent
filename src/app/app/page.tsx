"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MapContainer from "@/components/map/MapContainer";
import HighRiskZonePanel from "@/components/accidents/HighRiskZonePanel";
import AccidentModal from "@/components/accidents/AccidentModal";
import VehicleSelector from "@/components/vehicle/VehicleSelector";
import VisualRouteSegmentStrip from "@/components/route/VisualRouteSegmentStrip";
import ActionRecommendationsCard from "@/components/safety/ActionRecommendationsCard";
import MicroWeatherRadar from "@/components/weather/MicroWeatherRadar";
import ReportHazardModal from "@/components/community/ReportHazardModal";
import GhostHazardOverlay from "@/components/community/GhostHazardOverlay";
import { mockRoutes } from "@/mock/mockRoutes";
import { mockRiskZones } from "@/mock/mockRiskZones";
import { mockAccidents } from "@/mock/mockAccidents";
import { ghostHazardStore } from "@/lib/ghostHazardStore";
import { calculateVehicleRisk } from "@/lib/vehicleRiskEngine";
import { apiClient } from "@/services/api";
import { Route } from "@/types/route";
import { RiskZone } from "@/types/riskZone";
import { Accident } from "@/types/accident";
import { VehicleType } from "@/types/vehicle";
import { GhostHazard } from "@/types/ghostHazard";
import {
  Crosshair,
  ArrowUpDown,
  CloudSun,
  CloudRain,
  ShieldCheck,
  CheckCircle2,
  RotateCw,
  Layers,
  ArrowRight,
  ShieldAlert,
  Waves,
  Plus,
} from "lucide-react";

export default function RoutePlannerPage() {
  const router = useRouter();
  const [fromLocation, setFromLocation] = useState("MIHAN, Nagpur");
  const [toLocation, setToLocation] = useState("Sitabuldi, Nagpur");
  const [selectedRouteId, setSelectedRouteId] = useState("route-2"); // Default to Safest
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>("car");
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  const [isLoading, setIsLoading] = useState(false);
  const [mapTheme, setMapTheme] = useState<"satellite" | "standard" | "dark">("satellite");

  const [ghostHazards, setGhostHazards] = useState<GhostHazard[]>(ghostHazardStore.getActiveHazards());
  const [inspectedZone, setInspectedZone] = useState<RiskZone | null>(null);
  const [inspectedAccident, setInspectedAccident] = useState<Accident | null>(null);
  const [inspectedGhostHazard, setInspectedGhostHazard] = useState<GhostHazard | null>(null);
  const [showWeatherRadar, setShowWeatherRadar] = useState(false);
  const [showReportHazardModal, setShowReportHazardModal] = useState(false);

  useEffect(() => {
    const unsub = ghostHazardStore.subscribe(() => {
      setGhostHazards([...ghostHazardStore.getActiveHazards()]);
    });
    return () => unsub();
  }, []);

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[1] || routes[0];
  const vehicleAdjusted = calculateVehicleRisk(selectedRoute, selectedVehicle, 12);

  const handleShowRoutes = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.getRoutes(fromLocation, toLocation);
      if (res && res.length > 0) {
        setRoutes(res);
        const safest = res.find((r) => r.isRecommended) || res[1] || res[0];
        setSelectedRouteId(safest.id);
      }
    } catch {
      setRoutes(mockRoutes);
      setSelectedRouteId("route-2");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwap = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const handleOpenRouteNavigation = (routeId: string) => {
    router.push(
      `/app/navigation?routeId=${routeId}&vehicle=${selectedVehicle}&from=${encodeURIComponent(
        fromLocation
      )}&to=${encodeURIComponent(toLocation)}`
    );
  };

  const nagpurPresets = [
    { from: "MIHAN, Nagpur", to: "Sitabuldi, Nagpur" },
    { from: "Dharampeth, Nagpur", to: "Pardi, Nagpur" },
    { from: "Wadi Naka, Nagpur", to: "Kamptee, Nagpur" },
  ];

  return (
    <div className="flex-1 bg-[#0B1115] text-slate-100 p-3 sm:p-5 lg:p-6 max-w-[1600px] mx-auto w-full space-y-4">
      {/* TOP BAR: QUICK SHORTCUTS & RADAR STATUS */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-[#111A20] border border-[#1E2931]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#8A9BA8]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-bold">Preventive Road Safety Hub</span>
          </div>
          <span className="text-[#243743]">|</span>
          <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            {ghostHazards.length} Ghost Hazards Active
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowWeatherRadar(!showWeatherRadar)}
            className="px-3 py-1.5 rounded-xl bg-blue-950/60 border border-blue-500/40 text-blue-300 text-xs font-bold hover:bg-blue-900/60 transition-all flex items-center gap-1.5"
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Aquaplaning AI</span>
          </button>

          <button
            onClick={() => setShowReportHazardModal(true)}
            className="px-3 py-1.5 rounded-xl bg-[#E15A2B] hover:bg-[#D04F22] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-[#E15A2B]/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Report Hazard</span>
          </button>
        </div>
      </div>

      {/* TOP ROW: MAP + ROUTE SEARCH & OPTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* MAP CONTAINER (8 Columns) */}
        <div className="lg:col-span-8 bg-[#111A20] border border-[#1E2931] rounded-2xl overflow-hidden h-[480px] sm:h-[540px] lg:h-[580px] relative shadow-2xl">
          <MapContainer
            routes={routes}
            selectedRouteId={selectedRouteId}
            onSelectRoute={(id) => setSelectedRouteId(id)}
            riskZones={mockRiskZones}
            accidents={mockAccidents}
            ghostHazards={ghostHazards}
            onSelectZone={(z) => setInspectedZone(z)}
            onSelectAccident={(a) => setInspectedAccident(a)}
            onSelectGhostHazard={(g) => setInspectedGhostHazard(g)}
            mapTheme={mapTheme}
            className="w-full h-full"
            showFloatingRouteBadges={true}
          />

          {/* Top-Right Map Controls */}
          <div className="absolute top-3 right-3 z-[400] flex gap-2">
            <button
              onClick={() => setMapTheme(mapTheme === "satellite" ? "standard" : "satellite")}
              className="px-3 py-1.5 rounded-lg bg-[#111A20]/90 border border-[#2B3B47] text-white text-xs font-bold hover:bg-[#1A2630] backdrop-blur-md shadow-lg flex items-center gap-1.5 transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-[#10B981]" />
              <span>{mapTheme === "satellite" ? "Satellite" : "Standard Map"}</span>
            </button>
          </div>

          {/* Bottom-Left Route Legend Overlay */}
          <div className="absolute bottom-3 left-3 z-[400] bg-[#0E151A]/90 border border-[#1E2931] rounded-xl p-3 backdrop-blur-md shadow-xl text-xs space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 rounded-full bg-[#22C55E]" />
              <span className="text-[#C5D1DC] font-semibold text-[11px]">Route 1 (Fastest)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 rounded-full bg-[#3B82F6]" />
              <span className="text-[#C5D1DC] font-semibold text-[11px]">Route 2 (Safest)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 rounded-full bg-[#F97316]" />
              <span className="text-[#C5D1DC] font-semibold text-[11px]">Route 3 (Alternative)</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-[#243743]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-orange-300 font-bold text-[10px]">Ghost Hazards Active</span>
            </div>
          </div>

          {/* High Risk Zone Inspector & Modals */}
          <HighRiskZonePanel zone={inspectedZone} accidents={mockAccidents} onClose={() => setInspectedZone(null)} />
          <AccidentModal accident={inspectedAccident} onClose={() => setInspectedAccident(null)} />
          <GhostHazardOverlay hazard={inspectedGhostHazard} onClose={() => setInspectedGhostHazard(null)} />
        </div>

        {/* RIGHT SIDEBAR (4 Columns): Find Route + Vehicle Selector + Route Options */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* FIND YOUR ROUTE BOX */}
          <div className="bg-[#111A20] border border-[#1E2931] rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Find Your Route (Nagpur Corridors)</h3>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/50">
                Live Geocoding Active
              </span>
            </div>

            <div className="space-y-2 relative">
              {/* From input */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  placeholder="Starting Point (e.g. MIHAN, Nagpur)"
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-[#17232B] border border-[#243743] text-white text-xs font-semibold focus:outline-none focus:border-[#E15A2B] transition-colors"
                />
                <button
                  onClick={() => setFromLocation("MIHAN, Nagpur")}
                  className="absolute right-2.5 text-[#8A9BA8] hover:text-white"
                  title="Nagpur Origin"
                >
                  <Crosshair className="w-4 h-4" />
                </button>
              </div>

              {/* Swap Button */}
              <div className="flex justify-end -my-1 pr-2">
                <button
                  onClick={handleSwap}
                  className="p-1 rounded bg-[#17232B] border border-[#243743] text-[#8A9BA8] hover:text-white"
                  title="Swap locations"
                >
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </div>

              {/* To input */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  placeholder="Destination (e.g. Sitabuldi, Nagpur)"
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-[#17232B] border border-[#243743] text-white text-xs font-semibold focus:outline-none focus:border-[#E15A2B] transition-colors"
                />
                <button
                  onClick={() => setToLocation("Sitabuldi, Nagpur")}
                  className="absolute right-2.5 text-[#8A9BA8] hover:text-white"
                  title="Nagpur Destination"
                >
                  <Crosshair className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {nagpurPresets.map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setFromLocation(p.from);
                    setToLocation(p.to);
                  }}
                  className="text-[10px] px-2 py-1 rounded-lg bg-[#141E24] hover:bg-[#1C2B33] text-[#8A9BA8] hover:text-white border border-[#243743] transition-colors"
                >
                  {p.from.split(',')[0]} → {p.to.split(',')[0]}
                </button>
              ))}
            </div>

            {/* Vehicle Profile Selector */}
            <VehicleSelector
              selectedVehicle={selectedVehicle}
              onSelectVehicle={(v) => setSelectedVehicle(v)}
            />

            {/* Big Orange Button: Show Routes */}
            <button
              onClick={handleShowRoutes}
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#E15A2B] hover:bg-[#D04F22] text-white font-bold text-xs shadow-lg shadow-[#E15A2B]/20 transition-all cursor-pointer"
            >
              {isLoading ? "Calculating Live Nagpur Corridors..." : "Recalculate Routes & Dynamic Risk"}
            </button>
          </div>

          {/* ROUTE OPTIONS BOX */}
          <div className="bg-[#111A20] border border-[#1E2931] rounded-2xl p-4 sm:p-5 shadow-xl space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Route Options</h3>
              <span className="text-[10px] text-[#8A9BA8]">Click route to inspect</span>
            </div>

            <div className="space-y-2.5">
              {routes.map((r) => {
                const isSelected = r.id === selectedRouteId;
                const isSafest = r.isRecommended || r.type === "safest";
                const adj = calculateVehicleRisk(r, selectedVehicle, 12);

                return (
                  <div
                    key={r.id}
                    onClick={() => {
                      setSelectedRouteId(r.id);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? isSafest
                          ? "bg-[#17232B] border-[#3B82F6] ring-1 ring-[#3B82F6] shadow-lg shadow-blue-500/10"
                          : r.type === "fastest"
                          ? "bg-[#17232B] border-[#22C55E] ring-1 ring-[#22C55E]"
                          : "bg-[#17232B] border-[#F97316] ring-1 ring-[#F97316]"
                        : "bg-[#141E24] border-[#243743] hover:border-[#334D5D]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{r.name}</span>
                        {isSafest && (
                          <span className="text-[10px] font-bold text-white bg-[#2563EB] px-2 py-0.5 rounded-md">
                            Recommended
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-white">{r.durationMinutes} min</span>
                    </div>

                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[11px] text-[#8A9BA8]">
                        {r.distanceKm} km &bull; {adj.adjustedRiskScore <= 25 ? "Low Risk" : "Medium Risk"}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          isSafest
                            ? "text-[#3B82F6] bg-[#3B82F6]/10"
                            : r.type === "fastest"
                            ? "text-[#22C55E] bg-[#22C55E]/10"
                            : "text-[#F97316] bg-[#F97316]/10"
                        }`}
                      >
                        {adj.adjustedRiskScore}% Risk
                      </span>
                    </div>

                    {isSelected && (
                      <div className="mt-2.5 pt-2 border-t border-[#243743] flex items-center justify-between">
                        <span className="text-[10px] text-emerald-400 font-semibold">{adj.safetyScore}% Safety Index</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenRouteNavigation(r.id);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E15A2B] hover:text-[#FF7D52]"
                        >
                          <span>Open Live Nav</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Launch Live Nav Link */}
            <div className="pt-2">
              <button
                onClick={() => handleOpenRouteNavigation(selectedRouteId)}
                className="w-full py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs shadow-lg shadow-[#10B981]/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Start Live Navigation & Hazard Radar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* GAP ANALYSIS DELIVERABLE: SCREEN 3 - VISUAL ROUTE SEGMENTATION STRIP */}
      <VisualRouteSegmentStrip
        totalDistanceKm={selectedRoute.distanceKm}
        originName={fromLocation.split(',')[0]}
        destinationName={toLocation.split(',')[0]}
      />

      {/* GAP ANALYSIS DELIVERABLE: SCREEN 2 - ACTION RECOMMENDATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-6">
          <ActionRecommendationsCard
            recommendedSpeedCapKmh={vehicleAdjusted.recommendedMaxSpeedKmh}
            laneAdvice="Avoid Lane 2 (Waterlogging & loose gravel reported near Besa)"
            brakingAdvice={`Maintain ${vehicleAdjusted.brakingDistanceFactor}x extra braking distance for ${vehicleAdjusted.vehicleProfile.name}`}
            hasAlternativeRoute={selectedRouteId !== "route-2"}
            onSwitchRoute={(id) => setSelectedRouteId(id)}
          />
        </div>

        {/* RISK ANALYSIS DETAILS */}
        <div className="lg:col-span-6 bg-[#111A20] border border-[#1E2931] rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <h3 className="text-sm font-bold text-white">
              Risk Analysis ({selectedRoute.name} &bull; {vehicleAdjusted.vehicleProfile.name})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Overall Score */}
            <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 rounded-xl bg-[#16222A] border border-[#243743] text-center">
              <span className="text-[10px] text-[#8A9BA8] font-semibold">Vehicle-Tailored Risk</span>
              <span className="text-3xl font-black text-[#10B981] mt-1">{vehicleAdjusted.adjustedRiskScore}%</span>
              <span className="mt-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">
                {vehicleAdjusted.safetyScore}% Safety
              </span>
              <div className="w-full mt-2">
                <div className="w-full h-1.5 rounded-full bg-[#0B1115] overflow-hidden">
                  <div className="h-full bg-[#10B981]" style={{ width: `${vehicleAdjusted.adjustedRiskScore}%` }} />
                </div>
              </div>
            </div>

            {/* Factor Breakdown */}
            <div className="sm:col-span-8 space-y-1 text-xs">
              <div className="flex items-center justify-between p-1.5 rounded bg-[#16222A]/60">
                <span className="text-[#8A9BA8]">Braking Multiplier</span>
                <span className="font-bold text-blue-400">{vehicleAdjusted.brakingDistanceFactor}x standard</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-[#16222A]/60">
                <span className="text-[#8A9BA8]">Water Wading Cap</span>
                <span className="font-bold text-emerald-400">{vehicleAdjusted.vehicleProfile.maxSafeWaterDepthMm} mm</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-[#16222A]/60">
                <span className="text-[#8A9BA8]">Weather Slip Risk</span>
                <span className="font-bold text-amber-400">{vehicleAdjusted.vehicleProfile.wetRoadSlipVulnerability}x</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-[#16222A]/60">
                <span className="text-[#8A9BA8]">Ghost Hazards Nearby</span>
                <span className="font-bold text-orange-400">{ghostHazards.length} Active</span>
              </div>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0" />
            <span>Preventive AI active: 3 vital questions answered ahead of trip.</span>
          </div>
        </div>
      </div>

      {/* Weather Radar Modal */}
      {showWeatherRadar && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="max-w-2xl w-full">
            <MicroWeatherRadar onClose={() => setShowWeatherRadar(false)} />
          </div>
        </div>
      )}

      {/* Report Hazard Modal */}
      {showReportHazardModal && (
        <ReportHazardModal onClose={() => setShowReportHazardModal(false)} />
      )}

      {/* FOOTER SUB-BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#8A9BA8] pt-2 px-1 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          <span>RiskRoute 100% Preventive Road Safety System &bull; Nagpur Metro Sector</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Live Telemetry Synchronized</span>
          <RotateCw className="w-3 h-3 text-[#8A9BA8]" />
        </div>
      </div>
    </div>
  );
}
