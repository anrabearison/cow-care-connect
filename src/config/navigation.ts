import {
  Home, Beef, User, Settings, IdCard, ShieldCheck, ClipboardList,
  ArrowRightLeft, Stethoscope, Pill, Calendar, Activity, Tag, Flag,
  Brain, Book, Mail, ShoppingCart, Truck, Crown, Folder, Heart,
  FileText, ShoppingBag, Bookmark, Upload, LucideIcon
} from 'lucide-react';
import { UserRole, USER_ROLES } from '@/constants/roles';

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  exact?: boolean;
  disabled?: boolean;
  roles: UserRole[];
}

export interface NavGroup {
  label: string;
  icon: LucideIcon;
  items: NavItem[];
}

// Helper function to check if a role is in the allowed roles
export const hasRoleAccess = (userRole: UserRole | undefined, allowedRoles: UserRole[]): boolean => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};

// Helper function to filter items based on user role
export const filterNavItems = (items: NavItem[], userRole: UserRole | undefined): NavItem[] => {
  return items.filter(item => hasRoleAccess(userRole, item.roles));
};

// Helper function to filter groups based on user role
export const filterNavGroups = (groups: NavGroup[], userRole: UserRole | undefined): NavGroup[] => {
  return groups
    .map(group => ({
      ...group,
      items: filterNavItems(group.items, userRole),
    }))
    .filter(group => group.items.length > 0);
};

// ─── Frontoffice Navigation (MainLayout) ───────────────────────────────────────

// Note: Navigation filtering is a cosmetic layer. The real protection is the route guard (FarmRoute).
// SUPER_ADMIN is redirected to /admin after login and blocked from farm business routes by FarmRoute.

export const FRONT_OFFICE_ITEMS: NavItem[] = [
  { title: 'Accueil', url: '/', icon: Home, roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.OWNER_ADMIN, USER_ROLES.OWNER_USER] },
  { title: 'Troupeau', url: '/cattle', icon: Beef, roles: [USER_ROLES.OWNER_ADMIN, USER_ROLES.OWNER_USER] },
  { title: 'Profil', url: '/profile', icon: User, roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.OWNER_ADMIN, USER_ROLES.OWNER_USER] },
];

export const REPORT_ITEMS: NavItem[] = [
  { title: 'Passeports', url: '/reports/passport', icon: IdCard, exact: false, roles: [USER_ROLES.OWNER_ADMIN, USER_ROLES.OWNER_USER] },
  { title: 'Rapport Sanitaire', url: '/reports/health', icon: ShieldCheck, exact: false, disabled: true, roles: [USER_ROLES.OWNER_ADMIN, USER_ROLES.OWNER_USER] },
  { title: 'Inventaire', url: '/reports/inventory', icon: ClipboardList, exact: false, disabled: true, roles: [USER_ROLES.OWNER_ADMIN, USER_ROLES.OWNER_USER] },
  { title: 'Transferts', url: '/reports/transfers', icon: ArrowRightLeft, exact: false, disabled: true, roles: [USER_ROLES.OWNER_ADMIN, USER_ROLES.OWNER_USER] },
];

export const FRONT_OFFICE_ADMIN_ITEMS: NavItem[] = [
  { title: 'Administration', url: '/admin', icon: Settings, roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.OWNER_ADMIN] },
];

// ─── Admin Navigation (AdminLayout) ────────────────────────────────────────────

export const ADMIN_STANDALONE_ITEMS: NavItem[] = [
  { title: 'Tableau de bord', url: '/admin', icon: Settings, roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.OWNER_ADMIN] },
];

export const ADMIN_NAVIGATION_GROUPS: NavGroup[] = [
  {
    label: 'Administration',
    icon: Settings,
    items: [
      { title: 'Import initial', url: '/herdbook/initial-import', icon: Upload, roles: [USER_ROLES.OWNER_ADMIN] },
      { title: 'Livres de troupeau', url: '/admin/herd-books', icon: Book, roles: [USER_ROLES.OWNER_ADMIN] },
      { title: 'Invitations', url: '/admin/invitations', icon: Mail, roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.OWNER_ADMIN] },
      { title: 'Propriétaires', url: '/admin/owners', icon: Crown, roles: [USER_ROLES.SUPER_ADMIN] },
    ],
  },
  {
    label: 'Gestion du troupeau',
    icon: Heart,
    items: [
      { title: 'Bovins', url: '/admin/cattle', icon: Beef, roles: [USER_ROLES.OWNER_ADMIN] },
      { title: 'Inscriptions bovins', url: '/admin/herd-book-cattle', icon: FileText, roles: [USER_ROLES.OWNER_ADMIN] },
    ],
  },
  {
    label: 'Personnel',
    icon: User,
    items: [
      { title: 'Utilisateurs', url: '/admin/users', icon: User, roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.OWNER_ADMIN] },
      { title: 'Intervenants', url: '/admin/veterinarians', icon: Stethoscope, roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.OWNER_ADMIN] },
    ],
  },
  {
    label: 'Médical',
    icon: Activity,
    items: [
      { title: 'Traitements', url: '/admin/treatments', icon: Activity, roles: [USER_ROLES.OWNER_ADMIN] },
      { title: 'Événements', url: '/admin/events', icon: Calendar, roles: [USER_ROLES.OWNER_ADMIN] },
    ],
  },
  {
    label: 'Référence',
    icon: Bookmark,
    items: [
      { title: 'Médicaments', url: '/admin/medicaments', icon: Pill, roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.OWNER_ADMIN] },
      { title: 'Catégories', url: '/admin/categories', icon: Tag, roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.OWNER_ADMIN] },
      { title: 'Statuts', url: '/admin/status', icon: Flag, roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.OWNER_ADMIN] },
      { title: 'Caractères', url: '/admin/characters', icon: Brain, roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.OWNER_ADMIN] },
      { title: 'Types événements', url: '/admin/event-types', icon: Calendar, roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.OWNER_ADMIN] },
    ],
  },
  {
    label: 'Achats',
    icon: ShoppingBag,
    items: [
      { title: 'Historique achats', url: '/admin/purchases', icon: ShoppingCart, roles: [USER_ROLES.OWNER_ADMIN] },
      { title: 'Fournisseurs', url: '/admin/suppliers', icon: Truck, roles: [USER_ROLES.OWNER_ADMIN] },
    ],
  },
];
