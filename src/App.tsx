import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CrimePoint, FilterSettings, LayerSettings, MapViewState } from './types';
import { DEFAULT_VIEW_STATE } from './utils/constants';
import { loadCrimeData, DataLoadProgress } from './utils/dataLoader';
import { Header } from './components/Header';
import { MapView } from './components/MapView';
import { DataTableModal } from './components/DataTableModal';
import { StatsModal } from './components/StatsModal';
import { ShieldAlert, Loader2 } from 'lucide-react';

export function App() {
  const [data, setData] = useState<CrimePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState<DataLoadProgress>({ loaded: 0, total: 355886, status: 'Loading NYC crime data...' });

  const [viewState, setViewState] = useState<MapViewState>(DEFAULT_VIEW_STATE);

  // Modals
  const [isDataTableOpen, setIsDataTableOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  // Default rendering engine (Hexbin 3D map)
  const layerSettings: LayerSettings = useMemo(() => ({
    mode: 'hexbin',
    radius: 200,
    elevationScale: 18,
    coverage: 0.95,
    upperPercentile: 100,
    opacity: 0.85,
    colorRamp: 'fire',
    extruded: true,
    wireframe: false,
    pointRadius: 35,
    heatmapIntensity: 3,
    heatmapThreshold: 0.05
  }), []);

  // Filter settings
  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    borough: 'All',
    densityThreshold: 0,
    searchQuery: '',
    maxPointsDisplay: 355886
  });

  // Fetch binary dataset on mount
  useEffect(() => {
    let isMounted = true;
    loadCrimeData((progress) => {
      if (isMounted) setLoadProgress(progress);
    })
      .then((points) => {
        if (isMounted) {
          setData(points);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load dataset:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered dataset by selected borough
  const filteredData = useMemo(() => {
    if (filterSettings.borough === 'All') return data;
    return data.filter(p => p.borough === filterSettings.borough);
  }, [data, filterSettings.borough]);

  // Export filtered dataset to CSV
  const handleExportCSV = useCallback(() => {
    if (!filteredData || filteredData.length === 0) return;
    const header = 'id,borough,lat,lng\n';
    const rows = filteredData.map(d => `${d.id},"${d.borough}",${d.lat},${d.lng}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nyc_crimes_${filterSettings.borough.toLowerCase()}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredData, filterSettings.borough]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050811] text-slate-100 selection:bg-amber-400 selection:text-black font-sans">
      {/* Clean Header Bar */}
      <Header
        totalCount={data.length}
        filteredCount={filteredData.length}
        setViewState={setViewState}
        onOpenDataTable={() => setIsDataTableOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onExportCSV={handleExportCSV}
        selectedBorough={filterSettings.borough}
        setSelectedBorough={(b) => setFilterSettings(prev => ({ ...prev, borough: b }))}
      />

      {/* Main Map Viewport */}
      <main className="w-full h-full pt-16">
        {loading ? (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050811] text-slate-200 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/40 flex items-center justify-center shadow-lg animate-pulse">
              <ShieldAlert className="w-7 h-7 text-amber-400" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold font-sans tracking-wide text-amber-400">
                NYC Crimes
              </h3>
              <p className="text-xs text-slate-400 flex items-center justify-center space-x-2 font-mono">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>{loadProgress.status}</span>
              </p>
            </div>
            <div className="w-60 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(100, (loadProgress.loaded / Math.max(loadProgress.total, 1)) * 100)}%` }}
              />
            </div>
          </div>
        ) : (
          <MapView
            data={filteredData}
            layerSettings={layerSettings}
            viewState={viewState}
            setViewState={setViewState}
          />
        )}
      </main>

      {/* Raw Data Inspector Modal */}
      <DataTableModal
        isOpen={isDataTableOpen}
        onClose={() => setIsDataTableOpen(false)}
        data={filteredData}
        onExportCSV={handleExportCSV}
      />

      {/* Metadata Stats Modal */}
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        totalCount={data.length}
      />
    </div>
  );
}

export default App;
