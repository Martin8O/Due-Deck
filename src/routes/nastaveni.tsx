import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { Download, Upload, Trash2, Plus, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { useStore } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/nastaveni")({ component: SettingsPage });

const COLOR_OPTIONS = [
  { value: "cat-electronics", label: "Modrá" },
  { value: "cat-contracts", label: "Tyrkysová" },
  { value: "cat-insurance", label: "Zelená" },
  { value: "cat-health", label: "Červená" },
  { value: "cat-services", label: "Oranžová" },
  { value: "cat-other", label: "Šedá" },
];

function SettingsPage() {
  const { data, exportJson, importJson, addCategory, updateCategory, deleteCategory } = useStore();
  const { theme, setTheme } = useTheme();
  const fileRef = React.useRef<HTMLInputElement>(null);

  const [newName, setNewName] = React.useState("");
  const [newIcon, setNewIcon] = React.useState("📌");
  const [newColor, setNewColor] = React.useState(COLOR_OPTIONS[0].value);

  const handleExport = () => {
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
    toast.success("Záloha stažena");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = importJson(String(reader.result));
      if (result.ok) toast.success("Záloha načtena");
      else toast.error("Chyba: " + result.error);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const addCat = () => {
    if (!newName.trim()) return;
    addCategory({ name: newName.trim(), icon: newIcon || "📌", color: newColor });
    setNewName("");
    setNewIcon("📌");
    toast.success("Kategorie přidána");
  };

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight">Nastavení</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vzhled, kategorie a záloha tvých dat.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Theme */}
        <Card title="Vzhled">
          <div className="flex gap-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
              className="flex-1 gap-2"
            >
              <Sun className="h-4 w-4" /> Světlý
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
              className="flex-1 gap-2"
            >
              <Moon className="h-4 w-4" /> Tmavý
            </Button>
          </div>
        </Card>

        {/* Backup */}
        <Card title="Záloha a obnovení">
          <p className="mb-4 text-sm text-muted-foreground">
            Data jsou uložena v prohlížeči. Doporučujeme pravidelně exportovat zálohu na disk.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" /> Exportovat (JSON)
            </Button>
            <Button variant="outline" onClick={() => fileRef.current?.click()} className="gap-2">
              <Upload className="h-4 w-4" /> Načíst zálohu
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleImport}
            />
          </div>
          <div className="mt-4 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            Aktuálně uloženo: <strong>{data.items.length}</strong> položek,{" "}
            <strong>{data.categories.length}</strong> kategorií.
          </div>
        </Card>

        {/* Categories */}
        <Card title="Kategorie" className="lg:col-span-2">
          <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_80px_180px_auto]">
            <div className="space-y-1">
              <Label className="text-xs">Název</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nová kategorie"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Ikona</Label>
              <Input value={newIcon} onChange={(e) => setNewIcon(e.target.value)} maxLength={2} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Barva</Label>
              <Select value={newColor} onValueChange={setNewColor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLOR_OPTIONS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      <span className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ background: `var(--${c.value})` }}
                        />
                        {c.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={addCat} className="w-full gap-1">
                <Plus className="h-4 w-4" /> Přidat
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {data.categories.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-lg"
                  style={{
                    background: `color-mix(in oklab, var(--${c.color}) 25%, transparent)`,
                  }}
                >
                  {c.icon}
                </span>
                <Input
                  className="flex-1"
                  value={c.name}
                  onChange={(e) => updateCategory(c.id, { name: e.target.value })}
                />
                {!c.builtIn && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      deleteCategory(c.id);
                      toast.success("Kategorie smazána");
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function Card({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={"rounded-2xl border border-border bg-card p-5 " + (className ?? "")}>
      <h2 className="mb-4 font-display text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}
