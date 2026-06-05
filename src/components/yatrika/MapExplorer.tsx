import React, { useState, useEffect, useRef, useMemo } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import { X, MapPin, Navigation, Compass, RefreshCw } from "lucide-react";
import { getDestinations } from "@/lib/api-service";

interface DestCoordinate {
  name: string;
  lat: number;
  lng: number;
  desc: string;
  img: string;
  color: string;
  location: string;
  rating: number;
  budget: string;
  season: string;
}

// Coordinate mappings for SQLite locations
const locationCoordinates: Record<string, { lat: number; lng: number; color: string }> = {
  "Goa": { lat: 15.2993, lng: 74.1240, color: "#f43f5e" },
  "West Bengal": { lat: 22.9868, lng: 87.8550, color: "#10b981" },
  "Himachal Pradesh": { lat: 31.1048, lng: 77.1734, color: "#0ea5e9" },
  "Rajasthan": { lat: 27.0238, lng: 74.2179, color: "#f59e0b" },
  "Kerala": { lat: 10.8505, lng: 76.2711, color: "#10b981" },
  "Uttarakhand": { lat: 30.0668, lng: 79.0193, color: "#8b5cf6" },
  "Karnataka": { lat: 15.3173, lng: 75.7139, color: "#3b82f6" },
  "Tamil Nadu": { lat: 11.1271, lng: 78.6569, color: "#ec4899" },
  "Andaman and Nicobar": { lat: 11.7401, lng: 92.6586, color: "#0ea5e9" },
  "Sikkim": { lat: 27.5330, lng: 88.5122, color: "#10b981" },
  "Ladakh": { lat: 34.1526, lng: 77.5770, color: "#f8fafc" },
  "Assam": { lat: 26.2006, lng: 92.9376, color: "#22c55e" },
  "Gujarat": { lat: 22.2587, lng: 71.1924, color: "#f59e0b" },
  "Bihar": { lat: 25.0961, lng: 85.3131, color: "#f43f5e" },
  "Mizoram": { lat: 23.1645, lng: 92.9376, color: "#ec4899" },
  "Meghalaya": { lat: 25.4670, lng: 91.3662, color: "#10b981" },
  "Andhra Pradesh": { lat: 15.9129, lng: 79.7400, color: "#0ea5e9" },
  "Telangana": { lat: 18.1124, lng: 79.0193, color: "#ec4899" },
  "Delhi": { lat: 28.6139, lng: 77.2090, color: "#f43f5e" },
  "Delhi NCR": { lat: 28.6139, lng: 77.2090, color: "#f43f5e" },
  "Agra": { lat: 27.1767, lng: 78.0081, color: "#8b5cf6" },
  "Jammu and Kashmir": { lat: 33.7782, lng: 76.5762, color: "#f8fafc" },
  "Jammu & Kashmir": { lat: 33.7782, lng: 76.5762, color: "#f8fafc" },
  "Punjab": { lat: 31.1471, lng: 75.3412, color: "#f59e0b" },
  "Madhya Pradesh": { lat: 22.9734, lng: 78.6569, color: "#8b5cf6" },
  "Maharashtra": { lat: 19.7515, lng: 75.7139, color: "#0ea5e9" },
  "Odisha": { lat: 20.9517, lng: 85.0985, color: "#22c55e" },
  "Darjeeling": { lat: 27.0360, lng: 88.2627, color: "#10b981" },
  "Kalimpong": { lat: 27.0594, lng: 88.4694, color: "#10b981" },
  "Kurseong": { lat: 26.8812, lng: 88.2777, color: "#10b981" },
  "Kolkata West Bengal": { lat: 22.5726, lng: 88.3639, color: "#10b981" },
  "Chennai Tamil Nadu": { lat: 13.0827, lng: 80.2707, color: "#ec4899" },
  "Victoria Memorial": { lat: 22.5448, lng: 88.3426, color: "#10b981" },
  "Greece": { lat: 39.0742, lng: 21.8243, color: "#3b82f6" },
  "Santorini": { lat: 36.3932, lng: 25.4615, color: "#3b82f6" },
  "Switzerland": { lat: 46.8182, lng: 8.2275, color: "#f8fafc" },
  "France": { lat: 46.2276, lng: 2.2137, color: "#ef4444" },
  "Austria": { lat: 47.5162, lng: 14.5501, color: "#ef4444" },
  "Italy": { lat: 41.8719, lng: 12.5674, color: "#10b981" },
  "Germany": { lat: 51.1657, lng: 10.4515, color: "#ef4444" },
  "Russia": { lat: 61.5240, lng: 105.3188, color: "#f8fafc" },
  "United Kingdom": { lat: 55.3781, lng: -3.4360, color: "#ef4444" },
  "England": { lat: 52.3555, lng: -1.1743, color: "#ef4444" },
  "Ireland": { lat: 53.4129, lng: -8.2439, color: "#10b981" },
  "Romania": { lat: 45.9432, lng: 24.9668, color: "#f59e0b" },
  "Spain": { lat: 40.4637, lng: -3.7492, color: "#f59e0b" },
  "Netherlands": { lat: 52.1326, lng: 5.2913, color: "#f59e0b" },
  "Norway": { lat: 60.4720, lng: 8.4689, color: "#0ea5e9" },
  "Ukraine": { lat: 48.3794, lng: 31.1656, color: "#f59e0b" },
  "South Africa": { lat: -30.5595, lng: 22.9375, color: "#22c55e" },
  "Tanzania": { lat: -6.3690, lng: 34.8888, color: "#22c55e" },
  "Morocco": { lat: 31.7917, lng: -7.0926, color: "#ef4444" },
  "Somalia": { lat: 5.1521, lng: 46.1996, color: "#3b82f6" },
  "Mauritius": { lat: -20.3484, lng: 57.5522, color: "#ec4899" },
  "Mauritius Island": { lat: -20.3484, lng: 57.5522, color: "#ec4899" },
  "USA": { lat: 37.0902, lng: -95.7129, color: "#ef4444" },
  "Canada": { lat: 56.1304, lng: -106.3468, color: "#f8fafc" },
  "Mexico": { lat: 23.6345, lng: -102.5528, color: "#22c55e" },
  "Peru": { lat: -9.1900, lng: -75.0152, color: "#f59e0b" },
  "Brazil": { lat: -14.2350, lng: -51.9253, color: "#22c55e" },
  "Australia": { lat: -25.2744, lng: 133.7751, color: "#f59e0b" },
  "New Zealand": { lat: -40.9006, lng: 174.8860, color: "#0ea5e9" },
  "UAE": { lat: 23.4241, lng: 53.8478, color: "#f59e0b" },
  "Singapore": { lat: 1.3521, lng: 103.8198, color: "#ec4899" },
  "Vietnam": { lat: 14.0583, lng: 108.2772, color: "#ef4444" },
  "Bhutan": { lat: 27.5142, lng: 90.4336, color: "#f59e0b" },
  "Nepal": { lat: 28.3949, lng: 84.1240, color: "#f43f5e" },
  "Japan": { lat: 36.2048, lng: 138.2529, color: "#ef4444" },
  "Thailand": { lat: 15.8700, lng: 100.9925, color: "#f59e0b" },
  "Indonesia": { lat: -0.7893, lng: 113.9213, color: "#0ea5e9" },
  "South Korea": { lat: 35.9078, lng: 127.7669, color: "#3b82f6" },
  "Qatar": { lat: 25.3548, lng: 51.1839, color: "#8b5cf6" },
  "Doha": { lat: 25.2854, lng: 51.5310, color: "#8b5cf6" },
  "Philippines": { lat: 12.8797, lng: 121.7740, color: "#3b82f6" },
  "Manila": { lat: 14.5995, lng: 120.9842, color: "#3b82f6" },
  "Hanoi": { lat: 21.0285, lng: 105.8542, color: "#ef4444" },
  "Central Asia": { lat: 48.0196, lng: 66.9237, color: "#f59e0b" },
  "Caribbean": { lat: 21.4691, lng: -78.6569, color: "#0ea5e9" },
  "Maldives": { lat: 3.2028, lng: 73.2207, color: "#0ea5e9" }
};

