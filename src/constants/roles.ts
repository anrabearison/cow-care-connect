/**
 * User role constants and utilities
 */

// Role constants
export const USER_ROLES = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    OWNER_ADMIN: 'OWNER_ADMIN',
    OWNER_USER: 'OWNER_USER',
} as const;

// Type for user roles
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Role labels for display
export const ROLE_LABELS: Record<UserRole, string> = {
    [USER_ROLES.SUPER_ADMIN]: 'Super Admin',
    [USER_ROLES.OWNER_ADMIN]: 'Admin Propriétaire',
    [USER_ROLES.OWNER_USER]: 'Utilisateur',
};

// Role colors for badges
export const ROLE_COLORS: Record<UserRole, string> = {
    [USER_ROLES.SUPER_ADMIN]: 'bg-red-500/10 text-red-700 border-red-200',
    [USER_ROLES.OWNER_ADMIN]: 'bg-blue-500/10 text-blue-700 border-blue-200',
    [USER_ROLES.OWNER_USER]: 'bg-green-500/10 text-green-700 border-green-200',
};

/**
 * Get the display label for a role
 */
export const getRoleLabel = (role: string): string => {
    return ROLE_LABELS[role as UserRole] || role;
};

/**
 * Get the color class for a role badge
 */
export const getRoleColor = (role: string): string => {
    return ROLE_COLORS[role as UserRole] || 'bg-gray-500/10 text-gray-700 border-gray-200';
};

/**
 * Check if a user has admin privileges (super_admin or owner_admin)
 */
export const isAdmin = (role?: string): boolean => {
    if (!role) return false;
    return role === USER_ROLES.SUPER_ADMIN || role === USER_ROLES.OWNER_ADMIN;
};

/**
 * Check if a user is a super admin
 * Accepts either a role string or a user object
 */
export const isSuperAdmin = (roleOrUser?: string | { role?: string }): boolean => {
    if (!roleOrUser) return false;
    // Si c'est un objet utilisateur, extraire le rôle
    const role = typeof roleOrUser === 'object' ? roleOrUser.role : roleOrUser;
    return role === USER_ROLES.SUPER_ADMIN;
};

/**
 * Check if a user is an owner admin
 */
export const isOwnerAdmin = (role?: string): boolean => {
    return role === USER_ROLES.OWNER_ADMIN;
};

/**
 * Check if a user has farm management privileges (owner_admin or owner_user)
 * Used for animal management modules: cattle, events, treatments, passport, herd-book-cattle
 */
export const isFarmRole = (role?: string): boolean => {
    if (!role) return false;
    return role === USER_ROLES.OWNER_ADMIN || role === USER_ROLES.OWNER_USER;
};

/**
 * Get creation constraints based on user role
 * Used for invitations and users creation to enforce RBAC rules
 */
export interface RoleConstraints {
    allowedRoles: UserRole[];
    forcedRole?: UserRole;
    forcedOwnerId?: string;
    canSelectOwner: boolean;
}

export const getRoleConstraints = (userRole: UserRole, userOwnerId?: string): RoleConstraints => {
    if (userRole === USER_ROLES.OWNER_ADMIN) {
        return {
            allowedRoles: [USER_ROLES.OWNER_USER],
            forcedRole: USER_ROLES.OWNER_USER,
            forcedOwnerId: userOwnerId,
            canSelectOwner: false,
        };
    }
    
    // SUPER_ADMIN can create any role and select any owner
    return {
        allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.OWNER_ADMIN, USER_ROLES.OWNER_USER],
        canSelectOwner: true,
    };
};
