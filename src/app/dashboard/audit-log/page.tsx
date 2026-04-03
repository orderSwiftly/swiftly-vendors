import AuditLogOverviewClient from "@/components/audit-log/AuditLogOverviewClient";

export const metadata = {
  title: "Audit Log",
  description: "View audit logs for your stores",
};

export default function AuditLogPage() {
  return <AuditLogOverviewClient />;
}
