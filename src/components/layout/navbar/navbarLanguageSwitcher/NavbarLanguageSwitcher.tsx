"use client";

import { useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useCurrentLocale } from "next-i18n-router/client";
import { ChevronDown } from "lucide-react";
import { i18nConfig } from "@/i18nConfig";
import { getLocaleSwitchPath } from "@/shared/utils/i18n/getLocalizedPath";
import useOnClickOutside from "@/shared/hooks/useOnClickOutside";
import styles from "./NavbarLanguageSwitcher.module.scss";

const LOCALE_LABELS: Record<string, string> = {
  fr: "FR",
  en: "EN",
};

export default function NavbarLanguageSwitcher() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = useCurrentLocale(i18nConfig) ?? i18nConfig.defaultLocale;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const otherLocales = i18nConfig.locales.filter(
    (locale) => locale !== currentLocale
  );

  useOnClickOutside(wrapperRef, () => setIsOpen(false));

  const handleLocaleChange = (locale: string) => {
    const localizedPath = getLocaleSwitchPath(pathname, locale);
    const query = searchParams.toString();
    const href = query ? `${localizedPath}?${query}` : localizedPath;

    setIsOpen(false);
    router.push(href);
  };

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((open) => !open)}
        aria-label={t("navbar.languageSwitcherAriaLabel")}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{LOCALE_LABELS[currentLocale] ?? currentLocale.toUpperCase()}</span>
        <ChevronDown
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <ul className={styles.dropdown} role="listbox">
          {otherLocales.map((locale) => (
            <li key={locale} role="none">
              <button
                type="button"
                role="option"
                className={styles.option}
                onClick={() => handleLocaleChange(locale)}
              >
                {LOCALE_LABELS[locale] ?? locale.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
