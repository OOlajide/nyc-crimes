export type VizMode = 'hexbin' | 'heatmap' | 'scatterplot';

export type ColorRamp = 'cyberpunk' | 'fire' | 'emerald' | 'sunset' | 'neon';

export interface CrimePoint {
  lng: number;
  lat: number;
  borough?: string;
  id?: number;
}

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
  transitionDuration?: number;
}

export interface LayerSettings {
  mode: VizMode;
  radius: number; // Hexagon radius or heatmap radius
  elevationScale: number;
  coverage: number;
  upperPercentile: number;
  opacity: number;
  colorRamp: ColorRamp;
  extruded: boolean;
  wireframe: boolean;
  pointRadius: number;
  heatmapIntensity: number;
  heatmapThreshold: number;
}

export interface FilterSettings {
  borough: string; // 'All' | 'Manhattan' | 'Brooklyn' | 'Queens' | 'Bronx' | 'Staten Island'
  densityThreshold: number;
  searchQuery: string;
  maxPointsDisplay: number;
}

export interface HotspotLocation {
  name: string;
  borough: string;
  lat: number;
  lng: number;
  description: string;
  zoom: number;
  pitch: number;
  bearing: number;
}
