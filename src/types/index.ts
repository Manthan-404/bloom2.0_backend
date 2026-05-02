// ============================================================
// BLOOM — Core Type Definitions
// Agent 1 (Full-Stack) + Agent 2 (Backend) shared types
// ============================================================

export type LifeStage =
  | 'puberty'
  | 'reproductive'
  | 'pregnancy'
  | 'postpartum'
  | 'perimenopause'
  | 'menopause'
  | 'post-menopause';

export type SymptomCategory =
  | 'pain'
  | 'mood'
  | 'energy'
  | 'digestive'
  | 'sleep'
  | 'reproductive'
  | 'skin'
  | 'cognitive'
  | 'other';

export type Severity = 1 | 2 | 3 | 4 | 5;

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  lifeStage: LifeStage;
  cycleLength: number;
  preferences: UserPreferences;
  createdAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  dataSharing: boolean;
  lifeStageAdaptive: boolean;
}

export interface SymptomLog {
  id: string;
  userId: string;
  date: string;
  cycleDay: number | null;
  symptoms: SymptomEntry[];
  mood: MoodEntry | null;
  energy: number;
  sleep: SleepEntry | null;
  notes: string;
  tags: string[];
  createdAt: string;
}

export interface SymptomEntry {
  id: string;
  name: string;
  category: SymptomCategory;
  severity: Severity;
  duration: string;
  location?: string;
}

export interface MoodEntry {
  primary: string;
  secondary: string[];
  score: number; // 1-10
}

export interface SleepEntry {
  hours: number;
  quality: Severity;
  disturbances: string[];
}

export interface PatternAlert {
  id: string;
  userId: string;
  type: 'pattern' | 'trend' | 'anomaly' | 'emergency';
  title: string;
  description: string;
  pattern: string;
  conditionsFlagged: string[];
  confidence: number; // 0-1
  severity: 'low' | 'medium' | 'high' | 'urgent';
  recommendation: string;
  dataPoints: number;
  dateRange: { start: string; end: string };
  isRead: boolean;
  createdAt: string;
}

export interface Condition {
  id: string;
  name: string;
  category: string;
  description: string;
  prevalence: string;
  commonSymptoms: string[];
  relatedConditions: string[];
  commonMisdiagnoses: string[];
  averageDiagnosisTime: string;
  lifeStageRelevance: LifeStage[];
  whenToSeeDoctor: string[];
  references: string[];
}

export interface LifeStageInfo {
  stage: LifeStage;
  ageRange: string;
  description: string;
  commonExperiences: string[];
  prioritySymptoms: string[];
  uiTheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface DoctorPrepReport {
  id: string;
  userId: string;
  generatedAt: string;
  dateRange: { start: string; end: string };
  summary: string;
  topSymptoms: { name: string; frequency: number; avgSeverity: number }[];
  patterns: PatternAlert[];
  questions: string[];
  timeline: { date: string; event: string }[];
  cycleData: { avgLength: number; irregularities: string[] };
}

export interface AskBloomMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: string[];
  disclaimer?: string;
}

export interface AskBloomConversation {
  id: string;
  userId: string;
  messages: AskBloomMessage[];
  topic: string;
  createdAt: string;
}

export interface DemoUser {
  user: User;
  symptomLogs: SymptomLog[];
  patterns: PatternAlert[];
  conversations: AskBloomConversation[];
  doctorPrep: DoctorPrepReport;
}
