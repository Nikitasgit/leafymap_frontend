import AdminUserDetailContainer from "@/components/admin/AdminUserDetailContainer/AdminUserDetailContainer";
import ProtectedRoute from "@/components/common/ProtectedRoute";

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
