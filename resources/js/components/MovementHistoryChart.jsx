import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle } from 'lucide-react';

/* ── Color config ────────────────────────────────────────────────────────── */
const CFG = {
    location: { bg: '#10B981', border: '#059669', label: 'Location Move'   },
    group:    { bg: '#8B5CF6', border: '#7C3AED', label: 'Group Transfer'  },
    unknown:  { bg: '#6B7280', border: '#4B5563', label: 'Movement'        },
};
const getCfg = (type) => CFG[type] ?? CFG.unknown;

/* ────────────────────────────────────────────────────────────────────────────
   buildSpans(movements, entityKey, today)
   entityKey = 'location' | 'group'
   Each movement must have: { id, date, [entityKey]: { id, name }, notes, type }
   Returns: [{ entity: {id,name}, arrivalDate, departureDate, notes, type }]
────────────────────────────────────────────────────────────────────────────── */
function buildSpans(movements, entityKey, today) {
    if (!movements?.length) return [];
    const sorted = [...movements].sort((a, b) => new Date(a.date) - new Date(b.date));
    const spans  = [];
    for (let i = 0; i < sorted.length; i++) {
        const m      = sorted[i];
        const entity = m[entityKey];
        if (!entity?.id) continue;
        const departure = sorted[i + 1]?.date ?? today;
        spans.push({
            entity,
            arrivalDate:   m.date,
            departureDate: departure,
            notes:         m.notes,
            type:          m.type ?? entityKey,
        });
    }
    return spans;
}

/* ── Does a span overlap a calendar month? ───────────────────────────────── */
function spanOverlapsMonth(span, monthKey) {
    const [yr, mo]   = monthKey.split('-').map(Number);
    const monthStart = new Date(yr, mo - 1, 1);
    const monthEnd   = new Date(yr, mo, 0);
    const arrival    = new Date(span.arrivalDate);
    const departure  = new Date(span.departureDate);
    return arrival <= monthEnd && departure >= monthStart;
}

