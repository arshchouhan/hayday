import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/* ══════════════════════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════════════════════ */
const STYLES = `
  @keyframes modalIn {
    from { opacity:0; transform:scale(0.92) translateY(12px); }
    to   { opacity:1; transform:scale(1)    translateY(0);    }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
  @keyframes fadeSlideIn {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  .modal-card   { animation: modalIn     0.18s ease-out both; }
  .shimmer-bar  {
    background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
    background-size: 400px 100%;
    animation: shimmer 1.4s infinite linear;
    border-radius: 6px;
  }
`;

/* ══════════════════════════════════════════════════════════════════
   TREATMENT OPTIONS → query param key mapping
══════════════════════════════════════════════════════════════════ */
const TREATMENTS = [
    { label: 'Record Heat',             key: 'record-heat'      },
    { label: 'Pregnancy Check',         key: 'pregnancy-check'  },
    { label: 'Breeding Soundness Exam', key: 'bse'              },
    { label: 'Observation',             key: 'observation'      },
];

/* ══════════════════════════════════════════════════════════════════
   FIELD COMPONENTS
══════════════════════════════════════════════════════════════════ */
const FloatingInput = ({ label, required, type = 'text', placeholder, value, onChange }) => (
    <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold text-[#059669]">
            {label}{required && <span className="ml-0.5 text-red-400">*</span>}
        </label>
        <div className="flex items-center rounded-md border border-[#D1D5DB] bg-white px-3 py-2 focus-within:border-[#059669] focus-within:ring-1 focus-within:ring-[#059669]">
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full bg-transparent text-[14px] text-[#1a1a2e] outline-none placeholder:text-gray-400"
            />
        </div>
    </div>
);

const FloatingSelect = ({ label, required, placeholder, options = [], value, onChange }) => (
    <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold text-[#059669]">
            {label}{required && <span className="ml-0.5 text-red-400">*</span>}
        </label>
        <div className="flex items-center rounded-md border border-[#D1D5DB] bg-white px-3 py-2 focus-within:border-[#059669]">
            <select
                value={value}
                onChange={onChange}
                className="w-full bg-transparent text-[14px] text-[#1a1a2e] outline-none appearance-none cursor-pointer"
            >
                <option value="" disabled>{placeholder}</option>
                {options.map(o => (
                    <option key={o.key} value={o.key}>{o.label}</option>
                ))}
            </select>
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m6 9 6 6 6-6" />
            </svg>
        </div>
    </div>
);

/* ══════════════════════════════════════════════════════════════════
   IDLE ILLUSTRATION
══════════════════════════════════════════════════════════════════ */
function IdlePrompt() {
    return (
        <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed border-gray-200 bg-white/70 px-8 py-16 text-center">
            {/* Illustration */}
            <svg viewBox="0 0 120 100" className="h-28 w-28 opacity-80" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* clipboard body */}
                <rect x="20" y="14" width="80" height="76" rx="8" fill="#E9F7F1" stroke="#059669" strokeWidth="2.5"/>
                {/* clip */}
                <rect x="42" y="8" width="36" height="14" rx="5" fill="white" stroke="#059669" strokeWidth="2"/>
                {/* lines */}
                <rect x="34" y="36" width="52" height="5" rx="2.5" fill="#059669" opacity="0.25"/>
                <rect x="34" y="48" width="40" height="5" rx="2.5" fill="#059669" opacity="0.18"/>
                <rect x="34" y="60" width="46" height="5" rx="2.5" fill="#059669" opacity="0.18"/>
                <rect x="34" y="72" width="30" height="5" rx="2.5" fill="#059669" opacity="0.12"/>
                {/* sparkle dots */}
                <circle cx="97" cy="24" r="4" fill="#059669" opacity="0.3"/>
                <circle cx="108" cy="14" r="2.5" fill="#059669" opacity="0.2"/>
                <circle cx="104" cy="32" r="2" fill="#059669" opacity="0.15"/>
            </svg>
            <div>
                <p className="text-[15px] font-bold text-[#1a1a2e]">Select a treatment to get started</p>
                <p className="mt-1 text-[13px] text-gray-400">Choose a treatment type above and the form will appear here</p>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════════
   SKELETON  (used only as the brief loader after selection)
══════════════════════════════════════════════════════════════════ */
function SkeletonField() {
    return (
        <div className="flex flex-col gap-2">
            <div className="shimmer-bar h-2.5 w-24" />
            <div className="shimmer-bar h-9 w-full" />
        </div>
    );
}

function SkeletonSection({ count = 6 }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white/70 p-6">
            <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: count }).map((_, i) => <SkeletonField key={i} />)}
            </div>
        </div>
    );
}


/* ══════════════════════════════════════════════════════════════════
   PAGE LOADER  (animal fetch)
══════════════════════════════════════════════════════════════════ */
function PageLoader() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#F4F6F8]">
            <div className="relative h-14 w-14">
                <div className="absolute inset-0 rounded-full border-4 border-[#059669]/20" />
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#059669]" />
            </div>
            <p className="text-[14px] font-semibold text-[#059669]">Loading animal data…</p>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════════
   UNSAVED WARNING MODAL
