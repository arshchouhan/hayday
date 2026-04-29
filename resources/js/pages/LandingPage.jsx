import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFD] p-6 text-center">
            <h1 className="text-[48px] font-black text-[#1a1a2e] mb-6 tracking-tight">
                Landing Page
            </h1>
            <p className="text-[18px] text-gray-500 mb-10 max-w-md leading-relaxed">
                Welcome to HayDay Farm Management. The most advanced digital solution for your ranch operations.
            </p>
            <button
                onClick={() => navigate('/login')}
                className="rounded-full bg-[#1a1a2e] px-12 py-4 text-[16px] font-black text-white shadow-xl hover:bg-black transition-all active:scale-95"
            >
                Get Started
            </button>
        </div>
    );
}