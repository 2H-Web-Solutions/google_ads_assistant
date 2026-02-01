import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Briefcase } from 'lucide-react';
import { onSnapshot, query, orderBy, deleteDoc } from 'firebase/firestore';
import { getAppCollection, getAppDoc, type Client } from '../lib/db';
import ClientAssistant from '../components/ClientAssistant';
import ClientCard from '../components/clients/ClientCard';
import { DeleteConfirmationModal } from '../components/ui/DeleteConfirmationModal';

export default function Clients() {
    // navigate is used in ClientCard, not here anymore directly in map
    // const navigate = useNavigate();
    const [clients, setClients] = useState<Client[]>([]);
    const [showAssistant, setShowAssistant] = useState(false);
    const [loading, setLoading] = useState(true);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (e: React.MouseEvent, client: Client) => {
        e.stopPropagation(); // Prevent navigation
        setClientToDelete(client);
        setDeleteModalOpen(true);
    };

    const confirmDeleteClient = async () => {
        if (!clientToDelete) return;
        setIsDeleting(true);
        try {
            await deleteDoc(getAppDoc('clients', clientToDelete.id));
            setDeleteModalOpen(false);
            setClientToDelete(null);
        } catch (error) {
            console.error("Error deleting client:", error);
            alert("Fehler beim Löschen des Clients.");
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        const q = query(getAppCollection('clients'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const clientData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Client[];
            setClients(clientData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="relative h-full">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-['Federo'] text-gray-900">Clients</h1>
                    <p className="text-gray-500 font-['Barlow']">Manage your client portfolio</p>
                </div>
                <button
                    onClick={() => setShowAssistant(true)}
                    className="flex items-center gap-2 bg-[#101010] text-[#B7EF02] px-5 py-2.5 rounded-lg hover:bg-gray-900 transition-colors font-['Barlow'] font-medium"
                >
                    <Plus size={18} />
                    <span>Add Client</span>
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-400">Loading clients...</div>
            ) : clients.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <Briefcase className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-900">No clients yet</h3>
                    <p className="text-gray-500 mb-4">Use the Assistant to onboard your first client.</p>
                    <button
                        onClick={() => setShowAssistant(true)}
                        className="text-[#101010] underline font-medium"
                    >
                        Open Assistant
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.map((client) => (
                        <ClientCard
                            key={client.id}
                            client={client}
                            onDelete={(e) => handleDeleteClick(e, client)}
                        />
                    ))}
                </div>
            )}

            {/* Assistant Drawer */}
            {showAssistant && (
                <>
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setShowAssistant(false)} />
                    <ClientAssistant onClose={() => setShowAssistant(false)} />
                </>
            )}

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDeleteClient}
                title="Client Löschen"
                itemName={clientToDelete?.name || 'Client'}
                isLoading={isDeleting}
            />
        </div>
    );
}
