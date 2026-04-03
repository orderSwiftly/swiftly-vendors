"use client";

import { useCallback, useState } from "react";
import GetStaff from "./get-staff";
import GetRoles from "./get-roles";
import InviteStaff from "./invite-staff";

export default function StaffCard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleInvited = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Staff section */}
      <div className="rounded-2xl bg-(--txt-clr) p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-(--pry-clr) sec-ff">Staff</h2>
            <p className="text-sm text-(--pry-clr)/70 sec-ff mt-0.5">
              Manage your team members
            </p>
          </div>
          <InviteStaff variant="button-only" onInvited={handleInvited} />
        </div>
        <GetStaff key={refreshKey} />
      </div>

      {/* Roles section */}
      <div className="rounded-2xl bg-(--txt-clr) p-6 flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-bold text-(--pry-clr) sec-ff">Roles</h2>
          <p className="text-sm text-(--pry-clr)/70 sec-ff mt-0.5">
            Permissions available in your organization
          </p>
        </div>
        <GetRoles />
      </div>
    </div>
  );
}