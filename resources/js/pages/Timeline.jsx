import React, { useState, useEffect } from 'react';
import { Calendar, Activity, Syringe, Move, Baby, ShoppingCart, Plus } from 'lucide-react';

const TimelineEvent = ({ event, isLast }) => {
    const icons = {
        vaccination: <Syringe size={14} />,
        movement: <Move size={14} />,
        birth: <Baby size={14} />,
        sale: <ShoppingCart size={14} />,
        default: <Activity size={14} />
    };

    return (
        <div className="relative flex gap-4 pb-8">
            {!isLast && <div className="absolute left-[15px] top-8 h-[calc(100%-16px)] w-[2px] bg-gray-100"></div>}
            
            <div className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-white shadow-sm transition-all hover:scale-110 ${
                event.type === 'vaccination' ? 'border-blue-400 text-blue-500' :
                event.type === 'birth' ? 'border-green-400 text-green-500' :
                event.type === 'movement' ? 'border-orange-400 text-orange-500' :
                'border-gray-200 text-gray-400'
            }`}>
                {icons[event.type] || icons.default}
            </div>

            <div className="flex flex-col gap-1 pt-1">
                <div className="flex items-center gap-3">
                    <span className="text-[14px] font-black text-[#1a1a2e]">{event.title}</span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                        {event.date}
                    </span>
                </div>
                <p className="text-[12px] font-medium text-gray-500 leading-relaxed max-w-lg">
                    {event.description}
                </p>
                {event.meta && Object.keys(event.meta).length > 0 && (
                    <div className="mt-2 flex gap-2 flex-wrap">
                        {Object.entries(event.meta).map(([key, value]) => (
                            <span key={key} className="rounded-md bg-[#F8FAFD] border border-gray-100 px-2 py-0.5 text-[10px] font-bold text-[#1a1a2e]/60">
                                {key}: {value}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default function Timeline({ animal }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!animal?.id && !animal?._id) return;
        const animalId = animal.id || animal._id;

        fetch(`/api/farm/animals/${animalId}/timeline`)
            .then(r => r.json())
            .then(res => {
                if (res.success) {
                    setEvents(res.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Timeline fetch error:", err);
                setLoading(false);
            });
    }, [animal]);

    return (
        <div className="flex h-full flex-col bg-white">
            <div className="border-b border-gray-50 px-8 py-5">
                <h2 className="flex items-center gap-2 text-[17px] font-black text-[#1a1a2e]">
                    <Calendar size={18} className="text-blue-500" />
                    Animal Lifecycle Timeline
                </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
                <div className="mx-auto max-w-2xl">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-100 border-t-blue-500" />
                            <p className="text-[13px] font-bold text-gray-400">Loading history narrative...</p>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-[14px] font-bold text-gray-400">No events recorded yet.</p>
                        </div>
                    ) : (
                        events.map((event, i) => (
                            <TimelineEvent 
                                key={i} 
                                event={event} 
                                isLast={i === events.length - 1} 
                            />
                        ))
                    )}
                    
                    {!loading && (
                        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-100 py-6 text-[13px] font-bold text-gray-400 transition-all hover:border-blue-200 hover:bg-blue-50/30 hover:text-blue-500">
                            <Plus size={16} />
                            Add New Lifecycle Event
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
