import React, { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, User, Search, X } from "lucide-react";
import { places } from "./Destination";
import logo from "@/assets/logo.png";
import { login, getWishlist } from "@/lib/api-service";
import { scrollToSection } from "@/lib/travel-actions";

const FAVORITES_KEY = "yatrika-favorites";
const USER_KEY = "yatrika-user";
const SETTINGS_KEY = "yatrika-settings";

export function Navbar() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<"wishlist" | "profile" | "settings" | "stats">(
    "wishlist",
  );
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [viewedCount, setViewedCount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setFavorites(parsed);
      } catch {
        setFavorites([]);
      }
    }

    const storedUser = window.localStorage.getItem(USER_KEY);
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.name) setUserName(parsed.name);
      } catch {
        setUserName(null);
      }
    }

    // Auto-open sign-in modal for first-time visitors (no stored user)
    if (!storedUser) {
      setIsSignInOpen(true);
    }

    setViewedCount(Number(window.localStorage.getItem("yatrika-destinations-viewed") || "0"));

    const storedSettings = window.localStorage.getItem(SETTINGS_KEY);
    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings);
        setDarkMode(!!parsed.darkMode);
        setReducedMotion(!!parsed.reducedMotion);
        document.documentElement.classList.toggle("dark", !!parsed.darkMode);
        document.documentElement.classList.toggle("reduce-motion", !!parsed.reducedMotion);
      } catch {
        setDarkMode(false);
        setReducedMotion(false);
      }
    }

    const onFavoritesUpdated = () => {
      if (typeof window === "undefined") return;
      const stored = window.localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setFavorites(Array.isArray(parsed) ? parsed : []);
        } catch {
          setFavorites([]);
        }
      } else {
        setFavorites([]);
      }
    };

    window.addEventListener("yatrika:favorites-updated", onFavoritesUpdated);
    const onTripViewed = () => {
      setViewedCount(Number(window.localStorage.getItem("yatrika-destinations-viewed") || "0"));
    };
    window.addEventListener("yatrika:trip-viewed", onTripViewed);
    return () => {
      window.removeEventListener("yatrika:favorites-updated", onFavoritesUpdated);
      window.removeEventListener("yatrika:trip-viewed", onTripViewed);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.classList.toggle("reduce-motion", reducedMotion);
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify({ darkMode, reducedMotion }));
  }, [darkMode, reducedMotion]);

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (async () => {
      try {
        const res = await login(email, password);
        const token = res?.token;
        const user = res?.user;
        if (token) {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(USER_KEY, JSON.stringify({ ...user, token }));
          }
          setUserName(user?.name || email.split("@")[0]);
          // fetch server wishlist and sync locally
          try {
            const wl = await getWishlist(token);
            const list = wl?.wishlist ?? [];
            window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
            // notify components
            window.dispatchEvent(new Event("yatrika:favorites-updated"));
          } catch (err) {
            // ignore wishlist fetch errors
          }
        }
      } catch (err) {
        if (typeof window !== "undefined") {
          const fallbackName = email.split("@")[0] || "Traveler";
          window.localStorage.setItem(
            USER_KEY,
            JSON.stringify({ name: fallbackName, email, token: "local-demo-token" }),
          );
          setUserName(fallbackName);
        }
      } finally {
        setIsSignInOpen(false);
      }
    })();
  };

  const handleSignOut = () => {
    setUserName(null);
    setEmail("");
    setPassword("");
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(USER_KEY);
      // Optionally clear server-backed wishlist from local cache
      window.localStorage.removeItem(FAVORITES_KEY);
      window.dispatchEvent(new Event("yatrika:favorites-updated"));
    }
    setIsSignInOpen(false);
  };

  const handleGuestSignIn = () => {
    const guestName = "Guest";
    if (typeof window !== "undefined") {
      window.localStorage.setItem(USER_KEY, JSON.stringify({ name: guestName, token: "guest-token", guest: true }));
    }
    setUserName(guestName);
    setEmail("");
    setPassword("");
    setIsSignInOpen(false);
  };

  const openDrawer = (tab: typeof drawerTab) => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setFavorites(Array.isArray(parsed) ? parsed : []);
        } catch {
          setFavorites([]);
        }
      }
    }
    // Ensure search modal is closed when opening the drawer
    setIsSearchOpen(false);
    setDrawerTab(tab);
    setIsDrawerOpen(true);
  };

  const removeFavorite = (item: string) => {
    setFavorites((prev) => {
      const next = prev.filter((favorite) => favorite !== item);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event("yatrika:favorites-updated"));
      }
      return next;
    });
  };

  const openSearch = () => {
    // Close the right-side drawer if open so search appears on its own
    setIsDrawerOpen(false);
    // Restore previous search query if any so users see their last search
    try {
      if (typeof window !== "undefined") {
        const last = window.localStorage.getItem("yatrika-last-search-query");
        setSearchQuery(last ?? "");
      }
    } catch {
      setSearchQuery("");
    }
    setIsSearchOpen(true);
  };

  const filteredPlaces = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return places.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  // persist search query so it remains across reloads
  React.useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("yatrika-last-search-query", searchQuery);
      }
    } catch {
      // ignore
    }
  }, [searchQuery]);

  return (
    <header className="fixed left-0 right-0 top-4 z-50 px-4">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-white/15 bg-white/10 px-5 py-3 shadow-lg backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-3 text-white transition hover:scale-105">
          <img
            src={logo}
            alt="Yatrika"
            className="h-10 w-10 rounded-full border border-white/30 object-cover shadow-sm"
          />
          <span className="font-bold text-lg text-black tracking-wider">YATRIKA</span>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-8 text-sm font-semibold text-slate-900 md:flex">
          <a href="#planner" className="transition hover:text-sky-600">
            Explore
          </a>
          <a href="#categories" className="transition hover:text-sky-600">
            Destinations
          </a>
          <a href="#trending" className="transition hover:text-sky-600">
            Trending
          </a>
          <a href="#map-explorer" className="transition hover:text-sky-600">
            Map Explorer
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => openDrawer("wishlist")}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-xs font-bold text-white">
                {favorites.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={openSearch}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => setIsSignInOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-sky-500 hover:bg-sky-400 px-4 py-2 text-sm font-medium text-white transition"
          >
            <User className="h-4 w-4" />
            {userName ? `Hi, ${userName}` : "Sign In"}
          </button>
        </div>
      </nav>

      {isDrawerOpen && !isSearchOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1" onClick={() => setIsDrawerOpen(false)} />
          <aside className="w-full max-w-md relative p-6 shadow-2xl border-l border-white/20 bg-white/5 backdrop-blur-md text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                {drawerTab === "wishlist"
                  ? "Wishlist"
                  : drawerTab === "profile"
                    ? "Profile"
                    : drawerTab === "settings"
                      ? "Settings"
                      : "Analytics"}
              </h3>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-full text-white/80 hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setDrawerTab("wishlist")}
                className={`px-3 py-1 rounded-full ${drawerTab === "wishlist" ? "bg-sky-500 text-white" : "bg-white/5 text-white/80"}`}
              >
                Wishlist
              </button>
              <button
                onClick={() => setDrawerTab("profile")}
                className={`px-3 py-1 rounded-full ${drawerTab === "profile" ? "bg-sky-500 text-white" : "bg-white/5 text-white/80"}`}
              >
                Profile
              </button>
              <button
                onClick={() => setDrawerTab("settings")}
                className={`px-3 py-1 rounded-full ${drawerTab === "settings" ? "bg-sky-500 text-white" : "bg-white/5 text-white/80"}`}
              >
                Settings
              </button>
              <button
                onClick={() => setDrawerTab("stats")}
                className={`px-3 py-1 rounded-full ${drawerTab === "stats" ? "bg-sky-500 text-white" : "bg-white/5 text-white/80"}`}
              >
                Analytics
              </button>
            </div>

            <div className="overflow-y-auto max-h-[70vh]">
              {drawerTab === "wishlist" && (
                <div className="space-y-3">
                  {favorites.length === 0 ? (
                    <p className="text-white/80">Your wishlist is empty</p>
                  ) : (
                    favorites.map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between gap-3 rounded-lg bg-white/5 p-3"
                      >
                        <p className="font-medium text-white">{item}</p>
                        <button
                          type="button"
                          onClick={() => removeFavorite(item)}
                          className="rounded-full px-3 py-1 text-xs font-semibold text-rose-400 hover:bg-rose-800/10"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

                {isSearchOpen && (
                  <div className="fixed inset-0 z-60 flex items-start justify-center pt-24">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)} />
                    <div className="relative w-full max-w-3xl rounded-2xl bg-white/6 p-6 shadow-2xl backdrop-blur-md border border-white/20 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Search places</h2>
                        <button
                          type="button"
                          onClick={() => setIsSearchOpen(false)}
                          className="rounded-full p-2 text-white/80 hover:bg-white/10"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="mb-4">
                        <input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search places, regions or categories"
                          className="w-full rounded-full border border-white/20 bg-white/5 px-4 py-3 text-sm placeholder:text-white/60 text-white outline-none focus:ring-2 focus:ring-sky-300"
                        />
                      </div>

                      <div className="max-h-[60vh] overflow-y-auto space-y-3">
                        {searchQuery.trim() === "" ? (
                          <p className="text-white/70">Type a place name, region, or category to search.</p>
                        ) : filteredPlaces.length === 0 ? (
                          <p className="text-white/70">No results found.</p>
                        ) : (
                          filteredPlaces.map((p) => (
                            <div
                              key={p.name}
                              onClick={() => {
                                try {
                                  if (typeof window !== "undefined") {
                                    window.localStorage.setItem("yatrika-last-selected", p.name);
                                  }
                                } catch {}
                                setIsSearchOpen(false);
                              }}
                              className="cursor-pointer flex items-center gap-4 rounded-lg bg-white/5 p-3 hover:bg-white/10"
                            >
                              <img src={p.img} alt={p.name} className="h-16 w-24 rounded-md object-cover" />
                              <div>
                                <div className="flex items-center justify-between gap-4">
                                  <h3 className="font-medium text-white">{p.name}</h3>
                                  <span className="text-sm text-white/80">{p.rating} ★</span>
                                </div>
                                <p className="text-sm text-white/80">{p.region} • {p.category}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

              {drawerTab === "profile" && (
                <div>
                  <p className="text-sm text-slate-600">Signed in as:</p>
                  <p className="font-medium text-slate-900">{userName ?? "Guest"}</p>
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        setIsSignInOpen(true);
                        setIsDrawerOpen(false);
                      }}
                      className="rounded-lg bg-sky-500 text-white px-4 py-2"
                    >
                      Manage account
                    </button>
                  </div>
                </div>
              )}

              {drawerTab === "settings" && (
                <div>
                  <p className="text-sm text-slate-600">App Preferences</p>
                  <div className="mt-3 space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={(event) => setDarkMode(event.target.checked)}
                      />
                      Dark mode
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={reducedMotion}
                        onChange={(event) => setReducedMotion(event.target.checked)}
                      />
                      Reduced motion
                    </label>
                  </div>
                </div>
              )}

              {drawerTab === "stats" && (
                <div>
                  <p className="text-sm text-slate-600">Usage & analytics</p>
                  <ul className="mt-3 list-disc pl-5 text-sm text-slate-700">
                    <li>Destinations viewed: {viewedCount}</li>
                    <li>Saved favorites: {favorites.length}</li>
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {isSignInOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSignInOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white/10 p-6 shadow-2xl backdrop-blur-md border border-white/20 ring-1 ring-white/5">
            <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-semibold text-white">Sign In</h2>
                <button
                  type="button"
                  onClick={() => setIsSignInOpen(false)}
                  className="rounded-full p-2 text-white/80 hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full rounded-full border border-white/25 bg-white/5 px-4 py-3 text-sm placeholder:text-white/60 text-white outline-none shadow-inner focus:ring-2 focus:ring-sky-300 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-full border border-white/25 bg-white/5 px-4 py-3 text-sm placeholder:text-white/60 text-white outline-none shadow-inner focus:ring-2 focus:ring-sky-300 focus:border-transparent"
                  required
                />
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full rounded-full bg-sky-500 hover:bg-sky-400 px-4 py-2 text-sm font-semibold text-white transition"
                >
                  Sign In
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleGuestSignIn}
                  className="flex-1 rounded-full border border-white/30 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10 transition"
                >
                  Continue as Guest
                </button>

                {userName && (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex-1 rounded-full border border-white/30 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10 transition"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
