// src/components/staff/grant-access-btn.tsx
"use client";

import { useState } from "react";
import { Loader2, ShieldPlus, X } from "lucide-react";
import { toast } from "sonner";
import { grantAccess, getRoles, type Role, type GrantAccessBody } from "@/lib/access";
import { getStores, type Store } from "@/lib/store";

interface GrantAccessBtnProps {
  staffId: string;
  staffName: string;
  storeId?: string;
  onGranted?: () => void;
}

const LEVELS = ["Organization", "Store", "Location"] as const;
type Level = typeof LEVELS[number];

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

  const [level, setLevel] = useState<Level | "">("");
  const [storeId, setStoreId] = useState(preselectedStoreId ?? "");
  const [locationId, setLocationId] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");

  // derived — the store object for the selected store (to get its locations)
  const selectedStore = stores.find((s) => s.id === storeId) ?? null;

  const openModal = async () => {
    setOpen(true);
    setFetching(true);
    try {
      const [storeData, roleData] = await Promise.all([getStores(), getRoles()]);
      setStores(storeData);
      setRoles(roleData);
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
    setStoreId(preselectedStoreId ?? "");
    setLocationId("");
    setSelectedRoleId("");
  };

  const handleLevelChange = (l: Level) => {
    setLevel(l);
    // reset dependent fields when level changes
    setStoreId(preselectedStoreId ?? "");
    setLocationId("");
  };

  const handleSubmit = async () => {
    if (!level) return toast.error("Please select an access level.");
    if (!selectedRoleId) return toast.error("Please select a role.");
    if (level === "Store" && !storeId) return toast.error("Please select a store.");
    if (level === "Location" && !locationId) return toast.error("Please select a location.");

    let grant: GrantAccessBody;

    if (level === "Organization") {
      grant = { level: "Organization", role_ids: [selectedRoleId] };
    } else if (level === "Store") {
      grant = { level: "Store", store_id: storeId, role_ids: [selectedRoleId] };
    } else {
      grant = { level: "Location", location_id: locationId, role_ids: [selectedRoleId] };
    }

    setLoading(true);
    try {
      await grantAccess(staffId, grant);
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
            className="w-full max-w-md bg-(--txt-clr) rounded-2xl shadow-2xl p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-(--pry-clr) sec-ff">Grant Access</h2>
                <p className="text-sm text-(--pry-clr)/70 sec-ff mt-0.5">
                  Assign a role to{" "}
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
              <div className="flex flex-col gap-5">

                {/* Step 1 — Level */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-(--pry-clr) sec-ff">
                    Access Level
                  </label>
                  <div className="flex gap-2">
                    {LEVELS.map((l) => (
                      <button
                        key={l}
                        onClick={() => handleLevelChange(l)}
                        disabled={loading}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold sec-ff border transition-colors disabled:opacity-50 ${
                          level === l
                            ? "bg-(--pry-clr) text-white border-(--pry-clr)"
                            : "border-gray-200 text-(--pry-clr)/60 hover:border-(--pry-clr)/30 hover:text-(--pry-clr)"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2 — Store (only for Store or Location level) */}
                {(level === "Store" || level === "Location") && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-(--pry-clr) sec-ff">
                      Store
                    </label>
                    <div className="flex flex-col gap-2">
                      {stores.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            setStoreId(s.id);
                            setLocationId(""); // reset location when store changes
                          }}
                          disabled={loading || !!preselectedStoreId}
                          className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm sec-ff transition-colors disabled:opacity-60 ${
                            storeId === s.id
                              ? "border-(--pry-clr) bg-(--pry-clr)/5 text-(--pry-clr) font-medium"
                              : "border-gray-200 text-(--pry-clr)/60 hover:border-(--pry-clr)/30"
                          }`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3 — Location (only for Location level, and only if a store is selected) */}
                {level === "Location" && storeId && selectedStore && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-(--pry-clr) sec-ff">
                      Location
                      <span className="text-(--pry-clr)/40 font-normal ml-1">
                        — within {selectedStore.name}
                      </span>
                    </label>
                    {selectedStore.locations.length === 0 ? (
                      <p className="text-xs text-(--pry-clr)/50 sec-ff">
                        No locations found for this store.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {selectedStore.locations.map((loc) => (
                          <button
                            key={loc.id}
                            onClick={() => setLocationId(loc.id)}
                            disabled={loading}
                            className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm sec-ff transition-colors disabled:opacity-60 ${
                              locationId === loc.id
                                ? "border-(--pry-clr) bg-(--pry-clr)/5 text-(--pry-clr) font-medium"
                                : "border-gray-200 text-(--pry-clr)/60 hover:border-(--pry-clr)/30"
                            }`}
                          >
                            <p className="font-medium text-(--pry-clr)">{loc.name}</p>
                            <p className="text-xs text-(--pry-clr)/50 mt-0.5">{loc.address}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4 — Role */}
                {level && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-(--pry-clr) sec-ff">Role</label>
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
                )}
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