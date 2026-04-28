import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const FloatingInput = ({ label, required, type = 'text', placeholder, value, onChange, suffix }) => (
    <div className="relative flex flex-col gap-1">
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
            {suffix && <span className="ml-2 shrink-0 text-[13px] text-gray-400">{suffix}</span>}
        </div>
    </div>
);

const FloatingSelect = ({ label, required, placeholder, options = [], value, onChange, info }) => (
    <div className="relative flex flex-col gap-1">
        <label className="flex items-center gap-1 text-[11px] font-semibold text-[#059669]">
            {label}{required && <span className="ml-0.5 text-red-400">*</span>}
            {info && (
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-gray-400 text-[9px] text-gray-400">i</span>
            )}
        </label>
        <div className="flex items-center rounded-md border border-[#D1D5DB] bg-white px-3 py-2 focus-within:border-[#059669]">
            <select
                value={value}
                onChange={onChange}
                className="w-full bg-transparent text-[14px] text-[#1a1a2e] outline-none appearance-none cursor-pointer"
            >
                <option value="" disabled>{placeholder}</option>
                {options.map(o => (
                    <option key={o.value || o} value={o.value || o}>{o.label || o}</option>
                ))}
            </select>
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m6 9 6 6 6-6" />
            </svg>
        </div>
    </div>
);

const PillToggle = ({ label, options, value, onChange }) => (
    <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-[#1a1a2e]">{label}</label>
        <div className="flex gap-2">
            {options.map(opt => (
                <button
                    key={opt}
                    type="button"
                    onClick={() => onChange(opt)}
                    className={`rounded-full border px-5 py-1.5 text-[13px] font-semibold transition-all ${
                        value === opt
                            ? 'border-[#059669] bg-[#059669]/10 text-[#059669]'
                            : 'border-gray-300 bg-white text-gray-500 hover:border-gray-400'
                    }`}
                >
                    {opt}
                </button>
            ))}
        </div>
    </div>
);

export default function HealthActivity() {
    const navigate = useNavigate();
    const { animalId } = useParams();

    const [animal, setAnimal] = useState(null);
    const [form, setForm] = useState({
        treatment_date: new Date().toISOString().split('T')[0],
        treatment_name: '',
        medication: '',
        medicine_container: '',
        diagnosis: '',
        dosage: '',
        route: '',
        location: '',
        related_to_udder: 'No',
        administered_by: 'Arsh Chauhan',
        cost: '',
        payment_date: '',
        vendor: 'Default Vendor',
        notes: '',
    });

    useEffect(() => {
        if (!animalId) return;
        fetch(`/api/farm/animals/${animalId}`)
            .then(r => r.ok ? r.json() : null)
            .then(data => setAnimal(data))
            .catch(() => {});
    }, [animalId]);

    const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

    const handleSubmit = () => {
        console.log('Submitting health activity:', { animalId, ...form });
        alert('Activity recorded! (frontend only)');
    };

    return (
        <div className="flex h-full w-full flex-col overflow-hidden bg-[#F4F6F8]">

            {/* Header */}
            <div className="shrink-0 border-b border-gray-200 bg-white px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-1.5 text-[14px] font-bold text-[#059669] hover:opacity-75"
                        >
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                            New treatment
                        </button>
                        {animal && (
                            <div className="mt-1 flex items-center gap-2">
                                <div
                                    className={`h-3 w-3 rounded-full ${animal.ear_tag_color || 'bg-red-500'}`}
                                />
                                <span className="text-[13px] font-bold text-[#1a1a2e]">
                                    {animal.ear_tag || animalId}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="rounded-full border border-gray-300 bg-white px-6 py-2 text-[13px] font-semibold text-gray-600 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="rounded-full bg-[#1a1a2e] px-6 py-2 text-[13px] font-semibold text-white hover:bg-black"
                        >
                            Perform Activity
                        </button>
                    </div>
                </div>
            </div>

            {/* Form Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

                {/* Section 1 — Treatment Details */}
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <div className="grid grid-cols-3 gap-4">
                        <FloatingInput
                            label="Treatment Date" required
                            type="date"
                            value={form.treatment_date}
                            onChange={set('treatment_date')}
                        />
                        <FloatingInput
                            label="Treatment Name" required
                            placeholder="Treatment Name"
                            value={form.treatment_name}
                            onChange={set('treatment_name')}
                        />
                        <FloatingSelect
                            label="Medication"
                            placeholder="Medication"
                            options={['Antibiotic', 'Anti-inflammatory', 'Vaccine', 'Vitamin', 'Other']}
                            value={form.medication}
                            onChange={set('medication')}
                        />
                        <FloatingSelect
                            label="Medicine Container"
                            placeholder="Medicine Container"
                            options={['Syringe', 'Oral', 'Topical', 'IV Drip']}
                            value={form.medicine_container}
                            onChange={set('medicine_container')}
                        />
                        <FloatingSelect
                            label="Diagnosis"
                            placeholder="Diagnosis"
                            options={['Mastitis', 'Pneumonia', 'Foot Rot', 'Bloat', 'Other']}
                            value={form.diagnosis}
                            onChange={set('diagnosis')}
                        />
                        <FloatingInput
                            label="Dosage"
                            placeholder="Dosage"
                            value={form.dosage}
                            onChange={set('dosage')}
                        />
                        <FloatingSelect
                            label="Route"
                            placeholder="Route"
                            options={['Intramuscular', 'Intravenous', 'Subcutaneous', 'Oral', 'Topical']}
                            value={form.route}
                            onChange={set('route')}
                        />
                        <FloatingSelect
                            label="Location" info
                            placeholder="Location"
                            options={['Barn', 'Pasture', 'Quarantine', 'Clinic']}
                            value={form.location}
                            onChange={set('location')}
                        />
                        <div className="flex items-end pb-1">
                            <PillToggle
                                label="Related To Udder"
                                options={['Yes', 'No']}
                                value={form.related_to_udder}
                                onChange={v => setForm(f => ({ ...f, related_to_udder: v }))}
                            />
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-4">
                        <FloatingSelect
                            label="Administered By"
                            placeholder="Administered By"
                            options={['Arsh Chauhan', 'Farm Vet', 'Farm Worker']}
                            value={form.administered_by}
                            onChange={set('administered_by')}
                        />
                    </div>
                </div>

                {/* Section 2 — Cost & Payment */}
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <div className="grid grid-cols-3 gap-4">
                        <FloatingInput
                            label="Cost" info
                            placeholder="cost"
                            type="number"
                            value={form.cost}
                            onChange={set('cost')}
                            suffix="$"
                        />
                        <FloatingInput
                            label="Payment Date"
                            type="date"
                            placeholder="Select Date"
                            value={form.payment_date}
                            onChange={set('payment_date')}
                        />
                        <FloatingSelect
                            label="Vendor"
                            placeholder="Select Vendor"
                            options={['Default Vendor', 'Farm Supply Co.', 'Vet Clinic', 'Online Store']}
                            value={form.vendor}
                            onChange={set('vendor')}
                        />
                    </div>
                </div>

                {/* Section 3 — Notes */}
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold text-[#059669]">Notes</label>
                        <textarea
                            rows={4}
                            placeholder="Enter any additional notes..."
                            value={form.notes}
                            onChange={set('notes')}
                            className="w-full rounded-md border border-[#D1D5DB] bg-white px-3 py-2 text-[14px] text-[#1a1a2e] outline-none placeholder:text-gray-400 focus:border-[#059669] focus:ring-1 focus:ring-[#059669]"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
