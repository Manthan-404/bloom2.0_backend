// ============================================================
// BLOOM — Global State Store (Zustand)
// Agent 1 (Full-Stack Lead) — State Management
// ============================================================

import { create } from 'zustand';
import { User, SymptomLog, PatternAlert, AskBloomConversation, DoctorPrepReport } from '../types';
import { demoUsers } from '../data/demoData';

interface BloomState {
  // Auth
  isAuthenticated: boolean;
  currentUser: User | null;
  isDemoMode: boolean;

  // Data
  symptomLogs: SymptomLog[];
  patterns: PatternAlert[];
  conversations: AskBloomConversation[];
  doctorPrep: DoctorPrepReport | null;

  // UI
  sidebarOpen: boolean;
  currentView: string;
  onboardingComplete: boolean;

  // Actions
  loginAsDemo: (userId: string) => void;
  logout: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentView: (view: string) => void;
  addSymptomLog: (log: SymptomLog) => void;
  markPatternRead: (id: string) => void;
  addConversationMessage: (convId: string, message: any) => void;
  setOnboardingComplete: (complete: boolean) => void;
}

export const useBloomStore = create<BloomState>((set, get) => ({
  isAuthenticated: false,
  currentUser: null,
  isDemoMode: false,
  symptomLogs: [],
  patterns: [],
  conversations: [],
  doctorPrep: null,
  sidebarOpen: false,
  currentView: 'dashboard',
  onboardingComplete: false,

  loginAsDemo: (userId: string) => {
    const demo = demoUsers.find(d => d.user.id === userId);
    if (demo) {
      set({
        isAuthenticated: true,
        currentUser: demo.user,
        isDemoMode: true,
        symptomLogs: demo.symptomLogs,
        patterns: demo.patterns,
        conversations: demo.conversations,
        doctorPrep: demo.doctorPrep,
        onboardingComplete: true,
      });
    }
  },

  logout: () => set({
    isAuthenticated: false,
    currentUser: null,
    isDemoMode: false,
    symptomLogs: [],
    patterns: [],
    conversations: [],
    doctorPrep: null,
    onboardingComplete: false,
  }),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrentView: (view) => set({ currentView: view }),

  addSymptomLog: (log) => set((s) => ({ symptomLogs: [...s.symptomLogs, log] })),

  markPatternRead: (id) => set((s) => ({
    patterns: s.patterns.map(p => p.id === id ? { ...p, isRead: true } : p)
  })),

  addConversationMessage: (convId, message) => set((s) => ({
    conversations: s.conversations.map(c =>
      c.id === convId ? { ...c, messages: [...c.messages, message] } : c
    )
  })),

  setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),
}));
