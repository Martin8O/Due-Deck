import { format } from "date-fns";
import { ExternalLink, Pencil } from "lucide-react";
import type { Item, Category } from "@/lib/types";
import { daysUntil, getExpiryStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { resolveCategoryColor } from "@/lib/category-color";

const statusStyles: Record<ReturnType<typeof getExpiryStatus>, { labelKey: string; cls: string }> =
  {
    expired: {
      labelKey: "status.expired",
      cls: "bg-danger/15 text-danger border-danger/40 dark:bg-danger/20 dark:text-danger-foreground dark:border-danger/50",
    },
    critical: {
      labelKey: "status.this_week",
      cls: "bg-destructive/15 text-destructive border-destructive/40 dark:bg-destructive/25 dark:text-destructive-foreground dark:border-destructive/50",
    },
    soon: {
      labelKey: "status.soon",
      cls: "bg-warning-soft text-warning-soft-foreground border-warning/50 font-semibold",
    },
    ok: {
      labelKey: "status.ok",
      cls: "bg-success-soft text-success-soft-foreground border-success/50 font-semibold",
    },
  };

export function ItemCard({
  item,
  category,
  onEdit,
}: {
  item: Item;
  category?: Category;
  onEdit: (item: Item) => void;
}) {
  const status = getExpiryStatus(item.expiryDate);
  const days = daysUntil(item.expiryDate);
  const s = statusStyles[status];
  const { t, locale } = useI18n();

  const relText =
    days < 0
      ? t("rel.days_ago", { n: Math.abs(days) })
      : days === 0
        ? t("rel.today")
        : t("rel.in_days", { n: days });

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md",
      )}
    >
      <div
        className="absolute inset-y-0 left-0 w-1"
        style={{ background: resolveCategoryColor(category?.color) }}
      />
      <div className="flex items-start justify-between gap-3 pl-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{category?.icon}</span>
            <span className="truncate">{category?.name ?? "—"}</span>
          </div>
          <h3 className="mt-1 truncate font-display text-base font-semibold">{item.name}</h3>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={cn("border", s.cls)}>
              {t(s.labelKey)}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {format(new Date(item.expiryDate + "T00:00:00"), "d. M. yyyy", { locale })}
              {" · "}
              {relText}
            </span>
          </div>

          {(item.price !== undefined || item.tags?.length) && (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {item.price !== undefined && (
                <span>
                  {item.price.toLocaleString(locale.code)} {item.currency ?? "Kč"}
                </span>
              )}
              {item.tags?.map((tag) => (
                <span key={tag} className="rounded bg-muted px-1.5 py-0.5">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {item.note && (
            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{item.note}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-1">
          <Button size="icon" variant="ghost" onClick={() => onEdit(item)}>
            <Pencil className="h-4 w-4" />
          </Button>
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
