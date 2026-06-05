import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer
      id="footer"
      className="border-t border-border px-6 py-12"
      style={{ background: "#e0f2fe" }}
    >
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Yatrika" className="w-9 h-9 rounded-full object-cover" />
          <span className="font-display text-lg text-foreground">Yatrika</span>
          <span className="opacity-60">— Travel, thoughtfully.</span>
        </div>
        <div className="flex gap-6">
          <a href="#footer" className="hover:text-foreground transition">
            About
          </a>
          <a href="#categories" className="hover:text-foreground transition">
            Destinations
          </a>
          <a href="#map-explorer" className="hover:text-foreground transition">
            Map Explorer
          </a>
          <a href="#footer" className="hover:text-foreground transition">
            Privacy
          </a>
        </div>
        <span>© 2026 Yatrika</span>
      </div>
    </footer>
  );
}
