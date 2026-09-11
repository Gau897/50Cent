export type VehicleType = 'two_wheeler' | 'car' | 'suv' | 'heavy_truck' | 'ev';

export interface VehicleProfile {
  id: VehicleType;
  name: string;
  category: string;
  icon: string;
  description: string;
  baseBrakingDistanceMultiplier: number;
  rollOverRiskMultiplier: number;
  wetRoadSlipVulnerability: number;
  windGustSensitivity: number;
  maxSafeWaterDepthMm: number;
  dynamicRiskModifier: number;
  keyPrecautions: string[];
}

export const VEHICLE_PROFILES: Record<VehicleType, VehicleProfile> = {
  two_wheeler: {
    id: 'two_wheeler',
    name: '2-Wheeler (Bike / Scooter)',
    category: 'Vulnerable Road User',
    icon: 'Bike',
    description: 'High vulnerability to wet road markings, oil slicks, crosswinds, and sudden potholes.',
    baseBrakingDistanceMultiplier: 1.35,
    rollOverRiskMultiplier: 1.8,
    wetRoadSlipVulnerability: 2.2,
    windGustSensitivity: 2.5,
    maxSafeWaterDepthMm: 120,
    dynamicRiskModifier: 15,
    keyPrecautions: [
      'Avoid painted road markings and metal drain covers in wet weather.',
      'Maintain 3x following distance behind heavy commercial trucks.',
      'Reduce speed by 35% during sudden rain or micro-weather gusts.',
    ],
  },
  car: {
    id: 'car',
    name: 'Passenger Car (Hatchback / Sedan)',
    category: 'Standard Passenger',
    icon: 'Car',
    description: 'Balanced center of gravity with standard ABS and electronic stability control.',
    baseBrakingDistanceMultiplier: 1.0,
    rollOverRiskMultiplier: 1.0,
    wetRoadSlipVulnerability: 1.0,
    windGustSensitivity: 1.0,
    maxSafeWaterDepthMm: 250,
    dynamicRiskModifier: 0,
    keyPrecautions: [
      'Maintain standard 2-second gap in dry conditions, 4-second in wet.',
      'Inspect tire tread depth for aquaplaning prevention.',
    ],
  },
  suv: {
    id: 'suv',
    name: 'SUV / 4x4 / Crossover',
    category: 'High Ground Clearance',
    icon: 'CarFront',
    description: 'Higher ground clearance with elevated center of gravity and increased rollover risk at speed.',
    baseBrakingDistanceMultiplier: 1.15,
    rollOverRiskMultiplier: 1.5,
    wetRoadSlipVulnerability: 0.9,
    windGustSensitivity: 1.3,
    maxSafeWaterDepthMm: 450,
    dynamicRiskModifier: 5,
    keyPrecautions: [
      'Decelerate before taking sharp highway exit ramps to prevent body roll.',
      'Use high-traction 4WD mode in deep waterlogged sectors.',
    ],
  },
  heavy_truck: {
    id: 'heavy_truck',
    name: 'Heavy Commercial Truck / Bus',
    category: 'Heavy Transport',
    icon: 'Truck',
    description: 'Long stopping distance, severe blind spots, and high roll-over risk on tight curves.',
    baseBrakingDistanceMultiplier: 2.1,
    rollOverRiskMultiplier: 2.4,
    wetRoadSlipVulnerability: 1.6,
    windGustSensitivity: 1.8,
    maxSafeWaterDepthMm: 600,
    dynamicRiskModifier: 22,
    keyPrecautions: [
      'Do not exceed 30 km/h on flyover ramps or downhill gradients.',
      'Avoid sudden hard braking to prevent cargo shifting and jackknifing.',
      'Maintain 75m buffer distance in high-risk blackspots.',
    ],
  },
  ev: {
    id: 'ev',
    name: 'Electric Vehicle (EV)',
    category: 'Electric Powertrain',
    icon: 'Zap',
    description: 'Instant torque, underbody battery pack water sealing constraints, and regenerative braking dynamics.',
    baseBrakingDistanceMultiplier: 1.05,
    rollOverRiskMultiplier: 0.85,
    wetRoadSlipVulnerability: 1.25,
    windGustSensitivity: 0.9,
    maxSafeWaterDepthMm: 300,
    dynamicRiskModifier: 4,
    keyPrecautions: [
      'Limit water wading to below 300mm to safeguard battery pack and high-voltage cabling.',
      'Moderate regenerative braking intensity on slippery or gravel roads.',
      'Plan charging stops ahead when traversing steep hill climbs.',
    ],
  },
};
