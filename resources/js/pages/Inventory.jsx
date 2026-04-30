import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutGrid, List, Plus, X, Check, ChevronDown, Loader2 } from 'lucide-react';
import illustration from '../assets/no-enterprises.svg';

const InventoryPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Feed');
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [history, setHistory] = useState([]);

    // Modal State
    const [inventoryType, setInventoryType] = useState('Feed');
    const [newItem, setNewItem] = useState({ name: '', subtype: '', unit: 'kg' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/farm/inventory?type=${activeTab === 'Inventory History' ? 'History' : activeTab}`);
            const data = await res.json();
            if (activeTab === 'Inventory History') {
                setHistory(data);
            } else {
                setItems(data);
            }
        } catch (err) {
            console.error("Fetch inventory error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async () => {
        if (!newItem.name) return;
        setSubmitting(true);
        try {
            const res = await fetch('/api/farm/inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newItem, type: inventoryType })
            });
            if (res.ok) {
                setIsAddModalOpen(false);
                setNewItem({ name: '', subtype: '', unit: 'kg' });
                fetchData();
            }
        } catch (err) {
            console.error("Add item error:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const defaultFeed = [
        { name: 'Hay', type: 'Feed', unit: 'kg' },
        { name: 'Silage', type: 'Feed', unit: 'kg' },
        { name: 'Grain', type: 'Feed', unit: 'kg' },
        { name: 'Grass', type: 'Feed', unit: 'kg' },
        { name: 'Supplements', type: 'Feed', unit: 'kg' }
    ];

    const getDisplayItems = () => {
        if (activeTab !== 'Feed') return items;
        
        // Merge defaults with DB items
        const merged = [...defaultFeed];
        items.forEach(dbItem => {
            const index = merged.findIndex(m => m.name.toLowerCase() === dbItem.name.toLowerCase());
            if (index !== -1) {
                merged[index] = dbItem; // Use DB version if exists
            } else {
                merged.push(dbItem); // Add extra DB items
            }
        });
        return merged;
    };

    const filteredItems = getDisplayItems().filter(i => 
        i.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-full flex-col bg-white rounded-xl relative">
            {/* Header Section */}
            <div className="flex flex-col px-8 pt-8 pb-0">
                <div className="flex items-start justify-between mb-8">
                    <div className="space-y-2">
                        <h1 className="text-[22px] font-black text-[#059669] tracking-tight">
                            Inventory Management
                        </h1>
                        <p className="text-[14px] font-medium text-[#1a1a2e]">
                            Add, Restock, Manage and Track Feed and Medical Supplies.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate('/farm/inventory/restock')}
                            className="rounded-full bg-[#1a1a2e] px-8 py-2.5 text-[14px] font-bold text-white shadow-md hover:bg-black transition-all"
                        >
                            Restock
                        </button>
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="rounded-full bg-[#1a1a2e] px-8 py-2.5 text-[14px] font-bold text-white shadow-md hover:bg-black transition-all"
                        >
                            Add New Inventory Item
                        </button>
                    </div>
                </div>

                {/* Tab Bar */}
                <div className="flex border-b border-gray-100">
                    {['Feed', 'Medicine', 'Inventory History'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`relative px-4 py-3 text-[14px] font-bold transition-colors ${
                                activeTab === tab ? 'text-[#059669]' : 'text-[#1a1a2e] hover:text-gray-600'
                            }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#059669]" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-8 py-4 bg-white border border-gray-200 rounded-xl mx-4 my-4 shadow-sm">
                <p className="text-[14px] font-medium text-[#4b5563]">
                    {activeTab === 'Inventory History' ? 'Viewing full audit log' : 'Choose between Donut Chart view or List view'}
                </p>
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    {activeTab !== 'Inventory History' && (
                        <div className="flex h-10 items-center rounded-lg border border-gray-200 bg-[#F4F7FB] p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`flex h-8 w-10 items-center justify-center rounded-md transition-all ${
                                    viewMode === 'grid' ? 'bg-[#1a1a2e] text-white shadow-sm' : 'text-gray-500 hover:text-[#1a1a2e]'
                                }`}
                            >
                                <LayoutGrid size={16} strokeWidth={2.5} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex h-8 w-10 items-center justify-center rounded-md transition-all ${
                                    viewMode === 'list' ? 'bg-[#1a1a2e] text-white shadow-sm' : 'text-gray-500 hover:text-[#1a1a2e]'
                                }`}
                            >
                                <List size={16} strokeWidth={2.5} />
                            </button>
                        </div>
                    )}
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-[#F4F7FB] py-2 pl-10 pr-4 text-[13px] font-medium text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#1a1a2e] placeholder:text-gray-400"
                        />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0 px-4 pb-6 overflow-auto bg-[#F8FAFD]">
                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="animate-spin text-[#059669]" size={32} />
                    </div>
                ) : activeTab === 'Inventory History' ? (
                    history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-80 text-center bg-white rounded-2xl border border-dashed border-gray-200 mt-4 px-4">
                            <img src={illustration} alt="Empty" className="h-32 w-auto mb-4 opacity-40" />
                            <p className="text-[15px] font-black text-[#1a1a2e]">No History Yet</p>
                            <p className="text-[13px] font-medium text-gray-400 mt-1">Restock your inventory to see purchase records here.</p>
                        </div>
                    ) : (
                        <div className="mt-4 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-white text-[13px] font-black text-[#1a1a2e]">
                                            <th className="px-6 py-5">Item</th>
                                            <th className="px-6 py-5">Restocked Quantity</th>
                                            <th className="px-6 py-5">Cost</th>
                                            <th className="px-6 py-5">Date</th>
                                            <th className="px-6 py-5">Supplier</th>
                                            <th className="px-6 py-5">Purchased By</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map(h => (
                                            <tr key={h._id || h.id} className="border-b border-gray-50 hover:bg-gray-50/50 bg-white">
                                                <td className="px-6 py-5 text-[13px] font-medium">{h.inventory?.name}</td>
                                                <td className="px-6 py-5 text-[13px] font-medium">+{h.quantity_added} {h.inventory?.unit}</td>
                                                <td className="px-6 py-5 text-[13px] font-medium">${h.cost || '0.00'}</td>
                                                <td className="px-6 py-5 text-[13px] font-medium">{new Date(h.purchase_date).toLocaleDateString()}</td>
                                                <td className="px-6 py-5 text-[13px] font-medium">{h.supplier || 'N/A'}</td>
                                                <td className="px-6 py-5 text-[13px] font-medium">{h.purchased_by || 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                ) : filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-80 text-center bg-white rounded-2xl border border-dashed border-gray-200 mt-4 px-4">
                        <img src={illustration} alt="Empty" className="h-40 w-auto mb-4 opacity-60" />
                        <h3 className="text-[18px] font-black text-[#1a1a2e]">Your {activeTab} Inventory is Empty</h3>
                        <p className="text-[14px] font-medium text-gray-500 mt-2 max-w-sm">
                            Click the "Add New Inventory Item" button above to register your first {activeTab.toLowerCase()} item.
                        </p>
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="mt-6 flex items-center gap-2 rounded-full bg-[#1a1a2e] px-8 py-3 text-[14px] font-black text-white shadow-md hover:bg-black transition-all"
                        >
                            <Plus size={18} strokeWidth={3} />
                            Add First Item
                        </button>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                        {filteredItems.map(item => (
                            <div key={item._id || item.id || item.name} className="flex flex-col bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                <h3 className="text-[18px] font-black text-[#1a1a2e] mb-4">{item.name}</h3>
                                
                                <div className="flex flex-wrap gap-2 mb-8">
                                    <div className="rounded-full bg-[#F4F7FB] px-3 py-1.5 text-[11px] font-bold text-[#1a1a2e]">
                                        Stock Level <span className="text-gray-400 mx-1">|</span> {item.quantity || 0} {item.unit}
                                    </div>
                                    <div className="rounded-full bg-[#F4F7FB] px-3 py-1.5 text-[11px] font-bold text-[#1a1a2e]">
                                        Last purchase <span className="text-gray-400 mx-1">|</span> {item.last_purchase_date ? new Date(item.last_purchase_date).toLocaleDateString() : 'N/A'}
                                    </div>
                                    <div className="rounded-full bg-[#F4F7FB] px-3 py-1.5 text-[11px] font-bold text-[#1a1a2e]">
                                        Supplier <span className="text-gray-400 mx-1">|</span> {item.supplier || 'N/A'}
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center flex-1 mt-4">
                                    {item.quantity > 0 ? (
                                        <div className="relative h-24 w-24 flex items-center justify-center">
                                            <div className="absolute inset-0 rounded-full border-[10px] border-[#E9EEF6]"></div>
                                            <div className="absolute inset-0 rounded-full border-[10px] border-[#059669] border-t-transparent border-l-transparent" style={{ transform: 'rotate(45deg)' }}></div>
                                            <span className="text-[14px] font-black text-[#1a1a2e]">100%</span>
                                        </div>
                                    ) : (
                                        <>
                                            <img src={illustration} alt="Illustration" className="h-28 w-auto mb-4 opacity-80" />
                                            <p className="text-[13px] font-medium text-[#1a1a2e] text-center">
                                                Looks like you are out of stock on {item.name}
                                            </p>
                                        </>
                                    )}
                                </div>

                                <button 
                                    onClick={() => navigate('/farm/inventory/restock')}
                                    className="mt-8 flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-2.5 text-[14px] font-bold text-[#1a1a2e] hover:bg-gray-50 transition-all w-40 mx-auto"
                                >
                                    <Plus size={16} strokeWidth={3} />
                                    Restock
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-4 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-white">
                                        <th className="px-6 py-5 text-[13px] font-black text-[#1a1a2e] whitespace-nowrap">{activeTab}</th>
                                        <th className="px-6 py-5 text-[13px] font-black text-[#1a1a2e] whitespace-nowrap">Current Stock</th>
                                        <th className="px-6 py-5 text-[13px] font-black text-[#1a1a2e] whitespace-nowrap">Supplier</th>
                                        <th className="px-6 py-5 text-[13px] font-black text-[#1a1a2e] whitespace-nowrap">Last Purchase</th>
                                        <th className="px-6 py-5 text-[13px] font-black text-[#1a1a2e] whitespace-nowrap">Inventory Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItems.map(item => (
                                        <tr key={item._id || item.id || item.name} className="border-b border-gray-50 hover:bg-gray-50/50 bg-white">
                                            <td className="px-6 py-5 text-[13px] font-medium">{item.name}</td>
                                            <td className="px-6 py-5 text-[13px] font-medium">{item.quantity} {item.unit}</td>
                                            <td className="px-6 py-5 text-[13px] font-medium">{item.supplier || 'N/A'}</td>
                                            <td className="px-6 py-5 text-[13px] font-medium">{item.last_purchase_date ? new Date(item.last_purchase_date).toLocaleDateString() : 'N/A'}</td>
                                            <td className="px-6 py-5">
                                                <button 
                                                    onClick={() => navigate('/farm/inventory/restock')}
                                                    className="text-[13px] font-medium text-[#059669] hover:opacity-80 transition-opacity"
                                                >
                                                    Restock
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Add New Record Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a2e]/40 backdrop-blur-sm px-4">
                    <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between px-6 py-5">
                            <h2 className="text-[20px] font-black text-[#1a1a2e]">Add new record</h2>
                            <button 
                                onClick={() => setIsAddModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} strokeWidth={2.5} />
                            </button>
                        </div>
                        
                        <div className="px-6 pb-8 space-y-6">
                            <div>
                                <label className="text-[13px] font-bold text-[#059669] block mb-3">
                                    Inventory Type <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setInventoryType('Feed')}
                                        className={`flex items-center gap-1.5 px-6 py-2 rounded-full text-[13px] font-bold transition-all border ${
                                            inventoryType === 'Feed' 
                                                ? 'bg-[#059669] border-[#059669] text-white shadow-sm' 
                                                : 'border-gray-200 text-[#1a1a2e] hover:bg-gray-50'
                                        }`}
                                    >
                                        {inventoryType === 'Feed' && <Check size={14} strokeWidth={3} />}
                                        Feed
                                    </button>
                                    <button
                                        onClick={() => setInventoryType('Medicine')}
                                        className={`flex items-center gap-1.5 px-6 py-2 rounded-full text-[13px] font-bold transition-all border ${
                                            inventoryType === 'Medicine' 
                                                ? 'bg-[#059669] border-[#059669] text-white shadow-sm' 
                                                : 'border-gray-200 text-[#1a1a2e] hover:bg-gray-50'
                                        }`}
                                    >
                                        {inventoryType === 'Medicine' && <Check size={14} strokeWidth={3} />}
                                        Medicine
                                    </button>
                                </div>
                            </div>

                            {/* Item Name Field */}
                            <div className="relative">
                                <label className="absolute -top-2.5 left-4 z-10 bg-white px-1 text-[11px] font-bold text-[#059669]">
                                    Item Name <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Item Name (e.g. Hay, Penicillin)"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                                    className="w-full rounded-xl border border-gray-200 px-5 py-3.5 text-[14px] font-bold text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] placeholder:text-gray-300 shadow-sm transition-all bg-transparent relative z-0"
                                />
                            </div>

                            {/* Measurement Unit Field */}
                            <div className="relative">
                                <label className="absolute -top-2.5 left-4 z-10 bg-white px-1 text-[11px] font-bold text-[#059669]">
                                    Measurement Unit
                                </label>
                                <div className="relative">
                                    <select 
                                        value={newItem.unit}
                                        onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                                        className="w-full appearance-none rounded-xl border border-gray-200 px-5 py-3.5 text-[14px] font-bold text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] bg-transparent cursor-pointer transition-all relative z-0"
                                    >
                                        <option value="kg">kg</option>
                                        <option value="lbs">lbs</option>
                                        <option value="units">units</option>
                                        <option value="liters">liters</option>
                                    </select>
                                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-0" />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button 
                                    onClick={handleAddItem}
                                    disabled={submitting || !newItem.name}
                                    className="rounded-full bg-[#1a1a2e] px-10 py-3 text-[14px] font-black text-white shadow-md hover:bg-black transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                    {submitting && <Loader2 className="animate-spin" size={16} />}
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryPage;
