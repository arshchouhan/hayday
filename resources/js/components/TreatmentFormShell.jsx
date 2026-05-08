/**
 * TreatmentFormShell.jsx
 *
 * Shared wrapper for all health treatment sub-forms.
 * Provides: header (back + animal tag + submit), unsaved warning modal,
 * and exported field primitives (FInput, FSelect, FTextarea, Pill, SectionCard, Attachments).
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/* ══════════════════════════════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════════════════════════════ */
export const SHELL_STYLES = `
  @keyframes modalIn {
    from { opacity:0; transform:scale(0.92) translateY(12px); }
    to   { opacity:1; transform:scale(1)    translateY(0);    }
  }
  @keyframes fadeSlideIn {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  .modal-card   { animation: modalIn     0.18s ease-out both; }
  .form-animate { animation: fadeSlideIn 0.28s ease-out both; }
`;

/* ══════════════════════════════════════════════════════════════════
   EXPORTED FIELD PRIMITIVES
══════════════════════════════════════════════════════════════════ */
export const FInput = ({ label, required, type = 'text', placeholder, value, onChange, suffix, info }) => (
    <div className="flex flex-col gap-1">
        <label className="flex items-center gap-1 text-[11px] font-semibold text-[#059669]">
            {label}{required && <span className="ml-0.5 text-red-400">*</span>}
            {info && <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-gray-400 text-[9px] text-gray-400">i</span>}
        </label>
        <div className="flex items-center rounded-md border border-[#D1D5DB] bg-white px-3 py-2 focus-within:border-[#059669] focus-within:ring-1 focus-within:ring-[#059669]">
            <input type={type} placeholder={placeholder} value={value} onChange={onChange}
                className="w-full bg-transparent text-[14px] text-[#1a1a2e] outline-none placeholder:text-gray-400" />
            {suffix && <span className="ml-2 shrink-0 text-[13px] text-gray-400">{suffix}</span>}
        </div>
    </div>
);

export const FSelect = ({ label, required, placeholder, options = [], value, onChange, info }) => {
    const [opts, setOpts] = React.useState([]);
    const mountedRef = React.useRef(true);

    React.useEffect(() => {
        mountedRef.current = true;
        const load = async () => {
            // If options is a keyword, fetch remote list
            if (typeof options === 'string') {
                if (options === 'workers') {
                    try {
                        const res = await fetch('/api/farm/workers');
                        const data = await res.json();
                        if (!mountedRef.current) return;
                        const list = Array.isArray(data) ? data : data?.data ?? [];
                        setOpts(list.map(w => ({ value: w._id || w.id, label: w.name })));
                        return;
                    } catch (e) {
                        // fallthrough to empty
                    }
                }
            }

            // Normalize provided options array
            const normalized = (options || []).map(o => {
                if (typeof o === 'string') return { value: o, label: o };
                if (o && typeof o === 'object') return { value: o.value ?? o.key ?? o.id ?? o, label: o.label ?? o.name ?? String(o) };
                return { value: o, label: String(o) };
            });
            setOpts(normalized);
        };

        void load();

        return () => { mountedRef.current = false; };
    }, [options]);

    return (
        <div className="flex flex-col gap-1">
            <label className="flex items-center gap-1 text-[11px] font-semibold text-[#059669]">
                {label}{required && <span className="ml-0.5 text-red-400">*</span>}
                {info && <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-gray-400 text-[9px] text-gray-400">i</span>}
            </label>
            <div className="flex items-center rounded-md border border-[#D1D5DB] bg-white px-3 py-2 focus-within:border-[#059669]">
                <select value={value} onChange={onChange}
                    className="w-full bg-transparent text-[14px] text-[#1a1a2e] outline-none appearance-none cursor-pointer">
                    <option value="" disabled>{placeholder}</option>
                    {opts.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </div>
        </div>
    );
};

export const FTextarea = ({ label, required, placeholder, value, onChange, rows = 3 }) => (
    <div className="flex flex-col gap-1">
        {label && (
            <label className="text-[11px] font-semibold text-[#059669]">
                {label}{required && <span className="ml-0.5 text-red-400">*</span>}
            </label>
        )}
        <textarea rows={rows} placeholder={placeholder} value={value} onChange={onChange}
            className="w-full resize-none rounded-md border border-[#D1D5DB] bg-white px-3 py-2 text-[14px] text-[#1a1a2e] outline-none placeholder:text-gray-400 focus:border-[#059669] focus:ring-1 focus:ring-[#059669]" />
    </div>
);

export const Pill = ({ label, options, value, onChange }) => (
    <div className="flex flex-col gap-2">
        {label && <label className="text-[11px] font-semibold text-[#1a1a2e]">{label}</label>}
        <div className="flex gap-2 flex-wrap">
            {options.map(opt => (
                <button key={opt} type="button" onClick={() => onChange(opt)}
                    className={`rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-all ${
                        value === opt
                            ? 'border-[#059669] bg-[#059669]/10 text-[#059669]'
                            : 'border-gray-300 bg-white text-gray-500 hover:border-gray-400'
                    }`}>
                    {opt}
                </button>
            ))}
        </div>
    </div>
);

export const SectionCard = ({ title, children }) => (
    <div className="rounded-xl border border-gray-200 bg-white p-6 form-animate">
        {title && (
            <div className="mb-5 flex items-center gap-2">
                <div className="h-5 w-1 rounded-full bg-[#059669]" />
                <span className="text-[13px] font-bold text-[#1a1a2e]">{title}</span>
            </div>
        )}
        {children}
    </div>
);

/* ══════════════════════════════════════════════════════════════════
   ATTACHMENTS  (drag-and-drop + file picker)
══════════════════════════════════════════════════════════════════ */
export function Attachments({ files = [], onFiles }) {
    const inputRef = React.useRef(null);

    const handleDrop = (e) => {
        e.preventDefault();
        onFiles?.(Array.from(e.dataTransfer.files));
    };

    const handleChange = (e) => {
        onFiles?.(Array.from(e.target.files));
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 form-animate">
            <div className="mb-4 flex items-center gap-2">
                <div className="h-5 w-1 rounded-full bg-[#059669]" />
                <span className="text-[13px] font-bold text-[#1a1a2e]">Attachments</span>
            </div>

            {/* Drop zone */}
            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 bg-[#F8FAFD] px-6 py-10 text-center transition hover:border-[#059669]/50 hover:bg-[#F0FBF6]"
            >
                <p className="text-[14px] font-semibold text-[#1a1a2e]">Drag and drop file here</p>
                <p className="text-[13px] text-gray-400">Or</p>

                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex items-center gap-2 rounded-full bg-[#1a1a2e] px-7 py-2.5 text-[13px] font-semibold text-white transition hover:bg-black active:scale-95"
                >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Choose File
                </button>

                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept=".pdf,.xls,.xlsx,.docx,.jpg,.jpeg,.png"
                    onChange={handleChange}
                    className="hidden"
                />

                <div className="mt-1 space-y-0.5">
                    <p className="text-[12px] font-semibold text-[#059669]">Max File size; 5 MB</p>
                    <p className="text-[12px] text-gray-400">
                        File Supported: .pdf, .xls, .xlsx, .docx, .jpg, .jpeg, .png
                    </p>
                </div>
            </div>

            {/* Chosen files list */}
            {files.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                    {files.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-[13px] text-gray-600">
                            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[#059669]" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                            <span className="flex-1 truncate">{f.name}</span>
                            <span className="shrink-0 text-gray-400">{(f.size / 1024).toFixed(0)} KB</span>
                        </li>
                    ))}
                </ul>
            )}
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
                        You have unsaved changes in this form.
                        Going back now will <strong className="text-gray-700">discard all progress</strong>.
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
   SHELL WRAPPER  (default export)
══════════════════════════════════════════════════════════════════ */
export default function TreatmentFormShell({ title, children, isDirty, onSubmit }) {
    const navigate     = useNavigate();
    const { animalId } = useParams();

    const [animal,      setAnimal]      = useState(null);
    const [showWarning, setShowWarning] = useState(false);

    /* fetch animal tag */
    useEffect(() => {
        if (!animalId) return;
        fetch(`/api/farm/animals/${animalId}`)
            .then(r => r.ok ? r.json() : null)
            .then(data => setAnimal(data))
            .catch(() => {});
    }, [animalId]);

    const handleBack = () => {
        if (isDirty) { setShowWarning(true); return; }
        navigate(-1);
    };
    const handleDiscard = () => { setShowWarning(false); navigate(-1); };

    return (
        <>
            <style>{SHELL_STYLES}</style>

            {showWarning && (
                <UnsavedWarningModal onDiscard={handleDiscard} onKeepEditing={() => setShowWarning(false)} />
            )}

            <div className="flex h-full w-full flex-col overflow-hidden bg-[#F4F6F8]">

                {/* ── Header ── */}
                <div className="shrink-0 border-b border-gray-200 bg-white px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <button onClick={handleBack}
                                className="flex items-center gap-1.5 text-[14px] font-bold text-[#059669] hover:opacity-75 transition">
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="m15 18-6-6 6-6" />
                                </svg>
                                {title}
                            </button>
                            {animal && (
                                <div className="mt-1 flex items-center gap-2">
                                    <div className={`h-3 w-3 rounded-full ${animal.ear_tag_color || 'bg-red-500'}`} />
                                    <span className="text-[13px] font-bold text-[#1a1a2e]">{animal.ear_tag || animalId}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={handleBack}
                                className="rounded-full border border-gray-300 bg-white px-6 py-2 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition">
                                Cancel
                            </button>
                            <button onClick={onSubmit}
                                className="rounded-full bg-[#1a1a2e] px-6 py-2 text-[13px] font-semibold text-white hover:bg-black transition">
                                Perform Activity
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                    {children}
                </div>
            </div>
        </>
    );
}
