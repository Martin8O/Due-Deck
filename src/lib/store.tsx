import * as React from "react";
import { type AppData, type Category, type Item, DEFAULT_CATEGORIES } from "./types";

const STORAGE_KEY = "deadline-tracker-v1";

function loadInitial(): AppData {
  if (typeof window === "undefined") {
    return { version: 1, items: [], categories: DEFAULT_CATEGORIES };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { version: 1, items: [], categories: DEFAULT_CATEGORIES };
    const parsed = JSON.parse(raw) as AppData;
    return {
      version: 1,
      items: parsed.items ?? [],
      categories: parsed.categories?.length ? parsed.categories : DEFAULT_CATEGORIES,
    };
  } catch {
    return { version: 1, items: [], categories: DEFAULT_CATEGORIES };
  }
}

interface StoreContextValue {
  data: AppData;
  ready: boolean;
  addItem: (item: Omit<Item, "id" | "createdAt" | "updatedAt">) => Item;
  updateItem: (id: string, patch: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  addCategory: (cat: Omit<Category, "id" | "builtIn">) => Category;
  updateCategory: (id: string, patch: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  replaceAll: (data: AppData) => void;
  exportJson: () => string;
  importJson: (json: string) => { ok: true } | { ok: false; error: string };
}

const StoreContext = React.createContext<StoreContextValue | null>(null);

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<AppData>(() => ({
    version: 1,
    items: [],
    categories: DEFAULT_CATEGORIES,
  }));
  const [ready, setReady] = React.useState(false);

  // Load from localStorage on mount (client only)
  React.useEffect(() => {
    setData(loadInitial());
    setReady(true);
  }, []);

  // Persist
  React.useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* storage full */
    }
  }, [data, ready]);

  const value = React.useMemo<StoreContextValue>(() => {
    const addItem: StoreContextValue["addItem"] = (item) => {
      const now = new Date().toISOString();
      const created: Item = { ...item, id: uid(), createdAt: now, updatedAt: now };
      setData((d) => ({ ...d, items: [...d.items, created] }));
      return created;
    };
    const updateItem: StoreContextValue["updateItem"] = (id, patch) => {
      setData((d) => ({
        ...d,
        items: d.items.map((it) =>
          it.id === id ? { ...it, ...patch, updatedAt: new Date().toISOString() } : it,
        ),
      }));
    };
    const deleteItem: StoreContextValue["deleteItem"] = (id) => {
      setData((d) => ({ ...d, items: d.items.filter((it) => it.id !== id) }));
    };
    const addCategory: StoreContextValue["addCategory"] = (cat) => {
      const created: Category = { ...cat, id: uid() };
      setData((d) => ({ ...d, categories: [...d.categories, created] }));
      return created;
    };
    const updateCategory: StoreContextValue["updateCategory"] = (id, patch) => {
      setData((d) => ({
        ...d,
        categories: d.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      }));
    };
    const deleteCategory: StoreContextValue["deleteCategory"] = (id) => {
      setData((d) => {
        const cat = d.categories.find((c) => c.id === id);
        if (cat?.builtIn) return d;
        return {
          ...d,
          categories: d.categories.filter((c) => c.id !== id),
          items: d.items.map((it) => (it.categoryId === id ? { ...it, categoryId: "other" } : it)),
        };
      });
    };
    const replaceAll: StoreContextValue["replaceAll"] = (next) => setData(next);
    const exportJson = () => JSON.stringify(data, null, 2);
    const importJson: StoreContextValue["importJson"] = (json) => {
      try {
        const parsed = JSON.parse(json);
        if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.items)) {
          return { ok: false, error: "Neplatný formát JSON souboru." };
        }
        setData({
          version: 1,
          items: parsed.items,
          categories: parsed.categories?.length ? parsed.categories : DEFAULT_CATEGORIES,
        });
        return { ok: true };
      } catch (e) {
        return { ok: false, error: (e as Error).message };
      }
    };
    return {
      data,
      ready,
      addItem,
      updateItem,
      deleteItem,
      addCategory,
      updateCategory,
      deleteCategory,
      replaceAll,
      exportJson,
      importJson,
    };
  }, [data, ready]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function useCategoryMap() {
  const { data } = useStore();
  return React.useMemo(() => {
    const m = new Map<string, Category>();
    for (const c of data.categories) m.set(c.id, c);
    return m;
  }, [data.categories]);
}
