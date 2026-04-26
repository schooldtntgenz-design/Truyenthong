import { GoogleGenAI } from "@google/genai";

const MODELS = ['gemini-3-flash-preview', 'gemini-3.1-pro-preview', 'gemini-3.1-flash-lite-preview'];

export async function callGeminiAI(
  prompt: string, 
  customApiKey?: string, 
  preferredModel?: string,
  modelIndex = 0
): Promise<string | null> {
  // Use custom API key if provided, otherwise fallback to system key
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('API Key is missing. Please set it in Settings.');
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelName = preferredModel && modelIndex === 0 ? preferredModel : MODELS[modelIndex];

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    return response.text || '';
  } catch (error: any) {
    console.error(`Error with model ${modelName}:`, error);
    
    // Check for rate limit or specific errors that warrant a fallback
    const isRateLimit = error?.message?.includes('429') || error?.status === 429;
    
    if (isRateLimit && modelIndex < MODELS.length - 1) {
      console.log(`Rate limited on ${modelName}, failing over to ${MODELS[modelIndex + 1]}`);
      return callGeminiAI(prompt, customApiKey, undefined, modelIndex + 1);
    }
    
    throw error;
  }
}
