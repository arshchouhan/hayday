import React from 'react';
import hayIcon from '../assets/noun-hay-7549821.svg';

export default function Loader({ message = "Loading..." }) {
    return (
        <div className="flex h-full w-full items-center justify-center bg-[#F8FAFD] rounded-md">
            <div className="flex flex-col items-center gap-6">
                <div className="relative flex h-32 w-32 items-center justify-center">
                    {/* Pulsing background effect */}
                    <div className="absolute inset-0 rounded-full bg-[#D7E3EF] animate-ping opacity-30"></div>
                    <div className="absolute inset-4 rounded-full bg-[#D7E3EF]/50 animate-pulse opacity-50"></div>
                    
                    {/* The Logo (Hay Icon) */}
                    <img 
                        src={hayIcon} 
                        alt="Loading" 
                        className="relative z-10 h-24 w-24 animate-bounce drop-shadow-2xl transition-all duration-1000" 
                        style={{ 
                            filter: 'drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))' 
                        }}
                    />
                </div>
                
                <div className="flex flex-col items-center gap-2">
                    <p className="text-[15px] font-black text-[#1a1a2e] tracking-tight uppercase">
                        {message}
                    </p>
                    <div className="flex gap-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#1a1a2e] animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-[#1a1a2e] animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-[#1a1a2e] animate-bounce"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
