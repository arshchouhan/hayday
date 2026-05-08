import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FilterDropdown = ({ label, value, options, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.id === value);

    return (
        <div className="relative h-[40px] min-w-[200px]" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-full w-full cursor-pointer items-center justify-between rounded-xl border border-[#DCE9E3] bg-[#DCE9E3] px-4 shadow-sm transition-all hover:bg-[#c8dbd4]"
            >
                <span className={`text-[13px] font-bold text-[#233746]`}>
                    {selectedOption ? selectedOption.name : placeholder}
                </span>
                <svg viewBox="0 0 24 24" className={`h-4 w-4 text-[#233746] transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
            </div>

            {isOpen && (
                <div className="absolute top-[45px] left-0 z-50 w-full rounded-xl border border-gray-100 bg-white py-1 shadow-xl animate-in fade-in zoom-in duration-150">
                    {options.map((opt) => (
                        <div
                            key={opt.id}
                            onClick={() => { onChange(opt.id); setIsOpen(false); }}
                            className={`cursor-pointer px-4 py-2 text-[13px] font-medium transition-colors ${value === opt.id ? 'bg-blue-50 text-[#1a1a2e] font-bold' : 'text-[#1a1a2e] hover:bg-gray-50'}`}
                        >
                            {opt.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const Activity = () => {
    const [selectedAnimal, setSelectedAnimal] = useState(() => localStorage.getItem('selectedAnimal') || '');
    const [loading, setLoading] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const handleAnimalChange = (val) => {
        if (val === selectedAnimal) return;
        setLoading(true);
        setSelectedAnimal(val);
        localStorage.setItem('selectedAnimal', val);
        setTimeout(() => {
            setLoading(false);
        }, 600);
    };

    const animalsList = [
        { id: 'cow', name: 'Cow' },
        { id: 'sheep', name: 'Sheep' },
    ];

    const carouselRef = useRef(null);

    const updateCarouselScrollState = () => {
        const carousel = carouselRef.current;

        if (!carousel) {
            setCanScrollLeft(false);
            setCanScrollRight(false);
            return;
        }

        const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;

        setCanScrollLeft(carousel.scrollLeft > 4);
        setCanScrollRight(carousel.scrollLeft < maxScrollLeft - 4);
    };

    useEffect(() => {
        updateCarouselScrollState();

        const carousel = carouselRef.current;

        if (!carousel) return undefined;

        carousel.addEventListener('scroll', updateCarouselScrollState, { passive: true });
        window.addEventListener('resize', updateCarouselScrollState);

        return () => {
            carousel.removeEventListener('scroll', updateCarouselScrollState);
            window.removeEventListener('resize', updateCarouselScrollState);
        };
    }, [selectedAnimal, loading]);

    const scroll = (direction) => {
        if (carouselRef.current) {
            const scrollAmount = 350;
            const delta = direction === 'left' ? -scrollAmount : scrollAmount;

            carouselRef.current.scrollBy(delta, 0);
        }
    };

    const navigate = useNavigate();

    return (
        <div className="relative flex h-full flex-col bg-[#F8FAFD] p-8 overflow-y-auto overflow-x-hidden scrollbar-hide">
            <div className="relative flex shrink-0 flex-col items-start gap-0 mb-10 lg:flex-row">
                <div className="relative z-20 w-full lg:w-[480px] shrink-0 bg-[#F8FAFD]/60 backdrop-blur-xl py-2 pr-16">
                    <h1 className="text-[36px] font-black text-[#1a1a2e] tracking-tight leading-tight mb-3">Add Activities</h1>
                    <p className="text-[15px] font-medium text-gray-500 leading-relaxed mb-8 max-w-[380px]">
                        Monitor real-time farm operations and task history with deep health insights.
                    </p>
                    <div className="flex items-center gap-3">
                        <FilterDropdown
                            placeholder="Choose Animal"
                            value={selectedAnimal}
                            options={animalsList}
                            onChange={handleAnimalChange}
                        />
                    </div>
                </div>

                {!loading && selectedAnimal && (
                    <div className={`relative z-10 flex-1 flex flex-col gap-6 pt-2 min-w-0 transition-all duration-300 opacity-100 pointer-events-auto`}>
                        {selectedAnimal === 'sheep' ? (
                            <p className="text-[15px] font-semibold text-gray-400">Not ready yet.</p>
                        ) : (
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => scroll('left')}
                                    disabled={!canScrollLeft}
                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D6E2EE] bg-white text-[#1a1a2e] shadow-sm transition-all hover:bg-[#F1F5F9] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:shadow-sm"
                                    aria-label="Scroll activity cards backward"
                                >
                                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M15 18l-6-6 6-6" />
                                    </svg>
                                </button>

                                <div ref={carouselRef} className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
                                    {[
                                        { id: 'health', title: 'Animal Health & Treatment', icon: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M2 12h20" /></svg> },
                                        { id: 'breeding', title: 'Breeding & Reproduction', icon: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg> },
                                        { id: 'movement', title: 'Movement & Location Management', icon: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 8l4 4-4 4M8 12h7" /></svg> },
                                        { id: 'sales', title: 'Sales & Records', icon: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg> }
                                    ].map((card, i) => (
                                        <div
                                            key={i}
                                            onClick={() => navigate(`/farm/activity/${card.id}`)}
                                            className="w-[320px] shrink-0 rounded-2xl border border-[#80888F]/30 bg-white p-4 shadow-sm cursor-pointer hover:shadow-md hover:border-blue-200 transition-all active:scale-[0.98]"
                                        >
                                            <div className="mb-3 text-[#1a1a2e]/60">{card.icon}</div>
                                            <span className="inline-flex rounded-full bg-[#DCE9E3] px-3 py-1 text-[14px] font-medium text-[#233746]">
                                                {card.title}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => scroll('right')}
                                    disabled={!canScrollRight}
                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D6E2EE] bg-white text-[#1a1a2e] shadow-sm transition-all hover:bg-[#F1F5F9] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:shadow-sm"
                                    aria-label="Scroll activity cards forward"
                                >
                                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M9 18l6-6-6-6" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex-1"></div>

            {selectedAnimal === 'sheep' ? (
                <div className="relative z-10 flex shrink-0 items-center justify-center py-10">
                    <p className="text-[15px] font-semibold text-gray-400">Come back later for sheep 🐑</p>
                </div>
            ) : (
                <div className="relative z-10 grid shrink-0 grid-cols-1 items-stretch gap-4 pb-4 xl:grid-cols-12 transition-all duration-300">
                    <section className="rounded-2xl border border-[#D6E2EE] bg-white p-3 shadow-sm xl:col-span-6">
                        <div className="mb-3 flex items-center justify-between border-b border-[#D6E2EE] pb-3">
                            {selectedAnimal && <h2 className="text-[17px] font-black text-[#1a1a2e]">Cows Ready for Calving</h2>}
                            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a1a2e] text-sm text-white">?</button>
                        </div>
                        {selectedAnimal && (
                            <div className="flex min-h-[150px] flex-col items-center justify-center rounded-2xl bg-[#F1F5F9] px-3 py-4 text-center">
                                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <path d="M3 13c0-2.8 2.2-5 5-5h6.5c3.1 0 5.5 2.4 5.5 5.5V16a2 2 0 0 1-2 2h-1" />
                                        <path d="M7 10V7m10 3V7" />
                                        <circle cx="8" cy="14" r="1" />
                                        <circle cx="14" cy="14" r="1" />
                                    </svg>
                                </div>
                                <p className="mb-3 text-[14px] font-medium text-slate-600">No cows marked as pregnant</p>
                                <button className="rounded-full border border-gray-300 bg-white px-5 py-1.5 text-[14px] font-semibold text-[#1a1a2e] hover:bg-gray-50">
                                    Mark As Pregnant
                                </button>
                            </div>
                        )}
                    </section>

                    <section className="rounded-2xl border border-[#D6E2EE] bg-white p-3 shadow-sm xl:col-span-6">
                        <div className="mb-3 flex items-center justify-between border-b border-[#D6E2EE] pb-3">
                            {selectedAnimal && <h2 className="text-[17px] font-black text-[#1a1a2e]">Animals to keep an eye on</h2>}
                            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a1a2e] text-sm text-white">?</button>
                        </div>
                        {selectedAnimal && (
                            <div className="rounded-2xl bg-slate-100 p-3">
                                <p className="mb-2 text-[18px] font-bold tracking-wide text-[#1a1a2e]">453534534</p>
                                <div className="inline-flex rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-[#1a1a2e]">
                                    Breeding performed 8 hours ago
                                </div>
                            </div>
                        )}
                    </section>

                </div>
            )}
        </div>
    );
};

export default Activity;
