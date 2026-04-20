import * as React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, ListChecks, CalendarDays, Settings, Sun, Moon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Přehled", icon: LayoutDashboard },
  { to: "/seznam", label: "Seznam", icon: ListChecks },
  { to: "/kalendar", label: "Kalendář", icon: CalendarDays },
  { to: "/nastaveni", label: "Nastavení", icon: Settings },
] as const;

export function AppShell({
  children,
  onNew,
}: {
  children: React.ReactNode;
  onNew?: () => void;
}) {
  const location = useLocation();
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        {/* Sidebar (desktop) */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border bg-sidebar px-4 py-6 lg:block">
          <div className="mb-8 flex items-center gap-2 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary text-primary-foreground shadow-md">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-base font-semibold leading-tight">Termíny</div>
              <div className="text-xs text-muted-foreground">Osobní správce</div>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            {NAV.map(({ to, label, icon: Icon }) => {
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
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto" />
          <div className="absolute bottom-6 left-4 right-4 space-y-2">
            {onNew && (
              <Button onClick={onNew} className="w-full gap-2" size="sm">
                <Plus className="h-4 w-4" /> Nová položka
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={toggle}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === "dark" ? "Světlý režim" : "Tmavý režim"}
            </Button>
          </div>
        </aside>

        {/* Mobile top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
              <CalendarDays className="h-4 w-4" />
            </div>
            <div className="font-display text-sm font-semibold">Termíny</div>
          </div>
          <div className="flex items-center gap-2">
            {onNew && (
              <Button size="sm" onClick={onNew} className="gap-1">
                <Plus className="h-4 w-4" /> Nová
              </Button>
            )}
            <Button size="icon" variant="outline" onClick={toggle}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-border bg-background/95 backdrop-blur lg:hidden">
          {NAV.map(({ to, label, icon: Icon }) => {
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
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="h-16 lg:hidden" />
      </div>
    </div>
  );
}
