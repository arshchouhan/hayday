import { NavLink } from 'react-router-dom';

const links = [
    { label: 'Lifecycle', to: '/dashboard', end: true },
    { label: 'Health', to: '/dashboard/health' },
    { label: 'Breeding', to: '/dashboard/breeding' },
    { label: 'Pedigree', to: '/dashboard/pedigree' },
];

export default function Navbar() {
    return (
        <header className="bg-transparent">
            <div className="flex w-full items-center justify-between px-3 py-3 sm:px-4">
                <div className="flex items-center">
                    <div className="mr-3 md:w-44 lg:w-48">
                        <NavLink
                            to="/"
                            className="text-sm font-bold tracking-tight text-gray-900"
                            aria-label="Go to landing page"
                        >
                            HayDay
                        </NavLink>
                    </div>

                    <NavLink
                        to="/dashboard/people"
                        className={({ isActive }) =>
                            [
                                'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-lg ring-1 ring-black/10',
                                isActive
                                    ? 'bg-[#D7E3EF] text-slate-800'
                                    : 'bg-white text-gray-700 hover:bg-gray-50',
                            ].join(' ')
                        }
                    >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        <span>Register Animal</span>
                    </NavLink>
                </div>

                <div className="flex items-center justify-end gap-2">
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

                    <button
                        type="button"
                        aria-label="Settings"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-gray-700 hover:bg-gray-200"
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
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-gray-700 hover:bg-gray-200"
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