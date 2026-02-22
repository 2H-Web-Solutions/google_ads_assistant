import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import copy from 'copy-to-clipboard';

interface CopyTileProps {
    label?: string;
    content: string;
}

export const CopyTile: React.FC<CopyTileProps> = ({ label, content }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        try {
            // copy-to-clipboard automatically handles the fallback logic 
            // across all browsers including iOS Safari over HTTP
            copy(content);

            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="flex flex-col gap-1 mb-3 mt-1">
            {label && <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest pl-1">{label}</span>}
            <div
                className="group relative flex items-center justify-between p-3 bg-white rounded-md border border-[#B7EF02] hover:shadow-[0_0_10px_rgba(183,239,2,0.3)] transition-all cursor-pointer"
                onClick={handleCopy}
                title={copied ? "Kopiert!" : "Klicken zum Kopieren"}
            >
                <div className="text-sm text-gray-800 font-['Barlow'] pr-8 w-full">
                    <span className="break-words whitespace-pre-wrap">{content}</span>
                </div>

                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B7EF02] opacity-70 group-hover:opacity-100 transition-opacity">
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                </div>

                {/* Tooltip for feedback */}
                {copied && (
                    <div className="absolute -top-8 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg animate-fade-in-up z-10">
                        Kopiert!
                    </div>
                )}
            </div>
        </div>
    );
};
