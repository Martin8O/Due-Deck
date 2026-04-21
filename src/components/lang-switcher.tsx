import { useI18n, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const FLAGS: Record<Lang, { label: string; svg: React.ReactNode }> = {
  cs: {
    label: "Čeština",
    svg: (
      <svg viewBox="0 0 60 40" className="h-5 w-7 rounded-sm shadow-sm" aria-hidden>
        <rect width="60" height="20" y="0" fill="#ffffff" />
        <rect width="60" height="20" y="20" fill="#d7141a" />
        <polygon points="0,0 30,20 0,40" fill="#11457e" />
      </svg>
    ),
  },
  en: {
    label: "English (US)",
    svg: (
      <svg viewBox="0 0 60 40" className="h-5 w-7 rounded-sm shadow-sm" aria-hidden>
        <rect width="60" height="40" fill="#b22234" />
        {[1, 3, 5, 7, 9, 11].map((i) => (
          <rect key={i} y={i * (40 / 13)} width="60" height={40 / 13} fill="#ffffff" />
        ))}
        <rect width="26" height={40 / 13 * 7} fill="#3c3b6e" />
      </svg>
    ),
  },
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
              "flex items-center justify-center rounded-full p-1.5 transition-all",
              active
                ? "bg-primary/10 ring-2 ring-primary"
                : "opacity-60 hover:opacity-100",
            )}
            aria-pressed={active}
            aria-label={FLAGS[l].label}
            title={FLAGS[l].label}
          >
            {FLAGS[l].svg}
          </button>
        );
      })}
    </div>
  );
}
