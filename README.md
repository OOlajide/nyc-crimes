# NYC Crimes — Spatial Crime Intelligence Platform

A high-performance 3D geospatial visualization and analytics web application for rendering **355,886 New York City crime incident records** (2006–2016).

## ✨ Key Features & Architecture

- **🚀 WebGL 3D Spatial Rendering**: Powered by Deck.gl v9 & MapLibre GL JS for smooth 60 FPS rendering of 350K+ spatial coordinates.
- **⚡ Fast Binary Spatial Loader**: Custom Float32Array ArrayBuffer loader that parses 355,886 coordinates in <20ms.
- **🎨 3D Hexbin Extrusion**: Extruded 3D hex columns with customizable radius, height scale, coverage gap, and percentile cutoffs.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Geospatial & WebGL**: Deck.gl v9, MapLibre GL JS, CartoDB Dark Matter Basemap
- **UI & Styling**: Tailwind CSS, Lucide React, Glassmorphism CSS Design System
- **Data Visualization**: Recharts, Float32Array Binary Buffers

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build Production Bundle

```bash
npm run build
```

## 📂 Data Attribution

- Data sourced from [NYPD Complaint Data Historic](https://data.cityofnewyork.us/Public-Safety/NYPD-Complaint-Data-Historic/qgea-i56i/about_data) on NYC Open Data.
