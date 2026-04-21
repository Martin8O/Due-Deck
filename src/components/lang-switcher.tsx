import { useI18n, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const FLAGS: Record<Lang, { flag: string; label: string }> = {
  cs: { flag: "🇨🇿", label: "CZ" },
  en: { flag: "🇬🇧", label: "EN" },
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
      {(Object.keys(FLAGS) as Lang[]).map((l) => {
        const active = lang === l;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={active}
            aria-label={FLAGS[l].label}
          >
            <span className="text-base leading-none">{FLAGS[l].flag}</span>
            <span>{FLAGS[l].label}</span>
          </button>
        );
      })}
    </div>
  );
}
