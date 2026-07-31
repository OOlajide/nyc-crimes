# NYC Crimes — Spatial Crime Intelligence Platform

A high-performance 3D geospatial visualization and analytics web application rendering 355,886 New York City crime incident records (2006–2016).

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Geospatial / WebGL**: Deck.gl v9, MapLibre GL JS, CartoDB Dark Matter basemap
- **UI**: Tailwind CSS, Lucide React, Glassmorphism design
- **Charts**: Recharts
- **Data**: Public CSV from GitHub (no API keys required)

## How to Run

The app is built for production and served with `vite preview`:

```bash
npm run build   # compile TypeScript + bundle
npm run preview # serve dist/ on port 5000
```

The configured workflow (`Start application`) runs `npm run preview` automatically.

## Key Notes

- No secrets or environment variables required — data is fetched from a public GitHub URL.
- The app requires WebGL support in the browser (Chrome/Firefox with hardware acceleration).
- `app.py` is an older Python/Streamlit prototype and is not part of the current stack.

## User Preferences

<!-- Agent: record user preferences here -->
