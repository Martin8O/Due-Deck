import * as React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ListChecks,
  CalendarDays,
  Settings,
  Sun,
  Moon,
  Plus,
  Download,
  Upload,
  Heart,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { LangSwitcher } from "@/components/lang-switcher";

export function AppShell({
  children,
  onNew,
}: {
  children: React.ReactNode;
  onNew?: () => void;
}) {
  const location = useLocation();
  const { theme, toggle } = useTheme();
  const { t } = useI18n();
  const { exportJson, importJson } = useStore();
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [aboutOpen, setAboutOpen] = React.useState(false);

  const handleExport = React.useCallback(() => {
    const json = exportJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zaloha-terminy-${format(new Date(), "yyyy-MM-dd")}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success(t("set.backup.saved"));
  }, [exportJson, t]);

  const handleImport = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const result = importJson(String(reader.result));
        if (result.ok) toast.success(t("set.backup.loaded"));
        else toast.error(t("set.backup.error") + result.error);
      };
      reader.readAsText(file);
      e.target.value = "";
    },
    [importJson, t],
  );

  const NAV = [
    { to: "/", labelKey: "nav.dashboard", icon: LayoutDashboard },
    { to: "/seznam", labelKey: "nav.list", icon: ListChecks },
    { to: "/kalendar", labelKey: "nav.calendar", icon: CalendarDays },
    { to: "/nastaveni", labelKey: "nav.settings", icon: Settings },
  ] as const;

  const BackupButtons = (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleImport}
      />
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start gap-2"
        onClick={handleExport}
        title={t("backup.save_tip")}
      >
        <Download className="h-4 w-4" /> {t("backup.save")}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start gap-2"
        onClick={() => fileRef.current?.click()}
        title={t("backup.load_tip")}
      >
        <Upload className="h-4 w-4" /> {t("backup.load")}
      </Button>
    </>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        {/* Sidebar (desktop) */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-sidebar px-4 py-6 lg:flex">
          <div className="mb-8 flex items-center gap-2 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary text-primary-foreground shadow-md">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-base font-semibold leading-tight">
                {t("app.title")}
              </div>
              <div className="text-xs text-muted-foreground">{t("app.subtitle")}</div>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            {NAV.map(({ to, labelKey, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/60",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t(labelKey)}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 space-y-2 border-t border-border pt-4">
            <div className="px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t("backup.title")}
            </div>
            {BackupButtons}
          </div>

          <div className="mt-auto space-y-2 pt-6">
            {onNew && (
              <Button onClick={onNew} className="w-full gap-2" size="sm">
                <Plus className="h-4 w-4" /> {t("common.new_item")}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={toggle}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === "dark" ? t("common.light_mode") : t("common.dark_mode")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={() => setAboutOpen(true)}
            >
              <Info className="h-4 w-4" />
              {t("about.button")}
            </Button>
            <a
              href="https://github.com/Martin8O"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 px-2 pt-2 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              Vibecoded by{" "}
              <span className="font-semibold underline-offset-2 hover:underline">Martin</span>{" "}
              with <Heart className="h-3 w-3 fill-primary text-primary" /> Lovable
            </a>
          </div>
        </aside>

        {/* Mobile top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
              <CalendarDays className="h-4 w-4" />
            </div>
            <div className="font-display text-sm font-semibold">{t("app.title")}</div>
          </div>
          <div className="flex items-center gap-1">
            <LangSwitcher />
            <Button
              size="icon"
              variant="outline"
              onClick={handleExport}
              title={t("backup.save")}
              aria-label={t("backup.save")}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => fileRef.current?.click()}
              title={t("backup.load")}
              aria-label={t("backup.load")}
            >
              <Upload className="h-4 w-4" />
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleImport}
            />
            {onNew && (
              <Button size="sm" onClick={onNew} className="gap-1">
                <Plus className="h-4 w-4" /> {t("common.new")}
              </Button>
            )}
            <Button size="icon" variant="outline" onClick={toggle}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8 lg:py-8">
          {/* Desktop top-right toolbar with language switcher */}
          <div className="mb-4 hidden justify-end lg:flex">
            <LangSwitcher />
          </div>
          {children}
          {/* Mobile credit footer */}
          <div className="mt-10 flex justify-center lg:hidden">
            <a
              href="https://github.com/Martin8O"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              Vibecoded by{" "}
              <span className="font-semibold underline-offset-2 hover:underline">Martin</span>{" "}
              with <Heart className="h-3 w-3 fill-primary text-primary" /> Lovable
            </a>
          </div>
        </main>

        {/* Mobile bottom nav */}
        <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-border bg-background/95 backdrop-blur lg:hidden">
          {NAV.map(({ to, labelKey, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {t(labelKey)}
              </Link>
            );
          })}
        </nav>
        <div className="h-16 lg:hidden" />
      </div>

      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("about.title")}</DialogTitle>
            <DialogDescription>{t("about.intro")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-display font-semibold">{t("about.local_h")}</h3>
              <p className="mt-1 text-muted-foreground">{t("about.local_b")}</p>
            </section>
            <section>
              <h3 className="font-display font-semibold">{t("about.privacy_h")}</h3>
              <p className="mt-1 text-muted-foreground">{t("about.privacy_b")}</p>
            </section>
            <section>
              <h3 className="font-display font-semibold">{t("about.security_h")}</h3>
              <p className="mt-1 text-muted-foreground">{t("about.security_b")}</p>
            </section>
            <section>
              <h3 className="font-display font-semibold">{t("about.disclaimer_h")}</h3>
              <p className="mt-1 text-muted-foreground">{t("about.disclaimer_b")}</p>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
