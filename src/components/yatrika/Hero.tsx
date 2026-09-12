import React, { useEffect, useState } from "react";
import heroImg from "@/assets/hero.png";
import { Globe, User, Plane, SlidersHorizontal } from "lucide-react";
import type { PlannerSearchDetail } from "@/lib/travel-actions";
import { useNavigate } from "@tanstack/react-router";
import { GlassSelect } from "@/components/yatrika/GlassSelect";
import { GlassDatePicker } from "@/components/yatrika/GlassDatePicker";

const regions = ["Asia", "Europe", "Africa", "North America", "South America", "Australia"];
const guestsOptions = ["Solo", "Couple", "Family", "Friends"];
const regionOptions = regions.map((item) => ({ value: item, label: item }));
const guestSelectOptions = guestsOptions.map((item) => ({ value: item, label: item }));

export function Hero() {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState("Asia");
  const [selectedDate, setSelectedDate] = useState("2026-06-01");
  const [selectedGuests, setSelectedGuests] = useState("Couple");
  const [selectedBudget, setSelectedBudget] = useState("All");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/discover",
      search: {
        region: selectedRegion,
        date: selectedDate,
        guests: selectedGuests,
        budget: selectedBudget,
      },
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePlannerSearch = (event: Event) => {
      const detail = (event as CustomEvent<PlannerSearchDetail>).detail ?? {};
      const targetRegion = detail.region ?? selectedRegion;
      const targetGuests = detail.guests ?? selectedGuests;
      const targetDate = detail.date ?? selectedDate;
      const targetBudget = detail.budget ?? selectedBudget;
      const targetCategory = detail.category ?? "";

      if (detail.region) setSelectedRegion(detail.region);
      if (detail.guests) setSelectedGuests(detail.guests);
      if (detail.date) setSelectedDate(detail.date);
      if (detail.budget) setSelectedBudget(detail.budget);

      navigate({
        to: "/discover",
        search: {
          region: targetRegion,
          date: targetDate,
          guests: targetGuests,
          budget: targetBudget,
          category: targetCategory || undefined,
        },
      });
    };

    window.addEventListener("yatrika:planner-search", handlePlannerSearch);
    return () => window.removeEventListener("yatrika:planner-search", handlePlannerSearch);
  }, [selectedRegion, selectedGuests, selectedDate, selectedBudget]);

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

          {/* Corner Budget Filter Widget */}
          <div className="self-end flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full shadow-lg text-xs z-30 select-none -mb-1 md:translate-y-1">
            <span className="text-gray-300 font-medium flex items-center gap-1">
              <SlidersHorizontal size={12} />
              Budget:
            </span>
            <div className="flex gap-1">
              {["All", "Low", "Medium", "High"].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setSelectedBudget(b)}
                  className={`px-2.5 py-0.5 rounded-full transition-all duration-200 font-semibold cursor-pointer ${
                    selectedBudget === b
                      ? "bg-sky-500 text-white shadow-sm"
                      : "text-gray-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="relative z-20 w-full bg-white/15 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/25 flex flex-col md:flex-row items-center p-2 gap-1 md:gap-0 select-none">
            <div className="w-full md:w-1/3">
              <GlassSelect
                value={selectedRegion}
                onValueChange={setSelectedRegion}
                options={regionOptions}
                label="Continent"
                icon={Globe}
                triggerClassName="border-transparent bg-transparent px-4 py-2.5 shadow-none hover:bg-white/10 hover:border-transparent focus-visible:border-white/30 focus-visible:ring-white/20"
                iconClassName="bg-white/20 text-white"
                labelClassName="text-gray-200/80"
              />
            </div>

            <div className="hidden md:block w-px h-8 bg-white/20" />

            <div className="w-full md:w-1/3">
              <GlassDatePicker
                value={selectedDate}
                onValueChange={setSelectedDate}
                label="When"
                triggerClassName="border-transparent bg-transparent px-4 py-2.5 shadow-none hover:bg-white/10 hover:border-transparent focus-visible:border-white/30 focus-visible:ring-white/20"
                iconClassName="bg-white/20 text-white"
                labelClassName="text-gray-200/80"
              />
            </div>

            <div className="hidden md:block w-px h-8 bg-white/20" />

            <div className="w-full md:w-1/3 flex flex-col sm:flex-row items-center justify-between pl-4 pr-1.5 py-1 sm:py-0 gap-2 sm:gap-0">
              <div className="w-full sm:w-auto sm:min-w-44">
                <GlassSelect
                  value={selectedGuests}
                  onValueChange={setSelectedGuests}
                  options={guestSelectOptions}
                  label="Guests"
                  icon={User}
                  triggerClassName="border-transparent bg-transparent px-0 py-1.5 shadow-none hover:bg-white/10 sm:hover:bg-transparent hover:border-transparent focus-visible:border-white/30 focus-visible:ring-white/20"
                  iconClassName="bg-white/20 text-white"
                  labelClassName="text-gray-200/80"
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
      </div>
    </section>
  );
}
