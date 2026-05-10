// ============================================================
// BLOOM — Global State Store (Zustand)
// Agent 1 (Full-Stack Lead) — Centralized App State
// ============================================================

import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';
import { getDemoUser } from '../data/demoData';
import type {
  User,
  SymptomLog,
  PatternAlert,
  AskBloomConversation,
  AskBloomMessage,
  DoctorPrepReport,
  QuestionnaireData,
} from '../types';

interface BloomState {
  // Auth
  isAuthenticated: boolean;
  isDemoMode: boolean;
  currentUser: User | null;
  questionnaireCompleted: boolean;
  showQuestionnaire: boolean;

  // Data
  symptomLogs: SymptomLog[];
  patterns: PatternAlert[];
  conversations: AskBloomConversation[];
  doctorPrep: DoctorPrepReport | null;

  // UI
  currentView: string;
  sidebarOpen: boolean;

  // Actions — Auth
  loginAsDemo: (userId: string) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;

  // Actions — Questionnaire
  saveQuestionnaire: (data: QuestionnaireData) => Promise<void>;
  skipQuestionnaire: () => void;

  // Actions — Data
  addSymptomLog: (log: SymptomLog) => Promise<void>;
  markPatternRead: (patternId: string) => void;
  addConversationMessage: (conversationId: string, message: AskBloomMessage) => void;

  // Actions — UI
  setCurrentView: (view: string) => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useBloomStore = create<BloomState>((set) => ({
  // ---- Initial State ----
  isAuthenticated: false,
  isDemoMode: false,
  currentUser: null,
  questionnaireCompleted: false,
  showQuestionnaire: false,
  symptomLogs: [],
  patterns: [],
  conversations: [],
  doctorPrep: null,
  currentView: 'dashboard',
  sidebarOpen: false,

  // ---- Auth Actions ----
  loginAsDemo: (userId) => {
    const demo = getDemoUser(userId);
    if (!demo) return;
    set({
      isAuthenticated: true,
      isDemoMode: true,
      currentUser: demo.user,
      symptomLogs: demo.symptomLogs,
      patterns: demo.patterns,
      conversations: demo.conversations,
      doctorPrep: demo.doctorPrep,
      questionnaireCompleted: true,
      showQuestionnaire: false,
      currentView: 'dashboard',
    });
  },

  login: async (email, password) => {
    // Use Supabase client-side auth for session management
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // Check if questionnaire is completed
    let qCompleted = false;
    try {
      const profile = await api.getProfile();
      qCompleted = profile?.questionnaireCompleted || false;
    } catch {
      // If profile fetch fails, proceed anyway
    }

    const logs = await api.getLogs();
    set({
      isAuthenticated: true,
      currentUser: data.user as any,
      symptomLogs: logs,
      isDemoMode: false,
      questionnaireCompleted: qCompleted,
      showQuestionnaire: !qCompleted,
      currentView: qCompleted ? 'dashboard' : 'dashboard',
    });
  },

  register: async (email, password, name) => {
    // Register via backend (creates auth user + profile)
    try {
      await api.register(email, password, name);
    } catch (err: any) {
      throw new Error(err.message || 'Registration failed');
    }

    // Now sign in client-side to get a session
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    set({
      isAuthenticated: true,
      currentUser: data.user as any,
      isDemoMode: false,
      questionnaireCompleted: false,
      showQuestionnaire: true,
      currentView: 'dashboard',
    });
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({
      isAuthenticated: false,
      isDemoMode: false,
      currentUser: null,
      symptomLogs: [],
      patterns: [],
      conversations: [],
      doctorPrep: null,
      questionnaireCompleted: false,
      showQuestionnaire: false,
      currentView: 'dashboard',
      sidebarOpen: false,
    });
  },

  // ---- Questionnaire Actions ----
  saveQuestionnaire: async (data) => {
    try {
      await api.saveQuestionnaire(data);
      set({
        questionnaireCompleted: true,
        showQuestionnaire: false,
      });
    } catch (err) {
      console.error('Questionnaire save failed:', err);
      throw err;
    }
  },

  skipQuestionnaire: () => {
    set({
      showQuestionnaire: false,
    });
  },

  // ---- Data Actions ----
  addSymptomLog: async (log) => {
    const state = useBloomStore.getState();

    // Demo mode — sirf local save
    if (state.isDemoMode) {
      const demoLog = { ...log, id: Math.random().toString(36).substr(2, 9) };
      set((s) => ({ symptomLogs: [...s.symptomLogs, demoLog] }));
      return;
    }

    // Real user — Supabase DB mein save
    try {
      const response = await api.addLog(log);
      if (response.error) throw new Error(response.error.message || 'Failed to save log');
      
      set((s) => ({ symptomLogs: [...s.symptomLogs, response] }));
    } catch (err) {
      console.error('Log save failed:', err);
      // Optional: keep local for now, but usually better to show error
      set((s) => ({ symptomLogs: [...s.symptomLogs, { ...log, id: 'temp-' + Date.now() }] }));
    }
  },

  markPatternRead: (patternId) =>
    set((state) => ({
      patterns: state.patterns.map((p) =>
        p.id === patternId ? { ...p, isRead: true } : p
      ),
    })),

  addConversationMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? { ...conv, messages: [...conv.messages, message] }
          : conv
      ),
    })),

  // ---- UI Actions ----
  setCurrentView: (view) => set({ currentView: view }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));

supabase.auth.getSession().then(async ({ data: { session } }) => {
  if (session) {
    try {
      const logsData = await api.getLogs();
      // Array ensure karo — agar error aaye toh empty array
      const logs = Array.isArray(logsData) ? logsData : [];
      
      let qCompleted = false;
      try {
        const profile = await api.getProfile();
        qCompleted = profile?.questionnaireCompleted || false;
      } catch { /* ignore */ }

      useBloomStore.setState({
        isAuthenticated: true,
        currentUser: session.user as any,
        symptomLogs: logs,  // ← guaranteed array
        isDemoMode: false,
        questionnaireCompleted: qCompleted,
        showQuestionnaire: !qCompleted,
      });
    } catch (err) {
      console.error('Session restore failed:', err);
      // Error pe bhi app crash mat karo
      useBloomStore.setState({
        isAuthenticated: true,
        currentUser: session.user as any,
        symptomLogs: [],
        isDemoMode: false,
        questionnaireCompleted: false,
        showQuestionnaire: true,
      });
    }
  }
});;

// Auth state listener — logout detect karo
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || !session) {
    useBloomStore.setState({
      isAuthenticated: false,
      isDemoMode: false,
      currentUser: null,
      symptomLogs: [],
      patterns: [],
      conversations: [],
      doctorPrep: null,
      questionnaireCompleted: false,
      showQuestionnaire: false,
    });
  }
});
