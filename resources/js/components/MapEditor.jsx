import React, { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import { Map as MapIcon, Fence, Weight, Users, Maximize, X, Square, Trash2, Navigation, Loader2 } from 'lucide-react';
import Map, { NavigationControl, useControl, Popup, Marker } from 'react-map-gl/maplibre';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import maplibregl from 'maplibre-gl';
import * as turf from '@turf/turf';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import 'maplibre-gl/dist/maplibre-gl.css';

// ESRI Satellite Style (No token required)
const FREE_SATELLITE_STYLE = {
    version: 8,
    sources: {
        'esri-satellite': {
            type: 'raster',
            tiles: [
                'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256,
            attribution: 'Esri, Maxar, Earthstar Geographics, and the GIS User Community'
        }
    },
    layers: [
        {
            id: 'satellite-layer',
            type: 'raster',
            source: 'esri-satellite',
            minzoom: 0,
            maxzoom: 22
        }
    ]
};

// PATCHED MapboxDraw Styles for MapLibre (NO DASHARRAYS)
const DRAW_STYLES = [
    {
        'id': 'gl-draw-polygon-fill.cold',
        'type': 'fill',
        'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
        'paint': { 'fill-color': '#00B4D8', 'fill-opacity': 0.1 }
    },
    {
        'id': 'gl-draw-polygon-fill.hot',
        'type': 'fill',
        'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
        'paint': { 'fill-color': '#00B4D8', 'fill-opacity': 0.3 }
    },
    {
        'id': 'gl-draw-polygon-stroke-inactive.cold',
        'type': 'line',
        'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
        'layout': { 'line-cap': 'round', 'line-join': 'round' },
        'paint': { 'line-color': '#00B4D8', 'line-width': 2 }
    },
    {
        'id': 'gl-draw-polygon-stroke-active.hot',
        'type': 'line',
        'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
        'layout': { 'line-cap': 'round', 'line-join': 'round' },
        'paint': { 'line-color': '#00B4D8', 'line-width': 3 }
    },
    {
        'id': 'gl-draw-line.cold',
        'type': 'line',
        'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
        'layout': { 'line-cap': 'round', 'line-join': 'round' },
        'paint': { 'line-color': '#00B4D8', 'line-width': 2 }
    },
    {
        'id': 'gl-draw-line.hot',
        'type': 'line',
        'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'LineString']],
        'layout': { 'line-cap': 'round', 'line-join': 'round' },
        'paint': { 'line-color': '#00B4D8', 'line-width': 3 }
    },
    {
        'id': 'gl-draw-polygon-and-line-vertex-stroke-inactive.cold',
        'type': 'circle',
        'filter': ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
        'paint': { 'circle-radius': 6, 'circle-color': '#fff' }
    },
    {
        'id': 'gl-draw-polygon-and-line-vertex-inactive.cold',
        'type': 'circle',
        'filter': ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
        'paint': { 'circle-radius': 4, 'circle-color': '#00B4D8' }
    }
];

// Info Card Component (Reusable)
const InfoCard = ({ name, type, area, animals = 0, feed = 0, onRemove }) => (
    <div className="bg-white rounded-2xl p-4 shadow-2xl min-w-[220px] border border-gray-100 relative scale-90 origin-bottom pointer-events-auto">
        {onRemove && (
            <button
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <X size={14} strokeWidth={3} />
            </button>
        )}
        <h3 className="text-[14px] font-black text-[#1a1a2e] mb-3 pr-4 uppercase tracking-tight">{name}</h3>
        <div className="space-y-2">
            <div className="flex gap-1.5 flex-wrap">
                <div className="flex items-center gap-1.5 bg-[#E9F5FE] px-2 py-1 rounded-full border border-[#D1E9FD]">
                    <Fence size={12} className="text-[#0077B6]" />
                    <span className="text-[10px] font-black text-[#0077B6]">{type}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#F8F9FA] px-2 py-1 rounded-full border border-gray-100">
                    <Weight size={12} className="text-gray-500" />
                    <span className="text-[10px] font-black text-gray-600">{feed} kg</span>
                </div>
            </div>
            <div className="flex items-center gap-1.5 bg-[#F8F9FA] px-2 py-1 rounded-full border border-gray-100 w-fit">
                <Users size={12} className="text-gray-500" />
                <span className="text-[10px] font-black text-gray-600">{animals} Animals</span>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-50 flex items-center gap-2">
                <Maximize size={14} className="text-[#0077B6]" />
                <span className="text-[12px] font-black text-[#1a1a2e]">{area} Acres</span>
            </div>
        </div>
    </div>
);

// Custom Draw Control for react-map-gl
function DrawControl(props) {
    const draw = useControl(
        () => new MapboxDraw({
            ...props,
            styles: DRAW_STYLES
        }),
        ({ map }) => {
            map.on('draw.create', props.onUpdate);
            map.on('draw.update', props.onUpdate);
            map.on('draw.delete', props.onUpdate);
            map.on('draw.modechange', (e) => props.onModeChange && props.onModeChange(e.mode));
            map.on('draw.selectionchange', (e) => props.onSelectionChange && props.onSelectionChange(e.features));
        },
        ({ map }) => {
            map.off('draw.create', props.onUpdate);
            map.off('draw.update', props.onUpdate);
            map.off('draw.delete', props.onUpdate);
            map.off('draw.modechange', (e) => props.onModeChange && props.onModeChange(e.mode));
            map.off('draw.selectionchange', (e) => props.onSelectionChange && props.onSelectionChange(e.features));
        },
        {
            position: props.position
        }
    );

    useEffect(() => {
        if (props.onDrawInstance && draw) {
            props.onDrawInstance(draw);
        }
    }, [draw, props]);

    return null;
}

export default function MapEditor({ onUpdate, initialData, isReadOnly = false, currentName = 'test' }) {
    const mapRef = useRef();
    const [activeDrawInfo, setActiveDrawInfo] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    
    // Custom Toolbar State
    const [drawInstance, setDrawInstance] = useState(null);
    const [drawMode, setDrawMode] = useState('simple_select');
    const [hasSelection, setHasSelection] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

    const handleLocateMe = useCallback((e) => {
        if (e) e.stopPropagation();
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setIsLocating(false);
                const map = mapRef.current?.getMap();
                if (map) {
                    map.flyTo({
                        center: [position.coords.longitude, position.coords.latitude],
                        zoom: 16,
                        essential: true,
                        duration: 2500
                    });
                }
            },
            (error) => {
                setIsLocating(false);
                console.warn("Location permission denied or unavailable", error);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }, []);

    // Auto-locate on first load if creating a new location
    useEffect(() => {
        if (mapLoaded && !initialData && !isReadOnly) {
            handleLocateMe();
        }
    }, [mapLoaded, initialData, isReadOnly, handleLocateMe]);

    // Native layer management
    useEffect(() => {
        const map = mapRef.current?.getMap();
        if (!map || !initialData) return;

        const updateLayers = () => {
            if (!map.getStyle()) return;
            if (map.getLayer('locations-layer-fill')) map.removeLayer('locations-layer-fill');
            if (map.getLayer('locations-layer-outline')) map.removeLayer('locations-layer-outline');
            if (map.getSource('locations-source')) map.removeSource('locations-source');

            map.addSource('locations-source', {
                type: 'geojson',
                data: initialData
            });

            map.addLayer({
                id: 'locations-layer-fill',
                type: 'fill',
                source: 'locations-source',
                paint: { 'fill-color': '#00B4D8', 'fill-opacity': 0.4 }
            });

            map.addLayer({
                id: 'locations-layer-outline',
                type: 'line',
                source: 'locations-source',
                paint: { 'line-color': '#00B4D8', 'line-width': 3 }
            });
        };

        if (map.isStyleLoaded()) updateLayers();
        else map.on('style.load', updateLayers);
    }, [initialData, mapLoaded]);

    // Persistent labels calculation
    const persistentLabels = useMemo(() => {
        if (!initialData || !initialData.features) return [];
        return initialData.features.map(f => {
            try {
                const centroid = turf.centroid(f);
                return {
                    id: f.properties.id || Math.random(),
                    lng: centroid.geometry.coordinates[0],
                    lat: centroid.geometry.coordinates[1],
                    properties: f.properties
                };
            } catch (e) { return null; }
        }).filter(Boolean);
    }, [initialData]);

    const onDrawUpdate = useCallback((e) => {
        let feature;
        const draw = drawInstance || (e.target && e.target._controls && e.target._controls.find(c => c.getAll));
        if (!draw) return;

        const all = draw.getAll();
        if (all.features.length > 0) {
            feature = all.features[all.features.length - 1];
        }

        if (feature) {
            const centroid = turf.centroid(feature);
            const areaSqMeters = turf.area(feature);
            const acres = (areaSqMeters / 4046.86).toFixed(3);

            setActiveDrawInfo({
                longitude: centroid.geometry.coordinates[0],
                latitude: centroid.geometry.coordinates[1],
                properties: {
                    name: currentName || 'test',
                    type: 'Pasture',
                    area: acres,
                    animals: 0,
                    feed: 0
                }
            });
        } else {
            setActiveDrawInfo(null);
        }
        if (onUpdate) onUpdate(all);
    }, [onUpdate, currentName, drawInstance]);

    // Update drawing popup name in real-time
    useEffect(() => {
        if (activeDrawInfo && !isReadOnly) {
            setActiveDrawInfo(prev => ({
                ...prev,
                properties: { ...prev.properties, name: currentName || 'test' }
            }));
        }
    }, [currentName, isReadOnly]);

    return (
        <div className="relative w-full h-full">
            <Map
                ref={mapRef}
                initialViewState={{
                    longitude: 75.772,
                    latitude: 31.22,
                    zoom: 13
                }}
                style={{ width: '100%', height: '100%' }}
                mapStyle={FREE_SATELLITE_STYLE}
                mapLib={maplibregl}
                onLoad={() => setMapLoaded(true)}
            >
                <NavigationControl position="bottom-right" />

                {!isReadOnly && (
                    <DrawControl
                        position="top-right"
                        displayControlsDefault={false}
                        controls={{}} // We will render completely custom controls
                        defaultMode="simple_select"
                        onUpdate={onDrawUpdate}
                        onModeChange={setDrawMode}
                        onSelectionChange={(features) => setHasSelection(features && features.length > 0)}
                        onDrawInstance={setDrawInstance}
                    />
                )}

                {/* PERSISTENT CARDS for all saved locations */}
                {isReadOnly && persistentLabels.map(label => (
                    <Marker
                        key={label.id}
                        longitude={label.lng}
                        latitude={label.lat}
                        anchor="bottom"
                        offset={[0, -10]}
                    >
                        <InfoCard
                            name={label.properties.name}
                            type={label.properties.type}
                            area={label.properties.area}
                            animals={label.properties.animals}
                            feed={label.properties.feed}
                        />
                    </Marker>
                ))}

                {/* ACTIVE DRAWING CARD */}
                {!isReadOnly && activeDrawInfo && (
                    <Marker
                        longitude={activeDrawInfo.longitude}
                        latitude={activeDrawInfo.latitude}
                        anchor="bottom"
                        offset={[0, -10]}
                    >
                        <InfoCard
                            name={activeDrawInfo.properties.name}
                            type={activeDrawInfo.properties.type}
                            area={activeDrawInfo.properties.area}
                            animals={activeDrawInfo.properties.animals}
                            feed={activeDrawInfo.properties.feed}
                        />
                    </Marker>
                )}

                <style>{`
                    .maplibregl-marker {
                        pointer-events: none;
                    }
                    .location-popup .maplibregl-popup-content {
                        padding: 0 !important;
                        background: transparent !important;
                        box-shadow: none !important;
                    }
                    /* Ensure Mapbox's default controls are 100% hidden in case it tries to inject them */
                    .mapboxgl-ctrl-group.mapboxgl-ctrl {
                        display: none !important;
                    }
                `}</style>
            </Map>

            {/* CUSTOM FLOATING ACTION BUTTONS (FABs) FOR MAP DRAWING */}
            {!isReadOnly && (
                <div className="absolute top-6 left-6 flex flex-col gap-3 z-10">
                    <button
                        title="Locate Me"
                        onClick={handleLocateMe}
                        disabled={isLocating}
                        className="flex items-center justify-center w-12 h-12 rounded-2xl shadow-xl border border-gray-100 bg-white/95 text-[#1a1a2e] backdrop-blur-md transition-all hover:bg-white hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {isLocating ? <Loader2 size={20} className="animate-spin text-[#00B4D8]" /> : <Navigation size={20} strokeWidth={2.5} />}
                    </button>

                    {drawInstance && (
                        <>
                            <button
                        title="Draw Polygon"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (drawMode === 'draw_polygon') {
                                drawInstance.changeMode('simple_select');
                            } else {
                                drawInstance.changeMode('draw_polygon');
                            }
                        }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md transition-all group ${
                            drawMode === 'draw_polygon' 
                                ? 'bg-[#00B4D8] border-[#00B4D8] text-white' 
                                : 'bg-white/95 border-gray-100 text-[#1a1a2e] hover:bg-white hover:scale-105'
                        }`}
                    >
                        <Square size={20} strokeWidth={2.5} className={drawMode === 'draw_polygon' ? 'text-white' : 'text-[#00B4D8] group-hover:text-[#00B4D8]'} />
                        <span className="text-[13px] font-black tracking-wide">
                            {drawMode === 'draw_polygon' ? 'Drawing...' : 'Draw Area'}
                        </span>
                    </button>

                    <button
                        title="Delete Selection"
                        onClick={(e) => {
                            e.stopPropagation();
                            drawInstance.trash();
                        }}
                        disabled={!hasSelection && drawMode !== 'draw_polygon'}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border border-gray-100 bg-white/95 text-red-500 backdrop-blur-md transition-all hover:bg-red-50 hover:border-red-100 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                    >
                        <Trash2 size={20} strokeWidth={2.5} />
                        <span className="text-[13px] font-black tracking-wide">Clear</span>
                    </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
