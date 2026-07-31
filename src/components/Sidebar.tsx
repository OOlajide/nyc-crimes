import React from 'react';
import { 
  Sliders, 
  Layers, 
  Palette, 
  Filter, 
  RotateCcw,
  ChevronLeft,
  Flame,
  Boxes,
  MapPin,
  Target
} from 'lucide-react';
import { ColorRamp, FilterSettings, LayerSettings, MapViewState } from '../types';
import { COLOR_RAMPS, BOROUGHS, DEFAULT_VIEW_STATE } from '../utils/constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  layerSettings: LayerSettings;
  setLayerSettings: React.Dispatch<React.SetStateAction<LayerSettings>>;
  filterSettings: FilterSettings;
  setFilterSettings: React.Dispatch<React.SetStateAction<FilterSettings>>;
  setViewState: (vs: MapViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  layerSettings,
  setLayerSettings,
  filterSettings,
  setFilterSettings,
  setViewState
}) => {
  if (!isOpen) return null;

  return (
    <aside className="fixed top-20 left-4 bottom-4 z-30 w-80 sm:w-96 hud-panel rounded-2xl p-5 overflow-y-auto flex flex-col justify-between shadow-2xl border border-tactical-border animate-in fade-in slide-in-from-left duration-300 font-mono">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-tactical-border">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-tactical-amber" />
            <h2 className="text-sm font-bold tracking-wider uppercase font-hud text-white">
              CONTROL MATRIX
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white transition-all border border-transparent hover:border-tactical-border"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Rendering Engine Mode */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest font-hud flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-tactical-amber" />
            <span>Layer Engine</span>
          </label>
          <div className="grid grid-cols-3 gap-2 bg-slate-950/90 p-1.5 rounded-xl border border-tactical-border">
            <button
              onClick={() => setLayerSettings(p => ({ ...p, mode: 'hexbin' }))}
              className={`p-2.5 rounded-lg text-xs font-hud uppercase tracking-wider font-bold flex flex-col items-center space-y-1 transition-all ${
                layerSettings.mode === 'hexbin'
                  ? 'bg-tactical-amber text-slate-950 shadow-hud-amber'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Boxes className="w-4 h-4" />
              <span>3D Hexbin</span>
            </button>

            <button
              onClick={() => setLayerSettings(p => ({ ...p, mode: 'heatmap' }))}
              className={`p-2.5 rounded-lg text-xs font-hud uppercase tracking-wider font-bold flex flex-col items-center space-y-1 transition-all ${
                layerSettings.mode === 'heatmap'
                  ? 'bg-tactical-crimson text-white shadow-hud-crimson'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Heatmap</span>
            </button>

            <button
              onClick={() => setLayerSettings(p => ({ ...p, mode: 'scatterplot' }))}
              className={`p-2.5 rounded-lg text-xs font-hud uppercase tracking-wider font-bold flex flex-col items-center space-y-1 transition-all ${
                layerSettings.mode === 'scatterplot'
                  ? 'bg-tactical-cyan text-slate-950 shadow-hud-cyan'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Scatter</span>
            </button>
          </div>
        </div>

        {/* Section 2: Mode Specific Sliders */}
        <div className="space-y-4 bg-slate-950/80 p-4 rounded-xl border border-tactical-border hud-brackets">
          {layerSettings.mode === 'hexbin' && (
            <>
              {/* Hexagon Radius */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Hexagon Radius</span>
                  <span className="font-mono text-tactical-amber font-bold">{layerSettings.radius}m</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={800}
                  step={10}
                  value={layerSettings.radius}
                  onChange={(e) => setLayerSettings(p => ({ ...p, radius: Number(e.target.value) }))}
                  className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-tactical-amber"
                />
              </div>

              {/* 3D Elevation Scale */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">3D Height Extrusion</span>
                  <span className="font-mono text-tactical-amber font-bold">{layerSettings.elevationScale}x</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  step={1}
                  value={layerSettings.elevationScale}
                  onChange={(e) => setLayerSettings(p => ({ ...p, elevationScale: Number(e.target.value) }))}
                  className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-tactical-amber"
                />
              </div>

              {/* Upper Percentile Cutoff */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Density Percentile Cutoff</span>
                  <span className="font-mono text-tactical-amber font-bold">{layerSettings.upperPercentile}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={100}
                  step={1}
                  value={layerSettings.upperPercentile}
                  onChange={(e) => setLayerSettings(p => ({ ...p, upperPercentile: Number(e.target.value) }))}
                  className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-tactical-amber"
                />
              </div>

              {/* Coverage ratio */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Cell Coverage Gap</span>
                  <span className="font-mono text-tactical-amber font-bold">{Math.round(layerSettings.coverage * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={1.0}
                  step={0.05}
                  value={layerSettings.coverage}
                  onChange={(e) => setLayerSettings(p => ({ ...p, coverage: Number(e.target.value) }))}
                  className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-tactical-amber"
                />
              </div>
            </>
          )}

          {layerSettings.mode === 'heatmap' && (
            <>
              {/* Heatmap Radius */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Heatmap Blur Radius</span>
                  <span className="font-mono text-tactical-crimson font-bold">{layerSettings.radius}px</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={2}
                  value={layerSettings.radius}
                  onChange={(e) => setLayerSettings(p => ({ ...p, radius: Number(e.target.value) }))}
                  className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-tactical-crimson"
                />
              </div>

              {/* Heatmap Intensity */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Heat Multiplier</span>
                  <span className="font-mono text-tactical-crimson font-bold">{layerSettings.heatmapIntensity}x</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={0.5}
                  value={layerSettings.heatmapIntensity}
                  onChange={(e) => setLayerSettings(p => ({ ...p, heatmapIntensity: Number(e.target.value) }))}
                  className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-tactical-crimson"
                />
              </div>
            </>
          )}

          {layerSettings.mode === 'scatterplot' && (
            <>
              {/* Scatter Point Size */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Incident Point Radius</span>
                  <span className="font-mono text-tactical-cyan font-bold">{layerSettings.pointRadius}m</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={layerSettings.pointRadius}
                  onChange={(e) => setLayerSettings(p => ({ ...p, pointRadius: Number(e.target.value) }))}
                  className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-tactical-cyan"
                />
              </div>
            </>
          )}

          {/* Opacity slider */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Layer Opacity</span>
              <span className="font-mono text-tactical-amber font-bold">{Math.round(layerSettings.opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={1.0}
              step={0.05}
              value={layerSettings.opacity}
              onChange={(e) => setLayerSettings(p => ({ ...p, opacity: Number(e.target.value) }))}
              className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-tactical-amber"
            />
          </div>
        </div>

        {/* Section 3: Color Palette selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest font-hud flex items-center space-x-1.5">
            <Palette className="w-3.5 h-3.5 text-tactical-amber" />
            <span>Color Gradient Palette</span>
          </label>
          <div className="grid grid-cols-1 gap-2">
            {(Object.keys(COLOR_RAMPS) as ColorRamp[]).map((key) => {
              const ramp = COLOR_RAMPS[key];
              const isSelected = layerSettings.colorRamp === key;
              return (
                <button
                  key={key}
                  onClick={() => setLayerSettings(p => ({ ...p, colorRamp: key }))}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-tactical-amber shadow-hud-amber'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className={`font-mono font-bold ${isSelected ? 'text-tactical-amber' : 'text-slate-300'}`}>
                    {ramp.name}
                  </span>
                  <div className="flex items-center space-x-1">
                    {ramp.colors.map((c, i) => (
                      <div
                        key={i}
                        className="w-3.5 h-3.5 rounded-sm"
                        style={{ backgroundColor: `rgb(${c[0]}, ${c[1]}, ${c[2]})` }}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Spatial Filters */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest font-hud flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-tactical-amber" />
            <span>Borough Spatial Filter</span>
          </label>
          <select
            value={filterSettings.borough}
            onChange={(e) => {
              const boroughId = e.target.value;
              setFilterSettings(p => ({ ...p, borough: boroughId }));
              const target = BOROUGHS.find(b => b.id === boroughId);
              if (target && target.center) {
                setViewState({
                  longitude: target.center.longitude,
                  latitude: target.center.latitude,
                  zoom: target.center.zoom,
                  pitch: target.center.pitch,
                  bearing: target.center.bearing,
                  transitionDuration: 1200
                });
              }
            }}
            className="w-full bg-slate-950 border border-tactical-border text-xs font-mono font-bold text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-tactical-amber"
          >
            {BOROUGHS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Footer Reset & Preset Controls */}
      <div className="pt-4 border-t border-tactical-border flex items-center justify-between">
        <button
          onClick={() => {
            setViewState(DEFAULT_VIEW_STATE);
          }}
          className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-tactical-amber transition-all font-mono"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET CAMERA</span>
        </button>

        <span className="text-[10px] text-slate-500 font-mono">355,886 RECORDS</span>
      </div>
    </aside>
  );
};
