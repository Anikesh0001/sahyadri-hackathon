import { Bug, Developer, AIAnalysis, User } from '@/types';
import bugsData from '@/mock/bugs.json';
import devData from '@/mock/developers.json';
import aiData from '@/mock/ai-results.json';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

// Utility to simulate network delay
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// ---------------------------------------------------------------------------
// Helpers — try the real backend first; fall back to local mock data so the
// frontend keeps working even when the API is not reachable.
// ---------------------------------------------------------------------------

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(init?.headers as Record<string, string>) },
      ...init,
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export const api = {
  // Bugs
  getBugs: async (): Promise<Bug[]> => {
    const data = await fetchJSON<Bug[]>('/bugs');
    if (data) return data;
    await delay(800);
    return bugsData as Bug[];
  },

  getBugById: async (id: string): Promise<Bug | undefined> => {
    const data = await fetchJSON<Bug>(`/bugs/${id}`);
    if (data) return data;
    await delay(600);
    return (bugsData as Bug[]).find((b) => b.id === id);
  },

  submitBug: async (bug: Partial<Bug>): Promise<Bug> => {
    // Attempt real API — requires auth token stored in localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      const data = await fetchJSON<Bug>('/bugs', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` } as Record<string, string>,
        body: JSON.stringify(bug),
      });
      if (data) return data;
    }
    await delay(1200);
    return {
      ...bug,
      id: `bug-${Date.now()}`,
      status: 'Open',
      createdAt: new Date().toISOString(),
      bounty: 0,
      fundsRaised: 0,
      contributors: 0,
      aiScore: Math.floor(Math.random() * 40) + 60,
    } as Bug;
  },

  // Developers
  getDevelopers: async (): Promise<Developer[]> => {
    const data = await fetchJSON<Developer[]>('/ai/match-developers/bug-1');
    if (data) return data;
    await delay(500);
    return devData as Developer[];
  },

  getRecommendedDevelopers: async (bugId: string): Promise<Developer[]> => {
    const data = await fetchJSON<Developer[]>(`/ai/match-developers/${bugId}`);
    if (data) return data;
    await delay(1000);
    return (devData as Developer[]).slice(0, 2);
  },

  // AI Analysis
  getAIAnalysis: async (bugId: string): Promise<AIAnalysis> => {
    const data = await fetchJSON<AIAnalysis>('/ai/analyze-bug', {
      method: 'POST',
      body: JSON.stringify({ bugId }),
    });
    if (data) return data;

    await delay(1500);
    const analysis = (aiData as AIAnalysis[]).find((a) => a.bugId === bugId);
    if (analysis) return analysis;

    return {
      bugId,
      category: 'General Bug',
      complexity: 'Medium',
      estimatedBounty: 100,
      confidenceScore: 85,
      impactScore: { userImpact: 50, severity: 50, urgency: 50, popularity: 50 },
      nlpSummary: 'This issue requires further investigation by a developer.',
      errorClusters: ['Unknown'],
      logInsights: ['No specific insights mapped yet.'],
    };
  },
};
