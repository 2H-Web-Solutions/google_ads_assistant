import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const KNOWLEDGE_PATH = 'apps/2h_web_solutions_google_ads_asssitant_v1/knowledge/global_brain/items';

// Simple in-memory cache to reduce Firestore reads (since this data is static/low-velocity)
let cachedKnowledge: string | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 Hour

export async function getExpertKnowledge(): Promise<string> {
    const now = Date.now();
    if (cachedKnowledge && (now - lastFetchTime < CACHE_DURATION)) {
        return cachedKnowledge;
    }

    try {
        console.log("🧠 Fetching Global Brain from Firestore...");
        const querySnapshot = await getDocs(collection(db, KNOWLEDGE_PATH));

        let combinedKnowledge = "GLOBAL ADS BRAIN & RULES:\n=========================\n";

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            combinedKnowledge += `\n[MODULE: ${data.title}]\n${data.content}\n-------------------------\n`;
        });

        cachedKnowledge = combinedKnowledge;
        lastFetchTime = now;
        return combinedKnowledge;
    } catch (error) {
        console.error("❌ Failed to load Expert Knowledge:", error);
        return ""; // Fail gracefully so the chat doesn't break
    }
}
