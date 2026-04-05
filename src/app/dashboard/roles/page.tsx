// src/app/dashboard/roles/page.tsx

export default function RolesPage() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8 py-6 mb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-(--pry-clr) sec-ff">Roles & Permissions</h1>
        <p className="text-sm text-(--pry-clr)/60 sec-ff mt-1">
          Understand how roles and access levels work in your organization.
        </p>
      </div>

      {/* What are roles */}
      <div className="bg-white rounded-2xl p-6 flex flex-col gap-3 border border-gray-100">
        <h2 className="text-base font-bold text-(--pry-clr) sec-ff">What are roles?</h2>
        <p className="text-sm text-(--pry-clr)/70 sec-ff leading-relaxed">
          Roles are named bundles of permissions that define <span className="font-semibold text-(--pry-clr)">what</span> a staff member
          can do in your organisation. Instead of assigning permissions one by one to every person,
          you create a role once — like <span className="font-medium text-(--pry-clr)">&apos;Store Manager&apos;</span> or{" "}
          <span className="font-medium text-(--pry-clr)">&apos;Cashier&apos;</span> — and attach it to as many staff members as needed.
        </p>
        <p className="text-sm text-(--pry-clr)/70 sec-ff leading-relaxed">
          When you update a role&apos;s permissions, the change applies immediately to every staff member
          who has that role — no need to update each person individually.
        </p>
      </div>

      {/* Access levels */}
      <div className="bg-white rounded-2xl p-6 flex flex-col gap-4 border border-gray-100">
        <h2 className="text-base font-bold text-(--pry-clr) sec-ff">Access levels</h2>
        <p className="text-sm text-(--pry-clr)/70 sec-ff leading-relaxed">
          A role on its own doesn&apos;t mean much without a <span className="font-semibold text-(--pry-clr)">scope</span> — access levels
          define <span className="font-semibold text-(--pry-clr)">where</span> a role applies. There are three levels:
        </p>

        <ul className="flex flex-col gap-3 mt-1">
          {/* Organization */}
          <li className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50">
            <div className="w-8 h-8 rounded-lg bg-(--pry-clr)/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold text-(--pry-clr) sec-ff">O</span>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-(--pry-clr) sec-ff">Organisation</p>
              <p className="text-sm text-(--pry-clr)/60 sec-ff leading-relaxed">
                The broadest level. Permissions apply across the entire organisation — every store
                and every location. Best suited for top-level admins or HR managers who need
                visibility and control everywhere.
              </p>
            </div>
          </li>

          {/* Store */}
          <li className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50">
            <div className="w-8 h-8 rounded-lg bg-(--acc-clr)/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold text-(--acc-clr) sec-ff">S</span>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-(--pry-clr) sec-ff">Store</p>
              <p className="text-sm text-(--pry-clr)/60 sec-ff leading-relaxed">
                Permissions apply within a specific store and all its locations. A staff member at
                this level can manage everything under their assigned store but has no visibility
                into other stores. Ideal for store managers.
              </p>
            </div>
          </li>

          {/* Location */}
          <li className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold text-emerald-500 sec-ff">L</span>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-(--pry-clr) sec-ff">Location</p>
              <p className="text-sm text-(--pry-clr)/60 sec-ff leading-relaxed">
                The most granular level. Permissions apply only at a specific location within a store.
                Perfect for staff who operate at a single branch or kiosk and should have no access
                to anything outside of it.
              </p>
            </div>
          </li>
        </ul>
      </div>

      {/* How they work together */}
      <div className="bg-white rounded-2xl p-6 flex flex-col gap-3 border border-gray-100">
        <h2 className="text-base font-bold text-(--pry-clr) sec-ff">How roles and levels work together</h2>
        <p className="text-sm text-(--pry-clr)/60 sec-ff leading-relaxed">
          When you grant access to a staff member, you pick both a <span className="font-semibold text-(--pry-clr)">level</span> (where)
          and a <span className="font-semibold text-(--pry-clr)">role</span> (what). For example:
        </p>
        <ul className="flex flex-col gap-2 mt-1">
          {[
            { label: "Emeka", detail: "Organisation level · HR Manager role → can manage staff across all stores" },
            { label: "Fatima", detail: "Store level · BIG Kiosks · Cashier role → processes sales only at BIG Kiosks" },
            { label: "Chidi", detail: "Location level · BIG Meals, BGH · Store Manager role → manages only that one branch" },
          ].map(({ label, detail }) => (
            <li key={label} className="flex items-start gap-2 text-sm text-(--pry-clr)/70 sec-ff">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-(--acc-clr) shrink-0" />
              <span>
                <span className="font-semibold text-(--pry-clr)">{label}</span> — {detail}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-(--pry-clr)/60 sec-ff leading-relaxed mt-1">
          A staff member can have multiple access grants — for example, a Store Manager role at
          Store A and a Cashier role at a specific location in Store B.
        </p>
      </div>
    </div>
  );
}