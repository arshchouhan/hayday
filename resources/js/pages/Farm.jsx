import React from 'react';
import Navbar from '../components/Navbar';

export default function Farm() {
    return (
        <div className="flex h-screen flex-col overflow-hidden bg-[#D7E3EF]">
            <Navbar />
            <main className="w-full flex-1 overflow-hidden px-3 pb-3 sm:px-4 sm:pb-4">
                <div className="flex h-full min-h-0 flex-col gap-3 md:flex-row md:items-start">
                    {/* Empty Sidebar placeholder */}
                    <div className="flex flex-col md:h-full md:w-44 md:shrink-0 lg:w-48">
                        <div className="flex-1 rounded-2xl bg-[#D7E3EF]"></div>
                    </div>

                    {/* Main Content container */}
                    <div className="flex-1 h-full min-h-0 overflow-hidden rounded-2xl bg-[#F8FAFD] shadow-xl ring-1 ring-black/5">
                        <div className="flex h-full items-center justify-center">
                            <p className="text-gray-400 font-medium">No farm activity selected</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
