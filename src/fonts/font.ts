import { Roboto } from "next/font/google";

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  // The homepage LCP is an image. Preloading every weight competes with it.
  preload: false,
  adjustFontFallback: true,
});
