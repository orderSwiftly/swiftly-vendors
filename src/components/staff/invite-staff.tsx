"use client";

import { useState } from "react";
import { UserPlus, X, Mail, User, Loader2, Plus, Trash2, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { inviteStaff } from "@/lib/staff";

interface InviteStaffProps {
  onInvited?: () => void;
  variant?: "empty-state" | "button-only";
}

interface PersonForm {
  first_name: string;
  last_name: string;
  email: string;
}

const emptyPerson = (): PersonForm => ({ first_name: "", last_name: "", email: "" });

export default function InviteStaff({
  onInvited,
  variant = "empty-state",
}: Readonly<InviteStaffProps>) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [people, setPeople] = useState<PersonForm[]>([emptyPerson()]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    setPeople((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [e.target.name]: e.target.value } : p))
    );
  };

  const addPerson = () => setPeople((prev) => [...prev, emptyPerson()]);

  const removePerson = (index: number) => {
    setPeople((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const valid = people.every(
      (p) => p.first_name.trim() && p.last_name.trim() && p.email.trim()
    );
    if (!valid) {
      toast.error("Please fill in all fields for every person.");
      return;
    }

    setLoading(true);
    try {
      const result = await inviteStaff(
        people.map((p) => ({
          first_name: p.first_name.trim(),
          last_name: p.last_name.trim(),
          email: p.email.trim(),
        }))
      );
      toast.success(`${result.invited} invite${result.invited !== 1 ? "s" : ""} sent.`);
      setPeople([emptyPerson()]);
      setOpen(false);
      onInvited?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send invites.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setPeople([emptyPerson()]);
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
            <p className="font-semibold text-(--pry-clr) sec-ff">No staff members yet</p>
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
            className="w-full max-w-lg bg-(--txt-clr) rounded-2xl shadow-2xl p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-(--pry-clr) sec-ff">
                  Invite Staff
                </h2>
                <p className="text-sm text-(--pry-clr)/70 mt-0.5 sec-ff">
                  Add one or more people to your organisation.
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

            {/* People list */}
            <div className="flex flex-col gap-4">
              {people.map((person, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50 relative"
                >
                  {/* Remove button */}
                  {people.length > 1 && (
                    <button
                      onClick={() => removePerson(index)}
                      disabled={loading}
                      className="absolute top-3 right-3 p-1 rounded-md hover:bg-red-50 text-(--pry-clr)/40 hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}

                  <p className="text-xs font-semibold text-(--pry-clr)/50 sec-ff uppercase tracking-wide">
                    Person {index + 1}
                  </p>

                  {/* First + Last */}
                  <div className="flex gap-3">
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className="text-xs font-medium text-(--pry-clr) sec-ff">
                        First Name
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-(--txt-clr) focus-within:border-(--pry-clr) transition-colors">
                        <User size={14} className="text-(--pry-clr)/50 shrink-0" />
                        <input
                          name="first_name"
                          type="text"
                          placeholder="Ayomide"
                          value={person.first_name}
                          onChange={(e) => handleChange(index, e)}
                          disabled={loading}
                          className="flex-1 bg-transparent text-sm text-(--pry-clr) placeholder:text-(--pry-clr)/40 outline-none sec-ff disabled:opacity-60"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className="text-xs font-medium text-(--pry-clr) sec-ff">
                        Last Name
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-(--txt-clr) focus-within:border-(--pry-clr) transition-colors">
                        <User size={14} className="text-(--pry-clr)/50 shrink-0" />
                        <input
                          name="last_name"
                          type="text"
                          placeholder="Bello"
                          value={person.last_name}
                          onChange={(e) => handleChange(index, e)}
                          disabled={loading}
                          className="flex-1 bg-transparent text-sm text-(--pry-clr) placeholder:text-(--pry-clr)/40 outline-none sec-ff disabled:opacity-60"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-(--pry-clr) sec-ff">
                      Email Address
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-(--txt-clr) focus-within:border-(--pry-clr) transition-colors">
                      <Mail size={14} className="text-(--pry-clr)/50 shrink-0" />
                      <input
                        name="email"
                        type="email"
                        placeholder="ayomide@example.com"
                        value={person.email}
                        onChange={(e) => handleChange(index, e)}
                        disabled={loading}
                        className="flex-1 bg-transparent text-sm text-(--pry-clr) placeholder:text-(--pry-clr)/40 outline-none sec-ff disabled:opacity-60"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Add another person */}
              <button
                onClick={addPerson}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-300 text-sm font-medium text-(--pry-clr)/60 sec-ff hover:border-(--pry-clr)/40 hover:text-(--pry-clr) transition-colors disabled:opacity-50"
              >
                <Plus size={15} />
                Add another person
              </button>
            </div>

            {/* Info banner */}
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-yellow-50 border border-yellow-200">
              <Lightbulb size={15} className="text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-700 sec-ff leading-relaxed">
                Each person will receive an email with a temporary password. You&apos;ll assign their role and access from their Staff Profile after they&rsquo;re added.
              </p>
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
                  `Send ${people.length > 1 ? `${people.length} Invites` : "Invite"}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}