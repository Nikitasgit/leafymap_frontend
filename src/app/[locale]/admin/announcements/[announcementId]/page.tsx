import AdminAnnouncementFormContainer from "@/features/admin/components/adminAnnouncementFormContainer";
import { ProtectedRoute } from "@/features/auth";

export default async function AdminEditAnnouncementPage({
  params,
}: {
  params: Promise<{ announcementId: string }>;
}) {
  const { announcementId } = await params;

  return (
    <ProtectedRoute allowedRoles={["admin"]} redirectTo="/">
      <AdminAnnouncementFormContainer announcementId={announcementId} />
    </ProtectedRoute>
  );
}
