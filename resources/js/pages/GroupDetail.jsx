import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Trash2, Edit2, Tag, MapPin, ArrowRight } from 'lucide-react';
import cowIcon from '../assets/noun-cow-8349503.svg';

const GroupDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // Mock data for the group and its animals
    const group = {
        id: id || 1,
        name: "Arsh's Group",
        description: "Click on \"Edit\" to update relevant information of group.",
        animalsCount: 2,
        animals: [
            {
                id: 1,
                tagColor: 'text-red-500',
                earTag: '453534534',
                type: 'Cow',
                name: 'Cattle Name | Arsh',
                status: 'Active | Exposed',
                location: 'Erewr'
            },
            {
                id: 2,
                tagColor: 'text-gray-300',
                earTag: 'Tr546546466464',
                type: 'Bull',
                name: 'Cattle Name | Arsh Chauhan',
                status: 'Active',
                location: "Arsh's Location"
            }
        ]
    };

    return (
        <div className="flex h-full flex-col bg-[#F8FAFD] rounded-xl overflow-auto p-4 sm:p-6 lg:p-8">
            {/* Header Card */}
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8 gap-4">
                <div className="space-y-2">
                    <button 
                        onClick={() => navigate('/farm/groups')}
                        className="flex items-center gap-2 text-[20px] font-black text-[#059669] hover:opacity-80 transition-opacity"
                    >
                        <ChevronLeft size={24} strokeWidth={3} />
                        {group.name}
                    </button>
                    <p className="text-[14px] font-medium text-[#1a1a2e] ml-8">
                        {group.description}
                    </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 md:ml-auto ml-8">
                    <button className="rounded-full bg-[#1a1a2e] px-5 py-2.5 text-[13px] font-bold text-white shadow-md hover:bg-black transition-all">
                        Perform activity on group
                    </button>
                    <button className="flex items-center gap-2 rounded-full bg-[#FF4F4F] px-5 py-2.5 text-[13px] font-bold text-white shadow-md hover:bg-red-600 transition-all">
                        <Trash2 size={16} strokeWidth={2.5} />
                        Delete
                    </button>
                    <button className="flex items-center gap-2 rounded-full bg-[#1a1a2e] px-5 py-2.5 text-[13px] font-bold text-white shadow-md hover:bg-black transition-all">
                        <Edit2 size={16} strokeWidth={2.5} />
                        Edit
                    </button>
                </div>
            </div>

            {/* Animals Section */}
            <div className="space-y-4">
                <h2 className="text-[20px] font-black text-[#059669]">
                    {group.animalsCount} Animals
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {group.animals.map((animal) => (
                        <div key={animal.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
                            <div className="flex items-center gap-2 mb-4">
                                <Tag size={16} className={animal.tagColor} fill="currentColor" />
                                <span className="text-[18px] font-bold text-[#1a1a2e]">{animal.earTag}</span>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 rounded-full bg-[#F4F7FB] px-2.5 py-1">
                                        <img src={cowIcon} alt="cow" className="h-3.5 w-3.5 opacity-60" />
                                        <span className="text-[11px] font-bold text-gray-600">{animal.type}</span>
                                    </div>
                                    <div className="rounded-full bg-[#F4F7FB] px-2.5 py-1">
                                        <span className="text-[11px] font-bold text-gray-600">{animal.name}</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-1.5 rounded-full bg-[#F4F7FB] px-3 py-1 w-fit">
                                    <div className="h-2 w-2 rounded-full bg-[#10B981]"></div>
                                    <span className="text-[11px] font-bold text-[#1a1a2e]">{animal.status}</span>
                                </div>
                                
                                <div className="flex items-center gap-2 rounded-full bg-[#F4F7FB] px-3 py-1 w-fit mt-1">
                                    <div className="flex items-center justify-center h-4 w-4 bg-gray-200 rounded-sm">
                                        <div className="h-2.5 w-1 bg-gray-400 rounded-full mx-0.5"></div>
                                        <div className="h-2.5 w-1 bg-gray-400 rounded-full mx-0.5"></div>
                                        <div className="h-2.5 w-1 bg-gray-400 rounded-full mx-0.5"></div>
                                    </div>
                                    <span className="text-[11px] font-bold text-[#1a1a2e]">{animal.location}</span>
                                    <ArrowRight size={12} className="text-[#1a1a2e] ml-1" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GroupDetail;
