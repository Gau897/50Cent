"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MapContainer from "@/components/map/MapContainer";
import HighRiskZonePanel from "@/components/accidents/HighRiskZonePanel";
import AccidentModal from "@/components/accidents/AccidentModal";
import RiskAheadAlertCard from "@/components/safety/RiskAheadAlertCard";
import ActionRecommendationsCard from "@/components/safety/ActionRecommendationsCard";
import VisualRouteSegmentStrip, { RouteTimelineHazard } from "@/components/route/VisualRouteSegmentStrip";
import DriverAlertnessWidget from "@/components/safety/DriverAlertnessWidget";
import AquaplaningAlertBadge from "@/components/weather/AquaplaningAlertBadge";
import MicroWeatherRadar from "@/components/weather/MicroWeatherRadar";
import ReportHazardModal from "@/components/community/ReportHazardModal";
import GhostHazardOverlay from "@/components/community/GhostHazardOverlay";
import EmergencySosModal from "@/components/emergency/EmergencySosModal";
import GuardianShareModal from "@/components/guardian/GuardianShareModal";
import { mockRoutes } from "@/mock/mockRoutes";
import { mockRiskZones } from "@/mock/mockRiskZones";
import { mockAccidents } from "@/mock/mockAccidents";
import { ghostHazardStore } from "@/lib/ghostHazardStore";
import { calculateVehicleRisk } from "@/lib/vehicleRiskEngine";
import { Route } from "@/types/route";
import { RiskZone } from "@/types/riskZone";
import { Accident } from "@/types/accident";
import { GhostHazard } from "@/types/ghostHazard";
import { VehicleType } from "@/types/vehicle";
import { useRouteTracking } from "@/hooks/useRouteTracking";
import { useRiskProximity } from "@/hooks/useRiskProximity";
import { apiClient } from "@/services/api";
import { playVoiceAlert } from "@/lib/audioAlerts";
import {
  Shield,
  MapPin,
  Volume2,
  VolumeX,
  Locate,
  AlertTriangle,
  Layers,
  Share2,
  AlertOctagon,
  Waves,
  Plus,
  Gauge,
} from "lucide-react";

function NavigationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const routeId = searchParams.get("routeId") || "route-2";
  const vehicleParam = (searchParams.get("vehicle") as VehicleType) || "car";
  const fromParam = searchParams.get("from") || "MIHAN, Nagpur";
  const toParam = searchParams.get("to") || "Sitabuldi, Nagpur";

  const [activeRouteId, setActiveRouteId] = useState(routeId);
  const route: Route = mockRoutes.find((r) => r.id === activeRouteId) || mockRoutes[1];

  const [isSimulating, setIsSimulating] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [followUser, setFollowUser] = useState(true);
  const [mapTheme, setMapTheme] = useState<"satellite" | "standard" | "dark">("satellite");

  const [ghostHazards, setGhostHazards] = useState<GhostHazard[]>(ghostHazardStore.getActiveHazards());
  const [inspectedZone, setInspectedZone] = useState<RiskZone | null>(null);
  const [selectedAccident, setSelectedAccident] = useState<Accident | null>(null);
  const [inspectedGhostHazard, setInspectedGhostHazard] = useState<GhostHazard | null>(null);

  // Modals
  const [showWeatherRadar, setShowWeatherRadar] = useState(false);
  const [showReportHazardModal, setShowReportHazardModal] = useState(false);
  const [showEmergencySosModal, setShowEmergencySosModal] = useState(false);
  const [showGuardianShareModal, setShowGuardianShareModal] = useState(false);

  useEffect(() => {
    const unsub = ghostHazardStore.subscribe(() => {
      setGhostHazards([...ghostHazardStore.getActiveHazards()]);
    });
    return () => unsub();
  }, []);

  const {
    currentPosition,
    currentHeading,
    currentSpeed,
    distanceRemainingKm,
    etaMinutes,
    isCompleted,
    resetTracking,
  } = useRouteTracking({
    route,
    isSimulating,
    simulationSpeedMultiplier: 1.2,
  });

  const { activeAlert } = useRiskProximity({
    userPosition: currentPosition,
    riskZones: mockRiskZones,
    enableSound: soundEnabled,
    enableSpeech: voiceEnabled,
    enableVibration: vibrationEnabled,
  });

  const vehicleRisk = calculateVehicleRisk(route, vehicleParam, 18);

  // Timeline hazards along the active route
  const routeTimelineHazards: RouteTimelineHazard[] = [
    {
      id: "h1",
      kmPosition: 1.2,
      type: "blackspot",
      title: "Accident Blackspot",
      severity: "critical",
      detail: "Chhatrapati Flyover exit merge point",
    },
    {
      id: "h2",
      kmPosition: 3.0,
      type: "rain",
      title: "Rain / Aquaplaning Zone",
      severity: "high",
      detail: "Airport South water pooling sector",
    },
    {
      id: "h3",
      kmPosition: 7.5,
      type: "roadblock",
      title: "Metro Construction",
      severity: "medium",
      detail: "Ajni Square single-lane bottleneck",
    },
    {
      id: "h4",
      kmPosition: 12.4,
      type: "ghost",
      title: "Ghost Hazard Reported",
      severity: "high",
      detail: "Oil spill verified by 19 community drivers",
    },
  ];

  const handleEndTrip = async () => {
    await apiClient.logNavigationSession({
      routeId: route.id,
      routeName: route.name,
      originName: fromParam,
      destinationName: toParam,
      totalDistanceKm: route.distanceKm,
      totalDurationMinutes: route.durationMinutes,
      status: "completed",
    });
    router.push("/app/history");
  };

  return (
    <div className="flex-1 bg-[#0B1115] text-slate-100 p-3 sm:p-5 lg:p-6 max-w-[1600px] mx-auto w-full">
      {/* 2-COLUMN DESKTOP GRID LAYOUT (Normal document flow, ZERO floating overlap on map) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: LIVE SAFETY NAV SIDEBAR (3.5 / 12 Cols)                      */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-4">
          
          {/* Card 1: Trip Info & ETA */}
          <div className="bg-[#111A20] border border-[#1E2931] rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#243743]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-xs font-black text-white uppercase tracking-wider">Live Safety Nav</span>
              </div>
              <span className="text-[10px] font-bold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/30 capitalize">
                {vehicleParam.replace('_', ' ')}
              </span>
            </div>

            {/* Origin & Destination */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-white font-bold">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <span className="truncate">{fromParam}</span>
              </div>
              <div className="flex items-center gap-2 text-[#8A9BA8] pl-5">
                <span className="text-[11px]">via {route.via || route.name}</span>
              </div>
              <div className="flex items-center gap-2 text-white font-bold">
                <div className="w-4 h-4 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3 h-3 text-red-400" />
                </div>
                <span className="truncate">{toParam}</span>
              </div>
            </div>

            {/* ETA & Distance Left Tiles */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#243743]">
              <div className="p-2.5 rounded-xl bg-[#16222A] border border-[#243743]">
                <span className="text-[10px] text-[#8A9BA8] font-bold block">Live ETA</span>
                <span className="text-sm font-black text-white">
                  {new Date(Date.now() + etaMinutes * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-[9px] text-emerald-400 block mt-0.5">~{etaMinutes} min left</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#16222A] border border-[#243743]">
                <span className="text-[10px] text-[#8A9BA8] font-bold block">Distance Left</span>
                <span className="text-sm font-black text-white">{distanceRemainingKm} km</span>
                <span className="text-[9px] text-[#8A9BA8] block mt-0.5">Total {route.distanceKm} km</span>
              </div>
            </div>
          </div>

          {/* Card 2: Driver Alertness AI */}
          <DriverAlertnessWidget continuousDriveMinutes={65} />

          {/* Card 3: Predictive Aquaplaning AI */}
          <AquaplaningAlertBadge
            precipitationMmPerHour={18}
            vehicleSpeedKmh={currentSpeed}
            onClick={() => setShowWeatherRadar(true)}
          />

          {/* Card 4: Action Controls & Crash SOS */}
          <div className="bg-[#111A20] border border-[#1E2931] rounded-2xl p-4 shadow-xl space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowGuardianShareModal(true)}
                className="py-2.5 rounded-xl bg-[#1E2E38] hover:bg-[#2B3E4C] text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-emerald-500/30"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Guardian</span>
              </button>

              <button
                onClick={handleEndTrip}
                className="py-2.5 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all cursor-pointer"
              >
                End Trip
              </button>
            </div>

            {/* Simulate Crash Auto-SOS */}
            <button
              onClick={() => setShowEmergencySosModal(true)}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-lg shadow-red-600/40 flex items-center justify-center gap-2 transition-all border border-red-400"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>Simulate Crash Auto-SOS</span>
            </button>

            {/* Audio Toggle, Ghost Hazard & Re-center */}
            <div className="flex items-center justify-between pt-1 border-t border-[#243743] text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 rounded-lg bg-[#16222A] text-[#8A9BA8] hover:text-white"
                  title="Toggle Sound Alerts"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-[#10B981]" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setShowReportHazardModal(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#E15A2B]/20 text-[#E15A2B] border border-[#E15A2B]/40 text-xs font-bold hover:bg-[#E15A2B]/30 flex items-center gap-1"
                  title="Report Ghost Hazard"
                >
                  <Plus className="w-3 h-3" />
                  <span>Ghost Hazard</span>
                </button>
              </div>

              <button
                onClick={() => setFollowUser(!followUser)}
                className="px-3 py-1.5 rounded-lg bg-[#16222A] text-white text-xs font-semibold flex items-center gap-1 hover:bg-[#1E2E38]"
              >
                <Locate className="w-3.5 h-3.5" />
                <span>Re-center</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: PREVENTIVE ALERTS + FULL UNOBSTRUCTED MAP + STATS & TIMELINE */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 xl:col-span-8 space-y-4">
          
          {/* 1. TOP HORIZONTAL ALERT BAR (Above the map, normal document flow) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Screen 1: Risk Ahead Proximity & ETA Warning */}
            <RiskAheadAlertCard
              distanceAheadKm={2.4}
              etaMinutes={8}
              hazards={[
                {
                  type: 'rain',
                  title: 'Heavy Rain',
                  detail: 'Precipitation: 18mm/hr',
                },
                {
                  type: 'blockage',
                  title: 'Road Blockage',
                  detail: 'Metro Construction ahead',
                },
                {
                  type: 'blackspot',
                  title: 'Accident Blackspot',
                  detail: 'High fatality merge zone',
                },
              ]}
            />

            {/* Screen 2: Contextual Safety Action Recommendations */}
            <ActionRecommendationsCard
              recommendedSpeedCapKmh={vehicleRisk.recommendedMaxSpeedKmh}
              laneAdvice="Avoid Lane 2 (Waterlogging reported)"
              brakingAdvice={`Maintain ${vehicleRisk.brakingDistanceFactor}x extra braking distance for ${vehicleRisk.vehicleProfile.name}`}
              hasAlternativeRoute={activeRouteId !== "route-2"}
              onSwitchRoute={(newId) => {
                setActiveRouteId(newId);
                playVoiceAlert("Switching to safer alternative route.");
              }}
            />
          </div>

          {/* 2. FULL & CLEAN MAP SECTION (Zero overlay boxes covering map tiles) */}
          <div className="bg-[#111A20] border border-[#1E2931] rounded-2xl overflow-hidden h-[460px] sm:h-[520px] lg:h-[560px] relative shadow-2xl">
            <MapContainer
              routes={[route]}
              selectedRouteId={route.id}
              riskZones={mockRiskZones}
              accidents={mockAccidents}
              ghostHazards={ghostHazards}
              timelineHazards={routeTimelineHazards}
              userLocation={currentPosition}
              userHeading={currentHeading}
              showRiskZones={true}
              showAccidents={true}
              showGhostHazards={true}
              onSelectZone={(z) => setInspectedZone(z)}
              onSelectAccident={(a) => setSelectedAccident(a)}
              onSelectGhostHazard={(g) => setInspectedGhostHazard(g)}
              followUser={followUser}
              mapTheme={mapTheme}
              className="w-full h-full"
              showFloatingRouteBadges={false}
            />

            {/* Small corner Layer Toggle (Only native control on map) */}
            <div className="absolute top-3 right-3 z-[400] flex gap-2">
              <button
                onClick={() => setMapTheme(mapTheme === "satellite" ? "standard" : "satellite")}
                className="px-3 py-1.5 rounded-lg bg-[#111A20]/90 border border-[#2B3B47] text-white text-xs font-bold hover:bg-[#1A2630] backdrop-blur-md shadow-lg flex items-center gap-1.5 transition-all"
              >
                <Layers className="w-3.5 h-3.5 text-[#10B981]" />
                <span>{mapTheme === "satellite" ? "Satellite" : "Standard Map"}</span>
              </button>
            </div>
          </div>

          {/* 3. FOUR TELEMETRY STAT CARDS (Below the map in normal document flow) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Stat 1: Upcoming Risk */}
            <div className="p-3.5 rounded-2xl bg-[#111A20] border border-[#1E2931] shadow-xl text-center space-y-0.5">
              <span className="text-[10px] text-[#8A9BA8] font-bold uppercase block">Upcoming Risk Zone</span>
              <div className="flex items-center justify-center gap-1 mt-1">
                <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                <span className="text-xl font-black text-[#EF4444]">150 m</span>
              </div>
              <span className="text-[10px] text-[#EF4444] font-semibold block truncate">Chhatrapati Merge</span>
            </div>

            {/* Stat 2: Aquaplaning Cap */}
            <div className="p-3.5 rounded-2xl bg-[#111A20] border border-[#1E2931] shadow-xl text-center space-y-0.5">
              <span className="text-[10px] text-[#8A9BA8] font-bold uppercase block">Aquaplaning Safe Cap</span>
              <span className="text-xl font-black text-blue-400 mt-1 block">
                {vehicleRisk.recommendedMaxSpeedKmh} km/h
              </span>
              <span className="text-[10px] text-blue-300 font-medium block">18 mm/h Rain</span>
            </div>

            {/* Stat 3: Ghost Hazards */}
            <div className="p-3.5 rounded-2xl bg-[#111A20] border border-[#1E2931] shadow-xl text-center space-y-0.5">
              <span className="text-[10px] text-[#8A9BA8] font-bold uppercase block">Active Ghost Hazards</span>
              <span className="text-xl font-black text-orange-400 mt-1 block">
                {ghostHazards.length} Verified
              </span>
              <span className="text-[10px] text-[#8A9BA8] block">Community Radar</span>
            </div>

            {/* Stat 4: Current Speed */}
            <div className="p-3.5 rounded-2xl bg-[#111A20] border border-[#1E2931] shadow-xl text-center space-y-0.5">
              <span className="text-[10px] text-[#8A9BA8] font-bold uppercase block">Current Speed</span>
              <span className="text-xl font-black text-white mt-1 block">{currentSpeed}</span>
              <span className="text-[10px] text-emerald-400 font-medium block">km/h (Safe Pace)</span>
            </div>
          </div>

          {/* 4. VISUAL ROUTE SEGMENTATION TIMELINE STRIP (Screen 3) */}
          <VisualRouteSegmentStrip
            totalDistanceKm={route.distanceKm}
            originName={fromParam.split(',')[0]}
            destinationName={toParam.split(',')[0]}
            hazards={routeTimelineHazards}
          />
        </div>
      </div>

      {/* INSPECTOR MODALS */}
      <HighRiskZonePanel zone={inspectedZone} accidents={mockAccidents} onClose={() => setInspectedZone(null)} />
      <AccidentModal accident={selectedAccident} onClose={() => setSelectedAccident(null)} />
      <GhostHazardOverlay hazard={inspectedGhostHazard} onClose={() => setInspectedGhostHazard(null)} />

      {showWeatherRadar && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="max-w-2xl w-full">
            <MicroWeatherRadar onClose={() => setShowWeatherRadar(false)} />
          </div>
        </div>
      )}

      {showReportHazardModal && (
        <ReportHazardModal onClose={() => setShowReportHazardModal(false)} />
      )}

      {showEmergencySosModal && (
        <EmergencySosModal onClose={() => setShowEmergencySosModal(false)} />
      )}

      {showGuardianShareModal && (
        <GuardianShareModal
          tripId={`TRIP-${route.id.toUpperCase()}`}
          driverName="Gaurav"
          origin={fromParam}
          destination={toParam}
          onClose={() => setShowGuardianShareModal(false)}
        />
      )}
    </div>
  );
}

export default function NavigationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#8A9BA8]">Loading Navigation Environment...</div>}>
      <NavigationContent />
    </Suspense>
  );
}
