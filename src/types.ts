export interface Client {
    id: string;
    name: string;
    website?: string;
    industry?: string;
    description?: string;
    googleAdsCustomerId?: string;
    audit?: {
        products?: string;
        strategy?: string;
        [key: string]: any;
    };
    unitEconomics?: any;
    lastSyncedAt?: any; // potentially Timestamp or Date or string
    [key: string]: any;
}
