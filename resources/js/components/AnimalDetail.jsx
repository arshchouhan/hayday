import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
    const [searchParams] = useSearchParams();
    const urlType = searchParams.get('type');
    const [animal, setAnimal] = useState(null);
    const [summary, setSummary] = useState(null);
    const [moveData, setMoveData] = useState({ history: [], total: 0 });
    const [weightData, setWeightData] = useState([]);
    const [costData, setCostData] = useState({ total: 0, average: 150 });
    
    const [movePeriod, setMovePeriod] = useState('3m');
    const [weightPeriod, setWeightPeriod] = useState('3m');
    const [costPeriod, setCostPeriod] = useState('3m');

    const [loading, setLoading] = useState(true);
    const [moveLoading, setMoveLoading] = useState(false);
    const [weightLoading, setWeightLoading] = useState(false);
    const [costLoading, setCostLoading] = useState(false);
    
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('details');

    const fetchAnimalData = () => {
        if (!animalId) return;

        const cached = ANIMAL_DETAIL_CACHE.get(animalId);
        if (cached) {
            setAnimal(cached.animal);
            setSummary(cached.summary);
            setLoading(false);
            return;
        }

        setLoading(true);
        Promise.all([
            fetch(`/api/farm/animals/${animalId}`).then(r => r.json()),
            fetch(`/api/farm/animals/${animalId}/activity-summary`).then(r => r.json())
        ]).then(([animalRes, summaryRes]) => {
            setAnimal(animalRes);
            const nextSummary = summaryRes.success ? summaryRes.data : null;
            if (nextSummary) setSummary(nextSummary);
            ANIMAL_DETAIL_CACHE.set(animalId, {
                animal: animalRes,
                summary: nextSummary,
            });
            setLoading(false);
        }).catch(err => {
            setError(err.message);
            setLoading(false);
        });
    };

    // Fetch Animal Details & Basic Summary (Once)
    useEffect(() => {
        fetchAnimalData();
    }, [animalId]);

    // Fetch Movement History
    useEffect(() => {
        if (!animalId) return;
        setMoveLoading(true);
        fetch(`/api/farm/animals/${animalId}/movement-history?period=${movePeriod}`)
            .then(r => r.json())
            .then(res => {
                if (res.success) setMoveData({ history: res.data, total: res.total });
                setMoveLoading(false);
            });
    }, [animalId, movePeriod]);

    // Fetch Weight History
    useEffect(() => {
        if (!animalId) return;
        setWeightLoading(true);
        fetch(`/api/farm/animals/${animalId}/weight-history?period=${weightPeriod}`)
            .then(r => r.json())
            .then(res => {
                if (res.success) setWeightData(res.data);
                setWeightLoading(false);
            });
    }, [animalId, weightPeriod]);

    // Fetch Cost Stats
    useEffect(() => {
        if (!animalId) return;
        setCostLoading(true);
        fetch(`/api/farm/animals/${animalId}/cost-stats?period=${costPeriod}`)
            .then(r => r.json())
            .then(res => {
                if (res.success) setCostData({ total: res.total, average: res.average });
                setCostLoading(false);
            });
    }, [animalId, costPeriod]);

    if (loading) {
        return (
            <section className="h-full min-h-0 w-full overflow-auto bg-[#F8FAFD] p-4 sm:p-8">
                <div className="w-full max-w-4xl space-y-8">
                    {/* Header skeleton */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-7 w-7 rounded-full bg-gray-200 animate-pulse" />
                            <div className="h-9 w-9 rounded-xl bg-gray-200 animate-pulse" />
                            <div className="space-y-1.5">
                                <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
                                <div className="h-3.5 w-48 rounded bg-gray-100 animate-pulse" />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="h-8 w-20 rounded-full bg-gray-200 animate-pulse" />
                            <div className="h-8 w-24 rounded-full bg-gray-200 animate-pulse" />
                        </div>
                    </div>
                    {/* Tab skeleton */}
                    <div className="flex gap-8 border-b border-gray-200 pb-0">
                        {[80, 60, 100].map((w, i) => (
                            <div key={i} className="mb-3 h-4 rounded animate-pulse bg-gray-200 w-[var(--tab-width)]" style={{ '--tab-width': `${w}px` }} />
                        ))}
                    </div>
                    {/* Field grid skeletons */}
                    <div className="space-y-4">
                        <div className="h-5 w-40 rounded bg-gray-200 animate-pulse" />
                        <div className="grid grid-cols-3 gap-4">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} className="h-12 rounded-lg bg-gray-200 animate-pulse" />
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="h-5 w-48 rounded bg-gray-200 animate-pulse" />
                        <div className="grid grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-12 rounded-lg bg-gray-100 animate-pulse" />
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
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate(-1)}
                                className="group flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-all hover:border-[#1a1a2e] hover:text-[#1a1a2e]"
                            >
                                <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
                            </button>
                            <div className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-sm ring-2 ring-white ${animal.ear_tag_color || 'bg-blue-500'}`}>
                                <img src={isSheep ? sheepIcon : cowIcon} className="h-5 w-5 brightness-0 invert opacity-90" alt="animal type" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl font-black text-[#1a1a2e] tracking-tight">{animal.ear_tag}</h1>
                                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${animal.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {animal.status}
                                    </span>
                                </div>
                                <p className="text-[13px] font-medium text-gray-500">{animal.cattle_name || 'Unnamed Animal'} • {animal.type}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="rounded-full border border-[#80888F] bg-gray-100 px-6 py-1.5 text-sm font-bold text-gray-600 hover:bg-gray-200">
                                Edit
                            </button>
                            <button className="rounded-full border border-[#80888F] bg-red-500 px-8 py-1.5 text-sm font-bold text-white shadow-lg hover:bg-red-600">
                                Delete
                            </button>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex items-center gap-8 border-b border-[#80888F]/30">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`text-[15px] font-medium pb-3 px-1 transition-colors -mb-[1px] ${activeTab === 'details'
                                    ? 'text-[#059669] border-b-[2px] border-[#059669]'
                                    : 'text-[#1a1a2e] border-b-[2px] border-transparent hover:text-gray-600'
                                }`}
                        >
                            Cattle Details
                        </button>
                        <button
                            onClick={() => setActiveTab('timeline')}
                            className={`text-[15px] font-medium pb-3 px-1 transition-colors -mb-[1px] ${activeTab === 'timeline'
                                    ? 'text-[#059669] border-b-[2px] border-[#059669]'
                                    : 'text-[#1a1a2e] border-b-[2px] border-transparent hover:text-gray-600'
                                }`}
                        >
                            Timeline
                        </button>
                        <button
                            onClick={() => setActiveTab('pedigree')}
                            className={`text-[15px] font-medium pb-3 px-1 transition-colors -mb-[1px] ${activeTab === 'pedigree'
                                    ? 'text-[#059669] border-b-[2px] border-[#059669]'
                                    : 'text-[#1a1a2e] border-b-[2px] border-transparent hover:text-gray-600'
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
                                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-[#F8FAFD]">
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
                        <div className="space-y-5 border-t border-gray-200 pt-8">
                            <h2 className="text-[17px] font-bold text-[#1a1a2e]">Advanced Insights</h2>
                            <div className="rounded-lg border border-[#80888F] bg-white p-6 space-y-5">
                                {/* Chart Header */}
                                <div>
                                    <h3 className="text-[15px] font-bold text-[#1a1a2e]">Movement History</h3>
                                    <p className="text-[12px] text-gray-400 mt-0.5">Location and ownership transfers over time</p>
                                </div>

                                {/* Tabs + Updated */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center rounded-lg border border-[#80888F]/20 bg-[#F8FAFD] p-1 gap-0">
                                        {[
                                            { label: '3 Months', value: '3m' },
                                            { label: '6 Months', value: '6m' },
                                            { label: '12 Months', value: '12m' }
                                        ].map((p) => (
                                            <button
                                                key={p.value}
                                                onClick={() => setMovePeriod(p.value)}
                                                className={`rounded-md px-4 py-1.5 text-[12px] font-bold transition-all ${movePeriod === p.value
                                                        ? 'bg-[#1a1a2e] text-white shadow-sm'
                                                        : 'text-gray-500 hover:text-[#1a1a2e]'
                                                    }`}
                                            >
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>
                                    <span className="text-[11px] font-medium text-gray-400">
                                        {moveLoading ? 'Updating...' : 'Updated just now'}
                                    </span>
                                </div>

                                {/* Bar Chart */}
                                <div className="flex gap-0">
                                    {/* Y-Axis Labels */}
                                    <div className="flex flex-col justify-between pr-3 py-1 text-right shrink-0 w-[50px] h-[var(--chart-height)]" style={{ '--chart-height': '200px' }}>
                                        <span className="text-[10px] font-bold text-gray-400">5</span>
                                        <span className="text-[10px] font-bold text-gray-400">4</span>
                                        <span className="text-[10px] font-bold text-gray-400">3</span>
                                        <span className="text-[10px] font-bold text-gray-400">2</span>
                                        <span className="text-[10px] font-bold text-gray-400">1</span>
                                        <span className="text-[10px] font-bold text-gray-400">0</span>
                                    </div>

                                    {/* Bars Area */}
                                    <div className="flex-1 relative border-l border-b border-[#80888F]/15 h-[var(--chart-height)]" style={{ '--chart-height': '200px' }}>
                                        {/* Horizontal grid lines */}
                                        {[0, 1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                style={{ '--grid-top': `${i * 20}%` }}
                                                className="absolute left-0 right-0 border-t border-dashed border-gray-100 top-[var(--grid-top)]"
                                            />
                                        ))}

                                        {/* Bars */}
                                        <div className="absolute inset-0 flex items-end justify-around px-2 pb-0">
                                            {(moveData.history || []).map((bar, i) => {
                                                const maxCount = Math.max(...(moveData.history.map(m => m.count) || [5]));
                                                const heightPercent = maxCount > 0 ? (bar.count / maxCount) * 100 : 0;
                                                return (
                                                    <div key={i} className="flex flex-col items-center gap-0 flex-1">
                                                        <div
                                                            className="w-full max-w-[24px] rounded-t-md bg-[#f5a623] hover:bg-[#e69500] transition-colors cursor-pointer h-[var(--bar-height)]"
                                                            style={{ '--bar-height': `${heightPercent}%` }}
                                                            title={`${bar.count} movements`}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* X-Axis Labels */}
                                <div className="flex gap-0 pl-[50px]">
                                    <div className="flex-1 flex items-center justify-around">
                                        {(moveData.history || []).map((bar, i) => (
                                            <span key={i} className="text-[10px] font-bold text-gray-400 flex-1 text-center">{bar.label}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Legend */}
                                <div className="flex items-center gap-8 border-t border-gray-100 pt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-[#f5a623]" />
                                        <span className="text-[12px] font-bold text-[#1a1a2e]/70">Location Changes</span>
                                        <span className="text-[12px] font-bold text-[#1a1a2e] ml-auto">{moveData.total || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                        <span className="text-[12px] font-bold text-[#1a1a2e]/70">Current Location</span>
                                        <span className="text-[12px] font-bold text-[#1a1a2e] ml-auto">{animal.location?.name || 'Main Pasture'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Weight Over Time */}
                        <div className="rounded-lg border border-[#80888F] bg-white p-6 space-y-5">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-[15px] font-bold text-[#1a1a2e]">
                                    Weight Over Time
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-[11px] text-gray-400 cursor-help">?</span>
                                </span>
                                <div className="flex items-center rounded-lg border border-[#80888F]/20 bg-[#F8FAFD] p-1 gap-0">
                                    {[
                                        { label: '3 Months', value: '3m' },
                                        { label: '6 Months', value: '6m' },
                                        { label: '12 Months', value: '12m' }
                                    ].map((p) => (
                                        <button
                                            key={p.value}
                                            onClick={() => setWeightPeriod(p.value)}
                                            className={`rounded-md px-4 py-1.5 text-[12px] font-bold transition-all ${weightPeriod === p.value
                                                    ? 'bg-[#1a1a2e] text-white shadow-sm'
                                                    : 'text-gray-500 hover:text-[#1a1a2e]'
                                                }`}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="text-[13px]">
                                <span className="font-bold text-[#1a1a2e] uppercase tracking-wider">
                                    Last {weightPeriod === '3m' ? '3' : weightPeriod === '6m' ? '6' : '12'} Months
                                </span>
                                <span className="ml-2 font-bold text-emerald-600">
                                    {weightData.length > 0 
                                        ? weightData[weightData.length - 1].weight 
                                        : animal.weight || '0.0'} kg
                                </span>
                            </div>

                            {/* State */}
                            {weightData.length > 0 ? (
                                <div className="h-[150px] flex items-end justify-around border-b border-gray-100 pb-2">
                                    {weightData.map((w, i) => {
                                        const maxW = Math.max(...weightData.map(x => x.weight));
                                        const h = (w.weight / maxW) * 100;
                                        return (
                                            <div key={i} className="flex flex-col items-center gap-1 group relative">
                                                <div
                                                    className="w-8 bg-emerald-500 rounded-t-sm hover:bg-emerald-600 transition-colors h-[var(--bar-height)]"
                                                    style={{ '--bar-height': `${h}%` }}
                                                     title={`${w.label}: ${w.weight}kg on ${w.date}`} />
                                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">{w.label}</span>
                                                <span className="text-[8px] text-gray-400">{w.date.split('-').slice(1).join('/')}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center rounded-lg border border-[#80888F]/30 bg-[#F8FAFD] py-12 text-center space-y-4">
                                    <div className="text-[#1a1a2e]/40">
                                        <svg viewBox="0 0 24 24" className="h-10 w-10 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M12 3v1m0 16v1m-8-9H3m18 0h-1M5.6 5.6l.7.7m12.1-.7-.7.7M5.6 18.4l.7-.7m12.1.7-.7-.7" />
                                            <circle cx="12" cy="12" r="4" />
                                            <path d="M12 8v4l2 2" />
                                        </svg>
                                    </div>
                                    <p className="text-[14px] font-bold text-gray-400">{weightLoading ? 'Loading...' : 'No Weight Records Available'}</p>
                                    <p className="text-[13px] text-gray-400 max-w-md">Start tracking your animals weight trends by recording a weight measurement activity</p>
                                    <button 
                                        onClick={() => navigate(`/farm/activity/sales/weight/${animalId}`)}
                                        className="flex items-center gap-2 rounded-full border border-[#80888F] px-6 py-2 text-[13px] font-bold text-[#1a1a2e] hover:bg-[#E9EEF6] transition-all"
                                    >
                                        <span className="text-lg leading-none">+</span>
                                        Record Weight Measurement
                                    </button>
                                </div>
                            )}
                        </div>


                        {/* Cost Breakdown */}
                        <div className="rounded-lg border border-[#80888F] bg-white p-6 space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-[15px] font-bold text-[#1a1a2e]">
                                    Cost Breakdown
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-[11px] text-gray-400 cursor-help">?</span>
                                </span>
                                <div className="flex items-center rounded-lg border border-[#80888F]/20 bg-[#F8FAFD] p-1 gap-0">
                                    {[
                                        { label: '3 Months', value: '3m' },
                                        { label: '6 Months', value: '6m' },
                                        { label: '12 Months', value: '12m' }
                                    ].map((p) => (
                                        <button
                                            key={p.value}
                                            onClick={() => setCostPeriod(p.value)}
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

                            {/* Summary & Legend */}
                            <div className="space-y-5">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-[28px] font-bold text-[#059669]">${costData.total || 0}</span>
                                    <span className="text-[14px] text-gray-500 font-medium">
                                        (Spending is {costData.total > costData.average ? 'above' : 'below'} farm average)
                                    </span>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-3.5 w-3.5 rounded-full bg-[#e76f51]" />
                                        <span className="text-[13px] font-medium text-[#1a1a2e]/80">Animal Cost</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-3.5 w-3.5 rounded-full bg-[#f4a261]" />
                                        <span className="text-[13px] font-medium text-[#1a1a2e]/80">Farm Average</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bar Chart (Vercel Style Background) */}
                            <div className="flex gap-0 pt-2">
                                {/* Y-Axis Labels */}
                                <div className="flex flex-col justify-between pr-3 py-1 text-right shrink-0 w-[50px] h-[var(--chart-height)]" style={{ '--chart-height': '220px' }}>
                                    <span className="text-[10px] font-bold text-gray-400">${Math.max(costData.total, costData.average, 100)}</span>
                                    <span className="text-[10px] font-bold text-gray-400">$0</span>
                                </div>

                                {/* Bars Area */}
                                <div className="flex-1 relative border-l border-b border-[#80888F]/15 h-[var(--chart-height)]" style={{ '--chart-height': '220px' }}>
                                    {/* Horizontal grid lines */}
                                    {[0, 1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                                style={{ '--grid-top': `${i * 25}%` }}
                                                className="absolute left-0 right-0 border-t border-dashed border-gray-100 top-[var(--grid-top)]"
                                        />
                                    ))}

                                    {/* Bars */}
                                    <div className="absolute inset-0 flex items-end justify-center gap-24 px-10 pb-0">
                                        <div className="flex flex-col items-center gap-0 w-12">
                                            <div
                                                className="w-full rounded-t-lg bg-[#e76f51] transition-colors cursor-pointer hover:opacity-90 h-[var(--bar-height)]"
                                                style={{ '--bar-height': `${(costData.total / Math.max(costData.total, costData.average, 100)) * 100}%` }}
                                            />
                                        </div>
                                        <div className="flex flex-col items-center gap-0 w-12">
                                            <div
                                                className="w-full rounded-t-lg bg-[#f4a261] transition-colors cursor-pointer hover:opacity-90 h-[var(--bar-height)]"
                                                style={{ '--bar-height': `${(costData.average / Math.max(costData.total, costData.average, 100)) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'timeline' && <Timeline animal={animal} />}
                {activeTab === 'pedigree' && <div className="h-[600px] rounded-xl overflow-hidden border border-[#80888F]/20"><PedigreeTree rootAnimal={animal} onRefresh={fetchAnimalData} /></div>}
                {activeTab === 'ai' && <AI animal={animal} />}

            </div>
        </section>
    );
}
