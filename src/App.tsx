// ============================================================
// BLOOM — Main App Entry
// Agent 1 (Full-Stack Lead) — Root Component
// ============================================================

import { useBloomStore } from './store/useBloomStore';
import AppShell from './components/layout/AppShell';
import LandingPage from './components/onboarding/LandingPage';

export default function App() {
  const { isAuthenticated } = useBloomStore();

  return isAuthenticated ? <AppShell /> : <LandingPage />;
}
