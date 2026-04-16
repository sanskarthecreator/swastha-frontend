import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeLabel(imageData: string, conditions: string[], language: string = "English") {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    You are Swastha, a health-focused food label analyzer. 
    Analyze the provided food label image specifically for a user managing these conditions: ${conditions.join(", ")}.
    
    IMPORTANT: Provide the entire analysis (product name, summary, warnings, and alternatives) in ${language}.
    
    Focus on:
    1. Hidden ingredients that trigger flare-ups or worsen these specific conditions.
    2. Identify harmful additives using their complex chemical names (e.g., "Tertiary Butylhydroquinone (TBHQ)", "Monosodium Glutamate (MSG)", "E621", "High Fructose Corn Syrup").
    3. Provide a safety rating: "green" (safe), "yellow" (caution), or "red" (harmful/dangerous) relative to these conditions.
    4. Provide a very concise 1-sentence summary (max 15 words) that explains the overall health impact.
    5. Suggest 2-3 healthier Indian alternatives that are safe for these conditions.
    
    Return the analysis in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageData.split(",")[1],
            },
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: { type: Type.STRING },
            rating: { type: Type.STRING, enum: ["green", "yellow", "red"] },
            summary: { type: Type.STRING, description: "A very concise 1-sentence summary (max 15 words)" },
            warnings: {
              type: Type.ARRAY,
              items: { 
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "The complex chemical name or additive code" },
                  explanation: { type: Type.STRING, description: "Simple explanation of the risk" }
                },
                required: ["name", "explanation"]
              },
            },
            nutrients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.STRING },
                  impact: { type: Type.STRING, enum: ["positive", "negative", "neutral"] },
                },
                required: ["label", "value", "impact"],
              },
            },
            alternatives: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ["name", "reason"],
              },
            },
          },
          required: ["productName", "rating", "summary", "warnings", "nutrients", "alternatives"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI model");
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
}
