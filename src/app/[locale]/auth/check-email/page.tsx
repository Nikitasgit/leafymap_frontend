import CheckEmailMessage from "@/components/auth/checkEmailMessage";
import { getPageMetadata } from "@/lib/pageMetadata";

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
