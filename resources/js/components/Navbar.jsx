import { NavLink } from 'react-router-dom';

const links = [
    { label: 'Dashboard', to: '/dashboard', end: true },
    { label: 'People', to: '/dashboard/people' },
    { label: 'Hiring', to: '/dashboard/hiring' },
    { label: 'Devices', to: '/dashboard/devices' },
    { label: 'Calendar', to: '/dashboard/calendar' },
];

export default function Navbar() {
    return (
        <header className="bg-white">
            <div className="flex w-full items-center justify-between px-3 py-3 sm:px-4">
                <NavLink
                    to="/"
                    className="rounded-full px-5 py-2 text-sm font-semibold tracking-wide text-gray-900"
                    aria-label="Go to landing page"
                >
                    HayDay
                </NavLink>

                <div className="flex items-center justify-end gap-2">
                    <nav aria-label="Dashboard navigation" className="flex flex-wrap items-center justify-end gap-2">
                        {links.map((item) => (
                            <NavLink
                                key={item.label}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                    [
                                        'rounded-full px-4 py-2 text-sm transition',
                                        isActive
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
                                    ].join(' ')
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    <button
                        type="button"
                        aria-label="Settings"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 hover:bg-gray-100"
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
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 hover:bg-gray-100"
                    >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 21c1.8-3.2 4.3-5 8-5s6.2 1.8 8 5" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}