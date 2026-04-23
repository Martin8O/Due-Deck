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
    label: "English (GB)",
    svg: (
      <svg viewBox="0 0 60 40" className="h-5 w-7 rounded-sm shadow-sm" aria-hidden>
        <rect width="60" height="40" fill="#012169" />
        <path d="M0,0 L60,40 M60,0 L0,40" stroke="#ffffff" strokeWidth="8" />
        <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="3" />
        <rect x="25" width="10" height="40" fill="#ffffff" />
        <rect y="15" width="60" height="10" fill="#ffffff" />
        <rect x="27" width="6" height="40" fill="#C8102E" />
        <rect y="17" width="60" height="6" fill="#C8102E" />
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
