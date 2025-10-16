# Structure des Features

Cette application est organisée selon une architecture basée sur les fonctionnalités (feature-based architecture). Chaque fonctionnalité est regroupée dans son propre dossier avec ses types, services, hooks et composants.

## Structure

```
src/features/
├── cattle/              # Gestion du bétail
│   ├── types.ts         # Types TypeScript (Cattle, CattleEvent, Treatment, User)
│   ├── services.ts      # Services API pour les bovins
│   ├── hooks.ts         # Hooks React personnalisés (useCattle, useCattleById)
│   ├── components/      # Composants React spécifiques
│   │   └── CattleCard.tsx
│   ├── pages/           # Pages de l'application
│   │   ├── CattlePage.tsx
│   │   └── CattleDetailsPage.tsx
│   └── index.ts         # Exports publics de la feature
│
├── events/              # Gestion des types d'événements
│   ├── types.ts         # Types TypeScript (TypeEvenement)
│   ├── utils.ts         # Utilitaires (mock data, helpers)
│   └── index.ts         # Exports publics
│
├── treatments/          # Gestion des traitements et médicaments
│   ├── types/           # Types organisés par sous-domaine
│   │   ├── medicament.ts
│   │   └── veterinarian.ts
│   ├── utils.ts         # Utilitaires (mock data, helpers)
│   └── index.ts         # Exports publics
│
└── auth/                # Authentification et gestion des utilisateurs
    ├── services.ts      # Services d'authentification
    ├── AuthContext.tsx  # Context React pour l'auth
    ├── pages/           # Pages d'authentification
    │   ├── LoginPage.tsx
    │   └── ProfilePage.tsx
    └── index.ts         # Exports publics
```

## Avantages de cette structure

1. **Cohésion élevée** : Tout ce qui concerne une fonctionnalité est au même endroit
2. **Couplage faible** : Les features sont indépendantes les unes des autres
3. **Facilité de maintenance** : Plus facile de trouver et modifier du code
4. **Scalabilité** : Facile d'ajouter de nouvelles features sans impacter les existantes
5. **Imports propres** : Utilisation de fichiers index.ts pour des imports simples

## Comment utiliser

### Importer depuis une feature

```typescript
// Au lieu de multiples imports
import { Cattle } from '@/types/cattle';
import { useCattle } from '@/hooks/useCattle';
import { CattleCard } from '@/components/CattleCard';

// Utilisez les exports groupés
import { Cattle, useCattle } from '@/features/cattle';
import { CattleCard } from '@/features/cattle/components/CattleCard';
```

### Ajouter une nouvelle feature

1. Créer un nouveau dossier dans `src/features/`
2. Ajouter les fichiers nécessaires (types, services, etc.)
3. Créer un `index.ts` pour exporter les éléments publics
4. Importer depuis la feature dans vos composants

## Dossiers partagés

- `src/components/ui/` : Composants UI réutilisables (Shadcn)
- `src/lib/` : Utilitaires génériques
- `src/hooks/` : Hooks React génériques (use-toast, use-mobile, etc.)
- `src/admin/` : Back-office React Admin (structure séparée)
- `src/data/` : Données mockées pour le développement
- `src/pages/` : Pages génériques (HomePage, NotFound)
