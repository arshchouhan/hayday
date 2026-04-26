import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SuboptionsSidebar from '../components/SuboptionsSidebar';
import Activity from './Activity';
import Livestock from '../components/ManageCattleDashboard';
import RegisterAnimal from '../components/RegisterAnimal';
import Pedigree from './Pedigree';
import Location from './Location';

// Placeholders for missing components
const Groups = () => <div className="p-8 text-center text-gray-500">Groups Component (Coming Soon)</div>;
const Health = () => <div className="p-8 text-center text-gray-500">Health Component (Coming Soon)</div>;
const Breeding = () => <div className="p-8 text-center text-gray-500">Breeding Component (Coming Soon)</div>;

const sectionConfigs = {
    farm: {
        title: 'Lifecycle',
        rootPath: '/farm',
        suboptions: [
            { key: 'details', label: 'Animal Details', to: '/farm/details' },
            { key: 'register', label: 'Register Animal', to: '/farm/register' },
            { key: 'scheduler', label: 'Activity', to: '/farm/scheduler' },
        ],
    },
    health: {
        title: 'Health',
        rootPath: '/health',
        suboptions: [
            { key: 'records', label: 'Health Records', to: '/health' },
            { key: 'vaccinations', label: 'Vaccinations', to: '/health/vaccinations' },
            { key: 'treatments', label: 'Treatments', to: '/health/treatments' },
        ],
    },
    inventory: {
        title: 'Lifecycle',
        rootPath: '/farm/inventory',
        suboptions: [
            { key: 'details', label: 'Animal Details', to: '/farm/details' },
            { key: 'register', label: 'Register Animal', to: '/farm/register' },
            { key: 'scheduler', label: 'Activity', to: '/farm/scheduler' },
            { key: 'inventory', label: 'Inventory', to: '/farm/inventory' },
        ],
    },
    pedigree: {
        title: 'Pedigree',
        rootPath: '/pedigree',
        suboptions: [
            { key: 'lineage', label: 'Lineage Tree', to: '/pedigree' },
            { key: 'ancestry', label: 'Ancestry Records', to: '/pedigree/ancestry' },
            { key: 'progeny', label: 'Progeny Reports', to: '/pedigree/progeny' },
        ],
    },
    location: {
        title: 'Lifecycle',
        rootPath: '/farm/location',
        suboptions: [
            { key: 'details', label: 'Animal Details', to: '/farm/details' },
            { key: 'register', label: 'Register Animal', to: '/farm/register' },
            { key: 'scheduler', label: 'Activity', to: '/farm/scheduler' },
            { key: 'location', label: 'Location', to: '/farm/location' },
        ],
    },
    groups: {
        title: 'Lifecycle',
        rootPath: '/farm/groups',
        suboptions: [
            { key: 'details', label: 'Animal Details', to: '/farm/details' },
            { key: 'register', label: 'Register Animal', to: '/farm/register' },
            { key: 'scheduler', label: 'Activity', to: '/farm/scheduler' },
            { key: 'groups', label: 'Groups', to: '/farm/groups' },
        ],
    },
};

export default function Farm() {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    // Determine current active section - more specific matches first
    let activeKey = 'farm';
    if (pathname.startsWith('/farm/location')) {
        activeKey = 'location';
    } else if (pathname.startsWith('/farm/groups')) {
        activeKey = 'groups';
    } else if (pathname.startsWith('/farm/inventory')) {
        activeKey = 'inventory';
    } else {
        const segments = pathname.split('/').filter(Boolean);
        const firstSegment = segments[0] || 'farm';
        activeKey = sectionConfigs[firstSegment] ? firstSegment : 'farm';
    }
    const activeSection = sectionConfigs[activeKey];

    const [selectedAnimal, setSelectedAnimal] = useState(null);

    useEffect(() => {
        if (pathname === activeSection.rootPath) {
            setSelectedAnimal(null);
        } else {
            const currentSub = [...activeSection.suboptions]
                .sort((a, b) => b.to.length - a.to.length)
                .find(opt => pathname.startsWith(opt.to));

            if (currentSub) {
                setSelectedAnimal(currentSub.label);
            }
        }
    }, [pathname, activeSection]);

    const handleSidebarBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            navigate(activeSection.rootPath);
            setSelectedAnimal(null);
        }
    };

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-[#D7E3EF]">
            <Navbar />
            <main className="w-full flex-1 overflow-hidden px-3 pb-3 sm:px-4 sm:pb-4">
                <div className="flex h-full min-h-0 flex-col gap-3 md:flex-row md:items-start">
                    <div className="flex flex-col md:h-full md:w-44 md:shrink-0 lg:w-48">
                        <div
                            className="flex-1 overflow-auto scrollbar-hide cursor-pointer"
                            onClick={handleSidebarBackgroundClick}
                        >
                            <SuboptionsSidebar
                                section={activeSection.title}
                                suboptions={activeSection.suboptions}
                                selectedAnimal={selectedAnimal}
                                onSelectAnimal={setSelectedAnimal}
                                rootPath={activeSection.rootPath}
                            />
                        </div>
                        <div className="mt-auto pt-4">
                            <button
                                type="button"
                                className="group flex items-center rounded-xl bg-white p-3 text-sm font-semibold text-gray-700 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.1)] ring-1 ring-black/10 transition-all duration-300 ease-in-out hover:w-full hover:bg-gray-50 hover:shadow-lg"
                                onClick={() => console.log('Logging out...')}
                            >
                                <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                                </svg>
                                <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:ml-3 group-hover:max-w-[200px] group-hover:opacity-100">
                                    Goodnight Farm...
                                </span>
                            </button>
                        </div>
                    </div>

                    <section className="h-full min-h-0 w-full min-w-0 overflow-auto rounded-md bg-[#E9EEF6] p-0">
                        {/* Content Rendering based on section and selected suboption */}
                        {activeKey === 'farm' && (
                            <>
                                {(!selectedAnimal || selectedAnimal === 'Animal Details' || selectedAnimal === 'Register Animal') && (
                                    <Livestock selectedAnimal={selectedAnimal} onSelectAnimal={setSelectedAnimal} />
                                )}
                                {selectedAnimal === 'Activity' && <Activity />}
                            </>
                        )}

                        {activeKey === 'groups' && <Groups />}
                        {activeKey === 'location' && <Location />}
                        {activeKey === 'inventory' && <Breeding />}

                        {activeKey === 'health' && <Health />}
                        {activeKey === 'pedigree' && <Pedigree />}

                        {!sectionConfigs[activeKey] && (
                            <div className="flex h-full flex-col items-center justify-center p-8 text-center bg-[#F8FAFD]">
                                <h2 className="text-2xl font-bold text-[#1a1a2e]">Workspace</h2>
                                <p className="mt-2 text-gray-500 max-w-md">Manage your farm activities here.</p>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
