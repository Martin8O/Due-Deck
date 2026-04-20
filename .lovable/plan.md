
## 📋 Osobní správce termínů a expirací

Moderní webová aplikace pro správu nákupů, záruk, smluv, služeb a osobních termínů. Funguje **plně offline** v prohlížeči.

### 🎯 Hlavní funkce

**1. Dashboard (úvodní obrazovka)**
- Widget "🔴 Po termínu" — položky, které už expirovaly
- Widget "🟠 Tento týden končí" — kritické termíny do 7 dnů
- Widget "🟡 Brzy končí" — termíny do 30 dnů
- Widget "📊 Statistiky" — počet aktivních položek dle kategorií
- Widget "📅 Nadcházející týden" — časová osa nejbližších událostí

**2. Správa položek**
- Přidání / úprava / smazání položky
- Pole: **název, kategorie, datum pořízení/začátku, datum expirace, cena (volitelné), poznámka, příloha-odkaz** (volitelné)
- Kategorie s ikonami a barvami:
  - 🛒 **Nákupy elektroniky** (záruka)
  - 📄 **Smlouvy** (mobil, internet, energie…)
  - 🛡️ **Pojištění** (domácnost, auto, životní…)
  - 💉 **Zdraví** (očkování, prohlídky…)
  - 🔧 **Služby** (předplatná, členství…)
  - 📌 **Ostatní termíny** (vlastní)
- Možnost přidat **vlastní kategorie**

**3. Seznam s filtry**
- Zobrazení všech položek v přehledné tabulce/kartách
- Filtry: kategorie, stav (aktivní / brzy končí / expirované), vyhledávání podle názvu
- Řazení: podle data expirace, abecedy, data přidání
- Barevné označení podle blízkosti expirace (zelená → žlutá → oranžová → červená)

**4. Měsíční kalendář**
- Klasický měsíční pohled
- Šipky pro skrolování měsíců do minulosti i budoucnosti (+ skok na "dnes")
- **Dny s expirací zvýrazněné** barevnou tečkou podle kategorie (více teček = více událostí)
- Klik na den → modal s detailem všech událostí toho dne
- Klik na položku v detailu → otevře editaci

**5. Záloha a obnovení**
- Tlačítko **"⬇️ Exportovat zálohu (JSON)"** — stáhne soubor `zaloha-terminy-YYYY-MM-DD.json`
- Tlačítko **"⬆️ Načíst ze zálohy"** — naimportuje JSON soubor
- Doporučení: pravidelně si zálohu uložit na disk / cloud
- Volitelně: **import z Excelu** (.xlsx) pro převod tvé stávající tabulky

**6. UI / UX**
- Přepínač **světlý / tmavý režim** (pamatuje si volbu)
- Moderní minimalistický design (čisté linie, jemné stíny, příjemná typografie)
- Plně responzivní (desktop primárně, ale funguje i na mobilu)
- Klávesové zkratky: `N` = nová položka, `/` = vyhledávání, `Esc` = zavřít modal

### 🛠️ Technické řešení (offline)

- Vše v jednom buildu — stačí spustit lokálně, **bez připojení k internetu**
- Data v `localStorage` prohlížeče (rychlé, automatické)
- Záloha přes export/import JSON souboru (ruční, ale spolehlivé)
- Žádné servery, žádné účty, žádné cloudy — 100% tvoje data zůstávají u tebe

### 📦 Struktura aplikace

- `/` — Dashboard
- `/seznam` — Seznam všech položek s filtry
- `/kalendar` — Měsíční kalendář
- `/nastaveni` — Kategorie, záloha/obnovení, vzhled

### 💡 Bonus návrhy navíc

- **Opakující se termíny** — např. roční pojistka se po vypršení automaticky posune o rok
- **Tagy** — vlastní štítky pro křížové filtrování (např. „byt", „auto", „práce")
- **Tisk přehledu** — vytisknout/uložit jako PDF seznam položek expirujících příští měsíc
