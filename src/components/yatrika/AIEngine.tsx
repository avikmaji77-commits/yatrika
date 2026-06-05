import { Sparkles, Cloud, Wallet, Users, Heart, History } from "lucide-react";
import { openAssistant, requestPlannerSearch } from "@/lib/travel-actions";

const signals = [
  { icon: Heart, label: "Interests", value: "Mountains · Cafes · Nature" },
  { icon: Cloud, label: "Weather", value: "Cool 14–22°C" },
  { icon: Wallet, label: "Budget", value: "₹15–25k" },
  { icon: Users, label: "Crowd", value: "Less crowded" },
  { icon: History, label: "Travel history", value: "8 trips" },
];

const suggestions = ["Tawang", "Coorg", "Darjeeling", "Munnar"];

export function AIEngine() {
  const handleBuildItinerary = () => {
    requestPlannerSearch({ category: "Mountains", guests: "Couple", source: "ai-engine" });
    openAssistant({
      prompt:
        "Build a 5 day itinerary for misty hills, quiet cafes, cool weather, and a mid range budget.",
    });
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 70% 30%, oklch(0.72 0.18 45 / 0.15), transparent 60%), radial-gradient(ellipse at 20% 70%, oklch(0.45 0.15 240 / 0.15), transparent 60%)",
        }}
      />
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.2em] mb-6 text-accent">
            <Sparkles className="w-3.5 h-3.5" /> AI Recommendation Engine
          </div>
          <h2 className="font-display text-4xl md:text-6xl leading-[1] mb-6">
            Trips that feel
            <br />
            <em className="italic text-gradient-sunset">written for you.</em>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg">
            Yatrika's ML engine reads your interests, weather, budget, crowd preferences, ratings,
            travel history and wishlist — then composes a journey only you would take.
          </p>
          <div className="space-y-2 max-w-md">
            {signals.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-ocean text-white flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 flex items-baseline justify-between gap-3">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      {s.label}
                    </span>
                    <span className="text-sm font-medium">{s.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass rounded-3xl p-8 shadow-glow relative">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Generating recommendations
          </div>
          <p className="font-display text-2xl mb-6">
            Because you love <em className="text-gradient-sunset">misty hills & quiet cafés</em>, we
            found:
          </p>
          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <div
                key={s}
                className="flex items-center gap-4 p-3 rounded-2xl bg-muted/50 hover:bg-muted transition lift"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-sunset flex items-center justify-center text-white font-display text-xl shadow-glass">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{s}</div>
                  <div className="text-xs text-muted-foreground">
                    96% match · Peaceful · Cool weather
                  </div>
                </div>
                <div className="text-accent text-sm">→</div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleBuildItinerary}
            className="mt-6 w-full bg-foreground text-background rounded-2xl py-3 font-medium hover:opacity-90 transition"
          >
            Build a full itinerary →
          </button>
        </div>
      </div>
    </section>
  );
}
