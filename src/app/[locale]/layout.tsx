import { Suspense } from "react";
import "@/shared/styles/main.scss";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ConditionalFooter from "@/shared/ui/footer";
import Providers from "@/components/Providers";
import { roboto } from "@/fonts/font";
import Navbar from "@/components/layout/navbar/navbar";
import type { Metadata } from "next";
import { getDefaultMetadata } from "@/app/lib/pageMetadata";
import initTranslations from "@/app/i18n";
import { i18nNamespaces } from "@/i18nConfig";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getDefaultMetadata(locale);
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { resources } = await initTranslations(locale, [...i18nNamespaces]);

  return (
    <html lang={locale}>
      <body className={roboto.className}>
        <Providers key={locale} locale={locale} resources={resources}>
          <Suspense fallback={null}>
            <Analytics debug={false} />
            <SpeedInsights debug={false} />
            <Navbar />
            <main data-locale={locale}>{children}</main>
            <ConditionalFooter />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
