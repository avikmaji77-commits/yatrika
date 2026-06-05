import React, { useMemo, useState, useEffect } from "react";
import { CalendarDays, Heart, MapPin, Sparkles, Star, Users, X } from "lucide-react";
import { useCountrySettings } from "./CountryContext";
import { addToWishlist, removeFromWishlist } from "@/lib/api-service";
import { openAssistant } from "@/lib/travel-actions";
import darjeeling from "@/assets/dest-darjeeling.jpg";
import coorg from "@/assets/dest-coorg.jpg";
import tawang from "@/assets/dest-tawang.jpg";
import munnar from "@/assets/destinations-munnar-tourism.jpg";
import jaisalmer from "@/assets/jaislamer_fort_night_view.jpg";
import santorini from "@/assets/dest-santorini.jpg";
import bali from "@/assets/Bali.jpg";
import Krabi from "@/assets/Krabi.jpg";
import SwissAlps from "@/assets/Swissalps.jpg";
import Paris from "@/assets/Paris.jpg";
import London from "@/assets/London.jpg";
import NewYork from "@/assets/Newyork.jpg";
import MachuPicchu from "@/assets/MachuPicchuPeru.jpg";
import Rio from "@/assets/RiodeJaneiro.jpg";
import Marrakesh from "@/assets/Marrakesh.jpg";
import CapeTown from "@/assets/capetown.jpg";
import Sydney from "@/assets/Sydney.jpg";
import Queenstown from "@/assets/NZ.jpg";
import Kyoto from "@/assets/Mt_Fuji.jpg";
import Phuket from "@/assets/Phuket.jpg";
import Rishikesh from "@/assets/Rishikesh.jpg";
import Ooty from "@/assets/Ooty.jpg";
import Puri from "@/assets/Puri.jpg";
import Dubai from "@/assets/Dubai.jpg";
import Pondicherry from "@/assets/Pondicherry.jpg";
import Manali from "@/assets/Manali.jpg";
import Goa from "@/assets/Goa.jpg";
import Maldives from "@/assets/Maldives.jpg";
import Varanasi from "@/assets/VARANASI.jpg";
import Kashmir from "@/assets/Kashmir.jpg";
import Ladhak from "@/assets/leh_ladakh.jpg";
import Kedarnath from "@/assets/kedarnath.jpg";
import Singapor from "@/assets/Singapore.jpg";
import Vietnam from "@/assets/vietnam.jpg";
import Bhutan from "@/assets/Bhutan.jpg";
import HongKong from "@/assets/Hong_Kong.jpg";
import Canada from "@/assets/Canada.jpg";
import Agra from "@/assets/TajMahal.jpg";
import Mauritius from "@/assets/mauritius.jpg";
import Bangkok from "@/assets/Bangkok.jpg";
import Qatar from "@/assets/Qatar.jpg";
import LasVegas from "@/assets/Lasvegas.jpg";
import Philippines from "@/assets/Philippines.jpg";
import Rome from "@/assets/Rome.jpg";
import Miami from "@/assets/Miami.jpg";
import Hallsatt from "@/assets/Hallstatt.jpg";
import Sicily from "@/assets/Sicily.jpg";
import Aruba from "@/assets/Aruba.jpg";
import Jeju from "@/assets/Jeju.jpg";
import Sundarban from "@/assets/Sundarbans.jpg";
import VictoriaMemorial from "@/assets/Kolkata.jpg";
import Amsterdam from "@/assets/Amsterdam_Netherlands.jpg";
import SpitiValley from "@/assets/Spiti_Valley.jpg";
import Florence from "@/assets/Florence.jpg";
import Nainital from "@/assets/Naini.jpg";
import Melbourne from "@/assets/Melbourne.jpg";
import Auli from "@/assets/Auli.jpg";
import Madrid from "@/assets/Madrid_Spania.jpg";
import Kaziranga from "@/assets/Kaziranga.jpg";
import Moscow from "@/assets/Moscow.jpg";
import Ranthambore from "@/assets/Ranthambore.jpg";
import Dublin from "@/assets/Dublin.jpg";
import JimCorbett from "@/assets/Jim_Corbett.jpg";
import Seattle from "@/assets/Seattle.jpg";
import Shillong from "@/assets/Shillong.jpg";
import Oslo from "@/assets/Norway.jpg";
import Hampi from "@/assets/Hampi.jpg";
import Manchester from "@/assets/Manchester.jpg";
import Khajuraho from "@/assets/Khajuraho.jpg";
import StPetersburg from "@/assets/St_ Petersburg.jpg";
import MountAbu from "@/assets/MountAbu_Rajasthan.jpg";
import Alba from "@/assets/Alba_Romania.jpg";
import BadrinathDham from "@/assets/Badrinath_Dham.jpg";
import SanDiego from "@/assets/San_Diego.jpg";
import Udaipur from "@/assets/Udaipur.jpg";
import Hamburg from "@/assets/hamburg_germany.jpg";
import MysorePalace from "@/assets/Mysore_Palace.jpg";
import Yalta from "@/assets/Yalta_Ukrain.jpg";
import KapsleeshwararTemple from "@/assets/Chennai.jpg";
import Tanzania from "@/assets/Tanzania.jpg";
import Visakhapatnam from "@/assets/Vizag.jpg";
import MexicoCity from "@/assets/Mexico.jpg";
import Kalimpong from "@/assets/Kalimpong.jpg";
import Kazakhstan from "@/assets/Kazakhstan.jpg";
import RannOfKutch from "@/assets/rann_of_kutch.jpg";
import Somalia from "@/assets/Somalia.jpg";
import SomnathTemple from "@/assets/SomnathTemple.jpg";
import Kathmandu from "@/assets/Katmandú.jpg";
import Dwarka from "@/assets/DWARKA.jpg";
import Gulmarg from "@/assets/Gulmarg.jpg";
import GokarnaBeach from "@/assets/gokarna_beach.jpg";
import Kurseong from "@/assets/Kurseong.jpg";
import Varkala from "@/assets/Varkala_kerala.jpg";
import Sandakphu from "@/assets/Sandakphu.jpg";
import BodhGaya from "@/assets/Bodh_gaya.jpg";
import Mussoorie from "@/assets/Mussoorie.jpg";
import ArakuValley from "@/assets/Araku_Valley.jpg";
import Shimla from "@/assets/Shimla.jpg";
import Santiniketan from "@/assets/santiniketan.jpg";
import Aizawl from "@/assets/Mizoram.jpg";
import Tirupati from "@/assets/Tirupati_temple.jpg";
import AndamanNicobar from "@/assets/Andaman_and_Nicobar.jpg";
import Patnitop from "@/assets/patnitop.jpg";
import Bhuj from "@/assets/bhuj.jpg";
import Jammu from "@/assets/Jammu.jpg";
import Bangalore from "@/assets/Bangalore_Palace.jpg";
import cherrapunji from "@/assets/meghalaya.jpg";

