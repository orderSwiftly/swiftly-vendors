"use client";

import { useState } from "react";
import { UserPlus, X, Mail, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { inviteStaff } from "@/lib/staff";

interface InviteStaffProps {
  onInvited?: () => void;
  variant?: "empty-state" | "button-only";
}

export default function InviteStaff({
  onInvited,
  variant = "empty-state",
}: Readonly<InviteStaffProps>) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Please fill in both fields.");
      return;
    }

    setLoading(true);
    try {
      await inviteStaff({ name: form.name.trim(), email: form.email.trim() });
      toast.success(`Invite sent to ${form.email}`);
      setForm({ name: "", email: "" });
      setOpen(false);
      onInvited?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send invite.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setForm({ name: "", email: "" });
    setOpen(false);
  };

  return (
    <>
      {variant === "empty-state" ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 rounded-2xl border border-dashed border-gray-400 bg-(--sec-clr)">
          <div className="w-14 h-14 rounded-full bg-(--pry-clr)/10 flex items-center justify-center">
            <UserPlus size={24} className="text-(--pry-clr)" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-(--pry-clr) sec-ff">
              No staff members yet
            </p>
            <p className="text-sm text-(--pry-clr)/70 mt-1 sec-ff">
              Invite your first team member to get started.
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-(--bg-clr) text-(--txt-clr) text-sm font-semibold sec-ff hover:bg-(--pry-clr)/90 transition-colors"
          >
            <UserPlus size={16} />
            Invite Staff
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-(--prof-clr) text-(--txt-clr) text-sm font-semibold sec-ff hover:bg-(--bg-clr) transition-colors cursor-pointer"
        >
          <UserPlus size={15} />
          Invite Staff
        </button>
      )}

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
                  Invite Staff Member
                </h2>
                <p className="text-sm text-(--pry-clr)/70 mt-0.5 sec-ff">
                  They&apos;ll receive an email to join your store.
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

            {/* Fields */}
            <div className="flex flex-col gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-(--pry-clr) sec-ff">
                  Full Name
                </label>
                <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-(--txt-clr) focus-within:border-(--pry-clr) transition-colors">
                  <User size={16} className="text-(--pry-clr) shrink-0" />
                  <input
                    name="name"
                    type="text"
                    placeholder="e.g. Ayomide Bello"
                    value={form.name}
                    onChange={handleChange}
                    disabled={loading}
                    className="flex-1 bg-transparent text-sm text-(--pry-clr) placeholder:text-(--pry-clr)/50 outline-none sec-ff disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-(--pry-clr) sec-ff">
                  Email Address
                </label>
                <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-(--txt-clr) focus-within:border-(--pry-clr) transition-colors">
                  <Mail size={16} className="text-(--pry-clr) shrink-0" />
                  <input
                    name="email"
                    type="email"
                    placeholder="e.g. ayomide@example.com"
                    value={form.email}
                    onChange={handleChange}
                    disabled={loading}
                    className="flex-1 bg-transparent text-sm text-(--pry-clr) placeholder:text-(--pry-clr)/50 outline-none sec-ff disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
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
                className="flex-1 py-2.5 rounded-xl bg-(--bg-clr) text-(--txt-clr) text-sm font-semibold sec-ff hover:bg-(--bg-clr)/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send Invite"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}