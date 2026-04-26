import React from 'react';
import { Brain, TrendingUp, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

const InsightCard = ({ title, value, unit, trend, status, color }) => (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-black/5 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-black uppercase tracking-wider text-gray-400">{title}</h3>
            <div className={`rounded-full p-2 ${color} bg-opacity-10`}>
                <Zap size={16} className={color.replace('bg-', 'text-')} />
            </div>
        </div>
        
        <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-[#1a1a2e]">{value}</span>
            <span className="text-sm font-bold text-gray-400">{unit}</span>
        </div>

        <div className="flex items-center gap-2">
            {trend && (
                <span className={`flex items-center gap-1 text-[12px] font-black ${trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    <TrendingUp size={12} className={trend < 0 ? 'rotate-180' : ''} />
                    {Math.abs(trend)}%
                </span>
            )}
            <span className="text-[12px] font-medium text-gray-400">{status}</span>
        </div>
    </div>
);

export default function AI({ animal }) {
    return (
        <div className="flex h-full flex-col bg-[#F8FAFD] p-10 overflow-auto scrollbar-hide">
            <div className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="flex items-center gap-3 text-3xl font-black text-[#1a1a2e] tracking-tight">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200">
                            <Brain size={24} />
                        </div>
                        Smart Farm AI <span className="text-gray-300 font-medium">| Insights</span>
                    </h1>
                    <p className="mt-2 text-gray-500 font-medium italic opacity-70">Predictive analytics and health monitoring for {animal?.ear_tag || 'Animal'}</p>
                </div>
                
                <div className="flex items-center gap-3 rounded-2xl bg-white p-2 shadow-sm border border-gray-100">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-500">
                        <ShieldCheck size={20} />
                    </div>
                    <div className="pr-4">
                        <div className="text-[10px] font-black uppercase text-gray-400">Health Score</div>
                        <div className="text-[16px] font-black text-[#1a1a2e]">98.4 / 100</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <InsightCard 
                    title="Growth Projection" 
                    value="1.2" 
                    unit="kg / day" 
                    trend={8.4} 
                    status="Above Average"
                    color="bg-indigo-500"
                />
                <InsightCard 
                    title="Est. Market Value" 
                    value="1,450" 
                    unit="USD" 
                    trend={12.5} 
                    status="Peak in 4 months"
                    color="bg-amber-500"
                />
                <InsightCard 
                    title="Fertility Prob." 
                    value="88" 
                    unit="%" 
                    trend={-2.1} 
                    status="Optimal Window"
                    color="bg-rose-500"
                />
            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                    <h2 className="mb-6 flex items-center gap-2 text-lg font-black text-[#1a1a2e]">
                        <AlertTriangle size={18} className="text-amber-500" />
                        AI Health Watch
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 rounded-2xl bg-amber-50/50 p-4 border border-amber-100/50">
                            <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                            <div>
                                <h4 className="text-[14px] font-black text-[#1a1a2e]">Hydration Alert</h4>
                                <p className="text-[12px] font-medium text-gray-500 leading-relaxed mt-1">
                                    Minor decrease in water intake patterns detected over the last 48 hours. Monitor pasture 4 water source.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 rounded-2xl bg-indigo-50/50 p-4 border border-indigo-100/50">
                            <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                            <div>
                                <h4 className="text-[14px] font-black text-[#1a1a2e]">Activity Spike</h4>
                                <p className="text-[12px] font-medium text-gray-500 leading-relaxed mt-1">
                                    Increased movement detected. Animal appears highly active, likely entering optimal breeding window.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                    <h2 className="mb-6 flex items-center gap-2 text-lg font-black text-[#1a1a2e]">
                        <Zap size={18} className="text-indigo-500" />
                        Genetic Recommendations
                    </h2>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 font-black text-[#1a1a2e]">A+</div>
                                <div>
                                    <h4 className="text-[14px] font-bold text-[#1a1a2e]">Sire Match: Angus Prime</h4>
                                    <p className="text-[11px] font-medium text-gray-400">94% Genetic Compatibility</p>
                                </div>
                            </div>
                            <button className="rounded-xl bg-[#1a1a2e] px-4 py-2 text-[12px] font-bold text-white hover:bg-black transition-all">Select</button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 font-black text-[#1a1a2e]">A</div>
                                <div>
                                    <h4 className="text-[14px] font-bold text-[#1a1a2e]">Sire Match: Hereford Star</h4>
                                    <p className="text-[11px] font-medium text-gray-400">89% Genetic Compatibility</p>
                                </div>
                            </div>
                            <button className="rounded-xl border border-gray-200 px-4 py-2 text-[12px] font-bold text-[#1a1a2e] hover:bg-gray-50 transition-all">Select</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
