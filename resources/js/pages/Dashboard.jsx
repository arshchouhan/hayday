import Navbar from '../components/Navbar';
import ManageCattleDashboard from '../components/ManageCattleDashboard';
import SuboptionsSidebar from '../components/SuboptionsSidebar';
import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';

const sectionConfig = {
    dashboard: {
        title: 'Dashboard',
        suboptions: [
            { key: 'all', label: 'All Animals', to: '/dashboard' },
        ],
    },
    people: {
        title: 'Register Animal',
        suboptions: [
            { key: 'employees', label: 'Employees', to: '/dashboard/people' },
            { key: 'teams', label: 'Teams', to: '/dashboard/people/teams' },
            { key: 'attendance', label: 'Attendance', to: '/dashboard/people/attendance' },
        ],
    },
    health: {
        title: 'Health',
        suboptions: [
            { key: 'records', label: 'Health Records', to: '/dashboard/health' },
            { key: 'vaccinations', label: 'Vaccinations', to: '/dashboard/health/vaccinations' },
            { key: 'treatments', label: 'Treatments', to: '/dashboard/health/treatments' },
        ],
    },
    breeding: {
        title: 'Breeding',
        suboptions: [
            { key: 'inventory', label: 'Livestock', to: '/dashboard/breeding' },
            { key: 'assigned', label: 'Assigned Groups', to: '/dashboard/breeding/groups' },
            { key: 'maintenance', label: 'Breeding History', to: '/dashboard/breeding/history' },
        ],
    },
    pedigree: {
        title: 'Pedigree',
        suboptions: [
            { key: 'lineage', label: 'Lineage Tree', to: '/dashboard/pedigree' },
            { key: 'ancestry', label: 'Ancestry Records', to: '/dashboard/pedigree/ancestry' },
            { key: 'progeny', label: 'Progeny Reports', to: '/dashboard/pedigree/progeny' },
        ],
    },
};

function getActiveSection(pathname) {
    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] !== 'dashboard') {
        return 'dashboard';
    }
    return sectionConfig[segments[1]] ? segments[1] : 'dashboard';
}

export default function Dashboard() {
    const { pathname } = useLocation();
    const activeKey = getActiveSection(pathname);
    const activeSection = sectionConfig[activeKey];
    const [selectedAnimal, setSelectedAnimal] = useState('All Animals');

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-[#D7E3EF]">
            <Navbar />
            <main className="w-full flex-1 overflow-hidden px-3 pb-3 sm:px-4 sm:pb-4">
                <div className="flex h-full min-h-0 flex-col gap-3 md:flex-row md:items-start">
                    <div className="flex flex-col md:h-full md:w-44 md:shrink-0 lg:w-48">
                        <div className="flex-1 overflow-auto scrollbar-hide">
                            <SuboptionsSidebar
                                section={activeSection.title}
                                suboptions={activeSection.suboptions}
                                selectedAnimal={selectedAnimal}
                                onSelectAnimal={setSelectedAnimal}
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
                        {activeKey === 'dashboard' ? (
                            <ManageCattleDashboard selectedAnimal={selectedAnimal} onSelectAnimal={setSelectedAnimal} />
                        ) : (
                            <div className="flex h-full items-center justify-center rounded-md border border-dashed border-slate-300 bg-white/60 text-sm font-medium text-slate-500">
                                {activeSection.title} workspace
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}