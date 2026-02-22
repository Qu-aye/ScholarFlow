import { ParaphraseMode, ModeConfig } from './types';

export const MODES: ModeConfig[] = [
  { 
    id: ParaphraseMode.Standard, 
    label: 'Standard', 
    description: 'Balanced rewrite. Retains meaning.', 
    color: 'bg-blue-500' 
  },
  { 
    id: ParaphraseMode.Fluency, 
    label: 'Fluency', 
    description: 'Improves grammar and flow.', 
    color: 'bg-green-500' 
  },
  { 
    id: ParaphraseMode.Academic, 
    label: 'Academic', 
    description: 'Formal, objective, research-ready.', 
    color: 'bg-indigo-600' 
  },
  { 
    id: ParaphraseMode.Humanize, 
    label: 'Humanize (Max)', 
    description: 'Aggressive undetectability focus.', 
    color: 'bg-rose-500' 
  },
  { 
    id: ParaphraseMode.Creative, 
    label: 'Creative', 
    description: 'More metaphors and variety.', 
    color: 'bg-purple-500' 
  },
  { 
    id: ParaphraseMode.Formal, 
    label: 'Formal', 
    description: 'Professional business tone.', 
    color: 'bg-slate-600' 
  },
  { 
    id: ParaphraseMode.Shorten, 
    label: 'Shorten', 
    description: 'Concise, remove fluff.', 
    color: 'bg-amber-500' 
  },
  { 
    id: ParaphraseMode.Expand, 
    label: 'Expand', 
    description: 'Add depth and detail.', 
    color: 'bg-cyan-500' 
  },
  { 
    id: ParaphraseMode.Simple, 
    label: 'Simple', 
    description: 'Plain English, easy to read.', 
    color: 'bg-teal-500' 
  },
];

export const PROMPTS: Record<ParaphraseMode, string> = {
  [ParaphraseMode.Standard]: "Rewrite the text to be clear and natural. Avoid robotic phrasing. Keep the meaning but vary the vocabulary.",
  [ParaphraseMode.Fluency]: "Fix all grammatical errors and improve the flow. Ensure the text reads smoothly like a native speaker wrote it.",
  [ParaphraseMode.Academic]: "Rewrite this for an academic context. Use precise terminology and a formal tone. Ensure it bypasses AI detection by using varied sentence structures typical of human researchers. Strictly maintain the original perspective.",
  [ParaphraseMode.Creative]: "Rewrite creatively. Use evocative language and varied sentence rhythms. Make it sound unique and human.",
  [ParaphraseMode.Shorten]: "Condense the text while keeping the core message. Be concise and direct.",
  [ParaphraseMode.Expand]: "Elaborate on the text. Add relevant context and depth to the explanation while maintaining a natural flow.",
  [ParaphraseMode.Simple]: "Simplify the language. Use plain English and shorter sentences for better readability.",
  [ParaphraseMode.Formal]: "Rewrite in a professional business tone. Be polite, direct, and sophisticated.",
  [ParaphraseMode.Humanize]: "Rewrite this text to be 100% undetectable by AI detectors. \n\nCRITICAL INSTRUCTIONS:\n1. MIMIC HUMAN BURSTINESS: Mix short, punchy sentences with longer, complex ones.\n2. HIGH PERPLEXITY: Use unexpected but fitting vocabulary.\n3. PERSPECTIVE: Strictly maintain the exact original perspective (e.g., 'I' remains 'I').\n4. AVOID AI PATTERNS: Do not use words like 'delve', 'underscore', 'realm', 'tapestry', 'furthermore'.\n5. GOAL: The output must score 0% on GPTZero and Originality.ai.",
};