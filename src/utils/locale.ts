export async function getLocale(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  return locale;
}
