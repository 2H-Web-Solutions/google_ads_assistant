import { GoogleGenerativeAI } from "@google/generative-ai";

// API Key sicher aus den Umgebungsvariablen laden
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

// Initialisierung der Google Generative AI Instanz
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Sendet einen Prompt an das Gemini-Modell und gibt die Antwort zurück.
 * Verwendet das Modell: gemini-3-flash-preview
 */
export async function getGeminiResponse(prompt: string): Promise<string> {
    if (!API_KEY) {
        console.error("VITE_GEMINI_API_KEY ist nicht gesetzt.");
        return "Systemfehler: API-Key fehlt.";
    }

    try {
        // Definition des Modells gemäß System-Vorgabe
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error("Fehler bei der Gemini-Kommunikation:", error);
        return "Ich konnte die Anfrage leider nicht verarbeiten. Bitte überprüfen Sie Ihre Verbindung oder den API-Key.";
    }
}
