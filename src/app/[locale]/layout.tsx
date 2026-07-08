import "@/styles/main.scss";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ConditionalFooter from "@/components/common/Footer";
import Providers from "@/components/Providers";
import { roboto } from "@/fonts/font";
import Navbar from "@/components/navbar/Navbar";
import type { Metadata } from "next";
import { getDefaultMetadata } from "@/lib/pageMetadata";

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

  return (
    <html lang={locale}>
      <body className={roboto.className}>
        <Providers locale={locale}>
          <Analytics debug={false} />
          <SpeedInsights debug={false} />
          <Navbar />
          <main data-locale={locale}>{children}</main>
          <ConditionalFooter />
        </Providers>
      </body>
    </html>
  );
}
