// ============================================================
// BLOOM — Main App Entry
// Agent 1 (Full-Stack Lead) — Root Component
// ============================================================

import { useBloomStore } from './store/useBloomStore';
import AppShell from './components/layout/AppShell';
import LandingPage from './components/onboarding/LandingPage';
import Questionnaire from './components/onboarding/Questionnaire';

export default function App() {
  const { isAuthenticated, showQuestionnaire } = useBloomStore();

  // Not logged in → Landing
  if (!isAuthenticated) return <LandingPage />;

  // Logged in but questionnaire pending → Show questionnaire overlay
  if (showQuestionnaire) return <Questionnaire />;

  // Fully set up → Main app
  return <AppShell />;
}
