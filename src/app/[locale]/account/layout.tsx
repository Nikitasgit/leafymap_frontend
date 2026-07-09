import ProtectedRoute from "@/components/common/ProtectedRoute";

type AccountLayoutProps = {
  children: React.ReactNode;
};

export default function AccountLayout({ children }: AccountLayoutProps) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
