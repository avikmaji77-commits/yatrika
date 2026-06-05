import { requestPlannerSearch } from "@/lib/travel-actions";

const regions = [
  { name: "Asia", count: 120 },
  { name: "Europe", count: 95 },
  { name: "North America", count: 70 },
  { name: "South America", count: 55 },
  { name: "Australia", count: 40 },
];

export function Regions() {
  return (
    <section className="py-20 px-6 bg-gradient-ocean text-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          background:
            "radial-gradient(ellipse at 20% 20%, oklch(0.72 0.18 45) 0%, transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <h2 className="font-display text-4xl md:text-5xl">Explore by region</h2>
          <p className="text-white/75 max-w-sm">
            Five worlds, infinite stories. Pick a region and let curiosity lead.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {regions.map((r, i) => (
            <button
              key={r.name}
              type="button"
              onClick={() => requestPlannerSearch({ region: r.name, source: "region" })}
              className="group text-left glass-dark rounded-2xl p-6 lift"
            >
              <div className="text-5xl font-display text-accent/80 mb-4">0{i + 1}</div>
              <h3 className="font-display text-2xl mb-1">{r.name}</h3>

              <div className="text-xs uppercase tracking-wider text-accent">
                {r.count} destinations →
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
