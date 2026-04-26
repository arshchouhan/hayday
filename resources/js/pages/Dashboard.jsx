import Navbar from '../components/Navbar';
import ManageCattleDashboard from '../components/ManageCattleDashboard';
import SuboptionsSidebar from '../components/SuboptionsSidebar';
import Pedigree from './Pedigree';
import Timeline from './Timeline';
import AI from './AI';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const sectionConfig = {
    lifecycle: {
        title: 'Lifecycle',
        suboptions: [
            { key: 'details', label: 'Animal Details', to: '/lifecycle/details' },
            { key: 'register', label: 'Register Animal', to: '/lifecycle/register' },
            { key: 'scheduler', label: 'Scheduler', to: '/lifecycle/scheduler' },
            { key: 'groups', label: 'Groups', to: '/lifecycle/groups' },
        ],
    },
    health: {
        title: 'Health',
        suboptions: [
            { key: 'records', label: 'Health Records', to: '/health' },
            { key: 'vaccinations', label: 'Vaccinations', to: '/health/vaccinations' },
            { key: 'treatments', label: 'Treatments', to: '/health/treatments' },
        ],
    },
    breeding: {
        title: 'Breeding',
        suboptions: [
            { key: 'inventory', label: 'Livestock', to: '/breeding' },
            { key: 'assigned', label: 'Assigned Groups', to: '/breeding/groups' },
            { key: 'maintenance', label: 'Breeding History', to: '/breeding/history' },
        ],
    },
    pedigree: {
        title: 'Pedigree',
        suboptions: [
            { key: 'lineage', label: 'Lineage Tree', to: '/pedigree' },
            { key: 'ancestry', label: 'Ancestry Records', to: '/pedigree/ancestry' },
            { key: 'progeny', label: 'Progeny Reports', to: '/pedigree/progeny' },
        ],
    },
};

function getActiveSection(pathname) {
    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0] || 'lifecycle';
    return sectionConfig[firstSegment] ? firstSegment : 'lifecycle';
}

export default function Dashboard() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const activeKey = getActiveSection(pathname);
    const activeSection = sectionConfig[activeKey];
    const [selectedAnimal, setSelectedAnimal] = useState(null);

    // Sync selectedAnimal with active suboption on route change
    useEffect(() => {
        const rootPath = `/${activeKey}`;
        if (pathname === rootPath) {
            setSelectedAnimal(null); // No suboption selected
        } else {
            // Find the suboption that matches the beginning of the pathname
            // We sort by length descending to match the most specific route first
            const currentSub = [...activeSection.suboptions]
                .sort((a, b) => b.to.length - a.to.length)
                .find(opt => pathname.startsWith(opt.to));
                
            if (currentSub) {
                setSelectedAnimal(currentSub.label);
            }
        }
    }, [pathname, activeKey, activeSection]);

    const handleSidebarBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            navigate(`/${activeKey}`);
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
                                rootPath={`/${activeKey}`}
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
                        {activeKey === 'lifecycle' && <ManageCattleDashboard selectedAnimal={selectedAnimal} onSelectAnimal={setSelectedAnimal} />}
                        {activeKey === 'pedigree' && <Pedigree />}
                        {activeKey === 'health' && (
                            <div className="flex h-full flex-col items-center justify-center rounded-md bg-white p-8 text-center">
                                <h2 className="text-2xl font-bold text-[#1a1a2e]">Health Workspace</h2>
                                <p className="mt-2 text-gray-500 max-w-md">Health monitoring and records.</p>
                            </div>
                        )}
                        {activeKey === 'breeding' && (
                            <div className="flex h-full flex-col items-center justify-center rounded-md bg-white p-8 text-center">
                                <h2 className="text-2xl font-bold text-[#1a1a2e]">Breeding Workspace</h2>
                                <p className="mt-2 text-gray-500 max-w-md">Breeding programs and lineage management.</p>
                            </div>
                        )}
                        {/* Fallback if no specific component is matched for an activeKey */}
                        {!['lifecycle', 'pedigree', 'health', 'breeding'].includes(activeKey) && (
                            <div className="flex h-full flex-col items-center justify-center rounded-md bg-white p-8 text-center">
                                <h2 className="text-2xl font-bold text-[#1a1a2e]">{activeSection.title} Workspace</h2>
                                <p className="mt-2 text-gray-500 max-w-md">
                                    This is the {activeSection.title} section. Select a suboption from the sidebar.
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}