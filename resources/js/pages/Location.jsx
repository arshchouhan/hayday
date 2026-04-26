import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Map as MapIcon, List, Info, ChevronDown, ChevronLeft, Check } from 'lucide-react';

const LocationPage = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [view, setView] = useState('list'); // 'list' or 'add'
    const [activeTab, setActiveTab] = useState('Map View');
    const [locationType, setLocationType] = useState('Farm Ground');
    const [ownership, setOwnership] = useState('Owned');

    useEffect(() => {
        if (pathname === '/farm/location/add') {
            setView('add');
        } else if (pathname === '/farm/location/listing') {
            setView('list');
            setActiveTab('Location Listing');
        } else {
            setView('list');
            setActiveTab('Map View');
        }
    }, [pathname]);

    const handleGoToAdd = () => {
        navigate('/farm/location/add');
    };

    const handleGoToList = () => {
        navigate('/farm/location');
    };

    if (view === 'add') {
        return (
            <div className="flex h-full flex-col bg-white overflow-auto">
                {/* Header Section */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleGoToList}
                            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-50 transition-all text-[#1a1a2e]"
                        >
                            <ChevronLeft size={24} strokeWidth={3} />
                        </button>
                        <h1 className="text-[20px] font-black text-[#1a1a2e] tracking-tight">Add Location</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleGoToList}
                            className="rounded-full border border-gray-300 px-8 py-2 text-[14px] font-bold text-gray-700 hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button className="rounded-full bg-[#1a1a2e] px-10 py-2.5 text-[14px] font-black text-white shadow-lg hover:bg-black transition-all">
                            Save
                        </button>
                    </div>
                </div>

                <div className="px-8 pt-4 pb-8">
                    <p className="text-[14px] font-medium text-gray-500 mb-8">
                        Add the details of your location in the form below. Click 'Save' to save the location.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
                        {/* Name Field */}
                        <div className="relative">
                            <label className="absolute -top-3 left-4 bg-white px-2 text-[12px] font-bold text-[#1a1a2e]">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                placeholder="Enter name"
                                className="w-full rounded-xl border border-gray-200 px-5 py-4 text-[14px] font-bold text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#1a1a2e] placeholder:text-gray-300 shadow-sm"
                            />
                        </div>

                        {/* Location Type */}
                        <div className="space-y-4">
                            <label className="text-[13px] font-black text-[#1a1a2e] uppercase tracking-wide">
                                Location Type <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-3">
                                {['Building', 'Farm Ground'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setLocationType(type)}
                                        className={`flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-bold transition-all border ${
                                            locationType === type 
                                            ? 'bg-[#1a1a2e] text-white border-[#1a1a2e] shadow-md' 
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        {locationType === type && <Check size={14} strokeWidth={3} />}
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Farm Ground Type */}
                        <div className="relative">
                            <label className="absolute -top-3 left-4 bg-white px-2 text-[12px] font-bold text-[#1a1a2e]">
                                Farm Ground Type <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center justify-between w-full rounded-xl border border-gray-200 px-5 py-4 text-[14px] font-bold text-[#1a1a2e] cursor-pointer hover:border-gray-300 shadow-sm bg-white">
                                <span>Pasture</span>
                                <ChevronDown size={18} className="text-gray-400" />
                            </div>
                        </div>

                        {/* Water Source */}
                        <div className="relative">
                            <label className="absolute -top-3 left-4 bg-white px-2 text-[12px] font-bold text-[#1a1a2e]">
                                Water Source
                            </label>
                            <div className="flex items-center justify-between w-full rounded-xl border border-gray-200 px-5 py-4 text-[14px] font-bold text-gray-400 cursor-pointer hover:border-gray-300 shadow-sm bg-white">
                                <span>Select water source</span>
                                <ChevronDown size={18} className="text-gray-400" />
                            </div>
                        </div>

                        {/* Total Area */}
                        <div className="relative">
                            <label className="absolute -top-3 left-4 bg-white px-2 text-[12px] font-bold text-[#1a1a2e]">
                                Total Area
                            </label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Enter total area"
                                    className="w-full rounded-xl border border-gray-200 px-5 py-4 text-[14px] font-bold text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#1a1a2e] placeholder:text-gray-300 shadow-sm"
                                />
                                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[13px] font-bold text-gray-500">Acres</span>
                            </div>
                        </div>

                        {/* Ownership */}
                        <div className="space-y-4">
                            <label className="text-[13px] font-black text-[#1a1a2e] uppercase tracking-wide">
                                Ownership <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {['Owned', 'Rented', 'Leased', 'Purchased'].map(option => (
                                    <button
                                        key={option}
                                        onClick={() => setOwnership(option)}
                                        className={`flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-bold transition-all border ${
                                            ownership === option 
                                            ? 'bg-[#1a1a2e] text-white border-[#1a1a2e] shadow-md' 
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        {ownership === option && <Check size={14} strokeWidth={3} />}
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Map Drawing Section */}
                    <div className="mt-16 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[16px] font-black text-[#1a1a2e]">Draw Location on map</h2>
                            <button className="text-[14px] font-bold text-[#1a1a2e] hover:underline">Watch Tutorial</button>
                        </div>
                        <div className="relative h-[400px] w-full rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d13636.5647547515!2d75.772!3d31.22!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4e0"
                                className="absolute inset-0 w-full h-full border-0 grayscale brightness-95 opacity-80"
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                               <div className="bg-[#1a1a2e]/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/10 pointer-events-auto">
                                   <p className="text-[14px] font-bold text-white">Click on map to start drawing</p>
                               </div>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col bg-white">
            {/* Header Section */}
            <div className="flex items-start justify-between px-8 pt-8 pb-6">
                <div className="space-y-1">
                    <h1 className="text-[22px] font-black text-[#1a1a2e] tracking-tight">
                        Location Management<span className="ml-1 text-[#1a1a2e]/60 font-bold">(4)</span>
                    </h1>
                    <p className="text-[14px] font-medium text-gray-500 max-w-2xl leading-relaxed">
                        Click on Location Name to view its details. Click on the "Add Location" button to add new Locations to your Ranch
                    </p>
                </div>
                <button 
                    onClick={handleGoToAdd}
                    className="flex items-center gap-2 rounded-full bg-[#1a1a2e] px-6 py-2.5 text-[14px] font-black text-white shadow-lg hover:bg-black transition-all"
                >
                    <Plus size={18} strokeWidth={3} />
                    Add Location
                </button>
            </div>

            {/* Tab Bar */}
            <div className="flex px-8 border-b border-gray-100">
                {['Map View', 'Location Listing'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => {
                            if (tab === 'Map View') navigate('/farm/location');
                            else navigate('/farm/location/listing');
                        }}
                        className={`relative px-4 py-3 text-[14px] font-bold transition-colors ${
                            activeTab === tab ? 'text-[#1a1a2e]' : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1a1a2e] rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="flex items-center justify-between px-8 py-4 bg-gray-50/50">
                <p className="text-[13px] font-medium text-gray-400 italic">
                    Apply filters or use the search box to find specific Locations
                </p>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-gray-400 whitespace-nowrap">Sort By</span>
                        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 shadow-sm cursor-pointer hover:border-gray-300">
                            <span className="text-[13px] font-bold text-[#1a1a2e]">Last Modified</span>
                            <ChevronDown size={14} className="text-gray-400" />
                        </div>
                    </div>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search Locations"
                            className="w-full rounded-lg border border-gray-200 bg-[#E9EEF6]/50 py-2 pl-10 pr-4 text-[13px] font-bold text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#1a1a2e] placeholder:text-gray-400"
                        />
                    </div>
                    <button className="flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-all">
                        <Filter size={18} className="text-[#1a1a2e]" />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0 p-6 bg-gray-50/30 overflow-hidden">
                {activeTab === 'Map View' ? (
                    <div className="relative h-full w-full rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d13636.5647547515!2d75.772!3d31.22!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4e0"
                            className="absolute inset-0 w-full h-full border-0 grayscale brightness-95 opacity-80"
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                        
                        {/* Interactive UI Overlays remain clickable */}
                        <div className="absolute inset-0 pointer-events-none">
                           {/* Polygon Overlay (Simulated) */}
                           <svg className="absolute inset-0 w-full h-full">
                               <path 
                                   d="M 400 300 L 550 250 L 600 400 L 450 450 Z" 
                                   fill="#3b82f6" 
                                   fillOpacity="0.4" 
                                   stroke="#3b82f6" 
                                   strokeWidth="2" 
                               />
                           </svg>

                           {/* Info Popup */}
                           <div className="absolute top-[280px] left-[420px] w-52 rounded-xl bg-white p-4 shadow-2xl border border-gray-100 pointer-events-auto">
                               <h3 className="text-[15px] font-black text-[#1a1a2e] mb-3">test</h3>
                               <div className="space-y-2">
                                   <div className="flex items-center gap-2">
                                       <div className="flex h-6 w-8 items-center justify-center rounded bg-gray-50 border border-gray-100">
                                           <div className="flex flex-col gap-0.5">
                                               <div className="w-4 h-0.5 bg-gray-300 rounded-full" />
                                               <div className="w-4 h-0.5 bg-gray-300 rounded-full" />
                                               <div className="w-4 h-0.5 bg-gray-300 rounded-full" />
                                           </div>
                                       </div>
                                       <span className="text-[12px] font-bold text-gray-500">Pasture</span>
                                       <div className="flex items-center gap-1 ml-auto bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                                           <span className="text-[10px] font-black text-gray-600">0 kg</span>
                                       </div>
                                   </div>
                                   <div className="flex items-center gap-2">
                                       <div className="flex h-6 w-8 items-center justify-center">
                                           <div className="flex gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                           </div>
                                       </div>
                                       <span className="text-[12px] font-bold text-gray-500">0 Animals</span>
                                   </div>
                                   <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-2">
                                       <div className="flex h-6 w-8 items-center justify-center">
                                           <div className="w-4 h-3 border-2 border-gray-300 rounded-sm" />
                                       </div>
                                       <span className="text-[12px] font-black text-[#1a1a2e]">13,253.153 Acres</span>
                                   </div>
                               </div>
                               <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-r border-b border-gray-100 rotate-45" />
                           </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-white border border-gray-200 shadow-sm text-center p-12">
                        <List className="text-[#1a1a2e] mb-4 opacity-20" size={64} />
                        <h3 className="text-xl font-bold text-[#1a1a2e]">Location Listing</h3>
                        <p className="text-gray-500 mt-2">Browse your farm locations in a table view.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LocationPage;
