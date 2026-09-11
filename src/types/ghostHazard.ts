export type HazardCategory =
  | 'pothole'
  | 'broken_vehicle'
  | 'oil_spill'
  | 'stray_animals'
  | 'unlit_speedbreaker'
  | 'dense_fog'
  | 'waterlogging'
  | 'road_debris';

export interface GhostHazard {
  id: string;
  category: HazardCategory;
  title: string;
  description: string;
  coordinates: [number, number]; // [lat, lng]
  locationName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reportedAt: string; // ISO string
  reportedBy: string;
  upvotes: number;
  downvotes: number;
  verifiedCount: number;
  status: 'active' | 'cleared' | 'investigating';
  suggestedAction: string;
  recommendedSpeedCapKmh?: number;
  imageUrl?: string;
  userVoted?: 'up' | 'down' | null;
}

export const HAZARD_META: Record<HazardCategory, { label: string; icon: string; color: string; defaultAdvice: string }> = {
  pothole: {
    label: 'Pothole / Crater',
    icon: 'AlertCircle',
    color: '#F97316',
    defaultAdvice: 'Slow down and avoid sudden swerving into adjacent traffic lanes.',
  },
  broken_vehicle: {
    label: 'Broken-Down Vehicle / Blind Spot',
    icon: 'CarAlert',
    color: '#EF4444',
    defaultAdvice: 'Stationary vehicle ahead on lane shoulder. Switch lanes early.',
  },
  oil_spill: {
    label: 'Oil Spill / Slick Road',
    icon: 'Droplet',
    color: '#DC2626',
    defaultAdvice: 'Extreme skid risk. Do not brake abruptly. Keep handlebars/steering straight.',
  },
  stray_animals: {
    label: 'Stray Cattle / Wildlife',
    icon: 'PawPrint',
    color: '#EAB308',
    defaultAdvice: 'Cattle on road divider. Dim high-beams and reduce speed to 30 km/h.',
  },
  unlit_speedbreaker: {
    label: 'Unlit / Unmarked Speedbreaker',
    icon: 'Activity',
    color: '#F59E0B',
    defaultAdvice: 'Unpainted high bump ahead. Decelerate to 15 km/h.',
  },
  dense_fog: {
    label: 'Sudden Fog / Smog Pocket',
    icon: 'CloudFog',
    color: '#94A3B8',
    defaultAdvice: 'Visibility below 25m. Turn on low-beam fog lamps and hazard blinkers.',
  },
  waterlogging: {
    label: 'Deep Waterlogging / Submerged Culvert',
    icon: 'Waves',
    color: '#3B82F6',
    defaultAdvice: 'Water level exceeding 200mm. Slow down to prevent aquaplaning.',
  },
  road_debris: {
    label: 'Construction Debris / Fallen Tree',
    icon: 'Construction',
    color: '#FB923C',
    defaultAdvice: 'Loose gravel/debris on tarmac. Maintain extra stopping distance.',
  },
};
