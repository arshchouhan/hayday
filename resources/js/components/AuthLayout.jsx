import React from 'react';
import { ChevronDown } from 'lucide-react';

export const FloatingInput = ({ label, type = 'text', placeholder, value, onChange, required, icon, isPassword, phonePrefix, showPassword, setShowPassword }) => {
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="relative w-full mb-6">
            <label className="absolute -top-2.5 left-4 z-10 bg-white px-1 text-[11px] font-bold text-gray-500">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative flex items-center group">
                {phonePrefix && (
                    <div className="absolute left-4 flex items-center gap-1.5 border-r border-gray-200 pr-2">
                        <span className="text-[14px]">🇮🇳</span>
                        <span className="text-[14px] font-bold text-[#1a1a2e]">+91</span>
                        <ChevronDown size={14} className="text-gray-400" />
                    </div>
                )}
                <input
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full rounded-xl border border-gray-200 bg-white py-3.5 px-5 text-[14px] font-medium text-[#1a1a2e] outline-none transition-all focus:border-[#059669] focus:ring-1 focus:ring-[#059669] placeholder:text-gray-300 ${phonePrefix ? 'pl-[95px]' : ''} ${isPassword ? 'pr-12' : ''}`}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? (
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        ) : (
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-white">
            {/* Left Column: Form */}
            <div className="flex w-full flex-col overflow-y-auto px-6 py-10 lg:w-[500px] lg:px-14 scrollbar-hide">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-[26px] font-black text-[#1a1a2e] tracking-tight">
                        {title}
                    </h1>
                    <div className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 hover:bg-gray-100 transition-colors">
                        <span className="text-[16px]">🇺🇸</span>
                        <span className="text-[13px] font-bold text-gray-600">English</span>
                        <ChevronDown size={14} className="text-gray-400" />
                    </div>
                </div>

                {subtitle && (
                    <p className="mb-8 text-[13px] font-medium text-gray-500 leading-relaxed max-w-[340px]">
                        {subtitle}
                    </p>
                )}

                {children}

                <div className="mt-auto pt-10 flex items-center justify-between border-t border-gray-100">
                    <div className="flex items-center gap-1">
                        <span className="text-[11px] font-medium text-gray-400">Powered by</span>
                        <span className="text-[11px] font-black text-[#059669]">folio3</span>
                    </div>
                    <button className="text-[11px] font-bold text-[#059669] hover:underline">
                        About Cattlytics
                    </button>
                </div>
            </div>

            {/* Right Column: Visual Placeholder */}
            <div className="relative hidden flex-1 lg:flex items-center justify-center overflow-hidden bg-[#1a1a2e]">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/auth_bg.png"
                        alt="Farm Background"
                        className="h-full w-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-[#1a1a2e]/30 to-transparent" />
                </div>

                <div className="relative z-10 h-full w-full flex flex-col p-16">
                    <div className="flex flex-col items-end self-end animate-in fade-in duration-700">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#059669] p-2 rounded-xl shadow-lg">
                                <svg viewBox="0 0 40 40" className="h-8 w-8 text-white">
                                    <path d="M10 5 C5 5 2 8 2 13 C2 18 5 21 10 21 L10 30 C10 35 15 40 20 40 C25 40 30 35 30 30 L30 21 C35 21 38 18 38 13 C38 8 35 5 30 5 L10 5 Z M10 9 L30 9 C32 9 34 11 34 13 C34 15 32 17 30 17 L10 17 C8 17 6 15 6 13 C6 11 8 9 10 9 Z M14 21 L26 21 L26 30 C26 33 23 36 20 36 C17 36 14 33 14 30 L14 21 Z" fill="currentColor" />
                                </svg>
                            </div>
                            <h2 className="text-[36px] font-black tracking-tight text-white drop-shadow-sm">Cattlytics</h2>
                        </div>
                        <p className="mt-1 text-[13px] font-bold text-[#10B981] tracking-[0.2em] uppercase">Breed, Sell & Scale Digitally</p>
                    </div>

                    <div className="mt-auto max-w-2xl animate-in slide-in-from-bottom-8 duration-700 delay-300">
                        <div className="flex gap-4 mb-8">
                            <span className="text-[80px] leading-none text-[#EAB308] font-serif opacity-80 -mt-4">"</span>
                            <div>
                                <p className="text-[20px] font-medium text-white italic leading-relaxed">
                                    As someone who's knee-deep in the day-to-day operations of a farm, this software has made my life so much easier. It's intuitive, it's efficient, and it's tailored perfectly to our farm operations.
                                </p>
                            </div>
                            <span className="text-[80px] leading-none text-[#EAB308] font-serif opacity-80 self-end -mb-10">"</span>
                        </div>
                        
                        <div className="ml-16">
                            <h4 className="text-[19px] font-black text-[#10B981]">Sarah Jason - Ranch Owner</h4>
                            <div className="flex gap-1.5 mt-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} viewBox="0 0 24 24" className={`h-5 w-5 ${star === 5 ? 'text-gray-400' : 'text-[#EAB308]'}`} fill="currentColor">
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
