"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MapContainer from "@/components/map/MapContainer";
import HighRiskZonePanel from "@/components/accidents/HighRiskZonePanel";
import AccidentModal from "@/components/accidents/AccidentModal";
import RiskAheadAlertCard from "@/components/safety/RiskAheadAlertCard";
import ActionRecommendationsCard from "@/components/safety/ActionRecommendationsCard";
import VisualRouteSegmentStrip from "@/components/route/VisualRouteSegmentStrip";
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
  Smartphone,
  Locate,
  AlertTriangle,
  Layers,
  StopCircle,
  Pause,
  Play,
  Share2,
  AlertOctagon,
  Waves,
  Plus,
  Moon,
  Zap,
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

  // Modal States
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
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-[#0B1115]">
      {/* Full-Screen Satellite Map */}
      <MapContainer
        routes={[route]}
        selectedRouteId={route.id}
        riskZones={mockRiskZones}
        accidents={mockAccidents}
        ghostHazards={ghostHazards}
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

      {/* 1. LEFT COCKPIT HUD SIDEBAR (Non-overlapping, neatly docked left with smooth scrollbar) */}
      <div className="absolute top-4 left-4 bottom-4 z-[450] w-[310px] sm:w-[330px] lg:w-[345px] bg-[#111A20]/95 backdrop-blur-xl border border-[#1E2931] rounded-2xl p-4 shadow-2xl flex flex-col justify-between overflow-y-auto space-y-3">
        {/* Top Info Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#243743]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-xs font-black text-white uppercase tracking-wider">Live Safety Nav</span>
            </div>

            <span className="text-[10px] font-bold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/30 capitalize">
              {vehicleParam.replace('_', ' ')}
            </span>
          </div>

          {/* Origin / Destination */}
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2 text-white font-bold">
              <MapPin className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0" />
              <span className="truncate">{fromParam}</span>
            </div>
            <div className="flex items-center gap-2 text-[#8A9BA8] pl-5">
              <span>to</span>
            </div>
            <div className="flex items-center gap-2 text-white font-bold">
              <MapPin className="w-3.5 h-3.5 text-[#EF4444] flex-shrink-0" />
              <span className="truncate">{toParam}</span>
            </div>
          </div>

          {/* Selected Route Info */}
          <div className="pt-2 border-t border-[#243743] flex items-center justify-between text-xs">
            <span className="font-bold text-white truncate max-w-[170px]">{route.name}</span>
            <span className="text-[#8A9BA8]">{route.distanceKm} km &bull; {route.durationMinutes} min</span>
          </div>

          {/* ETA & Distance Left */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-[#16222A]">
              <span className="text-[10px] text-[#8A9BA8] block">ETA</span>
              <span className="text-sm font-black text-white">
                {new Date(Date.now() + etaMinutes * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-[#16222A]">
              <span className="text-[10px] text-[#8A9BA8] block">Distance Left</span>
              <span className="text-sm font-black text-white">{distanceRemainingKm} km</span>
            </div>
          </div>

          {/* Feature 1: Driver Alertness AI Widget */}
          <DriverAlertnessWidget continuousDriveMinutes={65} />

          {/* Feature 2: Predictive Aquaplaning Badge */}
          <AquaplaningAlertBadge
            precipitationMmPerHour={18}
            vehicleSpeedKmh={currentSpeed}
            onClick={() => setShowWeatherRadar(true)}
          />
        </div>

        {/* Bottom Actions of Left Sidebar */}
        <div className="space-y-2 pt-2 border-t border-[#243743]">
          {/* Guardian & End Trip Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowGuardianShareModal(true)}
              className="py-2 rounded-xl bg-[#1E2E38] hover:bg-[#2B3E4C] text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-emerald-500/30"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Guardian</span>
            </button>

            <button
              onClick={handleEndTrip}
              className="py-2 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all cursor-pointer"
            >
              End Trip
            </button>
          </div>

          {/* Feature 5: Emergency Crash SOS Trigger */}
          <button
            onClick={() => setShowEmergencySosModal(true)}
            className="w-full py-2.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-black text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-1.5 transition-all border border-red-400"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Simulate Crash Auto-SOS</span>
          </button>

          {/* Audio & Recenter Tools */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 rounded-lg bg-[#16222A] text-[#8A9BA8] hover:text-white"
                title="Toggle Sound Alerts"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-[#10B981]" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setShowReportHazardModal(true)}
                className="px-2 py-1.5 rounded-lg bg-[#E15A2B]/20 text-[#E15A2B] border border-[#E15A2B]/40 text-[10px] font-bold hover:bg-[#E15A2B]/30"
                title="Report Ghost Hazard"
              >
                + Ghost Hazard
              </button>
            </div>

            <button
              onClick={() => setFollowUser(!followUser)}
              className="px-2.5 py-1.5 rounded-lg bg-[#16222A] text-white text-xs font-semibold flex items-center gap-1 hover:bg-[#1E2E38]"
            >
              <Locate className="w-3.5 h-3.5" />
              <span>Re-center</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. TOP PREVENTIVE SAFETY COCKPIT CARDS (Placed to the right of the Left HUD, zero collision) */}
      <div className="absolute top-4 left-[330px] sm:left-[350px] lg:left-[370px] right-4 z-[400] grid grid-cols-1 md:grid-cols-2 gap-3 max-w-[1100px]">
        {/* GAP ANALYSIS SCREEN 1: RISK AHEAD SCREEN (Proximity & ETA Warning) */}
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
              detail: 'Construction ahead',
            },
            {
              type: 'blackspot',
              title: 'Accident Blackspot',
              detail: 'High fatality zone',
            },
          ]}
        />

        {/* GAP ANALYSIS SCREEN 2: CONTEXTUAL ACTION RECOMMENDATIONS */}
        <ActionRecommendationsCard
          recommendedSpeedCapKmh={vehicleRisk.recommendedMaxSpeedKmh}
          laneAdvice="Avoid Lane 2 (Waterlogging reported)"
          brakingAdvice={`Maintain ${vehicleRisk.brakingDistanceFactor}x extra braking distance`}
          hasAlternativeRoute={activeRouteId !== "route-2"}
          onSwitchRoute={(newId) => {
            setActiveRouteId(newId);
            playVoiceAlert("Switching to safer alternative route.");
          }}
        />
      </div>

      {/* TOP-RIGHT MAP THEME SWITCHER */}
      <div className="absolute top-4 right-4 z-[420] hidden xl:flex gap-1.5">
        <button
          onClick={() => setMapTheme(mapTheme === "satellite" ? "standard" : "satellite")}
          className="px-3 py-1.5 rounded-lg bg-[#111A20]/90 border border-[#2B3B47] text-white text-xs font-bold hover:bg-[#1A2630] backdrop-blur-md shadow-lg flex items-center gap-1.5"
        >
          <Layers className="w-3.5 h-3.5 text-[#10B981]" />
          <span>{mapTheme === "satellite" ? "Satellite" : "Standard"}</span>
        </button>
      </div>

      {/* 3. BOTTOM TELEMETRY DASHBOARD BAR & COMPACT ROUTE TIMELINE STRIP */}
      <div className="absolute bottom-4 left-[330px] sm:left-[350px] lg:left-[370px] right-4 z-[400] max-w-[1100px] bg-[#0E151A]/95 border border-[#1E2931] rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-xl space-y-2.5">
        {/* 4 Telemetry Tiles Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          {/* Upcoming Risk Zone */}
          <div className="p-2 rounded-xl bg-[#141E24] border border-[#243743]">
            <span className="text-[10px] text-[#8A9BA8] font-bold block">Upcoming Risk Zone</span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
              <span className="text-base font-black text-[#EF4444]">150 m</span>
            </div>
            <span className="text-[9px] text-[#EF4444] font-semibold truncate block">Chhatrapati Merge</span>
          </div>

          {/* Aquaplaning Cap */}
          <div className="p-2 rounded-xl bg-[#141E24] border border-[#243743]">
            <span className="text-[10px] text-[#8A9BA8] font-bold block">Aquaplaning Cap</span>
            <span className="text-base font-black text-blue-400 mt-0.5 block">
              {vehicleRisk.recommendedMaxSpeedKmh} km/h
            </span>
            <span className="text-[9px] text-blue-300 font-medium truncate block">18 mm/h Rain</span>
          </div>

          {/* Ghost Hazards */}
          <div className="p-2 rounded-xl bg-[#141E24] border border-[#243743]">
            <span className="text-[10px] text-[#8A9BA8] font-bold block">Ghost Hazards</span>
            <span className="text-base font-black text-orange-400 mt-0.5 block">
              {ghostHazards.length} Verified
            </span>
            <span className="text-[9px] text-[#8A9BA8] truncate block">Community Radar</span>
          </div>

          {/* Current Speed */}
          <div className="p-2 rounded-xl bg-[#141E24] border border-[#243743]">
            <span className="text-[10px] text-[#8A9BA8] font-bold block">Current Speed</span>
            <span className="text-base font-black text-white mt-0.5 block">{currentSpeed}</span>
            <span className="text-[9px] text-emerald-400 font-medium truncate block">km/h (Safe Pace)</span>
          </div>
        </div>

        {/* GAP ANALYSIS SCREEN 3: COMPACT VISUAL ROUTE SEGMENTATION STRIP */}
        <div className="pt-1.5 border-t border-[#1E2931]">
          <VisualRouteSegmentStrip
            totalDistanceKm={route.distanceKm}
            originName={fromParam.split(',')[0]}
            destinationName={toParam.split(',')[0]}
            compact={true}
          />
        </div>
      </div>

      {/* MODALS */}
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
