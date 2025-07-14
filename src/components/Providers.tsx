"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import AppInitializer from "./initializers/AppInitializer";
import { Toaster } from "sonner";
import { LoadingProvider } from "./common/loading/LoadingProvider";
import { I18nextProvider } from "react-i18next";
import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { i18nConfig } from "@/i18nConfig";

interface ProvidersProps {
  children: React.ReactNode;
  locale?: string;
}

export default function Providers({ children, locale = "fr" }: ProvidersProps) {
  const [i18nInstance] = React.useState(() => {
    const instance = createInstance();
    instance.use(initReactI18next);
    instance.use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`../../public/locales/${language}/${namespace}.json`)
      )
    );

    instance.init({
      lng: locale,
      fallbackLng: i18nConfig.defaultLocale,
      supportedLngs: i18nConfig.locales,
      defaultNS: "common",
      fallbackNS: "common",
      ns: ["common", "subscription"],
      preload: i18nConfig.locales,
    });

    return instance;
  });

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18nInstance}>
        <LoadingProvider>
          <AppInitializer />
          {children}
          <Toaster
            position="bottom-right"
            richColors
            closeButton
            duration={3000}
            theme="light"
            expand={false}
            className="custom-toaster"
            toastOptions={{
              style: {
                background: "#ffffff",
                color: "#3a3a3a",
                border: "1px solid #e1e1e1",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                fontSize: "14px",
                fontWeight: "500",
                padding: "12px 16px",
                maxWidth: "320px",
              },
            }}
          />
        </LoadingProvider>
      </I18nextProvider>
    </Provider>
  );
}
