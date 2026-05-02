// ============================================================
// BLOOM — Condition Library
// Agent 4 (Content Lead) + Agent 3 (UI/UX)
// ============================================================

import { useState } from 'react';
import { conditionLibrary } from '../../data/conditions';
import { useBloomStore } from '../../store/useBloomStore';
import { Library, Search, Clock, AlertTriangle, ChevronDown, ChevronUp, BookOpen, Users } from 'lucide-react';

export default function ConditionLibrary() {
  const { currentUser } = useBloomStore();
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'relevant'>('all');

  const filtered = conditionLibrary
    .filter(c => {
      if (filter === 'relevant' && currentUser) {
        return c.lifeStageRelevance.includes(currentUser.lifeStage);
      }
      return true;
    })
    .filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.commonSymptoms.some(s => s.toLowerCase().includes(search.toLowerCase()))
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-display)] flex items-center gap-2">
          <Library className="text-bloom-500" size={24} /> Condition Library
        </h1>
        <p className="text-warm-400 text-sm mt-1">
          Research-backed information on {conditionLibrary.length} conditions affecting women's health
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
          <input
            className="bloom-input pl-10"
            placeholder="Search conditions, symptoms, or categories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'all' ? 'bg-bloom-500 text-white' : 'bg-white/60 text-warm-600'}`}
            onClick={() => setFilter('all')}
          >All ({conditionLibrary.length})</button>
          <button
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'relevant' ? 'bg-bloom-500 text-white' : 'bg-white/60 text-warm-600'}`}
            onClick={() => setFilter('relevant')}
          >Relevant to You</button>
        </div>
      </div>

      {/* Condition Cards */}
      <div className="space-y-3">
        {filtered.map(condition => (
          <div
            key={condition.id}
            className="glass-card overflow-hidden cursor-pointer"
            onClick={() => setExpanded(expanded === condition.id ? null : condition.id)}
          >
            <div className="p-4 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{condition.name}</h3>
                  <span className="badge badge-bloom text-[10px]">{condition.category}</span>
                  {currentUser && condition.lifeStageRelevance.includes(currentUser.lifeStage) && (
                    <span className="badge badge-sage text-[10px]">Relevant to you</span>
                  )}
                </div>
                <p className="text-xs text-warm-500 mt-1 line-clamp-2">{condition.description}</p>
                <div className="flex items-center gap-4 mt-2 text-[11px] text-warm-400">
                  <span className="flex items-center gap-1"><Users size={12} /> {condition.prevalence.split('.')[0]}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> Avg diagnosis: {condition.averageDiagnosisTime}</span>
                </div>
              </div>
              {expanded === condition.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            {expanded === condition.id && (
              <div className="px-4 pb-4 space-y-4 animate-[slide-up_0.3s_ease-out] border-t border-warm-100 pt-4">
                {/* Symptoms */}
                <div>
                  <h4 className="text-xs font-semibold text-warm-600 uppercase tracking-wide mb-2">Common Symptoms</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {condition.commonSymptoms.map(s => (
                      <span key={s} className="px-2 py-1 rounded-lg bg-bloom-50 text-xs text-bloom-700">{s}</span>
                    ))}
                  </div>
                </div>

                {/* Misdiagnoses */}
                <div>
                  <h4 className="text-xs font-semibold text-warm-600 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <AlertTriangle size={12} className="text-amber-500" /> Common Misdiagnoses
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {condition.commonMisdiagnoses.map(m => (
                      <span key={m} className="px-2 py-1 rounded-lg bg-amber-50 text-xs text-amber-700 border border-amber-200">{m}</span>
                    ))}
                  </div>
                </div>

                {/* When to see doctor */}
                <div>
                  <h4 className="text-xs font-semibold text-warm-600 uppercase tracking-wide mb-2">When to See a Doctor</h4>
                  <ul className="space-y-1">
                    {condition.whenToSeeDoctor.map((w, i) => (
                      <li key={i} className="text-xs text-warm-600 flex items-start gap-2">
                        <span className="text-rose-400 mt-0.5">•</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* References */}
                <div>
                  <h4 className="text-xs font-semibold text-warm-600 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <BookOpen size={12} /> References
                  </h4>
                  <ul className="text-[11px] text-warm-400 space-y-0.5">
                    {condition.references.map((r, i) => (
                      <li key={i}>• {r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-warm-400">
          <Library size={40} className="mx-auto mb-3 opacity-30" />
          <p>No conditions match your search.</p>
        </div>
      )}
    </div>
  );
}
