import AdminAnnouncementFormContainer from "@/features/admin/components/adminAnnouncementFormContainer";
import { ProtectedRoute } from "@/features/auth";

export default function AdminNewAnnouncementPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]} redirectTo="/">
      <AdminAnnouncementFormContainer />
    </ProtectedRoute>
  );
}
