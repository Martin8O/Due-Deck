import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { ExternalLink, Pencil } from "lucide-react";
import type { Item, Category } from "@/lib/types";
import { daysUntil, getExpiryStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const statusStyles: Record<ReturnType<typeof getExpiryStatus>, { label: string; cls: string }> = {
  expired: { label: "Po termínu", cls: "bg-danger/15 text-danger border-danger/30" },
  critical: { label: "Tento týden", cls: "bg-destructive/10 text-destructive border-destructive/30" },
  soon: { label: "Brzy", cls: "bg-warning/15 text-warning-foreground border-warning/40" },
  ok: { label: "OK", cls: "bg-success/15 text-success-foreground border-success/30" },
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

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md",
      )}
    >
      <div
        className="absolute inset-y-0 left-0 w-1"
        style={{ background: `var(--${category?.color ?? "cat-other"})` }}
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
              {s.label}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {format(new Date(item.expiryDate + "T00:00:00"), "d. M. yyyy", { locale: cs })}
              {" · "}
              {days < 0
                ? `před ${Math.abs(days)} dny`
                : days === 0
                  ? "dnes"
                  : `za ${days} dní`}
            </span>
          </div>

          {(item.price !== undefined || item.tags?.length) && (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {item.price !== undefined && (
                <span>
                  {item.price.toLocaleString("cs-CZ")} {item.currency ?? "Kč"}
                </span>
              )}
              {item.tags?.map((t) => (
                <span key={t} className="rounded bg-muted px-1.5 py-0.5">
                  #{t}
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
