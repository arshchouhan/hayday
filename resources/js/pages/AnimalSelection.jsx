import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import cowIcon from '../assets/noun-cow-8349503.svg';
import sheepIcon from '../assets/noun-sheep-8349507.svg';

export default function AnimalSelection() {
    const navigate = useNavigate();
    const { activityType } = useParams();
    const [query, setQuery] = useState('');
    const [animals, setAnimals] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    // Fetch all animals once
    useEffect(() => {
        fetch('/api/farm/animals')
            .then(r => r.ok ? r.json() : [])
            .then(data => setAnimals(data))
            .catch(() => {});
        inputRef.current?.focus();
    }, []);

    // Filter on query change
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        setLoading(true);
        const q = query.toLowerCase();
        const filtered = animals.filter(a =>
            a.ear_tag?.toLowerCase().includes(q) ||
            a.animal_name?.toLowerCase().includes(q) ||
            a.type?.toLowerCase().includes(q)
        );
        setResults(filtered);
        setLoading(false);
    }, [query, animals]);

    const isCow = (a) =>
        ['cow', 'cattle', 'bull', 'calf', 'heifer', 'steer'].some(t =>
            a.species?.toLowerCase().includes(t) || a.type?.toLowerCase().includes(t)
        );

    // Each row is 56px tall; 4 rows = 224px — dropdown never shrinks below this
    const ROW_H = 56;
    const MAX_ROWS = 4;
    const DROPDOWN_H = ROW_H * MAX_ROWS;

    const displayed = results; // show all, dropdown scrolls
    const emptySlots = Math.max(0, MAX_ROWS - displayed.length);

    return (
        <div className="flex h-full w-full flex-col items-center bg-[#F8FAFD] pt-24 px-4">

            <div className="w-full max-w-lg">
                {/* Search bar */}
                <div className="flex items-center gap-3 rounded-2xl border border-[#D6E2EE] bg-white px-5 py-3.5 shadow-sm">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search by ear tag or name..."
                        className="w-full bg-transparent text-[15px] font-medium text-[#1a1a2e] placeholder-gray-400 outline-none"
                    />
                    {query && (
                        <button onClick={() => setQuery('')} className="shrink-0 text-gray-400 hover:text-gray-600">
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Dropdown — always rendered, fixed height for 4 rows */}
                <div
                    className={`mt-2 rounded-2xl border border-[#D6E2EE] bg-white shadow-sm ${displayed.length > MAX_ROWS ? 'overflow-y-auto' : 'overflow-hidden'}`}
                    style={{ minHeight: DROPDOWN_H, maxHeight: DROPDOWN_H }}
                >
                    {!query.trim() ? (
                        /* Empty state before typing */
                        <div className="flex h-full items-center justify-center" style={{ height: DROPDOWN_H }}>
                            <p className="text-[13px] text-gray-400">Type to search animals</p>
                        </div>
                    ) : loading ? (
                        <div className="flex items-center justify-center" style={{ height: DROPDOWN_H }}>
                            <p className="text-[13px] text-gray-400">Searching...</p>
                        </div>
                    ) : (
                        <>
                            {displayed.map((animal, i) => (
                                <button
                                    key={animal.id || animal._id || i}
                                    onClick={() => navigate(`/farm/activity/${activityType || 'health'}/${animal.id || animal._id}`)}
                                    className="flex w-full items-center gap-4 border-b border-gray-100 px-5 text-left hover:bg-[#F8FAFD] transition-colors"
                                    style={{ height: ROW_H }}
                                >
                                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ring-black/5 ${animal.ear_tag_color || 'bg-[#E9EEF6]'}`}>
                                        <img src={isCow(animal) ? cowIcon : sheepIcon} className="h-5 w-5 opacity-80" alt="" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[14px] font-bold text-[#1a1a2e]">{animal.ear_tag || '—'}</p>
                                        <p className="truncate text-[12px] text-gray-400">
                                            {animal.animal_name || 'Unnamed'}{animal.type ? ` · ${animal.type}` : ''}
                                        </p>
                                    </div>
                                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="m9 6 6 6-6 6" />
                                    </svg>
                                </button>
                            ))}

                            {/* No results */}
                            {displayed.length === 0 && (
                                <div className="flex items-center border-b border-gray-100 px-5" style={{ height: ROW_H }}>
                                    <p className="text-[13px] text-gray-400">No animals found for "{query}"</p>
                                </div>
                            )}

                            {/* Empty filler rows — keep height locked */}
                            {Array.from({ length: displayed.length === 0 ? emptySlots - 1 : emptySlots }).map((_, i) => (
                                <div key={`empty-${i}`} className="border-b border-gray-100 last:border-b-0" style={{ height: ROW_H }} />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}