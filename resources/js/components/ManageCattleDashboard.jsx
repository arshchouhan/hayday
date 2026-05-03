import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, MapPin, Layers, Users, Grid, List } from 'lucide-react';

const DASHBOARD_CACHE = {
    formData: null,
    pages: new Map(),
    uiState: null,
};

/** Call this on login / logout to prevent cross-user data leakage from the module cache. */
export function clearDashboardCache() {
    DASHBOARD_CACHE.formData = null;
    DASHBOARD_CACHE.pages.clear();
    DASHBOARD_CACHE.uiState = null;
}

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



const AnimalList = ({ animals, selectedIds, onToggleSelect, onSelectAll, onDeselectAll, onViewAnimal, onChooseActivity, containerRef }) => {
    const isAllSelected = animals.length > 0 && animals.every(a => selectedIds.includes(a.id || a._id));
    const hasSelection = selectedIds.length > 0;

    return (
        <div className="flex flex-col flex-1 min-h-0 w-full overflow-hidden rounded-2xl border border-[#80888F]/20 bg-white shadow-sm">
            <div ref={containerRef} className="flex-1 overflow-auto min-h-0">
                <table className="w-full text-left border-collapse relative">
                    <thead className="sticky top-0 z-40">
                        <tr className="border-b border-gray-100 bg-[#F8FAFD]">
                            <th className="sticky left-0 z-50 p-4 w-12 bg-[#F8FAFD] border-r border-gray-200">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 accent-[#1a1a2e]"
                                    checked={isAllSelected}
                                    onChange={isAllSelected ? onDeselectAll : onSelectAll}
                                />
                            </th>
                            <th className="sticky left-12 z-50 p-4 text-[13px] font-black text-[#1a1a2e] uppercase tracking-wider bg-[#F8FAFD] border-r border-gray-200">
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
                                <tr key={idx} className={`hover:bg-gray-50 transition-colors group ${isSelected ? 'bg-blue-50' : 'bg-white'}`}>
                                    <td className={`sticky left-0 z-20 p-4 border-r border-gray-200 bg-white ${isSelected ? '!bg-blue-50' : 'bg-white'}`}>
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 accent-[#1a1a2e]"
                                            checked={isSelected}
                                            onChange={() => onToggleSelect(animalId)}
                                        />
                                    </td>
                                    <td className={`sticky left-12 z-20 p-4 border-r border-gray-200 bg-white ${isSelected ? '!bg-blue-50' : 'bg-white'}`}>
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
                        onClick={onChooseActivity}
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
/* ══════════════════════════════════════════════════════════════════
   ACTIVITY SIDEBAR
══════════════════════════════════════════════════════════════════ */
const ACTIVITIES = [
    {
        id: 'health', label: 'Animal Health & Treatment', color: '#059669', bg: '#ECFDF5',
        icon: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M2 12h20" /></svg>,
        sub: ['Record Heat', 'Pregnancy Check', 'Breeding Soundness Exam', 'Observation'],
    },
    {
        id: 'breeding', label: 'Breeding & Reproduction', color: '#7C3AED', bg: '#F5F3FF',
        icon: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
        sub: ['Breeding', 'Calving', 'Pregnancy Check'],
    },
    {
        id: 'movement', label: 'Movement & Localization', color: '#D97706', bg: '#FFFBEB',
        icon: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 8l4 4-4 4M8 12h7" /></svg>,
        sub: ['Group Movement', 'Location Movement'],
    },
    {
        id: 'sales', label: 'Sales & Records', color: '#DC2626', bg: '#FEF2F2',
        icon: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>,
        sub: ['Dead Animal Record', 'Feeding Sale', 'Weight Management'],
    },
];

const SUB_ROUTE = {
    'Record Heat': 'record-heat', 'Pregnancy Check': 'pregnancy-check',
    'Breeding Soundness Exam': 'bse', 'Observation': 'observation',
    'Breeding': 'breeding', 'Calving': 'calving',
    'Group Movement': 'group-movement', 'Location Movement': 'location-movement',
    'Dead Animal Record': 'dead-animal', 'Feeding Sale': 'feeding-sale', 'Weight Management': 'weight-management',
};

const ActivitySidebar = ({ open, onClose, selectedIds, navigate }) => {
    const [expanded, setExpanded] = React.useState(null);

    const handleRoute = (activityId, sub) => {
        const animalId = selectedIds[0];
        if (!animalId) return;
        const subKey = SUB_ROUTE[sub];
        navigate(`/farm/activity/${activityId}/${animalId}/${subKey}`);
        onClose();
    };

    const handleCategoryRoute = (activityId) => {
        const animalId = selectedIds[0];
        if (!animalId) return;
        navigate(`/farm/activity/${activityId}/${animalId}`);
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            {open && <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]" />}

            {/* Sidebar */}
            <div className={`fixed right-0 top-0 z-50 flex h-full w-[360px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'
                }`}>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div>
                        <h2 className="text-[16px] font-black text-[#1a1a2e]">Choose Activity</h2>
                        <p className="text-[12px] text-gray-400 mt-0.5">
                            {selectedIds.length} animal{selectedIds.length !== 1 ? 's' : ''} selected
                        </p>
                    </div>
                    <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-700 transition-all">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Activity list */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                    {ACTIVITIES.map((act) => (
                        <div key={act.id} className="overflow-hidden rounded-xl border border-gray-100">
                            {/* Category header */}
                            <button
                                onClick={() => setExpanded(expanded === act.id ? null : act.id)}
                                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: act.bg, color: act.color }}>
                                    {act.icon}
                                </div>
                                <span className="flex-1 text-[13px] font-bold text-[#1a1a2e]">{act.label}</span>
                                <svg viewBox="0 0 24 24" className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${expanded === act.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
                            </button>

                            {/* Sub-options */}
                            {expanded === act.id && (
                                <div className="border-t border-gray-100 bg-gray-50 px-3 py-2 space-y-0.5">
                                    <button
                                        onClick={() => handleCategoryRoute(act.id)}
                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[12px] font-bold hover:bg-white transition-colors" style={{ color: act.color }}
                                    >
                                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                        Open Selector
                                    </button>
                                    {act.sub.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => handleRoute(act.id, s)}
                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] font-medium text-gray-700 hover:bg-white hover:text-[#1a1a2e] transition-colors"
                                        >
                                            <div className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: act.color }} />
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer note */}
                <div className="border-t border-gray-100 px-5 py-3">
                    <p className="text-[11px] text-gray-400">Activity will be applied to the first selected animal. Bulk support coming soon.</p>
                </div>
            </div>
        </>
    );
};

/* ══════════════════════════════════════════════════════════════════
   ASSIGN WORKER SIDEBAR
══════════════════════════════════════════════════════════════════ */
const ASSIGN_WORKERS_LIST = [
    { id: 1, name: 'Arsh Chauhan', initials: 'AC', email: 'arsh@hayday.com', role: 'Farm Manager' },
    { id: 2, name: 'John Doe', initials: 'JD', email: 'john@hayday.com', role: 'General Worker' },
    { id: 3, name: 'Jane Smith', initials: 'JS', email: 'jane@hayday.com', role: 'Veterinarian' }
];

const AssignWorkerSidebar = ({ open, onClose, selectedIds, navigate }) => {
    return (
        <>
            {/* Backdrop */}
            {open && <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]" />}

            {/* Sidebar */}
            <div className={`fixed right-0 top-0 z-50 flex h-full w-[360px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div>
                        <h2 className="text-[16px] font-black text-[#1a1a2e]">Assign Worker</h2>
                        <p className="text-[12px] text-gray-400 mt-0.5">
                            {selectedIds.length} animal{selectedIds.length !== 1 ? 's' : ''} selected
                        </p>
                    </div>
                    <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-700 transition-all">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                    {ASSIGN_WORKERS_LIST.map((worker) => (
                        <div key={worker.id} className="overflow-hidden rounded-xl border border-gray-100 hover:border-[#059669] hover:shadow-sm transition-all cursor-pointer bg-white group"
                            onClick={() => navigate(`/farm/workers/add?workerId=${worker.id}&name=${encodeURIComponent(worker.name)}&email=${encodeURIComponent(worker.email)}&animals=${selectedIds.join(',')}`)}
                        >
                            <div className="flex items-center gap-3 px-4 py-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E9EEF6] text-[14px] font-bold text-[#1a1a2e] group-hover:bg-[#059669] group-hover:text-white transition-colors">
                                    {worker.initials}
                                </div>
                                <div>
                                    <h3 className="text-[14px] font-bold text-[#1a1a2e]">{worker.name}</h3>
                                    <p className="text-[12px] text-gray-500">{worker.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={() => navigate('/farm/workers/add')}
                        className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#80888F] px-4 py-3 text-[13px] font-bold text-[#1a1a2e] hover:bg-gray-50 transition-colors"
                    >
                        + Add New Worker
                    </button>
                </div>
            </div>
        </>
    );
};

/* ══════════════════════════════════════════════════════════════════
   FILTER / ACTIONS DROPUP
══════════════════════════════════════════════════════════════════ */
const FilterActionsDropup = ({ selectedCount, onManage, onAssignWorker }) => {
    const hasSelection = selectedCount > 0;
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef(null);
    const navigate = useNavigate();

    React.useEffect(() => {
        const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(o => !o)}
                className={`relative flex h-[44px] w-[44px] items-center justify-center rounded-lg border shadow-sm transition-all ${hasSelection
                        ? 'border-[#1a1a2e] bg-[#1a1a2e] text-white hover:bg-black'
                        : 'border-[#80888F] bg-[#E9EEF6] text-gray-500 hover:bg-[#DDE7F3]'
                    }`}
            >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" x2="20" y1="21" y2="21" />
                    <line x1="4" x2="20" y1="14" y2="14" />
                    <line x1="4" x2="20" y1="7" y2="7" />
                    <circle cx="10" cy="21" r="2" />
                    <circle cx="16" cy="14" r="2" />
                    <circle cx="8" cy="7" r="2" />
                </svg>
            </button>

            {open && hasSelection && (
                <div className="absolute bottom-[52px] right-0 z-50 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xl animate-in fade-in zoom-in duration-150">
                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100">
                        Actions
                    </div>
                    <button
                        onClick={(e) => {
                            if (selectedCount > 1) {
                                e.preventDefault();
                                return;
                            }
                            setOpen(false);
                            if (onManage) onManage();
                        }}
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-[13px] font-semibold transition-colors ${selectedCount > 1
                                ? 'text-gray-400 cursor-not-allowed bg-gray-50/50'
                                : 'text-[#1a1a2e] hover:bg-gray-50'
                            }`}
                        title={selectedCount > 1 ? "Only one animal can be edited at a time" : ""}
                    >
                        <svg viewBox="0 0 24 24" className={`h-4 w-4 ${selectedCount > 1 ? 'text-gray-400' : 'text-[#1a1a2e]'}`} fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                        <div className="flex flex-col items-start leading-tight">
                            <span>Edit</span>
                            {selectedCount > 1 && <span className="text-[9px] font-bold text-red-500 mt-0.5">1 at a time</span>}
                        </div>
                    </button>
                    <button
                        onClick={() => { setOpen(false); if (onAssignWorker) onAssignWorker(); }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-[#1a1a2e] hover:bg-gray-50 transition-colors"
                    >
                        <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#1a1a2e]" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        Assign Worker
                    </button>
                </div>
            )}

            {open && !hasSelection && (
                <div className="absolute bottom-[52px] right-0 z-50 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-2xl animate-in fade-in zoom-in duration-150">
                    <p className="text-[13px] font-semibold text-center text-gray-500 leading-relaxed">
                        Please choose an animal to manage.
                    </p>
                </div>
            )}
        </div>
    );
};

export default function ManageCattleDashboard({ selectedAnimal, onSelectAnimal }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    // Check if we are viewing a specific animal
    const animalMatch = pathname.match(/\/(?:lifecycle|farm)\/details\/([^\/]+)/);
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
        const root = pathname.startsWith('/farm') ? '/farm' : '/lifecycle';
        navigate(`${root}/details/${id}?type=${finalType || 'cow'}`);
    };

    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [rawAnimals, setRawAnimals] = useState([]);
    const [listData, setListData] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [locations, setLocations] = useState([]);
    const [groups, setGroups] = useState([]);
    const [totalAnimals, setTotalAnimals] = useState(0);
    const [totalLocations, setTotalLocations] = useState(0);
    const [totalGroups, setTotalGroups] = useState(0);
    const [selectedLocation, setSelectedLocation] = useState(() => DASHBOARD_CACHE.uiState?.selectedLocation || '');
    const [selectedGroup, setSelectedGroup] = useState(() => DASHBOARD_CACHE.uiState?.selectedGroup || '');
    const [searchQuery, setSearchQuery] = useState(() => DASHBOARD_CACHE.uiState?.searchQuery || '');
    const [searchText, setSearchText] = useState(() => DASHBOARD_CACHE.uiState?.searchQuery || '');
    const searchDebounceRef = useRef(null);
    const [backspaceActive, setBackspaceActive] = useState(false);
    const backspaceReleaseRef = useRef(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const hasCachedData = Boolean(DASHBOARD_CACHE.pages.size || DASHBOARD_CACHE.formData);
    const [isLoading, setIsLoading] = useState(false);
    
    // We are effectively loading if the state says so OR if we just switched to this tab and have no cache
    const loading = isLoading || (selectedAnimal === 'Animal Details' && !hasCachedData && !viewingAnimalId);

    const [formDataLoaded, setFormDataLoaded] = useState(() => Boolean(DASHBOARD_CACHE.formData));
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [assignWorkerSidebarOpen, setAssignWorkerSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(() => DASHBOARD_CACHE.uiState?.currentPage || 1);
    const itemsPerPage = 12;
    const [listPage, setListPage] = useState(1); // number of pages loaded in list mode
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const listContainerRef = useRef(null);

    const animals = useMemo(() => {
        const breedLookup = new Map(breeds.map(item => [String(item.id || item._id), item.name]));
        const locationLookup = new Map(locations.map(item => [String(item.id || item._id), item.name]));
        const groupLookup = new Map(groups.map(item => [String(item.id || item._id), item.name]));

        const source = viewMode === 'list' ? listData : rawAnimals;

        return source.map(animal => {
            const animalId = animal.id || animal._id;
            return {
                ...animal,
                id: animalId,
                _id: animal._id || animal.id,
                earTag: animal.ear_tag,
                name: animal.animal_name,
                brandName: animal.type,
                weight: animal.birth_weight ? `${animal.birth_weight} kg` : 'N/A',
                breed: breedLookup.get(String(animal.breed_id || animal.breed?.id || animal.breed?._id)) || animal.breed?.name || null,
                location: locationLookup.get(String(animal.location_id || animal.location?.id || animal.location?._id)) || animal.location?.name || null,
                group: groupLookup.get(String(animal.group_id || animal.group?.id || animal.group?._id)) || animal.group?.name || null,
            };
        });
    }, [rawAnimals, listData, viewMode, breeds, locations, groups]);

    const handleToggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        const pageIndex = viewMode === 'grid' ? currentPage : listPage;
        const paginatedIds = animals
            .slice((pageIndex - 1) * itemsPerPage, pageIndex * itemsPerPage)
            .map(a => a.id || a._id);
        setSelectedIds(prev => [...new Set([...prev, ...paginatedIds])]);
    };

    const handleDeselectAll = () => {
        const pageIndex = viewMode === 'grid' ? currentPage : listPage;
        const paginatedIds = animals
            .slice((pageIndex - 1) * itemsPerPage, pageIndex * itemsPerPage)
            .map(a => a.id || a._id);
        setSelectedIds(prev => prev.filter(id => !paginatedIds.includes(id)));
    };

    useEffect(() => {
        if (selectedAnimal !== 'Animal Details' || formDataLoaded) {
            return;
        }

        if (DASHBOARD_CACHE.formData) {
            setBreeds(DASHBOARD_CACHE.formData.breeds || []);
            setLocations(DASHBOARD_CACHE.formData.locations || []);
            setGroups(DASHBOARD_CACHE.formData.groups || []);
            setFormDataLoaded(true);
            return;
        }

        fetch('/api/farm/animals/form-data')
            .then(res => {
                if (!res.ok) throw new Error('API failure');
                return res.json();
            })
            .then(formData => {
                DASHBOARD_CACHE.formData = formData;
                setBreeds(formData.breeds || []);
                setLocations(formData.locations || []);
                setGroups(formData.groups || []);
                setFormDataLoaded(true);
            })
            .catch(err => {
                console.error('Error fetching dashboard filters:', err);
                setFormDataLoaded(true);
            });
    }, [selectedAnimal, formDataLoaded]);

    // Debounce search input to avoid re-rendering/fetching on every keystroke
    useEffect(() => {
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = setTimeout(() => {
            if (!backspaceActive) {
                setSearchQuery(searchText);
                setCurrentPage(1);
            }
            // if backspace is active, commit will be done on release
        }, 350);
        return () => clearTimeout(searchDebounceRef.current);
    }, [searchText, backspaceActive]);

    // When backspace is released, commit the latest search after a short delay
    useEffect(() => {
        if (!backspaceActive) {
            if (backspaceReleaseRef.current) clearTimeout(backspaceReleaseRef.current);
            backspaceReleaseRef.current = setTimeout(() => {
                setSearchQuery(searchText);
                setCurrentPage(1);
            }, 250);
            return () => clearTimeout(backspaceReleaseRef.current);
        }
        return undefined;
    }, [backspaceActive]);

    // Grid-mode page fetch
    useEffect(() => {
        if (selectedAnimal !== 'Animal Details' || viewMode !== 'grid') {
            return;
        }

        const params = new URLSearchParams({
            page: String(currentPage),
            per_page: String(itemsPerPage),
        });

        const searchTerm = searchQuery.trim();
        if (searchTerm && searchTerm.length >= 2) params.set('search', searchTerm);
        if (selectedLocation) params.set('location_id', selectedLocation);
        if (selectedGroup) params.set('group_id', selectedGroup);

        const cacheKey = params.toString();
        const cachedPage = DASHBOARD_CACHE.pages.get(cacheKey);

        if (cachedPage) {
            setRawAnimals(cachedPage.data || []);
            setTotalAnimals(cachedPage.meta?.total || 0);
            setTotalLocations(cachedPage.meta?.location_count || 0);
            setTotalGroups(cachedPage.meta?.group_count || 0);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        fetch(`/api/farm/animals/paginated?${cacheKey}`)
            .then(res => {
                if (!res.ok) throw new Error('API failure');
                return res.json();
            })
            .then(response => {
                DASHBOARD_CACHE.pages.set(cacheKey, response);
                setRawAnimals(response.data || []);
                setTotalAnimals(response.meta?.total || 0);
                setTotalLocations(response.meta?.location_count || 0);
                setTotalGroups(response.meta?.group_count || 0);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Error fetching dashboard data:', err);
                setIsLoading(false);
            });
    }, [selectedAnimal, currentPage, searchQuery, selectedLocation, selectedGroup, viewMode]);

    // List-mode incremental fetch (lazy loading)
    const fetchListPage = async (page, append = true) => {
        const params = new URLSearchParams({
            page: String(page),
            per_page: String(itemsPerPage),
        });
        const searchTerm = searchQuery.trim();
        if (searchTerm && searchTerm.length >= 2) params.set('search', searchTerm);
        if (selectedLocation) params.set('location_id', selectedLocation);
        if (selectedGroup) params.set('group_id', selectedGroup);

        const cacheKey = params.toString();
        const cached = DASHBOARD_CACHE.pages.get(cacheKey);
        try {
            setIsLoadingMore(true);
            let response;
            if (cached) {
                response = cached;
            } else {
                const res = await fetch(`/api/farm/animals/paginated?${cacheKey}`);
                if (!res.ok) throw new Error('API failure');
                response = await res.json();
                DASHBOARD_CACHE.pages.set(cacheKey, response);
            }

            setTotalAnimals(response.meta?.total || 0);
            setTotalLocations(response.meta?.location_count || 0);
            setTotalGroups(response.meta?.group_count || 0);

            const pageData = response.data || [];
            setListData(prev => append ? [...prev, ...pageData] : pageData);
            setHasMore((prevList) => {
                const loadedSoFar = (append ? (listData.length + pageData.length) : pageData.length);
                return loadedSoFar < (response.meta?.total || 0) && pageData.length === itemsPerPage;
            });
            setListPage(page);
        } catch (err) {
            console.error('Error fetching list page:', err);
        } finally {
            setIsLoadingMore(false);
        }
    };

    useEffect(() => {
        if (selectedAnimal !== 'Animal Details' || viewMode !== 'list') return;

        // Reset list when filters/search change
        setListData([]);
        setListPage(1);
        setHasMore(true);
        fetchListPage(1, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAnimal, searchQuery, selectedLocation, selectedGroup, viewMode]);

    // Scroll listener to load more when near bottom
    useEffect(() => {
        if (viewMode !== 'list') return;
        const el = listContainerRef.current;
        if (!el) return;

        const onScroll = () => {
            if (isLoadingMore || !hasMore) return;
            const threshold = 240;
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - threshold) {
                fetchListPage(listPage + 1, true);
            }
        };

        el.addEventListener('scroll', onScroll);
        return () => el.removeEventListener('scroll', onScroll);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewMode, listContainerRef.current, isLoadingMore, hasMore, listPage]);

    useEffect(() => {
        DASHBOARD_CACHE.uiState = {
            currentPage,
            searchQuery,
            selectedLocation,
            selectedGroup,
        };
    }, [currentPage, searchQuery, selectedLocation, selectedGroup]);



    if (loading && selectedAnimal === 'Animal Details') {
        return (
            <section className="flex h-full w-full flex-col bg-[#F8FAFD] px-6 pt-6 pb-2 gap-6 overflow-hidden">
                {/* Stat card skeletons */}
                <div className="flex gap-4 shrink-0">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-[125px] w-[125px] shrink-0 rounded-xl border border-gray-200 bg-white animate-pulse" />
                    ))}
                </div>
                {/* Search bar skeleton */}
                <div className="flex gap-3 shrink-0">
                    <div className="h-[44px] flex-1 rounded-lg bg-gray-200 animate-pulse" />
                    <div className="h-[44px] w-[88px] rounded-lg bg-gray-200 animate-pulse" />
                    <div className="h-[44px] w-[160px] rounded-lg bg-gray-200 animate-pulse" />
                    <div className="h-[44px] w-[160px] rounded-lg bg-gray-200 animate-pulse" />
                </div>
                {/* Card skeletons */}
                <div className="grid grid-cols-4 gap-6 overflow-hidden">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                                <div className="h-5 w-24 rounded bg-gray-200 animate-pulse" />
                            </div>
                            <div className="flex gap-2">
                                <div className="h-6 w-16 rounded-full bg-gray-100 animate-pulse" />
                                <div className="h-6 w-20 rounded-full bg-gray-100 animate-pulse" />
                            </div>
                            <div className="h-4 w-28 rounded bg-gray-100 animate-pulse" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    const renderDashboard = () => {
        /* eslint-disable no-use-before-define */
        const totalPages = Math.max(1, Math.ceil(totalAnimals / itemsPerPage));

        return (
            <>
                <section className="flex h-full w-full flex-col bg-[#F8FAFD] px-6 pt-6 pb-2 gap-6 overflow-hidden">
                    <div className="flex items-start justify-between gap-4 shrink-0">
                        <div className="flex flex-wrap items-start gap-4">
                            <StatCard
                                label="Total Animals"
                                count={totalAnimals.toString()}
                                icon={<img src={animalIcon} className="h-24 w-24 opacity-[0.07] grayscale brightness-0" alt="icon" />}
                            />
                            <StatCard
                                label="Total Locations"
                                count={totalLocations.toString()}
                                icon={<img src={locationIcon} className="h-24 w-24 opacity-[0.07] grayscale brightness-0" alt="icon" />}
                            />
                            <StatCard
                                label="Total Groups"
                                count={totalGroups.toString()}
                                icon={<img src={groupIcon} className="h-24 w-24 opacity-[0.07] grayscale brightness-0" alt="icon" />}
                            />
                            <StatCard
                                label="Total Workers"
                                count="12"
                                icon={<img src={farmerIcon} className="h-24 w-24 opacity-[0.07] grayscale brightness-0" alt="icon" />}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => { if (onSelectAnimal) onSelectAnimal('Register Animal'); }}
                                className="hidden h-10 items-center justify-center rounded-lg bg-[#1a1a2e] px-4 py-2 text-[13px] font-bold text-white shadow-sm transition-all hover:bg-black sm:flex"
                            >
                                + Register Animal
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <div className="relative flex-1 min-w-[250px]">
                            <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                            <input
                                type="text"
                                placeholder="Search animals by Ear Tag"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Backspace') setBackspaceActive(true); }}
                                onKeyUp={(e) => { if (e.key === 'Backspace') setBackspaceActive(false); }}
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

                        {!formDataLoaded ? (
                            <>
                                <div className="h-[44px] min-w-[160px] rounded-lg bg-gray-200 animate-pulse" />
                                <div className="h-[44px] min-w-[160px] rounded-lg bg-gray-200 animate-pulse" />
                            </>
                        ) : (
                            <>
                                {locations && locations.length > 0 ? (
                                    <FilterDropdown
                                        placeholder="Select location"
                                        value={selectedLocation}
                                        options={locations}
                                        onChange={(value) => {
                                            setSelectedLocation(value);
                                            setCurrentPage(1);
                                        }}
                                    />
                                ) : (
                                    <div className="flex h-[44px] min-w-[160px] items-center justify-center rounded-lg border border-[#80888F]/30 bg-white px-4 text-[13px] font-bold text-gray-400">
                                        Unable to load locations
                                    </div>
                                )}

                                {groups && groups.length > 0 ? (
                                    <FilterDropdown
                                        placeholder="Select group"
                                        value={selectedGroup}
                                        options={groups}
                                        onChange={(value) => {
                                            setSelectedGroup(value);
                                            setCurrentPage(1);
                                        }}
                                    />
                                ) : (
                                    <div className="flex h-[44px] min-w-[160px] items-center justify-center rounded-lg border border-[#80888F]/30 bg-white px-4 text-[13px] font-bold text-gray-400">
                                        Unable to load groups
                                    </div>
                                )}
                            </>
                        )}

                        <FilterActionsDropup
                            selectedCount={selectedIds.length}
                            onManage={() => navigate(`/farm/details/${selectedIds[0]}/edit`)}
                            onAssignWorker={() => setAssignWorkerSidebarOpen(true)}
                        />

                    </div>

                    {viewMode === 'grid' ? (
                        <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
                            <div className="flex-1 overflow-y-auto min-h-0 pr-2 pb-4">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                    {animals.map((animal, idx) => (
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
                                        Showing <span className="font-bold text-[#1a1a2e]">{totalAnimals === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-[#1a1a2e]">{Math.min(currentPage * itemsPerPage, totalAnimals)}</span> of <span className="font-bold text-[#1a1a2e]">{totalAnimals}</span> animals
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
                                    {selectedIds.length}/{totalAnimals} Animal Selected
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
                                        onClick={() => setSidebarOpen(true)}
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
                            containerRef={listContainerRef}
                            animals={animals}
                            selectedIds={selectedIds}
                            onToggleSelect={handleToggleSelect}
                            onSelectAll={handleSelectAll}
                            onDeselectAll={handleDeselectAll}
                            onViewAnimal={handleViewAnimal}
                            onChooseActivity={() => setSidebarOpen(true)}
                        />
                    )}
                </section>

                <ActivitySidebar
                    open={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    selectedIds={selectedIds}
                    navigate={navigate}
                />
                <AssignWorkerSidebar
                    open={assignWorkerSidebarOpen}
                    onClose={() => setAssignWorkerSidebarOpen(false)}
                    selectedIds={selectedIds}
                    navigate={navigate}
                />
            </>
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
                <RegisterAnimal onSelectAnimal={onSelectAnimal} />
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
            case 'Activity':
                return { title: 'Activity', description: 'Manage and schedule your farm activities.' };
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
