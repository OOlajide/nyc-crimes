import React from 'react';
import { X, Cpu, HardDrive, Globe, Calendar, Layers } from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalCount: number;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  totalCount
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 font-mono">
      <div className="w-full max-w-lg hud-panel-amber rounded-3xl p-6 shadow-2xl space-y-6 relative hud-brackets">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-white transition-all border border-transparent hover:border-tactical-border"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-3 bg-tactical-amber/10 border border-tactical-amber/40 rounded-2xl shadow-hud-amber">
            <Cpu className="w-6 h-6 text-tactical-amber" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white uppercase font-hud tracking-wide">
              SYSTEM ARCHITECTURE & METADATA
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              NYC NYPD Crime Reports (2006 – 2016)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-slate-950/90 border border-tactical-border p-3.5 rounded-2xl">
            <div className="text-slate-400 mb-1 flex items-center space-x-1.5 font-hud">
              <HardDrive className="w-3.5 h-3.5 text-tactical-amber" />
              <span>DATA VOLUME</span>
            </div>
            <div className="text-lg font-bold text-white">{totalCount.toLocaleString()}</div>
            <div className="text-[10px] text-tactical-amber mt-0.5">Float32 Binary Optimized</div>
          </div>

          <div className="bg-slate-950/90 border border-tactical-border p-3.5 rounded-2xl">
            <div className="text-slate-400 mb-1 flex items-center space-x-1.5 font-hud">
              <Calendar className="w-3.5 h-3.5 text-tactical-cyan" />
              <span>TIMEFRAME</span>
            </div>
            <div className="text-lg font-bold text-white">2006 – 2016</div>
            <div className="text-[10px] text-tactical-cyan mt-0.5">10-Year Decadal Aggregate</div>
          </div>

          <div className="bg-slate-950/90 border border-tactical-border p-3.5 rounded-2xl">
            <div className="text-slate-400 mb-1 flex items-center space-x-1.5 font-hud">
              <Globe className="w-3.5 h-3.5 text-tactical-amber" />
              <span>BOUNDING ENVELOPE</span>
            </div>
            <div className="text-[11px] font-bold text-slate-200">Lat 40.49° N to 40.91° N</div>
            <div className="text-[10px] text-tactical-amber mt-0.5">Lng -74.25° W to -73.70° W</div>
          </div>

          <div className="bg-slate-950/90 border border-tactical-border p-3.5 rounded-2xl">
            <div className="text-slate-400 mb-1 flex items-center space-x-1.5 font-hud">
              <Layers className="w-3.5 h-3.5 text-tactical-crimson" />
              <span>GRAPHICS ENGINE</span>
            </div>
            <div className="text-base font-bold text-white font-hud">Deck.gl v9 + WebGL</div>
            <div className="text-[10px] text-tactical-crimson mt-0.5">60 FPS Hardware Extrusion</div>
          </div>
        </div>

        <div className="bg-slate-950 border border-tactical-border p-4 rounded-2xl text-xs text-slate-300 space-y-1 font-sans">
          <div className="font-hud text-tactical-amber font-bold mb-1 uppercase tracking-wider">Source Attribution</div>
          <p>
            Data sourced from <a href="https://data.cityofnewyork.us/Public-Safety/NYPD-Complaint-Data-Historic/qgea-i56i/about_data" target="_blank" rel="noopener noreferrer" className="text-tactical-amber underline hover:text-amber-300 transition-colors">NYPD Complaint Data Historic (NYC Open Data)</a>.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-tactical-amber hover:bg-amber-400 text-slate-950 font-extrabold text-xs py-3 rounded-xl transition-all shadow-hud-amber uppercase tracking-wider font-hud"
        >
          Return to Spatial Map
        </button>
      </div>
    </div>
  );
};
