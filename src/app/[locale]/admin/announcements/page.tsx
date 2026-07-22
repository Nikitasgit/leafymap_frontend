import AdminAnnouncementsContainer from "@/features/admin/components/adminAnnouncementsContainer";
import { ProtectedRoute } from "@/features/auth";

export default function AdminAnnouncementsPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]} redirectTo="/">
      <AdminAnnouncementsContainer />
    </ProtectedRoute>
  );
}
