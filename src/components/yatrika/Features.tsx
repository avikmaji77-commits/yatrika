import { Globe2, CalendarDays, Bookmark, MessageCircle, Cloud, Wallet } from "lucide-react";

const features = [
  {
    icon: Globe2,
    title: "Map Explorer",
    desc: "Spin the globe, tap a country, dive into attractions, foods & culture.",
  },
  {
    icon: CalendarDays,
    title: "Trip Planner",
    desc: "Hour-by-hour itineraries generated from your mood & budget.",
  },
  {
    icon: Bookmark,
    title: "Saved Trips",
    desc: "Wishlist favorites, mark visited, plan future escapes — all in one place.",
  },
  {
    icon: MessageCircle,
    title: "AI Travel Assistant",
    desc: "Ask anything: 'rainy weekend near Bangalore?' — get a plan instantly.",
  },
  {
    icon: Cloud,
    title: "Live Weather & Crowd",
    desc: "Real-time signals tell you when a place is at its quietest best.",
  },
  {
    icon: Wallet,
    title: "Budget Estimator",
    desc: "See realistic stay, food and travel costs before you commit.",
  },
];

export function Features() {
  return (
    <section id="planner" className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl mb-14">
          <p className="text-xs uppercase tracking-[0.25em] text-accent mb-3">
            Everything you need
          </p>
          <h2 className="font-display text-4xl md:text-6xl">
            A travel companion that{" "}
            <em className="italic text-gradient-sunset">actually thinks.</em>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            const isMap = f.title === "Map Explorer";
            return (
              <div key={f.title} className="glass rounded-3xl p-7 lift relative">
                {isMap && (
                  <a
                    href="#map-explorer"
                    className="absolute inset-0 z-10"
                    aria-label="Open Map Explorer"
                  />
                )}
                <div className="w-12 h-12 rounded-2xl bg-gradient-sunset flex items-center justify-center text-white mb-5 shadow-glass">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display text-2xl mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
