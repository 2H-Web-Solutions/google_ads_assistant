import React, { useState } from 'react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    itemName: string; // Der Name des Elements, das gelöscht wird (für die Anzeige)
    isLoading?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    itemName,
    isLoading = false,
}) => {
    const [inputValue, setInputValue] = useState('');
    const REQUIRED_TEXT = 'delete';

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (inputValue.toLowerCase() === REQUIRED_TEXT) {
            onConfirm();
            setInputValue(''); // Reset nach Bestätigung
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1A1A1A] border border-red-900/50 rounded-lg max-w-md w-full p-6 shadow-2xl">
                <h3 className="text-xl font-header text-red-500 mb-2">{title}</h3>

                <p className="text-gray-300 mb-4 font-body">
                    Bist du sicher, dass du <span className="text-white font-bold">"{itemName}"</span> endgültig löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
                </p>

                <div className="mb-6">
                    <label className="block text-xs uppercase text-gray-500 mb-1">
                        Schreibe "{REQUIRED_TEXT}" zur Bestätigung
                    </label>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-red-500 focus:outline-none font-mono"
                        placeholder="delete"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => {
                            setInputValue('');
                            onClose();
                        }}
                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                        disabled={isLoading}
                    >
                        Abbrechen
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={inputValue.toLowerCase() !== REQUIRED_TEXT || isLoading}
                        className={`px-4 py-2 rounded font-bold transition-all ${inputValue.toLowerCase() === REQUIRED_TEXT
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {isLoading ? 'Lösche...' : 'Endgültig Löschen'}
                    </button>
                </div>
            </div>
        </div>
    );
};
