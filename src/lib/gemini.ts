import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API Key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("❌ Missing VITE_GEMINI_API_KEY in .env file");
}

// Initialize the Model (Gemini 1.5 Flash is efficient for this use case)
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Generic function to send a prompt to Gemini and get a text response.
 * @param prompt The prompt string to send.
 * @returns The generated text response.
 */
export const runGemini = async (prompt: string): Promise<string> => {
    try {
        if (!API_KEY) throw new Error("Gemini API Key is missing.");

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error("Error communicating with Gemini:", error);
        return "I'm sorry, I encountered an error while processing your request. Please check your connection or API key.";
    }
};
