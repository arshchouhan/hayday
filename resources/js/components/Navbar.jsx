import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import hayIcon from '../assets/noun-hay-7549821.svg';

const searchTargets = [
    { label: 'Lifecycle', to: '/lifecycle' },
    { label: 'Animal Details', to: '/lifecycle/details' },
    { label: 'Register Animal', to: '/lifecycle/register' },
    { label: 'Scheduler', to: '/lifecycle/scheduler' },
    { label: 'Groups', to: '/lifecycle/groups' },
    { label: 'Health', to: '/health' },
    { label: 'Health Records', to: '/health' },
    { label: 'Vaccinations', to: '/health/vaccinations' },
    { label: 'Treatments', to: '/health/treatments' },
    { label: 'Breeding', to: '/breeding' },
    { label: 'Livestock', to: '/breeding' },
    { label: 'Assigned Groups', to: '/breeding/groups' },
    { label: 'Breeding History', to: '/breeding/history' },
    { label: 'Pedigree', to: '/pedigree' },
    { label: 'Lineage Tree', to: '/pedigree' },
    { label: 'Ancestry Records', to: '/pedigree/ancestry' },
    { label: 'Progeny Reports', to: '/pedigree/progeny' },
];

const links = [
    { label: 'Lifecycle', to: '/lifecycle', end: true },
    { label: 'Health', to: '/health' },
    { label: 'Breeding', to: '/breeding' },
    { label: 'Pedigree', to: '/pedigree' },
];

export default function Navbar() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [showError, setShowError] = useState(false);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim() !== '') {
            const queryParts = searchQuery.split(':');
            const query = queryParts[queryParts.length - 1].toLowerCase().trim();
            
            if (!query) return;

            const match = searchTargets.find(t => t.label.toLowerCase().includes(query));
            if (match) {
                setShowError(false);
                navigate(match.to);
                setSearchQuery(`${match.label}: `);
            } else {
                setShowError(true);
                setTimeout(() => setShowError(false), 2500);
            }
        }
    };

    return (
        <header className="bg-transparent w-full">
            <div className="px-3 pt-3 pb-1 sm:px-4 w-full">
                <div className="flex items-center gap-3 flex-row w-full">
                    <div className="flex items-center shrink-0 md:w-44 lg:w-48">
                        <NavLink
                            to="/"
                            className="flex items-center transition-transform hover:scale-105 ml-2"
                            aria-label="Go to landing page"
                        >
                            <img src={hayIcon} alt="HayDay Logo" className="h-14 w-auto drop-shadow-md" />
                        </NavLink>
                    </div>

                    <div className="flex min-w-0 flex-1 items-center justify-between">
                        <div className="relative w-64 md:w-80 lg:w-96">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Global Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                className="block w-full rounded-xl border-none bg-white py-2 pl-10 pr-3 text-sm font-semibold text-gray-700 shadow-md hover:shadow-lg ring-1 ring-black/10 transition-all focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/40 placeholder:text-gray-400"
                            />
                            {showError && (
                                <div className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-xl bg-white shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)] ring-1 ring-black/5 transition-all animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-center gap-3 px-4 py-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E9EEF6] text-gray-500">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-bold text-[#1a1a2e]">No results found</span>
                                            <span className="text-[11px] font-medium text-gray-500">Try searching for a different section</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-end gap-4">
                            <nav aria-label="Dashboard navigation" className="flex flex-wrap items-center justify-end gap-2">
                                {links.map((item) => (
                                    <NavLink
                                        key={item.label}
                                        to={item.to}
                                        end={item.end}
                                        className={({ isActive }) =>
                                            [
                                                'rounded-full px-4 py-2 text-sm shadow-md transition hover:shadow-lg',
                                                isActive
                                                    ? 'bg-[#E9EEF6] text-gray-900 ring-1 ring-black/25 hover:ring-black/40'
                                                    : 'bg-[#E9EEF6] text-gray-700 ring-1 ring-black/25 hover:bg-white hover:ring-black/40',
                                            ].join(' ')
                                        }
                                    >
                                        {item.label}
                                    </NavLink>
                                ))}
                            </nav>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    aria-label="Settings"
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-gray-700 hover:bg-200"
                                >
                                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <path d="M12 3v2" />
                                        <path d="M12 19v2" />
                                        <path d="M3 12h2" />
                                        <path d="M19 12h2" />
                                        <path d="m5.64 5.64 1.41 1.41" />
                                        <path d="m16.95 16.95 1.41 1.41" />
                                        <path d="m5.64 18.36 1.41-1.41" />
                                        <path d="m16.95 7.05 1.41-1.41" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                </button>

                                <button
                                    type="button"
                                    aria-label="Profile"
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-gray-700 hover:bg-200"
                                >
                                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M4 21c1.8-3.2 4.3-5 8-5s6.2 1.8 8 5" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}