import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Plus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ItemDialog } from "@/components/item-dialog";
import { ItemCard } from "@/components/item-card";
import { useStore, useCategoryMap } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { getExpiryStatus, type Item } from "@/lib/types";
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
    let arr = [...data.items];
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.note?.toLowerCase().includes(q) ||
          i.tags?.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (category !== "all") arr = arr.filter((i) => i.categoryId === category);
    if (status !== "all") arr = arr.filter((i) => getExpiryStatus(i.expiryDate) === status);
    arr.sort((a, b) => {
      switch (sort) {
        case "expiryAsc":
          return a.expiryDate.localeCompare(b.expiryDate);
        case "expiryDesc":
          return b.expiryDate.localeCompare(a.expiryDate);
        case "nameAsc":
          return a.name.localeCompare(b.name);
        case "createdDesc":
          return b.createdAt.localeCompare(a.createdAt);
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
            {filtered.length} {t("common.of")} {data.items.length} {t("common.items")}
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
          {filtered.map((it) => (
            <ItemCard
              key={it.id}
              item={it}
              category={cats.get(it.categoryId)}
              onEdit={(item) => {
                setEditing(item);
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
