import React, { useState, useMemo, useEffect, useRef } from 'react';
import DeckGL from '@deck.gl/react';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { ScatterplotLayer } from '@deck.gl/layers';
import maplibregl from 'maplibre-gl';
import { CrimePoint, LayerSettings, MapViewState } from '../types';
import { COLOR_RAMPS } from '../utils/constants';
import { 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  ShieldAlert
} from 'lucide-react';

interface MapViewProps {
  data: CrimePoint[];
  layerSettings: LayerSettings;
  viewState: MapViewState;
  setViewState: (vs: MapViewState) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  data,
  layerSettings,
  viewState,
  setViewState,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const [hoverInfo, setHoverInfo] = useState<{
    x: number;
    y: number;
    count: number;
    lngLat?: [number, number];
  } | null>(null);

  // Initialize Maplibre GL map container
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      pitch: viewState.pitch,
      bearing: viewState.bearing,
      interactive: false,
      attributionControl: false
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Synchronize Maplibre camera with DeckGL viewState
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.jumpTo({
        center: [viewState.longitude, viewState.latitude],
        zoom: viewState.zoom,
        pitch: viewState.pitch,
        bearing: viewState.bearing
      });
    }
  }, [viewState]);

  // Compute active deck.gl layers
  const layers = useMemo(() => {
    if (!data || data.length === 0) return [];

    const activeRamp = COLOR_RAMPS[layerSettings.colorRamp] || COLOR_RAMPS.fire;

    if (layerSettings.mode === 'hexbin') {
      return [
        new HexagonLayer({
          id: 'nyc-hexagon-layer',
          data,
          getPosition: (d: CrimePoint) => [d.lng, d.lat],
          radius: layerSettings.radius,
          elevationScale: layerSettings.elevationScale,
          elevationRange: [0, 2000],
          extruded: layerSettings.extruded,
          coverage: layerSettings.coverage,
          upperPercentile: layerSettings.upperPercentile,
          colorRange: activeRamp.colors,
          opacity: layerSettings.opacity,
          gpuAggregation: false, // Guarantees accurate CPU point binning & counts
          pickable: true,
          material: {
            ambient: 0.65,
            diffuse: 0.7,
            shininess: 45,
            specularColor: [80, 80, 80]
          },
          transitions: {
            elevationScale: 800,
            radius: 600,
          },
          onHover: (info: any) => {
            if (info && info.object) {
              const pointsCount = info.object.points 
                ? info.object.points.length 
                : (info.object.count ?? info.object.colorValue ?? info.object.elevationValue ?? 0);
              
              const coordinates = info.object.coordinates || info.object.position || 
                (info.object.points && info.object.points[0] ? [info.object.points[0].lng, info.object.points[0].lat] : undefined);

              setHoverInfo({
                x: info.x,
                y: info.y,
                count: pointsCount,
                lngLat: coordinates
              });
            } else {
              setHoverInfo(null);
            }
            return true;
          }
        })
      ];
    }

    if (layerSettings.mode === 'heatmap') {
      return [
        new HeatmapLayer({
          id: 'nyc-heatmap-layer',
          data,
          getPosition: (d: CrimePoint) => [d.lng, d.lat],
          radiusPixels: layerSettings.radius,
          intensity: layerSettings.heatmapIntensity,
          threshold: 0.05,
          colorRange: activeRamp.colors,
          opacity: layerSettings.opacity,
          pickable: false,
        })
      ];
    }

    if (layerSettings.mode === 'scatterplot') {
      const topColor = activeRamp.colors[activeRamp.colors.length - 1];
      return [
        new ScatterplotLayer({
          id: 'nyc-scatterplot-layer',
          data,
          getPosition: (d: CrimePoint) => [d.lng, d.lat],
          getRadius: layerSettings.pointRadius,
          radiusMinPixels: 3,
          radiusMaxPixels: 30,
          getFillColor: [...topColor, Math.round(layerSettings.opacity * 255)] as [number, number, number, number],
          pickable: true,
          onHover: (info: any) => {
            if (info && info.object) {
              const d = info.object as CrimePoint;
              setHoverInfo({
                x: info.x,
                y: info.y,
                count: 1,
                lngLat: [d.lng, d.lat]
              });
            } else {
              setHoverInfo(null);
            }
            return true;
          }
        })
      ];
    }

    return [];
  }, [data, layerSettings]);

  const handleZoomIn = () => {
    setViewState({ ...viewState, zoom: Math.min(viewState.zoom + 1, 20), transitionDuration: 300 });
  };

  const handleZoomOut = () => {
    setViewState({ ...viewState, zoom: Math.max(viewState.zoom - 1, 1), transitionDuration: 300 });
  };

  const handleResetTilt = () => {
    setViewState({ ...viewState, pitch: viewState.pitch === 0 ? 55 : 0, transitionDuration: 500 });
  };

  // Clamp tooltip inside screen bounds
  const clampedX = hoverInfo ? Math.max(110, Math.min(window.innerWidth - 110, hoverInfo.x)) : 0;
  const clampedY = hoverInfo ? Math.max(70, hoverInfo.y - 12) : 0;

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#050811]">
      {/* Maplibre Basemap Container */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

      {/* DeckGL 3D Overlay Layer */}
      <DeckGL
        viewState={viewState}
        onViewStateChange={(e: any) => setViewState(e.viewState as MapViewState)}
        controller={{ dragRotate: true, doubleClickZoom: true, keyboard: true }}
        layers={layers}
      />

      {/* Map Controls (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-30 flex flex-col space-y-2">
        <button
          onClick={handleZoomIn}
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700/80 shadow-lg transition-all"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={handleZoomOut}
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700/80 shadow-lg transition-all"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={handleResetTilt}
          className={`p-2.5 rounded-xl border shadow-lg transition-all ${
            viewState.pitch > 0
              ? 'bg-amber-400/20 text-amber-300 border-amber-400/50'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-400 border-slate-700/80'
          }`}
          title="Toggle 3D Perspective Tilt"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Compact Hover Tooltip Bounded to Screen Bounds */}
      {hoverInfo && (
        <div
          className="pointer-events-none fixed z-50 bg-slate-950/95 backdrop-blur-md border border-slate-700 rounded-xl px-3.5 py-2 shadow-2xl text-xs space-y-0.5 transform -translate-x-1/2 -translate-y-full max-w-[220px] text-center"
          style={{
            left: clampedX,
            top: clampedY
          }}
        >
          <div className="text-amber-400 font-bold text-sm leading-tight">
            {hoverInfo.count.toLocaleString()} <span className="text-slate-200 text-xs font-normal">crimes reported</span>
          </div>
          {hoverInfo.lngLat && (
            <div className="text-[10px] text-slate-400 font-mono">
              Lat: {hoverInfo.lngLat[1].toFixed(4)} | Lng: {hoverInfo.lngLat[0].toFixed(4)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
