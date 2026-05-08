import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ChevronDown, X, Loader2, Trash2 } from 'lucide-react';
import axios from 'axios';

/* ─── Sort options ─────────────────────────────────────────────── */
const SORT_OPTIONS = [
    { key: 'last_modified', label: 'Last Modified' },
    { key: 'name_asc',      label: 'Name A → Z'    },
    { key: 'name_desc',     label: 'Name Z → A'    },
    { key: 'status',        label: 'By Status'     },
];

/* ─── Sort dropdown (mirrors Groups page) ──────────────────────── */
const SortDropdown = ({ value, onChange }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const selected = SORT_OPTIONS.find(o => o.key === value) || SORT_OPTIONS[0];

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <div
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 shadow-sm cursor-pointer hover:border-[#1a1a2e] transition-all select-none"
            >
                <span className="text-[13px] font-bold text-[#1a1a2e] whitespace-nowrap">{selected.label}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </div>

            {open && (
                <div className="absolute top-[calc(100%+6px)] right-0 z-50 min-w-[180px] overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                    <p className="px-4 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Sort by</p>
                    {SORT_OPTIONS.map(opt => (
                        <div
                            key={opt.key}
                            onClick={() => { onChange(opt.key); setOpen(false); }}
                            className={`flex items-center gap-2 cursor-pointer px-4 py-2.5 text-[13px] font-semibold transition-colors ${
                                value === opt.key
                                    ? 'bg-[#DCE9E3] text-[#1a1a2e] font-bold'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#1a1a2e]'
                            }`}
                        >
                            <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${value === opt.key ? 'bg-[#059669]' : 'opacity-0'}`} />
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ─── Main page ────────────────────────────────────────────────── */
const WorkersPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortKey, setSortKey] = useState('last_modified');
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchWorkers(); }, []);

    const fetchWorkers = async () => {
        try {
            const res = await axios.get('/api/farm/workers');
            setWorkers(res.data);
        } catch (err) {
            console.error('Fetch workers error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this worker?')) return;
        try {
            await axios.delete(`/api/farm/workers/${id}`);
            fetchWorkers();
        } catch (err) {
            console.error('Delete worker error:', err);
        }
    };

    const getInitials = (name) =>
        name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);

    /* filter + sort */
    const displayedWorkers = useMemo(() => {
        const filtered = workers.filter(w =>
            w.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return [...filtered].sort((a, b) => {
            switch (sortKey) {
                case 'name_asc':  return a.name.localeCompare(b.name);
                case 'name_desc': return b.name.localeCompare(a.name);
                case 'status':    return (a.status || '').localeCompare(b.status || '');
                default:          return 0; // server order
            }
        });
    }, [workers, searchQuery, sortKey]);

    return (
        <div className="flex h-full flex-col bg-white relative">
            {/* Header — identical structure to Groups page */}
            <div className="flex items-start justify-between px-8 pt-8 pb-6">
                <div className="space-y-1">
                    <h1 className="text-[22px] font-black text-[#059669] tracking-tight">
                        Workers<span className="ml-1 text-[#059669]/60 font-bold">({workers.length})</span>
                    </h1>
                    <p className="text-[14px] font-medium text-gray-500 max-w-2xl leading-relaxed">
                        View and edit your Workers by clicking on them. Use "Add Worker" to register new staff on your Ranch.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/farm/workers/add')}
                    className="flex items-center gap-2 rounded-full bg-[#1a1a2e] px-6 py-2.5 text-[14px] font-black text-white shadow-lg hover:bg-black transition-all"
                >
                    <Plus size={18} strokeWidth={3} />
                    Add Worker
                </button>
            </div>

            {/* Filter bar — identical structure to Groups page */}
            <div className="flex items-center justify-between px-8 py-4 bg-gray-50/50">
                <p className="text-[13px] font-medium text-gray-400 italic">
                    Use the search box to find specific workers
                </p>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-gray-400 whitespace-nowrap">Sort By</span>
                        <SortDropdown value={sortKey} onChange={setSortKey} />
                    </div>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search Worker (s)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-[#E9EEF6]/50 py-2 pl-10 pr-8 text-[13px] font-bold text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#1a1a2e] placeholder:text-gray-400"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={13} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content — identical card style to Groups page */}
            <div className="flex-1 min-h-0 p-6 bg-gray-50/30 overflow-auto">
                {loading ? (
                    <div className="flex h-40 items-center justify-center">
                        <Loader2 className="animate-spin text-[#059669]" size={32} />
                    </div>
                ) : displayedWorkers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-2">
                        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                            <Search size={24} />
                        </div>
                        <p className="text-[14px] font-bold">No workers found</p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="text-[13px] font-bold text-[#059669] hover:underline mt-1"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {displayedWorkers.map(worker => (
                            <div
                                key={worker._id || worker.id}
                                onClick={() => navigate(`/farm/workers/add?workerId=${worker._id || worker.id}`)}
                                className="group relative flex flex-col gap-3 rounded-2xl border border-[#80888F]/20 bg-white p-4 shadow-sm transition-all cursor-pointer hover:border-[#80888F] hover:shadow-none"
                            >
                                {/* Avatar + Name row */}
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E9EEF6] text-[12px] font-black text-[#1a1a2e] shadow-sm ring-1 ring-black/5">
                                        {getInitials(worker.name)}
                                    </div>
                                    <span className="text-[16px] font-bold text-[#1a1a2e] hover:underline truncate">
                                        {worker.name}
                                    </span>
                                </div>

                                {/* Pills row */}
                                <div className="mt-1 flex flex-wrap gap-2">
                                    {/* Status pill */}
                                    <span className="flex items-center gap-2 rounded-full bg-[#DCE9E3] px-3 py-1 text-[11px] font-bold text-[#1a1a2e]">
                                        <div className="h-2 w-2 rounded-full bg-[#059669]" />
                                        {worker.status || 'Active'}
                                    </span>
                                    {/* Role pill */}
                                    {worker.role && (
                                        <span className="rounded-full bg-[#DCE9E3] px-3 py-1 text-[11px] font-bold text-[#1a1a2e]">
                                            {worker.role}
                                        </span>
                                    )}
                                </div>

                                {/* Delete button (hover-reveal) */}
                                <button
                                    onClick={(e) => handleDelete(worker._id || worker.id, e)}
                                    className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={14} strokeWidth={2} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkersPage;
