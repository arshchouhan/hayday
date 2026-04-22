import { NavLink } from 'react-router-dom';

function SidebarIcon({ optionKey }) {
    const common = 'h-4 w-4';

    if (optionKey.includes('calendar') || optionKey.includes('month') || optionKey.includes('event') || optionKey.includes('reminder')) {
        return (
            <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <path d="M3 10h18" />
            </svg>
        );
    }

    if (optionKey.includes('team') || optionKey.includes('people') || optionKey.includes('employee') || optionKey.includes('attendance')) {
        return (
            <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="9" cy="8" r="3" />
                <circle cx="17" cy="9" r="2.5" />
                <path d="M3 19c1.3-2.5 3.2-4 6-4s4.7 1.5 6 4" />
                <path d="M14 18c.8-1.6 2.1-2.5 3.9-2.5 1.7 0 3 .8 4.1 2.5" />
            </svg>
        );
    }

    if (optionKey.includes('device') || optionKey.includes('inventory') || optionKey.includes('maintenance') || optionKey.includes('assigned')) {
        return (
            <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="4" y="3" width="16" height="18" rx="2" />
                <path d="M9 7h6" />
                <path d="M11 17h2" />
            </svg>
        );
    }

    if (optionKey.includes('hiring') || optionKey.includes('pipeline') || optionKey.includes('interview') || optionKey.includes('role')) {
        return (
            <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 20h16" />
                <rect x="6" y="4" width="12" height="12" rx="2" />
                <path d="M10 8h4" />
                <path d="M10 12h4" />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v8" />
            <path d="M8 12h8" />
        </svg>
    );
}

export default function SuboptionsSidebar({ section, suboptions }) {
    return (
        <aside className="w-full" aria-label={`${section} suboptions`}>
            <nav className="flex flex-col gap-2" aria-label="Suboptions">
                {suboptions.map((option) => (
                    <NavLink
                        key={option.key}
                        to={option.to}
                        className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-gray-800 transition hover:bg-gray-100"
                    >
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full">
                            <SidebarIcon optionKey={option.key} />
                        </span>
                        <span className="font-medium">{option.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}