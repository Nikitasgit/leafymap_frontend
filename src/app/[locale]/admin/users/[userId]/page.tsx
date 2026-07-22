import AdminUserDetailContainer from "@/features/admin/components/adminUserDetailContainer";
import { ProtectedRoute } from "@/features/auth";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  return (
    <ProtectedRoute allowedRoles={["admin"]} redirectTo="/">
      <AdminUserDetailContainer userId={userId} />
    </ProtectedRoute>
  );
}
