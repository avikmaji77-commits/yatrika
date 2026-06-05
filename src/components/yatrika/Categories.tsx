import {
  Mountain,
  Waves,
  Landmark,
  Sun,
  Coffee,
  Leaf,
  Tent,
  UtensilsCrossed,
  Flame,
  Sunrise,
  Sparkle,
} from "lucide-react";
import mountains from "@/assets/kanchenjunga.jpg";
import beaches from "@/assets/beach.jpg";
import historical from "@/assets/Historical.png";
import cafes from "@/assets/Artistic Latte Art.jpg";
import desertImg from "@/assets/Desert.jpg";
import natureImg from "@/assets/nature.jpg";
import Resturents from "@/assets/Resturent.jpg";
import adventureImg from "@/assets/Adventure.jpg";
import religious from "@/assets/religious.jpg";
import { requestPlannerSearch } from "@/lib/travel-actions";

const categories = [
  { name: "Beaches", icon: Waves, img: beaches },
  { name: "Mountains", icon: Mountain, img: mountains },
  { name: "Historical", icon: Landmark, img: historical },
  { name: "Desert", icon: Sun, img: desertImg },
  { name: "Nature", icon: Leaf, img: natureImg },
  { name: "Adventure", icon: Tent, img: adventureImg },
  { name: "Cafes", icon: Coffee, img: cafes },
  { name: "Restaurants", icon: UtensilsCrossed, img: Resturents },
  { name: "Religious", icon: Sparkle, img: religious },
];

export function Categories() {
  return (
    <section
      id="categories"
      className="page-content relative overflow-hidden"
      style={{ background: "#e0f2fe" }}
    >
      <div className="pointer-events-none absolute left-1/2 top-24 h-96 w-96 -translate-x-1/2 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-16 h-72 w-72 rounded-full bg-slate-200/30 blur-3xl" />

      <div className="constrained-container mx-auto max-w-6xl px-6 pt-32">
        <p className="text-xs uppercase tracking-[0.25em] text-yellow-500 mb-3">Browse by mood</p>
        <h2 className="font-display text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl md:text-6xl max-w-3xl">
          Find your{" "}
          <em className="italic bg-linear-to-r from-slate-900/95 via-amber-300/55 to-slate-900/95 bg-clip-text text-transparent">
            kind
          </em>{" "}
          of escape
        </h2>
      </div>

      <div className="full-width-cards-container w-full overflow-x-auto pb-12 pt-10 scrollbar-thin scrollbar-thumb-slate-300/70">
        <div className="flex gap-6 min-w-max px-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => requestPlannerSearch({ category: cat.name, source: "category" })}
                className="group relative min-w-80 md:min-w-90 min-h-110 lg:min-h-100 overflow-hidden rounded-4xl shadow-glow transition duration-500 hover:-translate-y-1 cursor-pointer"
                aria-label={`Find ${cat.name} destinations`}
                style={{
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                }}
              >
                <img
                  src={cat.img!}
                  alt={cat.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/10 via-transparent to-transparent" />
                <div className="relative z-10 flex h-full flex-col justify-between p-7 text-white">
                  <div className="w-12 h-12 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-sm flex items-center justify-center text-slate-800">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-3xl font-semibold tracking-tight">
                      {cat.name}
                    </h3>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
