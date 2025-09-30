"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const ConditionalFooter = () => {
  const pathname = usePathname();

  const hideFooter = pathname?.includes("/map");

  if (hideFooter) {
    return null;
  }

  return <Footer />;
};

export default ConditionalFooter;
