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
  addYears,
  subYears,
  startOfYear,
} from "date-fns";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ItemDialog } from "@/components/item-dialog";
import { useStore, useCategoryMap } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import type { Item } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { resolveCategoryColor, categorySurface } from "@/lib/category-color";

export const Route = createFileRoute("/kalendar")({ component: CalendarPage });

type View = "month" | "year";

function CalendarPage() {
  const { data } = useStore();
  const cats = useCategoryMap();
  const { t, locale, lang } = useI18n();
  const [cursor, setCursor] = React.useState(() => new Date());
  const [view, setView] = React.useState<View>("month");
  const [dayOpen, setDayOpen] = React.useState<Date | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Item | null>(null);

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

  const weekdaysShort =
    lang === "cs"
      ? ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"]
      : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  return (
    <AppShell
      onNew={() => {
        setEditing(null);
        setEditOpen(true);
      }}
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">{t("cal.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("cal.desc")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
            <button
              type="button"
              onClick={() => setView("month")}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                view === "month"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t("cal.view.month")}
            </button>
            <button
              type="button"
              onClick={() => setView("year")}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                view === "year"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t("cal.view.year")}
            </button>
          </div>

          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="outline"
              onClick={() =>
                setCursor((c) => (view === "month" ? subYears(c, 1) : subYears(c, 1)))
              }
              title="−1 rok"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            {view === "month" && (
              <Button
                size="icon"
                variant="outline"
                onClick={() => setCursor((c) => subMonths(c, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="min-w-[160px] text-center font-display text-lg font-semibold">
              {view === "month"
                ? format(cursor, "LLLL yyyy", { locale })
                : format(cursor, "yyyy")}
            </div>
            {view === "month" && (
              <Button
                size="icon"
                variant="outline"
                onClick={() => setCursor((c) => addMonths(c, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="icon"
              variant="outline"
              onClick={() =>
                setCursor((c) => (view === "month" ? addYears(c, 1) : addYears(c, 1)))
              }
              title="+1 rok"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" onClick={() => setCursor(new Date())}>
            {t("common.today")}
          </Button>
        </div>
      </div>

      {view === "month" ? (
        <MonthGrid
          cursor={cursor}
          itemsByDate={itemsByDate}
          cats={cats}
          today={today}
          weekdays={weekdaysShort}
          onDayClick={setDayOpen}
        />
      ) : (
        <YearGrid
          year={cursor.getFullYear()}
          itemsByDate={itemsByDate}
          cats={cats}
          today={today}
          weekdays={weekdaysShort}
          onDayClick={(d) => {
            setCursor(d);
            setDayOpen(d);
          }}
          onMonthClick={(d) => {
            setCursor(d);
            setView("month");
          }}
          locale={locale}
        />
      )}

      <Dialog open={!!dayOpen} onOpenChange={(v) => !v && setDayOpen(null)}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              {dayOpen && format(dayOpen, "EEEE d. MMMM yyyy", { locale })}
            </DialogTitle>
          </DialogHeader>
          {dayItems.length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">{t("cal.nothing")}</p>
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
                      style={{ background: categorySurface(cat?.color, 25) }}
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

function MonthGrid({
  cursor,
  itemsByDate,
  cats,
  today,
  weekdays,
  onDayClick,
}: {
  cursor: Date;
  itemsByDate: Map<string, Item[]>;
  cats: ReturnType<typeof useCategoryMap>;
  today: Date;
  weekdays: string[];
  onDayClick: (d: Date) => void;
}) {
  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="grid grid-cols-7 border-b border-border bg-muted/30 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {weekdays.map((d) => (
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
              onClick={() => onDayClick(d)}
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
                        style={{ background: resolveCategoryColor(cat?.color) }}
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
                          background: categorySurface(cat?.color, 18),
                          color: resolveCategoryColor(cat?.color),
                        }}
                      >
                        {it.name}
                      </div>
                    );
                  })}
                  {items.length > 2 && (
                    <div className="text-[10px] text-muted-foreground">
                      +{items.length - 2}
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function YearGrid({
  year,
  itemsByDate,
  cats,
  today,
  weekdays,
  onDayClick,
  onMonthClick,
  locale,
}: {
  year: number;
  itemsByDate: Map<string, Item[]>;
  cats: ReturnType<typeof useCategoryMap>;
  today: Date;
  weekdays: string[];
  onDayClick: (d: Date) => void;
  onMonthClick: (d: Date) => void;
  locale: Locale;
}) {
  const yearStart = startOfYear(new Date(year, 0, 1));
  const months = Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i));

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {months.map((m) => (
        <MiniMonth
          key={m.toISOString()}
          month={m}
          itemsByDate={itemsByDate}
          cats={cats}
          today={today}
          weekdays={weekdays}
          onDayClick={onDayClick}
          onTitleClick={() => onMonthClick(m)}
          locale={locale}
        />
      ))}
    </div>
  );
}

type Locale = ReturnType<typeof useI18n>["locale"];

function MiniMonth({
  month,
  itemsByDate,
  cats,
  today,
  weekdays,
  onDayClick,
  onTitleClick,
  locale,
}: {
  month: Date;
  itemsByDate: Map<string, Item[]>;
  cats: ReturnType<typeof useCategoryMap>;
  today: Date;
  weekdays: string[];
  onDayClick: (d: Date) => void;
  onTitleClick: () => void;
  locale: Locale;
}) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <button
        type="button"
        onClick={onTitleClick}
        className="mb-2 w-full text-left font-display text-sm font-semibold capitalize hover:text-primary"
      >
        {format(month, "LLLL", { locale })}
      </button>
      <div className="grid grid-cols-7 text-[9px] font-medium uppercase text-muted-foreground">
        {weekdays.map((d) => (
          <div key={d} className="py-0.5 text-center">
            {d.slice(0, 1)}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((d) => {
          const k = format(d, "yyyy-MM-dd");
          const items = itemsByDate.get(k) ?? [];
          const inMonth = isSameMonth(d, month);
          const isToday = isSameDay(d, today);
          const hasEvents = items.length > 0;
          const firstColor = hasEvents
            ? resolveCategoryColor(cats.get(items[0].categoryId)?.color)
            : undefined;
          return (
            <button
              key={k}
              onClick={(e) => {
                e.stopPropagation();
                onDayClick(d);
              }}
              className={cn(
                "relative flex aspect-square items-center justify-center rounded text-[10px] transition-colors",
                !inMonth && "text-muted-foreground/40",
                inMonth && !hasEvents && "hover:bg-accent",
                isToday && "font-bold ring-1 ring-primary",
                hasEvents && "font-semibold text-foreground",
              )}
              style={
                hasEvents
                  ? {
                      background: `color-mix(in oklab, ${firstColor} 25%, transparent)`,
                    }
                  : undefined
              }
              title={hasEvents ? items.map((i) => i.name).join(", ") : undefined}
            >
              {format(d, "d")}
              {items.length > 1 && (
                <span className="absolute right-0 top-0 text-[7px] text-muted-foreground">
                  •{items.length}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
