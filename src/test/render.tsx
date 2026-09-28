import { render, type RenderOptions } from "@testing-library/react";
import { createInstance } from "i18next";
import type { ReactElement, ReactNode } from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { Provider } from "react-redux";
import { createAppStore, type RootState } from "@/store";

function createTestI18n() {
  const i18n = createInstance();
  i18n.use(initReactI18next).init({
    lng: "fr",
    fallbackLng: "fr",
    ns: ["common", "auth", "subscription", "validation", "errors"],
    defaultNS: "common",
    resources: {},
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    parseMissingKeyHandler: (key) => key,
  });
  return i18n;
}

type Options = {
  preloadedState?: Partial<RootState>;
} & Omit<RenderOptions, "wrapper">;

export function renderWithProviders(
  ui: ReactElement,
  options: Options = {}
) {
  const { preloadedState, ...renderOptions } = options;
  const store = createAppStore(preloadedState);
  const i18n = createTestI18n();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
