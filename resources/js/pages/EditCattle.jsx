import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react';
import Loader from '../components/Loader';

const FloatingLabel = ({ label, required }) => (
    <label className="absolute -top-3 left-3 bg-[#F8FAFD] px-1 text-[13px] font-bold text-[#059669] z-10 transition-colors">
        {label} {required && <span className="text-red-500 font-bold">*</span>}
    </label>
);

const FormInput = ({ label, required, placeholder, value, onChange, icon, helperLink, type = "text", error }) => (
    <div className="relative w-full">
        <FloatingLabel label={label} required={required} />
        <div className={`flex h-[48px] items-center rounded-lg border bg-transparent px-4 transition-colors shadow-sm ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-[#80888F] focus-within:ring-1 focus-within:ring-[#059669] focus-within:border-[#059669]'}`}>
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
                className={`flex h-[48px] cursor-pointer items-center justify-between rounded-lg border bg-transparent px-4 shadow-sm transition-all ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-[#80888F]'} ${isOpen ? 'ring-1 ring-[#059669] border-[#059669]' : ''}`}
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

const PillToggleGroup = ({ label, required, options, value, onChange }) => (
    <div className="space-y-4">
        <label className="text-[17px] font-bold text-[#059669]">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex flex-wrap gap-2">
            {options.map((opt) => (
                <button
                    key={opt}
                    type="button"
                    onClick={() => onChange(opt)}
                    className={`rounded-full border px-6 py-2 text-[14px] font-bold transition-all ${value === opt
                            ? 'border-transparent bg-[#E9EEF6] text-[#1a1a2e] shadow-sm'
                            : 'border-[#80888F] bg-white text-gray-700 hover:border-gray-500'
                        }`}
                >
                    {value === opt && <span className="mr-1.5 opacity-60">✓</span>}
                    {opt}
                </button>
            ))}
        </div>
    </div>
);

const DateIcon = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M8 2v4M16 2v4M3 10h18" />
    </svg>
);

