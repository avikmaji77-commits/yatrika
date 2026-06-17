import React, { useState, useEffect, useRef, useMemo } from "react";
import Globe from "react-globe.gl";
import { X, MapPin, Navigation, Compass } from "lucide-react";

interface Destination {
  name: string;
  lat: number;
  lng: number;
  desc: string;
  img: string;
  color: string;
}

const destinations: Destination[] = [
  { name: "Bali", lat: -8.4095, lng: 115.1889, desc: "Tropical paradise with lush jungles and pristine beaches.", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80", color: "#0ea5e9" },
  { name: "Darjeeling", lat: 27.036, lng: 88.2627, desc: "The Queen of Hills, famous for tea gardens and Himalayan views.", img: "https://images.unsplash.com/photo-1544460481-c7d013093297?auto=format&fit=crop&w=800&q=80", color: "#10b981" },
  { name: "Santorini", lat: 36.3932, lng: 25.4615, desc: "Iconic white buildings and blue domes overlooking the Aegean Sea.", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80", color: "#3b82f6" },
  { name: "Rishikesh", lat: 30.0869, lng: 78.2676, desc: "Spiritual capital on the banks of the holy Ganges river.", img: "https://images.unsplash.com/photo-1598977123418-45205553f1d2?auto=format&fit=crop&w=800&q=80", color: "#8b5cf6" },
  { name: "Munnar", lat: 10.0889, lng: 77.0595, desc: "Rolling hills of emerald tea plantations in Kerala.", img: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80", color: "#22c55e" },
  { name: "Kyoto", lat: 35.0116, lng: 135.7681, desc: "Timeless traditions, temples, and serene Zen gardens.", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80", color: "#ef4444" },
  { name: "Switzerland", lat: 46.8182, lng: 8.2275, desc: "Snow-capped peaks and crystal clear alpine lakes.", img: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80", color: "#f8fafc" },
  { name: "Thailand", lat: 15.87, lng: 100.9925, desc: "Vibrant culture, bustling markets, and golden temples.", img: "https://images.unsplash.com/photo-1528181304800-2f170b89892f?auto=format&fit=crop&w=800&q=80", color: "#f59e0b" },
];

// Generate some flight arcs between locations for visual flair
const arcsData = [
  { startLat: destinations[0].lat, startLng: destinations[0].lng, endLat: destinations[5].lat, endLng: destinations[5].lng },
  { startLat: destinations[2].lat, startLng: destinations[2].lng, endLat: destinations[6].lat, endLng: destinations[6].lng },
  { startLat: destinations[7].lat, startLng: destinations[7].lng, endLat: destinations[1].lat, endLng: destinations[1].lng },
  { startLat: destinations[3].lat, startLng: destinations[3].lng, endLat: destinations[4].lat, endLng: destinations[4].lng },
  { startLat: destinations[6].lat, startLng: destinations[6].lng, endLat: destinations[0].lat, endLng: destinations[0].lng },
];

export function MapExplorer() {
  const globeRef = useRef<any>(null);
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !globeRef.current) return;

    const globe = globeRef.current;
    // Use a small delay to ensure Three.js controls are initialized
    const timer = setTimeout(() => {
      if (globe && typeof globe.controls === 'function') {
        const controls = globe.controls();
        if (controls) {
          controls.autoRotate = isRotating;
          controls.autoRotateSpeed = 0.6;
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isRotating, mounted]);

  const handlePointClick = (point: any) => {
    setIsRotating(false);
    setSelectedDest(point as Destination);
    
    // Smoothly fly to the location
    globeRef.current.pointOfView({ lat: point.lat, lng: point.lng, altitude: 1.5 }, 1000);
  };

  // Prevent SSR crash
  if (!mounted) return <section id="map-explorer" className="h-[90vh] bg-[#020617] scroll-mt-24" />;

  return (
    <section 
      id="map-explorer" 
      className="relative h-[90vh] w-full overflow-hidden bg-[#020617] cursor-grab active:cursor-grabbing scroll-mt-24"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        html {
          scroll-behavior: smooth !important;
        }
        #map-explorer canvas {
          outline: none;
        }
      `}} />

      {/* UI Overlay - Header */}
      <div className="absolute top-12 left-12 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4">
          <Compass className="w-4 h-4 text-sky-400 animate-pulse" />
          <span className="text-xs uppercase tracking-[0.3em] text-white/70 font-medium">Global Network</span>
        </div>
        <h2 className="font-display text-5xl md:text-7xl text-white font-semibold leading-tight">
          The World <br />
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
            At Your Fingertips
          </span>
        </h2>
      </div>

      {/* Destination Card - Glassmorphism Popup */}
      {selectedDest && (
        <div className="absolute bottom-12 right-12 z-30 w-full max-w-sm animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-950/40 border border-white/20 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <button 
              onClick={() => { setSelectedDest(null); setIsRotating(true); }}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
            >
              <X size={18} />
            </button>
            
            <div className="h-48 overflow-hidden">
              <img 
                src={selectedDest.img} 
                alt={selectedDest.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
              />
            </div>
            
            <div className="p-8">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-sky-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Featured Destination</span>
              </div>
              <h3 className="font-display text-3xl text-white mb-3">{selectedDest.name}</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {selectedDest.desc}
              </p>
              <button className="w-full py-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 group">
                <Navigation size={16} className="group-hover:translate-x-1 transition-transform" />
                Plan your visit
              </button>
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
          
          // Atmosphere & Ocean
          showAtmosphere={true}
          atmosphereColor="#38bdf8"
          atmosphereAltitude={0.15}
          
          // Markers (Labels)
          labelsData={destinations}
          labelLat={(d: any) => d.lat}
          labelLng={(d: any) => d.lng}
          labelText={(d: any) => d.name}
          labelSize={1.2}
          labelDotRadius={0.6}
          labelColor={(d: any) => d.color}
          labelResolution={2}
          onLabelClick={handlePointClick}
          
          // Arcs (Flights)
          arcsData={arcsData}
          arcColor={() => ['#38bdf8', '#818cf8']}
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={2000}
          arcStroke={0.4}
          arcCurveResolution={64}

          // Custom Lights & Interaction
          onGlobeClick={() => {
            setSelectedDest(null);
            setIsRotating(true);
          }}
        />
      </div>

      {/* Radial Gradient Shading for Depth */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.8)_100%)] z-20" />
      
      {/* Bottom Controls Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-6 items-center text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">
        <span className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-white/20" /> Drag to explore
        </span>
        <span className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-white/20" /> Scroll to zoom
        </span>
        <span className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-white/20" /> Click markers
        </span>
      </div>
    </section>
  );
}

/** 
 * STYLE NOTES:
 * 1. Background: Dark Navy (#020617) matches premium luxury UIs.
 * 2. Textures: Using Blue Marble + Topology for realistic depth.
 * 3. Glassmorphism: The popup uses high backdrop-blur and thin borders.
 * 4. Animation: Auto-rotation pauses on interaction to focus on the content.
 * 5. Visual Flair: Pulsing flight arcs create a sense of movement.
 */

/* 
  To use this, make sure to install:
  npm install react-globe.gl three
*/