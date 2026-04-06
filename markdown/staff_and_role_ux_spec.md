# Swiftly IMS — UI/UX Specification (Supplement)
---
## 5. Staff & Roles

### How It Works
See the attached *Access & Permission System* document for a full breakdown of the logic. The short version: every staff member has access grants that define *where* they operate, and roles that define *what* they can do there. This section covers the screens that let managers set all of that up.

---

### 5.1 Staff List

The entry point for all staff management. Displays all members currently in the organization.

Each staff entry shows:
- Name and email
- A summary of their access (e.g. "Store A · Store B" or "3 locations")
- Status (Active / Inactive)

Actions available from this screen:
- **Invite Staff** — opens the invite flow
- **View Staff** — opens the Staff Profile for that member

---

### 5.2 Invite Staff

A simple form. Collect the new staff member's name and email. That's it.

Access and roles are set up on the Staff Profile after the invite is sent. Do not combine the invite form with the access setup — it overloads the flow for what is essentially just "add this person to the org."

Fields:
- Name
- Email

On submit, the system sends an invite to the email address. The invited member appears in the Staff List with a *Pending* status until they accept.

---

### 5.3 Staff Profile

A full picture of a single staff member. This is the screen managers return to whenever they need to understand or change what a staff member can do.

The screen has two main areas:

**Member details**
- Name, email, status

**Access grants**

A list of all the member's current access grants. Each grant shows:
- The level (Organization, Store, or Location)
- The specific place (store name or location name)
- The roles attached to that grant
- A **Revoke** button to remove that grant entirely

At the bottom of the list, an **Add Access** button opens the Manage Access panel (see 5.4).

> There is no "edit" button on a grant. To change a grant, revoke it and add a new one. The UI should make this feel seamless — see note in 5.4.

---

### 5.4 Manage Access Panel

Opened from the Staff Profile via **Add Access**. This is where a manager assigns a new access grant (or set of grants) to a staff member.

The panel is split into two sides:

**Left side — Where**

A scoped selector with three tabs: *Organization*, *Store*, *Location*.

- **Organization tab** — no further selection needed. One grant at org level.
- **Store tab** — a list of stores. The manager selects one or more stores. Each selected store becomes its own grant.
- **Location tab** — a list of stores, each expandable to show their locations. The manager can select individual locations across multiple stores. Each selected location becomes its own grant.

The manager can freely switch between tabs and build up a selection. All selected places are shown as a summary (e.g. "Store A, loc_7, loc_9").

**Right side — What**

A role picker. Shows all available roles in the organization, each with a checkbox. As roles are selected, a live permissions list below updates to show the union of permissions across all selected roles — permissions that appear in more than one role are only shown once.

This gives the manager a clear preview of exactly what the staff member will be able to do at the selected places before confirming.

**On confirm**, the system creates one access grant per selected place, each with the selected roles attached.

> **Note on editing:** If a manager opens this panel intending to "edit" an existing grant — say, to change a role or move someone to a different location — the recommended flow is to revoke the old grant from the Staff Profile and use this panel to create the new one. A future iteration may add a shortcut that pre-fills the panel from an existing grant to make this feel more like an edit.

---

### 5.5 Roles List

A management screen for all roles in the organization. Each role shows:
- Role name
- A summary of its permissions (e.g. "4 permissions" or a short comma-separated list)
- Status (Active / Inactive)

Actions:
- **Create Role** — opens the Create Role form
- **View Role** — opens the Role Detail screen

---

### 5.6 Create / Edit Role

A simple form for defining a role.

Fields:
- **Name** — what this role is called (e.g. "Store Manager", "IMO Officer", "Sales Rep")
- **Permissions** — a checklist of all available permissions, grouped by resource

```
Organization
  ☐ organization__manage

Store
  ☐ store__manage

Location
  ☐ location__manage

Products
  ☐ product__manage
  ☐ product__list

Staff
  ☐ staff__manage

Inventory
  ☐ inventory__adjust
  ☐ inventory__inflow
  ☐ inventory__view

Sales
  ☐ sales__process
```

> **On edit:** Changes to a role's permissions take effect immediately for every staff member who has that role attached to any of their access grants. Make this clear to the manager before they save — a short confirmation prompt is appropriate here.

---

### 5.7 Role Detail

A deeper view of a single role. Useful for auditing who has a role and cleaning things up.

The screen shows:
- Role name and full permissions list
- Status (Active / Inactive)
- An **Edit** button leading to the Edit Role form (5.6)
- A **Deactivate** button to soft-delete the role

**Members with this role**

A list of every staff member who has this role attached to at least one of their access grants. Each entry shows:
- Member name
- Which grant(s) the role is attached to (e.g. "Store A", "loc_7")
- A **Revoke** button that removes this role from that specific grant

> Revoking a role from a grant here does not delete the grant itself — the member still has access to that place, just without this role. If the grant ends up with no roles at all, the system should either flag it or clean it up automatically. Flag it for now.
