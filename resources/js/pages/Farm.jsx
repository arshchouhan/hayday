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
            { key: 'activity', label: 'Activity', to: '/farm/activity' },
            { key: 'groups', label: 'Groups', to: '/farm/groups' },
            { key: 'workers', label: 'Workers', to: '/farm/workers' },
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
            { key: 'activity', label: 'Activity', to: '/farm/activity' },
            { key: 'groups', label: 'Groups', to: '/farm/groups' },
            { key: 'workers', label: 'Workers', to: '/farm/workers' },
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
            { key: 'activity', label: 'Activity', to: '/farm/activity' },
            { key: 'groups', label: 'Groups', to: '/farm/groups' },
            { key: 'workers', label: 'Workers', to: '/farm/workers' },
            { key: 'location', label: 'Location', to: '/farm/location' },
        ],
    },
    groups: {
        title: 'Lifecycle',
        rootPath: '/farm/groups',
        suboptions: [
            { key: 'details', label: 'Animal Details', to: '/farm/details' },
            { key: 'activity', label: 'Activity', to: '/farm/activity' },
            { key: 'groups', label: 'Groups', to: '/farm/groups' },
            { key: 'workers', label: 'Workers', to: '/farm/workers' },
        ],
    },
};

import { useAuth } from '../context/AuthContext';

export default function Farm() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { user, loading, logout } = useAuth();
    const [loggingOut, setLoggingOut] = useState(false);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    const handleLogout = async () => {
        setLoggingOut(true);
        // Delay to show the peaceful transition
        await new Promise(resolve => setTimeout(resolve, 1000));
        await logout();
        navigate('/login');
    };

    // Determine current active section
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

    const getSelectedAnimalFromPath = (currentPathname, currentSection) => {
        if (currentPathname === currentSection.rootPath) return null;
        const currentSub = [...currentSection.suboptions]
            .sort((a, b) => b.to.length - a.to.length)
            .find(opt => currentPathname.startsWith(opt.to));
        return currentSub ? currentSub.label : null;
    };

    // Derive selectedAnimal from URL to prevent state jitter
    const selectedAnimal = getSelectedAnimalFromPath(pathname, activeSection);

    // State only for confirmation flow
    const [showNavConfirmation, setShowNavConfirmation] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState(null);

    const handleSelectAnimal = (animalLabel) => {
        if (pathname === '/farm/register') {
            setPendingNavigation(animalLabel);
            setShowNavConfirmation(true);
        }
    };

    const confirmNavigation = () => {
        const option = activeSection.suboptions.find(opt => opt.label === pendingNavigation);
        if (option) navigate(option.to);
        setShowNavConfirmation(false);
        setPendingNavigation(null);
    };

    const cancelNavigation = () => {
        setShowNavConfirmation(false);
        setPendingNavigation(null);
    };

    if (loggingOut) {
        return (
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1a1a2e] animate-in fade-in duration-1000">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                    <svg viewBox="0 0 24 24" className="h-10 w-10 text-white animate-pulse" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight italic">Goodnight Farm...</h1>
                <p className="mt-2 text-white/40 text-sm font-medium">Progress saved securely</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#D7E3EF]">
                <div className="text-[15px] font-black text-[#1a1a2e] animate-pulse">Loading HayDay...</div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-[#D7E3EF]">
            {/* Navigation Confirmation Modal - Moved to root for full screen coverage */}
            {showNavConfirmation && (
                <>
                    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md" onClick={cancelNavigation} />
                    <div className="fixed left-1/2 top-1/2 z-[101] w-96 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-100 bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="border-b border-gray-100 px-6 py-4">
                            <h2 className="text-[18px] font-black text-[#1a1a2e]">Discard Changes?</h2>
                        </div>
                        <div className="px-6 py-4">
                            <p className="text-[14px] font-medium text-gray-600">Are you sure you want to leave? Any unsaved changes will be lost.</p>
                        </div>
                        <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    cancelNavigation();
                                }}
                                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Keep Editing
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    confirmNavigation();
                                }}
                                className="flex-1 rounded-lg bg-red-50 px-4 py-2 text-[13px] font-bold text-red-600 hover:bg-red-100 transition-colors"
                            >
                                Discard
                            </button>
                        </div>
                    </div>
                </>
            )}

            <Navbar />
            <main className="w-full flex-1 overflow-hidden px-3 pb-3 sm:px-4 sm:pb-4">
                <div className="flex h-full min-h-0 flex-col gap-3 md:flex-row md:items-start">
                    <div className="flex flex-col md:h-full md:w-44 md:shrink-0 lg:w-48">
                        <div className="flex-1 overflow-auto scrollbar-hide">
                            <SuboptionsSidebar
                                section={activeSection.title}
                                suboptions={activeSection.suboptions}
                                selectedAnimal={selectedAnimal}
                                onSelectAnimal={handleSelectAnimal}
                                rootPath={activeSection.rootPath}
                            />
                        </div>

                        <div className="pt-3">
                            <button
                                type="button"
                                className="group flex items-center rounded-xl bg-white p-3 text-sm font-semibold text-gray-700 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.1)] ring-1 ring-black/10 transition-all duration-300 ease-in-out hover:w-full hover:bg-gray-50 hover:shadow-lg"
                                onClick={handleLogout}
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
                        <Routes>
                            <Route index element={<Livestock selectedAnimal={selectedAnimal} onSelectAnimal={handleSelectAnimal} />} />
                            <Route path="details" element={<Livestock selectedAnimal={selectedAnimal} onSelectAnimal={handleSelectAnimal} />} />
                            <Route path="details/:id" element={<Livestock selectedAnimal={selectedAnimal} onSelectAnimal={handleSelectAnimal} />} />
                            <Route path="register" element={
                                <section className="h-full min-h-0 w-full overflow-auto bg-[#F8FAFD] p-4 sm:p-8">
                                    <RegisterAnimal onSelectAnimal={handleSelectAnimal} />
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
                            <Route path="location" element={<Location />} />
                            <Route path="details/:id/edit" element={<EditCattle />} />
                            <Route path="groups" element={<Groups />} />
                            <Route path="groups/:id" element={<GroupDetail />} />
                            <Route path="workers" element={<Workers />} />
                            <Route path="workers/add" element={<AddWorker />} />
                            <Route path="inventory" element={<Inventory />} />
                            <Route path="inventory/restock" element={<RestockInventory />} />
                            <Route path="*" element={<Livestock selectedAnimal={selectedAnimal} onSelectAnimal={handleSelectAnimal} />} />
                        </Routes>


                    </section>
                </div>
            </main>
        </div>
    );
}
