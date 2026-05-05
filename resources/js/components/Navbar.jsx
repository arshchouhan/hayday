import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import hayIcon from '../assets/noun-hay-7549821.svg';

const searchTargets = [
    { label: 'Farm', to: '/farm' },
    { label: 'Farm: Animal Details', to: '/farm/details' },
    { label: 'Farm: Register Animal', to: '/farm/register' },
    { label: 'Farm: Activity', to: '/farm/activity' },
    { label: 'Farm: Notifications', to: '/farm/notifications' },
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
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [searchQuery, setSearchQuery] = useState('');
    const [showQueryError, setShowQueryError] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const notificationMenuRef = useRef(null);
    const profileMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target)) {
                setShowNotifications(false);
            }

            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        setShowProfileMenu(false);
        setShowNotifications(!showNotifications);
    };

    const formatTimeAgo = (value) => {
        if (!value) return 'just now';

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return 'just now';

        const diffMinutes = Math.max(1, Math.floor((Date.now() - date.getTime()) / 60000));
        if (diffMinutes < 60) return `${diffMinutes}m ago`;

        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours}h ago`;

        return `${Math.floor(diffHours / 24)}d ago`;
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
                                <div ref={notificationMenuRef} className="relative">
                                    <button
                                        type="button"
                                        onClick={handleNotificationsClick}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-gray-700 hover:bg-black/5 transition-colors relative"
                                        aria-label="Open notifications"
                                    >
                                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                        </svg>
                                        {unreadCount > 0 && (
                                            <span className="absolute -right-0.5 -top-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black leading-none text-white">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {showNotifications && (
                                        <div className="absolute right-0 top-11 z-[70] w-[380px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                                            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                                                <div>
                                                    <p className="text-[13px] font-black text-[#1a1a2e]">Notifications</p>
                                                    <p className="text-[11px] font-medium text-gray-500">{unreadCount} unread</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => markAllAsRead()}
                                                    className="rounded-full bg-[#E9EEF6] px-3 py-1.5 text-[11px] font-bold text-[#1a1a2e] hover:bg-[#dde6f2] transition-colors"
                                                >
                                                    Mark all read
                                                </button>
                                            </div>

                                            <div className="max-h-[380px] overflow-y-auto">
                                                {notifications.length === 0 ? (
                                                    <div className="px-4 py-10 text-center">
                                                        <p className="text-[14px] font-black text-[#1a1a2e]">No notifications yet</p>
                                                        <p className="mt-1 text-[12px] font-medium text-gray-500">Activity and animal alerts will appear here.</p>
                                                    </div>
                                                ) : (
                                                    notifications.slice(0, 6).map((notification) => (
                                                        <button
                                                            key={notification.id}
                                                            type="button"
                                                            onClick={async () => {
                                                                await markAsRead(notification.id);
                                                                setShowNotifications(false);
                                                                navigate(notification.action_url || '/farm/notifications');
                                                            }}
                                                            className="flex w-full items-start gap-3 border-b border-gray-50 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                                                        >
                                                            <div className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${notification.category === 'attention' ? 'bg-red-50 text-red-600' : 'bg-[#E9EEF6] text-[#1a1a2e]'}`}>
                                                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    {notification.category === 'attention' ? (
                                                                        <>
                                                                            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                                                            <path d="M12 9v4" />
                                                                            <path d="M12 17h.01" />
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <path d="M22 12A10 10 0 1 1 12 2" />
                                                                            <path d="M22 2 12 12" />
                                                                        </>
                                                                    )}
                                                                </svg>
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <p className="truncate text-[13px] font-black text-[#1a1a2e]">{notification.title}</p>
                                                                    {notification.status === 'unread' && <span className="h-2 w-2 rounded-full bg-red-500" />}
                                                                </div>
                                                                <p className="mt-1 line-clamp-2 text-[12px] font-medium text-gray-500">{notification.message}</p>
                                                                <p className="mt-1 text-[11px] font-semibold text-gray-400">{formatTimeAgo(notification.created_at)}</p>
                                                            </div>
                                                        </button>
                                                    ))
                                                )}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowNotifications(false);
                                                    navigate('/farm/notifications');
                                                }}
                                                className="flex w-full items-center justify-center border-t border-gray-100 bg-[#F8FAFD] px-4 py-3 text-[12px] font-black text-[#1a1a2e] hover:bg-gray-50 transition-colors"
                                            >
                                                View all notifications
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div ref={profileMenuRef} className="relative">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowNotifications(false);
                                            setShowProfileMenu(!showProfileMenu);
                                        }}
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
                                            <div className="mb-1 border-b border-gray-100 px-3 py-2">
                                                <p className="truncate text-[13px] font-black text-[#1a1a2e]">{user?.name}</p>
                                                <p className="truncate text-[11px] font-bold text-gray-500">{user?.ranch_name || 'My Farm'}</p>
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
            </div>
        </header>
    );
}