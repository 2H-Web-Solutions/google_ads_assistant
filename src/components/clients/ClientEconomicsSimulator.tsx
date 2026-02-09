import React, { useState, useEffect } from 'react';
import { Calculator, Save, TrendingUp, DollarSign, Percent, Package, RefreshCw } from 'lucide-react';
import { updateDoc } from 'firebase/firestore';
import { getAppDoc, type UnitEconomics } from '../../lib/db';
import toast from 'react-hot-toast';

interface ClientEconomicsSimulatorProps {
    clientId: string;
    initialData?: UnitEconomics;
}

export default function ClientEconomicsSimulator({ clientId, initialData }: ClientEconomicsSimulatorProps) {
    // State for Inputs
    const [data, setData] = useState<UnitEconomics>({
        aov: initialData?.aov || 100,
        targetRoas: initialData?.targetRoas || 4.0,
        taxRate: initialData?.taxRate || 19,
        returnRate: initialData?.returnRate || 10,
        cogs: initialData?.cogs || 30,
        fulfillmentCost: initialData?.fulfillmentCost || 5
    });

    // State for Calculated KPIs
    const [metrics, setMetrics] = useState({
        netRevenue: 0,
        grossProfit: 0,
        adSpend: 0,
        netProfit: 0,
        breakEvenRoas: 0,
        breakEvenCpa: 0
    });

    const [isSaving, setIsSaving] = useState(false);

    // Calculation Logic
    useEffect(() => {
        const { aov, targetRoas, taxRate, returnRate, cogs, fulfillmentCost } = data;

        // 1. Net Revenue (after Tax & Returns)
        const netRevenue = aov * (1 - taxRate / 100) * (1 - returnRate / 100);

        // 2. Gross Profit (Net Revenue - COGS - Fulfillment)
        // Note: COGS is typically % of Net Revenue or AOV? 
        // Instructions say "Gross Profit = Net Revenue * (1 - COGS/100) - FulfillmentCost"
        // This implies COGS is a percentage of the Net Revenue.
        const grossProfit = netRevenue * (1 - cogs / 100) - fulfillmentCost;

        // 3. Ad Spend (AOV / Target ROAS)
        const adSpend = targetRoas > 0 ? aov / targetRoas : 0;

        // 4. Net Profit (Gross Profit - Ad Spend)
        const netProfit = grossProfit - adSpend;

        // 5. Break Even ROAS (AOV / Gross Profit)
        const breakEvenRoas = grossProfit > 0 ? aov / grossProfit : 999;

        // 6. Break Even CPA (Max CPA = Gross Profit)
        const breakEvenCpa = grossProfit;

        setMetrics({
            netRevenue,
            grossProfit,
            adSpend,
            netProfit,
            breakEvenRoas,
            breakEvenCpa
        });
    }, [data]);

    const handleChange = (field: keyof UnitEconomics, value: string) => {
        setData(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
    };

    const saveEconomics = async () => {
        if (!clientId) return;
        setIsSaving(true);
        try {
            await updateDoc(getAppDoc('clients', clientId), {
                unitEconomics: data
            });
            toast.success("Economics saved successfully!");
        } catch (error) {
            console.error("Error saving economics:", error);
            toast.error("Failed to save data.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-800">
                    <div className="bg-[#B7EF02]/20 p-2 rounded-lg text-[#8cb800]">
                        <Calculator size={20} />
                    </div>
                    <div>
                        <h3 className="font-['Federo'] text-lg leading-none">Unit Economics Simulator</h3>
                        <p className="font-['Barlow'] text-xs text-gray-500">Calculate Profitability & Break-Even targets</p>
                    </div>
                </div>
                <button
                    onClick={saveEconomics}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-[#101010] text-[#B7EF02] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-70"
                >
                    {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                    Save Config
                </button>
            </div>

            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">
                {/* LEFT: Inputs */}
                <div className="p-6 md:w-1/2 space-y-5 bg-white font-['Barlow']">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Revenue & Goals</label>
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup
                                label="Avg Order Value"
                                icon={<DollarSign size={14} />}
                                value={data.aov}
                                onChange={(v) => handleChange('aov', v)}
                                suffix="€"
                            />
                            <InputGroup
                                label="Target ROAS"
                                icon={<TrendingUp size={14} />}
                                value={data.targetRoas}
                                onChange={(v) => handleChange('targetRoas', v)}
                                step={0.1}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Deductions</label>
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup
                                label="Tax / VAT"
                                icon={<Percent size={14} />}
                                value={data.taxRate}
                                onChange={(v) => handleChange('taxRate', v)}
                                suffix="%"
                            />
                            <InputGroup
                                label="Return Rate"
                                icon={<Percent size={14} />}
                                value={data.returnRate}
                                onChange={(v) => handleChange('returnRate', v)}
                                suffix="%"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Product Costs</label>
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup
                                label="COGS (Product)"
                                icon={<Percent size={14} />}
                                value={data.cogs}
                                onChange={(v) => handleChange('cogs', v)}
                                suffix="%"
                            />
                            <InputGroup
                                label="Fulfillment Cost"
                                icon={<Package size={14} />}
                                value={data.fulfillmentCost}
                                onChange={(v) => handleChange('fulfillmentCost', v)}
                                suffix="€"
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT: KPIs */}
                <div className="p-6 md:w-1/2 bg-[#F9FAFB] flex flex-col justify-center font-['Barlow']">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <KPICard
                            label="Break Even ROAS"
                            value={metrics.breakEvenRoas.toFixed(2)}
                            subtext="Min. ROAS to not lose money"
                            highlight={data.targetRoas < metrics.breakEvenRoas}
                            color={data.targetRoas < metrics.breakEvenRoas ? "text-red-600" : "text-gray-900"}
                        />
                        <KPICard
                            label="Max CPA (Break Even)"
                            value={`€${metrics.breakEvenCpa.toFixed(2)}`}
                            subtext="Max Ad Spend per Order"
                        />
                    </div>

                    <div className="bg-[#101010] rounded-xl p-5 text-white shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <DollarSign size={80} />
                        </div>
                        <p className="text-gray-400 text-sm uppercase font-bold tracking-wider mb-1">Net Profit per Order</p>
                        <div className={`text-4xl font-['Federo'] mb-2 ${metrics.netProfit < 0 ? 'text-red-400' : 'text-[#B7EF02]'}`}>
                            €{metrics.netProfit.toFixed(2)}
                        </div>
                        <div className="flex gap-4 text-xs text-gray-500">
                            <div>
                                <span className="block text-gray-400">Net Revenue</span>
                                €{metrics.netRevenue.toFixed(2)}
                            </div>
                            <div>
                                <span className="block text-gray-400">Gross Margin</span>
                                €{metrics.grossProfit.toFixed(2)}
                            </div>
                            <div>
                                <span className="block text-gray-400">Ad Spend</span>
                                €{metrics.adSpend.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Sub-components ---

interface InputGroupProps {
    label: string;
    icon: React.ReactNode;
    value: number;
    onChange: (value: string) => void;
    suffix?: string;
    step?: number;
}

const InputGroup = ({ label, icon, value, onChange, suffix, step = 1 }: InputGroupProps) => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 px-3 focus-within:border-[#B7EF02] focus-within:ring-1 focus-within:ring-[#B7EF02] transition-all">
        <label className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1 mb-1">
            {icon} {label}
        </label>
        <div className="flex items-center">
            <input
                type="number"
                step={step}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-transparent text-gray-900 font-bold focus:outline-none"
            />
            {suffix && <span className="text-sm text-gray-400 font-medium ml-1">{suffix}</span>}
        </div>
    </div>
);

interface KPICardProps {
    label: string;
    value: string | number;
    subtext?: string;
    highlight?: boolean;
    color?: string;
}

const KPICard = ({ label, value, subtext, highlight, color = "text-gray-900" }: KPICardProps) => (
    <div className={`bg-white border rounded-xl p-4 shadow-sm ${highlight ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
        <p className="text-xs text-gray-500 uppercase font-bold mb-1">{label}</p>
        <div className={`text-2xl font-['Federo'] ${color}`}>{value}</div>
        {subtext && <p className="text-[10px] text-gray-400 mt-1">{subtext}</p>}
    </div>
);
