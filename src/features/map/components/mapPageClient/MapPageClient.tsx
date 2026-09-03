"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const MapPageContainer = dynamic(
  () => import("@/features/map/components/mapPageContainer"),
  {
    ssr: false,
    loading: () => (
      <div aria-hidden="true" style={{ minHeight: "calc(100vh - 60px)" }} />
    ),
  }
);

const MapPageClient = () => {
  return (
    <Suspense fallback={null}>
      <MapPageContainer />
    </Suspense>
  );
};

export default MapPageClient;
