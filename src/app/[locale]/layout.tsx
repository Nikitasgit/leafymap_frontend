import "@/styles/main.scss";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/common/Footer";
import Providers from "@/components/Providers";
import { roboto } from "@/fonts/font";

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
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
