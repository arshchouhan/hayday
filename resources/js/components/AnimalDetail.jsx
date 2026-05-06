import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
    ChevronLeft,
    Calendar,
    Weight,
    Tag,
    Hash,
    MapPin,
    Users,
    Activity,
    Info,
    Dna,
    Clock,
    Heart,
    ArrowLeft,
    Edit2,
    Trash2
} from 'lucide-react';
import cowIcon from '../assets/noun-cow-8349503.svg';
import sheepIcon from '../assets/noun-sheep-8349507.svg';
import PedigreeTree from './PedigreeTree';
import Timeline from '../pages/Timeline';
import Pedigree from '../pages/Pedigree';
import AI from '../pages/AI';
import MovementHistoryChart from './MovementHistoryChart';
import WeightChart from './WeightChart';

const ANIMAL_DETAIL_CACHE = new Map();

const FloatingLabel = ({ label }) => (
    <label className="absolute -top-3 left-3 bg-[#F8FAFD] px-1 text-[13px] font-bold text-[#1a1a2e] z-10">
        {label}
    </label>
);

const DisplayField = ({ label, value, icon }) => (
    <div className="relative w-full">
        <FloatingLabel label={label} />
        <div className="flex h-[48px] items-center rounded-lg border bg-[#E9EEF6] px-4 border-[#80888F] shadow-sm">
            <span className="w-full text-[15px] font-medium text-[#1a1a2e]">
                {value || 'N/A'}
            </span>
            {icon && <div className="ml-2 text-gray-500">{icon}</div>}
        </div>
    </div>
);

const PillDisplay = ({ label, value, options }) => (
    <div className="space-y-4">
        <label className="text-[17px] font-bold text-[#1a1a2e]">
            {label}
        </label>
        <div className="flex flex-wrap gap-2">
            {options.map((opt) => (
                <span
                    key={opt}
                    className={`rounded-full border px-8 py-2.5 text-[15px] font-bold transition-all ${value?.toLowerCase() === opt.toLowerCase()
                            ? 'border-transparent bg-[#D7E3EF] text-[#1a1a2e] shadow-sm'
                            : 'border-[#80888F] bg-white text-gray-400'
                        }`}
                >
                    {opt}
                </span>
            ))}
        </div>
    </div>
);

const ColorSwatch = ({ color, isActive }) => (
    <div
        className={`relative flex h-7 w-7 items-center justify-center rounded-full border border-black/5 ${color}`}
        style={{ backgroundColor: color.startsWith('#') ? color : undefined }}
    >
        {isActive && (
            <svg viewBox="0 0 24 24" className={`h-4 w-4 ${color === 'bg-white' ? 'text-gray-600' : 'text-white'}`} fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20 6 9 17l-5-5" />
            </svg>
        )}
    </div>
);

const DateIcon = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M8 2v4M16 2v4M3 10h18" />
    </svg>
);

