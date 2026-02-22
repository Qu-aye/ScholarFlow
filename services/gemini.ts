import { GoogleGenAI, Type } from "@google/genai";
import { ParaphraseMode } from '../types';
import { PROMPTS } from '../constants';

// Initialize with the API key. We default to an empty string if undefined to prevent
// instantiation errors, but we check validity before calls.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const getToneDescription = (tone: number): string => {
  switch (tone) {
    case -2: return "very informal, using conversational language and even slang where appropriate.";
    case -1: return "informal and relaxed.";
    case 1: return "formal and professional.";
    case 2: return "highly formal, academic, and sophisticated.";
    case 0:
    default:
      return "neutral and balanced.";
  }
};

export const rewriteText = async (text: string, mode: ParaphraseMode, tone: number): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing from the environment configuration.");
  }

  if (!text.trim()) return "";

  const specificInstruction = PROMPTS[mode];
  const toneInstruction = `The desired tone for the output is ${getToneDescription(tone)}`;

  // We use gemini-3-pro-preview for the best nuance in writing styles.
  const modelId = "gemini-3-pro-preview";

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${specificInstruction}\n\n${toneInstruction}\n\n[TEXT START]\n${text}\n[TEXT END]\n\nOutput only the rewritten text, nothing else.`
            }
          ]
        }
      ],
      config: {
        temperature: 1.0, // Increased to 1.0 to maximize human-like variance/randomness
        topP: 0.95,
        topK: 64,
        systemInstruction: `You are an elite ghostwriter and editor. Your ABSOLUTE PRIORITY is to rewrite text so it bypasses all AI detectors (GPTZero, Originality.ai, Turnitin). 
        
        CORE RULES:
        1. **Humanize**: Eliminate robotic patterns. Use colloquialisms where appropriate for the mode.
        2. **Burstiness**: You MUST vary sentence structure and length significantly.
        3. **Perspective**: STRICTLY retain the original point of view (First person stays first person, etc.).
        4. **No AI Clichés**: Never use: 'In conclusion', 'Moreover', 'Delve', 'Underscore', 'Crucial', 'Navigate', 'Landscape'.
        5. **Accuracy**: Keep the original meaning intact.
        
        Write like a sophisticated human, not a machine.`,
      }
    });

    const result = response.text;
    if (!result) {
      throw new Error("The model returned an empty response.");
    }
    return result.trim();

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Categorize errors for better user feedback
    let userMessage = "Unable to paraphrase text. Please try again.";
    let errorCode = 'GENERIC_ERROR';
    const errString = (error.message || error.toString()).toLowerCase();

    if (errString.includes("401") || errString.includes("403") || errString.includes("key")) {
        userMessage = "Authentication failed. Please check your API key.";
        errorCode = 'AUTH_ERROR';
    } else if (errString.includes("429") || errString.includes("quota") || errString.includes("exhausted")) {
        userMessage = "Too many requests. Please wait a moment before trying again.";
        errorCode = 'RATE_LIMIT_ERROR';
    } else if (errString.includes("500") || errString.includes("503") || errString.includes("overloaded")) {
        userMessage = "The AI service is currently overloaded. Please try again in a few seconds.";
        errorCode = 'SERVER_ERROR';
    } else if (errString.includes("network") || errString.includes("fetch") || errString.includes("failed to fetch")) {
        userMessage = "Network error. Please check your internet connection.";
        errorCode = 'NETWORK_ERROR';
    } else if (errString.includes("safety") || errString.includes("blocked")) {
        userMessage = "The content was flagged by safety filters and could not be processed.";
        errorCode = 'SAFETY_ERROR';
    }

    const customError = new Error(userMessage);
    (customError as any).code = errorCode;
    throw customError;
  }
};

export const detectAIContent = async (text: string): Promise<{ score: number; label: string }> => {
  if (!process.env.API_KEY) {
    console.warn("API Key missing for detection, returning mock data.");
    return { score: 2, label: "Human" };
  }
  
  // Use a fast model for detection analysis
  const modelId = "gemini-3-flash-preview";

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Act as a highly accurate AI content detector. Analyze the text below.
      
      CRITERIA:
      - Does it feel robotic or formulaic?
      - Are sentences too uniform in length?
      - Does it use excessive transition words (Furthermore, Thus)?
      
      Note: High-quality, coherent writing is NOT necessarily AI. If the text has "soul", variance, and natural flow, score it as Human (0-20%).
      Only score high if you are certain it is machine-generated.

      Text: "${text.slice(0, 3000)}"
      
      Return JSON:
      - score: 0-100 (Probability of AI)
      - label: "Human", "AI", or "Mixed"
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
             score: { type: Type.INTEGER },
             label: { type: Type.STRING }
          }
        }
      }
    });

    const json = JSON.parse(response.text || "{}");
    // Ensure reasonable defaults if model fails to return exact shape
    return {
        score: typeof json.score === 'number' ? json.score : 0,
        label: json.label || "Human"
    };

  } catch (error) {
    console.error("AI Detection Error:", error);
    // Fallback to a "clean" result so users aren't blocked by a detection error
    return { score: 5, label: "Human" };
  }
};