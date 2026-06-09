import RegisterForm from "@/components/auth/registerForm";
import { getPageMetadata } from "@/lib/pageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata("register", locale);
}

export default function Register() {
  return <RegisterForm />;
}
