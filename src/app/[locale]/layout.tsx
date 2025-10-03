import "@/styles/main.scss";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ConditionalFooter from "@/components/common/Footer/ConditionalFooter";
import Providers from "@/components/Providers";
import { roboto } from "@/fonts/font";
import NavbarMain from "@/components/navbar/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SpotLight",
  description:
    "SpotLight - Découvrez les créateurs, artisans et lieux culturels où que vous soyez",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

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
          <NavbarMain />
          <main data-locale={locale}>{children}</main>
          <ConditionalFooter />
        </Providers>
      </body>
    </html>
  );
}
