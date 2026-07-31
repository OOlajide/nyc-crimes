import { CrimePoint } from '../types';

export interface DataLoadProgress {
  loaded: number;
  total: number;
  status: string;
}

export const loadCrimeData = async (
  onProgress?: (progress: DataLoadProgress) => void
): Promise<CrimePoint[]> => {
  try {
    onProgress?.({ loaded: 0, total: 355886, status: 'Fetching spatial binary dataset...' });
    
    // Try fast binary file first
    const binResponse = await fetch('/data/nyc_crimes.bin');
    if (binResponse.ok) {
      const buffer = await binResponse.arrayBuffer();
      const float32Array = new Float32Array(buffer);
      const count = float32Array.length / 2;
      const points: CrimePoint[] = new Array(count);

      onProgress?.({ loaded: count / 2, total: count, status: 'Parsing binary spatial coordinates...' });

      for (let i = 0; i < count; i++) {
        const lng = float32Array[i * 2];
        const lat = float32Array[i * 2 + 1];

        // Classify borough
        let borough = 'Other';
        if (lat >= 40.70 && lat <= 40.88 && lng >= -74.02 && lng <= -73.91) {
          borough = 'Manhattan';
        } else if (lat >= 40.57 && lat <= 40.74 && lng >= -74.05 && lng <= -73.85) {
          borough = 'Brooklyn';
        } else if (lat >= 40.54 && lat <= 40.80 && lng >= -73.96 && lng <= -73.70) {
          borough = 'Queens';
        } else if (lat >= 40.79 && lat <= 40.92 && lng >= -73.93 && lng <= -73.78) {
          borough = 'Bronx';
        } else if (lat >= 40.50 && lat <= 40.65 && lng >= -74.26 && lng <= -74.05) {
          borough = 'Staten Island';
        }

        points[i] = { id: i, lng, lat, borough };
      }

      onProgress?.({ loaded: count, total: count, status: 'Complete' });
      return points;
    }
  } catch (err) {
    console.warn('Binary fetch failed, falling back to raw CSV fetch', err);
  }

  // Fallback to raw GitHub CSV
  onProgress?.({ loaded: 0, total: 355886, status: 'Downloading raw CSV data from repository...' });
  const rawCsvUrl = 'https://raw.githubusercontent.com/OOlajide/nyc_crime_dataset/main/nyc_crimes.csv';
  const response = await fetch(rawCsvUrl);
  const text = await response.text();
  const lines = text.split('\n');
  const points: CrimePoint[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(',');
    if (parts.length >= 2) {
      const lng = parseFloat(parts[0]);
      const lat = parseFloat(parts[1]);
      if (!isNaN(lng) && !isNaN(lat)) {
        let borough = 'Other';
        if (lat >= 40.70 && lat <= 40.88 && lng >= -74.02 && lng <= -73.91) {
          borough = 'Manhattan';
        } else if (lat >= 40.57 && lat <= 40.74 && lng >= -74.05 && lng <= -73.85) {
          borough = 'Brooklyn';
        } else if (lat >= 40.54 && lat <= 40.80 && lng >= -73.96 && lng <= -73.70) {
          borough = 'Queens';
        } else if (lat >= 40.79 && lat <= 40.92 && lng >= -73.93 && lng <= -73.78) {
          borough = 'Bronx';
        } else if (lat >= 40.50 && lat <= 40.65 && lng >= -74.26 && lng <= -74.05) {
          borough = 'Staten Island';
        }

        points.push({ id: i - 1, lng, lat, borough });
      }
    }
  }

  return points;
};
