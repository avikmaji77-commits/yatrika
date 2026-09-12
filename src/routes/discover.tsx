import React, { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Navbar } from "@/components/yatrika/Navbar";
import { Footer } from "@/components/yatrika/Footer";
import {
  Globe,
  User,
  Plane,
  SlidersHorizontal,
  ArrowLeft,
  Heart,
  Star,
  MapPin,
  Loader2,
  Coffee,
  Utensils,
} from "lucide-react";
import { getDestinations } from "@/lib/api-service";
import { places } from "@/components/yatrika/Destination";
import { useCountrySettings, CountryProvider } from "@/components/yatrika/CountryContext";
import { GlassSelect } from "@/components/yatrika/GlassSelect";
import { GlassDatePicker } from "@/components/yatrika/GlassDatePicker";
import heroImg from "@/assets/hero.png";

const categorySuggestions: Record<
  string,
  Array<{
    name: string;
    type: "Cafe" | "Restaurant";
    place: string;
    description: string;
    photo: string;
    rating: number;
  }>
> = {
  Desert: [
    {
      name: "Dune Oasis Cafe",
      type: "Cafe",
      place: "Jaisalmer, Rajasthan",
      description: "Enjoy sunset tea and traditional bajra cookies right on the sand dunes.",
      photo:
        "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=500&auto=format&fit=crop&q=60",
      rating: 4.8,
    },
    {
      name: "The Golden Caravan Restaurant",
      type: "Restaurant",
      place: "Dubai, UAE",
      description: "Exquisite Middle Eastern fine dining with live music under the desert stars.",
      photo:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60",
      rating: 4.9,
    },
    {
      name: "Salt & Sand Lounge",
      type: "Restaurant",
      place: "Rann of Kutch, Gujarat",
      description: "Authentic Gujarati cuisine served in traditional open-air mud structures.",
      photo:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60",
      rating: 4.7,
    },
  ],
  Adventure: [
    {
      name: "The Summit Alpine Cafe",
      type: "Cafe",
      place: "Swiss Alps, Switzerland",
      description: "High-altitude coffee bar offering panoramic peak views and warm hot chocolate.",
      photo:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop&q=60",
      rating: 4.9,
    },
    {
      name: "Basecamp Grill & Diner",
      type: "Restaurant",
      place: "Manali, Himachal Pradesh",
      description: "Hearty wood-fired pizzas and steaks for adventurers returning from the trails.",
      photo:
        "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=500&auto=format&fit=crop&q=60",
      rating: 4.8,
    },
    {
      name: "Rafting Point Cafe",
      type: "Cafe",
      place: "Rishikesh, Uttarakhand",
      description:
        "Overlooking the Ganges. Famous for its vegan bowls, herbal teas, and rafting stories.",
      photo:
        "https://images.unsplash.com/photo-1469957761103-559d35a29c2b?w=500&auto=format&fit=crop&q=60",
      rating: 4.6,
    },
  ],
  Cafes: [
    {
      name: "Artistic Latte Art Cafe",
      type: "Cafe",
      place: "Coorg, Karnataka",
      description:
        "A specialty coffee house inside a lush coffee plantation. Famous for manual brews.",
      photo:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60",
      rating: 4.9,
    },
    {
      name: "The Vintage Bean",
      type: "Cafe",
      place: "Seattle, USA",
      description: "Cozy library theme with vintage espresso machines and single-origin pours.",
      photo:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60",
      rating: 4.8,
    },
    {
      name: "Kyoto Matcha House",
      type: "Cafe",
      place: "Kyoto, Japan",
      description:
        "Traditional tea house serving organic stone-ground matcha and seasonal wagashi.",
      photo:
        "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60",
      rating: 4.9,
    },
  ],
  Restaurants: [
    {
      name: "Le Bistrot de Paris",
      type: "Restaurant",
      place: "Paris, France",
      description:
        "Classic French fine dining with freshly baked baguettes, escargots, and fine wines.",
      photo:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&auto=format&fit=crop&q=60",
      rating: 4.9,
    },
    {
      name: "Trattoria Romana",
      type: "Restaurant",
      place: "Rome, Italy",
      description:
        "A cozy family-run trattoria serving authentic carbonara and wood-fired focaccia.",
      photo:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60",
      rating: 4.8,
    },
    {
      name: "The Ocean Table",
      type: "Restaurant",
      place: "Goa, India",
      description:
        "Exquisite beachside seafood dining featuring fresh catch-of-the-day masala fry.",
      photo:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60",
      rating: 4.7,
    },
  ],
  Beaches: [
    {
      name: "Ocean Breeze Grill",
      type: "Restaurant",
      place: "Goa, India",
      description:
        "Exquisite beachside seafood dining featuring fresh catch-of-the-day masala fry.",
      photo:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60",
      rating: 4.7,
    },
    {
      name: "The Coconut Shack",
      type: "Cafe",
      place: "Maldives",
      description: "Overwater wooden deck cafe serving fresh tropical juices and coconut pancakes.",
      photo:
        "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=500&auto=format&fit=crop&q=60",
      rating: 4.9,
    },
  ],
  Mountains: [
    {
      name: "Misty Mountain Brews",
      type: "Cafe",
      place: "Munnar, Kerala",
      description:
        "Charming tea-garden cafe serving hot filter coffee and freshly baked cardamom cakes.",
      photo:
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60",
      rating: 4.8,
    },
    {
      name: "Alpine Comfort Restro",
      type: "Restaurant",
      place: "Swiss Alps, Switzerland",
      description: "Authentic Swiss cheese fondue and hot chocolate in a cozy log cabin setting.",
      photo:
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60",
      rating: 4.9,
    },
  ],
  Historical: [
    {
      name: "The Heritage Courtyard",
      type: "Restaurant",
      place: "Agra, India",
      description:
        "Mughlai dining with a direct, stunning view of the Taj Mahal in a restored haveli.",
      photo:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60",
      rating: 4.9,
    },
    {
      name: "Colosseum Vista Cafe",
      type: "Cafe",
      place: "Rome, Italy",
      description: "Rooftop espresso lounge directly overlooking the ancient Roman Colosseum.",
      photo:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop&q=60",
      rating: 4.8,
    },
  ],
  Nature: [
    {
      name: "Forest Canopy Cafe",
      type: "Cafe",
      place: "Sundarbans, West Bengal",
      description:
        "Eco-friendly wooden deck cafe perched amongst mangrove canopies, serving wild forest honey tea.",
      photo:
        "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=500&auto=format&fit=crop&q=60",
      rating: 4.7,
    },
    {
      name: "The Riverside Wilderness Lodge",
      type: "Restaurant",
      place: "Jim Corbett, Uttarakhand",
      description:
        "Rustic dining experience featuring local Kumaoni cuisine right by the river bank.",
      photo:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60",
      rating: 4.8,
    },
  ],
  Religious: [
    {
      name: "The Spiritual Sattvik Kitchen",
      type: "Restaurant",
      place: "Varanasi, Uttar Pradesh",
      description:
        "Pure vegetarian, no-onion-no-garlic traditional gourmet meals prepared with holy water.",
      photo:
        "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=60",
      rating: 4.9,
    },
    {
      name: "The Holy Canopy Cafe",
      type: "Cafe",
      place: "Bodh Gaya, Bihar",
      description:
        "Quiet garden cafe serving organic herbal infusions and fresh bakery goods under sacred trees.",
      photo:
        "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=500&auto=format&fit=crop&q=60",
      rating: 4.8,
    },
  ],
};

