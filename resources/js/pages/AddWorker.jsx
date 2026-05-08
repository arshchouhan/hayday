import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Info, ChevronDown, DollarSign, User, Mail, ClipboardList, Loader2 } from 'lucide-react';
import axios from 'axios';

const AddWorker = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const workerId = searchParams.get('workerId');
    const isEditMode = !!workerId;
    const preselectedAnimalId = searchParams.get('animalId')
        || (searchParams.get('animals') || '').split(',').filter(Boolean)[0]
        || '';
    const preselectedGroupId = searchParams.get('groupId') || '';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        animal_id: '',
        group_id: '',
        task: '',
        cost: ''
    });

    const [animals, setAnimals] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(isEditMode);
    const [resourcesLoading, setResourcesLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchResources();
        if (isEditMode) {
            fetchWorkerDetails();
        }
    }, [workerId]);

    useEffect(() => {
        if (isEditMode || !preselectedAnimalId || animals.length === 0) return;

        const normalizedPreselected = String(preselectedAnimalId);
        const matchedAnimal = animals.find((animal) => {
            const ids = [animal?._id, animal?.id]
                .filter(Boolean)
                .map((id) => String(id));
            return ids.includes(normalizedPreselected);
        });

        const matchedId = matchedAnimal?._id || matchedAnimal?.id || preselectedAnimalId;

        setFormData((prev) => ({
            ...prev,
            animal_id: prev.animal_id || String(matchedId),
        }));
    }, [animals, isEditMode, preselectedAnimalId]);

    useEffect(() => {
        if (isEditMode || !preselectedGroupId || groups.length === 0) return;

        const normalizedPreselected = String(preselectedGroupId);
        const matchedGroup = groups.find((group) => {
            const ids = [group?._id, group?.id]
                .filter(Boolean)
                .map((id) => String(id));
            return ids.includes(normalizedPreselected);
        });

        const matchedId = matchedGroup?._id || matchedGroup?.id || preselectedGroupId;

        setFormData((prev) => ({
            ...prev,
            group_id: prev.group_id || String(matchedId),
        }));
    }, [groups, isEditMode, preselectedGroupId]);

    const fetchResources = async () => {
        try {
            const [animalsRes, groupsRes] = await Promise.all([
                axios.get('/api/farm/animals'),
                axios.get('/api/farm/groups')
            ]);
            const animalList = Array.isArray(animalsRes.data) ? animalsRes.data : (animalsRes.data?.data || []);
            const groupList = Array.isArray(groupsRes.data) ? groupsRes.data : (groupsRes.data?.data || []);
            setAnimals(animalList);
            setGroups(groupList);
        } catch (err) {
            console.error("Fetch resources error:", err);
        } finally {
            setResourcesLoading(false);
        }
    };

    const fetchWorkerDetails = async () => {
        try {
            const res = await axios.get(`/api/farm/workers/${workerId}`);
            const data = res.data;
            setFormData({
                name: data.name || '',
                email: data.email || '',
                animal_id: data.animal_id || '',
                group_id: data.group_id || '',
                task: data.task || '',
                cost: data.cost || ''
            });
        } catch (err) {
            console.error("Fetch worker error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.name || !formData.email) {
            alert("Name and Email are required");
            return;
        }
        setSaving(true);
        try {
            const url = isEditMode ? `/api/farm/workers/${workerId}` : '/api/farm/workers';
            if (isEditMode) {
                await axios.put(url, formData);
            } else {
                await axios.post(url, formData);
            }
            navigate('/farm/workers');
        } catch (err) {
            console.error("Save worker error:", err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center bg-[#F8FAFD]">
                <Loader2 className="animate-spin text-[#059669]" size={40} />
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col bg-white rounded-xl overflow-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between px-8 pt-8 pb-6 border-b border-[#D6DEE9]">
                <div className="space-y-1">
                    <button 
                        onClick={() => navigate('/farm/workers')}
                        className="flex items-center gap-2 text-[20px] font-black text-[#0F172A] hover:opacity-80 transition-opacity"
                    >
                        <ChevronLeft size={24} strokeWidth={3} />
                        {isEditMode ? 'Edit Worker' : 'Add Worker'}
                    </button>
                    <p className="text-[14px] font-medium text-gray-500 ml-8 leading-relaxed">
                        {isEditMode ? 'Edit worker assignments and details.' : 'Register a new worker and assign animals, groups, and tasks.'}
                    </p>
                </div>
                
                <div className="flex items-center gap-3 md:ml-auto mt-4 md:mt-0">
                    <button 
                        onClick={() => navigate('/farm/workers')}
                        className="rounded-full bg-white border border-[#80888F]/40 px-6 py-2 text-[14px] font-bold text-[#1a1a2e] hover:bg-gray-50 transition-all active:scale-95"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="rounded-full bg-[#1a1a2e] px-8 py-2 text-[14px] font-black text-white shadow-lg hover:bg-black transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving && <Loader2 className="animate-spin" size={16} />}
                        {isEditMode ? 'Update Worker' : 'Save Worker'}
                    </button>
                </div>
            </div>

            {/* Form Section */}
            <div className="px-8 py-8 space-y-8 max-w-4xl">
                {/* Row 1: Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Name */}
                    <div className="relative">
                        <label className="absolute -top-2.5 left-4 z-10 bg-white px-1 flex items-center gap-1 text-[11px] font-bold text-[#059669]">
                            Worker Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Enter full name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full rounded-xl border border-gray-200 px-5 py-3.5 pl-12 text-[14px] font-bold text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] placeholder:text-gray-300 bg-transparent relative z-0"
                            />
                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-0" />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="relative mt-2 md:mt-0">
                        <label className="absolute -top-2.5 left-4 z-10 bg-white px-1 flex items-center gap-1 text-[11px] font-bold text-[#059669]">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input 
                                type="email" 
                                placeholder="worker@farm.com"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full rounded-xl border border-gray-200 px-5 py-3.5 pl-12 text-[14px] font-bold text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] placeholder:text-gray-300 bg-transparent relative z-0"
                            />
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-0" />
                        </div>
                    </div>
                </div>

                {/* Row 2: Assignments */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Animal Assigned */}
                    <div className="relative mt-2 md:mt-0">
                        <label className="absolute -top-2.5 left-4 z-10 bg-white px-1 flex items-center gap-1 text-[11px] font-bold text-[#059669]">
                            Animal Assigned <Info size={12} className="text-[#059669]" />
                        </label>
                        <div className="relative">
                            <select 
                                value={formData.animal_id}
                                onChange={(e) => setFormData({...formData, animal_id: e.target.value})}
                                disabled={resourcesLoading}
                                className="w-full appearance-none rounded-xl border border-gray-200 px-5 py-3.5 text-[14px] font-bold text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] bg-transparent cursor-pointer relative z-0 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <option value="" disabled>{resourcesLoading ? 'Loading animals...' : 'Select animals...'}</option>
                                <option value="all">All Animals</option>
                                {animals.map(animal => (
                                    <option key={animal._id || animal.id} value={animal._id || animal.id}>
                                        {animal.internal_id || animal.ear_tag} ({animal.type})
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1a1a2e] pointer-events-none z-0" />
                        </div>
                    </div>

                    {/* Group Assigned */}
                    <div className="relative mt-2 md:mt-0">
                        <label className="absolute -top-2.5 left-4 z-10 bg-white px-1 flex items-center gap-1 text-[11px] font-bold text-[#059669]">
                            Group Assigned <Info size={12} className="text-[#059669]" />
                        </label>
                        <div className="relative">
                            <select 
                                value={formData.group_id}
                                onChange={(e) => setFormData({...formData, group_id: e.target.value})}
                                disabled={resourcesLoading}
                                className="w-full appearance-none rounded-xl border border-gray-200 px-5 py-3.5 text-[14px] font-bold text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] bg-transparent cursor-pointer relative z-0 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <option value="" disabled>{resourcesLoading ? 'Loading groups...' : 'Select group...'}</option>
                                {groups.map(group => (
                                    <option key={group._id || group.id} value={group._id || group.id}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1a1a2e] pointer-events-none z-0" />
                        </div>
                    </div>
                </div>

                {/* Row 3: Task & Cost */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Task Assigned */}
                    <div className="relative mt-2 md:mt-0">
                        <label className="absolute -top-2.5 left-4 z-10 bg-white px-1 flex items-center gap-1 text-[11px] font-bold text-[#059669]">
                            Task Assigned
                        </label>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="e.g. Morning Feeding & Milking"
                                value={formData.task}
                                onChange={(e) => setFormData({...formData, task: e.target.value})}
                                className="w-full rounded-xl border border-gray-200 px-5 py-3.5 pl-12 text-[14px] font-bold text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] placeholder:text-gray-300 bg-transparent relative z-0"
                            />
                            <ClipboardList size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-0" />
                        </div>
                    </div>

                    {/* Cost */}
                    <div className="relative mt-2 md:mt-0">
                        <label className="absolute -top-2.5 left-4 z-10 bg-white px-1 flex items-center gap-1 text-[11px] font-bold text-[#059669]">
                            Cost / Wage
                        </label>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Enter cost"
                                value={formData.cost}
                                onChange={(e) => setFormData({...formData, cost: e.target.value})}
                                className="w-full rounded-xl border border-gray-200 px-5 py-3.5 pl-12 text-[14px] font-bold text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] placeholder:text-gray-300 bg-transparent relative z-0"
                            />
                            <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-0" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddWorker;
