import React from 'react';
import { Calendar, Activity, Syringe, Move, Baby, ShoppingCart } from 'lucide-react';

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
                {event.meta && (
                    <div className="mt-2 flex gap-2">
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
    // Mock events for a premium look
    const events = [
        { 
            type: 'birth', 
            title: 'Born at Farm', 
            date: 'Oct 12, 2023', 
            description: `Successfully registered at the main pasture. Birth weight recorded at ${animal?.birth_weight || '35'} kg.`,
            meta: { Status: 'Healthy', Method: animal?.conception || 'Natural' }
        },
        { 
            type: 'vaccination', 
            title: 'Standard Vaccination (FMD)', 
            date: 'Nov 05, 2023', 
            description: 'Routine foot and mouth disease vaccination administered by Dr. Arsh.',
            meta: { Batch: 'B-9022', Next: 'May 2024' }
        },
        { 
            type: 'movement', 
            title: 'Transferred to West Pasture', 
            date: 'Jan 15, 2024', 
            description: 'Moved for better grazing management and social integration.',
            meta: { From: 'Main', To: animal?.location?.name || 'West' }
        },
        { 
            type: 'activity', 
            title: 'Weight Measurement', 
            date: 'Mar 10, 2024', 
            description: `Current weight recorded at ${animal?.weight || '120kg'}. Showing positive growth trend.`,
        }
    ].reverse();

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
                    {events.map((event, i) => (
                        <TimelineEvent 
                            key={i} 
                            event={event} 
                            isLast={i === events.length - 1} 
                        />
                    ))}
                    
                    <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-100 py-6 text-[13px] font-bold text-gray-400 transition-all hover:border-blue-200 hover:bg-blue-50/30 hover:text-blue-500">
                        <Plus size={16} />
                        Add New Lifecycle Event
                    </button>
                </div>
            </div>
        </div>
    );
}

function Plus({ size }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    );
}
