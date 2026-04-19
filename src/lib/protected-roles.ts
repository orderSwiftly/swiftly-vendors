// src/lib/protected-roles.ts

export const PROTECTED_ROLES = ['Cashier', 'Store Manager', 'Organization Manager'] as const;

export type ProtectedRole = typeof PROTECTED_ROLES[number];

export const isProtectedRole = (roleName: string): boolean => {
    return PROTECTED_ROLES.includes(roleName as ProtectedRole);
};

export const getRoleProtectionStatus = (roleName: string): { isProtected: boolean; message?: string } => {
    if (isProtectedRole(roleName)) {
        return {
            isProtected: true,
            message: `"${roleName}" is a system role and cannot be modified.`
        };
    }
    return { isProtected: false };
};

// Helper to check specific role types (optional)
export const isCashier = (roleName: string): boolean => {
    return roleName === 'Cashier';
};

export const isStoreManager = (roleName: string): boolean => {
    return roleName === 'Store Manager';
};

export const isOrganizationManager = (roleName: string): boolean => {
    return roleName === 'Organization Manager';
};