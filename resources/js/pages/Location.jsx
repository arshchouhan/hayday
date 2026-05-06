import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Map as MapIcon, List, Info, ChevronDown, ChevronLeft, Check } from 'lucide-react';
import MapEditor from '../components/MapEditor';
import * as turf from '@turf/turf';

const LocationPage = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [view, setView] = useState('list'); // 'list' or 'add'
    const [activeTab, setActiveTab] = useState('Map View');

    // Form State
    const [form, setForm] = useState({
        name: '',
        type: 'Farm Ground',
        sub_type: 'Pasture',
        area: '',
        ownership: 'Owned',
        water_source: '',
        coordinates: null,
        color: '#3b82f6'
    });

    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [locationCharts, setLocationCharts] = useState({});
    const [locationPeriods, setLocationPeriods] = useState({});

    useEffect(() => {
        fetchLocations();
    }, []);

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

    const fetchLocations = async () => {
        try {
            const res = await fetch('/api/farm/locations');
            const data = await res.json();
            setLocations(data);
            // Initialize periods to 3m for each location
            const periods = {};
            data.forEach(loc => periods[loc.id] = '3m');
            setLocationPeriods(periods);
            // Fetch movement history for each location
            data.forEach(loc => fetchLocationChart(loc.id, '3m'));
        } catch (err) {
            console.error("Fetch locations error:", err);
        }
    };

    const fetchLocationChart = async (locationId, period = '3m') => {
        try {
            const res = await fetch(`/api/farm/locations/${locationId}/movement-history?period=${period}`);
            const data = await res.json();
            if (data.success) {
                setLocationCharts(prev => ({
                    ...prev,
                    [locationId]: data.data || []
                }));
            }
        } catch (err) {
            console.error("Fetch location chart error:", err);
        }
    };

    const handleLocationPeriodChange = (locationId, period) => {
        setLocationPeriods(prev => ({
            ...prev,
            [locationId]: period
        }));
        fetchLocationChart(locationId, period);
    };

    const handleSave = async () => {
        if (!form.name) {
            alert("Please enter a name");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/farm/locations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                alert("Location saved successfully!");
                fetchLocations();
                handleGoToList();
            }
        } catch (err) {
            console.error("Save error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleMapUpdate = (geojson) => {
        setForm(prev => ({ ...prev, coordinates: geojson }));

        // Calculate area using turf if it's a polygon
        if (geojson.features.length > 0) {
            const feature = geojson.features[0];
            if (feature.geometry.type === 'Polygon') {
                const areaSqMeters = turf.area(feature);
                const acres = (areaSqMeters / 4046.86).toFixed(3);
                setForm(prev => ({ ...prev, area: acres }));
            }
        }
    };

    const handleGoToAdd = () => navigate('/farm/location/add');
    const handleGoToList = () => navigate('/farm/location');

    if (view === 'add') {
        return (
            <div className="flex h-full flex-col bg-white overflow-auto">
                {/* Header Section */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50">
                    <div className="flex items-center gap-4">
                        <button onClick={handleGoToList} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-50 transition-all text-[#1a1a2e]">
                            <ChevronLeft size={24} strokeWidth={3} />
                        </button>
                        <h1 className="text-[20px] font-black text-[#1a1a2e] tracking-tight">Add Location</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handleGoToList} className="rounded-full border border-gray-300 px-8 py-2 text-[14px] font-bold text-gray-700 hover:bg-gray-50 transition-all">Cancel</button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="rounded-full bg-[#1a1a2e] px-10 py-2.5 text-[14px] font-black text-white shadow-lg hover:bg-black transition-all disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>

                <div className="px-8 pt-4 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
                        {/* Name Field */}
                        <div className="relative">
                            <label className="absolute -top-3 left-4 bg-white px-2 text-[12px] font-bold text-[#1a1a2e]">Name *</label>
                            <input
                                type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="Enter name"
                                className="w-full rounded-xl border border-gray-200 px-5 py-4 text-[14px] font-bold text-[#1a1a2e] outline-none focus:ring-1 focus:ring-[#1a1a2e] shadow-sm"
                            />
                        </div>

                        {/* Location Type */}
                        <div className="space-y-4">
                            <label className="text-[13px] font-black text-[#1a1a2e] uppercase tracking-wide">Location Type *</label>
                            <div className="flex gap-3">
                                {['Building', 'Farm Ground'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setForm({ ...form, type })}
                                        className={`flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-bold transition-all border ${form.type === type ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]' : 'bg-white text-gray-600 border-gray-200'
                                            }`}
                                    >
                                        {form.type === type && <Check size={14} strokeWidth={3} />}
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Total Area */}
                        <div className="relative">
                            <label className="absolute -top-3 left-4 bg-white px-2 text-[12px] font-bold text-[#1a1a2e]">Total Area</label>
                            <div className="relative">
                                <input
                                    type="text" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })}
                                    placeholder="Calculated from map"
                                    className="w-full rounded-xl border border-gray-200 px-5 py-4 text-[14px] font-bold text-[#1a1a2e] outline-none shadow-sm"
                                />
                                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[13px] font-bold text-gray-500">Acres</span>
                            </div>
                        </div>
                    </div>

                    {/* Map Drawing Section */}
                    <div className="mt-16 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[16px] font-black text-[#1a1a2e]">Draw Location on map</h2>
                            <span className="text-[12px] font-bold text-gray-400 italic">Use the polygon tool on the top left of the map to mark boundaries.</span>
                        </div>
                        <div className="relative h-[500px] w-full rounded-3xl overflow-hidden border-4 border-gray-50 shadow-xl">
                            <MapEditor onUpdate={handleMapUpdate} />
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
                        Location Management<span className="ml-1 text-[#1a1a2e]/60 font-bold">({locations.length})</span>
                    </h1>
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
                        className={`relative px-4 py-3 text-[14px] font-bold transition-colors ${activeTab === tab ? 'text-[#1a1a2e]' : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        {tab}
                        {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1a1a2e] rounded-t-full" />}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0 p-6 bg-gray-50/30 overflow-hidden">
                {activeTab === 'Map View' ? (
                    <div className="relative h-full w-full rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
                        <MapEditor
                            isReadOnly={true}
                            initialData={{
                                type: 'FeatureCollection',
                                features: locations
                                    .filter(l => l.coordinates && l.coordinates.features)
                                    .map(l => ({
                                        ...l.coordinates.features[0],
                                        properties: {
                                            id: l.id,
                                            name: l.name,
                                            type: l.type,
                                            area: l.area,
                                            animals: 0, // Placeholder for now
                                            feed: 0     // Placeholder for now
                                        }
                                    }))
                            }}
                        />

                        {/* Interactive UI Legend */}
                        <div className="absolute bottom-8 left-8 flex gap-4 pointer-events-none">
                            <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl border border-white/20 flex gap-6 pointer-events-auto">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
                                    <span className="text-[12px] font-bold text-gray-600">Pastures</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                                    <span className="text-[12px] font-bold text-gray-600">Buildings</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full overflow-auto p-6">
                        <div className="space-y-8">
                            {locations.map(loc => {
                                const chartData = locationCharts[loc.id] || [];
                                const period = locationPeriods[loc.id] || '3m';
                                const maxCount = Math.max(...chartData.map(m => m.count || 0), 1);
                                const totalMovements = chartData.reduce((sum, bar) => sum + bar.count, 0);
                                
                                return (
                                    <div key={loc.id} className="bg-white rounded-lg border border-[#80888F] p-6 space-y-6">
                                        {/* Header */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-[16px] font-black text-[#1a1a2e]">{loc.name}</h3>
                                                <p className="text-[12px] text-gray-500 mt-1">{loc.type} • {loc.area || '0'} Acres</p>
                                            </div>
                                            <div className="flex items-center rounded-lg border border-[#80888F]/20 bg-[#F8FAFD] p-1 gap-0">
                                                {[
                                                    { label: '3 Months', value: '3m' },
                                                    { label: '6 Months', value: '6m' },
                                                    { label: '12 Months', value: '12m' }
                                                ].map((p) => (
                                                    <button
                                                        key={p.value}
                                                        onClick={() => handleLocationPeriodChange(loc.id, p.value)}
                                                        className={`rounded-md px-4 py-1.5 text-[12px] font-bold transition-all ${period === p.value
                                                                ? 'bg-[#1a1a2e] text-white shadow-sm'
                                                                : 'text-gray-500 hover:text-[#1a1a2e]'
                                                            }`}
                                                    >
                                                        {p.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Chart */}
                                        {chartData.length > 0 ? (
                                            <div className="space-y-4">
                                                {/* Chart Area */}
                                                <div className="flex gap-0">
                                                    {/* Y-Axis Labels */}
                                                    <div className="flex flex-col justify-between pr-4 py-2 text-right shrink-0 w-[50px] h-[var(--chart-height)]" style={{ '--chart-height': '250px' }}>
                                                        <span className="text-[12px] font-semibold text-gray-500">5</span>
                                                        <span className="text-[12px] font-semibold text-gray-500">4</span>
                                                        <span className="text-[12px] font-semibold text-gray-500">3</span>
                                                        <span className="text-[12px] font-semibold text-gray-500">2</span>
                                                        <span className="text-[12px] font-semibold text-gray-500">1</span>
                                                        <span className="text-[12px] font-semibold text-gray-500">0</span>
                                                    </div>

                                                    {/* Bars Area */}
                                                    <div className="flex-1 relative border-l border-b border-gray-300 h-[var(--chart-height)]" style={{ '--chart-height': '250px' }}>
                                                        {/* Horizontal grid lines */}
                                                        {[0, 1, 2, 3, 4].map((i) => (
                                                            <div
                                                                key={i}
                                                                style={{ '--grid-top': `${i * 20}%` }}
                                                                className="absolute left-0 right-0 border-t border-dashed border-gray-200 top-[var(--grid-top)]"
                                                            />
                                                        ))}

                                                        {/* Bars */}
                                                        <div className="absolute inset-0 flex items-end justify-around px-3 pb-0">
                                                            {chartData.map((bar, i) => {
                                                                const barScale = maxCount > 0 ? Math.max(bar.count / maxCount, bar.count > 0 ? 0.08 : 0) : 0;
                                                                const barStyle = { transform: `scaleY(${barScale})`, transformOrigin: 'bottom' };
                                                                return (
                                                                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                                                                        <div
                                                                            className="w-full max-w-[32px] h-[200px] rounded-t bg-[#f5a623] hover:bg-[#e69500] transition-colors cursor-pointer"
                                                                            style={barStyle}
                                                                            title={`${bar.count} animals moved`}
                                                                        />
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* X-Axis Labels */}
                                                <div className="flex gap-0 pl-[50px]">
                                                    <div className="flex-1 flex items-center justify-around">
                                                        {chartData.map((bar, i) => (
                                                            <span key={i} className="text-[12px] font-semibold text-gray-600 flex-1 text-center">{bar.label}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-12 text-center">
                                                <p className="text-[13px] font-bold text-gray-500">No movement data</p>
                                            </div>
                                        )}

                                        {/* Legend */}
                                        <div className="flex items-center gap-8 border-t border-gray-200 pt-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-3 w-3 rounded-full bg-[#f5a623]" />
                                                <span className="text-[13px] font-bold text-[#1a1a2e]">Animals Moved In</span>
                                                <span className="text-[13px] font-bold text-gray-600 ml-2">{totalMovements || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LocationPage;