type Place = {
  name: string;
  region: string;
  img: string;
  rating: number;
  crowd: "Peaceful" | "Moderate" | "Bustling";

  category: "Trending" | "Hidden Gems" | "Daily Picks" | "Recently Popular";
};

export const places: Place[] = [
  {
    name: "Tawang",

    region: "Arunachal Pradesh",

    img: tawang,

    rating: 4.7,

    crowd: "Peaceful",

    category: "Hidden Gems",
  },

  {
    name: "Coorg",

    region: "Karnataka",

    img: coorg,

    rating: 4.7,

    crowd: "Moderate",

    category: "Hidden Gems",
  },

  {
    name: "Darjeeling",

    region: "West Bengal",

    img: darjeeling,

    rating: 4.6,

    crowd: "Bustling",

    category: "Daily Picks",
  },

  {
    name: "Munnar",

    region: "Kerala",

    img: munnar,

    rating: 4.6,

    crowd: "Moderate",

    category: "Daily Picks",
  },

  {
    name: "Jaisalmer",

    region: "Rajasthan",

    img: jaisalmer,

    rating: 4.8,

    crowd: "Bustling",

    category: "Trending",
  },

  {
    name: "Santorini",

    region: "Greece",

    img: santorini,

    rating: 4.9,

    crowd: "Bustling",

    category: "Recently Popular",
  },

  {
    name: "Bali",

    region: "Indonesia",

    img: bali,

    rating: 4.6,

    crowd: "Bustling",

    category: "Trending",
  },

  {
    name: "Phuket",

    region: "Thailand",

    img: Phuket,

    rating: 4.6,

    crowd: "Bustling",

    category: "Trending",
  },

  {
    name: "Krabi",

    region: "Thailand",

    img: Krabi,

    rating: 4.6,

    crowd: "Moderate",

    category: "Recently Popular",
  },

  {
    name: "Kyoto",

    region: "Japan",

    img: Kyoto,

    rating: 4.8,

    crowd: "Peaceful",

    category: "Trending",
  },

  {
    name: "Swiss Alps",

    region: "Switzerland",

    img: SwissAlps,

    rating: 4.9,

    crowd: "Peaceful",

    category: "Trending",
  },

  {
    name: "Paris",

    region: "France",

    img: Paris,

    rating: 4.7,

    crowd: "Bustling",

    category: "Recently Popular",
  },

  {
    name: "New York",

    region: "USA",

    img: NewYork,

    rating: 4.6,

    crowd: "Bustling",

    category: "Trending",
  },

  {
    name: "London",

    region: "UK",

    img: London,

    rating: 4.8,

    crowd: "Moderate",

    category: "Trending",
  },

  {
    name: "Machu Picchu",

    region: "Peru",

    img: MachuPicchu,

    rating: 4.9,

    crowd: "Moderate",

    category: "Hidden Gems",
  },

  {
    name: "Rio de Janeiro",

    region: "Brazil",

    img: Rio,

    rating: 4.6,

    crowd: "Bustling",

    category: "Recently Popular",
  },

  {
    name: "Marrakesh",

    region: "Morocco",

    img: Marrakesh,

    rating: 4.5,

    crowd: "Bustling",

    category: "Trending",
  },

  {
    name: "Cape Town",

    region: "South Africa",

    img: CapeTown,

    rating: 4.7,

    crowd: "Moderate",

    category: "Recently Popular",
  },

  {
    name: "Sydney",

    region: "Australia",

    img: Sydney,

    rating: 4.6,

    crowd: "Bustling",

    category: "Trending",
  },

  {
    name: "Queenstown",

    region: "New Zealand",

    img: Queenstown,

    rating: 4.9,

    crowd: "Bustling",

    category: "Daily Picks",
  },

  {
    name: "Rishikesh",

    region: "Uttarakhand",

    img: Rishikesh,

    rating: 4.6,

    crowd: "Bustling",

    category: "Trending",
  },

  {
    name: "Ooty",
    region: "Tamil Nadu",
    img: Ooty,
    rating: 4.6,
    crowd: "Peaceful",
    category: "Trending",
  },

  {
    name: "Puri",
    region: "Odisha",
    img: Puri,
    rating: 4.5,
    crowd: "Bustling",
    category: "Daily Picks",
  },

  {
    name: "Dubai",
    region: "UAE",
    img: Dubai,
    rating: 4.8,
    crowd: "Bustling",
    category: "Trending",
  },

  {
    name: "Pondicherry",
    region: "Tamil Nadu",
    img: Pondicherry,
    rating: 4.7,
    crowd: "Moderate",
    category: "Recently Popular",
  },

  {
    name: "Manali",
    region: "Himachal Pradesh",
    img: Manali,
    rating: 4.8,
    crowd: "Bustling",
    category: "Trending",
  },

  {
    name: "Goa",
    region: "India",
    img: Goa,
    rating: 4.9,
    crowd: "Bustling",
    category: "Trending",
  },

  {
    name: "Maldives",
    region: "Indian Ocean",
    img: Maldives,
    rating: 4.9,
    crowd: "Peaceful",
    category: "Trending",
  },

  {
    name: "Varanasi",
    region: "Uttar Pradesh",
    img: Varanasi,
    rating: 4.7,
    crowd: "Bustling",
    category: "Daily Picks",
  },

  {
    name: "Kashmir",
    region: "Jammu & Kashmir",
    img: Kashmir,
    rating: 4.9,
    crowd: "Peaceful",
    category: "Trending",
  },

  {
    name: "Leh Ladakh",
    region: "Ladakh",
    img: Ladhak,
    rating: 4.9,
    crowd: "Peaceful",
    category: "Hidden Gems",
  },

  {
    name: "Kedarnath",
    region: "Uttarakhand",
    img: Kedarnath,
    rating: 4.8,
    crowd: "Moderate",
    category: "Recently Popular",
  },

  {
    name: "Singapore",
    region: "Singapore",
    img: Singapor,
    rating: 4.8,
    crowd: "Bustling",
    category: "Trending",
  },

  {
    name: "Ho Chi Minh City",
    region: "Vietnam",
    img: Vietnam,
    rating: 4.7,
    crowd: "Moderate",
    category: "Recently Popular",
  },

  {
    name: "Thimphu",
    region: "Bhutan",
    img: Bhutan,
    rating: 4.9,
    crowd: "Peaceful",
    category: "Hidden Gems",
  },

  {
    name: "Hong Kong",
    region: "China",
    img: HongKong,
    rating: 4.6,
    crowd: "Bustling",
    category: "Trending",
  },

  {
    name: "Canada",
    region: "North America",
    img: Canada,
    rating: 4.8,
    crowd: "Peaceful",
    category: "Trending",
  },

  {
    name: "Agra",
    region: "Delhi NCR",
    img: Agra,
    rating: 4.9,
    crowd: "Bustling",
    category: "Daily Picks",
  },

  {
    name: "Mauritius",
    region: "Africa",
    img: Mauritius,
    rating: 4.8,
    crowd: "Peaceful",
    category: "Trending",
  },

  {
    name: "Bangkok",
    region: "Thailand",
    img: Bangkok,
    rating: 4.7,
    crowd: "Bustling",
    category: "Recently Popular",
  },

  {
    name: "Qatar",
    region: "Middle East",
    img: Qatar,
    rating: 4.6,
    crowd: "Moderate",
    category: "Trending",
  },

  {
    name: "Las Vegas",
    region: "USA",
    img: LasVegas,
    rating: 4.8,
    crowd: "Bustling",
    category: "Trending",
  },

  {
    name: "Philippines",
    region: "Southeast Asia",
    img: Philippines,
    rating: 4.7,
    crowd: "Moderate",
    category: "Hidden Gems",
  },

  {
    name: "Rome",
    region: "Italy",
    img: Rome,
    rating: 4.9,
    crowd: "Bustling",
    category: "Trending",
  },

  {
    name: "Miami",
    region: "USA",
    img: Miami,
    rating: 4.7,
    crowd: "Bustling",
    category: "Recently Popular",
  },

  {
    name: "Hallstatt",
    region: "Austria",
    img: Hallsatt,
    rating: 4.9,
    crowd: "Peaceful",
    category: "Hidden Gems",
  },
  {
    name: "Victoria Memorial",
    region: "Kolkata, West Bengal",
    img: VictoriaMemorial,
    rating: 4.8,
    crowd: "Moderate",
    category: "Daily Picks",
  },

  {
    name: "Amsterdam",
    region: "Netherlands",
    img: Amsterdam,
    rating: 4.8,
    crowd: "Bustling",
    category: "Hidden Gems",
  },

  {
    name: "Spiti Valley",
    region: "Himachal Pradesh",
    img: SpitiValley,
    rating: 4.9,
    crowd: "Peaceful",
    category: "Hidden Gems",
  },

  {
    name: "Florence",
    region: "Italy",
    img: Florence,
    rating: 4.8,
    crowd: "Moderate",
    category: "Trending",
  },

  {
    name: "Nainital",
    region: "Uttarakhand",
    img: Nainital,
    rating: 4.7,
    crowd: "Moderate",
    category: "Daily Picks",
  },

  {
    name: "Melbourne",
    region: "Australia",
    img: Melbourne,
    rating: 4.8,
    crowd: "Bustling",
    category: "Trending",
  },

  {
    name: "Auli",
    region: "Uttarakhand",
    img: Auli,
    rating: 4.8,
    crowd: "Peaceful",
    category: "Hidden Gems",
  },

  {
    name: "Madrid",
    region: "Spain",
    img: Madrid,
    rating: 4.7,
    crowd: "Bustling",
    category: "Trending",
  },

  {
    name: "Kaziranga",
    region: "Assam",
    img: Kaziranga,
    rating: 4.9,
    crowd: "Peaceful",
    category: "Hidden Gems",
  },

  {
    name: "Moscow",
    region: "Russia",
    img: Moscow,
    rating: 4.6,
    crowd: "Bustling",
    category: "Trending",
  },

  {
    name: "Ranthambore",
    region: "Rajasthan",
    img: Ranthambore,
    rating: 4.8,
    crowd: "Moderate",
    category: "Daily Picks",
  },

  {
    name: "Dublin",
    region: "Ireland",
    img: Dublin,
    rating: 4.7,
    crowd: "Moderate",
    category: "Recently Popular",
  },

  {
    name: "Jim Corbett",
    region: "Uttarakhand",
    img: JimCorbett,
    rating: 4.8,
    crowd: "Peaceful",
    category: "Hidden Gems",
  },

  {
    name: "Seattle",
    region: "USA",
    img: Seattle,
    rating: 4.7,
    crowd: "Bustling",
    category: "Trending",
  },

  {
    name: "Shillong",
    region: "Meghalaya",
    img: Shillong,
    rating: 4.8,
    crowd: "Peaceful",
    category: "Hidden Gems",
  },

  {
    name: "Oslo",
    region: "Norway",
    img: Oslo,
    rating: 4.8,
    crowd: "Peaceful",
    category: "Trending",
  },

  {
    name: "Hampi",
    region: "Karnataka",
    img: Hampi,
    rating: 4.9,
    crowd: "Moderate",
    category: "Hidden Gems",
  },

  {
    name: "Manchester",
    region: "England",
    img: Manchester,
    rating: 4.6,
    crowd: "Bustling",
    category: "Recently Popular",
  },

  {
    name: "Khajuraho",
    region: "Madhya Pradesh",
    img: Khajuraho,
    rating: 4.7,
    crowd: "Moderate",
    category: "Hidden Gems",
  },

  {
    name: "St. Petersburg",
    region: "Russia",
    img: StPetersburg,
    rating: 4.8,
    crowd: "Moderate",
    category: "Trending",
  },

  {
    name: "Mount Abu",
    region: "Rajasthan",
    img: MountAbu,
    rating: 4.5,
    crowd: "Peaceful",
    category: "Daily Picks",
  },

  {
    name: "Alba",
    region: "Romania",
    img: Alba,
    rating: 4.5,
    crowd: "Peaceful",
    category: "Hidden Gems",
  },

  {
    name: "Badrinath Dham",
    region: "Uttarakhand",
    img: BadrinathDham,
    rating: 4.9,
    crowd: "Moderate",
    category: "Recently Popular",
  },

  {
    name: "San Diego",
    region: "USA",
    img: SanDiego,
    rating: 4.7,
    crowd: "Bustling",
    category: "Trending",
  },

  {
    name: "Udaipur",
    region: "Rajasthan",
    img: Udaipur,
    rating: 4.9,
    crowd: "Moderate",
    category: "Trending",
  },

  {
    name: "Hamburg",
    region: "Germany",
    img: Hamburg,
    rating: 4.6,
    crowd: "Bustling",
    category: "Recently Popular",
  },

  {
    name: "Mysore Palace",
    region: "Karnataka",
    img: MysorePalace,
    rating: 4.8,
    crowd: "Moderate",
    category: "Daily Picks",
  },

  {
    name: "Yalta",
    region: "Ukraine",
    img: Yalta,
    rating: 4.5,
    crowd: "Peaceful",
    category: "Hidden Gems",
  },

  {
    name: "Kapaleeshwarar Temple",
    region: "Chennai, Tamil Nadu",
    img: KapsleeshwararTemple,
    rating: 4.7,
    crowd: "Bustling",
    category: "Daily Picks",
  },

  {
    name: "Tanzania",
    region: "Africa",
    img: Tanzania,
    rating: 4.7,
    crowd: "Peaceful",
    category: "Trending",
  },

  {
    name: "Visakhapatnam",
    region: "Andhra Pradesh",
    img: Visakhapatnam,
    rating: 4.7,
    crowd: "Moderate",
    category: "Recently Popular",
  },

  {
    name: "Mexico City",
    region: "Mexico",
    img: MexicoCity,
    rating: 4.6,
    crowd: "Bustling",
    category: "Trending",
  },

  {
    name: "Kalimpong",
    region: "West Bengal",
    img: Kalimpong,
    rating: 4.7,
    crowd: "Peaceful",
    category: "Hidden Gems",
  },

  {
    name: "Kazakhstan",
    region: "Central Asia",
    img: Kazakhstan,
    rating: 4.5,
    crowd: "Moderate",
    category: "Trending",
  },

  {
    name: "Rann of Kutch",
    region: "Gujarat",
    img: RannOfKutch,
    rating: 4.9,
    crowd: "Peaceful",
    category: "Hidden Gems",
  },

  {
    name: "Somalia",
    region: "Africa",
    img: Somalia,
    rating: 4.0,
    crowd: "Moderate",
    category: "Recently Popular",
  },

  {
    name: "Somnath Temple",
    region: "Gujarat",
    img: SomnathTemple,
    rating: 4.9,
    crowd: "Moderate",
    category: "Daily Picks",
  },

  {
    name: "Kathmandu",
    region: "Nepal",
    img: Kathmandu,
    rating: 4.8,
    crowd: "Bustling",
    category: "Trending",
  },

  {
    name: "Dwarka",
    region: "Gujarat",
    img: Dwarka,
    rating: 4.8,
    crowd: "Moderate",
    category: "Daily Picks",
  },

  {
    name: "Gulmarg",
    region: "Jammu & Kashmir",
    img: Gulmarg,
    rating: 4.9,
    crowd: "Peaceful",
    category: "Trending",
  },

  {
    name: "Gokarna Beach",
    region: "Karnataka",
    img: GokarnaBeach,
    rating: 4.8,
    crowd: "Peaceful",
    category: "Hidden Gems",
  },

  {
    name: "Kurseong",
    region: "West Bengal",
    img: Kurseong,
    rating: 4.6,
    crowd: "Peaceful",
    category: "Hidden Gems",
  },

  {
    name: "Varkala",
    region: "Kerala",
    img: Varkala,
    rating: 4.8,
    crowd: "Moderate",
    category: "Recently Popular",
  },

  {
    name: "Sandakphu",
    region: "West Bengal",
    img: Sandakphu,
    rating: 4.9,
    crowd: "Peaceful",
    category: "Hidden Gems",
  },

  {
    name: "Bodh Gaya",
    region: "Bihar",
    img: BodhGaya,
    rating: 4.8,
    crowd: "Moderate",
    category: "Daily Picks",
  },

  {
    name: "Mussoorie",
    region: "Uttarakhand",
    img: Mussoorie,
    rating: 4.7,
    crowd: "Moderate",
    category: "Trending",
  },

  {
    name: "Araku Valley",
    region: "Andhra Pradesh",
    img: ArakuValley,
    rating: 4.7,
    crowd: "Peaceful",
    category: "Hidden Gems",
  },

  {
    name: "Shimla",
    region: "Himachal Pradesh",
    img: Shimla,
    rating: 4.8,
    crowd: "Bustling",
    category: "Trending",
  },

  {
    name: "Santiniketan",
    region: "West Bengal",
    img: Santiniketan,
    rating: 4.6,
    crowd: "Peaceful",
    category: "Hidden Gems",
  },

  {
    name: "Aizawl",
    region: "Mizoram",
    img: Aizawl,
    rating: 4.7,
    crowd: "Peaceful",
    category: "Hidden Gems",
  },

  {
    name: "Tirupati",
    region: "Andhra Pradesh",
    img: Tirupati,
    rating: 4.9,
    crowd: "Bustling",
    category: "Daily Picks",
  },

  {
    name: "Andaman & Nicobar",
    region: "India",
    img: AndamanNicobar,
    rating: 4.9,
    crowd: "Peaceful",
    category: "Trending",
  },

  {
    name: "Patnitop",
    region: "Jammu & Kashmir",
    img: Patnitop,
    rating: 4.5,
    crowd: "Peaceful",
    category: "Hidden Gems",
  },

  {
    name: "Bhuj",
    region: "Gujarat",
    img: Bhuj,
    rating: 4.5,
    crowd: "Moderate",
    category: "Recently Popular",
  },

  {
    name: "Jammu",
    region: "Jammu & Kashmir",
    img: Jammu,
    rating: 4.6,
    crowd: "Moderate",
    category: "Daily Picks",
  },

  {
    name: "Bangalore Palace",
    region: "Karnataka",
    img: Bangalore,
    rating: 4.6,
    crowd: "Bustling",
    category: "Trending",
  },

  {
    name: "Cherrapunji",
    region: "Meghalaya",
    img: cherrapunji,
    rating: 4.9,
    crowd: "Peaceful",
    category: "Hidden Gems",
  },
  {
    name: "Sicily",
    region: "Italy",
    img: Sicily,
    rating: 4.8,
    crowd: "Moderate",
    category: "Trending",
  },

  {
    name: "Aruba",
    region: "Caribbean",
    img: Aruba,
    rating: 4.7,
    crowd: "Peaceful",
    category: "Hidden Gems",
  },

  {
    name: "Jeju Island",
    region: "South Korea",
    img: Jeju,
    rating: 4.9,
    crowd: "Peaceful",
    category: "Trending",
  },

  {
    name: "Sundarbans",
    region: "West Bengal",
    img: Sundarban,
    rating: 4.8,
    crowd: "Peaceful",
    category: "Hidden Gems",
  },
];

