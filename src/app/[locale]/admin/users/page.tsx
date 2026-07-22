import AdminUsersSearchContainer from "@/features/admin/components/adminUsersSearchContainer";
import { ProtectedRoute } from "@/features/auth";

export default function AdminUsersPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]} redirectTo="/">
      <AdminUsersSearchContainer />
    </ProtectedRoute>
  );
}