export default function AnimalDetail({ animalId: propAnimalId }) {
    const { id: paramAnimalId } = useParams();
    const animalId = propAnimalId || paramAnimalId;
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [searchParams] = useSearchParams();
    const urlType = searchParams.get('type');
    const [animal, setAnimal] = useState(null);
    const [summary, setSummary] = useState(null);
    const [moveData, setMoveData] = useState({ history: [], movements: [], groupMovements: [], total: 0, current_location: null });
    const [weightData, setWeightData] = useState([]);
    const [costData, setCostData] = useState({ total: 0, average: 150, breakdown: [] });
    
    const [movePeriod, setMovePeriod] = useState('3m');
    const [weightPeriod, setWeightPeriod] = useState('3m');
    const [costPeriod, setCostPeriod] = useState('3m');

    const [loading, setLoading] = useState(true);
    const [moveLoading, setMoveLoading] = useState(false);
    const [weightLoading, setWeightLoading] = useState(false);
    const [costLoading, setCostLoading] = useState(false);
    
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('details');
    const [showCostDetail, setShowCostDetail] = useState(null); // null | 'breakdown' | 'average'
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [messageModal, setMessageModal] = useState({ open: false, title: '', message: '', type: 'error' });

    const fetchSecondaryData = (id) => {
        // Fetch all secondary data in parallel
        setMoveLoading(true);
        setWeightLoading(true);
        setCostLoading(true);

        // Activity summary
        fetch(`/api/farm/animals/${id}/activity-summary`)
            .then(r => r.json())
            .then(res => {
                if (res.success) {
                    setSummary(res.data);
                    const existingCache = ANIMAL_DETAIL_CACHE.get(id) || {};
                    ANIMAL_DETAIL_CACHE.set(id, { ...existingCache, summary: res.data });
                }
            })
            .catch(console.error);

        // Movement history
        fetch(`/api/farm/animals/${id}/movement-history?period=${movePeriod}`)
            .then(r => r.json())
            .then(res => {
                if (res.success) {
                    setMoveData({
                        history: res.data,
                        movements: res.movements || [],
                        groupMovements: res.group_movements || [],
                        total: res.total,
                        current_location: res.current_location
                    });
                }
                setMoveLoading(false);
            })
            .catch(() => setMoveLoading(false));

        // Weight history
        fetch(`/api/farm/animals/${id}/weight-history?period=${weightPeriod}`)
            .then(r => r.json())
            .then(res => {
                if (res.success) setWeightData(res.data);
                setWeightLoading(false);
            })
            .catch(() => setWeightLoading(false));

        // Cost stats
        fetch(`/api/farm/animals/${id}/cost-stats?period=${costPeriod}`)
            .then(r => r.json())
            .then(res => {
                if (res.success) setCostData({ total: res.total, average: res.average, breakdown: res.breakdown || [] });
                setCostLoading(false);
            })
            .catch(() => setCostLoading(false));
    };

    const handleEdit = () => {
        const root = pathname.startsWith('/farm') ? '/farm' : '/lifecycle';
        navigate(`${root}/register?edit=${animalId}`);
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`/api/farm/animals/${animalId}`);

            if (response.data.success) {
                setDeleteModalOpen(false);
                const root = pathname.startsWith('/farm') ? '/farm' : '/lifecycle';
                navigate(`${root}/details`);
            }
        } catch (error) {
            console.error('Error deleting animal:', error);
            setMessageModal({
                open: true,
                title: 'Operation Failed',
                message: 'Failed to delete animal. Please try again.',
                type: 'error'
            });
        }
    };

    const fetchAnimalData = (force = false) => {
        if (!animalId) return;

        if (!force) {
            const cached = ANIMAL_DETAIL_CACHE.get(animalId);
            if (cached) {
                setAnimal(cached.animal);
                setSummary(cached.summary);
                setLoading(false);
                fetchSecondaryData(animalId);
                return;
            }
        }

        setLoading(true);
        fetch(`/api/farm/animals/${animalId}`)
            .then(r => r.json())
            .then(animalRes => {
                setAnimal(animalRes);
                
                // Cache the main animal data immediately
                const existingCache = ANIMAL_DETAIL_CACHE.get(animalId) || {};
                ANIMAL_DETAIL_CACHE.set(animalId, { ...existingCache, animal: animalRes });
                
                setLoading(false);
                fetchSecondaryData(animalId);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    // Fetch Animal Details & Basic Summary (Once)
    useEffect(() => {
        fetchAnimalData();
    }, [animalId]);

    // Re-fetch only when periods change (not animalId)
    useEffect(() => {
        if (!animalId || loading) return;
        fetchSecondaryData(animalId);
    }, [movePeriod, weightPeriod, costPeriod]);


    if (loading) {
        return (
            <section className="h-full min-h-0 w-full overflow-auto bg-[#F8FAFD] p-4 sm:p-8">
                <div className="w-full max-w-6xl mx-auto space-y-8">
                    {/* Header skeleton */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
                            <div className="h-12 w-12 rounded-xl bg-gray-200 animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-6 w-40 rounded bg-gray-200 animate-pulse" />
                                <div className="h-4 w-56 rounded bg-gray-100 animate-pulse" />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="h-10 w-24 rounded-full bg-gray-200 animate-pulse" />
                            <div className="h-10 w-28 rounded-full bg-gray-200 animate-pulse" />
                        </div>
                    </div>

                    {/* Tab skeleton */}
                    <div className="flex gap-8 border-b border-gray-200 pb-3">
                        <div className="h-5 w-24 rounded animate-pulse bg-gray-200" />
                        <div className="h-5 w-20 rounded animate-pulse bg-gray-200" />
                        <div className="h-5 w-28 rounded animate-pulse bg-gray-200" />
                        <div className="h-5 w-24 rounded animate-pulse bg-gray-200" />
                    </div>

                    {/* Content grid skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left column */}
                        <div className="space-y-6">
                            {/* Section 1 */}
                            <div className="space-y-4">
                                <div className="h-6 w-48 rounded bg-gray-200 animate-pulse" />
                                <div className="grid grid-cols-2 gap-4">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="h-16 rounded-lg bg-gray-100 animate-pulse" />
                                    ))}
                                </div>
                            </div>

                            {/* Section 2 */}
                            <div className="space-y-4">
                                <div className="h-6 w-56 rounded bg-gray-200 animate-pulse" />
                                <div className="grid grid-cols-2 gap-4">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="h-16 rounded-lg bg-gray-100 animate-pulse" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right column */}
                        <div className="space-y-6">
                            {/* Section 3 */}
                            <div className="space-y-4">
                                <div className="h-6 w-52 rounded bg-gray-200 animate-pulse" />
                                <div className="grid grid-cols-2 gap-4">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="h-16 rounded-lg bg-gray-100 animate-pulse" />
                                    ))}
                                </div>
                            </div>

                            {/* Section 4 */}
                            <div className="space-y-4">
                                <div className="h-6 w-44 rounded bg-gray-200 animate-pulse" />
                                <div className="grid grid-cols-2 gap-4">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="h-16 rounded-lg bg-gray-100 animate-pulse" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom section skeleton */}
                    <div className="space-y-4 pt-8 border-t border-gray-200">
                        <div className="h-6 w-40 rounded bg-gray-200 animate-pulse" />
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-24 rounded-lg bg-gray-100 animate-pulse" />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error || !animal) {
        return (
            <div className="flex h-full flex-col items-center justify-center bg-[#F8FAFD] p-8 text-center">
                <div className="mb-6 rounded-full bg-red-50 p-6 text-red-500">
                    <Info size={48} />
                </div>
                <h2 className="text-2xl font-black text-[#1a1a2e]">{error || 'Animal not found'}</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-6 flex items-center gap-2 rounded-full bg-[#1a1a2e] px-8 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                    <ArrowLeft size={18} />
                    Go Back
                </button>
            </div>
        );
    }

    const breedStr = typeof animal.breed === 'string' ? animal.breed : animal.breed?.name || '';
    const isCowLocal = (
        animal.species?.toLowerCase().includes('cow') ||
        animal.species?.toLowerCase().includes('cattle') ||
        animal.type?.toLowerCase().includes('cow') ||
        animal.type?.toLowerCase().includes('bull') ||
        animal.type?.toLowerCase().includes('calf') ||
        animal.type?.toLowerCase().includes('heifer') ||
        animal.type?.toLowerCase().includes('steer')
    );
    const isSheep = urlType === 'sheep' || !isCowLocal;

    if (isSheep) {
        return (
            <div className="flex h-full flex-col items-center justify-center bg-[#F8FAFD] p-8 text-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#E9EEF6] shadow-sm">
                    <img src={sheepIcon} alt="Sheep" className="h-12 w-12 opacity-80" />
                </div>
                <h2 className="text-2xl font-black text-[#1a1a2e]">Come back later</h2>
                <p className="mt-2 text-[15px] font-medium text-gray-500">Nothing for sheeps now.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-8 flex items-center gap-2 rounded-full bg-[#1a1a2e] px-8 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                    <ArrowLeft size={18} />
                    Go Back
                </button>
            </div>
        );
    }

    const typeLabel = animal.type?.replace('_', ' ') || 'N/A';
    const tagColorClass = animal.ear_tag_color || 'bg-blue-500';
    const tagIconClass = ['bg-white', 'bg-yellow-400', 'bg-gray-100', 'bg-gray-200', 'bg-slate-100', 'bg-stone-100', 'bg-zinc-100'].includes(tagColorClass)
        ? 'brightness-0 opacity-80'
        : 'brightness-0 invert opacity-90';
    const displayName = animal.animal_name || animal.cattle_name || animal.name || 'Unnamed Animal';

    const statusOptions = ['Active', 'Dead', 'Sold', 'Reference'];
    const cattleTypes = ['Bull', 'Cow', 'Calf', 'Replacement Heifer', 'Steer'];
    const sheepTypes = ['Ram', 'Ewe', 'Lamb', 'Wether'];
    const typeOptions = isSheep ? sheepTypes : cattleTypes;
    const ownershipOptions = ['Purchased', 'Raised'];
    const conceptionOptions = ['Natural', 'AI', 'IVF'];

    const colors = [
        'bg-white', 'bg-black', 'bg-blue-600', 'bg-green-600', 'bg-red-800',
        'bg-pink-300', 'bg-purple-700', 'bg-red-500', 'bg-yellow-400', 'bg-orange-500'
    ];

    return (
        <section className="h-full min-h-0 w-full overflow-auto bg-[#F8FAFD] p-4 sm:p-8">
            <div className="relative w-full space-y-8 pb-4">

                {/* Header & Navigation */}
                <div className="space-y-6">
                    {/* Top Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D7E3EF] pb-6">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate(-1)}
                                className="group flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-all hover:border-[#1a1a2e] hover:text-[#1a1a2e]"
                            >
                                <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
                            </button>
                            <div className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-sm ring-2 ring-white ${tagColorClass}`}>
                                <img src={isSheep ? sheepIcon : cowIcon} className={`h-5 w-5 ${tagIconClass}`} alt="animal type" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl font-black text-[#1a1a2e] tracking-tight">{animal.ear_tag}</h1>
                                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${animal.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {animal.status}
                                    </span>
                                </div>
                                <p className="text-[13px] font-medium text-gray-500">{displayName} • {animal.type || animal.species || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={handleEdit}
                                className="rounded-full border border-[#80888F]/40 bg-white px-7 py-2 text-sm font-bold text-[#1a1a2e] transition-all hover:bg-gray-50 active:scale-95"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => setDeleteModalOpen(true)}
                                className="rounded-full bg-[#ef4444] px-8 py-2 text-sm font-bold text-white shadow-lg shadow-red-200 transition-all hover:bg-red-600 active:scale-95"
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex items-center gap-1 w-max mb-6">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`text-[14px] font-bold py-2 px-6 rounded-lg transition-all ${activeTab === 'details'
                                    ? 'bg-[#DCE9E3] text-[#1a1a2e] shadow-sm'
                                    : 'text-gray-500 hover:text-[#1a1a2e]'
                                }`}
                        >
                            Cattle Details
                        </button>
                        <button
                            onClick={() => setActiveTab('timeline')}
                            className={`text-[14px] font-bold py-2 px-6 rounded-lg transition-all ${activeTab === 'timeline'
                                    ? 'bg-[#DCE9E3] text-[#1a1a2e] shadow-sm'
                                    : 'text-gray-500 hover:text-[#1a1a2e]'
                                }`}
                        >
                            Timeline
                        </button>
                        <button
                            onClick={() => setActiveTab('pedigree')}
                            className={`text-[14px] font-bold py-2 px-6 rounded-lg transition-all ${activeTab === 'pedigree'
                                    ? 'bg-[#DCE9E3] text-[#1a1a2e] shadow-sm'
                                    : 'text-gray-500 hover:text-[#1a1a2e]'
                                }`}
                        >
                            View Pedigree
                        </button>
                    </div>
                </div>

                {activeTab === 'details' && (
                    <>
                        {/* Activity Summary */}
                        <div className="space-y-3">
                            <h2 className="text-[17px] font-bold text-[#1a1a2e]">Activity Summary</h2>
                            <div className="rounded-lg border border-[#80888F] bg-white overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-2 border-b border-[#DCE9E3] bg-[#DCE9E3]/40">
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Metric</span>
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Value</span>
                                </div>
                                {[
                                    { label: isSheep ? 'Total Lambing' : 'Total Calving', value: summary?.total_calving || 'N/A' },
                                    { label: isSheep ? 'Last Lambing Date' : 'Last Calving Date', value: summary?.last_calving_date || 'N/A' },
                                    { label: isSheep ? 'Lamb Survival Rate' : 'Calf Survival Rate', value: summary?.survival_rate || 'N/A' },
                                    { label: 'Breeding Status', value: summary?.breeding_status || animal.breeding_status || 'Exposed' },
                                    { label: 'Last Treatment', value: summary?.last_treatment || 'N/A' },
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center justify-between px-4 py-2.5 border-b border-[#6B7280]/20 last:border-b-0 hover:bg-[#F8FAFD] transition-colors">
                                        <div className="flex items-center gap-2.5">
                                            <div className="h-4 w-4">
                                                <svg className="h-4 w-4 -rotate-90" viewBox="0 0 36 36">
                                                    <circle cx="18" cy="18" r="15" fill="none" stroke="#E9EEF6" strokeWidth="3" />
                                                    <circle cx="18" cy="18" r="15" fill="none" stroke={row.value !== 'N/A' ? '#1a1a2e' : '#D7E3EF'} strokeWidth="3" strokeDasharray={`${row.value !== 'N/A' ? 60 : 0} 94`} strokeLinecap="round" />
                                                </svg>
                                            </div>
                                            <span className="text-[13px] font-medium text-[#1a1a2e]">{row.label}</span>
                                        </div>
                                        <span className="text-[13px] font-bold text-[#1a1a2e]/70">{row.value}</span>
                                    </div>
                                ))}
                                <div className="flex items-center justify-center py-1.5 border-t border-gray-100 cursor-pointer hover:bg-[#F8FAFD] transition-colors">
                                    <ChevronLeft size={14} className="rotate-[-90deg] text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Advanced Insights */}
                        <div className="space-y-6 border-t border-gray-200 pt-8">
                            <h2 className="text-[20px] font-black text-[#1a1a2e]">Advanced Insights</h2>
                            <MovementHistoryChart
                                movements={moveData.movements}
                                groupMovements={moveData.groupMovements}
                                onPeriodChange={setMovePeriod}
                            />
                        </div>

                        {/* Weight Over Time */}
                        <WeightChart
                            weightData={weightData}
                            currentWeight={animal.weight}
                            period={weightPeriod}
                            onPeriodChange={setWeightPeriod}
                            loading={weightLoading}
                            onRecordClick={() => navigate(`/farm/activity/sales/weight/${animalId}`)}
                        />
                         {/* Cost Breakdown */}
                        <div className="rounded-lg border border-[#80888F] bg-white p-6 space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {showCostDetail && (
                                        <button
                                            onClick={() => setShowCostDetail(null)}
                                            className="flex items-center gap-1.5 text-[12px] font-bold text-gray-500 hover:text-[#1a1a2e] transition-colors"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                                            Back to Chart
                                        </button>
                                    )}
                                    {!showCostDetail && (
                                        <span className="flex items-center gap-2 text-[15px] font-bold text-[#1a1a2e]">
                                            Cost Breakdown
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-[11px] text-gray-400 cursor-help">?</span>
                                        </span>
                                    )}
                                    {showCostDetail && (
                                        <span className="text-[15px] font-bold text-[#1a1a2e]">
                                            {showCostDetail === 'breakdown' ? 'Where the money went' : 'vs Farm Average'}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center rounded-lg border border-[#80888F]/20 bg-[#F8FAFD] p-1 gap-0">
                                    {[
                                        { label: '3 Months', value: '3m' },
                                        { label: '6 Months', value: '6m' },
                                        { label: '12 Months', value: '12m' }
                                    ].map((p) => (
                                        <button
                                            key={p.value}
                                            onClick={() => { setCostPeriod(p.value); setShowCostDetail(null); }}
                                            className={`rounded-md px-4 py-1.5 text-[12px] font-bold transition-all ${costPeriod === p.value
                                                    ? 'bg-[#1a1a2e] text-white shadow-sm'
                                                    : 'text-gray-500 hover:text-[#1a1a2e]'
                                                }`}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Summary row — always visible */}
                            <div className="flex items-baseline gap-3">
                                <span className="text-[28px] font-bold text-[#059669]">₹{costData.total || 0}</span>
                                <span className="text-[14px] text-gray-500 font-medium">
                                    (Spending is {costData.total > costData.average ? 'above' : 'below'} farm average)
                                </span>
                            </div>

                            {/* ── CHART VIEW ── */}
                            {!showCostDetail && (
                                <>
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2.5">
                                            <div className="h-3.5 w-3.5 rounded-full bg-[#e76f51]" />
                                            <span className="text-[13px] font-medium text-[#1a1a2e]/80">Animal Cost</span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <div className="h-3.5 w-3.5 rounded-full bg-[#f4a261]" />
                                            <span className="text-[13px] font-medium text-[#1a1a2e]/80">Farm Average</span>
                                        </div>
                                        <span className="ml-auto text-[11px] text-gray-400">Click a bar for details</span>
                                    </div>

                                    <div className="flex gap-0 pt-2">
                                        {/* Y-axis */}
                                        <div className="flex flex-col justify-between pr-3 py-1 text-right shrink-0 w-[50px]" style={{ height: 220 }}>
                                            <span className="text-[10px] font-bold text-gray-400">₹{Math.max(costData.total, costData.average, 100)}</span>
                                            <span className="text-[10px] font-bold text-gray-400">₹0</span>
                                        </div>

                                        {/* Bars area */}
                                        <div className="flex-1 relative border-l border-b border-[#80888F]/15" style={{ height: 220 }}>
                                            {[0,1,2,3,4].map(i => (
                                                <div key={i} className="absolute left-0 right-0 border-t border-dashed border-gray-100"
                                                    style={{ top: `${i * 25}%` }} />
                                            ))}
                                            <div className="absolute inset-0 flex items-end justify-center gap-24 px-10 pb-0">

                                                {/* Animal Cost bar */}
                                                {(() => {
                                                    const scale = costData.total > 0 ? Math.max(costData.total / Math.max(costData.total, costData.average, 100), 0.08) : 0.04;
                                                    return (
                                                        <div className="flex flex-col items-center gap-1 w-14">
                                                            <div
                                                                onClick={() => setShowCostDetail('breakdown')}
                                                                className="w-full h-[160px] rounded-t-lg bg-[#e76f51] cursor-pointer transition-all hover:brightness-110 hover:shadow-lg active:scale-95"
                                                                style={{ transform: `scaleY(${scale})`, transformOrigin: 'bottom' }}
                                                                title="Click for breakdown"
                                                            />
                                                            <span className="text-[10px] font-bold text-gray-500 mt-1">This Animal</span>
                                                        </div>
                                                    );
                                                })()}

                                                {/* Farm Average bar */}
                                                {(() => {
                                                    const scale = costData.average > 0 ? Math.max(costData.average / Math.max(costData.total, costData.average, 100), 0.08) : 0.04;
                                                    return (
                                                        <div className="flex flex-col items-center gap-1 w-14">
                                                            <div
                                                                onClick={() => setShowCostDetail('average')}
                                                                className="w-full h-[160px] rounded-t-lg bg-[#f4a261] cursor-pointer transition-all hover:brightness-110 hover:shadow-lg active:scale-95"
                                                                style={{ transform: `scaleY(${scale})`, transformOrigin: 'bottom' }}
                                                                title="Click for farm average info"
                                                            />
                                                            <span className="text-[10px] font-bold text-gray-500 mt-1">Farm Avg</span>
                                                        </div>
                                                    );
                                                })()}

                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ── BREAKDOWN DETAIL VIEW ── */}
                            {showCostDetail === 'breakdown' && (
                                <div className="space-y-4">
                                    {costData.breakdown.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-10 text-center rounded-lg border border-dashed border-gray-200 bg-gray-50">
                                            <p className="text-[13px] font-bold text-gray-400">No itemised cost records</p>
                                            <p className="text-[11px] text-gray-400 mt-1">Add costs when recording health, movement, or breeding activities</p>
                                        </div>
                                    ) : (
                                        costData.breakdown.map((cat, ci) => (
                                            <div key={ci} className="rounded-xl border border-gray-100 overflow-hidden">
                                                {/* Category header */}
                                                <div className="flex items-center justify-between px-4 py-2.5 bg-[#F8FAFD] border-b border-gray-100">
                                                    <span className="text-[12px] font-black text-[#1a1a2e] uppercase tracking-wider">{cat.category}</span>
                                                    <span className="text-[13px] font-bold text-[#e76f51]">₹{cat.amount}</span>
                                                </div>
                                                {/* Line items */}
                                                <div className="divide-y divide-gray-50">
                                                    {cat.items?.map((item, ii) => (
                                                        <div key={ii} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors">
                                                            <div>
                                                                <p className="text-[13px] font-semibold text-[#1a1a2e]">{item.label}</p>
                                                                <p className="text-[11px] text-gray-400">{item.date}</p>
                                                            </div>
                                                            <span className="text-[13px] font-bold text-gray-700">₹{item.amount}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    {/* Total row */}
                                    {costData.breakdown.length > 0 && (
                                        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#1a1a2e]">
                                            <span className="text-[13px] font-black text-white uppercase tracking-wider">Total Spent</span>
                                            <span className="text-[16px] font-black text-[#e76f51]">₹{costData.total}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── AVERAGE DETAIL VIEW ── */}
                            {showCostDetail === 'average' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="rounded-xl border border-gray-100 bg-[#FFF7F5] p-4 text-center">
                                            <p className="text-[11px] font-black text-[#e76f51] uppercase tracking-wider mb-1">This Animal</p>
                                            <p className="text-[28px] font-black text-[#1a1a2e]">₹{costData.total}</p>
                                        </div>
                                        <div className="rounded-xl border border-gray-100 bg-[#FFF9F5] p-4 text-center">
                                            <p className="text-[11px] font-black text-[#f4a261] uppercase tracking-wider mb-1">Farm Average</p>
                                            <p className="text-[28px] font-black text-[#1a1a2e]">₹{costData.average}</p>
                                        </div>
                                    </div>
                                    <div className={`rounded-xl px-5 py-4 flex items-center gap-3 ${
                                        costData.total > costData.average
                                            ? 'bg-red-50 border border-red-100'
                                            : 'bg-emerald-50 border border-emerald-100'
                                    }`}>
                                        <span className="text-2xl">{costData.total > costData.average ? '⚠️' : '✅'}</span>
                                        <div>
                                            <p className={`text-[13px] font-black ${
                                                costData.total > costData.average ? 'text-red-700' : 'text-emerald-700'
                                            }`}>
                                                ₹{Math.abs(costData.total - costData.average)} {costData.total > costData.average ? 'above' : 'below'} farm average
                                            </p>
                                            <p className="text-[11px] text-gray-500 mt-0.5">
                                                {costData.total > costData.average
                                                    ? 'This animal costs more than the average farm animal. Review health or movement costs.'
                                                    : 'This animal is being maintained efficiently — below farm average cost.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </>
                )}

                {activeTab === 'timeline' && <Timeline animal={animal} />}
                {activeTab === 'pedigree' && <PedigreeTree rootAnimal={animal} onRefresh={() => fetchAnimalData(true)} />}
                {activeTab === 'ai' && <AI animal={animal} />}

            </div>

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                count={1}
            />

            <MessageModal
                isOpen={messageModal.open}
                onClose={() => setMessageModal({ ...messageModal, open: false })}
                title={messageModal.title}
                message={messageModal.message}
                type={messageModal.type}
            />
        </section>
    );
}

const MessageModal = ({ isOpen, onClose, title, message, type = 'error' }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px]" onClick={onClose} />
            <div className="relative w-full max-w-sm scale-in-center overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="p-8 text-center">
                    <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {type === 'success' ? (
                            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                        ) : (
                            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        )}
                    </div>
                    <h3 className="mb-2 text-[18px] font-black text-[#1a1a2e]">{title}</h3>
                    <p className="mb-6 text-[13px] font-medium text-gray-500">{message}</p>
                    <button
                        onClick={onClose}
                        className="w-full rounded-2xl bg-[#1a1a2e] py-3.5 text-[14px] font-bold text-white transition-all hover:bg-black active:scale-[0.98]"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, count }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px]" onClick={onClose} />
            <div className="relative w-full max-w-md scale-in-center overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="p-8 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="mb-2 text-[20px] font-black text-[#1a1a2e]">Delete Animal?</h3>
                    <p className="mb-8 text-[14px] leading-relaxed text-gray-500">
                        This action is permanent and cannot be undone. All records associated with this animal will be removed from your farm database.
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onConfirm}
                            className="w-full rounded-2xl bg-red-500 py-4 text-[15px] font-black text-white shadow-lg shadow-red-200 transition-all hover:bg-red-600 active:scale-[0.98]"
                        >
                            Yes, Delete Permanently
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full rounded-2xl border border-gray-200 bg-white py-4 text-[15px] font-bold text-gray-500 transition-all hover:bg-gray-50 active:scale-[0.98]"
                        >
                            No, Keep it
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
