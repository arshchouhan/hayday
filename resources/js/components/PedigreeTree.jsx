import React, { useState } from 'react';
import PedigreeCard from './PedigreeCard';
import AncestorModal from './AncestorModal';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

const PedigreeTree = ({ rootAnimal, onRefresh }) => {
    const [modal, setModal] = useState({ isOpen: false, role: '', targetId: '' });

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
                species={rootAnimal?.species}
                onSave={onRefresh}
            />

            {/* Tree Container */}
            <div className="flex-1 overflow-auto p-12 flex justify-center items-start">
                <div className="relative flex flex-col items-center gap-16 origin-top">
                    
                    {/* Level 1: Grandparents */}
                    <div className="flex gap-12 relative">
                        {/* Paternal Grandparents Group */}
                        <div className="flex gap-4">
                            <PedigreeCard role="Grand Sire" animal={gSireSire} isPlaceholder={!gSireSire} isLocked={!sire} onAdd={() => openModal(sire ? 'Grand Sire' : 'Sire', sire ? (sire.id || sire._id) : (rootAnimal.id || rootAnimal._id))} />
                            <PedigreeCard role="Grand Dam" animal={gSireDam} isPlaceholder={!gSireDam} isLocked={!sire} onAdd={() => openModal(sire ? 'Grand Dam' : 'Sire', sire ? (sire.id || sire._id) : (rootAnimal.id || rootAnimal._id))} />
                        </div>
                        {/* Maternal Grandparents Group */}
                        <div className="flex gap-4">
                            <PedigreeCard role="Grand Sire" animal={gDamSire} isPlaceholder={!gDamSire} isLocked={!dam} onAdd={() => openModal(dam ? 'Grand Sire' : 'Dam', dam ? (dam.id || dam._id) : (rootAnimal.id || rootAnimal._id))} />
                            <PedigreeCard role="Grand Dam" animal={gDamDam} isPlaceholder={!gDamDam} isLocked={!dam} onAdd={() => openModal(dam ? 'Grand Dam' : 'Dam', dam ? (dam.id || dam._id) : (rootAnimal.id || rootAnimal._id))} />
                        </div>
                    </div>

                    {/* SVG Connector Level 1 to 2 */}
                    <div className="relative h-16 w-full pointer-events-none -my-8">
                        <svg className="w-full h-full overflow-visible">
                            <path d="M 120 0 L 248 64 M 376 0 L 248 64" fill="none" stroke="#D1D5DB" strokeWidth="2" />
                            <path d="M 664 0 L 792 64 M 920 0 L 792 64" fill="none" stroke="#D1D5DB" strokeWidth="2" />
                        </svg>
                    </div>

                    {/* Level 2: Parents */}
                    <div className="flex gap-[304px] relative">
                        <PedigreeCard role="Sire" animal={sire} isPlaceholder={!sire} onAdd={() => openModal('Sire', rootAnimal?.id || rootAnimal?._id)} />
                        <PedigreeCard role="Dam" animal={dam} isPlaceholder={!dam} onAdd={() => openModal('Dam', rootAnimal?.id || rootAnimal?._id)} />
                    </div>

                    {/* SVG Connector Level 2 to 3 */}
                    <div className="relative h-16 w-full pointer-events-none -my-8">
                        <svg className="w-full h-full overflow-visible">
                            <path d="M 248 0 L 520 64 M 792 0 L 520 64" fill="none" stroke="#D1D5DB" strokeWidth="2" />
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
