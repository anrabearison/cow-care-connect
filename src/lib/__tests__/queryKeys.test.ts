import { describe, it, expect } from 'vitest';
import { queryKeys } from '../queryKeys';

describe('queryKeys', () => {
  describe('Auth keys', () => {
    it('should have stable auth keys', () => {
      expect(queryKeys.auth.all).toEqual(['auth']);
      expect(queryKeys.auth.user()).toEqual(['auth', 'user']);
      expect(queryKeys.auth.providers()).toEqual(['auth', 'providers']);
    });

    it('should return same reference for static keys', () => {
      const key1 = queryKeys.auth.all;
      const key2 = queryKeys.auth.all;
      expect(key1).toBe(key2);
    });

    it('should return new reference for dynamic keys', () => {
      const key1 = queryKeys.auth.user();
      const key2 = queryKeys.auth.user();
      expect(key1).not.toBe(key2);
      expect(key1).toEqual(key2);
    });
  });

  describe('Dashboard keys', () => {
    it('should have stable dashboard keys', () => {
      expect(queryKeys.dashboard.all).toEqual(['dashboard']);
      expect(queryKeys.dashboard.stats()).toEqual(['dashboard', 'stats', undefined]);
      expect(queryKeys.dashboard.stats('owner-123')).toEqual(['dashboard', 'stats', 'owner-123']);
    });

    it('should handle null ownerId', () => {
      expect(queryKeys.dashboard.stats(null)).toEqual(['dashboard', 'stats', null]);
    });
  });

  describe('Cattle keys', () => {
    it('should have stable cattle keys', () => {
      expect(queryKeys.cattle.all).toEqual(['cattle']);
      expect(queryKeys.cattle.lists()).toEqual(['cattle', 'list']);
      expect(queryKeys.cattle.details('123')).toEqual(['cattle', 'details', '123']);
      expect(queryKeys.cattle.details(456)).toEqual(['cattle', 'details', 456]);
    });

    it('should handle filter objects', () => {
      const filters = { page: 1, per_page: 10 };
      expect(queryKeys.cattle.list(filters)).toEqual(['cattle', 'list', filters]);
    });

    it('should have statistics and birth keys', () => {
      expect(queryKeys.cattle.statistics('123')).toEqual(['cattle', 'statistics', '123']);
      expect(queryKeys.cattle.birth('456')).toEqual(['cattle', 'birth', '456']);
    });
  });

  describe('Events keys', () => {
    it('should have stable events keys', () => {
      expect(queryKeys.events.all).toEqual(['events']);
      expect(queryKeys.events.lists()).toEqual(['events', 'list']);
      expect(queryKeys.events.details('123')).toEqual(['events', 'details', '123']);
      expect(queryKeys.events.recent()).toEqual(['events', 'recent', undefined]);
      expect(queryKeys.events.recent('owner-123')).toEqual(['events', 'recent', 'owner-123']);
    });
  });

  describe('Treatments keys', () => {
    it('should have stable treatments keys', () => {
      expect(queryKeys.treatments.all).toEqual(['treatments']);
      expect(queryKeys.treatments.lists()).toEqual(['treatments', 'list']);
      expect(queryKeys.treatments.details('123')).toEqual(['treatments', 'details', '123']);
    });
  });

  describe('Purchases keys', () => {
    it('should have stable purchases keys', () => {
      expect(queryKeys.purchases.all).toEqual(['purchases']);
      expect(queryKeys.purchases.lists()).toEqual(['purchases', 'list']);
      expect(queryKeys.purchases.details('123')).toEqual(['purchases', 'details', '123']);
    });
  });

  describe('Suppliers keys', () => {
    it('should have stable suppliers keys', () => {
      expect(queryKeys.suppliers.all).toEqual(['suppliers']);
      expect(queryKeys.suppliers.lists()).toEqual(['suppliers', 'list']);
      expect(queryKeys.suppliers.details('123')).toEqual(['suppliers', 'details', '123']);
    });
  });

  describe('Herd Books keys', () => {
    it('should have stable herdBooks keys', () => {
      expect(queryKeys.herdBooks.all).toEqual(['herdBooks']);
      expect(queryKeys.herdBooks.lists()).toEqual(['herdBooks', 'list']);
      expect(queryKeys.herdBooks.details('123')).toEqual(['herdBooks', 'details', '123']);
      expect(queryKeys.herdBooks.cattle('hb-123')).toEqual(['herdBooks', 'cattle', 'hb-123']);
      expect(queryKeys.herdBooks.byOwner()).toEqual(['herdBooks', 'byOwner', undefined]);
      expect(queryKeys.herdBooks.byOwner('owner-123')).toEqual(['herdBooks', 'byOwner', 'owner-123']);
    });
  });

  describe('Cattle History keys', () => {
    it('should have stable cattleHistory keys', () => {
      expect(queryKeys.cattleHistory.byCattleId('cattle-123')).toEqual(['cattleHistory', 'cattle-123']);
    });
  });

  describe('Users keys', () => {
    it('should have stable users keys', () => {
      expect(queryKeys.users.all).toEqual(['users']);
      expect(queryKeys.users.lists()).toEqual(['users', 'list']);
      expect(queryKeys.users.details('123')).toEqual(['users', 'details', '123']);
    });
  });

  describe('Owners keys', () => {
    it('should have stable owners keys', () => {
      expect(queryKeys.owners.all).toEqual(['owners']);
      expect(queryKeys.owners.lists()).toEqual(['owners', 'list']);
      expect(queryKeys.owners.details('123')).toEqual(['owners', 'details', '123']);
    });
  });

  describe('Status keys', () => {
    it('should have stable status keys', () => {
      expect(queryKeys.status.all).toEqual(['status']);
      expect(queryKeys.status.lists()).toEqual(['status', 'list']);
      expect(queryKeys.status.details('123')).toEqual(['status', 'details', '123']);
    });
  });

  describe('Medicaments keys', () => {
    it('should have stable medicaments keys', () => {
      expect(queryKeys.medicaments.all).toEqual(['medicaments']);
      expect(queryKeys.medicaments.lists()).toEqual(['medicaments', 'list']);
      expect(queryKeys.medicaments.details('123')).toEqual(['medicaments', 'details', '123']);
    });
  });

  describe('Herd Book Cattle keys', () => {
    it('should have stable herdBookCattle keys', () => {
      expect(queryKeys.herdBookCattle.all).toEqual(['herdBookCattle']);
      expect(queryKeys.herdBookCattle.lists()).toEqual(['herdBookCattle', 'list']);
      expect(queryKeys.herdBookCattle.details('123')).toEqual(['herdBookCattle', 'details', '123']);
    });
  });

  describe('Categories keys', () => {
    it('should have stable categories keys', () => {
      expect(queryKeys.categories.all).toEqual(['categories']);
      expect(queryKeys.categories.lists()).toEqual(['categories', 'list']);
      expect(queryKeys.categories.details('123')).toEqual(['categories', 'details', '123']);
    });
  });

  describe('Event Types keys', () => {
    it('should have stable eventTypes keys', () => {
      expect(queryKeys.eventTypes.all).toEqual(['eventTypes']);
      expect(queryKeys.eventTypes.lists()).toEqual(['eventTypes', 'list']);
      expect(queryKeys.eventTypes.details('123')).toEqual(['eventTypes', 'details', '123']);
    });
  });

  describe('Characters keys', () => {
    it('should have stable characters keys', () => {
      expect(queryKeys.characters.all).toEqual(['characters']);
      expect(queryKeys.characters.lists()).toEqual(['characters', 'list']);
      expect(queryKeys.characters.details('123')).toEqual(['characters', 'details', '123']);
    });
  });

  describe('Key uniqueness', () => {
    it('should have unique top-level keys', () => {
      const topLevelKeys = Object.keys(queryKeys);
      const uniqueKeys = new Set(topLevelKeys);
      expect(uniqueKeys.size).toBe(topLevelKeys.length);
    });

    it('should not have literal string arrays in keys', () => {
      // All keys should be functions or const arrays, not literal strings
      expect(queryKeys.auth.all).toBeInstanceOf(Array);
      expect(queryKeys.dashboard.all).toBeInstanceOf(Array);
      expect(queryKeys.cattle.all).toBeInstanceOf(Array);
    });
  });

  describe('Key structure', () => {
    it('should follow consistent naming pattern', () => {
      // All entities should have 'all' key
      const entities = [
        'auth', 'dashboard', 'cattle', 'events', 'treatments',
        'purchases', 'suppliers', 'herdBooks', 'users', 'owners',
        'status', 'medicaments', 'herdBookCattle', 'categories',
        'eventTypes', 'characters'
      ];

      entities.forEach(entity => {
        const entityKeys = queryKeys[entity as keyof typeof queryKeys];
        expect(entityKeys).toHaveProperty('all');
      });
    });

    it('should have details function for entities that support it', () => {
      const entitiesWithDetails = [
        'cattle', 'events', 'treatments', 'purchases', 'suppliers',
        'herdBooks', 'users', 'owners', 'status', 'medicaments',
        'herdBookCattle', 'categories', 'eventTypes', 'characters'
      ] as const;

      entitiesWithDetails.forEach(entity => {
        const entityKeys = queryKeys[entity];
        expect(entityKeys).toHaveProperty('details');
        expect(typeof entityKeys.details).toBe('function');
      });
    });
  });
});
