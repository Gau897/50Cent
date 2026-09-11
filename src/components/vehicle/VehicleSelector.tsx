"use client";
import React from "react";
import { Bike, Car, CarFront, Truck, Zap, ShieldAlert, Check } from "lucide-react";
import { VehicleType, VEHICLE_PROFILES, VehicleProfile } from "@/types/vehicle";

interface VehicleSelectorProps {
  selectedVehicle: VehicleType;
  onSelectVehicle: (vehicle: VehicleType) => void;
  className?: string;
}

export default function VehicleSelector({
  selectedVehicle,
  onSelectVehicle,
  className = "",
}: VehicleSelectorProps) {
  const vehicleList = Object.values(VEHICLE_PROFILES);

  const getVehicleIcon = (type: VehicleType) => {
    switch (type) {
      case 'two_wheeler':
        return <Bike className="w-4 h-4" />;
      case 'car':
        return <Car className="w-4 h-4" />;
      case 'suv':
        return <CarFront className="w-4 h-4" />;
      case 'heavy_truck':
        return <Truck className="w-4 h-4" />;
      case 'ev':
        return <Zap className="w-4 h-4 text-emerald-400" />;
      default:
        return <Car className="w-4 h-4" />;
    }
  };

  const currentProfile = VEHICLE_PROFILES[selectedVehicle];

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Vehicle Profile
          </span>
          <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded border border-blue-500/30">
            Dynamic Risk Weighting
          </span>
        </div>
        <span className="text-[11px] text-[#8A9BA8]">{currentProfile.name}</span>
      </div>

      {/* 5 Vehicle Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {vehicleList.map((v) => {
          const isSelected = v.id === selectedVehicle;
          return (
            <button
              key={v.id}
              onClick={() => onSelectVehicle(v.id)}
              className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#192833] border-[#3B82F6] ring-1 ring-[#3B82F6] shadow-lg shadow-blue-500/20'
                  : 'bg-[#121B22] border-[#243743] hover:border-[#344F61] text-[#8A9BA8] hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`p-1.5 rounded-lg ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-[#17242D] text-[#8A9BA8]'
                  }`}
                >
                  {getVehicleIcon(v.id)}
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
              </div>

              <div className="mt-2">
                <span className={`text-xs font-bold block ${isSelected ? 'text-white' : 'text-[#8A9BA8]'}`}>
                  {v.name.split(' ')[0]}
                </span>
                <span className="text-[9px] text-[#64748B] block truncate">
                  {v.category}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Vehicle Risk Factors Overview */}
      <div className="p-3 rounded-xl bg-[#141F28] border border-[#243743] text-xs space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#8A9BA8]">Braking Multiplier: <strong className="text-white">{currentProfile.baseBrakingDistanceMultiplier}x</strong></span>
          <span className="text-[#8A9BA8]">Wading Limit: <strong className="text-blue-400">{currentProfile.maxSafeWaterDepthMm}mm</strong></span>
          <span className="text-[#8A9BA8]">Risk Mod: <strong className={currentProfile.dynamicRiskModifier > 0 ? 'text-amber-400' : 'text-emerald-400'}>{currentProfile.dynamicRiskModifier > 0 ? `+${currentProfile.dynamicRiskModifier}%` : '0%'}</strong></span>
        </div>
        <p className="text-[11px] text-[#8A9BA8] border-t border-[#243743] pt-1.5 line-clamp-1">
          💡 {currentProfile.keyPrecautions[0]}
        </p>
      </div>
    </div>
  );
}
