import React from 'react';
import { 
  ShieldAlert, 
  Download, 
  Database,
  Radio
} from 'lucide-react';
import { MapViewState } from '../types';
import { BOROUGHS } from '../utils/constants';

interface HeaderProps {
  totalCount: number;
  filteredCount: number;
  setViewState: (vs: MapViewState) => void;
  onOpenDataTable: () => void;
  onOpenStats: () => void;
  onExportCSV: () => void;
  selectedBorough: string;
  setSelectedBorough: (b: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  filteredCount,
  setViewState,
  onOpenDataTable,
  onOpenStats,
  onExportCSV,
  selectedBorough,
  setSelectedBorough,
}) => {
  const handleBoroughChange = (boroughId: string) => {
    setSelectedBorough(boroughId);
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
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between shadow-lg">
      {/* Left: Clean Branding "NYC Crimes" */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 p-[1.5px] shadow-md">
          <div className="w-full h-full bg-[#050811] rounded-[10.5px] flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
          </div>
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight font-sans">
            NYC Crimes
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            NYPD Crime Data (2006 – 2016)
          </p>
        </div>
      </div>

      {/* Center: Borough Dropdown Selector */}
      <div className="flex items-center space-x-3">
        <select
          value={selectedBorough}
          onChange={(e) => handleBoroughChange(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-100 rounded-xl px-3.5 py-2 focus:outline-none focus:border-amber-400 shadow-sm cursor-pointer"
        >
          {BOROUGHS.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* Right Actions & Dataset Count */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Record Count */}
        <button
          onClick={onOpenStats}
          className="hidden sm:flex items-center space-x-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl hover:border-amber-400/50 transition-all font-mono"
          title="Dataset Information"
        >
          <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <div className="text-left text-xs font-semibold text-amber-300">
            {filteredCount.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">crimes</span>
          </div>
        </button>

        {/* Data Table */}
        <button
          onClick={onOpenDataTable}
          className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-700/80 transition-all"
          title="Raw Data Table"
        >
          <Database className="w-4 h-4" />
        </button>

        {/* Export CSV */}
        <button
          onClick={onExportCSV}
          className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-700/80 transition-all"
          title="Export CSV"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
