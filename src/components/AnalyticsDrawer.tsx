import React from 'react';
import { X, BarChart2, PieChart as PieIcon, ShieldAlert, Activity, MapPin, TrendingUp, AlertTriangle } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { CrimePoint } from '../types';

interface AnalyticsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: CrimePoint[];
  selectedBorough: string;
}

export const AnalyticsDrawer: React.FC<AnalyticsDrawerProps> = ({
  isOpen,
  onClose,
  data,
  selectedBorough
}) => {
  if (!isOpen) return null;

  // Calculate borough stats
  const boroughCounts: Record<string, number> = {
    Manhattan: 0,
    Brooklyn: 0,
    Queens: 0,
    Bronx: 0,
    'Staten Island': 0,
    Other: 0
  };

  data.forEach((p) => {
    const b = p.borough || 'Other';
    boroughCounts[b] = (boroughCounts[b] || 0) + 1;
  });

  const totalFiltered = data.length || 1;

  const barData = Object.entries(boroughCounts)
    .filter(([name]) => name !== 'Other')
    .map(([name, count]) => ({
      name,
      count,
      percentage: ((count / totalFiltered) * 100).toFixed(1)
    }));

  const pieColors = ['#ffaa00', '#00f0ff', '#10b981', '#a855f7', '#ff2e5b', '#64748b'];

  const pieData = Object.entries(boroughCounts)
    .filter(([_, count]) => count > 0)
    .map(([name, value]) => ({ name, value }));

  const highestBorough = barData.reduce((prev, current) => 
    (prev.count > current.count) ? prev : current, { name: 'N/A', count: 0, percentage: '0' });

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] hud-panel border-l border-tactical-border p-6 overflow-y-auto shadow-2xl flex flex-col justify-between animate-in fade-in slide-in-from-right duration-300 font-mono">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-tactical-border">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-tactical-amber/10 border border-tactical-amber/40 rounded-xl">
              <BarChart2 className="w-5 h-5 text-tactical-amber" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-wider uppercase font-hud text-white">
                TELEMETRY & ANALYTICS HUB
              </h2>
              <p className="text-[11px] text-slate-400">
                Spatial distribution & borough volume matrix
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-white border border-transparent hover:border-tactical-border transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-950/80 border border-tactical-border p-3.5 rounded-2xl relative overflow-hidden hud-brackets">
            <div className="text-[10px] uppercase text-slate-400 mb-1 flex items-center justify-between font-bold tracking-wider">
              <span>ACTIVE REGION</span>
              <Activity className="w-3.5 h-3.5 text-tactical-amber" />
            </div>
            <div className="text-lg font-extrabold text-white font-hud uppercase">{selectedBorough}</div>
            <div className="text-xs text-tactical-amber mt-1 font-bold">
              {data.length.toLocaleString()} Incidents
            </div>
          </div>

          <div className="bg-slate-950/80 border border-tactical-border p-3.5 rounded-2xl relative overflow-hidden hud-brackets">
            <div className="text-[10px] uppercase text-slate-400 mb-1 flex items-center justify-between font-bold tracking-wider">
              <span>PRIMARY CLUSTER</span>
              <AlertTriangle className="w-3.5 h-3.5 text-tactical-crimson" />
            </div>
            <div className="text-lg font-extrabold text-tactical-crimson font-hud uppercase">{highestBorough.name}</div>
            <div className="text-xs text-slate-400 mt-1 font-bold">
              {highestBorough.percentage}% of active volume
            </div>
          </div>
        </div>

        {/* Chart 1: Borough Incident Volume */}
        <div className="bg-slate-950/90 border border-tactical-border p-4 rounded-2xl space-y-3 hud-brackets">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold font-hud text-white uppercase tracking-wider flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-tactical-amber" />
              <span>Incident Count by Borough</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">2006–2016</span>
          </div>

          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip 
                  formatter={(value: any) => [`${Number(value).toLocaleString()} reported crimes`, 'Incident Volume']}
                  labelFormatter={(label: any) => `Borough: ${label}`}
                  contentStyle={{ 
                    backgroundColor: '#050811', 
                    borderColor: '#ffaa00', 
                    borderRadius: '10px', 
                    color: '#fff',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px',
                    boxShadow: '0 0 15px rgba(255, 170, 0, 0.2)'
                  }}
                  itemStyle={{ color: '#ffaa00', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" fill="#ffaa00" radius={[4, 4, 0, 0]} name="Reported Crimes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Donut Share */}
        <div className="bg-slate-950/90 border border-tactical-border p-4 rounded-2xl space-y-3 hud-brackets">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold font-hud text-white uppercase tracking-wider flex items-center space-x-2">
              <PieIcon className="w-4 h-4 text-tactical-cyan" />
              <span>Spatial Share Ratio</span>
            </h3>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${Number(value).toLocaleString()} reported crimes`, 'Volume']}
                  contentStyle={{ 
                    backgroundColor: '#050811', 
                    borderColor: '#00f0ff', 
                    borderRadius: '10px',
                    color: '#fff',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
            {barData.map((item, idx) => (
              <div key={item.name} className="flex items-center space-x-2 text-slate-300">
                <div 
                  className="w-2.5 h-2.5 rounded-sm" 
                  style={{ backgroundColor: pieColors[idx % pieColors.length] }} 
                />
                <span className="truncate">{item.name}</span>
                <span className="text-slate-500 font-normal">({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="bg-tactical-amber/10 border border-tactical-amber/30 p-4 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2 text-tactical-amber text-xs font-bold uppercase tracking-wider font-hud">
            <ShieldAlert className="w-4 h-4" />
            <span>TELEMETRY SUMMARY</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Manhattan and Brooklyn account for over <strong>63%</strong> of total reported incidents in this decade dataset, with key dense clusters focused around transit hubs and commercial sectors.
          </p>
        </div>
      </div>

      <div className="pt-6 border-t border-tactical-border text-center">
        <button
          onClick={onClose}
          className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold py-3 rounded-xl border border-tactical-border transition-all uppercase tracking-wider font-hud"
        >
          Close Insights Drawer
        </button>
      </div>
    </div>
  );
};
