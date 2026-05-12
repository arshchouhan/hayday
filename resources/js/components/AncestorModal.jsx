import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Search, Save } from 'lucide-react';
import pedigreeIllustration from '../assets/hand-drawn-cow-outline-illustration.png';

export default function AncestorModal({ isOpen, onClose, animal, role, targetAnimalId, species, onSave }) {
    const [search, setSearch] = useState('');
    const [options, setOptions] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const parentLabel = role.includes('Sire') ? 'Sire' : 'Dam';
    const parentTerm = parentLabel.toLowerCase();

    useEffect(() => {
        if (isOpen) {
            // Reset selection on every open/target change so previous choice is not reused accidentally.
            setSelectedId('');
            setSearch('');
            setFetching(true);
            fetchOptions().finally(() => setFetching(false));
        } else {
            setSelectedId('');
            setSearch('');
            setOptions([]);
        }
    }, [isOpen, role, targetAnimalId, species]);

    const fetchOptions = async () => {
        try {
            const res = await axios.get('/api/farm/animals/form-data');
            const list = role.includes('Sire') ? (res.data?.sires ?? []) : (res.data?.dams ?? []);
            setOptions(list);
        } catch (err) {
            console.error("Search error:", err);
            setOptions([]);
        }
    };

    const handleSave = async () => {
        if (!selectedId) return;
        setLoading(true);
        try {
            const field = role.includes('Sire') ? 'sire_id' : 'dam_id';
            await axios.put(`/api/farm/animals/${targetAnimalId}`, {
                [field]: selectedId
            });
            if (onSave) onSave();
            onClose();
        } catch (err) {
            alert("Error saving pedigree: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const filteredOptions = options.filter(opt => {
        const optId = String(opt.id || opt._id || '');
        const targetId = String(targetAnimalId || '');
        if (optId !== '' && targetId !== '' && optId === targetId) {
            return false;
        }

        const searchLower = search.toLowerCase();
        const tagMatch = opt.ear_tag ? String(opt.ear_tag).toLowerCase().includes(searchLower) : false;
        const nameMatch = opt.animal_name ? String(opt.animal_name).toLowerCase().includes(searchLower) : false;
        return tagMatch || nameMatch;
    });

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-8 py-6">
                    <h2 className="text-xl font-black text-[#1a1a2e]">Set {role}</h2>
                    <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100 transition-colors">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-8 py-8 flex flex-col items-center">
                    <div className="w-full mb-6">
                        <label className="text-[11px] font-bold text-[#22a06b] mb-1 block uppercase tracking-wider">
                            {parentLabel} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select 
                                value={selectedId}
                                onChange={(e) => setSelectedId(e.target.value)}
                                className="w-full h-14 appearance-none rounded-xl border border-gray-200 bg-white px-5 pr-10 text-[15px] font-bold text-[#1a1a2e] outline-none focus:border-[#22a06b] focus:ring-1 focus:ring-[#22a06b] transition-all"
                            >
                                <option value="">{fetching ? 'Loading...' : `Select ${parentTerm}`}</option>
                                {filteredOptions.map(opt => (
                                    <option key={opt.id || opt._id} value={opt.id || opt._id}>
                                        {opt.ear_tag} {opt.animal_name ? `- ${opt.animal_name}` : ''}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m6 9 6 6 6-6"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="mb-10 text-center">
                        <img 
                            src={pedigreeIllustration}
                            alt="Cattle Pedigree" 
                            className="mx-auto h-32 w-auto object-contain mb-4"
                        />
                        <p className="text-[13px] font-medium text-gray-500 max-w-[280px]">
                            Select the biological {parentTerm} of this animal from the above dropdown
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex w-full gap-3 mt-4">
                        <button 
                            onClick={onClose}
                            className="flex-1 h-12 rounded-full border border-gray-200 text-[14px] font-bold text-gray-500 hover:bg-gray-50 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={!selectedId || loading}
                            className="flex-1 h-12 rounded-full bg-[#1a1a2e] text-[14px] font-bold text-white shadow-lg shadow-[#1a1a2e]/20 hover:bg-black disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            {loading ? "Saving..." : <><Save size={16}/> Save</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
