import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SuboptionsSidebar from '../components/SuboptionsSidebar';
import Activity from './Activity';
import AnimalSelection from './AnimalSelection';
import HealthActivity from './HealthActivity';
import BreedingActivity from './BreedingActivity';
import MovementActivity from './MovementActivity';
import SalesActivity from './SalesActivity';
import Livestock from '../components/ManageCattleDashboard';
import RegisterAnimal from '../components/RegisterAnimal';
import Pedigree from './Pedigree';
import Location from './Location';
import Groups from './Groups';
import GroupDetail from './GroupDetail';
import Inventory from './Inventory';
import RestockInventory from './RestockInventory';
import Workers from './Workers';
import AddWorker from './AddWorker';
import EditCattle from './EditCattle';
import RecordHeat from './health/RecordHeat';
import PregnancyCheck from './health/PregnancyCheck';
import BreedingSoundnessExam from './health/BreedingSoundnessExam';
import Observation from './health/Observation';
import BreedingForm from './breeding/Breeding';
import Calving from './breeding/Calving';
import BreedingPregnancyCheck from './breeding/PregnancyCheck';
import GroupMovement from './movement/GroupMovement';
import LocationMovement from './movement/LocationMovement';
import DeadAnimalRecord from './sales/DeadAnimalRecord';
import FeedingSale from './sales/FeedingSale';
import WeightManagement from './sales/WeightManagement';


const sectionConfigs = {
    farm: {
        title: 'Lifecycle',
        rootPath: '/farm',
        suboptions: [
            { key: 'details', label: 'Animal Details', to: '/farm/details' },
            { key: 'register', label: 'Register Animal', to: '/farm/register' },
            { key: 'activity', label: 'Activity', to: '/farm/activity' },
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
            { key: 'activity', label: 'Activity', to: '/farm/activity' },
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
            { key: 'activity', label: 'Activity', to: '/farm/activity' },
            { key: 'location', label: 'Location', to: '/farm/location' },
        ],
    },
    groups: {
        title: 'Lifecycle',
        rootPath: '/farm/groups',
        suboptions: [
            { key: 'details', label: 'Animal Details', to: '/farm/details' },
            { key: 'register', label: 'Register Animal', to: '/farm/register' },
            { key: 'activity', label: 'Activity', to: '/farm/activity' },
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

    // Removed handleSidebarBackgroundClick to prevent redirecting to root on background click

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
                        {/* Nested Routes handle all sub-page navigation */}
                        <Routes>
                            {/* Farm / Lifecycle routes */}
                            <Route index element={<Livestock selectedAnimal={selectedAnimal} onSelectAnimal={setSelectedAnimal} />} />
                            <Route path="details" element={<Livestock selectedAnimal={selectedAnimal} onSelectAnimal={setSelectedAnimal} />} />
                            <Route path="details/:id" element={<Livestock selectedAnimal={selectedAnimal} onSelectAnimal={setSelectedAnimal} />} />
                            <Route path="register" element={
                                <section className="h-full min-h-0 w-full overflow-auto bg-[#F8FAFD] p-4 sm:p-8">
                                    <RegisterAnimal />
                                </section>
                            } />
                            <Route path="activity" element={<Activity />} />
                            <Route path="activity/:activityType" element={<AnimalSelection />} />
                            <Route path="activity/health/:animalId" element={<HealthActivity />} />
                            <Route path="activity/health/:animalId/record-heat" element={<RecordHeat />} />
                            <Route path="activity/health/:animalId/pregnancy-check" element={<PregnancyCheck />} />
                            <Route path="activity/health/:animalId/bse" element={<BreedingSoundnessExam />} />
                            <Route path="activity/health/:animalId/observation" element={<Observation />} />
                            <Route path="activity/breeding/:animalId" element={<BreedingActivity />} />
                            <Route path="activity/breeding/:animalId/breeding" element={<BreedingForm />} />
                            <Route path="activity/breeding/:animalId/calving" element={<Calving />} />
                            <Route path="activity/breeding/:animalId/pregnancy-check" element={<BreedingPregnancyCheck />} />
                            <Route path="activity/movement/:animalId" element={<MovementActivity />} />
                            <Route path="activity/movement/:animalId/group-movement" element={<GroupMovement />} />
                            <Route path="activity/movement/:animalId/location-movement" element={<LocationMovement />} />
                            <Route path="activity/sales/:animalId" element={<SalesActivity />} />
                            <Route path="activity/sales/:animalId/dead-animal" element={<DeadAnimalRecord />} />
                            <Route path="activity/sales/:animalId/feeding-sale" element={<FeedingSale />} />
                            <Route path="activity/sales/:animalId/weight-management" element={<WeightManagement />} />
                            <Route path="activity/*" element={<AnimalSelection />} />
                            <Route path="location" element={<Location />} />
                            <Route path="location/*" element={<Location />} />
                            <Route path="details/:id/edit" element={<EditCattle />} />
                            <Route path="groups" element={<Groups />} />
                            <Route path="groups/:id" element={<GroupDetail />} />
                            <Route path="workers" element={<Workers />} />
                            <Route path="workers/add" element={<AddWorker />} />
                            <Route path="inventory" element={<Inventory />} />
                            <Route path="inventory/restock" element={<RestockInventory />} />
                            <Route path="inventory/*" element={<Inventory />} />
                            {/* Health routes - Farm is also mounted at /health/* */}
                            <Route path="health" element={<div className="p-8 text-center text-gray-500">Health Component (Coming Soon)</div>} />
                            <Route path="vaccinations" element={<div className="p-8 text-center text-gray-500">Vaccinations (Coming Soon)</div>} />
                            <Route path="treatments" element={<div className="p-8 text-center text-gray-500">Treatments (Coming Soon)</div>} />
                            {/* Pedigree routes */}
                            <Route path="pedigree" element={<Pedigree />} />
                            <Route path="pedigree/*" element={<Pedigree />} />
                            {/* Fallback */}
                            <Route path="*" element={<Livestock selectedAnimal={selectedAnimal} onSelectAnimal={setSelectedAnimal} />} />
                        </Routes>
                    </section>
                </div>
            </main>
        </div>
    );
}