// Fallback images matching category mood
const fallbackImages = {
  Adventure: "https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=800&q=80",
  Beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  City: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80",
  Nature: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80",
  HillStation: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
  Historical: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80"
};

export function MapExplorer() {
  const globeRef = useRef<GlobeMethods>();
  const [dbDestinations, setDbDestinations] = useState<DestCoordinate[]>([]);
  const [selectedDest, setSelectedDest] = useState<DestCoordinate | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch destinations from database on mount
  useEffect(() => {
    if (!mounted) return;
    
    const fetchGlobePoints = async () => {
      try {
        const response = await getDestinations({ limit: 80 }); // Load up to 80 items
        const rawItems = Array.isArray(response) ? response : response.data ?? [];
        
        // Filter and map locations to coordinates
        const mapped: DestCoordinate[] = rawItems
          .map((item: any) => {
            const name = item.name;
            const loc = item.location;
            
            // Match coordinates dictionary
            let coords = locationCoordinates[loc];
            if (!coords) {
              // Try substring matching
              const matchedKey = Object.keys(locationCoordinates).find(
                (k) => loc.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(loc.toLowerCase())
              );
              if (matchedKey) coords = locationCoordinates[matchedKey];
            }

            if (!coords) return null; // Skip if coordinates unknown

            // Determine image
            const category = item.category || "Nature";
            const img = fallbackImages[category.replace(/\s+/g, "") as keyof typeof fallbackImages] || fallbackImages.Nature;

            return {
              name,
              lat: coords.lat + (Math.random() * 0.4 - 0.2), // Slight jitter to prevent overlapping on same country
              lng: coords.lng + (Math.random() * 0.4 - 0.2),
              desc: item.description || "A beautiful cinematic traveler destination.",
              img,
              color: coords.color || "#0ea5e9",
              location: loc,
              rating: item.rating || 4.5,
              budget: item.budget || "Medium",
              season: item.season || "Summer"
            };
          })
          .filter((item: any): item is DestCoordinate => item !== null);

        setDbDestinations(mapped);
      } catch (err) {
        console.error("Failed to load globe points:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobePoints();
  }, [mounted]);

  // Set rotating controls
  useEffect(() => {
    if (!mounted || !globeRef.current) return;

    const globe = globeRef.current;
    const timer = setTimeout(() => {
      if (globe && typeof globe.controls === "function") {
        const controls = globe.controls();
        if (controls) {
          controls.autoRotate = isRotating;
          controls.autoRotateSpeed = 0.55;
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isRotating, mounted, dbDestinations]);

  // Generate flight loops around top 10 items
  const dynamicArcs = useMemo(() => {
    if (dbDestinations.length < 5) return [];
    const arcs = [];
    const count = Math.min(10, dbDestinations.length);
    for (let i = 0; i < count; i++) {
      const next = (i + 1) % count;
      arcs.push({
        startLat: dbDestinations[i].lat,
        startLng: dbDestinations[i].lng,
        endLat: dbDestinations[next].lat,
        endLng: dbDestinations[next].lng
      });
    }
    return arcs;
  }, [dbDestinations]);

  const handlePointClick = (point: object) => {
    const dest = point as DestCoordinate;
    setIsRotating(false);
    setSelectedDest(dest);

    // Smoothly fly to the location
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: dest.lat, lng: dest.lng, altitude: 1.4 }, 1000);
    }
  };

  if (!mounted) return <section id="map-explorer" className="h-[90vh] bg-[#020617] scroll-mt-24" />;

  return (
    <section
      id="map-explorer"
      className="relative h-[90vh] w-full overflow-hidden bg-[#020617] cursor-grab active:cursor-grabbing scroll-mt-24"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        html {
          scroll-behavior: smooth !important;
        }
        #map-explorer canvas {
          outline: none;
        }
      `,
        }}
      />

      {/* UI Overlay - Header */}
      <div className="absolute top-12 left-12 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4">
          <Compass className="w-4 h-4 text-sky-400 animate-pulse" />
          <span className="text-xs uppercase tracking-[0.3em] text-white/70 font-medium">
            3D Globe Network
          </span>
        </div>
        <h2 className="font-display text-5xl md:text-7xl text-white font-semibold leading-tight select-none">
          The World <br />
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
            At Your Fingertips
          </span>
        </h2>
      </div>

      {loading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center gap-2 bg-slate-950/80 p-5 rounded-3xl border border-white/10 text-white font-semibold text-xs tracking-wider">
          <RefreshCw size={14} className="animate-spin text-sky-400" /> LOADING MAP GRID...
        </div>
      )}

      {/* Destination Card - Glassmorphism Popup */}
      {selectedDest && (
        <div className="absolute bottom-12 right-12 z-30 w-full max-w-sm animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-950/40 border border-white/20 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-white">
            <button
              onClick={() => {
                setSelectedDest(null);
                setIsRotating(true);
              }}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="h-44 overflow-hidden">
              <img
                src={selectedDest.img}
                alt={selectedDest.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={14} className="text-sky-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400">
                  {selectedDest.location}
                </span>
              </div>
              <h3 className="font-display text-2xl text-white mb-2">{selectedDest.name}</h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-4">{selectedDest.desc}</p>
              
              <div className="flex justify-between items-center text-xs text-slate-400 border-t border-white/5 pt-3">
                <span>⭐ {selectedDest.rating} Rating</span>
                <span className="font-bold text-sky-400">{selectedDest.budget} Budget</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Globe Component */}
      <div className="absolute inset-0 z-10">
        <Globe
          ref={globeRef}
          globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
          showAtmosphere={true}
          atmosphereColor="#38bdf8"
          atmosphereAltitude={0.14}
          
          // Plot dynamic destinations
          labelsData={dbDestinations}
          labelLat={(d: object) => (d as DestCoordinate).lat}
          labelLng={(d: object) => (d as DestCoordinate).lng}
          labelText={(d: object) => (d as DestCoordinate).name}
          labelSize={0.95}
          labelDotRadius={0.45}
          labelColor={(d: object) => (d as DestCoordinate).color}
          labelResolution={2}
          onLabelClick={handlePointClick}
          
          // Dynamic arcs flight paths
          arcsData={dynamicArcs}
          arcColor={() => ["#38bdf8", "#818cf8"]}
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={2500}
          arcStroke={0.35}
          arcCurveResolution={64}
          
          onGlobeClick={() => {
            setSelectedDest(null);
            setIsRotating(true);
          }}
        />
      </div>

      {/* Radial Gradient Shading for Depth */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.85)_100%)] z-20" />

      {/* Bottom Controls Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-6 items-center text-white/40 text-[9px] font-bold uppercase tracking-[0.2em] select-none">
        <span className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-white/20" /> Drag to rotate
        </span>
        <span className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-white/20" /> Scroll to zoom
        </span>
        <span className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-white/20" /> Click destination node
        </span>
      </div>
    </section>
  );
}