const regions = ["Asia", "Europe", "Africa", "North America", "South America", "Australia"];
const guestsOptions = ["Solo", "Couple", "Family", "Friends"];
const budgetOptions = ["All", "Low", "Medium", "High"];
const categoriesOptions = [
  "All",
  "Beaches",
  "Mountains",
  "Historical",
  "Desert",
  "Nature",
  "Adventure",
  "Cafes",
  "Restaurants",
  "Religious",
];
const regionOptions = regions.map((item) => ({ value: item, label: item }));
const guestSelectOptions = guestsOptions.map((item) => ({ value: item, label: item }));
const budgetSelectOptions = budgetOptions.map((item) => ({
  value: item,
  label: item === "All" ? "All Budgets" : `${item} Budget`,
}));
const categorySelectOptions = categoriesOptions.map((item) => ({ value: item, label: item }));

const continentMapping: Record<string, string[]> = {
  Asia: [
    "goa",
    "west bengal",
    "himachal pradesh",
    "rajasthan",
    "kerala",
    "uttarakhand",
    "karnataka",
    "tamil nadu",
    "andaman",
    "nicobar",
    "sikkim",
    "ladakh",
    "assam",
    "gujarat",
    "bihar",
    "mizoram",
    "meghalaya",
    "andhra pradesh",
    "telangana",
    "delhi",
    "agra",
    "jammu",
    "kashmir",
    "punjab",
    "madhya pradesh",
    "maharashtra",
    "odisha",
    "darjeeling",
    "kalimpong",
    "kurseong",
    "kolkata",
    "chennai",
    "india",
    "nepal",
    "japan",
    "thailand",
    "indonesia",
    "south korea",
    "bhutan",
    "singapore",
    "vietnam",
    "uae",
    "qatar",
    "doha",
    "philippines",
    "manila",
    "hanoi",
    "maldives",
  ],
  Europe: [
    "greece",
    "santorini",
    "switzerland",
    "france",
    "austria",
    "italy",
    "germany",
    "russia",
    "united kingdom",
    "england",
    "ireland",
    "romania",
    "spain",
    "netherlands",
    "norway",
    "ukraine",
    "sicily",
    "dublin",
    "manchester",
    "st. petersburg",
    "hamburg",
    "alba",
  ],
  Africa: ["south africa", "tanzania", "morocco", "somalia", "africa", "mauritius"],
  "North America": [
    "usa",
    "canada",
    "mexico",
    "seattle",
    "san diego",
    "mexico city",
    "aruba",
    "caribbean",
    "toronto",
  ],
  "South America": ["brazil", "peru"],
  Australia: ["australia", "new zealand"],
};

