import React from 'react';
import { Tag } from 'lucide-react';

const PedigreeCard = ({ 
    animal, 
    role, 
    isPlaceholder = false, 
    onAdd = () => {},
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
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-[#22a06b] bg-white p-6 w-64 h-44 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-[#22a06b]">
                        <Tag size={20} />
                    </div>
                    <h2 className="text-xl font-black text-gray-800 tracking-tight">{animal.ear_tag || 'N/A'}</h2>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-[11px] font-bold text-[#22a06b] border border-green-100 uppercase">
                        {animal.species || 'Cattle'}
                    </span>
                    <span className="text-[14px] font-bold text-gray-600">
                        {animal.animal_name || 'Unnamed'}
                    </span>
                </div>
            </div>
        );
    }

    // Normal added relative (Sire/Dam)
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 w-64 h-44 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
                <Tag size={18} className="text-gray-400" />
                <h2 className="text-lg font-bold text-gray-800">{animal.ear_tag || 'N/A'}</h2>
            </div>
            <div className="text-[13px] font-bold text-gray-500 mb-2 uppercase tracking-wide">{role}</div>
            <div className="text-[14px] font-medium text-gray-600">{animal.animal_name || 'Unnamed'}</div>
        </div>
    );
};

export default PedigreeCard;
