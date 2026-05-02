// ============================================================
// BLOOM — Landing / Login Page
// Agent 3 (UI/UX Lead) — Premium onboarding experience
// ============================================================

import { useBloomStore } from '../../store/useBloomStore';
import { Flower2, ArrowRight, Shield, Brain, FileText, Heart, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const { loginAsDemo } = useBloomStore();

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

        {/* Feature Grid */}
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

        {/* Demo Login */}
        <div className="mt-10 space-y-4 w-full max-w-md">
          <div className="flex items-center gap-2 justify-center text-xs text-warm-400">
            <Sparkles size={14} className="text-bloom-400" />
            <span>Choose a demo profile to explore BLOOM</span>
          </div>

          <button
            className="w-full glass-card p-4 flex items-center gap-4 hover:shadow-bloom transition-all group"
            onClick={() => loginAsDemo('demo-sarah')}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-bloom-400 to-bloom-600 flex items-center justify-center text-white font-bold text-lg">S</div>
            <div className="flex-1 text-left">
              <p className="font-semibold">Sarah Mitchell, 29</p>
              <p className="text-xs text-warm-400">Reproductive stage · 90 days of data · Endometriosis patterns</p>
            </div>
            <ArrowRight size={18} className="text-warm-300 group-hover:text-bloom-500 transition-colors" />
          </button>

          <button
            className="w-full glass-card p-4 flex items-center gap-4 hover:shadow-bloom transition-all group"
            onClick={() => loginAsDemo('demo-priya')}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white font-bold text-lg">P</div>
            <div className="flex-1 text-left">
              <p className="font-semibold">Priya Sharma, 47</p>
              <p className="text-xs text-warm-400">Perimenopause · 90 days of data · Hot flash patterns</p>
            </div>
            <ArrowRight size={18} className="text-warm-300 group-hover:text-bloom-500 transition-colors" />
          </button>
        </div>

        <p className="text-[11px] text-warm-300 text-center mt-8 max-w-sm">
          BLOOM is a health tracking tool, not a medical device.
          Always consult healthcare professionals for medical decisions.
        </p>
      </div>
    </div>
  );
}
