import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, Calendar, DollarSign, ChevronDown, Upload, Loader2, Weight } from 'lucide-react';

const RestockInventory = () => {
    const navigate = useNavigate();
    const [inventoryType, setInventoryType] = useState('Feed');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        inventory_id: '',
        quantity_added: '',
        cost: '',
        supplier: '',
        purchase_date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    useEffect(() => {
        fetchItems();
    }, [inventoryType]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/farm/inventory?type=${inventoryType}`);
            const data = await res.json();
            setItems(data);
        } catch (err) {
            console.error("Fetch items error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.inventory_id || !formData.quantity_added) {
            alert("Please select an item and enter quantity");
            return;
        }
        setSaving(true);
        try {
            const res = await fetch('/api/farm/inventory/restock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                navigate('/farm/inventory');
            }
        } catch (err) {
            console.error("Save restock error:", err);
        } finally {
            setSaving(false);
        }
    };

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
                    <button 
                        onClick={handleSave}
                        disabled={saving || loading}
                        className="rounded-full bg-[#1a1a2e] px-8 py-2.5 text-[14px] font-black text-white shadow-md hover:bg-black transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving && <Loader2 className="animate-spin" size={16} />}
                        Save
                    </button>
                </div>
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm space-y-8">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Inventory Type */}
                    <div className="md:col-span-4">
                        <label className="flex items-center gap-1.5 text-[12px] font-bold text-[#059669] mb-3">
                            Inventory Type <span className="text-red-500">*</span>
                            <Info size={14} className="text-[#059669]" />
                        </label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setInventoryType('Feed')}
                                className={`flex items-center px-6 py-2 rounded-full text-[13px] font-bold transition-all border ${
                                    inventoryType === 'Feed' 
                                        ? 'bg-[#1a1a2e] text-white shadow-sm' 
                                        : 'border-gray-200 text-gray-500 hover:bg-gray-50 bg-white'
                                }`}
                            >
                                Feed
                            </button>
                            <button
                                onClick={() => setInventoryType('Medicine')}
                                className={`flex items-center px-6 py-2 rounded-full text-[13px] font-bold transition-all border ${
                                    inventoryType === 'Medicine' 
                                        ? 'bg-[#1a1a2e] text-white shadow-sm' 
                                        : 'border-gray-200 text-gray-500 hover:bg-gray-50 bg-white'
                                }`}
                            >
                                Medicine
                            </button>
                        </div>
                    </div>

                    {/* Item to Restock */}
                    <div className="md:col-span-4 relative mt-2 md:mt-0">
                        <label className="absolute -top-2.5 left-4 z-10 bg-white px-1 flex items-center gap-1 text-[11px] font-bold text-[#059669]">
                            Item to Restock <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select 
                                value={formData.inventory_id}
                                onChange={(e) => setFormData({...formData, inventory_id: e.target.value})}
                                disabled={loading}
                                className="w-full appearance-none rounded-xl border border-gray-200 px-5 py-3.5 text-[14px] font-bold text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] bg-transparent cursor-pointer relative z-0"
                            >
                                <option value="" disabled>{loading ? 'Loading...' : 'Select item'}</option>
                                {items.map(item => (
                                    <option key={item._id || item.id} value={item._id || item.id}>
                                        {item.name} (Current: {item.quantity} {item.unit})
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1a1a2e] pointer-events-none z-0" />
                        </div>
                    </div>

                    {/* Quantity Added */}
                    <div className="md:col-span-4 relative mt-2 md:mt-0">
                        <label className="absolute -top-2.5 left-4 z-10 bg-white px-1 flex items-center gap-1 text-[11px] font-bold text-[#059669]">
                            Quantity Added <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input 
                                type="number" 
                                placeholder="Enter quantity"
                                value={formData.quantity_added}
                                onChange={(e) => setFormData({...formData, quantity_added: e.target.value})}
                                className="w-full rounded-xl border border-gray-200 px-5 py-3.5 text-[14px] font-bold text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] placeholder:text-gray-300 bg-transparent relative z-0"
                            />
                            <Weight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-0" />
                        </div>
                    </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Purchase Date */}
                    <div className="relative mt-2 md:mt-0">
                        <label className="absolute -top-2.5 left-4 z-10 bg-white px-1 flex items-center gap-1 text-[11px] font-bold text-[#059669]">
                            Purchase Date <Calendar size={12} className="text-[#059669]" />
                        </label>
                        <div className="relative">
                            <input 
                                type="date" 
                                value={formData.purchase_date}
                                onChange={(e) => setFormData({...formData, purchase_date: e.target.value})}
                                className="w-full rounded-xl border border-gray-200 px-5 py-3.5 text-[14px] font-bold text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] bg-transparent relative z-0"
                            />
                        </div>
                    </div>

                    {/* Cost */}
                    <div className="relative mt-2 md:mt-0">
                        <label className="absolute -top-2.5 left-4 z-10 bg-white px-1 flex items-center gap-1 text-[11px] font-bold text-[#059669]">
                            Cost <DollarSign size={12} className="text-[#059669]" />
                        </label>
                        <div className="relative">
                            <input 
                                type="number" 
                                placeholder="Enter cost"
                                value={formData.cost}
                                onChange={(e) => setFormData({...formData, cost: e.target.value})}
                                className="w-full rounded-xl border border-gray-200 px-5 py-3.5 text-[14px] font-bold text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] placeholder:text-gray-300 bg-transparent relative z-0"
                            />
                        </div>
                    </div>

                    {/* Supplier */}
                    <div className="relative mt-2 md:mt-0">
                        <label className="absolute -top-2.5 left-4 z-10 bg-white px-1 flex items-center gap-1 text-[11px] font-bold text-[#059669]">
                            Supplier <Info size={12} className="text-[#059669]" />
                        </label>
                        <input 
                            type="text" 
                            placeholder="Enter supplier name"
                            value={formData.supplier}
                            onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                            className="w-full rounded-xl border border-gray-200 px-5 py-3.5 text-[14px] font-bold text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] placeholder:text-gray-300 bg-transparent relative z-0"
                        />
                    </div>
                </div>

                {/* Notes */}
                <div className="relative mt-2">
                    <label className="absolute -top-2.5 left-4 z-10 bg-white px-1 text-[11px] font-bold text-[#059669]">
                        Notes
                    </label>
                    <textarea 
                        rows="3"
                        placeholder="Enter notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        className="w-full rounded-xl border border-gray-200 px-5 py-4 text-[14px] font-bold text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] placeholder:text-gray-300 bg-transparent relative z-0 resize-y"
                    />
                </div>
            </div>
        </div>
    );
};

export default RestockInventory;
