// src/lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BRAIN_RULES, AgentRole } from "./ai/roles";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

// KONFIGURATION: Wir verwenden strikt das neueste Modell laut Projekt-Vorgaben.
const MODEL_NAME = "gemini-3-flash-preview";

/**
 * Sendet einen Prompt an Gemini mit spezifischen "Brain Rules".
 * @param prompt Die User-Eingabe
 * @param role Die Rolle des Agenten (Standard: ASSISTANT)
 * @param context Optionaler Daten-Kontext (z.B. CSV-Inhalt als String)
 */
export async function getGeminiResponse(
    prompt: string,
    role: AgentRole = 'ASSISTANT',
    context: string = ""
): Promise<string> {
    if (!API_KEY) {
        console.error("⚠️ SYSTEM ERROR: VITE_GEMINI_API_KEY ist nicht gesetzt.");
        return "Systemfehler: API-Key fehlt. Bitte .env überprüfen.";
    }

    try {
        // 1. Modell Initialisierung (Gemini 3 Flash Preview)
        // System Instructions werden direkt im Modell konfiguriert
        const model = genAI.getGenerativeModel({
            model: MODEL_NAME,
            systemInstruction: BRAIN_RULES.CORE + "\n\n" + (BRAIN_RULES[role] || "")
        });

        // 2. Prompt Zusammensetzung
        const finalPrompt = `
CONTEXT DATA:
${context}

USER QUESTION:
${prompt}
        `.trim();

        // 3. Request
        const result = await model.generateContent(finalPrompt);
        const response = await result.response;
        return response.text();

    } catch (error: any) {
        console.error(`❌ Gemini Error (${MODEL_NAME}):`, error);

        // Spezifische Fehlerbehandlung für 404/Modell nicht gefunden
        if (error.message?.includes("404") || error.message?.includes("not found")) {
            return `Fehler: Das Modell '${MODEL_NAME}' ist nicht erreichbar oder der API-Key hat keinen Zugriff darauf.`;
        }

        return `⚠️ SYSTEM ERROR: ${error.message || "Unbekannter Fehler bei der KI-Verarbeitung."}`;
    }
}
