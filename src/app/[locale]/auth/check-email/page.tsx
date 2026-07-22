import { CheckEmailMessage } from "@/features/auth";
import { getPageMetadata } from "@/app/lib/pageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata("checkEmail", locale);
}

export default function CheckEmail() {
  return <CheckEmailMessage />;
}
