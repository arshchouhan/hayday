import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, Calendar, DollarSign, ChevronDown, Upload } from 'lucide-react';

const RestockInventory = () => {
    const navigate = useNavigate();
    const [inventoryType, setInventoryType] = useState('Feed');

    return (
        <div className="flex h-full flex-col bg-[#F8FAFD] rounded-xl overflow-auto p-4 sm:p-6 lg:p-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6 gap-4">
                <div className="space-y-1">
                    <button 
                        onClick={() => navigate('/farm/inventory')}
                        className="flex items-center gap-2 text-[20px] font-black text-[#059669] hover:opacity-80 transition-opacity"
                    >
                        <ChevronLeft size={24} strokeWidth={3} />
                        Restock Inventory
                    </button>
                    <p className="text-[14px] font-medium text-[#1a1a2e] ml-8">
                        Restock inventory items & allocate to containers at different locations.
                    </p>
                </div>
                
                <div className="flex items-center gap-3 md:ml-auto">
                    <button 
                        onClick={() => navigate('/farm/inventory')}
                        className="rounded-full bg-gray-50 border border-gray-200 px-6 py-2.5 text-[14px] font-bold text-[#1a1a2e] hover:bg-gray-100 transition-all"
                    >
                        Cancel
                    </button>
                    <button className="rounded-full bg-[#1a1a2e] px-8 py-2.5 text-[14px] font-black text-white shadow-md hover:bg-black transition-all">
                        Save
                    </button>
                </div>
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm space-y-8">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Inventory Type */}
                    <div className="md:col-span-3">
                        <label className="flex items-center gap-1.5 text-[12px] font-bold text-[#059669] mb-3">
                            Inventory Type <span className="text-red-500">*</span>
                            <Info size={14} className="text-[#059669]" />
                        </label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setInventoryType('Feed')}
                                className={`flex items-center px-6 py-2 rounded-full text-[13px] font-bold transition-all border ${
                                    inventoryType === 'Feed' 
                                        ? 'border-gray-300 text-[#1a1a2e] shadow-sm bg-white' 
                                        : 'border-gray-200 text-gray-500 hover:bg-gray-50 bg-white'
                                }`}
                            >
                                Feed
                            </button>
                            <button
                                onClick={() => setInventoryType('Medicine')}
                                className={`flex items-center px-6 py-2 rounded-full text-[13px] font-bold transition-all border ${
                                    inventoryType === 'Medicine' 
                                        ? 'border-gray-300 text-[#1a1a2e] shadow-sm bg-white' 
                                        : 'border-gray-200 text-gray-500 hover:bg-gray-50 bg-white'
                                }`}
                            >
                                Medicine
                            </button>
                        </div>
                    </div>

                    {/* Purchase Date */}
                    <div className="md:col-span-4 relative mt-2 md:mt-0">
                        <label className="absolute -top-2.5 left-4 z-10 bg-white px-1 flex items-center gap-1 text-[11px] font-bold text-[#059669]">
                            Purchase Date <Info size={12} className="text-[#059669]" />
                        </label>
                        <div className="relative">
                            <input 
                                type="text" 
                                defaultValue="29 Apr, 2026"
                                className="w-full rounded-xl border border-gray-200 px-5 py-3.5 text-[14px] font-bold text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] bg-transparent relative z-0"
                            />
                            <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-0" />
                        </div>
                    </div>

                    {/* Cost */}
                    <div className="md:col-span-5 relative mt-2 md:mt-0">
                        <label className="absolute -top-2.5 left-4 z-10 bg-white px-1 flex items-center gap-1 text-[11px] font-bold text-[#059669]">
                            Cost <Info size={12} className="text-[#059669]" />
                        </label>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Enter cost"
                                className="w-full rounded-xl border border-gray-200 px-5 py-3.5 text-[14px] font-bold text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] placeholder:text-gray-300 bg-transparent relative z-0"
                            />
                            <DollarSign size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1a1a2e] pointer-events-none z-0" strokeWidth={3} />
                        </div>
                    </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* PO Number */}
                    <div className="relative mt-2 md:mt-0">
                        <label className="absolute -top-2.5 left-4 z-10 bg-white px-1 flex items-center gap-1 text-[11px] font-bold text-[#059669]">
                            PO Number <Info size={12} className="text-[#059669]" />
                        </label>
                        <input 
                            type="text" 
                            placeholder="Enter po number"
                            className="w-full rounded-xl border border-gray-200 px-5 py-3.5 text-[14px] font-bold text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] placeholder:text-gray-300 bg-transparent relative z-0"
                        />
                    </div>

                    {/* Supplier */}
                    <div className="relative mt-2 md:mt-0">
                        <label className="absolute -top-2.5 left-4 z-10 bg-white px-1 flex items-center gap-1 text-[11px] font-bold text-[#059669]">
                            Supplier <Info size={12} className="text-[#059669]" />
                        </label>
                        <div className="relative">
                            <select 
                                defaultValue=""
                                className="w-full appearance-none rounded-xl border border-gray-200 px-5 py-3.5 text-[14px] font-bold text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] bg-transparent cursor-pointer relative z-0 text-gray-400"
                            >
                                <option value="" disabled>Select supplier</option>
                                <option value="supplier1" className="text-[#1a1a2e]">Supplier 1</option>
                            </select>
                            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1a1a2e] pointer-events-none z-0" />
                        </div>
                    </div>
                </div>

                {/* Notes */}
                <div className="relative mt-2">
                    <label className="absolute -top-2.5 left-4 z-10 bg-white px-1 text-[11px] font-bold text-[#059669]">
                        Notes
                    </label>
                    <textarea 
                        rows="4"
                        placeholder="Enter notes"
                        className="w-full rounded-xl border border-gray-200 px-5 py-4 text-[14px] font-bold text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] placeholder:text-gray-300 bg-transparent relative z-0 resize-y"
                    />
                </div>

                {/* Attachments */}
                <div className="mt-6">
                    <label className="text-[12px] font-bold text-[#059669] block mb-3">
                        Attachments
                    </label>
                    <div className="w-full rounded-xl border border-dashed border-gray-300 bg-[#F8FAFD] p-10 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                        <h3 className="text-[16px] font-black text-[#1a1a2e] mb-2">Drag and drop file here</h3>
                        <p className="text-[14px] font-medium text-gray-500 mb-4">Or</p>
                        <button className="flex items-center gap-2 rounded-full bg-[#1a1a2e] px-8 py-2.5 text-[13px] font-bold text-white hover:bg-black transition-all">
                            <Upload size={16} strokeWidth={2.5} />
                            Choose File
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestockInventory;
