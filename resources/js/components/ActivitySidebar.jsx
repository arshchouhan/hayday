import React from 'react';

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
    const handleCategoryRoute = (activityId) => {
        const animalId = selectedIds[0];
        if (!animalId) return;
        navigate(`/farm/activity/${activityId}/${animalId}`);
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            {open && <div className="fixed inset-0 z-[120] bg-black/30 backdrop-blur-[2px]" onClick={onClose} />}

            {/* Sidebar */}
            <div className={`fixed right-0 top-0 z-[130] flex h-full w-[360px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'
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
                <div className="flex-1 overflow-y-auto px-5 py-6">
                    <div className="grid grid-cols-2 gap-4">
                        {ACTIVITIES.map((act) => (
                            <button
                                key={act.id}
                                onClick={() => handleCategoryRoute(act.id)}
                                className="group relative flex aspect-square flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-[#DCE9E3] hover:shadow-md active:scale-95"
                            >
                                {/* Icon at top left */}
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 group-hover:bg-[#DCE9E3] group-hover:text-[#1a1a2e] transition-colors">
                                    {act.icon}
                                </div>

                                {/* Label in a pill at bottom left */}
                                <div className="mt-4">
                                    <span className="inline-block rounded-full bg-[#DCE9E3] px-3 py-1 text-[11px] font-bold text-[#1a1a2e]">
                                        {act.label}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer note */}
                <div className="border-t border-gray-100 px-5 py-3">
                    <p className="text-[11px] text-gray-400">Activity will be applied to the first selected animal. Bulk support coming soon.</p>
                </div>
            </div>
        </>
    );
};

export default ActivitySidebar;
