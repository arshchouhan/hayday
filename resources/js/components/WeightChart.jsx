import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

/* ── Dot tooltip rendered via portal ─────────────────────────────────────── */
function DotTooltip({ point, mouseX, mouseY }) {
    const TOOLTIP_W = 160;
    const OFFSET    = 16;
    const ref = useRef(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!ref.current) return;
        const h     = ref.current.offsetHeight;
        const above = mouseY - h - OFFSET > 0;
        const rawX  = mouseX - TOOLTIP_W / 2;
        const safeX = Math.max(8, Math.min(rawX, window.innerWidth - TOOLTIP_W - 8));
        const safeY = above ? mouseY - h - OFFSET : mouseY + OFFSET;
        setPos({ x: safeX, y: safeY });
    }, [mouseX, mouseY]);

    const formattedDate = new Date(point.date).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
    });

    return createPortal(
        <div
            ref={ref}
            className="pointer-events-none fixed z-[9999]"
            style={{ left: pos.x, top: pos.y, width: TOOLTIP_W }}
        >
            <div className="rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
                <div className="bg-[#1a1a2e] px-3 py-2">
                    <p className="text-[11px] font-black text-white/90 uppercase tracking-wider">
                        {point.weight} kg
                    </p>
                </div>
                <div className="px-3 py-2">
                    <p className="text-[11px] text-gray-500">{formattedDate}</p>
                    {point.label && (
                        <p className="text-[11px] font-semibold text-gray-700 mt-0.5">{point.label}</p>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}

/* ══════════════════════════════════════════════════════════════════════════
   WeightChart
   Props:
     weightData   – array from API: [{ date, weight, label }, …]
     currentWeight – number or string, shown above chart
     period        – '3m' | '6m' | '12m'
     onPeriodChange – callback
     loading       – bool
     onRecordClick  – callback to navigate to record weight page
══════════════════════════════════════════════════════════════════════════ */
export default function WeightChart({
    weightData = [],
    currentWeight,
    period,
    onPeriodChange,
    loading = false,
    onRecordClick,
}) {
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const [mouse, setMouse]           = useState(null);
    const svgRef = useRef(null);

    // Chart dimensions
    const CHART_H   = 220;   // px height of plot area
    const Y_LABEL_W = 56;    // px width reserved for Y-axis labels
    const X_LABEL_H = 32;    // px height reserved for X-axis labels
    const DOT_R     = 6;     // dot radius

    /* ── Build X-axis month columns ─────────────────────────── */
    const months = useMemo(() => {
        const count = period === '12m' ? 12 : period === '6m' ? 6 : 3;
        const result = [];
        for (let i = count - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(1);
            d.setMonth(d.getMonth() - i);
            result.push({
                key:   d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'),
                label: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                // timestamp of the 1st of this month (used for x-positioning)
                ts: d.getTime(),
            });
        }
        return result;
    }, [period]);

    /* ── Compute Y-axis scale ────────────────────────────────── */
    const { yMin, yMax, yTicks } = useMemo(() => {
        if (weightData.length === 0) {
            // Default scale when no data
            return { yMin: 0, yMax: 100, yTicks: [0, 25, 50, 75, 100] };
        }
        const weights = weightData.map(d => d.weight);
        const rawMin  = Math.min(...weights);
        const rawMax  = Math.max(...weights);
        const padding = Math.max((rawMax - rawMin) * 0.3, 2);  // at least 2 kg padding
        const step    = rawMax === rawMin ? 2 : Math.ceil((rawMax - rawMin + padding * 2) / 4 / 2) * 2;

        const niceMin = Math.floor((rawMin - padding) / step) * step;
        const niceMax = niceMin + step * 4;

        const ticks = [];
        for (let v = niceMin; v <= niceMax + 0.01; v += step) {
            ticks.push(Math.round(v * 10) / 10);
        }

        return { yMin: niceMin, yMax: niceMax, yTicks: ticks };
    }, [weightData]);

    /* ── Map a weight value to Y pixel ──────────────────────── */
    const toY = (w) => {
        const ratio = (w - yMin) / (yMax - yMin);
        return CHART_H - ratio * CHART_H;
    };

    /* ── Map a date string to X pixel (within [0, chartWidth]) ─ */
    const toX = (dateStr, chartWidth) => {
        if (months.length === 0) return 0;
        const t       = new Date(dateStr).getTime();
        const tStart  = months[0].ts;
        // end = first day of month AFTER last month
        const lastM   = months[months.length - 1];
        const tEnd    = new Date(lastM.ts).setMonth(new Date(lastM.ts).getMonth() + 1);
        const ratio   = (t - tStart) / (tEnd - tStart);
        return Math.max(0, Math.min(chartWidth, ratio * chartWidth));
    };

    /* ── Month column x positions (for grid lines & labels) ──── */
    const getColX = (monthIdx, chartWidth) => {
        const total = months.length;
        return (monthIdx / total) * chartWidth;
    };

    const periods = [
        { label: '3 Months',  value: '3m'  },
        { label: '6 Months',  value: '6m'  },
        { label: '12 Months', value: '12m' },
    ];

    const displayWeight = weightData.length > 0
        ? weightData[weightData.length - 1].weight
        : currentWeight;

    /* ── Render ──────────────────────────────────────────────── */
    return (
        <div className="rounded-lg border border-[#80888F] bg-white p-6 space-y-4">
            {/* ── Header row ── */}
            <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[15px] font-bold text-[#1a1a2e]">
                    Weight Over Time
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-[11px] text-gray-400 cursor-help select-none">?</span>
                </span>

                {/* Period toggle — pill style matching the image */}
                <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-[#F8FAFD] p-1">
                    {periods.map(p => (
                        <button
                            key={p.value}
                            onClick={() => onPeriodChange && onPeriodChange(p.value)}
                            className={`rounded-full px-5 py-1.5 text-[12px] font-bold transition-all ${
                                period === p.value
                                    ? 'bg-[#1a1a2e] text-white shadow-sm'
                                    : 'text-gray-500 hover:text-[#1a1a2e]'
                            }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Current weight sub-line ── */}
            <div className="text-[14px] font-semibold text-[#1a1a2e]">
                Current Weight{' '}
                <span className="text-[#059669] font-bold">
                    {displayWeight ?? '—'} kg
                </span>
            </div>

            {/* ── Chart or empty state ── */}
            {loading ? (
                <div className="flex items-center justify-center h-[260px]">
                    <div className="h-8 w-8 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin" />
                </div>
            ) : weightData.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 py-14 text-center space-y-3">
                    <svg viewBox="0 0 24 24" className="h-10 w-10 text-gray-300 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 3v18h18" />
                        <path d="M7 16l4-4 4 4 4-6" />
                    </svg>
                    <p className="text-[14px] font-bold text-gray-400">No Weight Records Available</p>
                    <p className="text-[13px] text-gray-400 max-w-xs">
                        Start tracking weight trends by recording a measurement
                    </p>
                    {onRecordClick && (
                        <button
                            onClick={onRecordClick}
                            className="flex items-center gap-2 rounded-full border border-[#80888F] px-6 py-2 text-[13px] font-bold text-[#1a1a2e] hover:bg-[#E9EEF6] transition-all"
                        >
                            <span className="text-lg leading-none">+</span>
                            Record Weight Measurement
                        </button>
                    )}
                </div>
            ) : (
                /* ── SVG chart — fully responsive via viewBox ── */
                <div className="w-full">
                    <svg
                        ref={svgRef}
                        width="100%"
                        viewBox={`0 0 700 ${CHART_H + X_LABEL_H}`}
                        preserveAspectRatio="none"
                        className="overflow-visible"
                        style={{ display: 'block' }}
                    >
                        {/* ── Define chart plot area (right of Y labels) ── */}
                        {(() => {
                            const chartW = 700 - Y_LABEL_W;

                            return (
                                <g>
                                    {/* ── Y-axis tick labels ── */}
                                    {[...yTicks].reverse().map((v, i) => (
                                        <text
                                            key={i}
                                            x={Y_LABEL_W - 8}
                                            y={toY(v) + 4}
                                            textAnchor="end"
                                            fontSize={11}
                                            fill="#9CA3AF"
                                            fontWeight="500"
                                        >
                                            {v} kg
                                        </text>
                                    ))}

                                    {/* ── Plot area border ── */}
                                    <rect
                                        x={Y_LABEL_W}
                                        y={0}
                                        width={chartW}
                                        height={CHART_H}
                                        fill="white"
                                        stroke="#E5E7EB"
                                        strokeWidth={1}
                                    />

                                    {/* ── Horizontal grid lines (one per Y tick) ── */}
                                    {yTicks.map((v, i) => (
                                        <line
                                            key={i}
                                            x1={Y_LABEL_W}
                                            x2={Y_LABEL_W + chartW}
                                            y1={toY(v)}
                                            y2={toY(v)}
                                            stroke="#E5E7EB"
                                            strokeWidth={1}
                                        />
                                    ))}

                                    {/* ── Vertical grid lines (one per month) ── */}
                                    {months.map((m, mi) => {
                                        const x = Y_LABEL_W + getColX(mi, chartW);
                                        return (
                                            <line
                                                key={m.key}
                                                x1={x}
                                                x2={x}
                                                y1={0}
                                                y2={CHART_H}
                                                stroke="#E5E7EB"
                                                strokeWidth={1}
                                            />
                                        );
                                    })}

                                    {/* ── X-axis month labels ── */}
                                    {months.map((m, mi) => {
                                        const x = Y_LABEL_W + getColX(mi, chartW) + (chartW / months.length) / 2;
                                        return (
                                            <text
                                                key={m.key}
                                                x={x}
                                                y={CHART_H + X_LABEL_H - 8}
                                                textAnchor="middle"
                                                fontSize={11}
                                                fill="#9CA3AF"
                                                fontWeight="500"
                                            >
                                                {m.label}
                                            </text>
                                        );
                                    })}

                                    {/* ── Connecting line between dots ── */}
                                    {weightData.length > 1 && (() => {
                                        const pts = weightData
                                            .filter(d => {
                                                const mk = d.date.slice(0, 7);
                                                return months.some(m => m.key === mk || d.date >= months[0].key);
                                            })
                                            .map(d => ({
                                                x: Y_LABEL_W + toX(d.date, chartW),
                                                y: toY(d.weight),
                                            }));
                                        if (pts.length < 2) return null;
                                        const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                                        return (
                                            <path
                                                d={d}
                                                fill="none"
                                                stroke="#10B981"
                                                strokeWidth={1.5}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                opacity={0.5}
                                            />
                                        );
                                    })()}

                                    {/* ── Data dots ── */}
                                    {weightData.map((d, i) => {
                                        const cx = Y_LABEL_W + toX(d.date, chartW);
                                        const cy = toY(d.weight);
                                        const isHovered = hoveredIdx === i;
                                        return (
                                            <g key={i}>
                                                {/* Invisible larger hit area */}
                                                <circle
                                                    cx={cx}
                                                    cy={cy}
                                                    r={14}
                                                    fill="transparent"
                                                    style={{ cursor: 'pointer' }}
                                                    onMouseMove={e => {
                                                        setHoveredIdx(i);
                                                        setMouse({ x: e.clientX, y: e.clientY });
                                                    }}
                                                    onMouseLeave={() => {
                                                        setHoveredIdx(null);
                                                        setMouse(null);
                                                    }}
                                                />
                                                {/* Outer glow ring on hover */}
                                                {isHovered && (
                                                    <circle
                                                        cx={cx}
                                                        cy={cy}
                                                        r={DOT_R + 4}
                                                        fill="#10B98122"
                                                        stroke="#10B981"
                                                        strokeWidth={1}
                                                    />
                                                )}
                                                {/* Main dot */}
                                                <circle
                                                    cx={cx}
                                                    cy={cy}
                                                    r={DOT_R}
                                                    fill="#10B981"
                                                    stroke="white"
                                                    strokeWidth={isHovered ? 2 : 1.5}
                                                    style={{ pointerEvents: 'none' }}
                                                />
                                            </g>
                                        );
                                    })}
                                </g>
                            );
                        })()}
                    </svg>

                    {/* Portal tooltip */}
                    {hoveredIdx !== null && mouse && weightData[hoveredIdx] && (
                        <DotTooltip
                            point={weightData[hoveredIdx]}
                            mouseX={mouse.x}
                            mouseY={mouse.y}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
