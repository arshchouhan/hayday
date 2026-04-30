import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Search, Save } from 'lucide-react';

export default function AncestorModal({ isOpen, onClose, animal, role, targetAnimalId, onSave }) {
    const [search, setSearch] = useState('');
    const [options, setOptions] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchOptions();
        }
    }, [isOpen]);

    const fetchOptions = async () => {
        try {
            // Fetch potential sires or dams based on role
            const type = role.includes('Sire') ? 'male' : 'female';
            const res = await axios.get(`/api/farm/animals/search?type=${type}`);
            setOptions(res.data);
        } catch (err) {
            console.error("Search error:", err);
        }
    };

    const handleSave = async () => {
        if (!selectedId) return;
        setLoading(true);
        try {
            // Update the target animal's sire or dam
            const field = role.includes('Sire') ? 'sire_id' : 'dam_id';
            await axios.put(`/api/farm/animals/${targetAnimalId}`, {
                [field]: selectedId
            });
            onSave();
            onClose();
        } catch (err) {
            alert("Error saving pedigree: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const filteredOptions = options.filter(opt => 
        opt.ear_tag.toLowerCase().includes(search.toLowerCase()) ||
        (opt.animal_name && opt.animal_name.toLowerCase().includes(search.toLowerCase()))
    );

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
                            {role.includes('Sire') ? 'Sire' : 'Dam'} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select 
                                value={selectedId}
                                onChange={(e) => setSelectedId(e.target.value)}
                                className="w-full h-14 appearance-none rounded-xl border border-gray-200 bg-white px-5 pr-10 text-[15px] font-bold text-[#1a1a2e] outline-none focus:border-[#22a06b] focus:ring-1 focus:ring-[#22a06b] transition-all"
                            >
                                <option value="">Select {role.includes('Sire') ? 'sire' : 'dam'}</option>
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
                            src="https://img.freepik.com/free-vector/cattle-breeding-isometric-composition_1284-25037.jpg?w=826&t=st=1714472859~exp=1714473459~hmac=2b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b" 
                            alt="Cattle Pedigree" 
                            className="mx-auto h-32 w-auto object-contain mb-4"
                        />
                        <p className="text-[13px] font-medium text-gray-500 max-w-[280px]">
                            Select the biological {role.includes('Sire') ? 'father' : 'mother'} of this animal from the above dropdown
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
