import React, { useState, useEffect } from 'react';
import { Activity, Syringe, Move, Baby, ShoppingCart, Plus } from 'lucide-react';

const TimelineEvent = ({ event, index }) => {
    const icons = {
        vaccination: <Syringe size={16} />,
        movement: <Move size={16} />,
        birth: <Baby size={16} />,
        sale: <ShoppingCart size={16} />,
        default: <Activity size={16} />
    };

    const isLeft = index % 2 === 0;

    return (
        <div className={`relative flex items-center justify-between w-full mb-12 ${isLeft ? 'flex-row-reverse' : ''}`}>
            {/* Empty space for the other side */}
            <div className="w-[45%]" />

            {/* Icon in the middle */}
            <div className="absolute left-1/2 top-4 -translate-x-1/2 z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-white bg-white shadow-md transition-transform hover:scale-110">
                <div className={`flex h-full w-full items-center justify-center rounded-full ${
                    event.type === 'vaccination' ? 'bg-blue-50 text-blue-500' :
                    event.type === 'birth' ? 'bg-emerald-50 text-emerald-600' :
                    event.type === 'movement' ? 'bg-orange-50 text-orange-500' :
                    'bg-gray-50 text-gray-500'
                }`}>
                    {icons[event.type] || icons.default}
                </div>
            </div>

            {/* Content card */}
            <div className={`w-[45%] flex flex-col ${isLeft ? 'items-end text-right' : 'items-start text-left'}`}>
                <div className="group relative w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-gray-300">
                    {/* Connecting line dot (optional style detail to connect box to center line) */}
                    <div className={`absolute top-6 h-[2px] w-4 bg-gray-200 ${isLeft ? '-right-4' : '-left-4'}`} />
                    
                    <div className={`flex flex-wrap items-center gap-2 mb-2 ${isLeft ? 'justify-end' : 'justify-start'}`}>
                        {isLeft && <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-black text-gray-500 uppercase tracking-widest">{event.date}</span>}
                        <span className="text-[15px] font-black text-[#1a1a2e]">{event.title}</span>
                        {!isLeft && <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-black text-gray-500 uppercase tracking-widest">{event.date}</span>}
                    </div>
                    
                    <p className="text-[13px] font-medium text-gray-500 leading-relaxed">
                        {event.description}
                    </p>
                    
                    {event.meta && Object.keys(event.meta).length > 0 && (
                        <div className={`mt-4 flex gap-2 flex-wrap ${isLeft ? 'justify-end' : 'justify-start'}`}>
                            {Object.entries(event.meta).map(([key, value]) => (
                                <div key={key} className="flex items-center gap-1.5 rounded-lg bg-[#F8FAFD] border border-gray-100 px-2.5 py-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{key}</span>
                                    <span className="text-[11px] font-black text-[#1a1a2e]/80">{value}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
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
        <div className="py-8">
            <div className="mx-auto max-w-4xl px-4 relative">
                
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-500" />
                        <p className="text-[13px] font-bold text-gray-400">Loading history narrative...</p>
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50">
                        <p className="text-[14px] font-bold text-gray-400">No events recorded yet.</p>
                    </div>
                ) : (
                    <div className="relative pt-6 pb-10">
                        {/* Center vertical line */}
                        <div className="absolute left-1/2 top-0 bottom-0 -ml-[1px] w-[2px] bg-gray-200" />
                        
                        {events.map((event, i) => (
                            <TimelineEvent 
                                key={i} 
                                event={event} 
                                index={i}
                            />
                        ))}
                    </div>
                )}
                
                {!loading && (
                    <div className="flex justify-center mt-4">
                        <button className="flex items-center gap-2 rounded-full border border-[#80888F] bg-white px-6 py-2.5 text-[13px] font-bold text-[#1a1a2e] shadow-sm transition-all hover:bg-gray-50 hover:shadow">
                            <Plus size={16} className="text-gray-400" />
                            Add New Lifecycle Event
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
