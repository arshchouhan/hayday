import React, { useRef, useState, useEffect } from 'react';
import Loader from '../components/Loader';

const FilterDropdown = ({ label, value, options, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(true);
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
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAnimal, setSelectedAnimal] = useState(() => localStorage.getItem('selectedAnimal') || '');
    const [loading, setLoading] = useState(false);

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
    const days = [
        { date: '26 Sun', isCurrent: true },
        { date: '27 Mon' },
        { date: '28 Tue' },
        { date: '29 Wed' },
        { date: '30 Thu' },
        { date: '01 Fri' },
        { date: '02 Sat' },
    ];

    const times = ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];
    const carouselRef = useRef(null);
    const searchRef = useRef(null);

    useEffect(() => {
        if (searchQuery && searchRef.current) {
            setTimeout(() => {
                searchRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, [searchQuery]);

    const scroll = (direction) => {
        if (carouselRef.current) {
            const scrollAmount = 350;
            carouselRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="relative flex h-full flex-col bg-[#F8FAFD] p-8 overflow-y-auto overflow-x-hidden scrollbar-hide">
            {/* Modern Mesh Gradient Background (Unevenly Distributed) */}
            <div className="absolute top-[-100px] right-[-100px] h-[500px] w-[500px] rounded-full bg-[#D7E3EF]/40 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[20%] left-[-150px] h-[400px] w-[400px] rounded-full bg-blue-100/30 blur-[100px] pointer-events-none" />
            <div className="absolute top-[30%] right-[10%] h-[300px] w-[300px] rounded-full bg-white/60 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[-50px] right-[20%] h-[250px] w-[250px] rounded-full bg-[#D7E3EF]/20 blur-[60px] pointer-events-none" />

            {/* Compact Latest Activities Section */}
            <div className="relative flex shrink-0 flex-col items-start gap-0 mb-10 lg:flex-row">
                {/* Left Content Column (Fixed/On Top) */}
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

                    {/* Faded Gradient Edge */}
                    <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-r from-[#F8FAFD] to-transparent pointer-events-none" />
                </div>

                {!loading && selectedAnimal !== 'sheep' && (
                    <div className={`relative z-10 flex-1 flex flex-col gap-6 pt-2 min-w-0 transition-all duration-300 ${!selectedAnimal ? 'opacity-30 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
                        <div ref={carouselRef} className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
                            {[
                                { title: 'Animal Health & Treatment', icon: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M2 12h20" /></svg> },
                                { title: 'Breeding & Reproduction', icon: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg> },
                                { title: 'Movement & Location Management', icon: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 8l4 4-4 4M8 12h7" /></svg> },
                                { title: 'Sales & Records', icon: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg> }
                            ].map((card, i) => (
                                <div key={i} className="w-[320px] shrink-0 rounded-2xl border border-[#80888F]/30 bg-white p-4 shadow-sm">
                                    <div className="mb-3 text-[#1a1a2e]/60">{card.icon}</div>
                                    <span className="inline-flex rounded-full bg-[#DCE9E3] px-3 py-1 text-[14px] font-medium text-[#233746]">
                                        {card.title}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 pl-2">
                            <button
                                onClick={() => scroll('left')}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-[#1a1a2e] hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                            >
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-[#1a1a2e] hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                            >
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {loading ? (
                <div className="flex flex-1 items-center justify-center">
                    <Loader message="Switching categories..." />
                </div>
            ) : selectedAnimal === 'sheep' ? (
                <div className="flex flex-1 flex-col items-center justify-center text-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                        <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-black text-gray-300 tracking-tight italic mb-2">Come back later</h2>
                    <p className="text-gray-400 font-medium">Sheep activities are currently being prepared.</p>
                </div>
            ) : (
                <>
                    {/* Content Divider */}
                    <div className="h-[1px] w-full bg-gray-100 mb-8 shrink-0"></div>

                    {/* Added Section: Activity Overview (Add-only, existing layout preserved) */}
                    <div className={`relative z-10 grid shrink-0 grid-cols-1 items-stretch gap-4 pb-4 xl:grid-cols-12 transition-all duration-300 ${!selectedAnimal ? 'opacity-30 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
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

                        {/* Search Bar - Independent */}
                        <div ref={searchRef} className="xl:col-span-12">
                            <div className={`flex items-center gap-3 rounded-2xl border bg-white px-5 py-3 shadow-sm transition-all duration-300 ${searchQuery ? 'border-[#233746] rounded-b-none' : 'border-[#D6E2EE]'
                                }`}>
                                <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.35-4.35" />
                                </svg>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search workers and activity alerts..."
                                    className="w-full bg-transparent text-[14px] font-medium text-[#1a1a2e] placeholder-gray-400 outline-none"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
                                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M18 6 6 18M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            {/* Results Panel - extends seamlessly from search bar */}
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${searchQuery ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                <div className="rounded-b-2xl border border-t-0 border-[#233746] bg-white text-center">
                                    {/* Tabs inside panel */}
                                    <div className="flex items-center gap-6 border-b border-[#D6E2EE] px-4 pt-2">
                                        <button className="text-[15px] font-bold text-[#1a1a2e] border-b-2 border-[#1a1a2e] pb-2">Workers</button>
                                        <button className="text-[15px] font-medium text-gray-400 pb-2 hover:text-[#1a1a2e] transition-colors">Activity Alerts</button>
                                    </div>
                                    {/* Empty State */}
                                    <div className="flex min-h-[180px] flex-col items-center justify-center px-4 py-8">
                                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F1F5F9] text-gray-400">
                                            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                <circle cx="11" cy="11" r="8" />
                                                <path d="m21 21-4.35-4.35" />
                                            </svg>
                                        </div>
                                        <p className="text-[15px] font-bold text-slate-700 mb-1">No results found</p>
                                        <p className="text-[13px] font-medium text-slate-500">No matches for "{searchQuery}"</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Future Logs Workspace */}
            <div className="flex-1"></div>
        </div>
    );
};

export default Activity;
