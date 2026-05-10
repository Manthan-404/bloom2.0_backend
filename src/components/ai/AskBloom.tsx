// ============================================================
// BLOOM — Ask Bloom AI Chat
// Agent 2 (AI Lead) + Agent 3 (UI/UX)
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { useBloomStore } from '../../store/useBloomStore';
import { generateBloomResponse, generateGeminiResponse, checkEmergencySymptoms } from '../../utils/aiEngine';
import { Brain, Send, Sparkles, AlertTriangle, ShieldCheck, Key } from 'lucide-react';

export default function AskBloom() {
  const { conversations, symptomLogs, addConversationMessage } = useBloomStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('bloom_gemini_key') || '');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conv = conversations[0]; // Use first conversation

  useEffect(() => {
    localStorage.setItem('bloom_gemini_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conv?.messages]);

  const handleSend = async () => {
    if (!input.trim() || !conv) return;

    // Check for emergency
    const emergency = checkEmergencySymptoms([input]);
    if (emergency) {
      addConversationMessage(conv.id, {
        id: `user-${Date.now()}`, role: 'user', content: input, timestamp: new Date().toISOString()
      });
      addConversationMessage(conv.id, {
        id: `emg-${Date.now()}`, role: 'assistant', content: emergency.message,
        timestamp: new Date().toISOString(), disclaimer: 'Seek immediate medical help.'
      });
      setInput('');
      return;
    }

    // Add user message
    addConversationMessage(conv.id, {
      id: `user-${Date.now()}`, role: 'user', content: input, timestamp: new Date().toISOString()
    });

    setInput('');
    setIsTyping(true);

    if (apiKey) {
      // Use actual Gemini API
      const response = await generateGeminiResponse(input, symptomLogs, apiKey);
      addConversationMessage(conv.id, response);
      setIsTyping(false);
    } else {
      // Fallback to simulated response
      setTimeout(() => {
        const response = generateBloomResponse(input, symptomLogs);
        addConversationMessage(conv.id, response);
        setIsTyping(false);
      }, 1200);
    }
  };

  const suggestions = [
    'Why is my pelvic pain getting worse?',
    'Tell me about my fatigue patterns',
    'What should I ask my doctor?',
    'Explain my cycle patterns',
  ];

  return (
    <div className="space-y-4 flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-display)] flex items-center gap-2">
            <Brain className="text-bloom-500" size={24} /> Ask Bloom
          </h1>
          <p className="text-warm-400 text-sm mt-1 flex items-center gap-2">
            AI insights backed by clinical research data
            <span className="badge badge-bloom text-[10px] px-2 py-0.5">Research Mode</span>
          </p>
        </div>
        
        {/* API Key Input */}
        <div className="relative w-full md:w-64 shrink-0">
          <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
          <input
            type="password"
            placeholder="Gemini API Key (Optional)"
            className="bloom-input pl-8 text-xs w-full py-1.5 min-h-0"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-[9px] text-warm-400 mt-1 ml-1">Connect API key for live responses</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
        <ShieldCheck size={16} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-amber-800">
          <strong>Important:</strong> Bloom provides pattern observations compared to clinical datasets (WHO, NIH). 
          This is for health education, not medical diagnoses. Always consult a healthcare professional.
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {conv?.messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={msg.role === 'user' ? 'chat-user' : 'chat-assistant'}>
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-1 mb-2 text-bloom-600">
                  <Sparkles size={12} /> <span className="text-xs font-semibold">Bloom AI</span>
                </div>
              )}
              <div className="text-sm ai-content whitespace-pre-line">{msg.content}</div>
              {msg.disclaimer && (
                <p className="text-[10px] text-warm-400 mt-2 flex items-center gap-1">
                  <AlertTriangle size={10} /> {msg.disclaimer}
                </p>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="chat-assistant">
              <div className="flex items-center gap-2 text-bloom-400">
                <Sparkles size={14} className="animate-[pulse-soft_1.5s_ease-in-out_infinite]" />
                <span className="text-sm">Bloom is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {conv?.messages.length <= 4 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map(s => (
            <button
              key={s}
              className="px-3 py-1.5 rounded-full text-xs bg-bloom-50 text-bloom-700 hover:bg-bloom-100 transition-all border border-bloom-200"
              onClick={() => setInput(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3">
        <input
          className="bloom-input flex-1"
          placeholder="Ask Bloom anything about your health patterns..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button
          className="btn-bloom px-4"
          onClick={handleSend}
          disabled={!input.trim()}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
