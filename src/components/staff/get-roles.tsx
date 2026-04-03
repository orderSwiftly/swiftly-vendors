// src/components/staff/get-roles.tsx

"use client";

import { useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { getRoles, type Role } from "@/lib/access";

function RoleRow({ name, permissions }: Omit<Role, "id">) {
  return (
    <div className="flex flex-col gap-2 px-4 py-3.5 rounded-xl border border-gray-200 bg-(--txt-clr) hover:border-(--pry-clr)/20 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-(--pry-clr)/10 flex items-center justify-center shrink-0">
          <ShieldCheck size={15} className="text-(--pry-clr)" />
        </div>
        <p className="text-sm font-semibold text-(--pry-clr) sec-ff">{name}</p>
      </div>
      <div className="flex flex-wrap gap-1.5 pl-11">
        {permissions.map((perm) => (
          <span
            key={perm}
            className="text-xs px-2 py-0.5 rounded-md bg-(--pry-clr)/10 text-(--pry-clr)/80 font-medium sec-ff"
          >
            {perm.replace("__", ": ")}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function GetRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const data = await getRoles();
        setRoles(data);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to load roles."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 size={22} className="animate-spin text-(--pry-clr)" />
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <p className="text-sm text-(--pry-clr)/70 sec-ff text-center py-10">
        No roles found.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2 mb-20">
      <p className="text-sm text-(--pry-clr)/70 sec-ff mb-1">
        {roles.length} role{roles.length !== 1 ? "s" : ""} available
      </p>
      {roles.map((role) => (
        <RoleRow key={role.id} name={role.name} permissions={role.permissions} />
      ))}
    </div>
  );
}