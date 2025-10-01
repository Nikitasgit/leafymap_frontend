import "@/styles/main.scss";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ConditionalFooter from "@/components/common/Footer/ConditionalFooter";
import Providers from "@/components/Providers";
import { roboto } from "@/fonts/font";
import NavbarMain from "@/components/navbar/Navbar";

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
