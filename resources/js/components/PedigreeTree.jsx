import React, { useState } from 'react';
import PedigreeCard from './PedigreeCard';
import AncestorModal from './AncestorModal';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

const PedigreeTree = ({ rootAnimal, onRefresh }) => {
    const [zoom, setZoom] = useState(1);
    const [modal, setModal] = useState({ isOpen: false, role: '', targetId: '' });

    const handleZoom = (delta) => {
        setZoom(prev => Math.min(Math.max(0.5, prev + delta), 1.5));
    };

    const resetZoom = () => setZoom(1);

    const openModal = (role, targetId) => {
        setModal({ isOpen: true, role, targetId });
    };

    const sire = rootAnimal?.sire;
    const dam = rootAnimal?.dam;
    
    const gSireSire = sire?.sire;
    const gSireDam = sire?.dam;
    const gDamSire = dam?.sire;
    const gDamDam = dam?.dam;

    return (
        <div className="relative flex h-full flex-col overflow-hidden bg-[#F8FAFD]">
            <AncestorModal 
                isOpen={modal.isOpen} 
                onClose={() => setModal({ ...modal, isOpen: false })}
                role={modal.role}
                targetAnimalId={modal.targetId}
                onSave={onRefresh}
            />

            {/* Toolbar */}
            <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
                <button onClick={() => handleZoom(0.1)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md border border-gray-100 hover:bg-gray-50 transition-all">
                    <ZoomIn size={18} className="text-[#1a1a2e]" />
                </button>
                <button onClick={() => handleZoom(-0.1)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md border border-gray-100 hover:bg-gray-50 transition-all">
                    <ZoomOut size={18} className="text-[#1a1a2e]" />
                </button>
                <button onClick={resetZoom} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md border border-gray-100 hover:bg-gray-50 transition-all">
                    <Maximize2 size={18} className="text-[#1a1a2e]" />
                </button>
            </div>

            {/* Tree Container */}
            <div className="flex-1 overflow-auto p-12 scrollbar-hide flex justify-center items-start">
                <div 
                    className="relative flex flex-col items-center gap-16 transition-transform duration-300 origin-top"
                    style={{ transform: `scale(${zoom})` }}
                >
                    
                    {/* Level 1: Grandparents */}
                    <div className="flex gap-16 relative">
                        {/* Paternal Grandparents Group */}
                        <div className="flex gap-8">
                            <PedigreeCard role="Grand Sire" animal={gSireSire} isPlaceholder={!gSireSire} isLocked={!sire} onAdd={() => openModal(sire ? 'Grand Sire' : 'Sire', sire ? (sire.id || sire._id) : (rootAnimal.id || rootAnimal._id))} />
                            <PedigreeCard role="Grand Dam" animal={gSireDam} isPlaceholder={!gSireDam} isLocked={!sire} onAdd={() => openModal(sire ? 'Grand Dam' : 'Sire', sire ? (sire.id || sire._id) : (rootAnimal.id || rootAnimal._id))} />
                        </div>
                        {/* Maternal Grandparents Group */}
                        <div className="flex gap-8">
                            <PedigreeCard role="Grand Sire" animal={gDamSire} isPlaceholder={!gDamSire} isLocked={!dam} onAdd={() => openModal(dam ? 'Grand Sire' : 'Dam', dam ? (dam.id || dam._id) : (rootAnimal.id || rootAnimal._id))} />
                            <PedigreeCard role="Grand Dam" animal={gDamDam} isPlaceholder={!gDamDam} isLocked={!dam} onAdd={() => openModal(dam ? 'Grand Dam' : 'Dam', dam ? (dam.id || dam._id) : (rootAnimal.id || rootAnimal._id))} />
                        </div>
                    </div>

                    {/* SVG Connector Level 1 to 2 */}
                    <div className="relative h-16 w-full pointer-events-none -my-8">
                        <svg className="w-full h-full overflow-visible">
                            <path d="M 136 0 L 272 64 M 408 0 L 272 64" fill="none" stroke="#D1D5DB" strokeWidth="2" />
                            <path d="M 680 0 L 816 64 M 952 0 L 816 64" fill="none" stroke="#D1D5DB" strokeWidth="2" />
                        </svg>
                    </div>

                    {/* Level 2: Parents */}
                    <div className="flex gap-72 relative">
                        <PedigreeCard role="Sire" animal={sire} isPlaceholder={!sire} onAdd={() => openModal('Sire', rootAnimal?.id || rootAnimal?._id)} />
                        <PedigreeCard role="Dam" animal={dam} isPlaceholder={!dam} onAdd={() => openModal('Dam', rootAnimal?.id || rootAnimal?._id)} />
                    </div>

                    {/* SVG Connector Level 2 to 3 */}
                    <div className="relative h-16 w-full pointer-events-none -my-8">
                        <svg className="w-full h-full overflow-visible">
                            <path d="M 272 0 L 544 64 M 816 0 L 544 64" fill="none" stroke="#D1D5DB" strokeWidth="2" />
                        </svg>
                    </div>

                    {/* Level 3: Current Animal */}
                    <div className="relative">
                        <PedigreeCard animal={rootAnimal} isRoot />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PedigreeTree;
