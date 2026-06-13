import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

export async function getInterviewQA(promptText) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: promptText,
    });

    const text = response.text;

    if (!text) {
      throw new Error("No response received from Gemini.");
    }

    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
