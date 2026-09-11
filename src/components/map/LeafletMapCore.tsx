"use client";
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Route, Coordinates } from "@/types/route";
import { RiskZone } from "@/types/riskZone";
import { Accident } from "@/types/accident";
import { GhostHazard } from "@/types/ghostHazard";

interface LeafletMapCoreProps {
  routes?: Route[];
  selectedRouteId?: string;
  onSelectRoute?: (id: string) => void;
  riskZones?: RiskZone[];
  accidents?: Accident[];
  ghostHazards?: GhostHazard[];
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

export default function LeafletMapCore({
  routes = [],
  selectedRouteId,
  onSelectRoute,
  riskZones = [],
  accidents = [],
  ghostHazards = [],
  userLocation,
  userHeading = 0,
  showRiskZones = true,
  showAccidents = true,
  showGhostHazards = true,
  onSelectZone,
  onSelectAccident,
  onSelectGhostHazard,
  followUser = false,
  mapTheme = "satellite",
  className = "w-full h-full",
  showFloatingRouteBadges = true,
}: LeafletMapCoreProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const labelTileLayerRef = useRef<L.TileLayer | null>(null);
  const routeLayersRef = useRef<L.LayerGroup | null>(null);
  const riskZoneLayersRef = useRef<L.LayerGroup | null>(null);
  const accidentLayersRef = useRef<L.LayerGroup | null>(null);
  const ghostHazardLayersRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialCenter: [number, number] = userLocation
      ? [userLocation.lat, userLocation.lng]
      : [21.1124, 79.0682]; // Nagpur center

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    L.control.zoom({ position: "topleft" }).addTo(map);

    // High-Res Satellite Imagery
    baseTileLayerRef.current = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 19 }
    ).addTo(map);

    // Place names & road boundaries overlay
    labelTileLayerRef.current = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 19 }
    ).addTo(map);

    routeLayersRef.current = L.layerGroup().addTo(map);
    riskZoneLayersRef.current = L.layerGroup().addTo(map);
    accidentLayersRef.current = L.layerGroup().addTo(map);
    ghostHazardLayersRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 600);

    const handleResize = () => map.invalidateSize();
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", handleResize);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Theme
  useEffect(() => {
    if (!baseTileLayerRef.current || !labelTileLayerRef.current) return;

    if (mapTheme === "standard") {
      baseTileLayerRef.current.setUrl("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
      labelTileLayerRef.current.setOpacity(0);
    } else if (mapTheme === "dark") {
      baseTileLayerRef.current.setUrl("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}");
      labelTileLayerRef.current.setOpacity(0);
    } else {
      // Satellite
      baseTileLayerRef.current.setUrl("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}");
      labelTileLayerRef.current.setOpacity(1);
      labelTileLayerRef.current.setUrl("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}");
    }
  }, [mapTheme]);

  // Render Routes
  useEffect(() => {
    if (!mapInstanceRef.current || !routeLayersRef.current) return;
    routeLayersRef.current.clearLayers();

    const colorMap: Record<string, string> = {
      'route-1': '#22C55E', // Green (Fastest)
      'route-2': '#3B82F6', // Blue (Safest)
      'route-3': '#F97316', // Orange (Alternative)
    };

    routes.forEach((route) => {
      const isSelected = route.id === selectedRouteId;
      const routeColor = colorMap[route.id] || route.color || '#3B82F6';

      // Route Polyline
      const polyline = L.polyline(route.coordinates, {
        color: routeColor,
        weight: isSelected ? 6 : 4,
        opacity: isSelected ? 0.95 : 0.65,
        lineCap: "round",
        lineJoin: "round",
      });

      polyline.on("click", () => {
        if (onSelectRoute) onSelectRoute(route.id);
      });

      routeLayersRef.current!.addLayer(polyline);

      if (route.coordinates.length > 0) {
        // Start Pin (Green)
        const startIcon = L.divIcon({
          className: "custom-start-marker",
          html: '<div style="width:16px;height:16px;border-radius:50%;background:#10B981;border:3px solid #ffffff;box-shadow:0 0 10px rgba(16,185,129,0.9);"></div>',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        L.marker(route.coordinates[0], { icon: startIcon }).addTo(routeLayersRef.current!);

        // End Pin (Red)
        const endIcon = L.divIcon({
          className: "custom-end-marker",
          html: '<div style="width:16px;height:16px;border-radius:50%;background:#EF4444;border:3px solid #ffffff;box-shadow:0 0 10px rgba(239,68,68,0.9);"></div>',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        L.marker(route.coordinates[route.coordinates.length - 1], { icon: endIcon }).addTo(routeLayersRef.current!);

        // Floating Route Badge in the middle of each route
        if (showFloatingRouteBadges) {
          const midIndex = Math.floor(route.coordinates.length / 2);
          const midCoord = route.coordinates[midIndex];
          const badgeHtml = `
            <div style="background:rgba(15,23,30,0.88);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,0.2);color:#fff;padding:3px 8px;border-radius:8px;font-size:10px;font-weight:700;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.5);cursor:pointer;text-align:center;">
              <span style="display:block;font-size:9px;color:${routeColor};">${route.name.split(' ')[0]} ${route.id === 'route-1' ? '1' : route.id === 'route-2' ? '2' : '3'}</span>
              <span>${route.durationMinutes} min | ${route.distanceKm} km</span>
            </div>
          `;

          const badgeMarker = L.marker(midCoord, {
            icon: L.divIcon({
              className: "route-floating-badge",
              html: badgeHtml,
              iconSize: [100, 32],
              iconAnchor: [50, 16],
            }),
          });
          badgeMarker.on("click", () => {
            if (onSelectRoute) onSelectRoute(route.id);
          });
          routeLayersRef.current!.addLayer(badgeMarker);
        }
      }
    });

    const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];
    if (activeRoute && activeRoute.coordinates.length > 0 && mapInstanceRef.current && !followUser) {
      const bounds = L.latLngBounds(activeRoute.coordinates);
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [routes, selectedRouteId, onSelectRoute, followUser, showFloatingRouteBadges]);

  // Render Risk Zones
  useEffect(() => {
    if (!mapInstanceRef.current || !riskZoneLayersRef.current) return;
    riskZoneLayersRef.current.clearLayers();

    if (!showRiskZones) return;

    riskZones.forEach((zone) => {
      const circle = L.circle(zone.center, {
        radius: zone.radiusMeters,
        color: zone.color,
        fillColor: zone.color,
        fillOpacity: 0.25,
        weight: 2,
        dashArray: "4, 6",
      });

      const iconHtml = `
        <div style="background:${zone.color};color:#fff;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 0 10px ${zone.color};border:2px solid #fff;font-weight:900;font-size:11px;cursor:pointer;">
          ⚠
        </div>
      `;

      const marker = L.marker(zone.center, {
        icon: L.divIcon({
          className: "risk-zone-icon",
          html: iconHtml,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      });

      const onClick = () => {
        if (onSelectZone) onSelectZone(zone);
      };

      circle.on("click", onClick);
      marker.on("click", onClick);

      circle.bindTooltip(`<b>${zone.name}</b><br/>${zone.accidentCount} historical incidents`, {
        direction: "top",
        className: "custom-leaflet-tooltip",
      });

      riskZoneLayersRef.current!.addLayer(circle);
      riskZoneLayersRef.current!.addLayer(marker);
    });
  }, [riskZones, showRiskZones, onSelectZone]);

  // Render Historical Accidents
  useEffect(() => {
    if (!mapInstanceRef.current || !accidentLayersRef.current) return;
    accidentLayersRef.current.clearLayers();

    if (!showAccidents) return;

    accidents.forEach((acc) => {
      const iconHtml = `
        <div style="background:#E15A2B;color:#fff;width:20px;height:20px;border-radius:5px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 0 8px rgba(225,90,43,0.8);font-size:10px;cursor:pointer;">
          💥
        </div>
      `;

      const marker = L.marker(acc.coordinates, {
        icon: L.divIcon({
          className: "accident-marker",
          html: iconHtml,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        }),
      });

      marker.on("click", () => {
        if (onSelectAccident) onSelectAccident(acc);
      });

      marker.bindTooltip(`<b>${acc.title}</b><br/>${acc.formattedDate}`, {
        direction: "top",
        className: "custom-leaflet-tooltip",
      });

      accidentLayersRef.current!.addLayer(marker);
    });
  }, [accidents, showAccidents, onSelectAccident]);

  // Render Ghost Hazards (Community Crowdsourced)
  useEffect(() => {
    if (!mapInstanceRef.current || !ghostHazardLayersRef.current) return;
    ghostHazardLayersRef.current.clearLayers();

    if (!showGhostHazards || ghostHazards.length === 0) return;

    ghostHazards.forEach((hazard) => {
      if (hazard.status !== 'active') return;

      const isCritical = hazard.severity === 'critical';
      const beaconColor = isCritical ? '#EF4444' : '#F97316';

      const iconHtml = `
        <div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
          <div style="position:absolute;width:28px;height:28px;border-radius:50%;background:${beaconColor};opacity:0.4;animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="width:20px;height:20px;border-radius:50%;background:${beaconColor};border:2px solid #ffffff;box-shadow:0 0 10px ${beaconColor};display:flex;align-items:center;justify-content:center;color:#ffffff;font-size:10px;font-weight:900;">
            🛡️
          </div>
        </div>
      `;

      const marker = L.marker(hazard.coordinates, {
        icon: L.divIcon({
          className: "ghost-hazard-marker",
          html: iconHtml,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        }),
      });

      marker.on("click", () => {
        if (onSelectGhostHazard) onSelectGhostHazard(hazard);
      });

      marker.bindTooltip(`<b>Ghost Hazard: ${hazard.title}</b><br/>${hazard.upvotes} verified`, {
        direction: "top",
        className: "custom-leaflet-tooltip",
      });

      ghostHazardLayersRef.current!.addLayer(marker);
    });
  }, [ghostHazards, showGhostHazards, onSelectGhostHazard]);

  // Render User Location
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (userLocation) {
      const userHtml = `
        <div style="transform: rotate(${userHeading}deg); width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: rgba(59, 130, 246, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 24px; height: 24px; border-radius: 50%; background: #3B82F6; border: 3px solid #ffffff; box-shadow: 0 0 14px rgba(59,130,246,0.9); display: flex; align-items: center; justify-content: center; color: white;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12,2 22,22 12,17 2,22" />
            </svg>
          </div>
        </div>
      `;

      const userIcon = L.divIcon({
        className: "user-vehicle-marker",
        html: userHtml,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      if (!userMarkerRef.current) {
        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(mapInstanceRef.current);
      } else {
        userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
        userMarkerRef.current.setIcon(userIcon);
      }

      if (followUser) {
        mapInstanceRef.current.panTo([userLocation.lat, userLocation.lng], { animate: true, duration: 0.5 });
      }
    }
  }, [userLocation, userHeading, followUser]);

  return (
    <div
      ref={mapContainerRef}
      className={className}
      style={{ width: "100%", height: "100%", minHeight: "100%", position: "relative" }}
    />
  );
}
