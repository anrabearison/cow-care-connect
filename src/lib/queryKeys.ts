/**
 * Query keys centralisées pour TanStack Query
 * Permet une gestion cohérente du cache et de l'invalidation
 */

/**
 * Clés de base pour les différentes entités
 */
export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    user: () => ['auth', 'user'] as const,
    providers: () => ['auth', 'providers'] as const,
  },

  // Dashboard
  dashboard: {
    all: ['dashboard'] as const,
    stats: (ownerId?: string | null) => ['dashboard', 'stats', ownerId] as const,
  },

  // Cattle
  cattle: {
    all: ['cattle'] as const,
    lists: () => ['cattle', 'list'] as const,
    list: (filters: Record<string, unknown>) => ['cattle', 'list', filters] as const,
    details: (id: string | number) => ['cattle', 'details', id] as const,
    statistics: (id: string | number) => ['cattle', 'statistics', id] as const,
    birth: (motherId: string | number) => ['cattle', 'birth', motherId] as const,
  },

  // Events
  events: {
    all: ['events'] as const,
    lists: () => ['events', 'list'] as const,
    list: (filters: Record<string, unknown>) => ['events', 'list', filters] as const,
    details: (id: string | number) => ['events', 'details', id] as const,
    recent: (ownerId?: string | null) => ['events', 'recent', ownerId] as const,
  },

  // Treatments
  treatments: {
    all: ['treatments'] as const,
    lists: () => ['treatments', 'list'] as const,
    list: (filters: Record<string, unknown>) => ['treatments', 'list', filters] as const,
    details: (id: string | number) => ['treatments', 'details', id] as const,
  },

  // Purchases
  purchases: {
    all: ['purchases'] as const,
    lists: () => ['purchases', 'list'] as const,
    list: (filters: Record<string, unknown>) => ['purchases', 'list', filters] as const,
    details: (id: string | number) => ['purchases', 'details', id] as const,
  },

  // Suppliers
  suppliers: {
    all: ['suppliers'] as const,
    lists: () => ['suppliers', 'list'] as const,
    list: (filters: Record<string, unknown>) => ['suppliers', 'list', filters] as const,
    details: (id: string | number) => ['suppliers', 'details', id] as const,
  },

  // Herd Books
  herdBooks: {
    all: ['herdBooks'] as const,
    lists: () => ['herdBooks', 'list'] as const,
    list: (filters: Record<string, unknown>) => ['herdBooks', 'list', filters] as const,
    details: (id: string | number) => ['herdBooks', 'details', id] as const,
    cattle: (herdBookId: string | number) => ['herdBooks', 'cattle', herdBookId] as const,
    byOwner: (ownerId?: string) => ['herdBooks', 'byOwner', ownerId] as const,
    reference: () => ['herdBooks', 'reference'] as const,
  },

  // Cattle History
  cattleHistory: {
    byCattleId: (cattleId: string) => ['cattleHistory', cattleId] as const,
  },

  // Users
  users: {
    all: ['users'] as const,
    lists: () => ['users', 'list'] as const,
    list: (filters: Record<string, unknown>) => ['users', 'list', filters] as const,
    details: (id: string | number) => ['users', 'details', id] as const,
  },

  // Owners
  owners: {
    all: ['owners'] as const,
    lists: () => ['owners', 'list'] as const,
    list: (filters: Record<string, unknown>) => ['owners', 'list', filters] as const,
    details: (id: string | number) => ['owners', 'details', id] as const,
  },

  // Status
  status: {
    all: ['status'] as const,
    lists: () => ['status', 'list'] as const,
    list: (filters: Record<string, unknown>) => ['status', 'list', filters] as const,
    details: (id: string | number) => ['status', 'details', id] as const,
    reference: () => ['status', 'reference'] as const,
  },

  // Medicaments
  medicaments: {
    all: ['medicaments'] as const,
    lists: () => ['medicaments', 'list'] as const,
    list: (filters: Record<string, unknown>) => ['medicaments', 'list', filters] as const,
    details: (id: string | number) => ['medicaments', 'details', id] as const,
  },

  // Herd Book Cattle
  herdBookCattle: {
    all: ['herdBookCattle'] as const,
    lists: () => ['herdBookCattle', 'list'] as const,
    list: (filters: Record<string, unknown>) => ['herdBookCattle', 'list', filters] as const,
    details: (id: string | number) => ['herdBookCattle', 'details', id] as const,
  },

  // Categories
  categories: {
    all: ['categories'] as const,
    lists: () => ['categories', 'list'] as const,
    details: (id: string | number) => ['categories', 'details', id] as const,
    reference: () => ['categories', 'reference'] as const,
  },

  // Event Types
  eventTypes: {
    all: ['eventTypes'] as const,
    lists: () => ['eventTypes', 'list'] as const,
    details: (id: string | number) => ['eventTypes', 'details', id] as const,
  },

  // Characters
  characters: {
    all: ['characters'] as const,
    lists: () => ['characters', 'list'] as const,
    details: (id: string | number) => ['characters', 'details', id] as const,
  },

  // Veterinarians
  veterinarians: {
    all: ['veterinarians'] as const,
    lists: () => ['veterinarians', 'list'] as const,
    details: (id: string | number) => ['veterinarians', 'details', id] as const,
  },
} as const;
