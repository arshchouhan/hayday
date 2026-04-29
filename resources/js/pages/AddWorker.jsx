import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Info, ChevronDown, DollarSign, User, Mail, ClipboardList } from 'lucide-react';

const AddWorker = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [name, setName] = useState(searchParams.get('name') || '');
    const [email, setEmail] = useState(searchParams.get('email') || '');
    const isEditMode = searchParams.has('workerId');

    return (
        <div className="flex h-full flex-col bg-[#F8FAFD] rounded-xl overflow-auto p-4 sm:p-6 lg:p-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6 gap-4">
                <div className="space-y-1">
                    <button 
                        onClick={() => navigate('/farm/workers')}
                        className="flex items-center gap-2 text-[20px] font-black text-[#059669] hover:opacity-80 transition-opacity"
                    >
                        <ChevronLeft size={24} strokeWidth={3} />
                        {isEditMode ? 'Edit Worker' : 'Add Worker'}
                    </button>
                    <p className="text-[14px] font-medium text-[#1a1a2e] ml-8">
                        {isEditMode ? 'Edit worker assignments and details.' : 'Register a new worker and assign animals, groups, and tasks.'}
                    </p>
                </div>
                
                <div className="flex items-center gap-3 md:ml-auto">
                    <button 
                        onClick={() => navigate('/farm/workers')}
                        className="rounded-full bg-gray-50 border border-gray-200 px-6 py-2.5 text-[14px] font-bold text-[#1a1a2e] hover:bg-gray-100 transition-all"
                    >
                        Cancel
                    </button>
                    <button className="rounded-full bg-[#1a1a2e] px-8 py-2.5 text-[14px] font-black text-white shadow-md hover:bg-black transition-all">
                        {isEditMode ? 'Update Worker' : 'Save Worker'}
                    </button>
                </div>
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm space-y-8">
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
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                defaultValue=""
                                className="w-full appearance-none rounded-xl border border-gray-200 px-5 py-3.5 text-[14px] font-bold text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] bg-transparent cursor-pointer relative z-0 text-gray-600"
                            >
                                <option value="" disabled>Select animals...</option>
                                <option value="all" className="text-[#1a1a2e]">All Animals</option>
                                <option value="12" className="text-[#1a1a2e]">Tag #12 (Bull)</option>
                                <option value="45" className="text-[#1a1a2e]">Tag #45 (Cow)</option>
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
                                defaultValue=""
                                className="w-full appearance-none rounded-xl border border-gray-200 px-5 py-3.5 text-[14px] font-bold text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] bg-transparent cursor-pointer relative z-0 text-gray-600"
                            >
                                <option value="" disabled>Select group...</option>
                                <option value="dairy" className="text-[#1a1a2e]">Dairy Herd</option>
                                <option value="beef" className="text-[#1a1a2e]">Beef Cattle</option>
                                <option value="calves" className="text-[#1a1a2e]">Weaned Calves</option>
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
