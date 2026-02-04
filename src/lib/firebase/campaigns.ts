import { updateDoc } from 'firebase/firestore';
import { getAppDoc } from '../db';

export type CampaignStatus = 'active' | 'paused' | 'archived';

/**
 * Updates the status of a specific campaign.
 * @param clientId The ID of the client.
 * @param campaignId The ID of the campaign to update.
 * @param status The new status ('active', 'paused', 'archived').
 */
export async function updateCampaignStatus(clientId: string, campaignId: string, status: CampaignStatus) {
    if (!clientId || !campaignId) throw new Error("Client ID and Campaign ID are required.");

    const campaignRef = getAppDoc(`clients/${clientId}/campaigns`, campaignId);

    await updateDoc(campaignRef, {
        status: status,
        updatedAt: new Date() // specific field update doesn't trigger serverTimestamp automatically unless manually set, usage depends on desired behavior. JS Date is fine here.
    });
}
