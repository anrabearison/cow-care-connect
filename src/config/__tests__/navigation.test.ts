import { describe, expect, it } from 'vitest';
import { USER_ROLES } from '@/constants/roles';
import {
  FRONT_OFFICE_ITEMS,
  REPORT_ITEMS,
  FRONT_OFFICE_ADMIN_ITEMS,
  ADMIN_NAVIGATION_GROUPS,
  filterNavItems,
  filterNavGroups,
} from '../navigation';

describe('Navigation Configuration', () => {
  describe('Frontoffice Navigation', () => {
    it('SUPER_ADMIN should see only Accueil and Profil (not Troupeau)', () => {
      const filtered = filterNavItems(FRONT_OFFICE_ITEMS, USER_ROLES.SUPER_ADMIN);
      expect(filtered.length).toBe(2);
      expect(filtered.map(i => i.title)).toEqual(['Accueil', 'Profil']);
    });

    it('OWNER_ADMIN should see all frontoffice items', () => {
      const filtered = filterNavItems(FRONT_OFFICE_ITEMS, USER_ROLES.OWNER_ADMIN);
      expect(filtered.length).toBe(3);
      expect(filtered.map(i => i.title)).toEqual(['Accueil', 'Troupeau', 'Profil']);
    });

    it('OWNER_USER should see all frontoffice items', () => {
      const filtered = filterNavItems(FRONT_OFFICE_ITEMS, USER_ROLES.OWNER_USER);
      expect(filtered.length).toBe(3);
      expect(filtered.map(i => i.title)).toEqual(['Accueil', 'Troupeau', 'Profil']);
    });

    it('SUPER_ADMIN should not see any report items', () => {
      const filtered = filterNavItems(REPORT_ITEMS, USER_ROLES.SUPER_ADMIN);
      expect(filtered.length).toBe(0);
    });

    it('OWNER_ADMIN should see all report items', () => {
      const filtered = filterNavItems(REPORT_ITEMS, USER_ROLES.OWNER_ADMIN);
      expect(filtered.length).toBe(4);
    });

    it('OWNER_USER should see all report items', () => {
      const filtered = filterNavItems(REPORT_ITEMS, USER_ROLES.OWNER_USER);
      expect(filtered.length).toBe(4);
    });

    it('SUPER_ADMIN should see admin link in frontoffice', () => {
      const filtered = filterNavItems(FRONT_OFFICE_ADMIN_ITEMS, USER_ROLES.SUPER_ADMIN);
      expect(filtered.length).toBe(1);
      expect(filtered[0].title).toBe('Administration');
    });

    it('OWNER_ADMIN should see admin link in frontoffice', () => {
      const filtered = filterNavItems(FRONT_OFFICE_ADMIN_ITEMS, USER_ROLES.OWNER_ADMIN);
      expect(filtered.length).toBe(1);
      expect(filtered[0].title).toBe('Administration');
    });

    it('OWNER_USER should not see admin link in frontoffice', () => {
      const filtered = filterNavItems(FRONT_OFFICE_ADMIN_ITEMS, USER_ROLES.OWNER_USER);
      expect(filtered.length).toBe(0);
    });
  });

  describe('Admin Navigation', () => {
    it('SUPER_ADMIN should see all admin groups', () => {
      const filtered = filterNavGroups(ADMIN_NAVIGATION_GROUPS, USER_ROLES.SUPER_ADMIN);
      expect(filtered.length).toBe(6);
      expect(filtered.map(g => g.label)).toEqual([
        'Général',
        'Personnel',
        'Médical',
        'Référence',
        'Administration',
        'Super Admin',
      ]);
    });

    it('SUPER_ADMIN should see Propriétaires and Invitations', () => {
      const filtered = filterNavGroups(ADMIN_NAVIGATION_GROUPS, USER_ROLES.SUPER_ADMIN);
      const adminGroup = filtered.find(g => g.label === 'Administration');
      expect(adminGroup).toBeDefined();
      expect(adminGroup!.items.map(i => i.title)).toContain('Invitations');
      
      const superAdminGroup = filtered.find(g => g.label === 'Super Admin');
      expect(superAdminGroup).toBeDefined();
      expect(superAdminGroup!.items.map(i => i.title)).toContain('Propriétaires');
    });

    it('SUPER_ADMIN should not see farm modules (cattle, events, treatments, passport, herd-book-cattle)', () => {
      const filtered = filterNavGroups(ADMIN_NAVIGATION_GROUPS, USER_ROLES.SUPER_ADMIN);
      const herdGroup = filtered.find(g => g.label === 'Gestion du troupeau');
      expect(herdGroup).toBeUndefined();
      
      const medicalGroup = filtered.find(g => g.label === 'Médical');
      expect(medicalGroup).toBeDefined();
      expect(medicalGroup!.items.map(i => i.title)).not.toContain('Traitements');
      expect(medicalGroup!.items.map(i => i.title)).not.toContain('Événements');
    });

    it('SUPER_ADMIN should not see Achats (purchases, suppliers)', () => {
      const filtered = filterNavGroups(ADMIN_NAVIGATION_GROUPS, USER_ROLES.SUPER_ADMIN);
      const achatsGroup = filtered.find(g => g.label === 'Achats');
      expect(achatsGroup).toBeUndefined();
    });

    it('OWNER_ADMIN should see all admin groups except Super Admin', () => {
      const filtered = filterNavGroups(ADMIN_NAVIGATION_GROUPS, USER_ROLES.OWNER_ADMIN);
      expect(filtered.length).toBe(7);
      expect(filtered.map(g => g.label)).toEqual([
        'Général',
        'Gestion du troupeau',
        'Personnel',
        'Médical',
        'Référence',
        'Administration',
        'Achats',
      ]);
    });

    it('OWNER_ADMIN should see Invitations and Utilisateurs', () => {
      const filtered = filterNavGroups(ADMIN_NAVIGATION_GROUPS, USER_ROLES.OWNER_ADMIN);
      const personnelGroup = filtered.find(g => g.label === 'Personnel');
      expect(personnelGroup).toBeDefined();
      expect(personnelGroup!.items.map(i => i.title)).toContain('Utilisateurs');
      
      const adminGroup = filtered.find(g => g.label === 'Administration');
      expect(adminGroup).toBeDefined();
      expect(adminGroup!.items.map(i => i.title)).toContain('Invitations');
    });

    it('OWNER_ADMIN should see Medicaments', () => {
      const filtered = filterNavGroups(ADMIN_NAVIGATION_GROUPS, USER_ROLES.OWNER_ADMIN);
      const medicalGroup = filtered.find(g => g.label === 'Médical');
      expect(medicalGroup).toBeDefined();
      expect(medicalGroup!.items.map(i => i.title)).toContain('Médicaments');
    });

    it('OWNER_ADMIN should see all farm modules', () => {
      const filtered = filterNavGroups(ADMIN_NAVIGATION_GROUPS, USER_ROLES.OWNER_ADMIN);
      const herdGroup = filtered.find(g => g.label === 'Gestion du troupeau');
      expect(herdGroup).toBeDefined();
      expect(herdGroup!.items.map(i => i.title)).toContain('Bovins');
      expect(herdGroup!.items.map(i => i.title)).toContain('Inscriptions bovins');
      
      const medicalGroup = filtered.find(g => g.label === 'Médical');
      expect(medicalGroup).toBeDefined();
      expect(medicalGroup!.items.map(i => i.title)).toContain('Traitements');
      expect(medicalGroup!.items.map(i => i.title)).toContain('Événements');
    });

    it('OWNER_ADMIN should not see Propriétaires', () => {
      const filtered = filterNavGroups(ADMIN_NAVIGATION_GROUPS, USER_ROLES.OWNER_ADMIN);
      const superAdminGroup = filtered.find(g => g.label === 'Super Admin');
      expect(superAdminGroup).toBeUndefined();
    });

    it('OWNER_USER should see only farm-related groups', () => {
      const filtered = filterNavGroups(ADMIN_NAVIGATION_GROUPS, USER_ROLES.OWNER_USER);
      expect(filtered.length).toBe(2);
      expect(filtered.map(g => g.label)).toEqual([
        'Gestion du troupeau',
        'Médical',
      ]);
    });

    it('OWNER_USER should see farm modules', () => {
      const filtered = filterNavGroups(ADMIN_NAVIGATION_GROUPS, USER_ROLES.OWNER_USER);
      const herdGroup = filtered.find(g => g.label === 'Gestion du troupeau');
      expect(herdGroup).toBeDefined();
      expect(herdGroup!.items.map(i => i.title)).toContain('Bovins');
      expect(herdGroup!.items.map(i => i.title)).toContain('Inscriptions bovins');
      
      const medicalGroup = filtered.find(g => g.label === 'Médical');
      expect(medicalGroup).toBeDefined();
      expect(medicalGroup!.items.map(i => i.title)).toContain('Traitements');
      expect(medicalGroup!.items.map(i => i.title)).toContain('Événements');
    });

    it('OWNER_USER should not see Invitations', () => {
      const filtered = filterNavGroups(ADMIN_NAVIGATION_GROUPS, USER_ROLES.OWNER_USER);
      const adminGroup = filtered.find(g => g.label === 'Administration');
      expect(adminGroup).toBeUndefined();
    });

    it('OWNER_USER should not see Utilisateurs', () => {
      const filtered = filterNavGroups(ADMIN_NAVIGATION_GROUPS, USER_ROLES.OWNER_USER);
      const personnelGroup = filtered.find(g => g.label === 'Personnel');
      expect(personnelGroup).toBeUndefined();
    });

    it('OWNER_USER should not see Propriétaires', () => {
      const filtered = filterNavGroups(ADMIN_NAVIGATION_GROUPS, USER_ROLES.OWNER_USER);
      const superAdminGroup = filtered.find(g => g.label === 'Super Admin');
      expect(superAdminGroup).toBeUndefined();
    });

    it('OWNER_USER should not see Medicaments (platform-only)', () => {
      const filtered = filterNavGroups(ADMIN_NAVIGATION_GROUPS, USER_ROLES.OWNER_USER);
      const medicalGroup = filtered.find(g => g.label === 'Médical');
      expect(medicalGroup).toBeDefined();
      expect(medicalGroup!.items.map(i => i.title)).not.toContain('Médicaments');
    });
  });

  describe('Invitations Item Positioning', () => {
    it('Invitations should be in Administration group with SUPER_ADMIN and OWNER_ADMIN roles', () => {
      const adminGroup = ADMIN_NAVIGATION_GROUPS.find(g => g.label === 'Administration');
      expect(adminGroup).toBeDefined();
      const invitationsItem = adminGroup!.items.find(i => i.title === 'Invitations');
      expect(invitationsItem).toBeDefined();
      expect(invitationsItem!.roles).toEqual([USER_ROLES.SUPER_ADMIN, USER_ROLES.OWNER_ADMIN]);
    });

    it('Invitations should not be in Super Admin group', () => {
      const superAdminGroup = ADMIN_NAVIGATION_GROUPS.find(g => g.label === 'Super Admin');
      expect(superAdminGroup).toBeDefined();
      const invitationsItem = superAdminGroup!.items.find(i => i.title === 'Invitations');
      expect(invitationsItem).toBeUndefined();
    });
  });

  describe('Users Item Positioning', () => {
    it('Users should be in Personnel group with SUPER_ADMIN and OWNER_ADMIN roles', () => {
      const personnelGroup = ADMIN_NAVIGATION_GROUPS.find(g => g.label === 'Personnel');
      expect(personnelGroup).toBeDefined();
      const usersItem = personnelGroup!.items.find(i => i.title === 'Utilisateurs');
      expect(usersItem).toBeDefined();
      expect(usersItem!.roles).toEqual([USER_ROLES.SUPER_ADMIN, USER_ROLES.OWNER_ADMIN]);
    });

    it('Users should not be accessible to OWNER_USER', () => {
      const filtered = filterNavGroups(ADMIN_NAVIGATION_GROUPS, USER_ROLES.OWNER_USER);
      const personnelGroup = filtered.find(g => g.label === 'Personnel');
      expect(personnelGroup).toBeUndefined();
    });
  });
});
