import AdminUsersSearchContainer from "@/components/admin/AdminUsersSearchContainer/AdminUsersSearchContainer";
import ProtectedRoute from "@/components/common/ProtectedRoute";

export default function AdminUsersPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]} redirectTo="/">
      <AdminUsersSearchContainer />
    </ProtectedRoute>
  );
}
