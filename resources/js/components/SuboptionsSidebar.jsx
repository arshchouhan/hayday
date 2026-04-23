import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

const dummyAnimals = [
    { name: 'Cows' },
    { name: 'Sheep' },
    { name: 'Hens' },
    { name: 'Goats' },
    { name: 'Buffaloes' },
    { name: 'Rabbits' },
];

function SidebarIcon({ optionKey }) {
    const common = 'h-5 w-5';

    if (optionKey.includes('all') || optionKey.includes('overview')) {
        return (
            <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M3 10.5 12 3l9 7.5" />
                <path d="M6.5 10v10h11V10" />
            </svg>
        );
    }

    if (optionKey.includes('calendar') || optionKey.includes('month') || optionKey.includes('event') || optionKey.includes('reminder')) {
        return (
            <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <path d="M3 10h18" />
            </svg>
        );
    }

    if (optionKey.includes('team') || optionKey.includes('people') || optionKey.includes('employee') || optionKey.includes('attendance')) {
        return (
            <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="9" cy="8" r="3" />
                <circle cx="17" cy="9" r="2.5" />
                <path d="M3 19c1.3-2.5 3.2-4 6-4s4.7 1.5 6 4" />
                <path d="M14 18c.8-1.6 2.1-2.5 3.9-2.5 1.7 0 3 .8 4.1 2.5" />
            </svg>
        );
    }

    if (optionKey.includes('device') || optionKey.includes('inventory') || optionKey.includes('maintenance') || optionKey.includes('assigned')) {
        return (
            <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="4" y="3" width="16" height="18" rx="2" />
                <path d="M9 7h6" />
                <path d="M11 17h2" />
            </svg>
        );
    }

    if (optionKey.includes('hiring') || optionKey.includes('pipeline') || optionKey.includes('interview') || optionKey.includes('role')) {
        return (
            <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M4 20h16" />
                <rect x="6" y="4" width="12" height="12" rx="2" />
                <path d="M10 8h4" />
                <path d="M10 12h4" />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v8" />
            <path d="M8 12h8" />
        </svg>
    );
}

function SideArrowIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="m9 6 6 6-6 6" />
        </svg>
    );
}

export default function SuboptionsSidebar({ section, suboptions, selectedAnimal, onSelectAnimal }) {
    const [isAllOpen, setIsAllOpen] = useState(false);

    useEffect(() => {
        if (section !== 'Dashboard') {
            setIsAllOpen(false);
            return;
        }

        setIsAllOpen(false);
        const timerId = window.setTimeout(() => {
            setIsAllOpen(true);
        }, 40);

        return () => window.clearTimeout(timerId);
    }, [section]);

    if (section === 'Dashboard') {
        return (
            <aside className="w-full" aria-label={`${section} suboptions`}>
                <div>
                    <button
                        type="button"
                        onClick={() => {
                            onSelectAnimal('All Animals');
                            setIsAllOpen((current) => !current);
                        }}
                        className={[
                            'flex w-full items-center justify-between gap-3 rounded-xl px-2 py-2 text-sm text-black transition hover:bg-[#DDE7F3]',
                            selectedAnimal === 'All Animals' ? 'bg-[#E9EEF6]' : '',
                        ].join(' ')}
                    >
                        <span className="inline-flex items-center gap-3">
                            <SideArrowIcon className={["h-4 w-4 text-black/60 transition-transform duration-300 ease-out", isAllOpen ? 'rotate-90' : ''].join(' ')} />
                            <span className="text-black/70">
                                <SidebarIcon optionKey="all" />
                            </span>
                            <span className="text-sm font-medium">All Animals</span>
                        </span>
                    </button>

                    <div
                        className={[
                            'grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                            isAllOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                        ].join(' ')}
                    >
                        <div className="overflow-hidden">
                            <ul className="ml-6 mt-1 space-y-1 border-l border-black/30 pl-4">
                                {dummyAnimals.map((animal) => (
                                    <li key={animal.name}>
                                        <button
                                            type="button"
                                            onClick={() => onSelectAnimal(animal.name)}
                                            className={[
                                                'flex w-full items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-left text-sm transition',
                                                selectedAnimal === animal.name
                                                    ? 'bg-[#E9EEF6] text-black'
                                                    : 'text-black/70 hover:border-white hover:bg-[#DDE7F3] hover:text-black',
                                            ].join(' ')}
                                        >
                                            <span>{animal.name}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </aside>
        );
    }

    return (
        <aside className="w-full" aria-label={`${section} suboptions`}>
            <nav className="flex flex-col gap-2" aria-label="Suboptions">
                {suboptions.map((option) => (
                    <NavLink
                        key={option.key}
                        to={option.to}
                        className={({ isActive }) =>
                            [
                                'flex items-center justify-between gap-3 rounded-lg border border-transparent px-2 py-2 text-sm transition',
                                isActive
                                    ? 'bg-[#E9EEF6] text-black font-medium'
                                    : 'text-black/85 hover:border-white hover:bg-[#DDE7F3] hover:text-black',
                            ].join(' ')
                        }
                    >
                        <span className="inline-flex items-center gap-3">
                            <SideArrowIcon className="h-4 w-4 text-black/60" />
                            <span className="text-black/70">
                                <SidebarIcon optionKey={option.key} />
                            </span>
                            <span className="font-medium">{option.label}</span>
                        </span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}