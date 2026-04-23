import { useMemo, useState, useEffect } from 'react';

const cattleSeed = [
    {
        id: '#10638905',
        type: 'Cow',
        maturedOn: 'Matured on 2017 JUN 22',
        produceMilk: true,
        onHeatWith: '#143112370',
        needVaccine: 'Need Vaccine 2019 NOV 1',
    },
    {
        id: '#11749016',
        type: 'Cow',
        maturedOn: 'Bought on 2019 FEB 8',
        produceMilk: false,
        onHeatWith: null,
        needVaccine: 'Need Vaccine 2019 OCT 18',
    },
    {
        id: '#12850127',
        type: 'Ox',
        maturedOn: 'Matured on 2019 APR 14',
        produceMilk: false,
        onHeatWith: '#11749016',
        needVaccine: null,
    },
    {
        id: '#15183450',
        type: 'Ox',
        maturedOn: 'Matured on 2018 MAR 28',
        produceMilk: false,
        onHeatWith: null,
        needVaccine: null,
    },
    {
        id: '#16294561',
        type: 'Calf',
        maturedOn: 'Born on 2019 SEP 29',
        produceMilk: false,
        onHeatWith: null,
        needVaccine: 'Need Vaccine 2019 NOV 1',
    },
    {
        id: '#14073349',
        type: 'Cow',
        maturedOn: 'Matured on 2017 JUN 22',
        produceMilk: true,
        onHeatWith: null,
        needVaccine: null,
    },
    {
        id: '#11749012',
        type: 'Cow',
        maturedOn: 'Bought on 2019 FEB 8',
        produceMilk: false,
        onHeatWith: null,
        needVaccine: null,
    },
    {
        id: '#12850151',
        type: 'Ox',
        maturedOn: 'Matured on 2019 APR 14',
        produceMilk: false,
        onHeatWith: '#11749016',
        needVaccine: null,
    },
    {
        id: '#15183482',
        type: 'Ox',
        maturedOn: 'Matured on 2018 MAR 28',
        produceMilk: false,
        onHeatWith: null,
        needVaccine: null,
    },
    {
        id: '#16294588',
        type: 'Calf',
        maturedOn: 'Born on 2019 SEP 29',
        produceMilk: false,
        onHeatWith: null,
        needVaccine: null,
    },
    {
        id: '#15183436',
        type: 'Ox',
        maturedOn: 'Matured on 2018 MAR 28',
        produceMilk: false,
        onHeatWith: null,
        needVaccine: null,
    },
    {
        id: '#14073340',
        type: 'Cow',
        maturedOn: 'Matured on 2017 JUN 22',
        produceMilk: true,
        onHeatWith: null,
        needVaccine: null,
    },
];

const typeDot = {
    Cow: 'bg-emerald-500',
    Ox: 'bg-blue-600',
    Calf: 'bg-orange-400',
};

const month = 'DEC';
const year = '2019';

function SmallRadio({ label, checked, onChange }) {
    return (
        <label className="inline-flex items-center gap-2 text-xs text-slate-600">
            <span
                className={[
                    'inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border transition-colors',
                    checked ? 'border-blue-300 bg-[#D7E3EF]' : 'border-slate-300 bg-white',
                ].join(' ')}
            >
                {checked && <span className="h-1.5 w-1.5 rounded-full bg-white shadow-sm" />}
            </span>
            <input type="radio" className="hidden" checked={checked} onChange={onChange} />
            {label}
        </label>
    );
}

function StyledSelect({ value, className = '' }) {
    return (
        <button
            type="button"
            className={[
                'flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700',
                className,
            ].join(' ')}
        >
            <span>{value}</span>
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
            </svg>
        </button>
    );
}

