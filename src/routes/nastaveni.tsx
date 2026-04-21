import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { Download, Upload, Trash2, Plus, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { useStore } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import { useI18n, type Lang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmojiPicker } from "@/components/emoji-picker";
import { ColorPicker } from "@/components/color-picker";
import { resolveCategoryColor, categorySurface } from "@/lib/category-color";

export const Route = createFileRoute("/nastaveni")({ component: SettingsPage });

function SettingsPage() {
  const { data, exportJson, importJson, addCategory, updateCategory, deleteCategory } = useStore();
  const { theme, setTheme } = useTheme();
  const { t, lang, setLang } = useI18n();
  const fileRef = React.useRef<HTMLInputElement>(null);

  const [newName, setNewName] = React.useState("");
  const [newIcon, setNewIcon] = React.useState("📌");
  const [newColor, setNewColor] = React.useState("#3b82f6");

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
    toast.success(t("set.backup.saved"));
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const addCat = () => {
    if (!newName.trim()) return;
    addCategory({ name: newName.trim(), icon: newIcon || "📌", color: newColor });
    setNewName("");
    setNewIcon("📌");
    setNewColor("#3b82f6");
    toast.success(t("set.cat.added"));
  };

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight">{t("set.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("set.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Theme */}
        <Card title={t("set.appearance")}>
          <div className="flex gap-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
              className="flex-1 gap-2"
            >
              <Sun className="h-4 w-4" /> {t("set.light")}
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
              className="flex-1 gap-2"
            >
              <Moon className="h-4 w-4" /> {t("set.dark")}
            </Button>
          </div>
        </Card>

        {/* Language */}
        <Card title={t("set.language")}>
          <div className="flex gap-2">
            {(["cs", "en"] as Lang[]).map((l) => (
              <Button
                key={l}
                variant={lang === l ? "default" : "outline"}
                onClick={() => setLang(l)}
                className="flex-1 gap-2"
              >
                <span className="text-base">{l === "cs" ? "🇨🇿" : "🇬🇧"}</span>
                {l === "cs" ? "Čeština" : "English"}
              </Button>
            ))}
          </div>
        </Card>

        {/* Backup */}
        <Card title={t("set.backup")} className="lg:col-span-2">
          <p className="mb-4 text-sm text-muted-foreground">{t("set.backup_desc")}</p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" /> {t("set.export")}
            </Button>
            <Button variant="outline" onClick={() => fileRef.current?.click()} className="gap-2">
              <Upload className="h-4 w-4" /> {t("set.import")}
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
            {t("set.stored")} <strong>{data.items.length}</strong> {t("common.items")},{" "}
            <strong>{data.categories.length}</strong>.
          </div>
        </Card>

        {/* Categories */}
        <Card title={t("set.categories")} className="lg:col-span-2">
          <div className="mb-4 grid grid-cols-1 items-end gap-2 sm:grid-cols-[1fr_90px_220px_auto]">
            <div className="space-y-1">
              <Label className="text-xs">{t("set.cat.name")}</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={t("set.cat.new")}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">{t("set.cat.icon")}</Label>
              <EmojiPicker value={newIcon} onChange={setNewIcon} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">{t("set.cat.color")}</Label>
              <ColorPicker value={newColor} onChange={setNewColor} />
            </div>
            <div>
              <Button onClick={addCat} className="h-10 w-full gap-1">
                <Plus className="h-4 w-4" /> {t("common.add")}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {data.categories.map((c) => (
              <div
                key={c.id}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-3"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl"
                  style={{ background: categorySurface(c.color, 25) }}
                >
                  {c.icon}
                </span>
                <div className="w-32 shrink-0">
                  <EmojiPicker
                    value={c.icon}
                    onChange={(icon) => updateCategory(c.id, { icon })}
                  />
                </div>
                <Input
                  className="flex-1 min-w-[120px]"
                  value={c.name}
                  onChange={(e) => updateCategory(c.id, { name: e.target.value })}
                />
                <div className="w-48 shrink-0">
                  <ColorPicker
                    value={c.color}
                    onChange={(color) => updateCategory(c.id, { color })}
                  />
                </div>
                {!c.builtIn && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      deleteCategory(c.id);
                      toast.success(t("set.cat.deleted"));
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
