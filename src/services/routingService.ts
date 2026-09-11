import { Route } from '@/types/route';
import { mockRoutes } from '@/mock/mockRoutes';

export class RoutingService {
  static getRouteById(id: string): Route | undefined {
    return mockRoutes.find(r => r.id === id);
  }

  static getSafestRoute(): Route {
    return mockRoutes.find(r => r.isRecommended) || mockRoutes[1];
  }

  static getFastestRoute(): Route {
    return mockRoutes.find(r => r.type === 'fastest') || mockRoutes[0];
  }
}
