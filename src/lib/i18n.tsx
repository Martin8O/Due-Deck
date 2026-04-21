import * as React from "react";
import { cs as csLocale, enUS as enLocale } from "date-fns/locale";
import type { Locale } from "date-fns";

export type Lang = "cs" | "en";

type Dict = Record<string, string>;

const cs: Dict = {
  // nav
  "nav.dashboard": "Přehled",
  "nav.list": "Seznam",
  "nav.calendar": "Kalendář",
  "nav.settings": "Nastavení",
  "app.subtitle": "Osobní správce",
  "app.title": "Termíny",
  // common
  "common.new_item": "Nová položka",
  "common.new": "Nová",
  "common.light_mode": "Světlý režim",
  "common.dark_mode": "Tmavý režim",
  "common.save": "Uložit",
  "common.cancel": "Zrušit",
  "common.add": "Přidat",
  "common.delete": "Smazat",
  "common.edit": "Upravit",
  "common.today": "Dnes",
  "common.loading": "Načítám…",
  "common.show_all": "Zobrazit vše",
  "common.search": "Hledat (zkratka /)…",
  "common.of": "z",
  "common.items": "položek",
  // status
  "status.expired": "Po termínu",
  "status.this_week": "Tento týden",
  "status.soon": "Brzy",
  "status.ok": "OK",
  "status.in_30_days": "Do 30 dnů",
  "status.active_total": "Aktivních celkem",
  // dashboard
  "dash.title": "Přehled",
  "dash.expired_h": "🔴 Po termínu",
  "dash.expired_sub": "Vyřešit hned",
  "dash.critical_h": "🟠 Tento týden končí",
  "dash.critical_sub": "Do 7 dnů",
  "dash.soon_h": "🟡 Brzy končí",
  "dash.soon_sub": "Do 30 dnů",
  "dash.no_upcoming": "Žádné blížící se termíny",
  "dash.no_upcoming_sub": "Nic nehoří v příštích 30 dnech. Užij si klid.",
  "dash.upcoming_week": "📅 Nadcházející týden",
  "dash.by_category": "📊 Podle kategorií",
  "dash.empty.title": "Začni přidáním první položky",
  "dash.empty.desc":
    "Záruka na elektroniku, smlouva s operátorem, pojistka, termín očkování — všechno na jednom místě.",
  "dash.empty.cta": "Přidat položku",
  // list
  "list.title": "Seznam položek",
  "list.all_categories": "Všechny kategorie",
  "list.all_statuses": "Všechny stavy",
  "list.empty": "Žádné položky neodpovídají filtrům.",
  "list.sort.expiry_asc": "Expirace ↑ (nejbližší první)",
  "list.sort.expiry_desc": "Expirace ↓",
  "list.sort.name_asc": "Název A–Z",
  "list.sort.created_desc": "Naposledy přidané",
  // calendar
  "cal.title": "Kalendář",
  "cal.desc": "Klikni na den pro detail. Tečky barevně rozlišují kategorie.",
  "cal.view.month": "Měsíc",
  "cal.view.year": "Rok",
  "cal.nothing": "V tento den nic nekončí.",
  // dialog
  "dlg.new": "Nová položka",
  "dlg.edit": "Upravit položku",
  "dlg.desc": "Záruka, smlouva, pojistka, termín — cokoliv s datem expirace.",
  "field.name": "Název *",
  "field.name_ph": "např. Notebook Lenovo",
  "field.category": "Kategorie *",
  "field.category_ph": "Vyber kategorii",
  "field.recurring": "Opakování",
  "rec.none": "Bez opakování",
  "rec.yearly": "Ročně",
  "rec.monthly": "Měsíčně",
  "field.start": "Datum pořízení / začátku",
  "field.expiry": "Datum expirace *",
  "field.price": "Cena",
  "field.currency": "Měna",
  "field.link": "Odkaz / příloha (URL)",
  "field.tags": "Štítky (oddělené čárkou)",
  "field.tags_ph": "byt, auto, práce",
  "field.note": "Poznámka",
  "date.pick": "Vyber datum",
  // validation
  "val.name": "Vyplň název",
  "val.category": "Vyber kategorii",
  "val.expiry": "Datum expirace je povinné",
  // settings
  "set.title": "Nastavení",
  "set.subtitle": "Vzhled, jazyk, kategorie a záloha tvých dat.",
  "set.appearance": "Vzhled",
  "set.light": "Světlý",
  "set.dark": "Tmavý",
  "set.language": "Jazyk",
  "set.backup": "Záloha a obnovení",
  "set.backup_desc":
    "Data jsou uložena v prohlížeči. Doporučujeme pravidelně exportovat zálohu na disk.",
  "set.export": "Exportovat (JSON)",
  "set.import": "Načíst zálohu",
  "set.stored": "Aktuálně uloženo:",
  "set.categories": "Kategorie",
  "set.cat.name": "Název",
  "set.cat.icon": "Ikona",
  "set.cat.color": "Barva",
  "set.cat.new": "Nová kategorie",
  "set.cat.added": "Kategorie přidána",
  "set.cat.deleted": "Kategorie smazána",
  "set.backup.saved": "Záloha stažena",
  "set.backup.loaded": "Záloha načtena",
  "set.backup.error": "Chyba: ",
  // relative
  "rel.today": "dnes",
  "rel.days_ago": "před {n} dny",
  "rel.in_days": "za {n} dní",
  // misc
  "misc.dash": "—",
  "misc.more_others": "+{n} dalších",
};

