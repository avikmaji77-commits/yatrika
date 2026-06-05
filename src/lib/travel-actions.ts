export type PlannerSearchDetail = {
  region?: string;
  category?: string;
  guests?: string;
  date?: string;
  source?: string;
};

export type ChatOpenDetail = {
  prompt?: string;
};

export type TripDetail = {
  name: string;
  region?: string;
  category?: string;
  rating?: number;
  crowd?: string;
  img?: string;
};

export const scrollToSection = (id: string) => {
  if (typeof window === "undefined") return;
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export const requestPlannerSearch = (detail: PlannerSearchDetail) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<PlannerSearchDetail>("yatrika:planner-search", { detail }));
  scrollToSection("planner");
};

export const openAssistant = (detail: ChatOpenDetail = {}) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<ChatOpenDetail>("yatrika:open-chat", { detail }));
};

export const openTripDetails = (detail: TripDetail) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<TripDetail>("yatrika:open-trip", { detail }));
};
