import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { resolveCategoryColor } from "@/lib/category-color";

const PRESETS = [
  "#3b82f6", // blue
  "#06b6d4", // cyan
  "#10b981", // emerald
  "#84cc16", // lime
  "#eab308", // yellow
  "#f59e0b", // amber
  "#f97316", // orange
  "#ef4444", // red
  "#ec4899", // pink
  "#a855f7", // purple
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#14b8a6", // teal
  "#22c55e", // green
  "#64748b", // slate
  "#0f172a", // dark
];

export function ColorPicker({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const resolved = resolveCategoryColor(value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("h-10 w-full justify-start gap-2 font-normal", className)}
        >
          <span
            className="h-5 w-5 shrink-0 rounded-md border border-border"
            style={{ background: resolved }}
          />
          <span className="truncate text-xs text-muted-foreground">{value}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 space-y-3 p-3">
        <div>
          <div className="mb-2 text-xs font-medium text-muted-foreground">Předvolby</div>
          <div className="grid grid-cols-8 gap-1.5">
            {PRESETS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  onChange(c);
                  setOpen(false);
                }}
                className={cn(
                  "h-6 w-6 rounded-md border border-border transition-transform hover:scale-110",
                  value === c && "ring-2 ring-primary ring-offset-1 ring-offset-background",
                )}
                style={{ background: c }}
                aria-label={c}
              />
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground">Vlastní barva</div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={resolved.startsWith("#") ? resolved : "#3b82f6"}
              onChange={(e) => onChange(e.target.value)}
              className="h-9 w-12 cursor-pointer rounded-md border border-border bg-transparent p-1"
            />
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="h-9 flex-1 text-xs"
              placeholder="#3b82f6"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
