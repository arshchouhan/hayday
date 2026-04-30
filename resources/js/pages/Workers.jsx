import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Trash2, ArrowDownUp, Loader2 } from 'lucide-react';

const WorkersPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWorkers();
    }, []);

    const fetchWorkers = async () => {
        try {
            const res = await fetch('/api/farm/workers');
            const data = await res.json();
            setWorkers(data);
        } catch (err) {
            console.error("Fetch workers error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this worker?")) return;
        try {
            const res = await fetch(`/api/farm/workers/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchWorkers();
            }
        } catch (err) {
            console.error("Delete worker error:", err);
        }
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const filteredWorkers = workers.filter(w => 
        w.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-full flex-col bg-[#F8FAFD] rounded-xl overflow-auto p-4 sm:p-6 lg:p-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-start justify-between bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6 gap-4">
                <div className="space-y-2">
                    <h1 className="text-[22px] font-black text-[#059669] tracking-tight">
                        Workers <span className="text-gray-400 font-bold ml-1">({workers.length})</span>
                    </h1>
                    <p className="text-[14px] font-medium text-[#1a1a2e] max-w-2xl leading-relaxed">
                        View and Edit the details of all your Workers by clicking on them. Click on the "Add Worker" button to add new Worker to your Ranch.
                    </p>
                </div>
                
                <button 
                    onClick={() => navigate('/farm/workers/add')}
                    className="flex items-center justify-center gap-2 rounded-full bg-[#1a1a2e] px-8 py-3 text-[14px] font-bold text-white shadow-md hover:bg-black transition-all md:ml-auto whitespace-nowrap"
                >
                    <Plus size={18} strokeWidth={3} />
                    Add Worker
                </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-6 gap-4">
                <p className="text-[13px] font-medium text-gray-500 hidden md:block">
                    View and Edit details of all your Workers by clicking on them.
                </p>
                
                <div className="flex items-center gap-4 md:ml-auto w-full md:w-auto justify-between md:justify-end">
                    <div className="flex items-center gap-3">
                        <span className="text-[13px] font-black text-[#1a1a2e] whitespace-nowrap">Sort By</span>
                        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm cursor-pointer hover:border-gray-300">
                            <span className="text-[13px] font-medium text-gray-500">Status</span>
                            <ArrowDownUp size={14} className="text-gray-400" />
                        </div>
                    </div>
                    
                    <div className="relative w-full sm:w-64 flex-shrink-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search Worker by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-[#F4F7FB] py-2 pl-10 pr-4 text-[13px] font-medium text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#1a1a2e] placeholder:text-gray-400"
                        />
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="flex-1 min-h-0">
                {loading ? (
                    <div className="flex h-40 items-center justify-center">
                        <Loader2 className="animate-spin text-[#059669]" size={32} />
                    </div>
                ) : filteredWorkers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-2 bg-white rounded-2xl border border-dashed border-gray-200">
                        <p className="text-[14px] font-bold">No workers registered yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredWorkers.map(worker => (
                            <div 
                                key={worker._id || worker.id} 
                                onClick={() => navigate(`/farm/workers/add?workerId=${worker._id || worker.id}`)}
                                className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F4F7FB] text-[14px] font-bold text-[#1a1a2e]">
                                        {getInitials(worker.name)}
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-[16px] font-black text-[#1a1a2e]">{worker.name}</h3>
                                        <div className="mt-1 flex items-center gap-1.5 rounded-full bg-[#F4F7FB] px-3 py-1 w-fit">
                                            <div className="h-2 w-2 rounded-full bg-[#10B981]"></div>
                                            <span className="text-[11px] font-bold text-[#1a1a2e]">{worker.status || 'Active'}</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={(e) => handleDelete(worker._id || worker.id, e)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                >
                                    <Trash2 size={16} strokeWidth={2} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkersPage;
