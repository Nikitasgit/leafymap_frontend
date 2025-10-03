import HomeHeader from "@/components/home/HomeHeader";
import SuggestionsList from "@/components/home/SuggestionsList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "SpotLight - Découvrez les créateurs, artisans et lieux culturels près de chez vous",
  description:
    "SpotLight est la plateforme de mise en relation entre créateurs, artisans, responsables de lieux et passionnés d'art et de culture. Explorez une carte interactive, participez à des événements et entrez en contact avec les talents locaux.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "SpotLight - Découvrez les créateurs, artisans et lieux culturels",
    description:
      "SpotLight est la plateforme de mise en relation entre créateurs, artisans, responsables de lieux et passionnés d'art et de culture.",
    url: "https://your-domain.com",
    siteName: "SpotLight",
    images: [
      {
        url: "/logo/logo.svg",
        width: 120,
        height: 40,
        alt: "SpotLight Logo",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpotLight - Découvrez les créateurs, artisans et lieux culturels",
    description:
      "SpotLight est la plateforme de mise en relation entre créateurs, artisans, responsables de lieux et passionnés d'art et de culture.",
    images: ["/logo/logo.svg"],
  },
};

export default async function Home() {
  return (
    <>
      <HomeHeader />
      <SuggestionsList />
    </>
  );
}
