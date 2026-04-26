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
import Loader from './Loader';

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
                    className={`rounded-full border px-8 py-2.5 text-[15px] font-bold transition-all ${
                        value?.toLowerCase() === opt.toLowerCase()
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('details');

    useEffect(() => {
        if (!animalId) return;
        
        setLoading(true);
        fetch(`/api/animals/${animalId}`)
            .then(res => {
                if (!res.ok) throw new Error('Animal not found');
                return res.json();
            })
            .then(data => {
                setAnimal(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching animal details:", err);
                setError(err.message);
                setLoading(false);
            });
    }, [animalId]);

    if (loading) {
        return <Loader message="Fetching animal records..." />;
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
                                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                                        animal.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
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
                            className={`text-[15px] font-medium pb-3 px-1 transition-colors -mb-[1px] ${
                                activeTab === 'details' 
                                    ? 'text-[#059669] border-b-[2px] border-[#059669]' 
                                    : 'text-[#1a1a2e] border-b-[2px] border-transparent hover:text-gray-600'
                            }`}
                        >
                            Cattle Details
                        </button>
                        <button 
                            onClick={() => setActiveTab('timeline')}
                            className={`text-[15px] font-medium pb-3 px-1 transition-colors -mb-[1px] ${
                                activeTab === 'timeline' 
                                    ? 'text-[#059669] border-b-[2px] border-[#059669]' 
                                    : 'text-[#1a1a2e] border-b-[2px] border-transparent hover:text-gray-600'
                            }`}
                        >
                            Timeline
                        </button>
                        <button 
                            onClick={() => setActiveTab('pedigree')}
                            className={`text-[15px] font-medium pb-3 px-1 transition-colors -mb-[1px] ${
                                activeTab === 'pedigree' 
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
                            { label: isSheep ? 'Total Lambing' : 'Total Calving', value: 'N/A' },
                            { label: isSheep ? 'Last Lambing Date' : 'Last Calving Date', value: 'N/A' },
                            { label: isSheep ? 'Lamb Survival Rate' : 'Calf Survival Rate', value: 'N/A' },
                            { label: 'Breeding Status', value: 'Exposed' },
                            { label: 'Last Treatment', value: 'N/A' },
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
                                {['3 Months', '6 Months', '12 Months'].map((period, i) => (
                                    <button
                                        key={period}
                                        className={`rounded-md px-4 py-1.5 text-[12px] font-bold transition-all ${
                                            i === 0
                                                ? 'bg-[#1a1a2e] text-white shadow-sm'
                                                : 'text-gray-500 hover:text-[#1a1a2e]'
                                        }`}
                                    >
                                        {period}
                                    </button>
                                ))}
                            </div>
                            <span className="text-[11px] font-medium text-gray-400">Updated just now</span>
                        </div>

                        {/* Bar Chart */}
                        <div className="flex gap-0">
                            {/* Y-Axis Labels */}
                            <div className="flex flex-col justify-between pr-3 py-1 text-right shrink-0 w-[50px]" style={{ height: '200px' }}>
                                <span className="text-[10px] font-bold text-gray-400">5</span>
                                <span className="text-[10px] font-bold text-gray-400">4</span>
                                <span className="text-[10px] font-bold text-gray-400">3</span>
                                <span className="text-[10px] font-bold text-gray-400">2</span>
                                <span className="text-[10px] font-bold text-gray-400">1</span>
                                <span className="text-[10px] font-bold text-gray-400">0</span>
                            </div>

                            {/* Bars Area */}
                            <div className="flex-1 relative border-l border-b border-[#80888F]/15" style={{ height: '200px' }}>
                                {/* Horizontal grid lines */}
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="absolute left-0 right-0 border-t border-dashed border-gray-100"
                                        style={{ top: `${i * 20}%` }}
                                    />
                                ))}

                                {/* Bars */}
                                <div className="absolute inset-0 flex items-end justify-around px-2 pb-0">
                                    {[
                                        { h: '60%', label: 'W1' },
                                        { h: '80%', label: 'W2' },
                                        { h: '75%', label: 'W3' },
                                        { h: '40%', label: 'W4' },
                                        { h: '20%', label: 'W5' },
                                        { h: '50%', label: 'W6' },
                                        { h: '90%', label: 'W7' },
                                        { h: '65%', label: 'W8' },
                                        { h: '30%', label: 'W9' },
                                        { h: '15%', label: 'W10' },
                                        { h: '10%', label: 'W11' },
                                        { h: '5%', label: 'W12' },
                                    ].map((bar, i) => (
                                        <div key={i} className="flex flex-col items-center gap-0 flex-1">
                                            <div
                                                className="w-full max-w-[24px] rounded-t-md bg-[#f5a623] hover:bg-[#e69500] transition-colors cursor-pointer"
                                                style={{ height: bar.h }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* X-Axis Labels */}
                        <div className="flex gap-0 pl-[50px]">
                            <div className="flex-1 flex items-center justify-around">
                                {['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'].map((w) => (
                                    <span key={w} className="text-[10px] font-bold text-gray-400 flex-1 text-center">{w}</span>
                                ))}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-8 border-t border-gray-100 pt-4">
                            <div className="flex items-center gap-2">
                                <div className="h-2.5 w-2.5 rounded-full bg-[#f5a623]" />
                                <span className="text-[12px] font-bold text-[#1a1a2e]/70">Location Changes</span>
                                <span className="text-[12px] font-bold text-[#1a1a2e] ml-auto">0</span>
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
                            {['3 Months', '6 Months', '12 Months'].map((period, i) => (
                                <button
                                    key={period}
                                    className={`rounded-md px-4 py-1.5 text-[12px] font-bold transition-all ${
                                        i === 0
                                            ? 'bg-[#1a1a2e] text-white shadow-sm'
                                            : 'text-gray-500 hover:text-[#1a1a2e]'
                                    }`}
                                >
                                    {period}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="text-[13px]">
                        <span className="font-bold text-[#1a1a2e] uppercase tracking-wider">Last 3 Months</span>
                        <span className="ml-2 font-bold text-emerald-600">{animal.weight || '0.0'} kg</span>
                        <span className="ml-1 text-gray-400">(0.0%)</span>
                    </div>

                    {/* Empty State */}
                    <div className="flex flex-col items-center justify-center rounded-lg border border-[#80888F]/30 bg-[#F8FAFD] py-12 text-center space-y-4">
                        <div className="text-[#1a1a2e]/40">
                            <svg viewBox="0 0 24 24" className="h-10 w-10 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M12 3v1m0 16v1m-8-9H3m18 0h-1M5.6 5.6l.7.7m12.1-.7-.7.7M5.6 18.4l.7-.7m12.1.7-.7-.7" />
                                <circle cx="12" cy="12" r="4" />
                                <path d="M12 8v4l2 2" />
                            </svg>
                        </div>
                        <p className="text-[14px] font-bold text-gray-400">No Weight Records Available</p>
                        <p className="text-[13px] text-gray-400 max-w-md">Start tracking your animals weight trends by recording a weight measurement activity</p>
                        <button className="flex items-center gap-2 rounded-full border border-[#80888F] px-6 py-2 text-[13px] font-bold text-[#1a1a2e] hover:bg-[#E9EEF6] transition-all">
                            <span className="text-lg leading-none">+</span>
                            Record Weight Measurement
                        </button>
                    </div>
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
                            {['3 Months', '6 Months', '12 Months'].map((period, i) => (
                                <button
                                    key={period}
                                    className={`rounded-md px-4 py-1.5 text-[12px] font-bold transition-all ${
                                        i === 0
                                            ? 'bg-[#1a1a2e] text-white shadow-sm'
                                            : 'text-gray-500 hover:text-[#1a1a2e]'
                                    }`}
                                >
                                    {period}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Summary & Legend */}
                    <div className="space-y-5">
                        <div className="flex items-baseline gap-3">
                            <span className="text-[28px] font-bold text-[#059669]">$324</span>
                            <span className="text-[14px] text-gray-500 font-medium">(Spending is 100.0% above farm average)</span>
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
                        <div className="flex flex-col justify-between pr-3 py-1 text-right shrink-0 w-[50px]" style={{ height: '220px' }}>
                            <span className="text-[10px] font-bold text-gray-400">$400</span>
                            <span className="text-[10px] font-bold text-gray-400">$300</span>
                            <span className="text-[10px] font-bold text-gray-400">$200</span>
                            <span className="text-[10px] font-bold text-gray-400">$100</span>
                            <span className="text-[10px] font-bold text-gray-400">$0</span>
                        </div>

                        {/* Bars Area */}
                        <div className="flex-1 relative border-l border-b border-[#80888F]/15" style={{ height: '220px' }}>
                            {/* Horizontal grid lines */}
                            {[0, 1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="absolute left-0 right-0 border-t border-dashed border-gray-100"
                                    style={{ top: `${i * 25}%` }}
                                />
                            ))}

                            {/* Bars */}
                            <div className="absolute inset-0 flex items-end justify-center gap-24 px-10 pb-0">
                                <div className="flex flex-col items-center gap-0 w-12">
                                    <div
                                        className="w-full rounded-t-lg bg-[#e76f51] transition-colors cursor-pointer hover:opacity-90"
                                        style={{ height: '81%' }}
                                    />
                                </div>
                                <div className="flex flex-col items-center gap-0 w-12">
                                    <div
                                        className="w-full rounded-t-lg bg-[#f4a261] transition-colors cursor-pointer hover:opacity-90"
                                        style={{ height: '40.5%' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </>
                )}

                {activeTab === 'timeline' && <Timeline animal={animal} />}
                {activeTab === 'pedigree' && <div className="h-[600px] rounded-xl overflow-hidden border border-[#80888F]/20"><PedigreeTree rootAnimal={animal} /></div>}
                {activeTab === 'ai' && <AI animal={animal} />}

            </div>
        </section>
    );
}
