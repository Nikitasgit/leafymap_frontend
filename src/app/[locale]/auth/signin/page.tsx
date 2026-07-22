import { SigninForm, GuestOnlyRoute } from "@/features/auth";
import { getPageMetadata } from "@/app/lib/pageMetadata";

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
      <SigninForm />
    </GuestOnlyRoute>
  );
}
