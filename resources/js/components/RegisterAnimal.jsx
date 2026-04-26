import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';

const FloatingLabel = ({ label, required }) => (
    <label className="absolute -top-3 left-3 bg-[#F8FAFD] px-1 text-[13px] font-bold text-[#1a1a2e] z-10">
        {label} {required && <span className="text-red-500 font-bold">*</span>}
    </label>
);

const FormInput = ({ label, required, placeholder, value, onChange, icon, helperLink, type = "text", error }) => (
    <div className="relative w-full">
        <FloatingLabel label={label} required={required} />
        <div className={`flex h-[48px] items-center rounded-lg border bg-[#E9EEF6] px-4 transition-colors shadow-sm ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-[#80888F] focus-within:ring-1 focus-within:ring-[#1a1a2e]'}`}>
            <input
                type={type}
                className="w-full bg-transparent text-[15px] font-medium text-[#1a1a2e] outline-none placeholder:text-gray-400"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            {icon && <div className="ml-2 text-gray-500">{icon}</div>}
        </div>
        {error && <p className="mt-1 text-[12px] font-bold text-red-500">{Array.isArray(error) ? error[0] : error}</p>}
        {helperLink && !error && (
            <button type="button" className="mt-1 text-[11px] font-bold text-[#1a1a2e] hover:underline">
                {helperLink}
            </button>
        )}
    </div>
);