/* ── Portal tooltip ──────────────────────────────────────────────────────── */
function SpanTooltip({ span, monthLabel, mouseX, mouseY }) {
    const W = 224, OFFSET = 18;
    const ref = useRef(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!ref.current) return;
        const h     = ref.current.offsetHeight;
        const above = mouseY - h - OFFSET > 0;
        const safeX = Math.max(8, Math.min(mouseX - W / 2, window.innerWidth - W - 8));
        const safeY = above ? mouseY - h - OFFSET : mouseY + OFFSET;
        setPos({ x: safeX, y: safeY });
    }, [mouseX, mouseY]);

    const cfg       = getCfg(span.type);
    const isGroup   = span.type === 'group';
    const entityLabel = span.entity?.name ?? '—';

    const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const isToday = span.departureDate === new Date().toISOString().split('T')[0];

    return createPortal(
        <div ref={ref} className="pointer-events-none fixed z-[9999]" style={{ left: pos.x, top: pos.y, width: W }}>
            <div className="rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
                <div style={{ height: 3, backgroundColor: cfg.bg }} />
                <div className="bg-[#1a1a2e] px-3 py-2">
                    <p className="text-[11px] font-black text-white/90 uppercase tracking-wider truncate">
                        {isGroup ? '👥 ' : '📍 '}{entityLabel}
                    </p>
                    <p className="text-[10px] text-white/50 mt-0.5">{monthLabel}</p>
                </div>
                <div className="px-3 py-2.5 space-y-1.5">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.bg }} />
                        <p className="text-[12px] font-bold text-[#1a1a2e]">{cfg.label}</p>
                    </div>
                    <div className="pl-4 space-y-0.5">
                        <p className="text-[11px] text-gray-500">
                            <span className="font-semibold text-gray-700">
                                {isGroup ? 'Joined:' : 'Arrived:'}
                            </span>{' '}{fmt(span.arrivalDate)}
                        </p>
                        <p className="text-[11px] text-gray-500">
                            <span className="font-semibold text-gray-700">
                                {isToday ? 'Status:' : (isGroup ? 'Left:' : 'Departed:')}
                            </span>{' '}
                            {isToday
                                ? <span className="text-emerald-600 font-bold">Currently here</span>
                                : fmt(span.departureDate)}
                        </p>
                    </div>
                    {span.notes && (
                        <p className="text-[11px] text-gray-500 italic pl-4 line-clamp-2 pt-0.5">
                            &ldquo;{span.notes}&rdquo;
                        </p>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}

/* ── Single Gantt cell ───────────────────────────────────────────────────── */
function GanttCell({ span, monthLabel, isAlt, isFirst, isLast, rowH = 44 }) {
    const [mouse, setMouse] = useState(null);
    const bg = isAlt ? '#F9FAFB' : '#FFFFFF';

    if (!span) {
        return (
            <div
                className="flex-1 min-w-[80px] border-r border-gray-100 last:border-r-0"
                style={{ backgroundColor: bg, height: rowH }}
            />
        );
    }

    const cfg    = getCfg(span.type);
    const radius = isFirst && isLast ? 4
                 : isFirst           ? '4px 0 0 4px'
                 : isLast            ? '0 4px 4px 0'
                 : 0;

    return (
        <div
            className="flex-1 min-w-[80px] border-r border-gray-100 last:border-r-0 flex items-center"
            style={{ backgroundColor: bg, height: rowH, paddingLeft: isFirst ? 4 : 0, paddingRight: isLast ? 4 : 0 }}
            onMouseMove={e => setMouse({ x: e.clientX, y: e.clientY })}
            onMouseLeave={() => setMouse(null)}
        >
            <div
                className="w-full cursor-pointer transition-opacity hover:opacity-80"
                style={{
                    height: 20,
                    backgroundColor: cfg.bg,
                    borderRadius: radius,
                    boxShadow: `0 1px 4px ${cfg.bg}44`,
                    opacity: 0.92,
                }}
            />
            {mouse && (
                <SpanTooltip span={span} monthLabel={monthLabel} mouseX={mouse.x} mouseY={mouse.y} />
            )}
        </div>
    );
}

/* ── Section divider row ─────────────────────────────────────────────────── */
function SectionLabel({ icon, label, colCount }) {
    return (
        <div className="flex border-b border-gray-100 bg-gray-50">
            <div className="w-40 flex-shrink-0 px-0 py-1.5 flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{icon} {label}</span>
            </div>
            {Array.from({ length: colCount }).map((_, i) => (
                <div key={i} className="flex-1 min-w-[80px] border-r border-gray-100 last:border-r-0 bg-gray-50" style={{ height: 28 }} />
            ))}
        </div>
    );
}

/* ── Legend item ─────────────────────────────────────────────────────────── */
function LegendItem({ type }) {
    const cfg = getCfg(type);
    return (
        <div className="flex items-center gap-2">
            <div style={{ width: 26, height: 10, backgroundColor: cfg.bg, borderRadius: 3, opacity: 0.92 }} />
            <span className="text-[12px] font-semibold text-[#374151]">{cfg.label}</span>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════════════════
   Main Component
   Props:
     movements      – location movement records (sorted by backend)
     groupMovements – group movement records (sorted by backend)
     onPeriodChange – callback
══════════════════════════════════════════════════════════════════════════ */
export default function MovementHistoryChart({ movements = [], groupMovements = [], onPeriodChange }) {
    const [period, setPeriod] = useState('3m');
    const today = new Date().toISOString().split('T')[0];

    /* ── Deduplicate helpers ─────────────────────────────────── */
    const dedup = (arr) => {
        const seen = new Set();
        return arr.filter(m => {
            if (!m.id || seen.has(m.id)) return false;
            seen.add(m.id);
            return true;
        });
    };

    const sortedLocMoves   = useMemo(() => dedup(movements).sort((a,b) => new Date(a.date) - new Date(b.date)), [movements]);
    const sortedGroupMoves = useMemo(() => dedup(groupMovements).sort((a,b) => new Date(a.date) - new Date(b.date)), [groupMovements]);

    /* ── Build spans ─────────────────────────────────────────── */
    const locSpans   = useMemo(() => buildSpans(sortedLocMoves,   'location', today), [sortedLocMoves,   today]);
    const groupSpans = useMemo(() => buildSpans(sortedGroupMoves, 'group',    today), [sortedGroupMoves, today]);

    /* ── Unique entities per section ─────────────────────────── */
    const locations = useMemo(() => {
        const map = new Map();
        locSpans.forEach(s => { if (s.entity?.id && !map.has(s.entity.id)) map.set(s.entity.id, s.entity); });
        return Array.from(map.values());
    }, [locSpans]);

    const groups = useMemo(() => {
        const map = new Map();
        groupSpans.forEach(s => { if (s.entity?.id && !map.has(s.entity.id)) map.set(s.entity.id, s.entity); });
        return Array.from(map.values());
    }, [groupSpans]);

    /* ── Month columns ───────────────────────────────────────── */
    const months = useMemo(() => {
        const count = period === '12m' ? 12 : period === '6m' ? 6 : 3;
        const result = [];
        for (let i = count - 1; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            result.push({
                key:   d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'),
                label: d.toLocaleDateString('en-US', { month: 'short', year: count > 3 ? 'numeric' : undefined }).trim(),
            });
        }
        return result;
    }, [period]);

    /* ── Lookup helpers ──────────────────────────────────────── */
    const getLocSpan   = (entityId, mk) => locSpans.find(s => s.entity?.id === entityId && spanOverlapsMonth(s, mk)) ?? null;
    const getGroupSpan = (entityId, mk) => groupSpans.find(s => s.entity?.id === entityId && spanOverlapsMonth(s, mk)) ?? null;

    const isArrival   = (span, mk) => span && span.arrivalDate.startsWith(mk);
    const isDeparture = (span, mk) => span && span.departureDate.startsWith(mk);

    const handlePeriodChange = (p) => { setPeriod(p); if (onPeriodChange) onPeriodChange(p); };

    const periods = [
        { label: '3 Months', value: '3m' },
        { label: '6 Months', value: '6m' },
        { label: '12 Months', value: '12m' },
    ];

    const hasData = locations.length > 0 || groups.length > 0;

    /* ── Render ──────────────────────────────────────────────── */
    return (
        <div className="bg-white rounded-lg border border-[#80888F] p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="text-[16px] font-black text-[#1a1a2e]">Movement History</h3>
                    <div className="group relative">
                        <HelpCircle size={16} className="text-gray-400 cursor-help" />
                        <div className="absolute bottom-full left-0 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-2.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl leading-relaxed">
                            Each row shows how long the animal stayed at a location or group. Hover a bar for details.
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {periods.map(p => (
                        <button
                            key={p.value}
                            onClick={() => handlePeriodChange(p.value)}
                            className={`rounded-full px-4 py-1.5 text-[12px] font-bold transition-all ${
                                period === p.value
                                    ? 'bg-[#1a1a2e] text-white shadow-sm'
                                    : 'border border-gray-300 text-gray-600 hover:border-gray-400'
                            }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart */}
            {!hasData ? (
                <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-12 text-center">
                    <p className="text-[13px] font-bold text-gray-400">No movement history</p>
                    <p className="text-[12px] text-gray-400 mt-1">Record location or group movements to see the chart</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <div className="min-w-max">
                        {/* X-axis month headers */}
                        <div className="flex border-b border-gray-200">
                            <div className="w-40 flex-shrink-0" />
                            {months.map(m => (
                                <div
                                    key={m.key}
                                    className="flex-1 min-w-[80px] text-center py-2 text-[11px] font-semibold text-[#6B7280] border-r border-gray-100 last:border-r-0"
                                >
                                    {m.label}
                                </div>
                            ))}
                        </div>

                        {/* ── Location rows ── */}
                        {locations.length > 0 && (
                            <>
                                <SectionLabel icon="📍" label="Locations" colCount={months.length} />
                                {locations.map((loc) => (
                                    <div
                                        key={loc.id}
                                        className="flex items-center border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                                    >
                                        <div className="w-40 flex-shrink-0 pr-3 text-[13px] font-semibold text-[#374151] truncate">
                                            {loc.name}
                                        </div>
                                        {months.map((m, mIdx) => {
                                            const span = getLocSpan(loc.id, m.key);
                                            return (
                                                <GanttCell
                                                    key={m.key}
                                                    span={span}
                                                    monthLabel={m.label}
                                                    isAlt={mIdx % 2 !== 0}
                                                    isFirst={isArrival(span, m.key)}
                                                    isLast={isDeparture(span, m.key)}
                                                />
                                            );
                                        })}
                                    </div>
                                ))}
                            </>
                        )}

                        {/* ── Group rows ── */}
                        {groups.length > 0 && (
                            <>
                                <SectionLabel icon="👥" label="Groups" colCount={months.length} />
                                {groups.map((grp) => (
                                    <div
                                        key={grp.id}
                                        className="flex items-center border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                                    >
                                        <div className="w-40 flex-shrink-0 pr-3 text-[13px] font-semibold text-[#374151] truncate">
                                            {grp.name}
                                        </div>
                                        {months.map((m, mIdx) => {
                                            const span = getGroupSpan(grp.id, m.key);
                                            return (
                                                <GanttCell
                                                    key={m.key}
                                                    span={span}
                                                    monthLabel={m.label}
                                                    isAlt={mIdx % 2 !== 0}
                                                    isFirst={isArrival(span, m.key)}
                                                    isLast={isDeparture(span, m.key)}
                                                />
                                            );
                                        })}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Legend */}
            {hasData && (
                <div className="flex flex-wrap items-center gap-5 border-t border-gray-100 pt-4">
                    {locations.length > 0 && <LegendItem type="location" />}
                    {groups.length   > 0 && <LegendItem type="group"    />}
                    <span className="ml-auto text-[11px] text-gray-400">Bar = period at that location / group</span>
                </div>
            )}
        </div>
    );
}