function MiniCalendar() {
    const weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
        <div className="rounded-xl border border-[#D7E3EF] bg-white p-3">
            <div className="mb-3 flex items-center justify-between text-[10px] font-semibold text-slate-500">
                <span>{year} {month}</span>
                <div className="flex items-center gap-1">
                    <button type="button" className="rounded border border-slate-200 px-1 text-slate-400">&lt;</button>
                    <button type="button" className="rounded border border-slate-200 px-1 text-slate-400">&gt;</button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-semibold text-slate-400">
                {weekdays.map((day) => (
                    <span key={day}>{day}</span>
                ))}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[10px] text-slate-600">
                {days.map((day) => {
                    const isPrimary = day === 23;
                    const isSecondary = day === 31;
                    return (
                        <span
                            key={day}
                            className={[
                                'inline-flex h-5 items-center justify-center rounded-full',
                                isPrimary ? 'bg-orange-400 text-white' : '',
                                isSecondary ? 'bg-orange-300 text-white' : '',
                            ].join(' ')}
                        >
                            {day}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

function StatusTag({ text, tone = 'neutral', icon = null }) {
    const toneClass = {
        neutral: 'bg-[#FFFFFF] text-[#475569]',
        mint: 'bg-[#FFFFFF] text-[#475569]',
        pink: 'bg-[#FFFFFF] text-[#475569]',
        alert: 'bg-[#FFFFFF] text-[#475569]',
    };

    return (
        <span className={['inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold ring-1 ring-[#757D83]', toneClass[tone]].join(' ')}>
            {icon}
            {text}
        </span>
    );
}

export default function ManageCattleDashboard({ selectedAnimal, onSelectAnimal }) {
    const [filter, setFilter] = useState('All Animals');
    const [query, setQuery] = useState('');
    const [selectedId, setSelectedId] = useState('#11749016');

    // Sync internal filter with sidebar selection
    useEffect(() => {
        if (selectedAnimal === 'All Animals') {
            setFilter('All Animals');
        } else if (selectedAnimal === 'Cows') {
            setFilter('Cow');
        } else {
            setFilter(selectedAnimal);
        }
    }, [selectedAnimal]);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        if (newFilter === 'Cow') onSelectAnimal('Cows');
        else if (newFilter === 'All Animals') onSelectAnimal('All Animals');
        else onSelectAnimal(newFilter);
    };

    const filtered = useMemo(() => {
        return cattleSeed.filter((item) => {
            const typeMatch = filter === 'All Animals' || item.type === filter;
            const queryMatch = query.trim() === '' || item.id.toLowerCase().includes(query.toLowerCase());
            return typeMatch && queryMatch;
        });
    }, [filter, query]);

    const selected = filtered.find((item) => item.id === selectedId) ?? filtered[0] ?? cattleSeed[0];

    return (
        <section className="h-full min-h-0 w-full rounded-md bg-[#E9EEF6]">
            <div className="grid h-full min-h-0 grid-cols-1 overflow-hidden rounded-md border border-[#D7E3EF] bg-[#F8FAFD]">
                <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="flex min-h-0 flex-col border-r border-[#D7E3EF] bg-[#F8FAFD] p-4">
                        <div className="mb-3 flex items-center gap-2 text-slate-700">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-orange-100 text-orange-500">
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                                    <circle cx="6" cy="12" r="2.5" />
                                    <circle cx="12" cy="12" r="2.5" />
                                    <circle cx="18" cy="12" r="2.5" />
                                </svg>
                            </span>
                            <h2 className="text-sm font-semibold">Manage {selectedAnimal}</h2>
                            <span className="text-xs font-semibold text-orange-500">175</span>
                        </div>

                        <div className="mb-3 flex items-center rounded-lg border border-slate-200 bg-white px-2">
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search Traceability Code"
                                className="w-full bg-transparent px-2 py-2 text-xs text-slate-700 outline-none"
                            />
                            <button type="button" className="text-slate-500">
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <circle cx="11" cy="11" r="7" />
                                    <path d="m20 20-3.5-3.5" />
                                </svg>
                            </button>
                        </div>

                        <div className="scrollbar-hide min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                            {filtered.map((item) => {
                                const selectedCard = selected?.id === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setSelectedId(item.id)}
                                        className={[
                                            'w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-left transition hover:border-[#D7E3EF] hover:shadow-sm',
                                            selectedCard ? 'border-l-4 border-l-[#D7E3EF] bg-[#f0f7ff]' : '',
                                        ].join(' ')}
                                    >
                                        <div className="mb-2 flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-bold text-slate-800">{item.id}</h3>
                                                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                                                    <span className={['h-2 w-2 rounded-full', typeDot[item.type]].join(' ')} />
                                                    {item.type}
                                                </span>
                                            </div>
                                            {selectedCard ? <span className="text-[10px] font-semibold text-slate-500">Editing Now</span> : null}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-1.5">
                                            <StatusTag text={item.maturedOn} />
                                            {item.produceMilk ? <StatusTag text="Produce Milk" tone="mint" /> : null}
                                            {item.onHeatWith ? (
                                                <StatusTag
                                                    text={`On Heat with ${item.onHeatWith}`}
                                                    tone="pink"
                                                />
                                            ) : null}
                                            {item.needVaccine ? <StatusTag text={item.needVaccine} tone="alert" /> : null}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <aside className="flex min-h-0 flex-col bg-[#F8FAFD] p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-slate-700">Edit</h3>
                            <input
                                readOnly
                                value={selected.id}
                                className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700"
                            />
                        </div>

                        <div className="scrollbar-hide space-y-3 overflow-y-auto pr-1 text-xs">
                            <div>
                                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Sorting</p>
                                <div className="rounded-lg bg-[#F2F5FB] p-2">
                                    <div className="flex gap-4">
                                        {['Cow', 'Ox', 'Calf'].map((item) => (
                                            <SmallRadio key={item} label={item} checked={selected.type === item} onChange={() => { }} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">How to join the farm</p>
                                <div className="rounded-lg bg-[#F2F5FB] p-2">
                                    <div className="mb-2 flex gap-4">
                                        <SmallRadio label="Bought" checked={true} onChange={() => { }} />
                                        <SmallRadio label="Matured" checked={false} onChange={() => { }} />
                                    </div>
                                    <StyledSelect value="2016 / FEB / 8" />
                                </div>
                            </div>

                            <div>
                                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Status</p>
                                <div className="rounded-lg bg-[#F2F5FB] p-2">
                                    <div className="mb-2 flex flex-wrap gap-3">
                                        <SmallRadio label="On Heat" checked={false} onChange={() => { }} />
                                        <SmallRadio label="Pregnant" checked={true} onChange={() => { }} />
                                        <SmallRadio label="Produce Milk" checked={false} onChange={() => { }} />
                                        <SmallRadio label="Normal State" checked={false} onChange={() => { }} />
                                    </div>
                                    <p className="mb-1 text-[10px] text-slate-400">Will deliver</p>
                                    <StyledSelect value="2019 / DEC / 15" />
                                </div>
                            </div>

                            <div>
                                <div className="mb-1 flex items-center justify-between">
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Add Schedule</p>
                                    <button type="button" className="rounded-md bg-[#D7E3EF] px-2 py-1 text-[10px] font-semibold text-slate-700">+ Add More</button>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-white p-2">
                                    <label className="mb-2 inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
                                        <input type="checkbox" checked readOnly className="accent-[#D7E3EF]" />
                                        Insemination
                                    </label>
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-[1fr_84px] gap-2">
                                            <StyledSelect value="2019 / DEC / 15" />
                                            <input value="#14073949" readOnly className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-[11px] text-slate-700" />
                                        </div>
                                        <div className="grid grid-cols-[1fr_84px] gap-2">
                                            <StyledSelect value="2019 / DEC / 21" />
                                            <input value="#13968238" readOnly className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-[11px] text-slate-700" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="rounded-lg border border-[#D7E3EF] bg-white p-2">
                                    <div className="mb-2 flex items-center justify-between">
                                        <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
                                            <input type="checkbox" checked readOnly className="accent-[#D7E3EF]" />
                                            Medical Treatment
                                        </label>
                                        <StyledSelect value="Need Vaccine" className="w-32" />
                                    </div>
                                    <MiniCalendar />
                                    <div className="mt-2 grid grid-cols-2 gap-y-1 text-xs text-slate-500">
                                        {['Others', 'None', 'Sell', 'Dead'].map((item) => (
                                            <label key={item} className="inline-flex items-center gap-2">
                                                <input type="checkbox" className="accent-[#D7E3EF]" />
                                                {item}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-[#D7E3EF] pt-3">
                            <button type="button" className="text-sm font-semibold text-slate-700">Cancel</button>
                            <button type="button" className="rounded-lg bg-[#D7E3EF] px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-[#c5d3e3]">Update</button>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
}
