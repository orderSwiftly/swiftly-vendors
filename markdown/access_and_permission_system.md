# Access & Permission System

## The Core Idea

Every action in the system is gated by two questions:

1. **Where can I go?** — Access
2. **What can I do there?** — Permissions

Both must pass. Having access to a place doesn't mean you can do everything there. Having a permission doesn't mean you can use it everywhere.

Think of it like a hospital. Every staff member has a security card that determines which wards and rooms they can enter. A cleaner and a surgeon might both have access to the same ward — their cards both open the door — but what they are allowed to do inside that ward is completely different. The surgeon can perform procedures. The cleaner cannot. The cleaner can operate the cleaning equipment. The surgeon wouldn't be expected to.

Now take it further. The surgeon might have access to Ward A and Ward B, but only have operating privileges in Ward A. In Ward B, she is just observing. Same person, same card, different things she is allowed to do depending on where she is. Her card got her in — her role decided what happens next.

That is exactly how this system works.

---

## Part 1: Access (Where can I go?)

Access is organized into three levels. Think of them as tiers on a card:

```
Organization  (highest)
    └── Store
            └── Location  (lowest)
```

Access trickles **downward**. If you have access at a higher level, you automatically have access to everything below it.

| Access Level | What it covers |
|---|---|
| Organization | Everything — all stores, all locations |
| Store | That store and all its locations |
| Location | Only that specific location |

### Examples

**Amara** is the general operations manager. She has **Organization** level access. This means she can walk into any store and any location within the organization without needing separate access grants for each one.

**Tunde** manages Store A. He has **Store** level access for Store A. He can operate in Store A and all of its locations (loc_1, loc_2, loc_3...), but he cannot touch Store B or Store C.

**Chidi** is a sales rep assigned to two specific counters. He has **Location** level access for loc_2 and loc_4. He can only operate at those two locations. loc_1, loc_3, loc_5 — he cannot enter.

---

### Access is explicit and additive

Each access grant is a self-contained unit — it says "this member can operate at this specific place, with these specific roles." If you want to give a member access to a second place, you create a second grant. A third place, a third grant. They do not interfere with each other.

Technically, each grant is its own record in the database with its own level, its own location or store reference, and its own attached roles. The member's full access profile is the collection of all their grants read together.

**Example: Bisola**

Bisola has two access grants:

| Grant | Level | Place | Roles |
|---|---|---|---|
| #1 | Store | Store A | Store Manager |
| #2 | Location | loc_7 in Store B | Sales Rep |

Grant #1 gives her store-wide reach across all of Store A — every location inside it is covered. Grant #2 gives her a foothold at one specific counter in Store B.

These two grants live independently. What she can do at Store A is determined entirely by Grant #1. What she can do at loc_7 is determined entirely by Grant #2. loc_8 and loc_9 in Store B? Neither grant covers them, so she simply has no access there.

---

## Part 2: Permissions (What can I do?)

Permissions are atomic actions. Each one represents a specific thing you can do:

| Permission | What it allows |
|---|---|
| `organization__manage` | Manage organization settings |
| `store__manage` | Manage store settings |
| `location__manage` | Manage location settings |
| `product__manage` | Create, edit, deactivate products |
| `product__list` | View the product list |
| `staff__manage` | Invite and manage staff |
| `inventory__adjust` | Make manual inventory adjustments |
| `inventory__view` | View inventory levels |
| `inventory__inflow` | Record new stock coming in |
| `sales__process` | Process a sale |

Permissions do not come with an access level baked in. A permission is just an action. The access level controls *where* that action can be performed.

---

## Part 3: Roles (The bridge between access and permissions)

A role is simply a named bundle of permissions. Nothing more.

You create roles to represent the kinds of jobs people do in your organization. When you assign someone to a place (access), you also attach one or more roles to that assignment — those roles define what they can do there.

### Example roles

**Store Manager**
- `store__manage`
- `product__manage`
- `inventory__view`
- `staff__manage`

**IMO Officer** (Inventory Management Officer)
- `inventory__adjust`
- `inventory__inflow`
- `inventory__view`

**Sales Rep**
- `sales__process`
- `product__list`

These are just examples. You define the roles that make sense for your organization.

---

### Multiple roles on one access

A person can have more than one role attached to a single access. Their effective permissions are the **union** of all their roles at that access level.

**Example:**
Kola has Store level access for Store B, with two roles attached: *Store Manager* and *IMO Officer*.

His effective permissions at Store B:
- `store__manage` (from Store Manager)
- `product__manage` (from Store Manager)
- `inventory__view` (from both, doesn't matter)
- `staff__manage` (from Store Manager)
- `inventory__adjust` (from IMO Officer)
- `inventory__inflow` (from IMO Officer)

---

## Part 4: How it all fits together

When someone tries to perform an action, the system checks two things in order:

### Step 1 — Does this member have access to this place?

Find all their access records that cover the place in question. This respects trickle down:
- An **Organization** access covers any store or location
- A **Store** access covers any location within that store
- A **Location** access covers only that exact location

If none of their access records cover this place, the check fails immediately.

### Step 2 — Do any of the relevant access records grant this permission?

From the access records that passed Step 1, collect all the permissions across all attached roles. If the required permission is in that set, the action is allowed.

---

### Full worked example

The organization has 2 stores. Store A has 3 locations (A1, A2, A3). Store B has 3 locations (B1, B2, B3).

**Ngozi's access profile:**
- Store level access on Store A → roles: [Store Manager]
- Location level access on B2 → roles: [Sales Rep]

| Action | Place | Result | Reason |
|---|---|---|---|
| `store__manage` | Store A | ✅ | Store A access + Store Manager role |
| `inventory__adjust` | Store A | ❌ | Store Manager doesn't have `inventory__adjust` |
| `sales__process` | A1 | ❌ | Store A access covers A1 but Sales Rep role not attached there |
| `sales__process` | B2 | ✅ | B2 access + Sales Rep role |
| `sales__process` | B3 | ❌ | No access to B3 |
| `store__manage` | Store B | ❌ | No store-level access to Store B |
| `organization__manage` | Organization | ❌ | No organization level access |

---

## Part 5: Common setups

### "I want someone to manage everything"
Give them **Organization** level access with a role that has all the permissions you want them to have.

### "I want a store manager for Store A only"
Give them **Store** level access for Store A with a Store Manager role.

### "I want someone to cover 3 specific locations across different stores"
Give them three **Location** level access records — one per location — each with the appropriate role.

### "I want someone to manage all of Store A but only do sales at 2 locations in Store B"
- Store level access on Store A → Store Manager role
- Location level access on B_loc_1 → Sales Rep role
- Location level access on B_loc_2 → Sales Rep role

### "I want an org-level person who can only manage staff, nothing else"
Give them **Organization** level access with a role that only has `staff__manage`. They can manage staff anywhere in the org, but they cannot touch inventory, products, or sales.