══════════════════════════════════════════════════════════════════ */
function UnsavedWarningModal({ onDiscard, onKeepEditing }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onKeepEditing} />
            <div className="modal-card relative z-10 mx-4 w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-red-400" />
                <div className="flex flex-col items-center gap-3 px-7 pb-7 pt-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-amber-200 bg-amber-50">
                        <svg viewBox="0 0 24 24" className="h-7 w-7 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    </div>
                    <h2 className="text-[17px] font-bold text-[#1a1a2e]">Unsaved Changes</h2>
                    <p className="text-[13px] leading-relaxed text-gray-500">
                        You have a treatment selected. Going back will <strong className="text-gray-700">discard your progress</strong>.
                    </p>
                    <div className="mt-2 flex w-full flex-col gap-2.5">
                        <button onClick={onDiscard} className="w-full rounded-full bg-red-500 px-6 py-2.5 text-[13px] font-semibold text-white transition hover:bg-red-600 active:scale-95">
                            Discard &amp; Go Back
                        </button>
                        <button onClick={onKeepEditing} className="w-full rounded-full border border-gray-300 bg-white px-6 py-2.5 text-[13px] font-semibold text-gray-700 transition hover:bg-gray-50 active:scale-95">
                            Keep Editing
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN  —  HealthActivity  (selector only)
══════════════════════════════════════════════════════════════════ */
export default function HealthActivity() {
    const navigate        = useNavigate();
    const { animalId }    = useParams();


    const [animal,      setAnimal]      = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [treatment,   setTreatment]   = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [isDirty,     setIsDirty]     = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [treatmentDate, setTreatmentDate] = useState(new Date().toISOString().split('T')[0]);
    const timerRef = useRef(null);

    /* ── Fetch animal ────────────────────────────────────────────── */
    useEffect(() => {
        if (!animalId) { setPageLoading(false); return; }
        fetch(`/api/farm/animals/${animalId}`)
            .then(r => r.ok ? r.json() : null)
            .then(data => { setAnimal(data); setPageLoading(false); })
            .catch(() => setPageLoading(false));
    }, [animalId]);

    /* ── Treatment selection → brief loader → navigate ───────────── */
    const handleTreatmentChange = (e) => {
        const key = e.target.value;
        setTreatment(key);
        setIsDirty(true);
        if (!key) return;

        setFormLoading(true);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setFormLoading(false);
            navigate(
                `/farm/activity/health/${animalId}/${key}?date=${treatmentDate}`,
                { replace: false }
            );
        }, 750);
    };

    /* ── Navigation guard ────────────────────────────────────────── */
    const handleBack = () => {
        if (isDirty || formLoading) { setShowWarning(true); return; }
        navigate(-1);
    };
    const handleDiscard = () => {
        clearTimeout(timerRef.current);
        setShowWarning(false);
        navigate(-1);
    };

    if (pageLoading) return <PageLoader />;

    return (
        <>
            <style>{STYLES}</style>

            {showWarning && (
                <UnsavedWarningModal onDiscard={handleDiscard} onKeepEditing={() => setShowWarning(false)} />
            )}

            <div className="flex h-full w-full flex-col overflow-hidden bg-[#F4F6F8]">

                {/* Header */}
                <div className="shrink-0 border-b border-gray-200 bg-white px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-1.5 text-[14px] font-bold text-[#059669] hover:opacity-75 transition"
                            >
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="m15 18-6-6 6-6" />
                                </svg>
                                New Treatment
                            </button>
                            {animal && (
                                <div className="mt-1 flex items-center gap-2">
                                    <div className={`h-3 w-3 rounded-full ${animal.ear_tag_color || 'bg-red-500'}`} />
                                    <span className="text-[13px] font-bold text-[#1a1a2e]">{animal.ear_tag || animalId}</span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleBack}
                            className="rounded-full border border-gray-300 bg-white px-6 py-2 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

                    {/* ── Step 1: Date + Treatment ── */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                            Step 1 — Select Treatment
                        </p>
                        <div className="grid grid-cols-3 gap-4">
                            <FloatingInput
                                label="Treatment Date" required
                                type="date"
                                value={treatmentDate}
                                onChange={e => { setTreatmentDate(e.target.value); setIsDirty(true); }}
                            />
                            <FloatingSelect
                                label="Treatment Name" required
                                placeholder="Select treatment type…"
                                options={TREATMENTS}
                                value={treatment}
                                onChange={handleTreatmentChange}
                            />
                        </div>
                    </div>

                    {/* ── Step 2 area: skeleton loader → idle illustration ── */}
                    {formLoading ? (
                        <>
                            <SkeletonSection count={6} />
                            <SkeletonSection count={3} />
                        </>
                    ) : (
                        <IdlePrompt />
                    )}

                </div>
            </div>
        </>
    );
}
