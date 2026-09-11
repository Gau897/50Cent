"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MapContainer from "@/components/map/MapContainer";
import { mockRoutes } from "@/mock/mockRoutes";
import { mockRiskZones } from "@/mock/mockRiskZones";
import { mockAccidents } from "@/mock/mockAccidents";
import {
  ShieldCheck,
  BatteryCharging,
  Signal,
  Gauge,
  Phone,
  MessageCircle,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";

function GuardianContent() {
  const searchParams = useSearchParams();
  const tripId = searchParams.get("trip") || "TRIP-NGP-9482";
  const pin = searchParams.get("pin") || "842-195";

  const [driverSpeed, setDriverSpeed] = useState(48);
  const [batteryLevel, setBatteryLevel] = useState(87);
  const [etaMinutes, setEtaMinutes] = useState(14);
  const [isArrived, setIsArrived] = useState(false);
  const [sentNudge, setSentNudge] = useState(false);

  const route = mockRoutes[1]; // Safest route

  // Simulated live location on route
  const currentCoords = {
    lat: 21.1123,
    lng: 79.0456, // Subhash Nagar
  };

  const handleSendNudge = () => {
    setSentNudge(true);
    setTimeout(() => setSentNudge(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Header Banner */}
      <div className="bg-[#111A20] border border-[#1E2931] rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Fleet & Family Guardian Live Stream
              </h1>
              <span className="text-xs bg-emerald-950 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40 animate-pulse">
                Live &bull; Trip {tripId}
              </span>
            </div>
            <p className="text-xs text-[#8A9BA8] mt-0.5">
              Monitoring Driver <strong className="text-white">Gaurav</strong> en route to Sitabuldi Metro Interchange
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSendNudge}
            className="px-4 py-2.5 rounded-xl bg-[#1E2E38] hover:bg-[#2A3E4D] text-white text-xs font-bold flex items-center gap-2 transition-all"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>{sentNudge ? "Nudge Sent to Dashboard!" : "Send Safety Nudge"}</span>
          </button>
          <a
            href="tel:+919876543210"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
          >
            <Phone className="w-4 h-4" />
            <span>Call Driver</span>
          </a>
        </div>
      </div>

      {/* 4 Guardian Telemetry Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Speed */}
        <div className="p-4 rounded-2xl bg-[#111A20] border border-[#1E2931] shadow-xl text-center space-y-1">
          <span className="text-[10px] text-[#8A9BA8] font-bold uppercase block">Driver Speed</span>
          <div className="flex items-center justify-center gap-1.5">
            <Gauge className="w-4 h-4 text-emerald-400" />
            <span className="text-2xl font-black text-white">{driverSpeed}</span>
            <span className="text-xs text-[#8A9BA8]">km/h</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold block">Under 50 km/h Limit</span>
        </div>

        {/* Battery & Network */}
        <div className="p-4 rounded-2xl bg-[#111A20] border border-[#1E2931] shadow-xl text-center space-y-1">
          <span className="text-[10px] text-[#8A9BA8] font-bold uppercase block">Device Telemetry</span>
          <div className="flex items-center justify-center gap-3 mt-1 text-sm font-black text-white">
            <span className="flex items-center gap-1 text-emerald-400">
              <BatteryCharging className="w-4 h-4" /> {batteryLevel}%
            </span>
            <span className="flex items-center gap-1 text-blue-400">
              <Signal className="w-4 h-4" /> 5G Full
            </span>
          </div>
          <span className="text-[10px] text-[#8A9BA8] block">GPS Active & Ping Normal</span>
        </div>

        {/* ETA */}
        <div className="p-4 rounded-2xl bg-[#111A20] border border-[#1E2931] shadow-xl text-center space-y-1">
          <span className="text-[10px] text-[#8A9BA8] font-bold uppercase block">Safe ETA</span>
          <div className="flex items-center justify-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-2xl font-black text-white">{etaMinutes}</span>
            <span className="text-xs text-[#8A9BA8]">min left</span>
          </div>
          <span className="text-[10px] text-blue-400 font-semibold block">On Optimal Route</span>
        </div>

        {/* Safe Arrival Geofence Status */}
        <div className="p-4 rounded-2xl bg-[#111A20] border border-[#1E2931] shadow-xl text-center space-y-1">
          <span className="text-[10px] text-[#8A9BA8] font-bold uppercase block">Safe Arrival Radar</span>
          <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-black">
            <CheckCircle2 className="w-5 h-5" />
            <span>Geofence Active</span>
          </div>
          <span className="text-[10px] text-[#8A9BA8] block">Auto-Alert upon reaching destination</span>
        </div>
      </div>

      {/* Map & Live Tracking */}
      <div className="bg-[#111A20] border border-[#1E2931] rounded-3xl overflow-hidden h-[460px] relative shadow-2xl">
        <MapContainer
          routes={[route]}
          selectedRouteId={route.id}
          riskZones={mockRiskZones}
          accidents={mockAccidents}
          userLocation={currentCoords}
          userHeading={45}
          showRiskZones={true}
          showAccidents={true}
          className="w-full h-full"
          showFloatingRouteBadges={false}
        />

        {/* Floating live info pill on map */}
        <div className="absolute top-4 left-4 z-[400] bg-[#0E151A]/90 border border-[#1E2931] rounded-2xl p-3.5 backdrop-blur-md shadow-2xl max-w-xs text-xs space-y-2">
          <div className="flex items-center gap-2 text-white font-black">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Vehicle Position</span>
          </div>
          <div className="space-y-1 text-[#8A9BA8]">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-white font-semibold">Subhash Nagar Metro Sector, Nagpur</span>
            </div>
            <p className="text-[11px]">Route: {route.name} (Safest Corridor)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GuardianPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#8A9BA8]">Loading Guardian Dashboard...</div>}>
      <GuardianContent />
    </Suspense>
  );
}
