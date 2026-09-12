import React, { useState, useEffect, useRef, useMemo } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import { X, MapPin, Navigation, Compass, RefreshCw } from "lucide-react";
import { getDestinations } from "@/lib/api-service";
import { places } from "@/components/yatrika/Destination";
import { GlassSelect } from "@/components/yatrika/GlassSelect";

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
  Goa: { lat: 15.2993, lng: 74.124, color: "#f43f5e" },
  "West Bengal": { lat: 22.9868, lng: 87.855, color: "#10b981" },
  "Himachal Pradesh": { lat: 31.1048, lng: 77.1734, color: "#0ea5e9" },
  Rajasthan: { lat: 27.0238, lng: 74.2179, color: "#f59e0b" },
  Kerala: { lat: 10.8505, lng: 76.2711, color: "#10b981" },
  Uttarakhand: { lat: 30.0668, lng: 79.0193, color: "#8b5cf6" },
  Karnataka: { lat: 15.3173, lng: 75.7139, color: "#3b82f6" },
  "Tamil Nadu": { lat: 11.1271, lng: 78.6569, color: "#ec4899" },
  "Andaman and Nicobar": { lat: 11.7401, lng: 92.6586, color: "#0ea5e9" },
  Sikkim: { lat: 27.533, lng: 88.5122, color: "#10b981" },
  Ladakh: { lat: 34.1526, lng: 77.577, color: "#f8fafc" },
  Assam: { lat: 26.2006, lng: 92.9376, color: "#22c55e" },
  Gujarat: { lat: 22.2587, lng: 71.1924, color: "#f59e0b" },
  Bihar: { lat: 25.0961, lng: 85.3131, color: "#f43f5e" },
  Mizoram: { lat: 23.1645, lng: 92.9376, color: "#ec4899" },
  Meghalaya: { lat: 25.467, lng: 91.3662, color: "#10b981" },
  "Andhra Pradesh": { lat: 15.9129, lng: 79.74, color: "#0ea5e9" },
  Telangana: { lat: 18.1124, lng: 79.0193, color: "#ec4899" },
  Delhi: { lat: 28.6139, lng: 77.209, color: "#f43f5e" },
  "Delhi NCR": { lat: 28.6139, lng: 77.209, color: "#f43f5e" },
  Agra: { lat: 27.1767, lng: 78.0081, color: "#8b5cf6" },
  "Jammu and Kashmir": { lat: 33.7782, lng: 76.5762, color: "#f8fafc" },
  "Jammu & Kashmir": { lat: 33.7782, lng: 76.5762, color: "#f8fafc" },
  Punjab: { lat: 31.1471, lng: 75.3412, color: "#f59e0b" },
  "Madhya Pradesh": { lat: 22.9734, lng: 78.6569, color: "#8b5cf6" },
  Maharashtra: { lat: 19.7515, lng: 75.7139, color: "#0ea5e9" },
  Odisha: { lat: 20.9517, lng: 85.0985, color: "#22c55e" },
  Darjeeling: { lat: 27.036, lng: 88.2627, color: "#10b981" },
  Kalimpong: { lat: 27.0594, lng: 88.4694, color: "#10b981" },
  Kurseong: { lat: 26.8812, lng: 88.2777, color: "#10b981" },
  "Kolkata West Bengal": { lat: 22.5726, lng: 88.3639, color: "#10b981" },
  "Chennai Tamil Nadu": { lat: 13.0827, lng: 80.2707, color: "#ec4899" },
  "Victoria Memorial": { lat: 22.5448, lng: 88.3426, color: "#10b981" },
  Greece: { lat: 39.0742, lng: 21.8243, color: "#3b82f6" },
  Santorini: { lat: 36.3932, lng: 25.4615, color: "#3b82f6" },
  Switzerland: { lat: 46.8182, lng: 8.2275, color: "#f8fafc" },
  France: { lat: 46.2276, lng: 2.2137, color: "#ef4444" },
  Austria: { lat: 47.5162, lng: 14.5501, color: "#ef4444" },
  Italy: { lat: 41.8719, lng: 12.5674, color: "#10b981" },
  Germany: { lat: 51.1657, lng: 10.4515, color: "#ef4444" },
  Russia: { lat: 61.524, lng: 105.3188, color: "#f8fafc" },
  "United Kingdom": { lat: 55.3781, lng: -3.436, color: "#ef4444" },
  England: { lat: 52.3555, lng: -1.1743, color: "#ef4444" },
  Ireland: { lat: 53.4129, lng: -8.2439, color: "#10b981" },
  Romania: { lat: 45.9432, lng: 24.9668, color: "#f59e0b" },
  Spain: { lat: 40.4637, lng: -3.7492, color: "#f59e0b" },
  Netherlands: { lat: 52.1326, lng: 5.2913, color: "#f59e0b" },
  Norway: { lat: 60.472, lng: 8.4689, color: "#0ea5e9" },
  Ukraine: { lat: 48.3794, lng: 31.1656, color: "#f59e0b" },
  "South Africa": { lat: -30.5595, lng: 22.9375, color: "#22c55e" },
  Tanzania: { lat: -6.369, lng: 34.8888, color: "#22c55e" },
  Morocco: { lat: 31.7917, lng: -7.0926, color: "#ef4444" },
  Somalia: { lat: 5.1521, lng: 46.1996, color: "#3b82f6" },
  Mauritius: { lat: -20.3484, lng: 57.5522, color: "#ec4899" },
  "Mauritius Island": { lat: -20.3484, lng: 57.5522, color: "#ec4899" },
  USA: { lat: 37.0902, lng: -95.7129, color: "#ef4444" },
  Canada: { lat: 56.1304, lng: -106.3468, color: "#f8fafc" },
  Mexico: { lat: 23.6345, lng: -102.5528, color: "#22c55e" },
  Peru: { lat: -9.19, lng: -75.0152, color: "#f59e0b" },
  Brazil: { lat: -14.235, lng: -51.9253, color: "#22c55e" },
  Australia: { lat: -25.2744, lng: 133.7751, color: "#f59e0b" },
  "New Zealand": { lat: -40.9006, lng: 174.886, color: "#0ea5e9" },
  UAE: { lat: 23.4241, lng: 53.8478, color: "#f59e0b" },
  Singapore: { lat: 1.3521, lng: 103.8198, color: "#ec4899" },
  Vietnam: { lat: 14.0583, lng: 108.2772, color: "#ef4444" },
  Bhutan: { lat: 27.5142, lng: 90.4336, color: "#f59e0b" },
  Nepal: { lat: 28.3949, lng: 84.124, color: "#f43f5e" },
  Japan: { lat: 36.2048, lng: 138.2529, color: "#ef4444" },
  Thailand: { lat: 15.87, lng: 100.9925, color: "#f59e0b" },
  Indonesia: { lat: -0.7893, lng: 113.9213, color: "#0ea5e9" },
  "South Korea": { lat: 35.9078, lng: 127.7669, color: "#3b82f6" },
  Qatar: { lat: 25.3548, lng: 51.1839, color: "#8b5cf6" },
  Doha: { lat: 25.2854, lng: 51.531, color: "#8b5cf6" },
  Philippines: { lat: 12.8797, lng: 121.774, color: "#3b82f6" },
  Manila: { lat: 14.5995, lng: 120.9842, color: "#3b82f6" },
  Hanoi: { lat: 21.0285, lng: 105.8542, color: "#ef4444" },
  "Central Asia": { lat: 48.0196, lng: 66.9237, color: "#f59e0b" },
  Caribbean: { lat: 21.4691, lng: -78.6569, color: "#0ea5e9" },
  Maldives: { lat: 3.2028, lng: 73.2207, color: "#0ea5e9" },
};

