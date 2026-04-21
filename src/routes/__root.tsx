import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { ThemeProvider } from "@/lib/theme";
import { StoreProvider } from "@/lib/store";
import { I18nProvider } from "@/lib/i18n";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Stránka nenalezena</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tato stránka neexistuje nebo byla přesunuta.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Zpět na přehled
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Termíny — osobní správce expirací" },
      {
        name: "description",
        content:
          "Offline správce záruk, smluv, pojištění a osobních termínů. Funguje lokálně v prohlížeči.",
      },
      { property: "og:title", content: "Termíny — osobní správce expirací" },
      { property: "og:description", content: "Nikdy už nezapomeň důležitý termín. Platnost záruky, termíny plateb, očkování - to vše na jednom místě." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Termíny — osobní správce expirací" },
      { name: "description", content: "Nikdy už nezapomeň důležitý termín. Platnost záruky, termíny plateb, očkování - to vše na jednom místě." },
      { name: "twitter:description", content: "Nikdy už nezapomeň důležitý termín. Platnost záruky, termíny plateb, očkování - to vše na jednom místě." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/50c0e0f4-d8de-43b9-bcba-c9014f54590b/id-preview-897b463d--98b02abc-bd31-4082-8975-653e3bb4972c.lovable.app-1776695029705.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/50c0e0f4-d8de-43b9-bcba-c9014f54590b/id-preview-897b463d--98b02abc-bd31-4082-8975-653e3bb4972c.lovable.app-1776695029705.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <StoreProvider>
          <Outlet />
          <Toaster richColors position="top-right" />
        </StoreProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
