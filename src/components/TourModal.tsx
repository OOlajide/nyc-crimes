import React, { useState } from 'react';
import { X, Sparkles, ChevronRight, ChevronLeft, MapPin, Compass, Play, Target } from 'lucide-react';
import { TOUR_HOTSPOTS } from '../utils/constants';
import { MapViewState } from '../types';

interface TourModalProps {
  isOpen: boolean;
  onClose: () => void;
  setViewState: (vs: MapViewState) => void;
}

export const TourModal: React.FC<TourModalProps> = ({
  isOpen,
  onClose,
  setViewState
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = TOUR_HOTSPOTS[currentIndex];

  const handleFlyTo = (index: number) => {
    setCurrentIndex(index);
    const target = TOUR_HOTSPOTS[index];
    setViewState({
      longitude: target.lng,
      latitude: target.lat,
      zoom: target.zoom,
      pitch: target.pitch,
      bearing: target.bearing,
      transitionDuration: 2200
    });
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % TOUR_HOTSPOTS.length;
    handleFlyTo(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + TOUR_HOTSPOTS.length) % TOUR_HOTSPOTS.length;
    handleFlyTo(prevIdx);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 font-mono">
      <div className="w-full max-w-xl hud-panel-amber rounded-3xl p-6 shadow-2xl relative space-y-6 hud-brackets">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-white transition-all border border-transparent hover:border-tactical-border"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-tactical-amber/20 border border-tactical-amber flex items-center justify-center shadow-hud-amber">
            <Target className="w-5 h-5 text-tactical-amber animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white uppercase font-hud tracking-wide">
              3D SPATIAL TELEMETRY TOUR
            </h2>
            <p className="text-xs text-slate-400">
              Interactive 3D camera fly-to walkthrough of key NYC spatial incident clusters
            </p>
          </div>
        </div>

        {/* Tour Navigation Indicators */}
        <div className="flex items-center justify-between bg-slate-950/90 p-2 rounded-2xl border border-tactical-border">
          {TOUR_HOTSPOTS.map((hotspot, idx) => (
            <button
              key={hotspot.name}
              onClick={() => handleFlyTo(idx)}
              className={`flex-1 py-2 px-1 text-[11px] font-mono font-bold rounded-xl transition-all ${
                idx === currentIndex
                  ? 'bg-tactical-amber text-slate-950 shadow-hud-amber font-hud uppercase'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              Step {idx + 1}
            </button>
          ))}
        </div>

        {/* Card Content */}
        <div className="bg-slate-950/90 border border-tactical-border p-5 rounded-2xl space-y-3 relative overflow-hidden hud-brackets">
          <div className="flex items-center justify-between text-xs">
            <span className="px-2.5 py-1 rounded bg-tactical-amber/10 text-tactical-amber border border-tactical-amber/30 uppercase font-hud font-bold">
              {currentStep.borough} Borough Sector
            </span>
            <span className="text-slate-400 flex items-center space-x-1 font-mono">
              <MapPin className="w-3.5 h-3.5 text-tactical-crimson" />
              <span>{currentStep.lat.toFixed(4)}° N, {currentStep.lng.toFixed(4)}° W</span>
            </span>
          </div>

          <h3 className="text-lg font-extrabold text-white font-hud tracking-wide">
            {currentStep.name}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {currentStep.description}
          </p>

          <div className="pt-3 flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
            <Compass className="w-3.5 h-3.5 text-tactical-amber" />
            <span>Telemetry Pitch: {currentStep.pitch}° | Bearing: {currentStep.bearing}°</span>
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-2 border-t border-tactical-border">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrev}
              className="p-2.5 bg-slate-950 hover:bg-slate-900 text-slate-300 rounded-xl border border-tactical-border transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 bg-slate-950 hover:bg-slate-900 text-slate-300 rounded-xl border border-tactical-border transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              handleFlyTo(currentIndex);
            }}
            className="flex items-center space-x-2 bg-tactical-amber hover:bg-amber-400 text-slate-950 px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-hud-amber font-hud uppercase tracking-wider"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Target Camera Fly-To</span>
          </button>
        </div>
      </div>
    </div>
  );
};