// Fallback images matching category mood
const fallbackImages = {
  Adventure:
    "https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=800&q=80",
  Beach:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  City: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80",
  Nature:
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80",
  HillStation:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
  Historical:
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
};

const startingHubs = [
  { name: "New Delhi, India", lat: 28.6139, lng: 77.209 },
  { name: "Mumbai, India", lat: 19.076, lng: 72.8777 },
  { name: "Kolkata, India", lat: 22.5726, lng: 88.3639 },
  { name: "Chennai, India", lat: 13.0827, lng: 80.2707 },
  { name: "Bangalore, India", lat: 12.9716, lng: 77.5946 },
  { name: "London, UK", lat: 51.5074, lng: -0.1278 },
  { name: "New York, USA", lat: 40.7128, lng: -74.006 },
  { name: "Tokyo, Japan", lat: 35.6762, lng: 139.6503 },
  { name: "Sydney, Australia", lat: -33.8688, lng: 151.2093 },
];

const startingHubOptions = startingHubs.map((hub) => ({
  value: hub.name,
  label: hub.name.split(",")[0],
}));

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function MapExplorer() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [dbDestinations, setDbDestinations] = useState<DestCoordinate[]>([]);
  const [selectedDest, setSelectedDest] = useState<DestCoordinate | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [L, setL] = useState<any>(null);
  const [selectedHub, setSelectedHub] = useState(startingHubs[0]);
  const [travelMode, setTravelMode] = useState<"Flight" | "Train" | "Road">("Flight");

  const mapInstanceRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);
  const mapContainerId = "leaflet-map";

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      import("leaflet").then((module) => {
        setL(module.default);
      });
      import("leaflet/dist/leaflet.css");
    }
  }, []);

  // Fetch destinations from database on mount
  useEffect(() => {
    if (!mounted) return;

    const fetchGlobePoints = async () => {
      let rawItems: any[] = [];
      try {
        const response = await getDestinations({ limit: 80 }); // Load up to 80 items
        rawItems = Array.isArray(response) ? response : (response.data ?? []);
      } catch (err) {
        console.warn("Failed to load globe points from API, falling back to local places:", err);
      }

      if (rawItems.length === 0) {
        rawItems = places;
      }

      // Filter and map locations to coordinates
      const mapped: DestCoordinate[] = rawItems
        .map((item: any) => {
          const name = item.name;
          const loc = item.location || item.region; // Fallback to region for static places
          if (!loc) return null;

          // Match coordinates dictionary
          let coords = locationCoordinates[loc];
          if (!coords) {
            // Try substring matching
            const matchedKey = Object.keys(locationCoordinates).find(
              (k) =>
                loc.toLowerCase().includes(k.toLowerCase()) ||
                k.toLowerCase().includes(loc.toLowerCase()),
            );
            if (matchedKey) coords = locationCoordinates[matchedKey];
          }

          if (!coords) return null; // Skip if coordinates unknown

          // Determine image
          const category = item.category || "Nature";
          const img =
            item.img ||
            fallbackImages[category.replace(/\s+/g, "") as keyof typeof fallbackImages] ||
            fallbackImages.Nature;

          return {
            name,
            lat: coords.lat + (Math.random() * 0.4 - 0.2), // Slight jitter to prevent overlapping on same country
            lng: coords.lng + (Math.random() * 0.4 - 0.2),
            desc: item.description || "A beautiful cinematic traveler destination.",
            img,
            color: coords.color || "#0ea5e9",
            location: loc,
            rating: item.rating || 4.5,
            budget:
              item.budget || (item.rating >= 4.8 ? "High" : item.rating >= 4.6 ? "Medium" : "Low"),
            season: item.season || "Summer",
          };
        })
        .filter((item: any): item is DestCoordinate => item !== null);

      setDbDestinations(mapped);
      setLoading(false);
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
        endLng: dbDestinations[next].lng,
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

  // Render 2D Route map using Leaflet
  useEffect(() => {
    if (!L || !selectedDest) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        layerGroupRef.current = null;
      }
      return;
    }

    const timer = setTimeout(() => {
      const container = document.getElementById(mapContainerId);
      if (!container) return;

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerId, {
          zoomControl: false,
          attributionControl: false,
        }).setView([selectedHub.lat, selectedHub.lng], 4);

        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          maxZoom: 19,
        }).addTo(map);

        const layerGroup = L.layerGroup().addTo(map);

        mapInstanceRef.current = map;
        layerGroupRef.current = layerGroup;
      }

      const map = mapInstanceRef.current;
      const layerGroup = layerGroupRef.current;

      if (map && layerGroup) {
        layerGroup.clearLayers();

        const startCoords: [number, number] = [selectedHub.lat, selectedHub.lng];
        const destCoords: [number, number] = [selectedDest.lat, selectedDest.lng];

        const startIcon = L.divIcon({
          className: "custom-start-marker",
          html: `<div class="relative flex items-center justify-center">
                   <span class="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-sky-400 opacity-75"></span>
                   <span class="relative inline-flex rounded-full h-3 w-3 bg-sky-500 border-2 border-white"></span>
                 </div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const destIcon = L.divIcon({
          className: "custom-dest-marker",
          html: `<div class="relative flex items-center justify-center">
                   <span class="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-rose-400 opacity-75"></span>
                   <span class="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border-2 border-white"></span>
                 </div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        L.marker(startCoords, { icon: startIcon }).addTo(layerGroup);
        L.marker(destCoords, { icon: destIcon }).addTo(layerGroup);

        const routeLine = L.polyline([startCoords, destCoords], {
          color: "#38bdf8",
          weight: 3,
          dashArray: "5, 10",
          lineCap: "round",
        }).addTo(layerGroup);

        map.invalidateSize();
        map.fitBounds(routeLine.getBounds(), {
          padding: [40, 40],
          maxZoom: 8,
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [L, selectedDest, selectedHub]);

  const distance = useMemo(() => {
    if (!selectedDest) return 0;
    return getDistanceKm(selectedHub.lat, selectedHub.lng, selectedDest.lat, selectedDest.lng);
  }, [selectedDest, selectedHub]);

  const travelTime = useMemo(() => {
    if (distance === 0) return "0 mins";
    if (travelMode === "Flight") {
      const hours = distance / 800 + 1;
      const h = Math.floor(hours);
      const m = Math.round((hours - h) * 60);
      return h > 0 ? `${h}h ${m}m` : `${m}m`;
    } else if (travelMode === "Train") {
      const hours = distance / 80 + 2;
      const h = Math.floor(hours);
      const m = Math.round((hours - h) * 60);
      return h > 0 ? `${h}h ${m}m` : `${m}m`;
    } else {
      const hours = distance / 60 + 1;
      const h = Math.floor(hours);
      const m = Math.round((hours - h) * 60);
      return h > 0 ? `${h}h ${m}m` : `${m}m`;
    }
  }, [distance, travelMode]);

  const directions = useMemo(() => {
    if (!selectedDest) return [];

    const hubName = selectedHub.name.split(",")[0];
    const destName = selectedDest.name;
    const destLoc = selectedDest.location;

    if (travelMode === "Flight") {
      return [
        `Arrive at the nearest primary airport from ${hubName}.`,
        `Board a flight directed to the airport closest to ${destLoc} (Approx flight path: ${distance.toLocaleString()} km).`,
        `Upon arrival, board local transit/cabs to travel directly to ${destName}.`,
      ];
    } else if (travelMode === "Train") {
      return [
        `Board the express train from ${hubName} Central railway station.`,
        `Enjoy the scenic rail route navigating towards ${destLoc} station.`,
        `Take a pre-paid taxi or auto-rickshaw to complete the final stretch to ${destName}.`,
      ];
    } else {
      return [
        `Set navigation origin from ${hubName} and drive towards highway routes.`,
        `Follow national highway direction signs leading to ${destLoc}.`,
        `Navigate local roads in ${destLoc} to arrive at the coordinates of ${destName}.`,
      ];
    }
  }, [selectedDest, selectedHub, travelMode, distance]);

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
        .leaflet-container {
          background: #020617 !important;
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
        <h2 className="font-display text-2xl md:text-3xl text-white font-semibold leading-tight select-none">
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

      {/* Journey Planner and Map Panel */}
      {selectedDest && (
        <div className="absolute top-4 right-4 bottom-4 z-30 w-[90%] sm:w-96 md:w-[28rem] animate-in slide-in-from-right duration-500 flex flex-col">
          <div className="flex-1 overflow-y-auto rounded-[2rem] bg-slate-950/75 border border-white/20 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-white flex flex-col">
            {/* Header image and title */}
            <div className="relative h-40 shrink-0">
              <img
                src={selectedDest.img}
                alt={selectedDest.name}
                className="w-full h-full object-cover rounded-t-[2rem]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
              <button
                onClick={() => {
                  setSelectedDest(null);
                  setIsRotating(true);
                }}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer border border-white/10"
              >
                <X size={18} />
              </button>

              <div className="absolute bottom-4 left-6 pr-6">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={12} className="text-sky-400" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-sky-400">
                    {selectedDest.location}
                  </span>
                </div>
                <h3 className="font-display text-2xl text-white font-semibold truncate">
                  {selectedDest.name}
                </h3>
              </div>
            </div>

            {/* Scrollable content area */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-5">
              {/* Description */}
              <p className="text-slate-300 text-xs leading-relaxed">{selectedDest.desc}</p>

              {/* Journey Route Section */}
              <div className="border-t border-white/10 pt-4">
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3 flex items-center gap-1.5 select-none">
                  <Navigation size={12} className="text-sky-400" /> Journey Directions & Route
                </h4>

                {/* Leaflet 2D Map Container */}
                <div
                  id="leaflet-map"
                  className="w-full h-48 rounded-2xl border border-white/15 overflow-hidden mb-4 relative z-10 bg-slate-900/50 flex items-center justify-center text-xs text-slate-500"
                >
                  {!L && <span>Initializing map engine...</span>}
                </div>

                {/* Routing Form */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 select-none">
                      Starting Hub
                    </label>
                    <GlassSelect
                      value={selectedHub.name}
                      onValueChange={(value) => {
                        const hub = startingHubs.find((h) => h.name === value);
                        if (hub) setSelectedHub(hub);
                      }}
                      options={startingHubOptions}
                      triggerClassName="min-h-8 rounded-xl px-2.5 py-1.5 text-xs"
                      valueClassName="text-xs"
                      contentClassName="bg-slate-950/85"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 select-none">
                      Travel Mode
                    </label>
                    <div className="flex border border-white/10 rounded-xl p-0.5 bg-white/5">
                      {(["Flight", "Train", "Road"] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setTravelMode(mode)}
                          className={`flex-1 py-1 text-[10px] font-semibold rounded-lg transition-all cursor-pointer ${
                            travelMode === mode
                              ? "bg-sky-500 text-white"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {mode === "Flight" ? "✈️" : mode === "Train" ? "🚆" : "🚗"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Travel stats */}
                <div className="grid grid-cols-2 gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 mb-4 text-center select-none">
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                      Distance
                    </span>
                    <span className="text-base font-bold text-sky-400">
                      {distance.toLocaleString()} km
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                      Est. Duration
                    </span>
                    <span className="text-base font-bold text-emerald-400">{travelTime}</span>
                  </div>
                </div>

                {/* Step-by-Step Directions */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-2 select-none">
                    Step-by-step Route
                  </span>
                  <ul className="text-[11px] text-slate-300 space-y-2 select-text">
                    {directions.map((step, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="font-bold text-sky-400 shrink-0">{idx + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Sticky Footer actions */}
            <div className="p-6 border-t border-white/10 bg-slate-950/90 rounded-b-[2rem] flex justify-between items-center text-xs shrink-0 select-none">
              <div className="flex flex-col">
                <span className="text-slate-400">Rating</span>
                <span className="font-semibold text-white">⭐ {selectedDest.rating} / 5.0</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-slate-400">Budget Category</span>
                <span className="font-semibold text-sky-400">
                  {isNaN(Number(selectedDest.budget))
                    ? selectedDest.budget
                    : `₹${Number(selectedDest.budget).toLocaleString()}`}
                </span>
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