const CustomSelect = ({ label, required, placeholder, value, onChange, options = [], error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => (opt.id || opt._id || opt) === value);
    const displayText = selectedOption ? (selectedOption.name || selectedOption.ear_tag || selectedOption) : placeholder;

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <FloatingLabel label={label} required={required} />
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex h-[48px] cursor-pointer items-center justify-between rounded-lg border bg-[#E9EEF6] px-4 shadow-sm transition-all ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-[#80888F]'} ${isOpen ? 'ring-1 ring-[#1a1a2e]' : ''}`}
            >
                <span className={`text-[15px] font-medium ${!selectedOption ? 'text-gray-400' : 'text-[#1a1a2e]'}`}>
                    {displayText}
                </span>
                <svg
                    viewBox="0 0 24 24"
                    className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" strokeWidth="2.5"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </div>
            {error && <p className="mt-1 text-[12px] font-bold text-red-500">{Array.isArray(error) ? error[0] : error}</p>}

            {isOpen && (
                <div className="absolute top-[44px] left-0 z-50 w-full rounded-xl border border-[#80888F] bg-white py-2 shadow-xl animate-in fade-in zoom-in duration-150">
                    <div className="max-h-60 overflow-auto scrollbar-hide">
                        {options.length === 0 ? (
                            <div className="px-4 py-2 text-[13px] text-gray-400 italic">No options available</div>
                        ) : (
                            options.map((opt, i) => {
                                const optId = opt.id || opt._id || opt;
                                const optLabel = opt.name || opt.ear_tag || opt;
                                const isSelected = optId === value;
                                return (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            onChange({ target: { value: optId } });
                                            setIsOpen(false);
                                        }}
                                        className={`cursor-pointer px-4 py-2 text-[13px] transition-colors ${isSelected
                                            ? 'bg-[#D7E3EF] font-bold text-[#1a1a2e]'
                                            : 'text-gray-700 hover:bg-[#F8FAFD] hover:text-[#1a1a2e]'
                                            }`}
                                    >
                                        {optLabel}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const ColorSwatch = ({ color, isActive, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`relative flex h-7 w-7 items-center justify-center rounded-full border border-black/5 transition-transform hover:scale-110 ${color}`}
        style={{ backgroundColor: color.startsWith('#') ? color : undefined }}
    >
        {isActive && (
            <svg viewBox="0 0 24 24" className={`h-4 w-4 ${color === 'bg-white' ? 'text-gray-600' : 'text-white'}`} fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20 6 9 17l-5-5" />
            </svg>
        )}
    </button>
);

const PillToggleGroup = ({ label, required, options, value, onChange, helperText }) => (
    <div className="space-y-4">
        <label className="text-[17px] font-bold text-[#1a1a2e]">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex flex-wrap gap-2">
            {options.map((opt) => (
                <button
                    key={opt}
                    type="button"
                    onClick={() => onChange(opt)}
                    className={`rounded-full border px-8 py-2.5 text-[15px] font-bold transition-all ${value === opt
                            ? 'border-transparent bg-[#D7E3EF] text-[#1a1a2e] shadow-sm'
                            : 'border-[#80888F] bg-white text-gray-700 hover:border-gray-500'
                        }`}
                >
                    {opt}
                </button>
            ))}
        </div>
        {helperText && <p className="pl-1 text-[13px] text-gray-500">{helperText}</p>}
    </div>
);

const DateIcon = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M8 2v4M16 2v4M3 10h18" />
    </svg>
);

export default function RegisterAnimal() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [lookupData, setLookupData] = useState({ breeds: [], locations: [], groups: [], sires: [], dams: [] });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSwitchingModel, setIsSwitchingModel] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        ear_tag: '',
        animal_name: '',
        species: 'Cow',
        electronic_id: '',
        ear_tag_color: 'bg-white',
        status: 'Active',
        type: 'Cow',
        breed_id: '',
        location_id: '',
        group_id: '',
        ownership: 'Purchased',
        birth_date: '',
        birth_weight: '',
        conception: 'Natural',
        sire_id: '',
        dam_id: '',
        weaning_date: '',
        weaning_weight: '',
        yearling_date: '',
        yearling_weight: '',
        notes: ''
    });

    useEffect(() => {
        axios.get('/api/farm/animals/form-data').then(res => {
            setLookupData(res.data);
        });
    }, []);

    // Filter breeds based on selected species
    const filteredBreeds = lookupData.breeds.filter(
        breed => breed.species === formData.species.toLowerCase()
    );

    // Define animal types based on species
    const typeOptions = formData.species === 'Sheep'
        ? ['Ram', 'Ewe', 'Lamb', 'Wether']
        : ['Bull', 'Cow', 'Calf', 'Replacement Heifer', 'Steer'];

    // Handle species change with loader
    const handleSpeciesChange = (newSpecies) => {
        setIsSwitchingModel(true);

        // Simulate "Model Selection" time
        setTimeout(() => {
            const newTypes = newSpecies === 'Sheep'
                ? ['Ram', 'Ewe', 'Lamb', 'Wether']
                : ['Bull', 'Cow', 'Calf', 'Replacement Heifer', 'Steer'];

            setFormData({
                ...formData,
                species: newSpecies,
                type: newTypes[1],
                breed_id: ''
            });
            setIsSwitchingModel(false);
        }, 800);
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        setErrors({});

        // Map values to DB format
        const payload = {
            ...formData,
            status: formData.status ? formData.status.toLowerCase() : null,
            type: formData.type ? formData.type.toLowerCase().replace(' ', '_') : null,
            conception: formData.conception ? formData.conception.toLowerCase() : null,
            ownership: formData.ownership ? formData.ownership.toLowerCase() : null,
            species: formData.species ? formData.species.toLowerCase() : null,
            birth_weight: formData.birth_weight === '' ? null : formData.birth_weight,
            weaning_weight: formData.weaning_weight === '' ? null : formData.weaning_weight,
            yearling_weight: formData.yearling_weight === '' ? null : formData.yearling_weight,
            breed_id: formData.breed_id === '' ? null : formData.breed_id,
            location_id: formData.location_id === '' ? null : formData.location_id,
            group_id: formData.group_id === '' ? null : formData.group_id,
            sire_id: formData.sire_id === '' ? null : formData.sire_id,
            dam_id: formData.dam_id === '' ? null : formData.dam_id,
        };

        try {
            const response = await axios.post('/api/farm/animals', payload);
            if (response.data.success) {
                alert('Animal registered successfully!');
                const root = pathname.startsWith('/farm') ? '/farm' : '/lifecycle';
                navigate(`${root}/details`);
            }
        } catch (err) {
            console.error('Save error:', err);
            if (err.response && err.response.data.errors) {
                setErrors(err.response.data.errors);
            } else {
                const errorMsg = err.response?.data?.message || err.message || 'An error occurred while saving.';
                alert('Error: ' + errorMsg);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const colors = [
        'bg-white', 'bg-black', 'bg-blue-600', 'bg-green-600', 'bg-red-800',
        'bg-pink-300', 'bg-purple-700', 'bg-red-500', 'bg-yellow-400', 'bg-orange-500'
    ];

    return (
        <div className="relative w-full space-y-8 pb-4">
            {/* Model Switch Loader Overlay */}
            {isSwitchingModel && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center rounded-3xl bg-[#F8FAFD]/80 backdrop-blur-[4px] transition-all">
                    <Loader message={`Initializing ${formData.species === 'Cow' ? 'Sheep' : 'Cattle'} Model...`} />
                </div>
            )}

            {/* Header Section */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <div>
                    <h1 className="text-2xl font-black text-[#1a1a2e] tracking-tight">Add Animal</h1>
                    <p className="text-[15px] font-medium text-gray-500">Add the relevant information of the animal.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            const root = pathname.startsWith('/farm') ? '/farm' : '/lifecycle';
                            navigate(`${root}/details`);
                        }}
                        disabled={isSubmitting || isSwitchingModel}
                        className="rounded-full bg-gray-100 px-8 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSubmitting || isSwitchingModel}
                        className="rounded-full bg-[#1a1a2e] px-10 py-2 text-sm font-bold text-white shadow-lg hover:bg-black disabled:opacity-50"
                    >
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            {/* Error Summary */}
            {Object.keys(errors).length > 0 && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                    <p className="font-bold mb-1">Please fix the following errors:</p>
                    <ul className="list-disc pl-5">
                        {Object.values(errors).flat().map((err, i) => <li key={i}>{err}</li>)}
                    </ul>
                </div>
            )}

            {/* Form Section 1: Basic Info */}
            <div className="space-y-8 border-b border-gray-200 pb-10">
                <div className="flex gap-6">
                    <FormInput label="Ear Tag" required placeholder="Enter ear tag" value={formData.ear_tag} onChange={(e) => setFormData({ ...formData, ear_tag: e.target.value })} error={errors.ear_tag} />
                    <FormInput label="Animal Name" placeholder="Enter animal name" value={formData.animal_name} onChange={(e) => setFormData({ ...formData, animal_name: e.target.value })} error={errors.animal_name} />
                    <CustomSelect
                        label="Animal Type"
                        required
                        placeholder="Select species"
                        options={['Cow', 'Sheep']}
                        value={formData.species}
                        onChange={(e) => handleSpeciesChange(e.target.value)}
                        error={errors.species}
                    />
                </div>
                <div className="flex items-start gap-12">
                    <div className="w-1/3">
                        <FormInput label="Electronic Id" placeholder="Enter electronic id" helperLink="Suggest EID" value={formData.electronic_id} onChange={(e) => setFormData({ ...formData, electronic_id: e.target.value })} icon={<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" /></svg>} error={errors.electronic_id} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-[11px] font-bold text-[#1a1a2e]">Ear Tag Color</label>
                        <div className="flex flex-wrap gap-2">
                            {colors.map((c) => (<ColorSwatch key={c} color={c} isActive={formData.ear_tag_color === c} onClick={() => setFormData({ ...formData, ear_tag_color: c })} />))}
                        </div>
                    </div>
                </div>
                <div className="flex gap-16">
                    <PillToggleGroup label="Status" options={['Active', 'Dead', 'Sold', 'Reference']} value={formData.status} onChange={(val) => setFormData({ ...formData, status: val })} helperText="Active animals are part of the herd and you can perform activities on them." />
                    <PillToggleGroup label="Type" options={typeOptions} value={formData.type} onChange={(val) => setFormData({ ...formData, type: val })} />
                </div>
            </div>

            {/* Form Section 2: Breed & Location */}
            <div className="space-y-8 border-b border-gray-200 pb-10">
                <div className="flex gap-6">
                    <CustomSelect label="Breed" placeholder="Select breed" options={filteredBreeds} value={formData.breed_id} onChange={(e) => setFormData({ ...formData, breed_id: e.target.value })} error={errors.breed_id} />
                    <CustomSelect label="Location" placeholder="Select location" options={lookupData.locations} value={formData.location_id} onChange={(e) => setFormData({ ...formData, location_id: e.target.value })} error={errors.location_id} />
                    <CustomSelect label="Group" placeholder="Select group" options={lookupData.groups} value={formData.group_id} onChange={(e) => setFormData({ ...formData, group_id: e.target.value })} error={errors.group_id} />
                </div>
                <div className="flex gap-16">
                    <PillToggleGroup label="Ownership" options={['Purchased', 'Raised']} value={formData.ownership} onChange={(val) => setFormData({ ...formData, ownership: val })} />
                </div>
            </div>

            {/* Form Section 3: Birth & Pedigree */}
            <div className="space-y-8 border-b border-gray-200 pb-10">
                <div className="flex gap-6">
                    <FormInput label="Birth Date" type="date" placeholder="Pick a date" value={formData.birth_date} onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })} icon={<DateIcon />} error={errors.birth_date} />
                    <FormInput label="Birth Weight" placeholder="Enter birth weight" value={formData.birth_weight} onChange={(e) => setFormData({ ...formData, birth_weight: e.target.value })} icon={<span className="text-[12px] font-bold text-gray-500">kg</span>} error={errors.birth_weight} />
                    <div className="w-full">
                        <PillToggleGroup label="Conception" options={['Natural', 'AI', 'IVF']} value={formData.conception} onChange={(val) => setFormData({ ...formData, conception: val })} />
                    </div>
                </div>
                <div className="flex gap-6">
                    <CustomSelect label="Sire" placeholder="Select sire" options={lookupData.sires} value={formData.sire_id} onChange={(e) => setFormData({ ...formData, sire_id: e.target.value })} error={errors.sire_id} />
                    <CustomSelect label="Dam" placeholder="Select dam" options={lookupData.dams} value={formData.dam_id} onChange={(e) => setFormData({ ...formData, dam_id: e.target.value })} error={errors.dam_id} />
                    <div className="w-full"></div>
                </div>
            </div>

            {/* Form Section 4: Weaning & Yearling */}
            <div className="space-y-8 border-b border-gray-200 pb-10">
                <div className="flex gap-6">
                    <FormInput label="Weaning Date" type="date" placeholder="Pick a date" value={formData.weaning_date} onChange={(e) => setFormData({ ...formData, weaning_date: e.target.value })} icon={<DateIcon />} error={errors.weaning_date} />
                    <FormInput label="Weaning Weight" placeholder="Enter weaning weight" value={formData.weaning_weight} onChange={(e) => setFormData({ ...formData, weaning_weight: e.target.value })} icon={<span className="text-[12px] font-bold text-gray-500">kg</span>} error={errors.weaning_weight} />
                    <FormInput label="Yearling Date" type="date" placeholder="Pick a date" value={formData.yearling_date} onChange={(e) => setFormData({ ...formData, yearling_date: e.target.value })} icon={<DateIcon />} error={errors.yearling_date} />
                </div>
                <div className="flex gap-6">
                    <FormInput label="Yearling Weight" placeholder="Enter yearling weight" value={formData.yearling_weight} onChange={(e) => setFormData({ ...formData, yearling_weight: e.target.value })} icon={<span className="text-[12px] font-bold text-gray-500">kg</span>} error={errors.yearling_weight} />
                    <div className="w-full"></div>
                    <div className="w-full"></div>
                </div>
            </div>

            {/* Form Section 5: Notes & Attachments */}
            <div className="space-y-10 pb-2">
                <div className="relative w-full">
                    <FloatingLabel label="Notes" />
                    <div className="rounded-lg border border-[#80888F] bg-[#E9EEF6] p-3 shadow-sm">
                        <textarea
                            className="w-full bg-transparent text-[13px] text-[#1a1a2e] outline-none placeholder:text-gray-400"
                            rows="4"
                            placeholder="Enter notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>
                </div>

                <div className="relative w-full">
                    <FloatingLabel label="Attachments" />
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#80888F] bg-transparent py-12 text-center">
                        <p className="text-[15px] font-bold text-[#1a1a2e]">Drag and drop file here</p>
                        <p className="my-2 text-[13px] text-gray-400">Or</p>
                        <button className="flex items-center gap-2 rounded-full bg-[#1a1a2e] px-8 py-2.5 text-[13px] font-bold text-white transition hover:bg-black shadow-md">
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5 5 5-5m-5 5V3" />
                            </svg>
                            Choose File
                        </button>
                        <div className="mt-4 space-y-1">
                            <p className="text-[11px] text-gray-400">Max 4 files supported, each 5 mb</p>
                            <p className="text-[11px] text-gray-400">Images Only</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
