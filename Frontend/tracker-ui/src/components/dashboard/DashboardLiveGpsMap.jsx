import React, { useEffect, useRef } from 'react';
import { Map, Navigation } from 'lucide-react';

export default function DashboardLiveGpsMap({ activeSession }) {
  const mapRef = useRef(null);
  const heatmapLayerRef = useRef(null);
  const polylineRef = useRef(null);
  const markerRef = useRef(null);

  const isTracking = activeSession?.status === 'active' || activeSession?.status === 'paused';
  const coords = activeSession?.coords || [];
  const distance = activeSession?.distance || 0;
  const laps = Math.floor(distance);
  const lastCoord = coords[coords.length - 1];

  // Initialize Map
  useEffect(() => {
    if (!window.L) {
      console.warn('[FitTrack Map] Leaflet L is not loaded.');
      return;
    }

    // Default start coordinates (London center fallback)
    const startLat = lastCoord?.lat ?? 51.505;
    const startLng = lastCoord?.lng ?? -0.09;

    const map = window.L.map('live-gps-leaflet-map', {
      center: [startLat, startLng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false
    });

    // Dark Map tiles from CartoDB (matches dark neon aesthetic)
    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      subdomains: 'abcd'
    }).addTo(map);

    // Set up Heatmap Overlay
    let heatmapOverlay = null;
    if (window.HeatmapOverlay) {
      const heatmapCfg = {
        radius: 0.0004, // Radius in degrees for local zoom scaling
        maxOpacity: 0.75,
        scaleRadius: true,
        useLocalExtrema: false,
        latField: 'lat',
        lngField: 'lng',
        valueField: 'intensity',
        gradient: {
          '.20': '#3b82f6', // Blue (Rest)
          '.40': '#00e5ff', // Cyan (Light Activity)
          '.65': '#10b981', // Green (Moderate)
          '.85': '#eab308', // Yellow (Intense)
          '1.0': '#ef4444'  // Red (Maximum Effort)
        }
      };
      heatmapOverlay = new window.HeatmapOverlay(heatmapCfg);
      map.addLayer(heatmapOverlay);
    }

    // Trace line polyline
    const polyline = window.L.polyline([], {
      color: '#00e5ff',
      weight: 4.5,
      opacity: 0.85,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Pulsing current position indicator
    const pulseIcon = window.L.divIcon({
      className: 'relative flex items-center justify-center',
      html: `
        <div class="absolute w-3.5 h-3.5 rounded-full bg-[#00e5ff] shadow-[0_0_12px_#00e5ff] border border-white/40"></div>
        <div class="absolute w-6.5 h-6.5 rounded-full border-2 border-[#00e5ff] animate-ping opacity-60"></div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const marker = window.L.marker([startLat, startLng], { icon: pulseIcon }).addTo(map);

    mapRef.current = map;
    heatmapLayerRef.current = heatmapOverlay;
    polylineRef.current = polyline;
    markerRef.current = marker;

    // Center on user geolocation if session has no coords yet
    if (isTracking && coords.length === 0) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          map.setView([latitude, longitude], 16);
          marker.setLatLng([latitude, longitude]);
        },
        () => {},
        { enableHighAccuracy: true }
      );
    }

    return () => {
      map.remove();
      mapRef.current = null;
      heatmapLayerRef.current = null;
      polylineRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Update Coordinates dynamically
  useEffect(() => {
    if (!mapRef.current || coords.length === 0) return;

    const latLngPoints = coords.map(c => [c.lat, c.lng]);
    const current = coords[coords.length - 1];

    if (markerRef.current) {
      markerRef.current.setLatLng([current.lat, current.lng]);
    }

    if (polylineRef.current) {
      polylineRef.current.setLatLngs(latLngPoints);
    }

    if (heatmapLayerRef.current) {
      // Calculate or read intensity points
      const heatmapPoints = coords.map(c => {
        let intensity = c.intensity;
        if (intensity === undefined) {
          // local fallback based on speed
          const speedMs = c.speed || 0.0;
          intensity = speedMs > 5.0 ? 90 : (speedMs > 2.0 ? 60 : (speedMs > 0.3 ? 30 : 10));
        }
        return {
          lat: c.lat,
          lng: c.lng,
          intensity: intensity
        };
      });

      heatmapLayerRef.current.setData({
        max: 100,
        data: heatmapPoints
      });
    }

    // Pan map to current GPS position smoothly
    mapRef.current.panTo([current.lat, current.lng]);
  }, [coords]);

  return (
    <div className="w-full rounded-3xl bg-gradient-to-br from-[#0F172A]/70 to-[#070B14]/70 border border-white/10 p-6 relative overflow-hidden backdrop-blur-xl shadow-[0_0_40px_rgba(0,229,255,0.03)] min-h-[320px] flex flex-col h-full">
      {/* Background neon light grid overlay */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* Header info */}
      <div className="relative z-10 flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center">
            <Map className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest pt-1 leading-normal">
              Outdoor Run/Cycle GPS Tracking
            </h3>
            <span className="text-[10px] text-white/40 uppercase tracking-widest">
              Intensity Trail Tracking
            </span>
          </div>
        </div>

        {isTracking && (
          <div className="px-3 py-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-400 text-[10px] uppercase font-black tracking-widest">
            {laps} {laps === 1 ? 'Lap' : 'Laps'}
          </div>
        )}
      </div>

      {/* Map Area */}
      <div className="relative flex-1 rounded-2xl overflow-hidden border border-white/5 bg-[#090D1A]/90 min-h-[240px] flex flex-col">
        {/* Leaflet container */}
        <div 
          id="live-gps-leaflet-map" 
          className="w-full h-full min-h-[240px] flex-1 z-10"
        />

        {/* GPS Status message */}
        {coords.length === 0 && (
          <div className="absolute inset-0 z-20 bg-black/60 flex flex-col items-center justify-center text-center gap-3 p-6 pointer-events-none">
            <Navigation className={`w-10 h-10 ${isTracking ? 'text-cyan-400 animate-bounce' : 'text-white/20'}`} />
            <div className="max-w-[240px] text-xs text-white/40 leading-relaxed font-bold">
              {isTracking
                ? 'Acquiring high-accuracy mobile GPS signal... Center point will update shortly.'
                : 'System Standby. Activate workout to stream live telemetry map.'}
            </div>
          </div>
        )}

        {/* Floating coordinates dashboard values */}
        {lastCoord && (
          <div className="absolute top-3 left-3 z-20 px-3 py-1.5 rounded-xl bg-black/75 border border-white/10 text-[9px] font-mono text-cyan-400 backdrop-blur-md shadow-lg flex flex-col gap-0.5">
            <div>LAT: {lastCoord.lat.toFixed(6)}</div>
            <div>LNG: {lastCoord.lng.toFixed(6)}</div>
          </div>
        )}

        {/* Intensity color guide */}
        <div className="absolute bottom-3 left-3 z-20 px-2 py-1.5 rounded-xl bg-black/75 border border-white/10 backdrop-blur-md flex items-center gap-2 text-[8px] font-black uppercase text-white/60 tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" title="Rest" />
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" title="Light" />
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" title="Moderate" />
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" title="Intense" />
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" title="Maximum" />
        </div>

        {/* Distance Overlay */}
        <div className="absolute bottom-3 right-3 z-20 px-3.5 py-2.5 rounded-2xl bg-black/85 border border-[#00E5FF]/20 backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
          <div className="text-[9px] uppercase tracking-widest text-white/40 font-black">
            Total Distance
          </div>
          <div className="text-xl font-black text-white font-mono mt-0.5 flex items-baseline">
            {distance.toFixed(2)}
            <span className="text-[10px] text-[#00E5FF] uppercase font-black tracking-widest ml-1">
              KM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
