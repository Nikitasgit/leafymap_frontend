import { ProtectedRoute } from "@/features/auth";

type AccountLayoutProps = {
  children: React.ReactNode;
};

export default function AccountLayout({ children }: AccountLayoutProps) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