const categoryMapping: Record<string, string> = {
  Beaches: "Beach",
  Mountains: "Hill Station",
  Historical: "Historical",
  Desert: "Desert",
  Nature: "Nature",
  Adventure: "Adventure",
  Religious: "Religious",
  Cafes: "City",
  Restaurants: "City",
};

function getCategoriesForPlace(name: string): string[] {
  const n = name.toLowerCase();
  if (n.includes("tawang")) return ["Mountains", "Adventure"];
  if (n.includes("coorg")) return ["Mountains", "Nature", "Cafes"];
  if (n.includes("darjeeling")) return ["Mountains", "Cafes", "Nature"];
  if (n.includes("munnar")) return ["Mountains", "Nature", "Cafes"];
  if (n.includes("jaisalmer")) return ["Desert", "Historical"];
  if (n.includes("santorini")) return ["Beaches", "Historical"];
  if (n.includes("bali")) return ["Beaches", "Nature"];
  if (n.includes("phuket")) return ["Beaches", "Adventure"];
  if (n.includes("krabi")) return ["Beaches"];
  if (n.includes("kyoto")) return ["Historical", "Cafes"];
  if (n.includes("swiss")) return ["Mountains", "Adventure"];
  if (n.includes("paris")) return ["Cafes", "Restaurants", "Historical"];
  if (n.includes("new york")) return ["Cafes", "Restaurants"];
  if (n.includes("london")) return ["Cafes", "Restaurants", "Historical"];
  if (n.includes("machu picchu")) return ["Historical", "Adventure"];
  if (n.includes("rio")) return ["Beaches"];
  if (n.includes("marrakesh")) return ["Desert", "Historical"];
  if (n.includes("cape town")) return ["Beaches", "Nature"];
  if (n.includes("sydney")) return ["Beaches"];
  if (n.includes("queenstown")) return ["Adventure", "Mountains"];
  if (n.includes("canada")) return ["Nature", "Mountains"];
  if (n.includes("las vegas")) return ["Restaurants"];
  if (n.includes("rome")) return ["Historical", "Restaurants"];
  if (n.includes("miami")) return ["Beaches"];
  if (n.includes("san diego")) return ["Beaches"];
  if (n.includes("mexico")) return ["Historical", "Restaurants"];
  if (n.includes("seattle")) return ["Cafes", "Restaurants"];
  if (n.includes("rishikesh")) return ["Adventure", "Religious"];
  if (n.includes("puri")) return ["Religious", "Beaches"];
  if (n.includes("varanasi")) return ["Religious", "Historical"];
  if (n.includes("kedarnath")) return ["Religious", "Mountains"];
  if (n.includes("somnath")) return ["Religious", "Historical"];
  if (n.includes("dwarka")) return ["Religious", "Historical"];
  if (n.includes("bodh gaya")) return ["Religious", "Historical"];
  if (n.includes("tirupati")) return ["Religious"];
  if (n.includes("goa")) return ["Beaches", "Restaurants"];
  if (n.includes("maldives")) return ["Beaches"];
  if (n.includes("dubai")) return ["Desert", "Restaurants"];
  if (n.includes("bhuj")) return ["Desert", "Historical"];
  if (n.includes("rann of kutch")) return ["Desert"];
  if (n.includes("nature")) return ["Nature"];
  return ["Nature"];
}

