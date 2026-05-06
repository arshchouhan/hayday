import React from 'react';
import { Tag } from 'lucide-react';

const PedigreeCard = ({
    animal,
    role,
    isPlaceholder = false,
    onAdd = () => { },
    isLocked = false,
    isRoot = false
}) => {
    if (isPlaceholder) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white p-6 text-center w-64 h-44 shadow-sm">
                <h3 className="text-[16px] font-bold text-gray-800 mb-2">{role} is not added</h3>
                <p className="text-[12px] text-gray-500 mb-4 px-2 leading-tight">
                    {isLocked
                        ? "Parent information must be provided first in order to add this pedigree."
                        : "Click to provide pedigree information"
                    }
                </p>
                <button
                    onClick={onAdd}
                    className="text-[13px] font-bold text-[#22a06b] hover:underline"
                >
                    Click here
                </button>
            </div>
        );
    }

    if (isRoot) {
        const animalName = animal.animal_name || animal.cattle_name || animal.name;
        const breedName = typeof animal.breed === 'string' ? animal.breed : animal.breed?.name;
        const locationName = typeof animal.location === 'string' ? animal.location : animal.location?.name;
        const statusText = animal.status ? animal.status.charAt(0).toUpperCase() + animal.status.slice(1) : 'Active';

        return (
            <div className="flex flex-col rounded-xl border-2 border-[#22a06b] bg-white p-4 w-[240px] h-[160px] shadow-md">
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F0FDF4] text-[#22a06b]">
                        <Tag size={15} />
                    </div>
                    <h2 className="text-[18px] font-black text-[#1a1a2e] tracking-tight truncate flex-1">{animal.ear_tag || 'N/A'}</h2>
                </div>
                
                <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-1.5 rounded-lg bg-[#F3F6F9] px-2 py-1">
                            <span className="text-[9px] font-bold text-gray-400 uppercase">Type</span>
                            <span className="text-[11px] font-bold text-[#22a06b] truncate">{animal.species || animal.type || 'Cattle'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg bg-[#F3F6F9] px-2 py-1">
                            <span className="text-[9px] font-bold text-gray-400 uppercase">Name</span>
                            <span className="text-[11px] font-bold text-[#1a1a2e] truncate">{animalName || 'N/A'}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-1.5 rounded-lg bg-[#F3F6F9] px-2 py-1">
                            <span className={`h-1.5 w-1.5 rounded-full ${statusText.toLowerCase() === 'active' ? 'bg-[#22a06b]' : 'bg-red-500'}`}></span>
                            <span className="text-[11px] font-bold text-[#1a1a2e]">{statusText}</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg bg-[#F3F6F9] px-2 py-1">
                            <span className="text-[9px] font-bold text-gray-400 uppercase">Breed</span>
                            <span className="text-[11px] font-bold text-[#1a1a2e] truncate">{breedName || 'N/A'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg bg-[#F3F6F9] px-2 py-1">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Loc</span>
                        <span className="text-[11px] font-bold text-[#1a1a2e] truncate">{locationName || 'N/A'}</span>
                    </div>
                </div>
            </div>
        );
    }

    // Normal added relative (Sire/Dam)
    const animalName = animal.animal_name || animal.cattle_name || animal.name;
    const breedName = typeof animal.breed === 'string' ? animal.breed : animal.breed?.name;
    const locationName = typeof animal.location === 'string' ? animal.location : animal.location?.name;
    const statusText = animal.status ? animal.status.charAt(0).toUpperCase() + animal.status.slice(1) : 'Active';

    return (
        <div className="group flex flex-col rounded-xl border-2 border-[#22a06b] bg-white p-4 w-[240px] h-[160px] shadow-sm hover:shadow-md transition-all relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-[#F3F6F9]">
                    <Tag size={12} className="text-gray-400" />
                </div>
                <h2 className="text-[15px] font-bold text-[#1a1a2e] tracking-tight truncate flex-1">{animal.ear_tag || 'N/A'}</h2>
            </div>
            
            <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5 rounded-lg bg-[#F3F6F9] px-2 py-1">
                        <span className="text-[9px] font-medium text-gray-400 uppercase">{role}</span>
                        <span className="text-[10px] font-bold text-[#1a1a2e] truncate">{animal.type || 'Animal'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg bg-[#F3F6F9] px-2 py-1">
                        <span className="text-[9px] font-medium text-gray-400 uppercase">Name</span>
                        <span className="text-[10px] font-bold text-[#1a1a2e] truncate">{animalName || 'N/A'}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5 rounded-lg bg-[#F3F6F9] px-2 py-1">
                        <span className={`h-1.5 w-1.5 rounded-full ${statusText.toLowerCase() === 'active' ? 'bg-[#22a06b]' : 'bg-red-500'}`}></span>
                        <span className="text-[10px] font-bold text-[#1a1a2e]">{statusText}</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg bg-[#F3F6F9] px-2 py-1">
                        <span className="text-[9px] font-medium text-gray-400 uppercase">Breed</span>
                        <span className="text-[10px] font-bold text-[#1a1a2e] truncate">{breedName || 'N/A'}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-[#F3F6F9] px-2 py-1">
                    <span className="text-[9px] font-medium text-gray-400 uppercase">Loc</span>
                    <span className="text-[10px] font-bold text-[#1a1a2e] truncate">{locationName || 'N/A'}</span>
                </div>
            </div>
            
            {/* Edit overlay */}
            <button 
                onClick={onAdd}
                className="absolute inset-x-0 bottom-0 h-8 bg-gray-50 border-t border-gray-100 flex items-center justify-center text-[10px] font-bold text-[#22a06b] opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-100"
            >
                Edit Ancestor
            </button>
        </div>
    );
};

export default PedigreeCard;
