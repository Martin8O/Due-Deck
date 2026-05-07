import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format, addDays, isSameDay } from "date-fns";
import { AlertCircle, Clock, CalendarClock, Sparkles, ArrowRight, Plus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ItemDialog } from "@/components/item-dialog";
import { ItemCard } from "@/components/item-card";
import { useStore, useCategoryMap } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { getExpiryStatus, type Item } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { resolveCategoryColor, categorySurface } from "@/lib/category-color";

export const Route = createFileRoute("/")({ component: DashboardPage });

function DashboardPage() {
  const { data, ready } = useStore();
  const cats = useCategoryMap();
  const { t, locale } = useI18n();
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Item | null>(null);

  const openNew = () => {
    setEditing(null);
    setOpen(true);
  };
  const openEdit = (it: Item) => {
    setEditing(it);
    setOpen(true);
  };

  const sorted = React.useMemo(
    () => [...data.items].sort((a, b) => a.expiryDate.localeCompare(b.expiryDate)),
    [data.items],
  );

  const expired = sorted.filter((i) => getExpiryStatus(i.expiryDate) === "expired");
  const critical = sorted.filter((i) => getExpiryStatus(i.expiryDate) === "critical");
  const soon = sorted.filter((i) => getExpiryStatus(i.expiryDate) === "soon");

  const today = new Date();
  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  const byCategory = data.categories.map((c) => ({
    cat: c,
    count: data.items.filter((i) => i.categoryId === c.id).length,
  }));

  return (
    <AppShell onNew={openNew}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {format(today, "EEEE d. MMMM yyyy", { locale })}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">
            {t("dash.title")}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/seznam">
              {t("common.show_all")} <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button onClick={openNew} className="gap-2">
            <Plus className="h-4 w-4" /> {t("common.new_item")}
          </Button>
        </div>
      </div>

      {!ready ? (
        <div className="text-sm text-muted-foreground">{t("common.loading")}</div>
      ) : data.items.length === 0 ? (
        <EmptyState onNew={openNew} />
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              label={t("status.expired")}
              value={expired.length}
              icon={<AlertCircle className="h-4 w-4" />}
              tone="danger"
            />
            <StatCard
              label={t("status.this_week")}
              value={critical.length}
              icon={<Clock className="h-4 w-4" />}
              tone="critical"
            />
            <StatCard
              label={t("status.in_30_days")}
              value={soon.length}
              icon={<CalendarClock className="h-4 w-4" />}
              tone="warning"
            />
            <StatCard
              label={t("status.active_total")}
              value={data.items.length}
              icon={<Sparkles className="h-4 w-4" />}
              tone="primary"
            />
          </div>

          {/* Two-column area */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              {expired.length > 0 && (
                <Section title={t("dash.expired_h")} subtitle={t("dash.expired_sub")}>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {expired.slice(0, 4).map((it) => (
                      <ItemCard
                        key={it.id}
                        item={it}
                        category={cats.get(it.categoryId)}
                        onEdit={openEdit}
                      />
                    ))}
                  </div>
                </Section>
              )}

              {critical.length > 0 && (
                <Section title={t("dash.critical_h")} subtitle={t("dash.critical_sub")}>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {critical.slice(0, 4).map((it) => (
                      <ItemCard
                        key={it.id}
                        item={it}
                        category={cats.get(it.categoryId)}
                        onEdit={openEdit}
                      />
                    ))}
                  </div>
                </Section>
              )}

              {soon.length > 0 && (
                <Section title={t("dash.soon_h")} subtitle={t("dash.soon_sub")}>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {soon.slice(0, 4).map((it) => (
                      <ItemCard
                        key={it.id}
                        item={it}
                        category={cats.get(it.categoryId)}
                        onEdit={openEdit}
                      />
                    ))}
                  </div>
                </Section>
              )}

              {expired.length === 0 && critical.length === 0 && soon.length === 0 && (
                <div className="rounded-xl border border-border bg-card p-8 text-center">
                  <div className="mb-2 text-4xl">🎉</div>
                  <h3 className="font-display text-lg font-semibold">
                    {t("dash.no_upcoming")}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("dash.no_upcoming_sub")}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <Section title={t("dash.upcoming_week")}>
                <div className="rounded-xl border border-border bg-card p-2">
                  {next7Days.map((d) => {
                    const dayItems = sorted.filter((i) =>
                      isSameDay(new Date(i.expiryDate + "T00:00:00"), d),
                    );
                    return (
                      <div
                        key={d.toISOString()}
                        className="flex items-start gap-3 rounded-lg px-3 py-2 hover:bg-accent/40"
                      >
                        <div className="w-12 shrink-0 text-center">
                          <div className="text-xs uppercase text-muted-foreground">
                            {format(d, "EEE", { locale })}
                          </div>
                          <div className="font-display text-lg font-semibold leading-none">
                            {format(d, "d")}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 py-1">
                          {dayItems.length === 0 ? (
                            <div className="text-xs text-muted-foreground">—</div>
                          ) : (
                            dayItems.map((it) => {
                              const cat = cats.get(it.categoryId);
                              return (
                                <button
                                  key={it.id}
                                  onClick={() => openEdit(it)}
                                  className="flex w-full items-center gap-2 truncate text-left text-sm hover:text-primary"
                                >
                                  <span
                                    className="h-2 w-2 shrink-0 rounded-full"
                                    style={{ background: resolveCategoryColor(cat?.color) }}
                                  />
                                  <span className="truncate">{it.name}</span>
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Section>

              <Section title={t("dash.by_category")}>
                <div className="space-y-2 rounded-xl border border-border bg-card p-3">
                  {byCategory.map(({ cat, count }) => (
                    <div key={cat.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </div>
                      <span
                        className="rounded-md px-2 py-0.5 text-xs font-semibold"
                        style={{
                          background: categorySurface(cat.color, 22),
                          color: resolveCategoryColor(cat.color),
                        }}
                      >
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          </div>
        </>
      )}

      <ItemDialog open={open} onOpenChange={setOpen} editing={editing} />
    </AppShell>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-end justify-between">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
      </div>
      {children}
    </section>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: "danger" | "critical" | "warning" | "primary";
}) {
  const tones: Record<string, string> = {
    danger:
      "from-danger/20 to-danger/5 text-danger dark:from-danger/30 dark:to-danger/10 dark:text-danger",
    critical:
      "from-destructive/20 to-destructive/5 text-destructive dark:from-destructive/30 dark:to-destructive/10 dark:text-destructive",
    warning:
      "from-warning/25 to-warning/5 text-warning-soft-foreground dark:from-warning/30 dark:to-warning/10",
    primary: "from-primary/20 to-primary/5 text-primary",
  };
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-gradient-to-br p-4",
        tones[tone],
      )}
    >
      <div className="flex items-center gap-2 text-xs font-semibold opacity-95">
        {icon}
        {label}
      </div>
      <div className="mt-2 font-display text-3xl font-bold text-foreground">{value}</div>
    </div>
  );
}

function EmptyState({ onNew }: { onNew: () => void }) {
  const { t } = useI18n();
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary text-primary-foreground">
        <Sparkles className="h-7 w-7" />
      </div>
      <h2 className="font-display text-xl font-semibold">{t("dash.empty.title")}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{t("dash.empty.desc")}</p>
      <Button onClick={onNew} className="mt-6 gap-2">
        <Plus className="h-4 w-4" /> {t("dash.empty.cta")}
      </Button>
    </div>
  );
}
