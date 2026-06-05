import React, { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, User, Search, X } from "lucide-react";
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

  return (
    <header className="fixed left-0 right-0 top-4 z-50 px-4">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-white/15 bg-white/10 px-5 py-3 shadow-lg backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-3 text-white transition hover:scale-105">
          <img
            src={logo}
            alt="Yatrika"
            className="h-10 w-10 rounded-full border border-white/30 object-cover shadow-sm"
          />
          <span className="font-semibold text-lg">YATRIKA</span>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-8 text-sm font-medium text-gray-200 md:flex">
          <a href="#planner" className="transition hover:text-white">
            Explore
          </a>
          <a href="#categories" className="transition hover:text-white">
            Destinations
          </a>
          <a href="#trending" className="transition hover:text-white">
            Trending
          </a>
          <a href="#map-explorer" className="transition hover:text-white">
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
            onClick={() => scrollToSection("planner")}
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

      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1" onClick={() => setIsDrawerOpen(false)} />
          <aside className="w-full max-w-md bg-white p-6 shadow-2xl border-l border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">
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
                className="p-2 rounded-full text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setDrawerTab("wishlist")}
                className={`px-3 py-1 rounded-full ${drawerTab === "wishlist" ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-700"}`}
              >
                Wishlist
              </button>
              <button
                onClick={() => setDrawerTab("profile")}
                className={`px-3 py-1 rounded-full ${drawerTab === "profile" ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-700"}`}
              >
                Profile
              </button>
              <button
                onClick={() => setDrawerTab("settings")}
                className={`px-3 py-1 rounded-full ${drawerTab === "settings" ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-700"}`}
              >
                Settings
              </button>
              <button
                onClick={() => setDrawerTab("stats")}
                className={`px-3 py-1 rounded-full ${drawerTab === "stats" ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-700"}`}
              >
                Analytics
              </button>
            </div>

            <div className="overflow-y-auto max-h-[70vh]">
              {drawerTab === "wishlist" && (
                <div className="space-y-3">
                  {favorites.length === 0 ? (
                    <p className="text-slate-600">Your wishlist is empty</p>
                  ) : (
                    favorites.map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3"
                      >
                        <p className="font-medium text-slate-900">{item}</p>
                        <button
                          type="button"
                          onClick={() => removeFavorite(item)}
                          className="rounded-full px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">Sign In</h2>
              <button
                type="button"
                onClick={() => setIsSignInOpen(false)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  required
                />
              </div>
              <div className="flex items-center gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-sky-500 hover:bg-sky-400 px-4 py-2 text-sm font-semibold text-white transition"
                >
                  Sign In
                </button>
                {userName && (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex-1 rounded-lg border border-slate-200 hover:bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition"
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
