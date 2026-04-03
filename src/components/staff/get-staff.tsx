// src/components/staff/get-staff.tsx

"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { getStaffs, type StaffMember } from "@/lib/staff";
import GrantAccessBtn from "./grant-access-btn";

function StatusBadge({ is_active }: Readonly<{ is_active: boolean }>) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium sec-ff px-2 py-0.5 rounded-md ${
        is_active
          ? "text-emerald-500 bg-emerald-500/10"
          : "text-(--pry-clr)/60 bg-(--pry-clr)/10"
      }`}
    >
      {is_active ? <CheckCircle size={12} /> : <XCircle size={12} />}
      {is_active ? "Active" : "Inactive"}
    </span>
  );
}

function AccessBadge({ label }: Readonly<{ label: string }>) {
  return (
    <span className="inline-block text-xs px-2 py-0.5 rounded-md bg-(--pry-clr)/10 text-(--pry-clr) font-medium sec-ff">
      {label}
    </span>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function GetStaff() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const data = await getStaffs();
      setStaff(data);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to load staff members."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 size={22} className="animate-spin text-(--pry-clr)" />
      </div>
    );
  }

  if (staff.length === 0) {
    return (
      <p className="text-sm text-(--pry-clr)/70 sec-ff text-center py-10">
        No staff members yet. Invite someone to get started.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-(--pry-clr)/70 sec-ff">
        {staff.length} member{staff.length !== 1 ? "s" : ""} on your team
      </p>

      {/* ── Desktop table ── */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-400">
        <table className="w-full text-sm sec-ff">
          <thead>
            <tr className="border-b border-gray-400 bg-(--pry-clr)/5">
              <th className="text-left px-4 py-3 text-xs font-semibold text-(--pry-clr)/60 uppercase tracking-wide">
                Name
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-(--pry-clr)/60 uppercase tracking-wide">
                Email
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-(--pry-clr)/60 uppercase tracking-wide">
                Access Level
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-(--pry-clr)/60 uppercase tracking-wide">
                Store Name
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-(--pry-clr)/60 uppercase tracking-wide">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-(--pry-clr)/60 uppercase tracking-wide">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member, i) => (
              <tr
                key={member.id}
                className={`transition-colors hover:bg-(--pry-clr)/5 ${
                  i !== staff.length - 1 ? "border-b border-gray-400/50" : ""
                }`}
              >
                {/* Name */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-(--pry-clr)/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-(--pry-clr)">
                        {getInitials(member.name)}
                      </span>
                    </div>
                    <span className="font-medium text-(--pry-clr) truncate max-w-[140px]">
                      {member.name}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td className="px-4 py-3 text-(--pry-clr)/70 truncate max-w-[180px]">
                  {member.email}
                </td>

                {/* Access Level */}
                <td className="px-4 py-3">
                  {member.access ? (
                    <AccessBadge label={member.access.level} />
                  ) : (
                    <span className="text-(--pry-clr)/40 text-xs sec-ff">N/A</span>
                  )}
                </td>

                {/* Store */}
                <td className="px-4 py-3">
                  {member.access ? (
                    <AccessBadge label={member.access.store.name} />
                  ) : (
                    <span className="text-(--pry-clr)/40 text-xs sec-ff">N/A</span>
                  )}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <StatusBadge is_active={member.is_active} />
                </td>

                {/* Action */}
                <td className="px-4 py-3">
                  <GrantAccessBtn
                    staffId={member.id}
                    staffName={member.name}
                    onGranted={fetchStaff}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ── */}
      <div className="flex flex-col gap-2 md:hidden sec-ff">
        {staff.map((member) => (
          <div
            key={member.id}
            className="rounded-xl border border-gray-200 bg-(--txt-clr) p-4 flex flex-col gap-3"
          >
            {/* Top row: avatar + name + status */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-(--pry-clr)/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-(--pry-clr)">
                    {getInitials(member.name)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-(--pry-clr) truncate">
                    {member.name}
                  </p>
                  <p className="text-xs text-(--pry-clr)/70 truncate">
                    {member.email}
                  </p>
                </div>
              </div>
              <StatusBadge is_active={member.is_active} />
            </div>

            {/* Access row */}
            {member.access && (
              <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-gray-400/40">
                <span className="text-xs text-(--pry-clr)/50">Access:</span>
                <AccessBadge label={member.access.level} />
                <AccessBadge label={member.access.store.name} />
              </div>
            )}

            {/* Action row */}
            <div className="pt-1 border-t border-gray-400/40">
              <GrantAccessBtn
                staffId={member.id}
                staffName={member.name}
                onGranted={fetchStaff}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}