export default function EditCattle() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { pathname } = useLocation();
    const [lookupData, setLookupData] = useState({ breeds: [], locations: [], groups: [], sires: [], dams: [] });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        ear_tag: '',
        cattle_name: '',
        cattle_brand_name: '',
        electronic_id: '',
        ear_tag_color: 'bg-white',
        status: 'Active',
        type: 'Cow',
        breeding_status: 'Exposed',
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
            setLookupData({
                breeds: [{id: 1, name: 'American Lineback'}, ...res.data.breeds || []],
                locations: [{id: 1, name: 'erewr - FarmGround'}, ...res.data.locations || []],
                groups: [{id: 1, name: "Arsh's Group"}, ...res.data.groups || []],
                sires: [{id: 1, name: 'tr546546466464 - N/A'}, ...res.data.sires || []],
                dams: res.data.dams || []
            });
            // Mock prefill
            setFormData(prev => ({
                ...prev,
                ear_tag: '453534534',
                cattle_name: 'arsh',
                cattle_brand_name: 'dfsf',
                electronic_id: 'dsdfddfgddfdg',
                ear_tag_color: 'bg-red-800',
                status: 'Active',
                type: 'Cow',
                breeding_status: 'Exposed',
                breed_id: 1,
                location_id: 1,
                group_id: 1,
                ownership: 'Purchased',
                sire_id: 1,
            }));
        }).catch(err => console.log(err));
    }, [id]);

    const handleSave = async () => {
        setIsSubmitting(true);
        // Simulation
        setTimeout(() => {
            alert('Cattle updated successfully!');
            navigate(-1);
            setIsSubmitting(false);
        }, 800);
    };

    const colors = [
        'bg-white', 'bg-black', 'bg-blue-600', 'bg-green-600', 'bg-red-800',
        'bg-pink-300', 'bg-purple-700', 'bg-red-500', 'bg-yellow-400', 'bg-orange-500'
    ];

    return (
        <div className="relative w-full h-full overflow-auto bg-[#F8FAFD] p-4 sm:p-8">
            <div className="mx-auto w-full max-w-[1200px] space-y-8 pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-6 gap-4">
                    <div className="space-y-1 max-w-3xl">
                        <button 
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-2xl font-black text-[#059669] hover:opacity-80 transition-opacity"
                        >
                            <ChevronLeft size={24} strokeWidth={3} />
                            Edit Cattle
                        </button>
                        <p className="text-[15px] font-medium text-[#1a1a2e] leading-relaxed max-w-2xl">
                            Add relevant information about your animal in the specified fields below. Click on "Update" once you are done to update the animals information.
                        </p>
                    </div>
                    <div className="flex gap-3 mt-4 md:mt-0">
                        <button
                            onClick={() => navigate(-1)}
                            disabled={isSubmitting}
                            className="rounded-full bg-gray-100 px-8 py-2 text-sm font-bold text-[#1a1a2e] hover:bg-gray-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSubmitting}
                            className="rounded-full bg-[#1a1a2e] px-10 py-2 text-sm font-bold text-white shadow-lg hover:bg-black transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-10">
                    {/* Form Section 1: Basic Info */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormInput label="Ear Tag" required placeholder="Enter ear tag" value={formData.ear_tag} onChange={(e) => setFormData({ ...formData, ear_tag: e.target.value })} error={errors.ear_tag} />
                            <FormInput label="Cattle Name" placeholder="Enter cattle name" value={formData.cattle_name} onChange={(e) => setFormData({ ...formData, cattle_name: e.target.value })} error={errors.cattle_name} />
                            <FormInput label="Cattle Brand Name" placeholder="Enter brand name" value={formData.cattle_brand_name} onChange={(e) => setFormData({ ...formData, cattle_brand_name: e.target.value })} error={errors.cattle_brand_name} />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start pt-2">
                            <div className="space-y-3">
                                <p className="text-[14px] text-[#1a1a2e]">Update <span className="text-[#059669] underline cursor-pointer">Preferences</span> To edit</p>
                                <FormInput label="Electronic Id" placeholder="Enter electronic id" value={formData.electronic_id} onChange={(e) => setFormData({ ...formData, electronic_id: e.target.value })} icon={<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" /></svg>} error={errors.electronic_id} />
                            </div>
                            <div className="space-y-3">
                                <p className="text-[14px] text-transparent select-none">Spacer</p>
                                <div className="flex flex-col gap-3 mt-1">
                                    <label className="text-[13px] font-bold text-[#059669]">Ear Tag Color</label>
                                    <div className="flex flex-wrap gap-2">
                                        {colors.map((c) => (<ColorSwatch key={c} color={c} isActive={formData.ear_tag_color === c} onClick={() => setFormData({ ...formData, ear_tag_color: c })} />))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Form Section 2: Toggles */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <PillToggleGroup label="Status" required options={['Active', 'Dead', 'Sold', 'Reference']} value={formData.status} onChange={(val) => setFormData({ ...formData, status: val })} />
                            <p className="mt-3 text-[13px] text-[#1a1a2e]">
                                Update status to <span className="text-[#059669] underline cursor-pointer font-medium">Dead Animal Record</span> Or <span className="text-[#059669] underline cursor-pointer font-medium">Sale</span> by performing activity
                            </p>
                        </div>
                        <div>
                            <PillToggleGroup label="Type" required options={['Bull', 'Cow', 'Calf', 'Replacement Heifer', 'Steer']} value={formData.type} onChange={(val) => setFormData({ ...formData, type: val })} />
                        </div>
                        <div>
                            <PillToggleGroup label="Breeding Status" required options={['Open', 'Exposed', 'Pregnant']} value={formData.breeding_status} onChange={(val) => setFormData({ ...formData, breeding_status: val })} />
                            <p className="mt-3 text-[13px] text-[#1a1a2e]">
                                Perform <span className="text-[#059669] underline cursor-pointer font-medium">Pregnancy Check</span> Or <span className="text-[#059669] underline cursor-pointer font-medium">Breeding</span> to update
                            </p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Form Section 3: Location and Breed */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <CustomSelect label="Breed" required placeholder="Select breed" options={lookupData.breeds} value={formData.breed_id} onChange={(e) => setFormData({ ...formData, breed_id: e.target.value })} error={errors.breed_id} />
                        <div>
                            <CustomSelect label="Location" required placeholder="Select location" options={lookupData.locations} value={formData.location_id} onChange={(e) => setFormData({ ...formData, location_id: e.target.value })} error={errors.location_id} />
                            <p className="mt-2 text-[13px] text-[#1a1a2e]">
                                Perform <span className="text-[#059669] underline cursor-pointer font-medium">Location Movement</span> to update
                            </p>
                        </div>
                        <CustomSelect label="Group" placeholder="Select group" options={lookupData.groups} value={formData.group_id} onChange={(e) => setFormData({ ...formData, group_id: e.target.value })} error={errors.group_id} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <PillToggleGroup label="Ownership" options={['Purchased', 'Raised']} value={formData.ownership} onChange={(val) => setFormData({ ...formData, ownership: val })} />
                    </div>

                    <hr className="border-gray-100" />

                    {/* Form Section 4: Birth */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <FormInput label="Birth Date" type="text" placeholder="Pick a date" value={formData.birth_date} onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })} icon={<DateIcon />} />
                        <FormInput label="Birth Weight" placeholder="Enter birth weight" value={formData.birth_weight} onChange={(e) => setFormData({ ...formData, birth_weight: e.target.value })} icon={<span className="text-[12px] font-bold text-[#1a1a2e]">kg</span>} />
                        <PillToggleGroup label="Conception" options={['Natural', 'AI', 'IVF']} value={formData.conception} onChange={(val) => setFormData({ ...formData, conception: val })} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <CustomSelect label="Sire" placeholder="Select sire" options={lookupData.sires} value={formData.sire_id} onChange={(e) => setFormData({ ...formData, sire_id: e.target.value })} />
                        <CustomSelect label="Dam" placeholder="Select dam" options={lookupData.dams} value={formData.dam_id} onChange={(e) => setFormData({ ...formData, dam_id: e.target.value })} />
                    </div>

                    <hr className="border-gray-100" />

                    {/* Form Section 5: Weaning & Yearling */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormInput label="Weaning Date" type="text" placeholder="Pick a date" value={formData.weaning_date} onChange={(e) => setFormData({ ...formData, weaning_date: e.target.value })} icon={<DateIcon />} />
                        <div>
                            <FormInput label="Weaning Weight" placeholder="Enter weaning weight" value={formData.weaning_weight} onChange={(e) => setFormData({ ...formData, weaning_weight: e.target.value })} icon={<span className="text-[12px] font-bold text-[#1a1a2e]">kg</span>} />
                            <p className="mt-2 text-[13px] text-[#1a1a2e]">
                                Perform <span className="text-[#059669] underline cursor-pointer font-medium">Weaning</span> to update
                            </p>
                        </div>
                        <FormInput label="Yearling Date" type="text" placeholder="Pick a date" value={formData.yearling_date} onChange={(e) => setFormData({ ...formData, yearling_date: e.target.value })} icon={<DateIcon />} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <FormInput label="Yearling Weight" placeholder="Enter yearling weight" value={formData.yearling_weight} onChange={(e) => setFormData({ ...formData, yearling_weight: e.target.value })} icon={<span className="text-[12px] font-bold text-[#1a1a2e]">kg</span>} />
                            <p className="mt-2 text-[13px] text-[#1a1a2e]">
                                Perform <span className="text-[#059669] underline cursor-pointer font-medium">Yearling</span> to update
                            </p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Form Section 6: Notes & Attachments */}
                    <div className="space-y-10 pb-2">
                        <div className="relative w-full">
                            <FloatingLabel label="Notes" />
                            <div className="rounded-lg border border-[#80888F] bg-transparent p-3 shadow-sm">
                                <textarea
                                    className="w-full bg-transparent text-[14px] text-[#1a1a2e] outline-none placeholder:text-gray-400"
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
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
