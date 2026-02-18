import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const firebaseConfig = {
    apiKey: "AIzaSyDSRyiURMO0n0wOHPAlt6T3o75mEXUjmZc",
    authDomain: "up-seo-apps.firebaseapp.com",
    projectId: "up-seo-apps",
    storageBucket: "up-seo-apps.firebasestorage.app",
    messagingSenderId: "222992510170",
    appId: "1:222992510170:web:7d4ba13971c730e340c9e3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const CATEGORY_MAP = {
    "ADS_LAYOUT_MAP": "Interface",
    "ADS_TECH_VALIDATION": "Technik",
    "ADS_BRAIN": "Strategie",
    "ADS_ERROR_PROTOCOL": "Fehlerbehebung",
    "ADS_BRAND_VOICE": "Brand Voice",
    "ADS_KPI_LOGIC": "Reporting"
};

async function main() {
    try {
        console.log("Authenticating...");
        await signInAnonymously(auth);
        console.log("Authenticated as: " + auth.currentUser?.uid);

        const rawPath = path.join(__dirname, "knowledge_raw.json");
        const rawData = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

        for (const note of rawData) {
            console.log(`Processing ${note.title}...`);

            if (!note.title || !note.content) {
                console.warn(`Skipping note due to missing title or content. Note ID/Index: ${rawData.indexOf(note)}`);
                continue;
            }

            const category = CATEGORY_MAP[note.title] || "Allgemein";

            const docData = {
                title: note.title || "Untitled",
                content: note.content || "",
                category: category,
                tags: ["notebooklm", "auto-import"],
                lastUpdated: serverTimestamp(),
                source: "NotebookLM"
            };

            // Path correction: apps/{ID}/knowledge (Col) / global_brain (Doc) / items (Col) / Title (Doc)
            // 6 segments = Valid Document Path.
            const collectionPath = "apps/2h_web_solutions_google_ads_asssitant_v1/knowledge/global_brain/items";
            const docRef = doc(db, collectionPath, note.title);

            console.log(`Writing to Firestore path: ${docRef.path}`);

            await setDoc(docRef, docData, { merge: true });
            console.log(`Matched and wrote: ${note.title}`);
        }
        console.log("Transfer complete.");
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

main();
