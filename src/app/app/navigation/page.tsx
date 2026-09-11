"use client";
import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MapContainer from "@/components/map/MapContainer";
import HighRiskZonePanel from "@/components/accidents/HighRiskZonePanel";
import AccidentModal from "@/components/accidents/AccidentModal";
import { mockRoutes } from "@/mock/mockRoutes";
import { mockRiskZones } from "@/mock/mockRiskZones";
import { mockAccidents } from "@/mock/mockAccidents";
import { Route } from "@/types/route";
import { RiskZone } from "@/types/riskZone";
import { Accident } from "@/types/accident";
import { useRouteTracking } from "@/hooks/useRouteTracking";
import { useRiskProximity } from "@/hooks/useRiskProximity";
import { apiClient } from "@/services/api";
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
} from "lucide-react";

function NavigationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const routeId = searchParams.get("routeId") || "route-2";
  const fromParam = searchParams.get("from") || "MIHAN, Nagpur";
  const toParam = searchParams.get("to") || "Sitabuldi, Nagpur";

  const route: Route = mockRoutes.find((r) => r.id === routeId) || mockRoutes[1];

  const [isSimulating, setIsSimulating] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [followUser, setFollowUser] = useState(true);
  const [mapTheme, setMapTheme] = useState<"satellite" | "standard" | "dark">("satellite");

  const [inspectedZone, setInspectedZone] = useState<RiskZone | null>(null);
  const [selectedAccident, setSelectedAccident] = useState<Accident | null>(null);

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
        userLocation={currentPosition}
        userHeading={currentHeading}
        showRiskZones={true}
        showAccidents={true}
        onSelectZone={(z) => setInspectedZone(z)}
        onSelectAccident={(a) => setSelectedAccident(a)}
        followUser={followUser}
        mapTheme={mapTheme}
        className="w-full h-full"
        showFloatingRouteBadges={false}
      />

      {/* TOP-LEFT LIVE NAVIGATION HUD CARD (Matching Image 1) */}
      <div className="absolute top-4 left-4 z-[450] w-[300px] sm:w-[340px] bg-[#111A20]/95 backdrop-blur-xl border border-[#1E2931] rounded-2xl p-4 shadow-2xl space-y-3">
        <div className="flex items-center gap-2 pb-2.5 border-b border-[#243743]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-xs font-black text-white uppercase tracking-wider">Live Navigation</span>
        </div>

        {/* Origin / Destination */}
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2 text-white font-bold">
            <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="truncate">{fromParam}</span>
          </div>
          <div className="flex items-center gap-2 text-[#8A9BA8] pl-5">
            <span>to</span>
          </div>
          <div className="flex items-center gap-2 text-white font-bold">
            <MapPin className="w-3.5 h-3.5 text-[#EF4444]" />
            <span className="truncate">{toParam}</span>
          </div>
        </div>

        {/* Selected Route Info */}
        <div className="pt-2 border-t border-[#243743] flex items-center justify-between text-xs">
          <span className="font-bold text-white">{route.name}</span>
          <span className="text-[#8A9BA8]">{route.distanceKm} km &bull; {route.durationMinutes} min</span>
        </div>

        {/* ETA & Distance Left */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-xl bg-[#16222A]">
            <span className="text-[10px] text-[#8A9BA8] block">ETA</span>
            <span className="text-sm font-black text-white">{new Date(Date.now() + etaMinutes * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="p-2 rounded-xl bg-[#16222A]">
            <span className="text-[10px] text-[#8A9BA8] block">Distance Left</span>
            <span className="text-sm font-black text-white">{distanceRemainingKm} km</span>
          </div>
        </div>

        {/* Big Red Button: End Trip */}
        <button
          onClick={handleEndTrip}
          className="w-full py-2.5 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all cursor-pointer"
        >
          End Trip
        </button>

        {/* Sub-bar: Audio Toggle & Re-Center */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-[#16222A] text-[#8A9BA8] hover:text-white"
            title="Toggle Sound Alerts"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#10B981]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setFollowUser(!followUser)}
            className="px-3 py-1.5 rounded-lg bg-[#16222A] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#1E2E38]"
          >
            <Locate className="w-3.5 h-3.5" />
            <span>Re-center</span>
          </button>
        </div>
      </div>

      {/* FLOATING RISK ZONE WARNING ON MAP (Matching Image 1) */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-[450] bg-[#111A20]/95 border border-[#EF4444] rounded-2xl p-4 shadow-2xl backdrop-blur-md max-w-sm w-full animate-bounce-short">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#EF4444] text-white">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-black text-white uppercase">Risk Zone Ahead</h4>
              <span className="text-xs font-extrabold text-[#EF4444]">150 m ahead</span>
            </div>
            <p className="text-[11px] text-[#C5D1DC] font-medium mt-0.5">Accident-prone area. Slow down and stay alert!</p>
          </div>
        </div>
      </div>

      {/* TOP-RIGHT MAP CONTROLS */}
      <div className="absolute top-4 right-4 z-[400] flex gap-2">
        <button
          onClick={() => setMapTheme("standard")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold border backdrop-blur-md shadow-lg transition-all ${
            mapTheme === "standard" ? "bg-[#3B82F6] text-white border-blue-400" : "bg-[#111A20]/90 text-[#8A9BA8] border-[#2B3B47]"
          }`}
        >
          Map
        </button>
        <button
          onClick={() => setMapTheme("satellite")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold border backdrop-blur-md shadow-lg transition-all ${
            mapTheme === "satellite" ? "bg-[#3B82F6] text-white border-blue-400" : "bg-[#111A20]/90 text-[#8A9BA8] border-[#2B3B47]"
          }`}
        >
          Satellite
        </button>
      </div>

      {/* BOTTOM TELEMETRY DASHBOARD BAR (Matching Image 1) */}
      <div className="absolute bottom-4 left-4 right-4 z-[450] max-w-[1400px] mx-auto bg-[#0E151A]/95 border border-[#1E2931] rounded-2xl p-4 shadow-2xl backdrop-blur-xl space-y-3">
        {/* 4 Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          {/* Card 1: Upcoming Risk Zone */}
          <div className="p-3 rounded-xl bg-[#141E24] border border-[#243743]">
            <span className="text-[10px] text-[#8A9BA8] font-bold block">Upcoming Risk Zone</span>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
              <span className="text-lg font-black text-[#EF4444]">150 m</span>
            </div>
            <span className="text-[10px] text-[#EF4444] font-semibold">Risk Level High</span>
          </div>

          {/* Card 2: Total Accidents */}
          <div className="p-3 rounded-xl bg-[#141E24] border border-[#243743]">
            <span className="text-[10px] text-[#8A9BA8] font-bold block">Total Accidents (This Zone)</span>
            <span className="text-lg font-black text-white mt-1 block">28</span>
            <span className="text-[10px] text-[#8A9BA8] font-medium">(Past 3 Years)</span>
          </div>

          {/* Card 3: Alerts Enabled */}
          <div className="p-3 rounded-xl bg-[#141E24] border border-[#243743]">
            <span className="text-[10px] text-[#8A9BA8] font-bold block">Alerts Enabled</span>
            <div className="flex items-center justify-center gap-3 mt-1.5 text-xs text-[#10B981]">
              <span className="flex items-center gap-1"><Volume2 className="w-3.5 h-3.5" /> Sound</span>
              <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5" /> Vibration</span>
            </div>
          </div>

          {/* Card 4: Current Speed */}
          <div className="p-3 rounded-xl bg-[#141E24] border border-[#243743]">
            <span className="text-[10px] text-[#8A9BA8] font-bold block">Current Speed</span>
            <span className="text-lg font-black text-white mt-1 block">{currentSpeed}</span>
            <span className="text-[10px] text-[#8A9BA8] font-medium">km/h</span>
          </div>
        </div>

        {/* Recent Accidents in this Area */}
        <div className="pt-2 border-t border-[#1E2931]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white">Recent Accidents in Nagpur Corridor</span>
            <button
              onClick={() => setSelectedAccident(mockAccidents[0])}
              className="text-xs font-bold text-[#3B82F6] hover:underline"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {mockAccidents.slice(0, 5).map((acc) => (
              <div
                key={acc.id}
                onClick={() => setSelectedAccident(acc)}
                className="group relative h-16 sm:h-20 rounded-xl overflow-hidden border border-[#243743] hover:border-[#10B981] cursor-pointer"
              >
                <img src={acc.imageUrl} alt={acc.formattedDate} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-1 left-1 right-1 text-[8px] font-bold text-white truncate text-center">
                  {acc.formattedDate.split(',')[0]}
                </span>
              </div>
            ))}

            <button
              onClick={() => setSelectedAccident(mockAccidents[0])}
              className="h-16 sm:h-20 rounded-xl bg-[#141E24] hover:bg-[#1E2E38] border border-[#243743] text-xs font-bold text-white flex items-center justify-center transition-colors"
            >
              View All ({mockAccidents.length})
            </button>
          </div>
        </div>
      </div>

      <HighRiskZonePanel zone={inspectedZone} accidents={mockAccidents} onClose={() => setInspectedZone(null)} />
      <AccidentModal accident={selectedAccident} onClose={() => setSelectedAccident(null)} />
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
