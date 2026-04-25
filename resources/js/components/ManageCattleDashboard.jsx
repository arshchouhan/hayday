import React, { useState, useEffect } from 'react';
import illustration from '../assets/no-enterprises.svg';
import animalIcon from '../assets/noun-animals-13643.svg';
import locationIcon from '../assets/noun-location-8084981.svg';
import groupIcon from '../assets/noun-group-500439.svg';
import farmerIcon from '../assets/noun-farmer-4114354.svg';
import hayIcon from '../assets/noun-hay-7549821.svg';
import RegisterAnimal from './RegisterAnimal';
import { ChevronRight, MapPin, Layers, Users, Grid, List } from 'lucide-react';

const SetupCard = ({ step, title, status, buttonText, onClick, icon }) => {
    return (
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-[#80888F] bg-white px-4 py-2.5 shadow-sm transition-all hover:border-[#80888F] hover:shadow-none">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#D7E3EF]">
                {React.cloneElement(icon, { size: 14, className: "text-[#1a1a2e]" })}
            </div>

            <div className="flex flex-1 items-center justify-between min-w-0 gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[10px] font-bold text-gray-400">S{step}</span>
                    <h3 className="truncate text-[13px] font-bold text-[#1a1a2e]">{title}</h3>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                    {status && (
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-tight ${status === 'Completed' ? 'bg-[#D7E3EF] text-[#1a1a2e]' : 'bg-orange-50 text-orange-600'
                            }`}>
                            {status === 'Completed' ? 'Done' : 'Pending'}
                        </span>
                    )}
                    <button
                        onClick={onClick}
                        className={`rounded-full px-3.5 py-1 text-[11px] font-bold transition-all ${buttonText === 'Completed'
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

const StatCard = ({ icon, count, label }) => (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#80888F]/30 bg-white p-4 shadow-sm transition-all hover:border-[#80888F] hover:shadow-md cursor-pointer aspect-square w-[140px] shrink-0">
        {/* Background Icon */}
        <div className="absolute -right-3 -top-3 text-[#1a1a2e] transition-transform duration-300 group-hover:scale-110">
            {icon}
        </div>

        <div className="relative z-10">
            <div className="text-xl font-black text-[#1a1a2e] tracking-tight">{count}</div>
        </div>

        <div className="relative z-10">
            <div className="text-[13px] font-bold text-[#1a1a2e] leading-tight">{label}</div>
        </div>
    </div>
);

const AnimalCard = ({ earTag, type, name, status }) => (
    <div className="group relative flex flex-col gap-3 rounded-2xl border border-[#80888F]/20 bg-white p-4 shadow-sm transition-all hover:border-[#80888F] hover:shadow-none hover:ring-0">
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8FAFD] text-gray-400">
                    <img src={animalIcon} className="h-4 w-4 opacity-50 grayscale" alt="animal" />
                </div>
                <span className="text-lg font-bold text-[#1a1a2e]">{earTag}</span>
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D7E3EF] text-[#1a1a2e]">
                <span className="text-[10px] font-black italic">AI</span>
            </div>
        </div>

        <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#E9EEF6] px-3 py-1 text-[11px] font-bold text-[#1a1a2e]">
                {type}
            </span>
            <span className="rounded-full bg-[#E9EEF6] px-3 py-1 text-[11px] font-bold text-[#1a1a2e]">
                {name}
            </span>
        </div>

        <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#1a1a2e]"></div>
            <span className="text-[11px] font-bold text-[#1a1a2e]">{status}</span>
        </div>
    </div>
);

const AnimalList = ({ animals }) => (
    <div className="flex flex-col flex-1 min-h-0 w-full overflow-hidden rounded-2xl border border-[#80888F]/20 bg-white shadow-sm">
        <div className="flex-1 overflow-auto min-h-0">
            <table className="w-full text-left border-collapse relative">
                <thead className="sticky top-0 z-40">
                    <tr className="border-b border-gray-100 bg-[#F8FAFD]">
                        <th className="sticky left-0 z-50 p-4 w-12 bg-[#F8FAFD] border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                        </th>
                        <th className="sticky left-12 z-50 p-4 text-[13px] font-black text-[#1a1a2e] uppercase tracking-wider bg-[#F8FAFD] border-r border-gray-200 shadow-[4px_0_10px_-3px_rgba(0,0,0,0.1)]">
                            Animal Eartag
                        </th>
                        <th className="p-4 text-[13px] font-black text-[#1a1a2e] uppercase tracking-wider whitespace-nowrap border-r border-gray-100/50">Animal Name</th>
                        <th className="p-4 text-[13px] font-black text-[#1a1a2e] uppercase tracking-wider whitespace-nowrap border-r border-gray-100/50">Animal Type</th>
                        <th className="p-4 text-[13px] font-black text-[#1a1a2e] uppercase tracking-wider whitespace-nowrap border-r border-gray-100/50">Electronic Id</th>
                        <th className="p-4 text-[13px] font-black text-[#1a1a2e] uppercase tracking-wider whitespace-nowrap border-r border-gray-100/50">Breed</th>
                        <th className="p-4 text-[13px] font-black text-[#1a1a2e] uppercase tracking-wider whitespace-nowrap border-r border-gray-100/50">Status</th>
                        <th className="p-4 text-[13px] font-black text-[#1a1a2e] uppercase tracking-wider whitespace-nowrap border-r border-gray-100/50">Group</th>
                        <th className="p-4 text-[13px] font-black text-[#1a1a2e] uppercase tracking-wider whitespace-nowrap border-r border-gray-100/50">Ownership</th>
                        <th className="p-4 text-[13px] font-black text-[#1a1a2e] uppercase tracking-wider whitespace-nowrap border-r border-gray-100/50">Location</th>
                        <th className="p-4 text-[13px] font-black text-[#1a1a2e] uppercase tracking-wider whitespace-nowrap">Animal Weights</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {animals.map((animal, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                            <td className="sticky left-0 z-20 p-4 bg-white group-hover:bg-gray-50 transition-colors border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                            </td>
                            <td className="sticky left-12 z-20 p-4 bg-white group-hover:bg-gray-50 transition-colors border-r border-gray-200 shadow-[4px_0_10px_-3px_rgba(0,0,0,0.1)]">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                                        <img src={animalIcon} className="h-3.5 w-3.5 opacity-40 grayscale" alt="animal" />
                                    </div>
                                    <span className="font-bold text-[#1a1a2e] border-b border-[#1a1a2e] leading-tight cursor-pointer whitespace-nowrap">{animal.earTag}</span>
                                </div>
                            </td>
                            <td className="p-4 text-[14px] font-medium text-gray-600 whitespace-nowrap border-r border-gray-100/50">{animal.name}</td>
                            <td className="p-4 text-[14px] font-bold text-[#1a1a2e] whitespace-nowrap border-r border-gray-100/50">{animal.type}</td>
                            <td className="p-4 text-[14px] font-medium text-gray-600 whitespace-nowrap border-r border-gray-100/50">{animal.electronicId || '---'}</td>
                            <td className="p-4 text-[14px] font-medium text-gray-500 whitespace-nowrap border-r border-gray-100/50">{animal.breed || 'American Lineback'}</td>
                            <td className="p-4 whitespace-nowrap border-r border-gray-100/50">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    <span className="text-[13px] font-bold text-[#1a1a2e]">{animal.status}</span>
                                </div>
                            </td>
                            <td className="p-4 text-[14px] font-medium text-gray-500 whitespace-nowrap border-r border-gray-100/50">{animal.group || "Default Group"}</td>
                            <td className="p-4 text-[14px] font-medium text-gray-500 whitespace-nowrap border-r border-gray-100/50">{animal.ownership || "Self Owned"}</td>
                            <td className="p-4 text-[14px] font-medium text-gray-500 whitespace-nowrap border-r border-gray-100/50">{animal.location || "Arsh's Farm"}</td>
                            <td className="p-4 text-[14px] font-medium text-gray-500 whitespace-nowrap">{animal.weight || "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="sticky bottom-0 z-40 flex items-center justify-between border-t border-gray-100 py-1.5 px-4 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="text-[14px] font-bold text-[#1a1a2e]">
                0/{animals.length} Animal Selected
            </div>
            <div className="flex items-center gap-3">
                <button className="rounded-full bg-[#E9EEF6] px-5 py-2 text-[13px] font-bold text-[#1a1a2e] hover:bg-[#D7E3EF] transition-all">
                    Select all on this page
                </button>
                <button className="rounded-full bg-[#E9EEF6] px-5 py-2 text-[13px] font-bold text-[#1a1a2e] hover:bg-[#D7E3EF] transition-all">
                    Deselect All
                </button>
                <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
                <button className="flex items-center gap-2 rounded-full bg-gray-50 px-5 py-2 text-[13px] font-bold text-gray-400 cursor-not-allowed">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    Delete
                </button>
                <button className="flex items-center gap-2 rounded-full bg-gray-50 px-5 py-2 text-[13px] font-bold text-gray-400 cursor-not-allowed border border-gray-100">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" /></svg>
                    Choose Activity
                </button>
            </div>
        </div>
    </div>
);

export default function ManageCattleDashboard({ selectedAnimal, onSelectAnimal }) {
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        if (selectedAnimal === 'Animal Details' && !hasFetched) {
            setLoading(true);
            fetch('/api/animals')
                .then(res => res.json())
                .then(data => {
                    const mappedData = data.map(animal => ({
                        ...animal,
                        earTag: animal.ear_tag,
                        name: animal.animal_name,
                        brandName: animal.type, // Mapping type to brandName as per previous UI
                        weight: animal.birth_weight ? `${animal.birth_weight} kg` : "N/A",
                        breed: animal.breed?.name ?? null,
                        location: animal.location?.name ?? null,
                        group: animal.group?.name ?? null,
                    }));
                    setAnimals(mappedData);
                    setLoading(false);
                    setHasFetched(true);
                })
                .catch(err => {
                    console.error("Error fetching animals:", err);
                    setLoading(false);
                    setHasFetched(true);
                });
        }
    }, [selectedAnimal, hasFetched]);

    if (selectedAnimal === 'Register Animal') {
        return (
            <section className="h-full min-h-0 w-full overflow-auto bg-[#F8FAFD] p-4 sm:p-8">
                <RegisterAnimal />
            </section>
        );
    }

    if (loading && selectedAnimal === 'Animal Details') {
        return (
            <div className="flex h-full items-center justify-center bg-[#F8FAFD] rounded-md">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative flex h-32 w-32 items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-[#D7E3EF] animate-ping opacity-50"></div>
                        <img src={hayIcon} alt="Loading" className="relative z-10 h-24 w-24 animate-bounce drop-shadow-xl" />
                    </div>
                    <p className="text-[15px] font-bold text-[#1a1a2e]">Loading Animals...</p>
                </div>
            </div>
        );
    }

    const renderDashboard = () => {
        const totalPages = Math.ceil(animals.length / itemsPerPage);
        const paginatedAnimals = animals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

        return (
            <section className="flex h-full w-full flex-col bg-[#F8FAFD] px-6 pt-6 pb-2 gap-6 overflow-hidden">
                <div className="flex items-center justify-between shrink-0">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black text-[#1a1a2e] tracking-tight">Manage Animals</h1>
                </div>
            </div>

            <div className="flex flex-wrap items-start gap-4 shrink-0">
                <StatCard
                    label="Total Animals"
                    count={animals.length.toString()}
                    icon={<img src={animalIcon} className="h-24 w-24 opacity-[0.07] grayscale brightness-0" alt="icon" />}
                />
                <StatCard
                    label="Total Locations"
                    count={[...new Set(animals.map(a => a.location_id))].filter(Boolean).length.toString()}
                    icon={<img src={locationIcon} className="h-24 w-24 opacity-[0.07] grayscale brightness-0" alt="icon" />}
                />
                <StatCard
                    label="Total Groups"
                    count={[...new Set(animals.map(a => a.group_id))].filter(Boolean).length.toString()}
                    icon={<img src={groupIcon} className="h-24 w-24 opacity-[0.07] grayscale brightness-0" alt="icon" />}
                />
                <StatCard
                    label="Total Workers"
                    count="12"
                    icon={<img src={farmerIcon} className="h-24 w-24 opacity-[0.07] grayscale brightness-0" alt="icon" />}
                />
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
                <div className="relative flex-1 min-w-[300px]">
                    <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    <input
                        type="text"
                        placeholder="Search animals by Ear Tag"
                        className="h-[52px] w-full rounded-lg border border-[#80888F] bg-[#E9EEF6] pl-10 pr-4 text-[15px] text-[#1a1a2e] shadow-sm outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-[#1a1a2e]"
                    />
                </div>

                <button className="h-[52px] rounded-lg border border-[#80888F] bg-[#E9EEF6] px-6 text-[15px] font-bold text-[#1a1a2e] shadow-sm transition-all hover:bg-[#DDE7F3]">
                    Show Selection
                </button>

                <div className="flex h-[52px] items-center rounded-lg border border-[#80888F] bg-[#E9EEF6] p-1 shadow-sm">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`flex h-10 w-12 items-center justify-center rounded-md transition-all ${viewMode === 'grid' ? 'bg-[#1a1a2e] text-white shadow-sm' : 'text-gray-500 hover:bg-black/5'}`}
                    >
                        <Grid size={20} strokeWidth={2.5} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex h-10 w-12 items-center justify-center rounded-md transition-all ${viewMode === 'list' ? 'bg-[#1a1a2e] text-white shadow-sm' : 'text-gray-500 hover:bg-black/5'}`}
                    >
                        <List size={20} strokeWidth={2.5} />
                    </button>
                </div>

                <div className="relative group h-[52px]">
                    <button className="flex h-full items-center gap-4 rounded-lg border border-[#80888F] bg-[#E9EEF6] px-4 text-[15px] font-bold text-[#1a1a2e] shadow-sm transition-all hover:bg-[#DDE7F3]">
                        Ear Tag
                        <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m7 15 5 5 5-5M7 9l5-5 5 5" /></svg>
                    </button>
                </div>

                <div className="relative h-[52px]">
                    <select className="h-full appearance-none rounded-lg border border-[#80888F] bg-[#E9EEF6] pl-4 pr-10 text-[15px] font-bold text-[#1a1a2e] shadow-sm outline-none focus:ring-1 focus:ring-[#1a1a2e]">
                        <option>Select location</option>
                    </select>
                    <svg viewBox="0 0 24 24" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
                </div>

                <button className="relative flex h-[52px] w-[52px] items-center justify-center rounded-lg border border-[#80888F] bg-[#E9EEF6] text-gray-500 shadow-sm transition-all hover:bg-[#DDE7F3]">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#1a1a2e] text-[10px] font-bold text-white shadow-md">1</span>
                </button>
            </div>

            {viewMode === 'grid' ? (
                <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
                    <div className="flex-1 overflow-y-auto min-h-0 pr-2 pb-4">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {paginatedAnimals.map((animal, idx) => (
                                <AnimalCard key={idx} {...animal} />
                            ))}
                        </div>
                    </div>
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-200 pt-3 pb-1 shrink-0">
                            <span className="text-sm font-medium text-gray-500">
                                Showing <span className="font-bold text-[#1a1a2e]">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-[#1a1a2e]">{Math.min(currentPage * itemsPerPage, animals.length)}</span> of <span className="font-bold text-[#1a1a2e]">{animals.length}</span> animals
                            </span>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-sm font-bold text-[#1a1a2e] shadow-sm transition-all hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button 
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-sm font-bold text-[#1a1a2e] shadow-sm transition-all hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <AnimalList animals={animals} />
            )}
        </section>
        );
    };

    const renderIllustration = () => (
        <section className="relative h-full min-h-0 w-full overflow-hidden bg-[#F8FAFD] p-6">
            <style>{`
                @keyframes tailWag { 0% { transform: rotate(0deg); } 25% { transform: rotate(1deg); } 75% { transform: rotate(-1deg); } 100% { transform: rotate(0deg); } }
                @keyframes breathe { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }
                .animate-alive { animation: tailWag 3s ease-in-out infinite, breathe 5s ease-in-out infinite; transform-origin: center bottom; }
            `}</style>
            <div className="flex h-full flex-col items-center justify-center pb-28">
                <div className="w-full max-w-lg md:max-w-xl animate-alive">
                    <img src={illustration} alt="HayDay" className="mx-auto w-full brightness-0 opacity-100" />
                </div>
                <div className="mt-8 text-center space-y-2">
                    <h1 className="text-4xl font-black text-[#1a1a2e] tracking-tight italic">HayDay !</h1>
                    <p className="text-lg text-gray-500 font-medium italic opacity-80">Setup your farm to get started</p>
                </div>
            </div>
            <div className="absolute bottom-12 left-0 right-0 flex justify-center px-10">
                <div className="grid w-full max-w-5xl grid-cols-1 gap-3 md:grid-cols-3">
                    <SetupCard step="1" title="Ranch Details" buttonText="Completed" status="Completed" icon={<MapPin />} />
                    <SetupCard step="2" status="Pending" title="Location Details" buttonText="Add" icon={<MapPin />} />
                    <SetupCard step="3" status="Pending" title="Livestock" buttonText="Add" onClick={() => onSelectAnimal('Register Animal')} icon={<Users />} />
                </div>
            </div>
        </section>
    );

    // Swap as requested:
    // Lifecycle (null) -> Illustration
    // Animal Details ('Animal Details') -> Manage Cattle Dashboard
    if (selectedAnimal === 'Animal Details') {
        return renderDashboard();
    }

    if (!selectedAnimal) {
        return renderIllustration();
    }

    const getContent = () => {
        switch (selectedAnimal) {
            case 'Scheduler':
                return { title: 'Farm Scheduler', description: 'Manage upcoming tasks, vaccinations, breeding dates, and feeding schedules.' };
            case 'Groups':
                return { title: 'Livestock Groups', description: 'Organize your animals into pastures, groups, or pens.' };
            default:
                return { title: 'Workspace', description: 'Manage your farm activities here.' };
        }
    };

    const content = getContent();
    return (
        <section className="h-full min-h-0 w-full bg-[#F8FAFD]">
            <div className="flex h-full flex-col items-center justify-center text-center bg-[#F8FAFD] p-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e]">{content.title}</h2>
                <p className="mt-3 max-w-md text-sm text-gray-400">{content.description}</p>
            </div>
        </section>
    );
}
