// src/components/CampaignMemory.tsx
import React, { useState, useEffect } from 'react';
import { Upload, FileText, MessageSquare, Trash2, Database } from 'lucide-react';
import Papa from 'papaparse';
import {
    addDoc,
    query,
    orderBy,
    onSnapshot,
    deleteDoc,
    serverTimestamp
} from 'firebase/firestore';
import { getAppCollection, getAppDoc } from '../lib/db';

/**
 * Knowledge Base Component for a specific Campaign.
 * Allows uploading CSVs and lists stored memory items (files, chat logs).
 */

interface CampaignMemoryProps {
    clientId: string;
    campaignId: string;
}

export default function CampaignMemory({ clientId, campaignId }: CampaignMemoryProps) {
    const [memories, setMemories] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);

    // 1. Listen to Knowledge Base
    useEffect(() => {
        if (!clientId || !campaignId) return;

        // Path: apps/{APP_ID}/clients/{clientId}/campaigns/{campaignId}/knowledge_base
        const kbPath = `clients/${clientId}/campaigns/${campaignId}/knowledge_base`;
        const q = query(getAppCollection(kbPath), orderBy('createdAt', 'desc'));

        const unsub = onSnapshot(q, (snapshot) => {
            setMemories(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        return () => unsub();
    }, [clientId, campaignId]);

    // 2. Handle File Upload (CSV)
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
            alert("Please upload a valid CSV file.");
            return;
        }

        setUploading(true);

        Papa.parse(file, {
            complete: async (results) => {
                try {
                    // Convert parsed data to string or JSON for storage
                    const content = JSON.stringify(results.data.slice(0, 50)); // Limit rows for now

                    const kbPath = `clients/${clientId}/campaigns/${campaignId}/knowledge_base`;
                    await addDoc(getAppCollection(kbPath), {
                        type: 'csv',
                        fileName: file.name,
                        content: content,
                        rowCount: results.data.length,
                        createdAt: serverTimestamp()
                    });

                } catch (error) {
                    console.error("Error saving memory:", error);
                    alert("Failed to save memory.");
                } finally {
                    setUploading(false);
                }
            },
            error: (err: any) => {
                console.error("CSV Parse Error:", err);
                setUploading(false);
                alert("Error parsing CSV.");
            }
        });
    };

    // 3. Delete Memory
    const handleDelete = async (memoryId: string) => {
        if (!confirm("Delete this memory item?")) return;
        try {
            const path = `clients/${clientId}/campaigns/${campaignId}/knowledge_base`;
            await deleteDoc(getAppDoc(path, memoryId));
        } catch (error) {
            console.error("Error deleting memory:", error);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#101010] text-white border-l border-gray-800 w-80">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <div className="flex items-center gap-2 text-[#B7EF02]">
                    <Database size={20} />
                    <h3 className="font-['Federo'] text-lg">Knowledge Base</h3>
                </div>
            </div>

            {/* Upload Area */}
            <div className="p-4 bg-[#1a1a1a]">
                <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-[#252525] transition-colors ${uploading ? 'border-gray-600 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-[#B7EF02]'}`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload size={20} className="text-gray-400 mb-2" />
                        <p className="mb-1 text-sm text-gray-400 font-['Barlow']">
                            {uploading ? "Processing..." : "Upload CSV Data"}
                        </p>
                    </div>
                    <input
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={uploading}
                    />
                </label>
            </div>

            {/* Memory List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {memories.length === 0 && (
                    <p className="text-gray-500 text-sm text-center font-['Barlow'] mt-10">
                        No memories yet.<br />Upload data or save chats.
                    </p>
                )}

                {memories.map((mem) => (
                    <div key={mem.id} className="group p-3 bg-[#1a1a1a] rounded-lg border border-gray-800 hover:border-gray-600 transition-all relative">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-[#101010] rounded text-gray-400">
                                {mem.type === 'csv' ? <FileText size={16} /> : <MessageSquare size={16} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-200 truncate font-['Barlow']">
                                    {mem.fileName || "Chat Session"}
                                </p>
                                <p className="text-[10px] text-gray-500 mt-0.5">
                                    {mem.createdAt?.toDate().toLocaleDateString()} • {mem.type.toUpperCase()}
                                </p>
                            </div>
                            <button
                                onClick={() => handleDelete(mem.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-900/30 text-gray-500 hover:text-red-500 rounded transition-all"
                                title="Delete Memory"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
