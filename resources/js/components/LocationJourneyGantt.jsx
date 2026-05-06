import React, { useState, useMemo } from 'react';
import { HelpCircle } from 'lucide-react';

export default function LocationJourneyGantt({ animal, movements = [], currentLocationId, onPeriodChange }) {
    const [period, setPeriod] = useState('12m');

    const months = useMemo(() => {
        const monthCount = period === '6m' ? 6 : period === '12m' ? 12 : 3;
        const result = [];
        for (let i = monthCount - 1; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            result.push({
                key: date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0'),
                label: date.toLocaleDateString('en-US', { month: 'short', year: monthCount > 3 ? 'numeric' : undefined }).trim()
            });
        }
        return result;
    }, [period]);

    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod);
        if (onPeriodChange) onPeriodChange(newPeriod);
    };

    // Extract unique locations from movements
    const locations = useMemo(() => {
        const locMap = new Map();
        movements.forEach(m => {
            if (m.to_location && m.to_location.id) {
                locMap.set(m.to_location.id, m.to_location);
            }
        });
        return Array.from(locMap.values());
    }, [movements]);

    const getMovementsForLocationInMonth = (locationId, monthKey) => {
        return movements.filter(m => {
            if (!m.to_location || m.to_location.id !== locationId) return false;
            const mDate = new Date(m.date || m.treatment_date);
            const mKey = mDate.getFullYear() + '-' + String(mDate.getMonth() + 1).padStart(2, '0');
            return mKey === monthKey;
        }).length;
    };

    const periods = [
        { label: '3 Months', value: '3m' },
        { label: '6 Months', value: '6m' },
        { label: '12 Months', value: '12m' }
    ];

    if (locations.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-[#80888F] p-6 space-y-4">
                <h3 className="text-[16px] font-black text-[#1a1a2e]">Location Journey</h3>
                <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-12 text-center">
                    <p className="text-[13px] font-bold text-gray-500">No movement history</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-[#80888F] p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="text-[16px] font-black text-[#1a1a2e]">Location Journey</h3>
                    <div className="group relative">
                        <HelpCircle size={16} className="text-gray-400 cursor-help" />
                        <div className="absolute bottom-full left-0 mb-2 w-48 bg-gray-900 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            {animal?.animal_name}'s movement across different locations over time
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {periods.map(p => (
                        <button
                            key={p.value}
                            onClick={() => handlePeriodChange(p.value)}
                            className={`rounded-full px-4 py-1.5 text-[12px] font-bold transition-all ${
                                period === p.value
                                    ? 'bg-[#1a1a2e] text-white'
                                    : 'border border-gray-300 text-gray-600 hover:border-gray-400'
                            }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Gantt Chart */}
            <div className="overflow-x-auto">
                <div className="min-w-max">
                    {/* X-axis header (months) */}
                    <div className="flex border-b border-gray-200">
                        <div className="w-40 flex-shrink-0 pr-4 py-2" /> {/* Spacer for Y-axis */}
                        {months.map(m => (
                            <div
                                key={m.key}
                                className="flex-1 min-w-[80px] text-center py-2 text-[11px] font-semibold text-gray-600 border-r border-gray-200"
                            >
                                {m.label}
                            </div>
                        ))}
                    </div>

                    {/* Grid rows - one for each location */}
                    {locations.map((location, idx) => {
                        const isCurrentLocation = location.id === currentLocationId;
                        const opacity = isCurrentLocation ? 'opacity-100' : 'opacity-40';
                        const bgColor = isCurrentLocation ? 'bg-emerald-50' : 'bg-gray-50';

                        return (
                            <div key={location.id} className={`flex border-b border-gray-200 hover:${bgColor} transition-colors ${opacity}`}>
                                {/* Y-axis label - Location name */}
                                <div className={`w-40 flex-shrink-0 pr-4 py-4 text-[13px] font-semibold truncate flex items-center gap-2 ${isCurrentLocation ? 'text-[#1a1a2e]' : 'text-gray-500'}`}>
                                    {isCurrentLocation && (
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    )}
                                    <span className="truncate">{location.name}</span>
                                </div>

                                {/* Cells */}
                                {months.map((m, mIdx) => (
                                    <div
                                        key={m.key}
                                        className={`flex-1 min-w-[80px] relative py-4 border-r border-gray-200 ${
                                            mIdx % 2 === 0 ? 'bg-white' : bgColor
                                        } flex items-center justify-center`}
                                    >
                                        {/* Yellow event markers */}
                                        {getMovementsForLocationInMonth(location.id, m.key) > 0 && (
                                            <div className={`w-3 h-3 bg-[#FFD700] rounded-sm shadow-sm ${!isCurrentLocation ? 'opacity-60' : ''}`} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[13px] font-bold text-[#1a1a2e]">Current Location</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#FFD700] rounded-sm" />
                    <span className="text-[13px] font-bold text-[#1a1a2e]">Movement Event</span>
                </div>
            </div>
        </div>
    );
}
