"use client";
import { GhostHazard, HazardCategory } from '@/types/ghostHazard';
import { mockGhostHazards } from '@/mock/mockGhostHazards';

class GhostHazardStore {
  private hazards: GhostHazard[] = [...mockGhostHazards];
  private listeners: Set<() => void> = new Set();

  public getHazards(): GhostHazard[] {
    return this.hazards;
  }

  public getActiveHazards(): GhostHazard[] {
    return this.hazards.filter((h) => h.status === 'active');
  }

  public addHazard(newHazard: Omit<GhostHazard, 'id' | 'reportedAt' | 'upvotes' | 'downvotes' | 'verifiedCount' | 'status'>): GhostHazard {
    const created: GhostHazard = {
      ...newHazard,
      id: `ghost-${Date.now()}`,
      reportedAt: new Date().toISOString(),
      upvotes: 1,
      downvotes: 0,
      verifiedCount: 1,
      status: 'active',
      userVoted: 'up',
    };
    this.hazards = [created, ...this.hazards];
    this.notify();
    return created;
  }

  public vote(id: string, type: 'up' | 'down') {
    this.hazards = this.hazards.map((h) => {
      if (h.id !== id) return h;
      if (h.userVoted === type) return h; // already voted

      let up = h.upvotes;
      let down = h.downvotes;

      if (h.userVoted === 'up' && type === 'down') {
        up = Math.max(0, up - 1);
        down += 1;
      } else if (h.userVoted === 'down' && type === 'up') {
        down = Math.max(0, down - 1);
        up += 1;
      } else if (!h.userVoted) {
        if (type === 'up') up += 1;
        if (type === 'down') down += 1;
      }

      // If too many downvotes, mark as cleared
      const status = down > up + 4 ? 'cleared' : h.status;

      return {
        ...h,
        upvotes: up,
        downvotes: down,
        verifiedCount: up,
        userVoted: type,
        status,
      };
    });
    this.notify();
  }

  public markCleared(id: string) {
    this.hazards = this.hazards.map((h) => (h.id === id ? { ...h, status: 'cleared' } : h));
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }
}

export const ghostHazardStore = new GhostHazardStore();
