import AuditLogPageClient from "@/components/audit-log/AuditLogPageClient";

interface Params {
  id: string;
}

interface PageProps {
  params: Promise<Params>;
}

export const metadata = {
  title: "Audit Log Details",
  description: "View detailed audit logs for store",
};

export default async function AuditLogDetailPage({ params }: PageProps) {
  const { id } = await params;

  return <AuditLogPageClient storeId={id} />;
}
