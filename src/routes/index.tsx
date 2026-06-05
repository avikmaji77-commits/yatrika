import React, { Suspense, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/yatrika/Navbar";
import { Hero } from "@/components/yatrika/Hero";
import { Categories } from "@/components/yatrika/Categories";
import { Regions } from "@/components/yatrika/Regions";
import { Destinations } from "@/components/yatrika/Destination";
import { CTA } from "@/components/yatrika/CTA";
import { Footer } from "@/components/yatrika/Footer";
import { AIChatbot } from "@/components/yatrika/AIChatbot";
import { AIEngine } from "@/components/yatrika/AIEngine";
import { CountryProvider } from "@/components/yatrika/CountryContext";

// Lazy load MapExplorer to prevent server-side rendering errors due to canvas/three.js globe.gl dependencies
const MapExplorer = React.lazy(() =>
  import("@/components/yatrika/MapExplorer").then((module) => ({
    default: module.MapExplorer,
  })),
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yatrika — Cinematic travel experiences" },
      {
        name: "description",
        content:
          "Explore cinematic travel destinations, curated journeys, and premium escapes with Yatrika.",
      },
      { property: "og:title", content: "Yatrika — Cinematic travel experiences" },
      {
        property: "og:description",
        content: "Discover premium travel escapes with cinematic style and expert planning.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <CountryProvider>
      <main className="bg-background text-foreground min-h-screen">
        <Navbar />
        <Hero />
        <Categories />
        <Regions />
        <Destinations />
        <AIEngine />

        {isClient && (
          <Suspense
            fallback={
              <div className="h-[90vh] w-full bg-[#020617] flex items-center justify-center text-white/50 text-sm tracking-[0.2em] uppercase select-none">
                Loading global map explorer...
              </div>
            }
          >
            <MapExplorer />
          </Suspense>
        )}

        <CTA />
        <Footer />
        <AIChatbot />
      </main>
    </CountryProvider>
  );
}
