import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Trash2, Edit2, Loader2 } from 'lucide-react';
import cowIcon from '../assets/noun-cow-8349503.svg';
import sheepIcon from '../assets/noun-sheep-8349507.svg';

/* ─── same isCow helper as ManageCattleDashboard ───────────────── */
const isCowType = (animal) =>
    ['cow', 'cattle', 'bull', 'calf', 'heifer', 'steer'].some(t =>
        animal.species?.toLowerCase().includes(t) ||
        animal.type?.toLowerCase().includes(t)
    );

/* ══════════════════════════════════════════════════════════════════
   ACTIVITY DEFINITIONS  (mirrors ManageCattleDashboard)
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
    'Dead Animal Record': 'dead-animal', 'Feeding Sale': 'feeding-sale',
    'Weight Management': 'weight-management',
};

/* ══════════════════════════════════════════════════════════════════
   GROUP ACTIVITY SIDEBAR
   Opens from "Perform activity on group" and routes to the activity
   page with ALL animal IDs as a comma-separated `animals` param.
══════════════════════════════════════════════════════════════════ */
const GroupActivitySidebar = ({ open, onClose, animalIds, groupId, navigate }) => {
    const count = animalIds.length;

    const handleRoute = (activityId) => {
        if (!count) return;
        // Pass all animal IDs as a comma-separated list so the activity page
        // can apply the record to every animal in the group at once.
        navigate(`/farm/activity/${activityId}/${animalIds[0]}?animals=${animalIds.join(',')}&groupId=${groupId}&bulk=true`);
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 z-[70] bg-black/30 backdrop-blur-[2px]"
                    onClick={onClose}
                />
            )}

            {/* Slide-in panel */}
            <div
                className={`fixed right-0 top-0 z-[80] flex h-full w-[360px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
                    open ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div>
                        <h2 className="text-[16px] font-black text-[#1a1a2e]">Group Activity</h2>
                        <p className="mt-0.5 text-[12px] text-gray-400">
                            Applied to all <span className="font-bold text-[#059669]">{count} animal{count !== 1 ? 's' : ''}</span> in this group
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-all hover:border-gray-400 hover:text-gray-700"
                    >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* No animals warning */}
                {count === 0 && (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                            <svg viewBox="0 0 24 24" className="h-7 w-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                        </div>
                        <p className="text-[14px] font-bold text-gray-500">No animals in this group yet.</p>
                        <p className="text-[12px] text-gray-400">Add animals to the group before performing activities.</p>
                    </div>
                )}

                {/* Activity grid */}
                {count > 0 && (
                    <div className="flex-1 overflow-y-auto px-5 py-6">
                        <div className="grid grid-cols-2 gap-4">
                            {ACTIVITIES.map((act) => (
                                <button
                                    key={act.id}
                                    onClick={() => handleRoute(act.id)}
                                    className="group relative flex aspect-square flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-[#DCE9E3] hover:shadow-md active:scale-95"
                                >
                                    {/* Icon */}
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-colors group-hover:bg-[#DCE9E3] group-hover:text-[#1a1a2e]">
                                        {act.icon}
                                    </div>
                                    {/* Label pill */}
                                    <div className="mt-4">
                                        <span className="inline-block rounded-full bg-[#DCE9E3] px-3 py-1 text-[11px] font-bold text-[#1a1a2e]">
                                            {act.label}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer note */}
                <div className="border-t border-gray-100 px-5 py-3">
                    <p className="text-[11px] text-gray-400">
                        Activity will be recorded for every animal currently in this group.
                    </p>
                </div>
            </div>
        </>
    );
};

/* ══════════════════════════════════════════════════════════════════
   DELETE CONFIRMATION MODAL
══════════════════════════════════════════════════════════════════ */
const DeleteModal = ({ isOpen, onClose, onConfirm, deleting }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px]" onClick={onClose} />
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="p-8 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                            <Trash2 size={28} strokeWidth={2} />
                        </div>
                    </div>
                    <h3 className="mb-2 text-[20px] font-black text-[#1a1a2e]">Delete this group?</h3>
                    <p className="mb-8 text-[14px] leading-relaxed text-gray-500">
                        This will permanently remove the group. Animals inside will <strong>not</strong> be deleted — they will just be unassigned.
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onConfirm}
                            disabled={deleting}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 py-4 text-[15px] font-black text-white shadow-lg shadow-red-200 transition-all hover:bg-red-600 active:scale-[0.98] disabled:opacity-60"
                        >
                            {deleting && <Loader2 className="animate-spin" size={16} />}
                            Yes, Delete Group
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

/* ══════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════ */
const GroupDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [activitySidebarOpen, setActivitySidebarOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => { fetchGroupDetails(); }, [id]);

    const fetchGroupDetails = async () => {
        try {
            const res = await fetch(`/api/farm/groups/${id}`);
            const data = await res.json();
            setGroup(data);
        } catch (err) {
            console.error('Fetch group details error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await fetch(`/api/farm/groups/${id}`, { method: 'DELETE' });
            if (res.ok) navigate('/farm/groups');
        } catch (err) {
            console.error('Delete group error:', err);
        } finally {
            setDeleting(false);
            setDeleteModalOpen(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center bg-[#F8FAFD]">
                <Loader2 className="animate-spin text-[#059669]" size={40} />
            </div>
        );
    }

    if (!group) {
        return (
            <div className="flex h-full flex-col items-center justify-center bg-[#F8FAFD] gap-4">
                <p className="text-gray-500 font-bold">Group not found</p>
                <button onClick={() => navigate('/farm/groups')} className="text-[#059669] font-bold flex items-center gap-2">
                    <ChevronLeft size={20} /> Back to Groups
                </button>
            </div>
        );
    }

    // Collect all animal IDs in the group for bulk activity
    const animalIds = (group.animals || []).map(a => a._id || a.id).filter(Boolean);

    return (
        <div className="flex h-full flex-col overflow-auto bg-[#F8FAFD] p-4 sm:p-6 lg:p-8">

            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1.5">
                    <button
                        onClick={() => navigate('/farm/groups')}
                        className="flex items-center gap-2 text-[20px] font-black text-[#0F172A] transition-opacity hover:opacity-80"
                    >
                        <ChevronLeft size={24} strokeWidth={3} />
                        {group.name}
                        <span className="rounded-full bg-[#D9F5E4] px-3 py-0.5 text-[11px] font-black uppercase tracking-wide text-[#059669]">
                            {(group.status || 'Active').toString()}
                        </span>
                    </button>
                    <p className="ml-8 text-[14px] font-semibold text-[#64748B]">
                        {group.description || 'Click on "Edit" to update relevant information of group.'}
                    </p>
                </div>

                <div className="ml-8 flex flex-wrap items-center gap-3 md:ml-auto">
                    {/* Perform activity on group */}
                    <button
                        onClick={() => setActivitySidebarOpen(true)}
                        className="flex items-center gap-2 rounded-full bg-[#1a1a2e] px-6 py-2 text-sm font-bold text-white shadow-lg transition-all hover:bg-black active:scale-95"
                    >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 2v20M2 12h20" />
                        </svg>
                        Perform activity on group
                    </button>

                    <button
                        onClick={() => setDeleteModalOpen(true)}
                        className="rounded-full bg-[#ef4444] px-7 py-2 text-sm font-bold text-white shadow-lg shadow-red-200 transition-all hover:bg-red-600 active:scale-95"
                    >
                        Delete
                    </button>

                    <button className="rounded-full border border-[#80888F]/40 bg-white px-7 py-2 text-sm font-bold text-[#1a1a2e] transition-all hover:bg-gray-50 active:scale-95">
                        Edit
                    </button>
                </div>
            </div>

            <div className="mb-7 border-b border-[#D6DEE9]" />

            {/* ── Animal count + grid ─────────────────────────────────── */}
            <div className="space-y-4">
                <h2 className="flex items-center gap-2 text-[28px] font-black tracking-tight text-[#0F172A]">
                    <span>{group.animals?.length || 0}</span>
                    <span>Animals</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {group.animals?.map((animal) => {
                        const animalType = isCowType(animal) ? 'cow' : 'sheep';
                        const icon = animalType === 'sheep' ? sheepIcon : cowIcon;
                        const animalId = animal._id || animal.id;
                        return (
                            <div
                                key={animalId}
                                onClick={() => navigate(`/farm/details/${animalId}?type=${animalType}`)}
                                className="group relative flex cursor-pointer flex-col gap-3 rounded-2xl border border-[#80888F]/20 bg-white p-4 shadow-sm transition-all hover:border-[#80888F] hover:shadow-none"
                            >
                                {/* Row 1 — avatar + ear tag */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`flex h-8 w-8 items-center justify-center rounded-full shadow-sm ring-1 ring-black/5 ${animal.ear_tag_color || 'bg-white'}`}>
                                            <img src={icon} className="h-5 w-5 opacity-80" alt={animal.type} />
                                        </div>
                                        <span className="text-[16px] font-bold text-[#1a1a2e]">
                                            {animal.ear_tag || animal.internal_id}
                                        </span>
                                    </div>
                                </div>

                                {/* Row 2 — type pill + name pill */}
                                <div className="flex flex-wrap gap-2">
                                    <span className="flex items-center gap-1.5 rounded-full bg-[#DCE9E3] px-3 py-1 text-[11px] font-bold text-[#1a1a2e]">
                                        <img src={icon} className="h-3.5 w-3.5 opacity-90" alt="" />
                                        {animal.type || 'Cow'}
                                    </span>
                                    <span className="rounded-full bg-[#DCE9E3] px-3 py-1 text-[11px] font-bold text-[#1a1a2e]">
                                        Cattle Name | <span className="font-black">{animal.animal_name || animal.name || 'N/A'}</span>
                                    </span>
                                </div>

                                {/* Row 3 — status + breeding status */}
                                <div className="flex flex-wrap gap-2">
                                    <span className="flex items-center gap-2 rounded-full bg-[#DCE9E3] px-3 py-1 text-[11px] font-bold text-[#1a1a2e]">
                                        <div className="h-2 w-2 rounded-full bg-[#059669]" />
                                        {animal.status || 'Active'} | <span className="font-black">{animal.breeding_status || 'Exposed'}</span>
                                    </span>
                                </div>

                                {/* Row 4 — location / unassigned button */}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/farm/workers/add?animalId=${animalId}&animals=${animalId}&groupId=${id}`);
                                    }}
                                    className="flex w-fit items-center gap-2 rounded-full bg-[#DCE9E3] px-3 py-1 text-left transition-colors hover:bg-[#C9DDD5]"
                                >
                                    <div className="flex items-center justify-center h-4 w-4 bg-white/60 rounded-sm gap-px">
                                        <div className="h-2.5 w-[3px] bg-gray-400 rounded-full" />
                                        <div className="h-2.5 w-[3px] bg-gray-400 rounded-full" />
                                        <div className="h-2.5 w-[3px] bg-gray-400 rounded-full" />
                                    </div>
                                    <span className="text-[11px] font-bold text-[#1a1a2e]">{animal.location_name || 'Unassigned'}</span>
                                    <svg viewBox="0 0 24 24" className="h-3 w-3 text-[#1a1a2e]" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                </button>
                            </div>
                        );
                    })}
                </div>

                {(!group.animals || group.animals.length === 0) && (
                    <div className="flex h-64 flex-col items-center justify-center border-t border-dashed border-[#80888F]/40">
                        <p className="font-bold text-gray-500">No animals in this group yet.</p>
                    </div>
                )}
            </div>

            {/* ── Sidebars & Modals ───────────────────────────────────── */}
            <GroupActivitySidebar
                open={activitySidebarOpen}
                onClose={() => setActivitySidebarOpen(false)}
                animalIds={animalIds}
                groupId={id}
                navigate={navigate}
            />

            <DeleteModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                deleting={deleting}
            />
        </div>
    );
};

export default GroupDetail;
