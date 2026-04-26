import React, { useState, useEffect } from 'react';
import PedigreeTree from '../components/PedigreeTree';
import Loader from '../components/Loader';
import { Search, Info } from 'lucide-react';

export default function Pedigree() {
    const [searchQuery, setSearchQuery] = useState('');
    const [animals, setAnimals] = useState([]);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // Initial load - maybe fetch some animals to choose from
    useEffect(() => {
        setLoading(true);
        fetch('/api/animals')
            .then(res => res.json())
            .then(data => {
                setAnimals(data);
                // Auto-select the first one for demonstration if available
                if (data.length > 0 && !selectedAnimal) {
                    fetchAnimalDetails(data[0].id || data[0]._id);
                } else {
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error("Error fetching animals:", err);
                setLoading(false);
            });
    }, []);

    const fetchAnimalDetails = async (id) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/animals/${id}`);
            const data = await res.json();
            setSelectedAnimal(data);
            setIsSearching(false);
        } catch (err) {
            console.error("Error fetching animal details:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredResults = searchQuery.length > 1 
        ? animals.filter(a => 
            a.ear_tag?.toLowerCase().includes(searchQuery.toLowerCase()) || 
            a.animal_name?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [];

    if (loading && !selectedAnimal) {
        return <Loader message="Loading pedigree records..." />;
    }

    return (
        <div className="flex h-full flex-col overflow-hidden">
            {/* Header / Search Bar */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-8 py-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-black text-[#1a1a2e] tracking-tight">Pedigree <span className="text-gray-300 font-medium">| Lineage Tree</span></h1>
                    {selectedAnimal && (
                        <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 border border-blue-100">
                            <span className="text-[12px] font-black text-blue-600 uppercase tracking-wider">Viewing:</span>
                            <span className="text-[13px] font-bold text-[#1a1a2e]">{selectedAnimal.ear_tag} - {selectedAnimal.animal_name}</span>
                        </div>
                    )}
                </div>

                <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search animal by tag or name..."
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIsSearching(true);
                        }}
                    />
                    
                    {/* Search Results Dropdown */}
                    {isSearching && filteredResults.length > 0 && (
                        <div className="absolute top-[calc(100%+8px)] left-0 z-[100] w-full overflow-hidden rounded-2xl border border-gray-100 bg-white py-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
                            {filteredResults.map(animal => (
                                <div 
                                    key={animal.id || animal._id}
                                    onClick={() => {
                                        fetchAnimalDetails(animal.id || animal._id);
                                        setSearchQuery('');
                                    }}
                                    className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                                >
                                    <div>
                                        <div className="text-[14px] font-bold text-[#1a1a2e]">{animal.ear_tag}</div>
                                        <div className="text-[11px] font-medium text-gray-400">{animal.animal_name || 'No Name'}</div>
                                    </div>
                                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 uppercase">{animal.type}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Tree Workspace */}
            <div className="flex-1 min-h-0 bg-[#F8FAFD]">
                {selectedAnimal ? (
                    <PedigreeTree rootAnimal={selectedAnimal} />
                ) : (
                    <div className="flex h-full flex-col items-center justify-center p-12 text-center">
                        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl ring-1 ring-black/5">
                            <Info size={40} className="text-blue-500 opacity-80" />
                        </div>
                        <h2 className="text-2xl font-black text-[#1a1a2e] mb-3">No Animal Selected</h2>
                        <p className="max-w-md text-gray-500 font-medium">
                            Please use the search bar above to select a livestock record and visualize its pedigree tree.
                        </p>
                    </div>
                )}
            </div>

            {/* Loading Overlay for subsequent fetches */}
            {loading && selectedAnimal && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center bg-white/60 backdrop-blur-sm">
                    <Loader message="Fetching lineage details..." />
                </div>
            )}
        </div>
    );
}
