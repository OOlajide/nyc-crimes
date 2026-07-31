import { ColorRamp, HotspotLocation, MapViewState } from '../types';

export const DEFAULT_VIEW_STATE: MapViewState = {
  longitude: -73.9712,
  latitude: 40.7484,
  zoom: 9,
  pitch: 52,
  bearing: -15,
};

export const COLOR_RAMPS: Record<ColorRamp, { name: string; colors: [number, number, number][] }> = {
  cyberpunk: {
    name: 'Cyberpunk Neon',
    colors: [
      [13, 148, 136],   // Teal
      [14, 165, 233],   // Sky Blue
      [99, 102, 241],   // Indigo
      [168, 85, 247],   // Purple
      [236, 72, 153],   // Pink
      [244, 63, 94],    // Rose Crimson
    ]
  },
  fire: {
    name: 'Infrared Fire',
    colors: [
      [254, 240, 138],  // Light Yellow
      [253, 224, 71],   // Bright Yellow
      [251, 146, 60],   // Orange
      [239, 68, 68],    // Red
      [185, 28, 28],    // Dark Red
      [127, 29, 29],    // Deep Crimson
    ]
  },
  emerald: {
    name: 'Emerald Tactical',
    colors: [
      [6, 78, 59],      // Dark Emerald
      [16, 185, 129],   // Emerald
      [52, 211, 153],   // Mint
      [250, 204, 21],   // Yellow Accent
      [249, 115, 22],   // Orange Accent
      [239, 68, 68],    // Red Accent
    ]
  },
  sunset: {
    name: 'Gotham Twilight',
    colors: [
      [30, 27, 75],     // Deep Indigo
      [67, 56, 202],    // Indigo
      [147, 51, 234],   // Violet
      [219, 39, 119],   // Magenta
      [244, 63, 94],    // Rose
      [251, 146, 60],   // Orange Highlight
    ]
  },
  neon: {
    name: 'Matrix Toxic',
    colors: [
      [20, 83, 45],     // Deep Green
      [34, 197, 94],    // Electric Green
      [74, 222, 128],   // Light Green
      [250, 204, 21],   // Yellow
      [249, 115, 22],   // Orange
      [239, 68, 68],    // Red
    ]
  }
};

export const BOROUGHS = [
  { id: 'All', name: 'All Boroughs', center: { latitude: 40.7484, longitude: -73.9712, zoom: 9, pitch: 52, bearing: -15 }, bounds: { minLat: 40.49, maxLat: 40.92, minLng: -74.26, maxLng: -73.69 } },
  { id: 'Manhattan', name: 'Manhattan', center: { latitude: 40.7831, longitude: -73.9712, zoom: 9, pitch: 55, bearing: -20 }, bounds: { minLat: 40.70, maxLat: 40.88, minLng: -74.02, maxLng: -73.91 } },
  { id: 'Brooklyn', name: 'Brooklyn', center: { latitude: 40.6782, longitude: -73.9442, zoom: 9, pitch: 50, bearing: 10 }, bounds: { minLat: 40.57, maxLat: 40.74, minLng: -74.05, maxLng: -73.85 } },
  { id: 'Queens', name: 'Queens', center: { latitude: 40.7282, longitude: -73.7949, zoom: 9, pitch: 45, bearing: 0 }, bounds: { minLat: 40.54, maxLat: 40.80, minLng: -73.96, maxLng: -73.70 } },
  { id: 'Bronx', name: 'The Bronx', center: { latitude: 40.8448, longitude: -73.8648, zoom: 9, pitch: 50, bearing: -10 }, bounds: { minLat: 40.79, maxLat: 40.92, minLng: -73.93, maxLng: -73.78 } },
  { id: 'Staten Island', name: 'Staten Island', center: { latitude: 40.5795, longitude: -74.1502, zoom: 9, pitch: 40, bearing: 15 }, bounds: { minLat: 40.50, maxLat: 40.65, minLng: -74.26, maxLng: -74.05 } },
];

export const TOUR_HOTSPOTS: HotspotLocation[] = [
  {
    name: 'Midtown Manhattan Corridor',
    borough: 'Manhattan',
    lat: 40.7549,
    lng: -73.9840,
    zoom: 14.5,
    pitch: 60,
    bearing: -30,
    description: 'High commercial density and transit hubs create concentrated incident clusters around Times Square, Penn Station, and Port Authority.'
  },
  {
    name: 'Downtown Brooklyn Center',
    borough: 'Brooklyn',
    lat: 40.6925,
    lng: -73.9870,
    zoom: 14.2,
    pitch: 55,
    bearing: 15,
    description: 'Major retail corridors and commercial transit junctions experience high crime frequency relative to residential surrounding neighborhoods.'
  },
  {
    name: 'Mott Haven & South Bronx',
    borough: 'Bronx',
    lat: 40.8090,
    lng: -73.9240,
    zoom: 14.0,
    pitch: 50,
    bearing: -10,
    description: 'Historical high-density urban corridor with elevated concentration of reported spatial incidents over the 2006-2016 decade.'
  },
  {
    name: 'Flushing & Jamaica Hubs',
    borough: 'Queens',
    lat: 40.7580,
    lng: -73.8300,
    zoom: 13.8,
    pitch: 45,
    bearing: 25,
    description: 'Primary transportation interchanges and bustling commercial centers in Queens with high spatial incident aggregation.'
  }
];