const en: Dict = {
  "nav.dashboard": "Dashboard",
  "nav.list": "List",
  "nav.calendar": "Calendar",
  "nav.settings": "Settings",
  "app.subtitle": "Personal manager",
  "app.title": "Deadlines",
  "common.new_item": "New item",
  "common.new": "New",
  "common.light_mode": "Light mode",
  "common.dark_mode": "Dark mode",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.add": "Add",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.today": "Today",
  "common.loading": "Loading…",
  "common.show_all": "Show all",
  "common.search": "Search (press /)…",
  "common.of": "of",
  "common.items": "items",
  "status.expired": "Overdue",
  "status.this_week": "This week",
  "status.soon": "Soon",
  "status.ok": "OK",
  "status.in_30_days": "Within 30 days",
  "status.active_total": "Active total",
  "dash.title": "Dashboard",
  "dash.expired_h": "🔴 Overdue",
  "dash.expired_sub": "Handle now",
  "dash.critical_h": "🟠 Ending this week",
  "dash.critical_sub": "Within 7 days",
  "dash.soon_h": "🟡 Ending soon",
  "dash.soon_sub": "Within 30 days",
  "dash.no_upcoming": "No upcoming deadlines",
  "dash.no_upcoming_sub": "Nothing urgent in the next 30 days. Enjoy the calm.",
  "dash.upcoming_week": "📅 Next week",
  "dash.by_category": "📊 By category",
  "dash.empty.title": "Start by adding your first item",
  "dash.empty.desc":
    "Electronics warranties, contracts, insurance, vaccination dates — all in one place.",
  "dash.empty.cta": "Add item",
  "list.title": "Items",
  "list.all_categories": "All categories",
  "list.all_statuses": "All statuses",
  "list.empty": "No items match the filters.",
  "list.sort.expiry_asc": "Expiry ↑ (soonest first)",
  "list.sort.expiry_desc": "Expiry ↓",
  "list.sort.name_asc": "Name A–Z",
  "list.sort.created_desc": "Recently added",
  "cal.title": "Calendar",
  "cal.desc": "Click a day for details. Dots are color-coded by category.",
  "cal.view.month": "Month",
  "cal.view.year": "Year",
  "cal.nothing": "Nothing ends on this day.",
  "dlg.new": "New item",
  "dlg.edit": "Edit item",
  "dlg.desc": "Warranty, contract, insurance, deadline — anything with an expiry date.",
  "field.name": "Name *",
  "field.name_ph": "e.g. Lenovo laptop",
  "field.category": "Category *",
  "field.category_ph": "Select category",
  "field.recurring": "Recurrence",
  "rec.none": "No recurrence",
  "rec.yearly": "Yearly",
  "rec.monthly": "Monthly",
  "field.start": "Purchase / start date",
  "field.expiry": "Expiry date *",
  "field.price": "Price",
  "field.currency": "Currency",
  "field.link": "Link / attachment (URL)",
  "field.tags": "Tags (comma separated)",
  "field.tags_ph": "home, car, work",
  "field.note": "Note",
  "date.pick": "Pick a date",
  "val.name": "Name is required",
  "val.category": "Select a category",
  "val.expiry": "Expiry date is required",
  "set.title": "Settings",
  "set.subtitle": "Appearance, language, categories and backup of your data.",
  "set.appearance": "Appearance",
  "set.light": "Light",
  "set.dark": "Dark",
  "set.language": "Language",
  "set.backup": "Backup & restore",
  "set.backup_desc":
    "Data is stored in your browser. We recommend exporting a backup to disk regularly.",
  "set.export": "Export (JSON)",
  "set.import": "Load backup",
  "set.stored": "Currently stored:",
  "set.categories": "Categories",
  "set.cat.name": "Name",
  "set.cat.icon": "Icon",
  "set.cat.color": "Color",
  "set.cat.new": "New category",
  "set.cat.added": "Category added",
  "set.cat.deleted": "Category deleted",
  "set.backup.saved": "Backup downloaded",
  "set.backup.loaded": "Backup loaded",
  "set.backup.error": "Error: ",
  "rel.today": "today",
  "rel.days_ago": "{n} days ago",
  "rel.in_days": "in {n} days",
  "misc.dash": "—",
  "misc.more_others": "+{n} more",
};

const DICTS: Record<Lang, Dict> = { cs, en };

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  locale: Locale;
}

const I18nContext = React.createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>("cs");

  React.useEffect(() => {
    const stored =
      typeof window !== "undefined" ? (window.localStorage.getItem("lang") as Lang | null) : null;
    if (stored === "cs" || stored === "en") setLangState(stored);
  }, []);

  const setLang = React.useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem("lang", l);
      document.documentElement.lang = l;
    } catch {}
  }, []);

  const value = React.useMemo<I18nCtx>(() => {
    const dict = DICTS[lang];
    const t = (key: string, vars?: Record<string, string | number>) => {
      let s = dict[key] ?? key;
      if (vars) {
        for (const k of Object.keys(vars)) {
          s = s.replace(`{${k}}`, String(vars[k]));
        }
      }
      return s;
    };
    return {
      lang,
      setLang,
      t,
      locale: lang === "cs" ? csLocale : enLocale,
    };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
