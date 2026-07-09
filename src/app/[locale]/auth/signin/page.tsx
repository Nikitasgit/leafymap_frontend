import SignInForm from "@/components/auth/signinForm";
import GuestOnlyRoute from "@/components/common/GuestOnlyRoute";
import { getPageMetadata } from "@/lib/pageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata("signin", locale);
}

export default function SignIn() {
  return (
    <GuestOnlyRoute>
      <SignInForm />
    </GuestOnlyRoute>
  );
}