const getStableMockBudget = (item: any) => {
  if (item.budget) return item.budget;
  let hash = 0;
  const name = item.name || "";
  for (let i = 0; i < name.length; i++) {
    hash += name.charCodeAt(i);
  }
  const budgets = ["Low", "Medium", "High"];
  return budgets[hash % 3];
};

function filterDestinations(
  items: any[],
  continent: string,
  guests: string,
  budget: string,
  category: string,
) {
  const targetContinentKeywords = continentMapping[continent] || [];

  let filtered = items.filter((item) => {
    const itemLoc = (item.location || item.region || "").toLowerCase();
    const itemName = (item.name || "").toLowerCase();

    return targetContinentKeywords.some(
      (keyword) => itemLoc.includes(keyword) || itemName.includes(keyword),
    );
  });

  if (filtered.length === 0) {
    filtered = [...items];
  }

  if (category && category !== "All") {
    const dbCat = categoryMapping[category] || category;
    filtered = filtered.filter((item) => {
      // If database category is present and matches typical DB categories
      if (
        item.category &&
        [
          "Beach",
          "Hill Station",
          "Historical",
          "Desert",
          "Nature",
          "Adventure",
          "Religious",
          "City",
        ].includes(item.category)
      ) {
        return (
          item.category.toLowerCase().includes(dbCat.toLowerCase()) ||
          (item.description || "").toLowerCase().includes(category.toLowerCase())
        );
      }
      const localCats = getCategoriesForPlace(item.name);
      return localCats.some((c) => c.toLowerCase() === category.toLowerCase());
    });
  }

  if (budget && budget !== "All") {
    filtered = filtered.filter((item) => {
      const itemBudget = getStableMockBudget(item);
      return itemBudget.toLowerCase() === budget.toLowerCase();
    });
  }

  const guestsFiltered = filtered.filter((item) => {
    const crowd = (item.crowd || "").toLowerCase();
    const rating = item.rating || 0.0;
    if (guests === "Solo") return crowd === "peaceful" || rating >= 4.7;
    if (guests === "Couple") return crowd !== "bustling" || rating >= 4.6;
    if (guests === "Family") return crowd !== "peaceful" || rating >= 4.5;
    if (guests === "Friends") return crowd !== "peaceful" || rating >= 4.6;
    return true;
  });

  if (guestsFiltered.length > 0) {
    return guestsFiltered;
  }

  return filtered;
}

