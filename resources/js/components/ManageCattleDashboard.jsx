import React from 'react';
import illustration from '../assets/no-enterprises.svg';
import RegisterAnimal from './RegisterAnimal';

const SetupCard = ({ step, title, status, buttonText, onClick, icon }) => {
    return (
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-[#80888F] bg-white px-4 py-2.5 shadow-sm">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#D7E3EF]">
                {React.cloneElement(icon, { className: "h-3.5 w-3.5 text-[#1a1a2e]" })}
            </div>
            
            <div className="flex flex-1 items-center justify-between min-w-0 gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[10px] font-bold text-gray-400">S{step}</span>
                    <h3 className="truncate text-[13px] font-bold text-[#1a1a2e]">{title}</h3>
                </div>
                
                <div className="flex items-center gap-2.5 shrink-0">
                    {status && (
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-tight ${
                            status === 'Completed' ? 'bg-[#D7E3EF] text-[#1a1a2e]' : 'bg-orange-50 text-orange-600'
                        }`}>
                            {status === 'Completed' ? 'Done' : 'Pending'}
                        </span>
                    )}
                    <button 
                        onClick={onClick}
                        className={`rounded-full px-3.5 py-1 text-[11px] font-bold transition-all ${
                            buttonText === 'Completed' 
                            ? 'bg-transparent text-[#1a1a2e]/40' 
                            : 'bg-[#1a1a2e] text-white hover:bg-black'
                        }`}
                    >
                        {buttonText === 'Completed' ? '✓' : buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function ManageCattleDashboard({ selectedAnimal, onSelectAnimal }) {
    if (selectedAnimal === 'Register Animal') {
        return (
            <section className="h-full min-h-0 w-full overflow-auto bg-[#F8FAFD] p-4 sm:p-8">
                <RegisterAnimal />
            </section>
        );
    }

    if (selectedAnimal === 'Animal Details' || !selectedAnimal) {
        return (
            <section className="relative h-full min-h-0 w-full overflow-hidden bg-[#F8FAFD] p-6">
                <style>
                    {`
                        @keyframes tailWag {
                            0% { transform: rotate(0deg); }
                            25% { transform: rotate(1deg); }
                            75% { transform: rotate(-1deg); }
                            100% { transform: rotate(0deg); }
                        }
                        @keyframes breathe {
                            0% { transform: scale(1); }
                            50% { transform: scale(1.02); }
                            100% { transform: scale(1); }
                        }
                        .animate-alive {
                            animation: tailWag 3s ease-in-out infinite, breathe 5s ease-in-out infinite;
                            transform-origin: center bottom;
                        }
                    `}
                </style>

                {/* Centered Illustration Section */}
                <div className="flex h-full flex-col items-center justify-center pb-28">
                    <div className="w-full max-w-lg md:max-w-xl animate-alive">
                        <img 
                            src={illustration} 
                            alt="HayDay" 
                            className="mx-auto w-full brightness-0 opacity-100" 
                        />
                    </div>
                    <div className="mt-8 text-center space-y-2">
                        <h1 className="text-4xl font-black text-[#1a1a2e] tracking-tight italic">HayDay !</h1>
                        <p className="text-lg text-gray-500 font-medium italic opacity-80">Setup your farm to get started</p>
                    </div>
                </div>

                {/* Compact Bottom Setup Section */}
                <div className="absolute bottom-12 left-0 right-0 flex justify-center px-10">
                    <div className="grid w-full max-w-5xl grid-cols-1 gap-3 md:grid-cols-3">
                        <SetupCard 
                            step="1"
                            title="Ranch Details"
                            buttonText="Completed"
                            status="Completed"
                            icon={
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M3 21h18M3 10l9-7 9 7v11H3V10z" />
                                </svg>
                            }
                        />
                        <SetupCard 
                            step="2"
                            status="Pending"
                            title="Location Details"
                            buttonText="Add"
                            icon={
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M3 10h18M3 14h18M5 6v12M9 6v12M15 6v12M19 6v12" />
                                </svg>
                            }
                        />
                        <SetupCard 
                            step="3"
                            status="Pending"
                            title="Livestock"
                            buttonText="Add"
                            onClick={() => onSelectAnimal('Register Animal')}
                            icon={
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 8v8M8 12h8" />
                                </svg>
                            }
                        />
                    </div>
                </div>
            </section>
        );
    }

    const getContent = () => {
        switch (selectedAnimal) {
            case 'Scheduler':
                return {
                    title: 'Farm Scheduler',
                    description: 'Manage upcoming tasks, vaccinations, breeding dates, and feeding schedules.'
                };
            case 'Groups':
                return {
                    title: 'Livestock Groups',
                    description: 'Organize your animals into pastures, groups, or pens.'
                };
            default:
                return {
                    title: 'Workspace',
                    description: 'Manage your farm activities here.'
                };
        }
    };

    const content = getContent();

    return (
        <section className="h-full min-h-0 w-full bg-[#F8FAFD]">
            <div className="flex h-full flex-col items-center justify-center text-center bg-[#F8FAFD] p-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e]">{content.title}</h2>
                <p className="mt-3 max-w-md text-sm text-gray-400">
                    {content.description}
                </p>
            </div>
        </section>
    );
}
