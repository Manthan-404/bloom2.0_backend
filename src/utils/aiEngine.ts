// ============================================================
// BLOOM — AI Engine (Pattern Detection + Ask Bloom)
// Agent 2 (AI & Backend Lead) — Core Intelligence
// ============================================================

import { SymptomLog, PatternAlert, AskBloomMessage } from '../types';
import { conditionLibrary } from '../data/conditions';

// ---- Pattern Detection Pipeline ----
export function detectPatterns(logs: SymptomLog[], userId: string): PatternAlert[] {
  if (logs.length < 42) return []; // Require 6+ weeks of data

  const alerts: PatternAlert[] = [];
  const symptomMap = new Map<string, { severity: number; count: number; dates: string[] }>();

  // Aggregate symptoms
  logs.forEach(log => {
    log.symptoms.forEach(s => {
      const existing = symptomMap.get(s.name) || { severity: 0, count: 0, dates: [] };
      existing.severity += s.severity;
      existing.count += 1;
      existing.dates.push(log.date);
      symptomMap.set(s.name, existing);
    });
  });

  // Check for high-frequency severe symptoms
  symptomMap.forEach((data, name) => {
    const avgSeverity = data.severity / data.count;
    const frequency = data.count / logs.length;

    if (avgSeverity >= 3.5 && frequency >= 0.3) {
      const matchedConditions = conditionLibrary
        .filter(c => c.commonSymptoms.some(cs =>
          cs.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(cs.toLowerCase().split(' ')[0])
        ))
        .map(c => c.name)
        .slice(0, 3);

      if (matchedConditions.length > 0) {
        alerts.push({
          id: `detected-${Date.now()}-${name}`,
          userId,
          type: 'pattern',
          title: `Recurring ${name} Pattern Detected`,
          description: `${name} has been logged ${data.count} times over ${logs.length} days with an average severity of ${avgSeverity.toFixed(1)}/5.`,
          pattern: `${name} at avg severity ${avgSeverity.toFixed(1)} appearing ${(frequency * 100).toFixed(0)}% of tracked days.`,
          conditionsFlagged: matchedConditions,
          confidence: Math.min(0.9, frequency * avgSeverity / 5),
          severity: avgSeverity >= 4 ? 'high' : avgSeverity >= 3 ? 'medium' : 'low',
          recommendation: `This pattern of ${name.toLowerCase()} may be worth discussing with a healthcare provider.`,
          dataPoints: data.count,
          dateRange: { start: logs[0].date, end: logs[logs.length - 1].date },
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }
    }
  });

  return alerts;
}

// ---- Ask Bloom AI Responses (Demo Mode) ----
const BLOOM_RESPONSES: Record<string, string> = {
  default: "I've looked at your symptom data and here's what I can share:\n\nBased on your recent logs, I notice some patterns that may be worth tracking. Remember, I'm here to help you understand your symptoms better, but I'm not a replacement for professional medical advice.\n\nWould you like me to:\n• Analyze a specific symptom pattern?\n• Generate a doctor visit prep report?\n• Explain a specific condition from our library?\n\n⚠️ *This is not medical advice or diagnosis.*",

  pain: "Looking at your pain-related symptoms in your logs:\n\n• **Frequency**: Pain symptoms appear regularly in your tracking data\n• **Severity pattern**: The severity tends to fluctuate with your cycle\n• **Associated symptoms**: Pain often co-occurs with fatigue and bloating\n\n**What this might mean:**\nRecurring cyclical pain is common, but severe pain that interferes with daily life deserves medical attention. Several conditions can cause this pattern.\n\n**Suggested next steps:**\n1. Continue tracking pain severity and timing\n2. Note what helps and what doesn't\n3. Consider discussing with your healthcare provider\n\n⚠️ *I'm not providing a diagnosis. Only a healthcare professional can evaluate and diagnose your symptoms.*",

  fatigue: "Analyzing your energy and fatigue patterns:\n\n• **When it peaks**: Your fatigue tends to be more pronounced during certain phases of your cycle\n• **Sleep connection**: On days with lower energy, your sleep quality also tends to be affected\n• **Impact**: This pattern has been consistent across your tracking period\n\n**Possible factors worth exploring:**\n- Hormonal fluctuations through your cycle\n- Iron levels (especially if you have heavy periods)\n- Thyroid function\n- Sleep quality\n\n**What you can do:**\n1. Track when fatigue is worst relative to your cycle\n2. Consider asking your doctor about blood work\n3. Monitor sleep patterns alongside energy levels\n\n⚠️ *This is pattern observation, not diagnosis. Please consult a healthcare provider for evaluation.*",

  period: "Based on your menstrual cycle data:\n\n• **Cycle regularity**: Your cycles show specific patterns in length and flow\n• **Symptom timing**: Certain symptoms consistently cluster around specific cycle phases\n• **Flow patterns**: Your data helps identify what's typical for you\n\n**Understanding your cycle:**\nEvery person's cycle is unique. What matters most is understanding YOUR normal and noticing when things change.\n\n**Red flags to watch for:**\n- Bleeding through a pad/tampon in 1-2 hours\n- Cycles shorter than 21 or longer than 35 days\n- Sudden changes in your established pattern\n- Bleeding between periods\n\n⚠️ *Always consult a healthcare provider about concerning menstrual changes.*",

  hotflash: "Looking at your vasomotor symptom data:\n\n• **Frequency**: Hot flashes and night sweats appear frequently in your logs\n• **Impact on sleep**: Night sweats are significantly affecting your sleep quality\n• **Pattern**: These symptoms are consistent with hormonal transition\n\n**Context:**\nDuring perimenopause, fluctuating estrogen levels can trigger these vasomotor symptoms. They're very common and there are many management options.\n\n**Management strategies to discuss with your doctor:**\n1. Lifestyle modifications (cooling techniques, trigger avoidance)\n2. Mind-body approaches\n3. Hormone therapy options\n4. Non-hormonal medications\n\n⚠️ *This is informational context, not medical advice. Your healthcare provider can recommend the best approach for you.*"
};

export function generateBloomResponse(userMessage: string, _logs: SymptomLog[]): AskBloomMessage {
  const msg = userMessage.toLowerCase();
  let responseKey = 'default';

  if (msg.includes('pain') || msg.includes('cramp') || msg.includes('hurt')) responseKey = 'pain';
  else if (msg.includes('tired') || msg.includes('fatigue') || msg.includes('energy')) responseKey = 'fatigue';
  else if (msg.includes('period') || msg.includes('cycle') || msg.includes('menstr')) responseKey = 'period';
  else if (msg.includes('hot flash') || msg.includes('sweat') || msg.includes('menopause')) responseKey = 'hotflash';

  return {
    id: `bloom-${Date.now()}`,
    role: 'assistant',
    content: BLOOM_RESPONSES[responseKey],
    timestamp: new Date().toISOString(),
    disclaimer: 'This is not medical advice or diagnosis. Always consult a healthcare professional.',
  };
}

// ---- Emergency Detection ----
export function checkEmergencySymptoms(symptoms: string[]): { isEmergency: boolean; message: string } | null {
  const emergencyKeywords = [
    'chest pain', 'can\'t breathe', 'severe bleeding', 'fainting',
    'suicidal', 'self-harm', 'unresponsive', 'seizure',
    'sudden severe headache', 'vision loss', 'heavy bleeding won\'t stop'
  ];

  const found = symptoms.filter(s =>
    emergencyKeywords.some(e => s.toLowerCase().includes(e))
  );

  if (found.length > 0) {
    return {
      isEmergency: true,
      message: '🚨 The symptoms you described may require immediate medical attention. Please contact emergency services (911) or go to your nearest emergency room immediately. If you are having thoughts of self-harm, please call the 988 Suicide & Crisis Lifeline.'
    };
  }
  return null;
}
