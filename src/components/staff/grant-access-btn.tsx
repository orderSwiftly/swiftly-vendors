// src/components/staff/grant-access-btn.tsx
"use client";

import { useState } from "react";
import { Loader2, ShieldPlus, X, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { grantAccess, getRoles, type Role } from "@/lib/access";
import { getStores } from "@/lib/store";

interface Location {
  id: string;
  name: string;
  address: string;
  is_active: boolean;
}

interface Store {
  id: string;
  name: string;
  is_active: boolean;
  locations: Location[];
}

interface GrantAccessBtnProps {
  staffId: string;
  staffName: string;
  storeId?: string;
  onGranted?: () => void;
}

const LEVELS = ["Organization", "Store", "Location"];

export default function GrantAccessBtn({
  staffId,
  staffName,
  storeId: preselectedStoreId,
  onGranted,
}: Readonly<GrantAccessBtnProps>) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [stores, setStores] = useState<Store[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const [level, setLevel] = useState("");
  const [storeId, setStoreId] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");

  const openModal = async () => {
    setOpen(true);
    setFetching(true);
    try {
      const [storeData, roleData] = await Promise.all([getStores(), getRoles()]);
      setStores(storeData as Store[]);
      setRoles(roleData);
      if (preselectedStoreId) setStoreId(preselectedStoreId);
    } catch {
      toast.error("Failed to load stores or roles.");
      setOpen(false);
    } finally {
      setFetching(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setOpen(false);
    setLevel("");
    setStoreId("");
    setSelectedRoleId("");
  };

  const handleSubmit = async () => {
    if (!level) return toast.error("Please select an access level.");
    if (!storeId) return toast.error("Please select a store.");
    if (!selectedRoleId) return toast.error("Please select a role.");

    setLoading(true);
    try {
      await grantAccess(staffId, {
        level,
        store_id: storeId,
        role_ids: [selectedRoleId],
      });
      toast.success(`Access granted to ${staffName}.`);
      handleClose();
      onGranted?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to grant access.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-(--pry-clr)/10 text-(--pry-clr) text-xs font-semibold sec-ff hover:bg-(--pry-clr)/20 transition-colors"
      >
        <ShieldPlus size={13} />
        Grant Access
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={handleClose}
        >
          <div
            className="w-full max-w-md bg-(--txt-clr) rounded-2xl shadow-2xl p-6 flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-(--pry-clr) sec-ff">
                  Grant Access
                </h2>
                <p className="text-sm text-(--pry-clr)/70 sec-ff mt-0.5">
                  Assign a role and store to{" "}
                  <span className="font-semibold text-(--pry-clr)">{staffName}</span>
                </p>
              </div>
              <button
                onClick={handleClose}
                disabled={loading}
                className="p-1.5 rounded-lg hover:bg-(--pry-clr)/10 transition-colors text-(--pry-clr) disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {fetching ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 size={22} className="animate-spin text-(--pry-clr)" />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Level */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-(--pry-clr) sec-ff">
                    Access Level
                  </label>
                  <div className="relative">
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      disabled={loading}
                      className="w-full appearance-none px-3.5 py-2.5 rounded-xl border border-gray-400 bg-(--txt-clr) text-sm text-(--pry-clr) sec-ff focus:outline-none focus:border-(--pry-clr) transition-colors disabled:opacity-60 pr-9"
                    >
                      <option value="" disabled>Select level</option>
                      {LEVELS.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-(--pry-clr)/50 pointer-events-none" />
                  </div>
                </div>

                {/* Store */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-(--pry-clr) sec-ff">
                    Store
                  </label>
                  <div className="relative">
                    <select
                      value={storeId}
                      onChange={(e) => setStoreId(e.target.value)}
                      disabled={loading || !!preselectedStoreId}
                      className="w-full appearance-none px-3.5 py-2.5 rounded-xl border border-gray-400 bg-(--txt-clr) text-sm text-(--pry-clr) sec-ff focus:outline-none focus:border-(--pry-clr) transition-colors disabled:opacity-60 pr-9"
                    >
                      <option value="" disabled>Select store</option>
                      {stores.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-(--pry-clr)/50 pointer-events-none" />
                  </div>
                </div>

                {/* Role */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-(--pry-clr) sec-ff">
                    Role
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {roles.map((role) => {
                      const selected = selectedRoleId === role.id;
                      return (
                        <button
                          key={role.id}
                          onClick={() => setSelectedRoleId(role.id)}
                          disabled={loading}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold sec-ff transition-colors disabled:opacity-50 ${
                            selected
                              ? "bg-(--pry-clr) text-white"
                              : "bg-(--pry-clr)/10 text-(--pry-clr) hover:bg-(--pry-clr)/20"
                          }`}
                        >
                          {role.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            {!fetching && (
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl border border-gray-400 text-sm font-semibold text-(--pry-clr) sec-ff hover:bg-(--pry-clr)/10 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-(--pry-clr) text-white text-sm font-semibold sec-ff hover:bg-(--pry-clr)/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Granting…
                    </>
                  ) : (
                    "Grant Access"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}