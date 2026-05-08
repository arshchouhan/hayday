import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ChevronDown, X, Loader2 } from 'lucide-react';

/* ─── Sort options ─────────────────────────────────────────────── */
const SORT_OPTIONS = [
    { key: 'last_modified', label: 'Last Modified' },
    { key: 'name_asc',      label: 'Name A → Z'    },
    { key: 'name_desc',     label: 'Name Z → A'    },
    { key: 'most_animals',  label: 'Most Animals'  },
    { key: 'fewest_animals',label: 'Fewest Animals'},
];

/* ─── Reusable sort dropdown ───────────────────────────────────── */
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
                            {value === opt.key && (
                                <div className="h-1.5 w-1.5 rounded-full bg-[#059669] shrink-0" />
                            )}
                            {value !== opt.key && <div className="h-1.5 w-1.5 shrink-0" />}
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ─── Main page ────────────────────────────────────────────────── */
const GroupsPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortKey, setSortKey] = useState('last_modified');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [groups, setGroups] = useState([]);
    const [newGroupName, setNewGroupName] = useState('');

    useEffect(() => { fetchGroups(); }, []);

    const fetchGroups = async () => {
        try {
            const res = await fetch('/api/farm/groups');
            const data = await res.json();
            setGroups(data);
        } catch (err) {
            console.error('Fetch groups error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveGroup = async () => {
        if (!newGroupName.trim()) return;
        setSaving(true);
        try {
            const res = await fetch('/api/farm/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newGroupName }),
            });
            if (res.ok) {
                setNewGroupName('');
                setShowModal(false);
                fetchGroups();
            }
        } catch (err) {
            console.error('Save group error:', err);
        } finally {
            setSaving(false);
        }
    };

    const getInitials = (name) =>
        name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);

    /* ── filter then sort ──────────────────────────────────────── */
    const displayedGroups = useMemo(() => {
        const filtered = groups.filter(g =>
            g.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return [...filtered].sort((a, b) => {
            switch (sortKey) {
                case 'name_asc':
                    return a.name.localeCompare(b.name);
                case 'name_desc':
                    return b.name.localeCompare(a.name);
                case 'most_animals':
                    return (b.animals_count || 0) - (a.animals_count || 0);
                case 'fewest_animals':
                    return (a.animals_count || 0) - (b.animals_count || 0);
                case 'last_modified':
                default:
                    // Fall back to server order (most recently created/modified first)
                    return 0;
            }
        });
    }, [groups, searchQuery, sortKey]);

    return (
        <div className="flex h-full flex-col bg-white relative">
            {/* Header */}
            <div className="flex items-start justify-between px-8 pt-8 pb-6">
                <div className="space-y-1">
                    <h1 className="text-[22px] font-black text-[#059669] tracking-tight">
                        Groups<span className="ml-1 text-[#059669]/60 font-bold">({groups.length})</span>
                    </h1>
                    <p className="text-[14px] font-medium text-gray-500 max-w-2xl leading-relaxed">
                        Click on a Group to view its details. Use "Add Group" to create new groups for your Ranch.
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 rounded-full bg-[#1a1a2e] px-6 py-2.5 text-[14px] font-black text-white shadow-lg hover:bg-black transition-all"
                >
                    <Plus size={18} strokeWidth={3} />
                    Add Group
                </button>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center justify-between px-8 py-4 bg-gray-50/50">
                <p className="text-[13px] font-medium text-gray-400 italic">
                    Use the search box to find specific groups
                </p>
                <div className="flex items-center gap-4">
                    {/* Sort dropdown */}
                    <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-gray-400 whitespace-nowrap">Sort By</span>
                        <SortDropdown value={sortKey} onChange={setSortKey} />
                    </div>

                    {/* Search */}
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search Group (s)"
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

            {/* Content */}
            <div className="flex-1 min-h-0 p-6 bg-gray-50/30 overflow-auto">
                {loading ? (
                    <div className="flex h-40 items-center justify-center">
                        <Loader2 className="animate-spin text-[#059669]" size={32} />
                    </div>
                ) : displayedGroups.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-2">
                        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                            <Search size={24} />
                        </div>
                        <p className="text-[14px] font-bold">No groups found</p>
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
                        {displayedGroups.map(group => (
                            <div
                                key={group._id || group.id}
                                onClick={() => navigate(`/farm/groups/${group._id || group.id}`)}
                                className="group relative flex flex-col gap-3 rounded-2xl border border-[#80888F]/20 bg-white p-4 shadow-sm transition-all cursor-pointer hover:border-[#80888F] hover:shadow-none"
                            >
                                {/* Avatar + Name */}
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E9EEF6] text-[12px] font-black text-[#1a1a2e] shadow-sm ring-1 ring-black/5">
                                        {getInitials(group.name)}
                                    </div>
                                    <span className="text-[16px] font-bold text-[#1a1a2e] hover:underline truncate">
                                        {group.name}
                                    </span>
                                </div>

                                {/* Pills */}
                                <div className="mt-1 flex flex-wrap gap-2">
                                    <span className="flex items-center gap-2 rounded-full bg-[#DCE9E3] px-3 py-1 text-[11px] font-bold text-[#1a1a2e]">
                                        <div className="h-2 w-2 rounded-full bg-[#059669]" />
                                        Active | <span className="font-black">{group.animals_count || 0} Animals</span>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Group Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a2e]/40 backdrop-blur-sm px-4">
                    <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between px-6 py-5">
                            <h2 className="text-[18px] font-black text-[#1a1a2e]">Add Group</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} strokeWidth={2.5} />
                            </button>
                        </div>

                        <div className="px-6 pb-4">
                            <div className="relative mt-2">
                                <label className="absolute -top-2.5 left-4 bg-white px-1 text-[11px] font-bold text-[#059669]">
                                    Group Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveGroup()}
                                    placeholder="Enter group name"
                                    className="w-full rounded-xl border border-gray-200 px-5 py-3.5 text-[14px] font-bold text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] placeholder:text-gray-300 shadow-sm transition-all"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 px-6 py-5 mt-2">
                            <button
                                onClick={() => { setShowModal(false); setNewGroupName(''); }}
                                className="rounded-full border border-gray-300 px-6 py-2 text-[14px] font-bold text-gray-700 hover:bg-gray-50 transition-all bg-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveGroup}
                                disabled={saving || !newGroupName.trim()}
                                className="rounded-full bg-[#1a1a2e] px-8 py-2 text-[14px] font-black text-white shadow-md hover:bg-black transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                {saving && <Loader2 className="animate-spin" size={16} />}
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupsPage;
