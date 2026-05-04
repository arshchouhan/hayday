import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import loginVideo from '../assets/loginvide.mp4';
import hayIcon from '../assets/noun-hay-7549821.svg';

export const FloatingInput = ({ label, type = 'text', placeholder, value, onChange, required, icon, isPassword, phonePrefix, showPassword, setShowPassword }) => {
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="relative w-full">
            <label className="absolute -top-2.5 left-4 z-10 bg-white px-1 text-[11px] font-bold text-[#1a1a2e]">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative flex items-center group">
                {phonePrefix && (
                    <div className="absolute left-4 flex items-center gap-1.5 border-r border-[#80888F] pr-2">
                        <span className="text-[14px]">🇮🇳</span>
                        <span className="text-[14px] font-bold text-[#1a1a2e]">+91</span>
                        <ChevronDown size={14} className="text-[#80888F]" />
                    </div>
                )}
                <input
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full rounded-lg border border-[#80888F] bg-[#E9EEF6] py-3 px-4 text-[14px] font-medium text-[#1a1a2e] outline-none transition-all focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e] placeholder:text-[#80888F] shadow-sm ${phonePrefix ? 'pl-[95px]' : ''} ${isPassword ? 'pr-12' : ''}`}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-[#80888F] hover:text-[#1a1a2e]"
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
    const [selectedLanguage, setSelectedLanguage] = useState({ name: 'English', flag: '🇺🇸' });
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

    const languages = [
        { name: 'English', flag: '🇬🇧' },
        { name: 'Indian English', flag: '🇮🇳' },
        { name: 'US English', flag: '🇺🇸' },
        { name: 'Hindi', flag: '🇮🇳' }
    ];

    const handleLanguageSelect = (language) => {
        setSelectedLanguage(language);
        setShowLanguageDropdown(false);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-white">
            {/* Left Column: Form */}
            <div className="flex w-full flex-col overflow-y-auto px-6 py-10 lg:w-[500px] lg:px-14 scrollbar-hide">
                <div className="flex items-center gap-3 mb-8">
                    <img src={hayIcon} alt="HayDay" className="h-10 w-10" />
                    <h1 className="text-[26px] font-semibold text-[#1a1a2e] tracking-tight">
                        {title}
                    </h1>
                </div>

                {subtitle && (
                    <p className="mb-8 text-[13px] font-medium text-[#80888F] leading-relaxed max-w-[340px]">
                        {subtitle}
                    </p>
                )}

                {children}

                <div className="mt-auto pt-10 flex items-center justify-between border-t border-[#E9EEF6]">
                    <div className="flex items-center gap-1 bg-[#DCE9E3] px-3 py-1.5 rounded-full">
                        <span className="text-[11px] font-medium text-[#80888F]">Powered by</span>
                        <a
                            href="https://ment2be.arshchouhan.me/"
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-black text-[#1a1a2e] hover:text-[#80888F]"
                        >
                            ment2be
                        </a>
                    </div>
                    <Link to="/" className="text-[11px] font-bold text-[#1a1a2e] hover:text-[#80888F] bg-[#DCE9E3] px-3 py-1.5 rounded-full">
                        About HayDay
                    </Link>
                </div>
            </div>

            {/* Right Column: Visual Placeholder */}
            <div className="relative hidden flex-1 lg:flex items-center justify-center overflow-hidden bg-[#1a1a2e]">
                <div className="absolute inset-0 z-0">
                    <video
                        src={loginVideo}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className="absolute top-4 right-4 z-10">
                    <button 
                        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                        className="flex items-center gap-2 cursor-pointer bg-white/20 px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors backdrop-blur-sm"
                    >
                        <span className="text-[16px]">{selectedLanguage.flag}</span>
                        <span className="text-[13px] font-bold text-white">{selectedLanguage.name}</span>
                        <ChevronDown size={14} className={`text-white transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showLanguageDropdown && (
                        <div className="absolute top-full right-0 mt-2 bg-white/95 rounded-lg shadow-lg backdrop-blur-sm border border-white/20 overflow-hidden">
                            {languages.map((lang) => (
                                <button
                                    key={lang.name}
                                    onClick={() => handleLanguageSelect(lang)}
                                    className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-[#1a1a2e] hover:bg-[#DCE9E3] transition-colors flex items-center gap-2"
                                >
                                    <span className="text-[16px]">{lang.flag}</span>
                                    {lang.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
