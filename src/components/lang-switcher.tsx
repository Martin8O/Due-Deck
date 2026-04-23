import { useI18n, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LABELS: Record<Lang, { short: string; full: string }> = {
  cs: { short: "CZ", full: "Čeština" },
  en: { short: "EN", full: "English" },
};

export function LangSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-card p-0.5 shadow-sm",
        className,
      )}
      role="group"
      aria-label="Language switcher"
    >
      {(Object.keys(LABELS) as Lang[]).map((l) => {
        const active = lang === l;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-all",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={active}
            title={LABELS[l].full}
          >
            {LABELS[l].short}
          </button>
        );
      })}
    </div>
  );
}
