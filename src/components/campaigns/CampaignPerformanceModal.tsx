import React from 'react';
import { X, TrendingUp, DollarSign, MousePointer2, Target, Eye } from 'lucide-react';

interface CampaignStats {
    clicks: number | string;
    impressions: number | string;
    cost: number | string; // in micros or currency? The user said "Cost / Clicks" implies currency. I'll assume it's already converted or needs conversion. Logic says "Cost / Clicks", usually Google Ads API returns micros. I'll check if the backend converts it. The n8n workflow divides by 1,000,000 so it should be in standard units.
    conversions: number | string;
    conversionValue?: number | string;
}

interface Campaign {
    id: string;
    name: string;
    status: string;
    stats?: CampaignStats;
}

interface CampaignPerformanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    campaign: Campaign;
}

const StatCard = ({ title, value, subtext, icon: Icon, trend }: { title: string, value: string, subtext?: string, icon: any, trend?: 'up' | 'down' | 'neutral' }) => (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-full">
        <div className="flex justify-between items-start mb-2">
            <span className="text-gray-500 text-xs uppercase font-bold tracking-wider">{title}</span>
            <div className={`p-1.5 rounded-lg ${trend === 'up' ? 'text-green-600 bg-green-50' : trend === 'down' ? 'text-red-500 bg-red-50' : 'text-gray-400 bg-gray-50'}`}>
                <Icon size={16} />
            </div>
        </div>
        <div>
            <div className="text-2xl font-['Federo'] text-gray-900">{value}</div>
            {subtext && <div className="text-xs text-gray-400 mt-1 font-['Barlow']">{subtext}</div>}
        </div>
    </div>
);

const MetricCard = ({ label, value, unit }: { label: string, value: string, unit: string }) => (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
        <div className="text-gray-500 text-xs mb-1 uppercase font-bold">{label}</div>
        <div className="text-xl font-['Barlow'] font-semibold text-gray-900">
            {value} <span className="text-sm text-gray-400 font-normal">{unit}</span>
        </div>
    </div>
);

export const CampaignPerformanceModal: React.FC<CampaignPerformanceModalProps> = ({ isOpen, onClose, campaign }) => {
    if (!isOpen) return null;

    // Helper for formatting numbers
    const formatCurrency = (val: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(val);
    const formatNumber = (val: number) => new Intl.NumberFormat('de-DE').format(val);
    const formatPercent = (val: number) => new Intl.NumberFormat('de-DE', { style: 'percent', minimumFractionDigits: 2 }).format(val / 100);

    // Parse stats safely
    const stats = campaign.stats || { clicks: 0, impressions: 0, cost: 0, conversions: 0, conversionValue: 0 };

    const clicks = Number(stats.clicks) || 0;
    const impressions = Number(stats.impressions) || 0;
    const cost = Number(stats.cost) || 0; // Assuming already converted from micros in n8n
    const conversions = Number(stats.conversions) || 0;
    const conversionValue = Number(stats.conversionValue) || 0;

    // KPI Calculations
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const cpc = clicks > 0 ? (cost / clicks) : 0;
    const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
    const cpa = conversions > 0 ? (cost / conversions) : 0;
    const roas = cost > 0 ? (conversionValue / cost) : 0;

    const hasData = clicks > 0 || impressions > 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-['Federo'] text-gray-900">{campaign.name}</h2>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${campaign.status === 'ENABLED' ? 'bg-green-100 text-green-700' :
                                campaign.status === 'PAUSED' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
                                }`}>
                                {campaign.status}
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm font-['Barlow']">Performance Insights</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 bg-[#F8F9FA]">
                    {!hasData ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="bg-gray-100 p-4 rounded-full mb-4">
                                <TrendingUp className="text-gray-400" size={32} />
                            </div>
                            <h3 className="text-xl font-['Federo'] text-gray-900 mb-2">No Performance Data</h3>
                            <p className="text-gray-500 font-['Barlow'] max-w-md">
                                Sync this campaign with Google Ads to see real-time performance metrics and insights.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Primary Metrics */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatCard
                                    title="Total Cost"
                                    value={formatCurrency(cost)}
                                    icon={DollarSign}
                                />
                                <StatCard
                                    title="Conversions"
                                    value={formatNumber(conversions)}
                                    icon={Target}
                                    trend="up"
                                />
                                <StatCard
                                    title="Clicks"
                                    value={formatNumber(clicks)}
                                    icon={MousePointer2}
                                />
                                <StatCard
                                    title="Impressions"
                                    value={formatNumber(impressions)}
                                    icon={Eye}
                                />
                            </div>

                            {/* Secondary Ratios */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-wider">Efficiency Metrics</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <MetricCard label="CTR (Click Through Rate)" value={formatPercent(ctr)} unit="" />
                                    <MetricCard label="Avg. CPC (Cost Per Click)" value={formatCurrency(cpc)} unit="" />
                                    <MetricCard label="Conv. Rate" value={formatPercent(conversionRate)} unit="" />
                                    <MetricCard label="CPA (Cost Per Acquisition)" value={formatCurrency(cpa)} unit="" />
                                    <MetricCard label="ROAS (Return on Ad Spend)" value={`${roas.toFixed(2)}x`} unit="" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-end bg-white rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
