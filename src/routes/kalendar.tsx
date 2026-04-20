import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
  addMonths,
  subMonths,
} from "date-fns";
import { cs } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ItemDialog } from "@/components/item-dialog";
import { useStore, useCategoryMap } from "@/lib/store";
import type { Item } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/kalendar")({ component: CalendarPage });

function CalendarPage() {
  const { data } = useStore();
  const cats = useCategoryMap();
  const [cursor, setCursor] = React.useState(() => new Date());
  const [dayOpen, setDayOpen] = React.useState<Date | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Item | null>(null);

  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const itemsByDate = React.useMemo(() => {
    const m = new Map<string, Item[]>();
    for (const it of data.items) {
      const k = it.expiryDate;
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(it);
    }
    return m;
  }, [data.items]);

  const today = new Date();
  const dayItems = dayOpen ? (itemsByDate.get(format(dayOpen, "yyyy-MM-dd")) ?? []) : [];

  return (
    <AppShell
      onNew={() => {
        setEditing(null);
        setEditOpen(true);
      }}
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Kalendář</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Klikni na den pro detail. Tečky barevně rozlišují kategorie.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" onClick={() => setCursor((c) => subMonths(c, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-[160px] text-center font-display text-lg font-semibold">
            {format(cursor, "LLLL yyyy", { locale: cs })}
          </div>
          <Button size="icon" variant="outline" onClick={() => setCursor((c) => addMonths(c, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setCursor(new Date())}>
            Dnes
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-7 border-b border-border bg-muted/30 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {["Po", "Út", "St", "Čt", "Pá", "So", "Ne"].map((d) => (
            <div key={d} className="px-2 py-2 text-center">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((d) => {
            const k = format(d, "yyyy-MM-dd");
            const items = itemsByDate.get(k) ?? [];
            const inMonth = isSameMonth(d, cursor);
            const isToday = isSameDay(d, today);
            return (
              <button
                key={k}
                onClick={() => setDayOpen(d)}
                className={cn(
                  "relative min-h-[88px] border-b border-r border-border p-2 text-left transition-colors hover:bg-accent/40",
                  !inMonth && "bg-muted/20 text-muted-foreground",
                )}
              >
                <div
                  className={cn(
                    "inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
                    isToday && "gradient-primary text-primary-foreground",
                  )}
                >
                  {format(d, "d")}
                </div>
                {items.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {items.slice(0, 4).map((it) => {
                      const cat = cats.get(it.categoryId);
                      return (
                        <span
                          key={it.id}
                          title={it.name}
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: `var(--${cat?.color ?? "cat-other"})` }}
                        />
                      );
                    })}
                    {items.length > 4 && (
                      <span className="text-[10px] text-muted-foreground">+{items.length - 4}</span>
                    )}
                  </div>
                )}
                {items.length > 0 && (
                  <div className="mt-1 hidden lg:block">
                    {items.slice(0, 2).map((it) => {
                      const cat = cats.get(it.categoryId);
                      return (
                        <div
                          key={it.id}
                          className="truncate rounded px-1 py-0.5 text-[11px]"
                          style={{
                            background: `color-mix(in oklab, var(--${cat?.color ?? "cat-other"}) 18%, transparent)`,
                            color: `var(--${cat?.color ?? "cat-other"})`,
                          }}
                        >
                          {it.name}
                        </div>
                      );
                    })}
                    {items.length > 2 && (
                      <div className="text-[10px] text-muted-foreground">
                        +{items.length - 2} dalších
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <Dialog open={!!dayOpen} onOpenChange={(v) => !v && setDayOpen(null)}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              {dayOpen && format(dayOpen, "EEEE d. MMMM yyyy", { locale: cs })}
            </DialogTitle>
          </DialogHeader>
          {dayItems.length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">V tento den nic nekončí.</p>
          ) : (
            <div className="space-y-2">
              {dayItems.map((it) => {
                const cat = cats.get(it.categoryId);
                return (
                  <button
                    key={it.id}
                    onClick={() => {
                      setEditing(it);
                      setEditOpen(true);
                      setDayOpen(null);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-accent/50"
                  >
                    <span
                      className="h-8 w-8 shrink-0 rounded-lg"
                      style={{
                        background: `color-mix(in oklab, var(--${cat?.color ?? "cat-other"}) 25%, transparent)`,
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{it.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {cat?.icon} {cat?.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ItemDialog open={editOpen} onOpenChange={setEditOpen} editing={editing} />
    </AppShell>
  );
}
