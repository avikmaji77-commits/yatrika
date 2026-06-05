import { Sparkles } from "lucide-react";
import { openAssistant, scrollToSection } from "@/lib/travel-actions";

export function CTA() {
  const handleStartExploring = () => {
    scrollToSection("planner");
    openAssistant({
      prompt: "Help me choose a trip based on my mood, budget, season, and travel style.",
    });
  };

  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-gradient-hero p-12 md:p-20 text-center text-white relative overflow-hidden shadow-glow">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/30 blur-3xl animate-float" />
        <div
          className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-primary/40 blur-3xl animate-float"
          style={{ animationDelay: "-3s" }}
        />
        <div className="relative">
          <Sparkles className="w-10 h-10 mx-auto mb-6 text-accent" />
          <h2 className="font-display text-4xl md:text-7xl leading-[1] mb-6 max-w-3xl mx-auto">
            Your next journey is
            <br />
            <em className="italic text-gradient-sunset">one question away.</em>
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-10 text-lg">
            Tell Yatrika what you're feeling — relaxing, adventurous, romantic — and we'll handle
            the rest.
          </p>
          <button
            type="button"
            onClick={handleStartExploring}
            className="bg-white text-foreground rounded-full px-8 py-4 font-medium hover:scale-105 transition shadow-glow"
          >
            Start exploring →
          </button>
        </div>
      </div>
    </section>
  );
}
