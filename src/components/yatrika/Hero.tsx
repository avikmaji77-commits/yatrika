import React, { useEffect, useState } from "react";
import heroImg from "@/assets/hero.png";
import { Globe, Calendar, User, Plane, ChevronDown } from "lucide-react";
import { getDestinations } from "@/lib/api-service";
import type { PlannerSearchDetail } from "@/lib/travel-actions";

const regions = ["Asia", "Europe", "Africa", "North America", "South America", "Australia"];
const guestsOptions = ["Solo", "Couple", "Family", "Friends"];

export function Hero() {
  const [selectedRegion, setSelectedRegion] = useState("Asia");
  const [selectedDate, setSelectedDate] = useState("2026-06-01");
  const [selectedGuests, setSelectedGuests] = useState("Couple");
  const [discoverResults, setDiscoverResults] = useState<any[]>([]);
  const [discoverLoading, setDiscoverLoading] = useState(false);
  const [discoverError, setDiscoverError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const runSearch = async (overrides: PlannerSearchDetail = {}) => {
    const region = overrides.region ?? selectedRegion;
    const guests = overrides.guests ?? selectedGuests;
    const category = overrides.category;

    setHasSearched(true);
    setDiscoverError(null);
    setDiscoverLoading(true);
    setDiscoverResults([]);

    try {
      const response = await getDestinations({
        limit: 6,
        search: category ? `${category} ${region}` : `${region} ${guests}`,
      });
      const destinations = Array.isArray(response) ? response : (response.data ?? []);

      if (destinations.length === 0) {
        const fallback = await getDestinations({ limit: 6 });
        setDiscoverResults(Array.isArray(fallback) ? fallback : (fallback.data ?? []));
      } else {
        setDiscoverResults(destinations);
      }
    } catch (error) {
      setDiscoverError("Unable to find unique destinations right now. Please try again.");
    } finally {
      setDiscoverLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch();
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePlannerSearch = (event: Event) => {
      const detail = (event as CustomEvent<PlannerSearchDetail>).detail ?? {};
      if (detail.region) setSelectedRegion(detail.region);
      if (detail.guests) setSelectedGuests(detail.guests);
      if (detail.date) setSelectedDate(detail.date);
      runSearch(detail);
    };

    window.addEventListener("yatrika:planner-search", handlePlannerSearch);
    return () => window.removeEventListener("yatrika:planner-search", handlePlannerSearch);
  }, [selectedRegion, selectedGuests]);

  return (
    <section id="planner" className="relative min-h-screen overflow-hidden font-sans">
      <img
        src={heroImg}
        alt="Mountain lake travel destination"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-black/5" />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(10,20,40,0.1), rgba(10,20,40,0.35))",
        }}
      />

      <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-[10vh]">
        <span className="font-display text-[clamp(5rem,14vw,12rem)] font-semibold uppercase tracking-[0.25em] text-white/80 blur-[1px] select-none">
          YATRIKA
        </span>
      </div>

      <div className="relative z-20 mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-6 pb-16 w-full">
        <form onSubmit={handleSearch} className="w-full flex flex-col gap-4 relative">
          <div className="relative w-full flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
            <div className="shrink-0 text-left md:translate-y-2">
              <h1 className="font-display text-4xl font-semibold tracking-tight text-white drop-shadow-md sm:text-5xl lg:text-6xl whitespace-nowrap">
                Explore the Unseen
              </h1>
            </div>

            <div className="relative z-30 text-left md:text-right md:-translate-y-8 max-w-xs md:ml-auto">
              <p className="text-xs md:text-sm leading-relaxed text-gray-200 drop-shadow-sm">
                Discover unique places beyond the tourist path, with carefully planned journeys
                balancing adventure, comfort, and authenticity.
              </p>
            </div>
          </div>

          <div className="relative z-20 w-full bg-white/15 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/25 flex flex-col md:flex-row items-center p-2 gap-1 md:gap-0 select-none">
            <div className="relative w-full md:w-1/3 flex items-center justify-between px-4 py-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 group">
              <div className="flex items-center gap-3 w-full">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm shrink-0">
                  <Globe size={16} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-200/80 mb-0.5">
                    Continent
                  </span>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="block w-full bg-transparent text-sm font-semibold text-white outline-none cursor-pointer appearance-none pr-4"
                  >
                    {regions.map((item) => (
                      <option key={item} value={item} className="text-slate-900">
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <ChevronDown
                size={16}
                className="text-gray-300 group-hover:text-white pointer-events-none absolute right-4"
              />
            </div>

            <div className="hidden md:block w-px h-8 bg-white/20" />

            <div className="relative w-full md:w-1/3 flex items-center justify-between px-4 py-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 group">
              <div className="flex items-center gap-3 w-full">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm shrink-0">
                  <Calendar size={16} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-200/80 mb-0.5">
                    When
                  </span>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="block w-full bg-transparent text-sm font-semibold text-white outline-none cursor-pointer dark"
                  />
                </div>
              </div>
            </div>

            <div className="hidden md:block w-px h-8 bg-white/20" />

            <div className="w-full md:w-1/3 flex flex-col sm:flex-row items-center justify-between pl-4 pr-1.5 py-1 sm:py-0 gap-2 sm:gap-0">
              <div className="relative w-full sm:w-auto flex items-center justify-between gap-3 hover:bg-white/10 sm:hover:bg-transparent rounded-xl sm:rounded-none py-1.5 sm:py-0 group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm shrink-0">
                    <User size={16} strokeWidth={2} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-200/80 mb-0.5">
                      Guests
                    </span>
                    <select
                      value={selectedGuests}
                      onChange={(e) => setSelectedGuests(e.target.value)}
                      className="block w-full bg-transparent text-sm font-semibold text-white outline-none cursor-pointer appearance-none pr-4"
                    >
                      {guestsOptions.map((item) => (
                        <option key={item} value={item} className="text-slate-900">
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <ChevronDown
                  size={16}
                  className="text-gray-300 group-hover:text-white pointer-events-none absolute right-2 sm:static sm:ml-1"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-sky-500 hover:bg-sky-400 active:scale-95 text-white flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm tracking-wide transition-all shadow-lg shadow-sky-500/20"
              >
                <Plane size={16} className="rotate-45" />
                <span>Discover</span>
              </button>
            </div>
          </div>
        </form>

        <div className="mt-8 rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-sm uppercase tracking-widest text-slate-400">Search results</p>
              <h3 className="text-2xl font-semibold text-white">Discover matching destinations</h3>
            </div>
            {discoverLoading && <span className="text-sm text-sky-200">Searching…</span>}
          </div>

          {discoverError ? (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {discoverError}
            </div>
          ) : hasSearched && discoverResults.length === 0 && !discoverLoading ? (
            <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-center text-slate-300">
              No results found for your discovery preferences. Try a different region or guest type.
            </div>
          ) : (
            hasSearched && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {discoverResults.map((item) => (
                  <div
                    key={item._id || item.name}
                    className="rounded-3xl bg-slate-950/70 p-4 text-white shadow-xl"
                  >
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-slate-300 mb-2">{item.location || item.region}</p>
                    <p className="text-sm text-slate-400 truncate">
                      {item.description || item.category}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                      <span>{item.budget || "Budget info"}</span>
                      <span>⭐ {item.rating ?? "-"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
