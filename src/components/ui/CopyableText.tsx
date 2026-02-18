import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface CopyableTextProps {
    content: string;
}

export default function CopyableText({ content }: CopyableTextProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            toast.success('Copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            toast.error('Failed to copy');
        }
    };

    return (
        <div className="relative group my-2 rounded-lg overflow-hidden border border-gray-700 bg-gray-900">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleCopy}
                    className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 hover:text-white transition-colors"
                    title="Copy to clipboard"
                >
                    {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>
            </div>
            <pre className="p-4 text-sm font-mono text-gray-100 whitespace-pre-wrap overflow-x-auto">
                {content}
            </pre>
        </div>
    );
}
