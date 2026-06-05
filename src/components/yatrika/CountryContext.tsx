import React, { createContext, useContext, useState, useEffect } from "react";

export type CountryType = "India" | "USA" | "UK" | "Europe";

interface CountryContextProps {
  country: CountryType;
  currency: string;
  setCountry: (country: CountryType) => void;
  formatBudget: (budgetValue: string) => string;
  convertAndFormatPrice: (basePrice: number) => string;
}

const CountryContext = createContext<CountryContextProps | undefined>(undefined);

const countryConfigs = {
  India: { currency: "₹", rate: 1 },
  USA: { currency: "$", rate: 0.012 },
  UK: { currency: "£", rate: 0.0094 },
  Europe: { currency: "€", rate: 0.011 },
};

const budgetMappings: Record<CountryType, Record<string, string>> = {
  India: {
    Low: "Under ₹15,000",
    Medium: "₹15,000 - ₹45,000",
    High: "₹45,000+",
  },
  USA: {
    Low: "Under $200",
    Medium: "$200 - $600",
    High: "$600+",
  },
  UK: {
    Low: "Under £150",
    Medium: "£150 - £450",
    High: "£450+",
  },
  Europe: {
    Low: "Under €180",
    Medium: "€180 - €550",
    High: "€550+",
  },
};

export function CountryProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountryState] = useState<CountryType>("India");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("yatrika-country") as CountryType;
      if (stored && ["India", "USA", "UK", "Europe"].includes(stored)) {
        setCountryState(stored);
      }
    }
  }, []);

  const setCountry = (newCountry: CountryType) => {
    setCountryState(newCountry);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("yatrika-country", newCountry);
    }
  };

  const currency = countryConfigs[country].currency;

  const formatBudget = (budgetValue: string) => {
    const cleanValue = budgetValue.trim();
    return budgetMappings[country][cleanValue] || `${currency} (${cleanValue})`;
  };

  const convertAndFormatPrice = (basePrice: number) => {
    const config = countryConfigs[country];
    const converted = Math.round(basePrice * config.rate);
    return `${config.currency}${converted.toLocaleString()}`;
  };

  return (
    <CountryContext.Provider
      value={{
        country,
        currency,
        setCountry,
        formatBudget,
        convertAndFormatPrice,
      }}
    >
      {children}
    </CountryContext.Provider>
  );
}

export function useCountrySettings() {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error("useCountrySettings must be used within a CountryProvider");
  }
  return context;
}
