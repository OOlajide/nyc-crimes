import React, { useState, useMemo } from 'react';
import { X, Search, Download, Database, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { CrimePoint } from '../types';

interface DataTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CrimePoint[];
  onExportCSV: () => void;
}

export const DataTableModal: React.FC<DataTableModalProps> = ({
  isOpen,
  onClose,
  data,
  onExportCSV
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const q = searchTerm.toLowerCase();
    return data.filter(d => 
      (d.borough && d.borough.toLowerCase().includes(q)) ||
      d.lat.toString().includes(q) ||
      d.lng.toString().includes(q) ||
      (d.id && d.id.toString().includes(q))
    );
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const pageData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 font-mono">
      <div className="w-full max-w-4xl max-h-[85vh] hud-panel rounded-3xl p-6 shadow-2xl border border-tactical-border flex flex-col justify-between space-y-4 hud-brackets">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-tactical-border">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-tactical-amber/10 border border-tactical-amber/40 rounded-2xl">
              <Database className="w-5 h-5 text-tactical-amber" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white uppercase font-hud tracking-wide">
                RAW SPATIAL DATA INSPECTOR
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Paginated telemetry listing of 355,886 geolocated crime incident coordinates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-white transition-all border border-transparent hover:border-tactical-border"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search and Export */}
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search sector, latitude, longitude or ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950/90 border border-tactical-border rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-tactical-amber font-mono"
            />
          </div>

          <button
            onClick={onExportCSV}
            className="flex items-center space-x-2 bg-tactical-amber hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-hud-amber font-hud uppercase tracking-wider"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT CSV ({filteredData.length.toLocaleString()})</span>
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto border border-tactical-border rounded-2xl bg-slate-950/90">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-slate-900 border-b border-tactical-border text-slate-400 uppercase tracking-wider font-hud">
                <th className="p-3 font-bold">INCIDENT ID</th>
                <th className="p-3 font-bold">SECTOR / BOROUGH</th>
                <th className="p-3 font-bold">LATITUDE</th>
                <th className="p-3 font-bold">LONGITUDE</th>
                <th className="p-3 font-bold">SECTOR QUADRANT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {pageData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-3 text-slate-500 font-normal">#{row.id}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-tactical-amber border border-tactical-amber/30 uppercase font-bold font-hud">
                      {row.borough}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-slate-200">{row.lat.toFixed(6)}° N</td>
                  <td className="p-3 font-bold text-slate-200">{row.lng.toFixed(6)}° W</td>
                  <td className="p-3 text-slate-400">
                    <span className="flex items-center space-x-1 text-slate-400 text-[11px]">
                      <MapPin className="w-3 h-3 text-tactical-crimson" />
                      <span>{row.lat > 40.7 ? 'NORTH NYC QUAD' : 'SOUTH NYC QUAD'}</span>
                    </span>
                  </td>
                </tr>
              ))}
              {pageData.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No matching spatial records found for "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="flex items-center justify-between pt-2 border-t border-tactical-border text-xs font-mono">
          <span className="text-slate-400">
            Page {currentPage} of {Math.max(totalPages, 1)} ({filteredData.length.toLocaleString()} records)
          </span>

          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              className="p-2 bg-slate-950 border border-tactical-border rounded-xl text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-900 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              className="p-2 bg-slate-950 border border-tactical-border rounded-xl text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-900 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
