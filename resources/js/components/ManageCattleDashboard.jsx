import React, { useState, useEffect, useRef } from 'react';
import illustration from '../assets/no-enterprises.svg';
import animalIcon from '../assets/noun-animals-13643.svg';
import locationIcon from '../assets/noun-location-8084981.svg';
import groupIcon from '../assets/noun-group-500439.svg';
import farmerIcon from '../assets/noun-farmer-4114354.svg';
import hayIcon from '../assets/noun-hay-7549821.svg';
import cowIcon from '../assets/noun-cow-8349503.svg';
import sheepIcon from '../assets/noun-sheep-8349507.svg';
import RegisterAnimal from './RegisterAnimal';
import AnimalDetail from './AnimalDetail';
import Loader from './Loader';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, MapPin, Layers, Users, Grid, List } from 'lucide-react';

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
        <div className="relative h-[44px] min-w-[160px]" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-full w-full cursor-pointer items-center justify-between rounded-lg border border-[#80888F]/30 bg-white px-4 shadow-sm transition-all hover:border-[#1a1a2e]"
            >
                <span className={`text-[13px] font-bold ${!selectedOption ? 'text-gray-400' : 'text-[#1a1a2e]'}`}>
                    {selectedOption ? selectedOption.name : placeholder}
                </span>
                <svg viewBox="0 0 24 24" className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
            </div>

            {isOpen && (
                <div className="absolute top-[48px] left-0 z-50 w-full rounded-xl border border-gray-100 bg-white py-1 shadow-xl animate-in fade-in zoom-in duration-150">
                    <div
                        onClick={() => { onChange(''); setIsOpen(false); }}
                        className="cursor-pointer px-4 py-2 text-[13px] font-medium text-gray-400 hover:bg-gray-50 hover:text-[#1a1a2e]"
                    >
                        {placeholder}
                    </div>
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
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#80888F]/30 bg-white p-3 shadow-sm transition-all hover:border-[#80888F] hover:shadow-md cursor-pointer aspect-square w-[125px] shrink-0">
        {/* Background Icon */}
        <div className="absolute -right-3 -top-3 text-[#1a1a2e] transition-transform duration-300 group-hover:scale-110">
            {icon}
        </div>

        <div className="relative z-10">
            <div className="text-lg font-black text-[#1a1a2e] tracking-tight">{count}</div>
        </div>

        <div className="relative z-10">
            <div className="text-[12px] font-bold text-[#1a1a2e] leading-tight">{label}</div>
        </div>
    </div>
);

const AnimalCard = ({ earTag, type, name, breed, status, species, ear_tag_color, id, _id, isSelected, onToggleSelect, onViewAnimal }) => {
    const animalId = id || _id;
    const breedStr = typeof breed === 'string' ? breed : breed?.name || '';
    const isCow = (
        species?.toLowerCase().includes('cow') ||
        species?.toLowerCase().includes('cattle') ||
        type?.toLowerCase().includes('cow') ||
        type?.toLowerCase().includes('bull') ||
        type?.toLowerCase().includes('calf') ||
        type?.toLowerCase().includes('heifer') ||
        type?.toLowerCase().includes('steer')
    );
    const animalType = isCow ? 'cow' : 'sheep';

    return (
        <div
            onClick={(e) => {
                if (e.target.type !== 'checkbox') {
                    onViewAnimal(animalId, animalType);
                }
            }}
            className={`group relative flex flex-col gap-3 rounded-2xl border p-4 shadow-sm transition-all cursor-pointer ${isSelected
                ? 'border-[#1a1a2e] bg-blue-50/50 ring-1 ring-[#1a1a2e]'
                : 'border-[#80888F]/20 bg-white hover:border-[#80888F] hover:shadow-none hover:ring-0'
                }`}
        >
            <div className="absolute top-3 right-3 z-10">
                <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 accent-[#1a1a2e]"
                    checked={isSelected}
                    onChange={(e) => {
                        e.stopPropagation();
                        onToggleSelect(animalId);
                    }}
                />
            </div>
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-gray-400 shadow-sm ring-1 ring-black/5 ${ear_tag_color || 'bg-white'}`}>
                        <img
                            src={animalType === 'sheep' ? sheepIcon : cowIcon}
                            className="h-5.5 w-5.5 opacity-80"
                            alt={type}
                        />
                    </div>
                    <span
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewAnimal(animalId, animalType);
                        }}
                        className="text-[16px] font-bold text-[#1a1a2e] hover:underline"
                    >
                        {earTag}
                    </span>
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
};

const AnimalList = ({ animals, selectedIds, onToggleSelect, onSelectAll, onDeselectAll, onViewAnimal }) => {
    const isAllSelected = animals.length > 0 && animals.every(a => selectedIds.includes(a.id || a._id));
    const hasSelection = selectedIds.length > 0;

    return (
        <div className="flex flex-col flex-1 min-h-0 w-full overflow-hidden rounded-2xl border border-[#80888F]/20 bg-white shadow-sm">
            <div className="flex-1 overflow-auto min-h-0">
                <table className="w-full text-left border-collapse relative">
                    <thead className="sticky top-0 z-40">
                        <tr className="border-b border-gray-100 bg-[#F8FAFD]">
                            <th className="sticky left-0 z-50 p-4 w-12 bg-[#F8FAFD] border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 accent-[#1a1a2e]"
                                    checked={isAllSelected}
                                    onChange={isAllSelected ? onDeselectAll : onSelectAll}
                                />
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
                        {animals.map((animal, idx) => {
                            const animalId = animal.id || animal._id;
                            const isSelected = selectedIds.includes(animalId);
                            const isCowList = (
                                animal.species?.toLowerCase().includes('cow') ||
                                animal.species?.toLowerCase().includes('cattle') ||
                                animal.type?.toLowerCase().includes('cow') ||
                                animal.type?.toLowerCase().includes('bull') ||
                                animal.type?.toLowerCase().includes('calf') ||
                                animal.type?.toLowerCase().includes('heifer') ||
                                animal.type?.toLowerCase().includes('steer')
                            );
                            const animalTypeList = isCowList ? 'cow' : 'sheep';
                            return (
                                <tr key={idx} className={`hover:bg-gray-50 transition-colors group ${isSelected ? 'bg-blue-50/30' : ''}`}>
                                    <td className="sticky left-0 z-20 p-4 bg-inherit border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 accent-[#1a1a2e]"
                                            checked={isSelected}
                                            onChange={() => onToggleSelect(animalId)}
                                        />
                                    </td>
                                    <td className="sticky left-12 z-20 p-4 bg-inherit border-r border-gray-200 shadow-[4px_0_10px_-3px_rgba(0,0,0,0.1)]">
                                        <div className="flex items-center gap-2">
                                            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-gray-400 shadow-sm ring-1 ring-black/5 ${animal.ear_tag_color || 'bg-white'}`}>
                                                <img
                                                    src={animalTypeList === 'sheep' ? sheepIcon : cowIcon}
                                                    className="h-5.5 w-5.5 opacity-80"
                                                    alt={animal.type}
                                                />
                                            </div>
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onViewAnimal(animalId, animalTypeList);
                                                }}
                                                className="font-bold text-[#1a1a2e] border-b border-[#1a1a2e] leading-tight cursor-pointer whitespace-nowrap hover:text-blue-600 hover:border-blue-600"
                                            >
                                                {animal.earTag}
                                            </span>
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
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="sticky bottom-0 z-40 flex items-center justify-between border-t border-gray-100 py-1.5 px-4 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="text-[14px] font-bold text-[#1a1a2e]">
                    {selectedIds.length}/{animals.length} Animal Selected
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onSelectAll}
                        className="rounded-full bg-[#E9EEF6] px-5 py-2 text-[13px] font-bold text-[#1a1a2e] hover:bg-[#D7E3EF] transition-all"
                    >
                        Select all on this page
                    </button>
                    <button
                        onClick={onDeselectAll}
                        className="rounded-full bg-[#E9EEF6] px-5 py-2 text-[13px] font-bold text-[#1a1a2e] hover:bg-[#D7E3EF] transition-all"
                    >
                        Deselect All
                    </button>
                    <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
                    <button
                        disabled={!hasSelection}
                        className={`flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-bold transition-all ${hasSelection ? 'bg-red-50 text-red-600 hover:bg-red-100 shadow-sm' : 'bg-gray-50 text-gray-400 cursor-not-allowed opacity-60'
                            }`}
                    >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                        Delete
                    </button>
                    <button
                        disabled={!hasSelection}
                        className={`flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-bold transition-all ${hasSelection ? 'bg-[#1a1a2e] text-white hover:bg-black shadow-md' : 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100 opacity-60'
                            }`}
                    >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" /></svg>
                        Choose Activity
                    </button>
                </div>
            </div>
        </div>
    );
};
export default function ManageCattleDashboard({ selectedAnimal, onSelectAnimal }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    // Check if we are viewing a specific animal
    const animalMatch = pathname.match(/\/lifecycle\/details\/([^\/]+)/);
    const viewingAnimalId = animalMatch ? animalMatch[1] : null;

    const handleViewAnimal = (id, animalType) => {
        let finalType = animalType;
        if (!finalType) {
            const animal = animals.find(a => (a.id || a._id) === id);
            if (animal) {
                const isCow = (
                    animal.species?.toLowerCase().includes('cow') ||
                    animal.species?.toLowerCase().includes('cattle') ||
                    animal.type?.toLowerCase().includes('cow') ||
                    animal.type?.toLowerCase().includes('bull') ||
                    animal.type?.toLowerCase().includes('calf') ||
                    animal.type?.toLowerCase().includes('heifer') ||
                    animal.type?.toLowerCase().includes('steer')
                );
                finalType = isCow ? 'cow' : 'sheep';
            }
        }
        navigate(`/lifecycle/details/${id}?type=${finalType || 'cow'}`);
    };

    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [animals, setAnimals] = useState([]);
    const [locations, setLocations] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const handleToggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        const paginatedIds = animals
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map(a => a.id || a._id);
        setSelectedIds(prev => [...new Set([...prev, ...paginatedIds])]);
    };

    const handleDeselectAll = () => {
        const paginatedIds = animals
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map(a => a.id || a._id);
        setSelectedIds(prev => prev.filter(id => !paginatedIds.includes(id)));
    };

    useEffect(() => {
        if (selectedAnimal === 'Animal Details' && !hasFetched) {
            setLoading(true);

            // Fetch animals
            const fetchAnimals = fetch('/api/animals').then(res => res.json());
            // Fetch form data for filters
            const fetchFormData = fetch('/api/animals/form-data').then(res => res.json());

            Promise.all([fetchAnimals, fetchFormData])
                .then(([animalData, formData]) => {
                    const mappedData = animalData.map(animal => ({
                        ...animal,
                        earTag: animal.ear_tag,
                        name: animal.animal_name,
                        brandName: animal.type,
                        weight: animal.birth_weight ? `${animal.birth_weight} kg` : "N/A",
                        breed: animal.breed?.name ?? null,
                        location: animal.location?.name ?? null,
                        group: animal.group?.name ?? null,
                    }));
                    setAnimals(mappedData);
                    setLocations(formData.locations || []);
                    setGroups(formData.groups || []);
                    setLoading(false);
                    setHasFetched(true);
                })
                .catch(err => {
                    console.error("Error fetching dashboard data:", err);
                    setLoading(false);
                    setHasFetched(true);
                });
        }
    }, [selectedAnimal, hasFetched]);



    if (loading && selectedAnimal === 'Animal Details') {
        return <Loader message="Loading livestock database..." />;
    }

    const renderDashboard = () => {
        const filteredAnimals = animals.filter(animal => {
            const matchesLocation = !selectedLocation || animal.location_id === selectedLocation;
            const matchesGroup = !selectedGroup || animal.group_id === selectedGroup;
            const matchesSearch = !searchQuery || animal.earTag?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesLocation && matchesGroup && matchesSearch;
        });

        const totalPages = Math.ceil(filteredAnimals.length / itemsPerPage);
        const paginatedAnimals = filteredAnimals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

        return (
            <section className="flex h-full w-full flex-col bg-[#F8FAFD] px-6 pt-6 pb-2 gap-6 overflow-hidden">
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
                    <div className="relative flex-1 min-w-[250px]">
                        <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        <input
                            type="text"
                            placeholder="Search animals by Ear Tag"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-[44px] w-full rounded-lg border border-[#80888F] bg-[#E9EEF6] pl-10 pr-4 text-[13px] text-[#1a1a2e] shadow-sm outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-[#1a1a2e]"
                        />
                    </div>

                    <div className="flex h-[44px] items-center rounded-lg border border-[#80888F] bg-[#E9EEF6] p-1 shadow-sm">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex h-8 w-10 items-center justify-center rounded-md transition-all ${viewMode === 'grid' ? 'bg-[#1a1a2e] text-white shadow-sm' : 'text-gray-500 hover:bg-black/5'}`}
                        >
                            <Grid size={18} strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex h-8 w-10 items-center justify-center rounded-md transition-all ${viewMode === 'list' ? 'bg-[#1a1a2e] text-white shadow-sm' : 'text-gray-500 hover:bg-black/5'}`}
                        >
                            <List size={18} strokeWidth={2.5} />
                        </button>
                    </div>

                    <FilterDropdown
                        placeholder="Select location"
                        value={selectedLocation}
                        options={locations}
                        onChange={setSelectedLocation}
                    />

                    <FilterDropdown
                        placeholder="Select group"
                        value={selectedGroup}
                        options={groups}
                        onChange={setSelectedGroup}
                    />

                    <button className="relative flex h-[44px] w-[44px] items-center justify-center rounded-lg border border-[#80888F] bg-[#E9EEF6] text-gray-500 shadow-sm transition-all hover:bg-[#DDE7F3]">
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1a1a2e] text-[9px] font-bold text-white shadow-md">1</span>
                    </button>
                </div>

                {viewMode === 'grid' ? (
                    <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
                        <div className="flex-1 overflow-y-auto min-h-0 pr-2 pb-4">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {paginatedAnimals.map((animal, idx) => (
                                    <AnimalCard
                                        key={idx}
                                        {...animal}
                                        isSelected={selectedIds.includes(animal.id || animal._id)}
                                        onToggleSelect={handleToggleSelect}
                                        onViewAnimal={handleViewAnimal}
                                    />
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
                        {/* Control Panel for Grid View */}
                        <div className="sticky bottom-0 z-40 flex items-center justify-between border-t border-gray-100 py-1.5 px-4 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] rounded-b-xl mt-4 shrink-0">
                            <div className="text-[14px] font-bold text-[#1a1a2e]">
                                {selectedIds.length}/{animals.length} Animal Selected
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleSelectAll}
                                    className="rounded-full bg-[#E9EEF6] px-5 py-2 text-[13px] font-bold text-[#1a1a2e] hover:bg-[#D7E3EF] transition-all"
                                >
                                    Select all on this page
                                </button>
                                <button
                                    onClick={handleDeselectAll}
                                    className="rounded-full bg-[#E9EEF6] px-5 py-2 text-[13px] font-bold text-[#1a1a2e] hover:bg-[#D7E3EF] transition-all"
                                >
                                    Deselect All
                                </button>
                                <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
                                <button
                                    disabled={selectedIds.length === 0}
                                    className={`flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-bold transition-all ${selectedIds.length > 0 ? 'bg-red-50 text-red-600 hover:bg-red-100 shadow-sm' : 'bg-gray-50 text-gray-400 cursor-not-allowed opacity-60'
                                        }`}
                                >
                                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                    Delete
                                </button>
                                <button
                                    disabled={selectedIds.length === 0}
                                    className={`flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-bold transition-all ${selectedIds.length > 0 ? 'bg-[#1a1a2e] text-white hover:bg-black shadow-md' : 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100 opacity-60'
                                        }`}
                                >
                                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" /></svg>
                                    Choose Activity
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <AnimalList
                        animals={paginatedAnimals}
                        selectedIds={selectedIds}
                        onToggleSelect={handleToggleSelect}
                        onSelectAll={handleSelectAll}
                        onDeselectAll={handleDeselectAll}
                        onViewAnimal={handleViewAnimal}
                    />
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
    if (selectedAnimal === 'Register Animal') {
        return (
            <section className="h-full min-h-0 w-full overflow-auto bg-[#F8FAFD] p-4 sm:p-8">
                <RegisterAnimal />
            </section>
        );
    }

    if (viewingAnimalId) {
        return <AnimalDetail animalId={viewingAnimalId} />;
    }

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
