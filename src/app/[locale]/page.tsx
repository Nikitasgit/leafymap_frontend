import initTranslations from "../i18n";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ["common"]);

  return (
    <main>
      <h1>{t("hello")}</h1>
    </main>
  );
}
