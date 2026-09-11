"use client";
import React from "react";
import { Route } from "@/types/route";
import RouteCard from "./RouteCard";

interface RouteListProps {
  routes: Route[];
  selectedRouteId: string;
  onSelectRoute: (id: string) => void;
}

export default function RouteList({ routes, selectedRouteId, onSelectRoute }: RouteListProps) {
  if (routes.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
          Available Routes ({routes.length})
        </h3>
        <span className="text-[11px] text-[#64748B]">Ranked by Safety Rating</span>
      </div>
      <div className="space-y-2.5">
        {routes.map((r) => (
          <RouteCard
            key={r.id}
            route={r}
            isSelected={r.id === selectedRouteId}
            onSelect={() => onSelectRoute(r.id)}
          />
        ))}
      </div>
    </div>
  );
}