const crowdColor = {
  Peaceful: "text-emerald-500 bg-emerald-500/15",
  Moderate: "text-amber-500 bg-amber-500/15",
  Bustling: "text-sky-500 bg-sky-500/15",
};

const tabs = ["All", "Trending", "Hidden Gems", "Daily Picks", "Recently Popular"];

export function Destinations() {
  const { formatBudget } = useCountrySettings();
  const [activeTab, setActiveTab] = useState("All");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("yatrika-favorites");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const initialFavorites = parsed.reduce<Record<string, boolean>>((acc, item) => {
            acc[item] = true;
            return acc;
          }, {});
          setFavorites(initialFavorites);
        }
      } catch {
        setFavorites({});
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedFavorites = Object.keys(favorites).filter((name) => favorites[name]);
    window.localStorage.setItem("yatrika-favorites", JSON.stringify(savedFavorites));
    try {
      // Notify other components in the same window to refresh their view
      window.dispatchEvent(new Event("yatrika:favorites-updated"));
    } catch (e) {
      // ignore in non-browser environments
    }
  }, [favorites]);

  const filteredPlaces = useMemo(() => {
    if (activeTab === "All") return places;
    return places.filter((place) => place.category === activeTab);
  }, [activeTab]);

  // Handle the firework trigger and local state toggle
  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>, name: string) => {
    const isNowFavorite = !favorites[name];
    setFavorites((prev) => ({ ...prev, [name]: isNowFavorite }));

    // If user is logged in with server token, sync wishlist to server
    try {
      if (typeof window !== "undefined") {
        const storedUser = window.localStorage.getItem("yatrika-user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          const token = parsed?.token;
          if (token) {
            if (isNowFavorite) {
              addToWishlist(token, name).catch(() => {});
            } else {
              removeFromWishlist(token, name).catch(() => {});
            }
          }
        }
      }
    } catch (err) {
      // ignore server sync failures; local state still persists
    }

    // Only set off fireworks if adding to favorites
    if (isNowFavorite) {
      const button = e.currentTarget;
      const particleCount = 10;
      const colors = ["#ff2a5f", "#ff7e40", "#ff007f", "#00f5d4", "#ffeb3b"];

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("span");
        particle.className =
          "absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full pointer-events-none firework-particle";

        // Calculate physics/vectors for the explosion spread
        const angle = (i / particleCount) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
        const distance = 35 + Math.random() * 25;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        particle.style.setProperty("--x", `${x}px`);
        particle.style.setProperty("--y", `${y}px`);
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        button.appendChild(particle);

        // Self-destruct particle elements after 1.2 seconds to prevent memory leaks
        setTimeout(() => {
          particle.remove();
        }, 1200);
      }
    }
  };

  const handleViewTrip = (place: Place) => {
    setSelectedPlace(place);
    if (typeof window !== "undefined") {
      const current = Number(window.localStorage.getItem("yatrika-destinations-viewed") || "0");
      window.localStorage.setItem("yatrika-destinations-viewed", String(current + 1));
      window.dispatchEvent(new Event("yatrika:trip-viewed"));
    }
  };

  const handleBuildPlan = (place: Place) => {
    openAssistant({
      prompt: `Build a 4 day itinerary for ${place.name}, ${place.region}. Keep it ${place.crowd.toLowerCase()} and practical for a first-time traveler.`,
    });
  };

  return (
    <section
      id="trending"
      className="relative overflow-hidden py-24 px-6"
      style={{ background: "#e0f2fe" }}
    >
      {/* Dynamic Global Inject CSS for Custom Prism Sheen and Particle Animation */}
      <style>{`
        .prism-badge {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1.5px solid transparent;
          background-image: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.1)), 
                            linear-gradient(135deg, rgba(255,0,128,0.35), rgba(0,255,255,0.35), rgba(255,255,0,0.35));
          background-origin: border-box;
          background-clip: padding-box, border-box;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.4);
        }
        .firework-particle {
          animation: burst 1s cubic-bezier(0.1, 0.8, 0.25, 1) forwards;
        }
        @keyframes burst {
          0% {
            transform: translate(-50%, -50%) translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(var(--x), var(--y)) scale(0);
            opacity: 0;
          }
        }
      `}</style>

      <div className="mx-auto max-w-7xl relative">
        <div className="flex flex-col gap-6 pb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-700 mb-3">
              Picked for you · AI curated
            </p>
            <h2 className="font-display text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl md:text-6xl">
              Trending{" "}
              <em className="italic bg-linear-to-r from-slate-900/52 via-amber-300/12 to-slate-900/65 bg-clip-text text-transparent">
                right
              </em>{" "}
              now
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-slate-950 text-white shadow-lg shadow-slate-900/10"
                    : "bg-white/40 backdrop-blur-xl border border-white/50 text-slate-700 hover:bg-white/60"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPlaces.map((place) => {
            const isFavorite = !!favorites[place.name];
            return (
              <article
                key={place.name}
                className="group relative overflow-hidden rounded-4xl bg-white/55 border border-white/40 shadow-[0_28px_80px_rgba(15,23,42,0.12)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_32px_90px_rgba(15,23,42,0.18)]"
                style={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
              >
                <div className="absolute inset-x-6 top-10 h-40 rounded-full bg-sky-100/40 blur-3xl" />
                <div className="relative overflow-hidden">
                  <img
                    src={place.img}
                    alt={place.name}
                    loading="lazy"
                    className="h-80 w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/5" />
                  <div className="absolute inset-x-5 top-5 flex items-center justify-end">
                    {/* Interactive Firework Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => handleFavoriteClick(e, place.name)}
                      className={`relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 backdrop-blur-xl transition-all duration-100 active:scale-75 ${
                        isFavorite
                          ? "bg-white/90 text-rose-500 shadow-md scale-110"
                          : "bg-white/70 text-slate-700 hover:scale-110"
                      }`}
                      aria-pressed={isFavorite}
                    >
                      <Heart
                        className={`h-5 w-5 transition-transform duration-200 ${
                          isFavorite ? "fill-current scale-110 " : "stroke-current"
                        }`}
                      />
                    </button>
                  </div>
                  <div
                    className={`absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-md ${crowdColor[place.crowd]}`}
                  >
                    <Users className="h-3.5 w-3.5" /> {place.crowd}
                  </div>
                  <div className="absolute bottom-5 right-5 inline-flex items-center gap-1.5 rounded-full bg-white/75 px-3 py-1.5 text-xs font-bold text-slate-950 backdrop-blur-md">
                    <span>
                      {formatBudget(
                        place.rating >= 4.8 ? "High" : place.rating >= 4.6 ? "Medium" : "Low",
                      )}
                    </span>
                  </div>
                </div>
                <div className="relative z-10 px-6 pb-8 pt-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-display text-3xl font-semibold tracking-tight text-slate-950">
                        {place.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{place.region}</p>
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      {place.rating}
                    </div>
                  </div>
                  <div className="h-0.2 w-16 rounded-full bg-slate-200/50" />
                  <button
                    type="button"
                    onClick={() => handleViewTrip(place)}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98]"
                  >
                    <MapPin className="h-4 w-4" />
                    View trip
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {selectedPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="relative h-72">
              <img
                src={selectedPlace.img}
                alt={selectedPlace.name}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedPlace(null)}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-sm transition hover:bg-white"
                aria-label="Close trip details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 md:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-sky-700">
                  <MapPin className="h-4 w-4" />
                  {selectedPlace.region}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                  <Star className="h-4 w-4 fill-current" />
                  {selectedPlace.rating} rating
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                  <Users className="h-4 w-4" />
                  {selectedPlace.crowd}
                </span>
              </div>
              <h3 className="font-display text-4xl font-semibold text-slate-950">
                {selectedPlace.name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                A ready-to-plan shortlist pick for travelers who want strong scenery, local flavor,
                and enough flexibility to adjust the pace on the road.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  "Day 1: arrive and settle",
                  "Day 2: signature sights",
                  "Day 3: local food and slow time",
                ].map((step) => (
                  <div key={step} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    <CalendarDays className="mb-3 h-5 w-5 text-sky-600" />
                    {step}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => handleBuildPlan(selectedPlace)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <Sparkles className="h-4 w-4" />
                  Build itinerary
                </button>
                <button
                  type="button"
                  onClick={(event) => handleFavoriteClick(event, selectedPlace.name)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  <Heart className="h-4 w-4" />
                  {favorites[selectedPlace.name] ? "Saved" : "Save to wishlist"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
