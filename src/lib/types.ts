export type CategoryId = string;

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  color: string; // CSS var name like "cat-electronics"
  builtIn?: boolean;
}

export interface Item {
  id: string;
  name: string;
  categoryId: CategoryId;
  startDate?: string; // ISO date YYYY-MM-DD
  expiryDate: string; // ISO date YYYY-MM-DD
  price?: number;
  currency?: string;
  note?: string;
  link?: string;
  tags?: string[];
  recurring?: "none" | "yearly" | "monthly" | "quarterly";
  /** Day of payment for recurring items (ISO YYYY-MM-DD). Repeats by `recurring` frequency. */
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppData {
  version: 1;
  items: Item[];
  categories: Category[];
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "electronics", name: "Nákupy elektroniky", icon: "🛒", color: "cat-electronics", builtIn: true },
  { id: "contracts", name: "Smlouvy", icon: "📄", color: "cat-contracts", builtIn: true },
  { id: "insurance", name: "Pojištění", icon: "🛡️", color: "cat-insurance", builtIn: true },
  { id: "health", name: "Zdraví", icon: "💉", color: "cat-health", builtIn: true },
  { id: "services", name: "Služby", icon: "🔧", color: "cat-services", builtIn: true },
  { id: "other", name: "Ostatní", icon: "📌", color: "cat-other", builtIn: true },
];

export type ExpiryStatus = "expired" | "critical" | "soon" | "ok";

export function getExpiryStatus(expiryDate: string, now: Date = new Date()): ExpiryStatus {
  const d = new Date(expiryDate + "T00:00:00");
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.floor((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "expired";
  if (diffDays <= 7) return "critical";
  if (diffDays <= 30) return "soon";
  return "ok";
}

export function daysUntil(expiryDate: string, now: Date = new Date()): number {
  const d = new Date(expiryDate + "T00:00:00");
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
