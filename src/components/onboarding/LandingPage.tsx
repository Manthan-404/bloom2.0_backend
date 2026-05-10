// ============================================================
// BLOOM — Landing / Login / Register Page
// Agent 3 (UI/UX Lead) — Premium onboarding experience
// ============================================================

import { useState } from 'react';
import { useBloomStore } from '../../store/useBloomStore';
import {
  Flower2, ArrowRight, Shield, Brain, FileText, Heart,
  Sparkles, Lock, Mail, ChevronLeft, UserPlus, LogIn, User, Eye, EyeOff
} from 'lucide-react';

type AuthMode = 'landing' | 'login' | 'register';

export default function LandingPage() {
  const { loginAsDemo, login, register } = useBloomStore();
  const [mode, setMode] = useState<AuthMode>('landing');
  const [selectedDemo, setSelectedDemo] = useState<'demo-sarah' | 'demo-priya' | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelectDemo = (id: 'demo-sarah' | 'demo-priya') => {
    setSelectedDemo(id);
    setEmail(id === 'demo-sarah' ? 'sarah@demo.bloom' : 'priya@demo.bloom');
    setPassword('');
    setError('');
    setMode('login');
  };

  const handleDemoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== 'demo123') {
      setError('Invalid password. Hint: try "demo123"');
      return;
    }
    if (selectedDemo) {
      loginAsDemo(selectedDemo);
    }
  };

  const handleRealLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(email, password, name);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetToLanding = () => {
    setMode('landing');
    setSelectedDemo(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setError('');
  };

  const features = [
    { icon: Heart, title: 'Track Symptoms', desc: 'Log daily symptoms with severity, mood, energy, and sleep tracking' },
    { icon: Brain, title: 'AI Pattern Detection', desc: 'Intelligent analysis finds patterns across your health data' },
    { icon: FileText, title: 'Doctor-Ready Reports', desc: 'Generate comprehensive summaries for your healthcare visits' },
    { icon: Shield, title: 'Privacy First', desc: 'Your data stays private. No diagnosis — only pattern insights' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Floating bloom animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-bloom-400 to-rose-400 flex items-center justify-center shadow-bloom animate-[float_6s_ease-in-out_infinite]">
            <Flower2 size={48} className="text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-sage-300 animate-[pulse-soft_3s_ease-in-out_infinite]" />
          <div className="absolute -bottom-1 -left-3 w-4 h-4 rounded-full bg-rose-300 animate-[pulse-soft_3s_ease-in-out_infinite_0.5s]" />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold font-[var(--font-display)] text-center">
          <span className="gradient-text">BLOOM</span>
        </h1>
        <p className="text-lg md:text-xl text-warm-500 text-center mt-3 max-w-lg font-light">
          Your AI-powered women's health companion.
          <br />Track symptoms. Detect patterns. Own your health.
        </p>

        {/* Feature Grid — only on landing */}
        {mode === 'landing' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 max-w-2xl w-full">
            {features.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="glass-card p-5 flex gap-4 items-start animate-[slide-up_0.4s_ease-out]">
                  <div className="w-10 h-10 rounded-xl bg-bloom-100 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-bloom-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{f.title}</h3>
                    <p className="text-xs text-warm-400 mt-1">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Auth Section */}
        <div className="mt-10 w-full max-w-md">
          {mode === 'landing' && (
            <div className="space-y-4 animate-[slide-up_0.3s_ease-out]">
              {/* Create Account CTA */}
              <button
                className="w-full btn-bloom py-4 text-base flex items-center justify-center gap-2"
                onClick={() => setMode('register')}
              >
                <UserPlus size={20} /> Create Your Account
              </button>

              {/* Login link */}
              <button
                className="w-full btn-bloom-outline py-3 flex items-center justify-center gap-2"
                onClick={() => { setMode('login'); setSelectedDemo(null); }}
              >
                <LogIn size={18} /> Sign In
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-warm-200" />
                <span className="text-xs text-warm-400">or try a demo</span>
                <div className="flex-1 h-px bg-warm-200" />
              </div>

              {/* Demo profiles */}
              <div className="space-y-3">
                <button
                  className="w-full glass-card p-4 flex items-center gap-4 hover:shadow-bloom transition-all group"
                  onClick={() => handleSelectDemo('demo-sarah')}
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-bloom-400 to-bloom-600 flex items-center justify-center text-white font-bold text-lg">S</div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">Sarah Mitchell</p>
                    <p className="text-xs text-warm-400">sarah@demo.bloom</p>
                  </div>
                  <ArrowRight size={18} className="text-warm-300 group-hover:text-bloom-500 transition-colors" />
                </button>

                <button
                  className="w-full glass-card p-4 flex items-center gap-4 hover:shadow-bloom transition-all group"
                  onClick={() => handleSelectDemo('demo-priya')}
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center text-white font-bold text-lg">P</div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">Priya Sharma</p>
                    <p className="text-xs text-warm-400">priya@demo.bloom</p>
                  </div>
                  <ArrowRight size={18} className="text-warm-300 group-hover:text-bloom-500 transition-colors" />
                </button>
              </div>
            </div>
          )}

          {/* ---- REGISTER FORM ---- */}
          {mode === 'register' && (
            <div className="glass-card p-6 animate-[slide-up_0.3s_ease-out]">
              <button
                onClick={resetToLanding}
                className="text-warm-400 hover:text-bloom-600 flex items-center gap-1 text-xs mb-4 transition-colors"
              >
                <ChevronLeft size={14} /> Back
              </button>

              <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                <UserPlus className="text-bloom-500" size={20} /> Create Account
              </h2>
              <p className="text-xs text-warm-400 mb-5">Join Bloom to start your health journey</p>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs text-warm-500 mb-1 ml-1">Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="bloom-input pl-10 w-full"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-warm-500 mb-1 ml-1">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="bloom-input pl-10 w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-warm-500 mb-1 ml-1">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="bloom-input pl-10 pr-10 w-full"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-bloom-500"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-warm-500 mb-1 ml-1">Confirm Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="bloom-input pl-10 w-full"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-rose-500 animate-[pulse-soft_2s_ease-in-out_infinite]">{error}</p>
                )}

                <button type="submit" className="btn-bloom w-full py-3 mt-2 flex items-center justify-center gap-2" disabled={loading}>
                  {loading ? (
                    <span className="q-spinner" />
                  ) : (
                    <>
                      <Sparkles size={16} /> Create Account
                    </>
                  )}
                </button>
              </form>

              <p className="text-xs text-warm-400 text-center mt-4">
                Already have an account?{' '}
                <button
                  onClick={() => { setMode('login'); setSelectedDemo(null); setError(''); }}
                  className="text-bloom-600 hover:underline font-medium"
                >
                  Sign In
                </button>
              </p>
            </div>
          )}

          {/* ---- LOGIN FORM ---- */}
          {mode === 'login' && (
            <div className="glass-card p-6 animate-[slide-up_0.3s_ease-out]">
              <button
                onClick={resetToLanding}
                className="text-warm-400 hover:text-bloom-600 flex items-center gap-1 text-xs mb-4 transition-colors"
              >
                <ChevronLeft size={14} /> Back
              </button>

              <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                <Lock className="text-bloom-500" size={20} /> {selectedDemo ? 'Demo Login' : 'Welcome Back'}
              </h2>
              {selectedDemo && (
                <p className="text-xs text-warm-400 mb-4">Password hint: "demo123"</p>
              )}
              {!selectedDemo && (
                <p className="text-xs text-warm-400 mb-5">Sign in to your Bloom account</p>
              )}

              <form onSubmit={selectedDemo ? handleDemoLogin : handleRealLogin} className="space-y-4">
                <div>
                  <label className="block text-xs text-warm-500 mb-1 ml-1">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!!selectedDemo}
                      placeholder="you@example.com"
                      className={`bloom-input pl-10 w-full ${selectedDemo ? 'bg-warm-50/50 cursor-not-allowed opacity-70' : ''}`}
                      autoFocus={!selectedDemo}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-warm-500 mb-1 ml-1">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={selectedDemo ? 'Enter password (demo123)' : 'Your password'}
                      className="bloom-input pl-10 pr-10 w-full"
                      autoFocus={!!selectedDemo}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-bloom-500"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-rose-500 animate-[pulse-soft_2s_ease-in-out_infinite]">{error}</p>
                )}

                <button type="submit" className="btn-bloom w-full py-3 mt-2 flex items-center justify-center gap-2" disabled={loading}>
                  {loading ? (
                    <span className="q-spinner" />
                  ) : (
                    'Sign In to BLOOM'
                  )}
                </button>
              </form>

              {!selectedDemo && (
                <p className="text-xs text-warm-400 text-center mt-4">
                  Don't have an account?{' '}
                  <button
                    onClick={() => { setMode('register'); setError(''); }}
                    className="text-bloom-600 hover:underline font-medium"
                  >
                    Create Account
                  </button>
                </p>
              )}
            </div>
          )}
        </div>

        <p className="text-[11px] text-warm-300 text-center mt-8 max-w-sm">
          BLOOM is a health tracking tool, not a medical device.
          Always consult healthcare professionals for medical decisions.
        </p>
      </div>
    </div>
  );
}
