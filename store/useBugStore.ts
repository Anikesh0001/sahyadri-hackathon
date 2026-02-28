import { create } from 'zustand';
import { Bug } from '@/types';

interface BugState {
  bugs: Bug[];
  setBugs: (bugs: Bug[]) => void;
  addBug: (bug: Bug) => void;
  fundBug: (bugId: string, amount: number) => void;
}

export const useBugStore = create<BugState>((set) => ({
  bugs: [],
  setBugs: (bugs) => set({ bugs }),
  addBug: (bug) => set((state) => ({ bugs: [bug, ...state.bugs] })),
  fundBug: (bugId, amount) => set((state) => ({
    bugs: state.bugs.map((b) => 
      b.id === bugId ? { 
        ...b, 
        fundsRaised: b.fundsRaised + amount, 
        contributors: b.contributors + 1 
      } : b
    )
  })),
}));
