import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import hayIcon from '../assets/noun-hay-7549821.svg';

const searchTargets = [
    { label: 'Farm', to: '/farm' },
    { label: 'Farm: Animal Details', to: '/farm/details' },
    { label: 'Farm: Register Animal', to: '/farm/register' },
    { label: 'Farm: Activity', to: '/farm/activity' },
    { label: 'Farm: Health', to: '/farm/health' },
    { label: 'Farm: Health Records', to: '/farm/health' },
    { label: 'Farm: Vaccinations', to: '/farm/health/vaccinations' },
    { label: 'Farm: Treatments', to: '/farm/health/treatments' },
    { label: 'Farm: Inventory', to: '/farm/inventory' },
    { label: 'Farm: Location', to: '/farm/location' },
];

const links = [
    { label: 'Location', to: '/farm/location' },
    { label: 'Inventory', to: '/farm/inventory' },
];

export default function Navbar() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [showQueryError, setShowQueryError] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    useEffect(() => {
        const match = searchTargets.find(t => pathname === t.to);
        if (match) {
            setSearchQuery(`${match.label}: `);
        } else if (pathname === '/farm') {
            setSearchQuery('Farm: ');
        }
    }, [pathname]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.charAt(0).toUpperCase();
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim() !== '') {
            const queryParts = searchQuery.split(':');
            const query = queryParts[queryParts.length - 1].toLowerCase().trim();

            if (!query) return;

            const match = searchTargets.find(t => t.label.toLowerCase().includes(query));
            if (match) {
                setShowQueryError(false);
                navigate(match.to);
                setSearchQuery(`${match.label}: `);
            } else {
                setShowQueryError(true);
                setTimeout(() => setShowQueryError(false), 2500);
            }
        }
    };

    const handleNotificationsClick = () => {
        setShowNotifications(!showNotifications);
    };

    return (
        <header className="bg-transparent w-full relative z-[60]">
            <div className="px-3 pt-3 pb-1 sm:px-4 w-full">
                <div className="flex items-center gap-3 flex-row w-full">
                    <div className="flex items-center shrink-0 md:w-44 lg:w-48">
                        <NavLink
                            to="/farm"
                            className="flex items-center transition-transform hover:scale-105 ml-2"
                            aria-label="Go to landing page"
                        >
                            <img src={hayIcon} alt="HayDay Logo" className="h-14 w-auto drop-shadow-md" />
                        </NavLink>
                    </div>

                    <div className="flex min-w-0 flex-1 items-center justify-between">
                        <div className="relative w-80 md:w-[400px] lg:w-[500px]">
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
                                className="block w-full rounded-xl border-none bg-white py-3 pl-10 pr-3 text-sm font-semibold text-gray-700 shadow-md hover:shadow-lg ring-1 ring-black/10 transition-all focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/40 placeholder:text-gray-400"
                            />
                            {showQueryError && (
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
                                        onClick={() => setSearchQuery(`Farm: ${item.label}: `)}
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

                            <div className="flex items-center gap-2 relative">
                                <button
                                    type="button"
                                    onClick={handleNotificationsClick}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-gray-700 hover:bg-black/5 transition-colors relative"
                                >
                                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                    </svg>
                                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1a1a2e] text-white shadow-md hover:scale-105 transition-all overflow-hidden"
                                >
                                    {user?.profile_image ? (
                                        <img src={user.profile_image} alt={user.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="text-[12px] font-black">{getInitials(user?.name)}</span>
                                    )}
                                </button>

                                {showProfileMenu && (
                                    <div className="absolute right-0 top-11 z-[70] w-56 rounded-xl border border-gray-100 bg-white p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                                        <div className="px-3 py-2 border-b border-gray-100 mb-1">
                                            <p className="text-[13px] font-black text-[#1a1a2e] truncate">{user?.name}</p>
                                            <p className="text-[11px] font-bold text-gray-500 truncate">{user?.ranch_name || 'My Farm'}</p>
                                        </div>
                                        <button 
                                            onClick={() => { setShowProfileMenu(false); navigate('/farm/profile'); }}
                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                            </svg>
                                            Profile Settings
                                        </button>
                                        <button 
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-bold text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}