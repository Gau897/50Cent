import { mockAccidents } from '@/mock/mockAccidents';
import { mockRiskZones } from '@/mock/mockRiskZones';
import { Accident } from '@/types/accident';
import { RiskZone } from '@/types/riskZone';

export class AccidentService {
  static getAllAccidents(): Accident[] {
    return mockAccidents;
  }

  static getAccidentsByZone(zoneId: string): Accident[] {
    return mockAccidents.filter(a => a.riskZoneId === zoneId);
  }

  static getAllRiskZones(): RiskZone[] {
    return mockRiskZones;
  }

  static getRiskZoneById(id: string): RiskZone | undefined {
    return mockRiskZones.find(z => z.id === id);
  }
}