const discoverSearchSchema = z.object({
  region: z.string().optional(),
  date: z.string().optional(),
  guests: z.string().optional(),
  budget: z.string().optional(),
  category: z.string().optional(),
});

export const Route = createFileRoute("/discover")({
  validateSearch: (search) => discoverSearchSchema.parse(search),
  component: DiscoverPageWrapper,
});

function DiscoverPageWrapper() {
  return (
    <CountryProvider>
      <DiscoverPage />
    </CountryProvider>
  );
}

function DiscoverPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/discover" });
  const { formatBudget, currency } = useCountrySettings();

  const [selectedRegion, setSelectedRegion] = useState(search.region || "Asia");
  const [selectedDate, setSelectedDate] = useState(search.date || "2026-06-01");
  const [selectedGuests, setSelectedGuests] = useState(search.guests || "Couple");
  const [selectedBudget, setSelectedBudget] = useState(search.budget || "All");
  const [selectedCategory, setSelectedCategory] = useState(search.category || "");

  const [discoverResults, setDiscoverResults] = useState<any[]>([]);
  const [discoverLoading, setDiscoverLoading] = useState(false);
  const [discoverError, setDiscoverError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    if (search.region) setSelectedRegion(search.region);
    if (search.date) setSelectedDate(search.date);
    if (search.guests) setSelectedGuests(search.guests);
    if (search.budget) setSelectedBudget(search.budget);
    setSelectedCategory(search.category || "");
  }, [search.region, search.date, search.guests, search.budget, search.category]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const loadWishlist = () => {
      const stored = window.localStorage.getItem("yatrika-favorites");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) setWishlist(parsed);
        } catch {}
      }
    };
    loadWishlist();
    window.addEventListener("yatrika:favorites-updated", loadWishlist);
    return () => window.removeEventListener("yatrika:favorites-updated", loadWishlist);
  }, []);

  const runSearch = async (
    region: string,
    guests: string,
    date: string,
    budget: string,
    category: string,
  ) => {
    setDiscoverError(null);
    setDiscoverLoading(true);
    setDiscoverResults([]);

    try {
      const response = await getDestinations({ limit: 250 });
      const dbItems = Array.isArray(response) ? response : (response.data ?? []);

      if (dbItems.length > 0) {
        const matched = filterDestinations(dbItems, region, guests, budget, category);
        if (matched.length > 0) {
          setDiscoverResults(matched.slice(0, 12));
          setDiscoverLoading(false);
          return;
        }
      }
    } catch (error) {
      console.warn("Backend API call failed, falling back to static local data:", error);
    }

    const localMatched = filterDestinations(places, region, guests, budget, category);
    setDiscoverResults(localMatched.slice(0, 12));
    setDiscoverLoading(false);
  };

  useEffect(() => {
    runSearch(selectedRegion, selectedGuests, selectedDate, selectedBudget, selectedCategory);
  }, [selectedRegion, selectedGuests, selectedDate, selectedBudget, selectedCategory]);

  const handleFilterChange = (updates: {
    region?: string;
    date?: string;
    guests?: string;
    budget?: string;
    category?: string;
  }) => {
    const nextRegion = updates.region ?? selectedRegion;
    const nextDate = updates.date ?? selectedDate;
    const nextGuests = updates.guests ?? selectedGuests;
    const nextBudget = updates.budget ?? selectedBudget;
    const nextCategory = updates.category !== undefined ? updates.category : selectedCategory;

    navigate({
      to: "/discover",
      search: {
        region: nextRegion,
        date: nextDate,
        guests: nextGuests,
        budget: nextBudget,
        category: nextCategory || undefined,
      },
      replace: true,
    });
  };

  const toggleWishlist = (name: string) => {
    let next: string[];
    if (wishlist.includes(name)) {
      next = wishlist.filter((x) => x !== name);
    } else {
      next = [...wishlist, name];
    }
    setWishlist(next);
    window.localStorage.setItem("yatrika-favorites", JSON.stringify(next));
    window.dispatchEvent(new Event("yatrika:favorites-updated"));
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans flex flex-col pt-16">
      <Navbar />

      {/* Decorative top background banner */}
      <div className="relative h-[35vh] w-full overflow-hidden flex items-end">
        <img
          src={heroImg}
          alt="Cinematic Background"
          className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.4] saturate-[0.8]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-8 w-full">
          <div className="max-w-2xl">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 text-xs font-semibold mb-3 group transition cursor-pointer"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Explorer</span>
            </Link>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-white drop-shadow-md">
              Discover Escapes
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-md">
              Cinematic destinations matching your parameters. Handpicked to balance adventure,
              comfort, and authenticity.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-6 pb-24 w-full -mt-6 relative z-20">
        {/* Horizontal Filters Bar */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 select-none">
          {/* Continent Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Continent
            </label>
            <GlassSelect
              value={selectedRegion}
              onValueChange={(value) => handleFilterChange({ region: value })}
              options={regionOptions}
              icon={Globe}
              triggerClassName="min-h-10 rounded-xl px-3 py-2"
              iconClassName="h-auto w-auto bg-transparent text-sky-400 ring-0"
              contentClassName="bg-slate-950/80"
            />
          </div>

          {/* Date Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              When
            </label>
            <GlassDatePicker
              value={selectedDate}
              onValueChange={(value) => handleFilterChange({ date: value })}
              triggerClassName="min-h-10 rounded-xl px-3 py-2"
              iconClassName="h-auto w-auto bg-transparent text-sky-400 ring-0"
              contentClassName="bg-slate-950/80"
            />
          </div>

          {/* Guests Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Guests
            </label>
            <GlassSelect
              value={selectedGuests}
              onValueChange={(value) => handleFilterChange({ guests: value })}
              options={guestSelectOptions}
              icon={User}
              triggerClassName="min-h-10 rounded-xl px-3 py-2"
              iconClassName="h-auto w-auto bg-transparent text-sky-400 ring-0"
              contentClassName="bg-slate-950/80"
            />
          </div>

          {/* Budget Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Budget
            </label>
            <GlassSelect
              value={selectedBudget}
              onValueChange={(value) => handleFilterChange({ budget: value })}
              options={budgetSelectOptions}
              icon={SlidersHorizontal}
              triggerClassName="min-h-10 rounded-xl px-3 py-2"
              iconClassName="h-auto w-auto bg-transparent text-sky-400 ring-0"
              contentClassName="bg-slate-950/80"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Mood / Category
            </label>
            <GlassSelect
              value={selectedCategory || "All"}
              onValueChange={(value) =>
                handleFilterChange({ category: value === "All" ? "" : value })
              }
              options={categorySelectOptions}
              icon={Coffee}
              triggerClassName="min-h-10 rounded-xl px-3 py-2"
              iconClassName="h-auto w-auto bg-transparent text-sky-400 ring-0"
              contentClassName="bg-slate-950/80"
            />
          </div>
        </div>

        {/* Curated Cafes & Restaurants Suggestions */}
        {selectedCategory && categorySuggestions[selectedCategory] && (
          <div className="mb-10 bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 border border-sky-500/20">
                <Coffee size={16} />
              </div>
              <div>
                <h3 className="font-display text-xl md:text-2xl font-bold text-white leading-tight">
                  Curated {selectedCategory} Cafes & Restaurants
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Handpicked local dining and coffee recommendations matching your mood.
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categorySuggestions[selectedCategory].map((sug) => {
                const Icon = sug.type === "Cafe" ? Coffee : Utensils;
                return (
                  <div
                    key={sug.name}
                    className="group relative overflow-hidden rounded-2xl bg-slate-950/40 border border-white/5 shadow-md hover:border-white/10 transition-all duration-300 flex flex-col"
                  >
                    <div className="relative h-40 w-full overflow-hidden bg-slate-950">
                      <img
                        src={sug.photo}
                        alt={sug.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            sug.type === "Cafe"
                              ? "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60"
                              : "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&auto=format&fit=crop&q=60";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                      {/* Type Badge */}
                      <span
                        className={`absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                          sug.type === "Cafe"
                            ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        <Icon size={10} />
                        {sug.type}
                      </span>

                      {/* Rating */}
                      <div className="absolute top-3 right-3 bg-slate-950/75 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px] text-amber-400 border border-white/5">
                        <Star size={10} className="fill-amber-400 text-amber-400" />
                        <span className="font-bold text-white">{sug.rating}</span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between gap-2">
                      <div>
                        <h4 className="font-display text-base font-bold text-white tracking-wide">
                          {sug.name}
                        </h4>
                        <div className="flex items-center text-slate-400 text-[11px] mt-0.5">
                          <MapPin size={10} className="text-sky-400 mr-1 shrink-0" />
                          <span className="truncate">{sug.place}</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mt-2 line-clamp-2">
                          {sug.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Results Info Bar */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-slate-400">
            Showing <span className="text-white font-medium">{discoverResults.length}</span>{" "}
            matching destinations
          </p>
          {discoverLoading && (
            <div className="flex items-center gap-2 text-xs text-sky-400 animate-pulse">
              <Loader2 size={12} className="animate-spin" />
              Refining recommendations...
            </div>
          )}
        </div>

        {/* Results Grid */}
        {discoverError ? (
          <div className="rounded-2xl border border-rose-900/50 bg-rose-950/20 p-6 text-center text-sm text-rose-300">
            {discoverError}
          </div>
        ) : discoverResults.length === 0 && !discoverLoading ? (
          <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-400">
            <p className="text-base font-semibold mb-2">No matching escapes found</p>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
              Try adjusting your region, budget, or guest preferences to discover other locations.
            </p>
            <button
              onClick={() => {
                handleFilterChange({ region: "Asia", guests: "Couple", budget: "All" });
              }}
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-xl text-sm transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {discoverResults.map((item) => {
              const rawBudget = getStableMockBudget(item);
              const itemBudget = isNaN(Number(rawBudget))
                ? formatBudget(rawBudget)
                : `${currency}${Number(rawBudget).toLocaleString()}`;
              const isLiked = wishlist.includes(item.name);

              return (
                <div
                  key={item._id || item.id || item.name}
                  className="group relative rounded-3xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/60 overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-sky-950/10"
                >
                  {/* Card Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={item.img || item.image_url || "/placeholder.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(item.name)}
                      className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/60 hover:bg-slate-950/95 border border-white/10 flex items-center justify-center text-white transition active:scale-95 cursor-pointer z-10"
                      aria-label="Add to wishlist"
                    >
                      <Heart
                        size={16}
                        className={
                          isLiked ? "fill-rose-500 text-rose-500" : "text-white hover:text-rose-400"
                        }
                      />
                    </button>

                    {/* Rating Badge */}
                    <div className="absolute bottom-4 left-4 bg-slate-950/70 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 text-xs text-amber-400 border border-white/5">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-white">{item.rating ?? "4.5"}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col gap-3">
                    <div>
                      <h4 className="font-display text-lg font-semibold text-white tracking-wide">
                        {item.name}
                      </h4>
                      <div className="flex items-center text-slate-400 text-xs mt-1">
                        <MapPin size={12} className="text-sky-400 mr-1 shrink-0" />
                        <span className="truncate">{item.location || item.region}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 min-h-[2rem]">
                      {item.description ||
                        "A breathtaking location that offers exceptional sights, rich local experiences, and scenic natural views."}
                    </p>

                    <div className="border-t border-slate-800/80 pt-3 mt-1 flex items-center justify-between text-xs">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wide">
                          Budget
                        </span>
                        <span className="font-semibold text-slate-200">{itemBudget}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wide">
                          Crowd
                        </span>
                        <span className="font-medium text-sky-300">{item.crowd || "Moderate"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
