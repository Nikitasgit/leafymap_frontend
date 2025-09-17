import { Inter } from "next/font/google";
import "@/styles/main.scss";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/components/navbar/Navbar";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <Providers locale={locale}>
          <Analytics />
          <SpeedInsights />
          <Navbar />
          <main data-locale={locale}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
