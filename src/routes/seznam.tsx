import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Plus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ItemDialog } from "@/components/item-dialog";
import { ItemCard } from "@/components/item-card";
import { useStore, useCategoryMap } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { getExpiryStatus, daysUntil, type Item } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/seznam")({ component: ListPage });

type StatusFilter = "all" | "expired" | "critical" | "soon" | "ok";
type SortKey = "expiryAsc" | "expiryDesc" | "nameAsc" | "createdDesc";

function ListPage() {
  const { data } = useStore();
  const cats = useCategoryMap();
  const { t } = useI18n();

  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState<string>("all");
  const [status, setStatus] = React.useState<StatusFilter>("all");
  const [sort, setSort] = React.useState<SortKey>("expiryAsc");
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Item | null>(null);

  const searchRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key.toLowerCase() === "n" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        setEditing(null);
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = React.useMemo(() => {
    type Entry = { item: Item; isOccurrence: boolean; key: string };
    const entries: Entry[] = data.items.map((it) => ({
      item: it,
      isOccurrence: false,
      key: it.id,
    }));

    // Build virtual recurring payment occurrences (future, up to expiry, max 24 months)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const horizon = new Date(today);
    horizon.setMonth(horizon.getMonth() + 24);

    for (const it of data.items) {
      if (!it.paymentDate || !it.recurring || it.recurring === "none") continue;
      const base = new Date(it.paymentDate + "T00:00:00");
      if (isNaN(base.getTime())) continue;
      const stepMonths =
        it.recurring === "monthly" ? 1 : it.recurring === "quarterly" ? 3 : 12;
      const expiry = new Date(it.expiryDate + "T00:00:00");
      // Walk forward from base date
      let cur = new Date(base);
      // Skip past occurrences
      while (cur < today) {
        cur = new Date(cur.getFullYear(), cur.getMonth() + stepMonths, base.getDate());
      }
      while (cur <= horizon && cur <= expiry) {
        const iso = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`;
        if (iso !== it.expiryDate) {
          entries.push({
            item: { ...it, expiryDate: iso },
            isOccurrence: true,
            key: `${it.id}-${iso}`,
          });
        }
        cur = new Date(cur.getFullYear(), cur.getMonth() + stepMonths, base.getDate());
      }
    }

    let arr = entries;
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (e) =>
          e.item.name.toLowerCase().includes(q) ||
          e.item.note?.toLowerCase().includes(q) ||
          e.item.tags?.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (category !== "all") arr = arr.filter((e) => e.item.categoryId === category);
    if (status !== "all") {
      arr = arr.filter((e) => {
        // Don't include recurring occurrences in the "expired" bucket
        if (e.isOccurrence && status === "expired") return false;
        const d = daysUntil(e.item.expiryDate);
        if (status === "expired") return d < 0;
        if (status === "critical") return d >= 0 && d <= 7;
        if (status === "soon") return d >= 0 && d <= 30; // includes "this week"
        if (status === "ok") return d > 30;
        return true;
      });
    }
    arr = [...arr].sort((a, b) => {
      switch (sort) {
        case "expiryAsc":
          return a.item.expiryDate.localeCompare(b.item.expiryDate);
        case "expiryDesc":
          return b.item.expiryDate.localeCompare(a.item.expiryDate);
        case "nameAsc":
          return a.item.name.localeCompare(b.item.name);
        case "createdDesc":
          return b.item.createdAt.localeCompare(a.item.createdAt);
      }
    });
    return arr;
  }, [data.items, search, category, status, sort]);

  return (
    <AppShell
      onNew={() => {
        setEditing(null);
        setOpen(true);
      }}
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">{t("list.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.filter((e) => !e.isOccurrence).length} {t("common.of")}{" "}
            {data.items.length} {t("common.items")}
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" /> {t("common.new_item")}
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchRef}
            placeholder={t("common.search")}
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("list.all_categories")}</SelectItem>
            {data.categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                <span className="mr-2">{c.icon}</span>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("list.all_statuses")}</SelectItem>
            <SelectItem value="expired">{t("status.expired")}</SelectItem>
            <SelectItem value="critical">{t("status.this_week")}</SelectItem>
            <SelectItem value="soon">{t("status.in_30_days")}</SelectItem>
            <SelectItem value="ok">{t("status.ok")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expiryAsc">{t("list.sort.expiry_asc")}</SelectItem>
            <SelectItem value="expiryDesc">{t("list.sort.expiry_desc")}</SelectItem>
            <SelectItem value="nameAsc">{t("list.sort.name_asc")}</SelectItem>
            <SelectItem value="createdDesc">{t("list.sort.created_desc")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">{t("list.empty")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((e) => (
            <ItemCard
              key={e.key}
              item={e.item}
              category={cats.get(e.item.categoryId)}
              onEdit={() => {
                const original = data.items.find((x) => x.id === e.item.id) ?? e.item;
                setEditing(original);
                setOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <ItemDialog open={open} onOpenChange={setOpen} editing={editing} />
    </AppShell>
  );
}
