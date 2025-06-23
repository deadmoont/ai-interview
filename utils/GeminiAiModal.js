// util/GeminiAiModal.js
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY, // Or use a safer server variable
});

export async function getInterviewQA(promptText) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: promptText }] }],
    });

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("No response received from Gemini.");

    // Optionally extract JSON if you know you're expecting JSON
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonString = text.slice(jsonStart, jsonEnd + 1);
      return JSON.parse(jsonString);
    }

    return text; // fallback if not a JSON array
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
