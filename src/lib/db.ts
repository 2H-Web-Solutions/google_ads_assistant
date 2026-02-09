import { collection, doc } from 'firebase/firestore';
import { db } from './firebase';

export const APP_ID = '2h_web_solutions_google_ads_asssitant_v1';

// Helper to get full path
export const getAppCollection = (subPath: string) => {
    return collection(db, `apps/${APP_ID}/${subPath}`);
};

export const getAppDoc = (subPath: string, docId: string) => {
    return doc(db, `apps/${APP_ID}/${subPath}`, docId);
};

// Types
export interface UnitEconomics {
    aov: number;          // Average Order Value
    targetRoas: number;   // Ziel ROAS (z.B. 4.0 für 400%)
    taxRate: number;      // Steuersatz in %
    returnRate: number;   // Retourenquote in %
    cogs: number;         // Cost of Goods Sold in %
    fulfillmentCost: number; // Versand/Handling in Währung
}

export interface Client {
    id: string;
    name: string;
    website: string;
    industry?: string;
    description?: string;
    unitEconomics?: UnitEconomics;
    createdAt: any;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}
