# 🐮 Ombiko - Frontend (Cow Care Front)

Application de gestion d'élevage bovin moderne, construite avec React, TypeScript et Vite.

## 📋 Table des Matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Démarrage](#-démarrage)
- [Scripts](#-scripts)
- [Architecture](#-architecture)
- [Développement](#-développement)
- [Dépannage](#-dépannage)

## 🚀 Fonctionnalités

- **Tableau de bord** : Vue d'ensemble du troupeau, statistiques de santé et événements récents
- **Gestion du Troupeau** : 
  - Suivi détaillé de chaque animal (santé, reproduction, généalogie)
  - Numéros de livre de troupeau
  - Gestion des achats et naissances
- **Événements** :
  - Enregistrement des traitements vétérinaires
  - Suivi des événements (naissances, maladies, etc.)
  - Historique complet par animal
- **Données de Référence** :
  - Catégories de bovins
  - Caractères (races)
  - Types d'événements
  - Vétérinaires
  - Produits/Médicaments
- **Authentification** : Système de connexion sécurisé avec gestion des rôles (Admin/Utilisateur)
- **Interface d'Administration** : Gestion complète des données de référence
- **Export de Données** : Export PDF des informations du troupeau
- **Interface Responsive** : Optimisée pour mobile, tablette et desktop

## 🛠 Technologies

- **Core** : React 18, TypeScript, Vite
- **State Management** : React Query (TanStack Query)
- **UI/UX** : Tailwind CSS, shadcn/ui, Lucide Icons
- **Routing** : React Router DOM
- **Feedback** : Sonner (Toasts)
- **Forms** : React Hook Form
- **Export** : jsPDF

### Architecture et Optimisations

Le projet suit une architecture modulaire avec des optimisations majeures :

- **Performance** :
  - Gestion optimisée du cache avec QueryClient
  - Mémorisation des composants et fonctions critiques (useCallback, memo)
  - Lazy loading des ressources
- **Code Quality** :
  - Typage strict TypeScript (pas de `any`)
  - Hooks personnalisés (ex: `useRecentEvents`)
  - Constantes centralisées pour la maintenance
  - Services API modulaires

## 🔧 Prérequis

- **Node.js** 18 ou supérieur
- **npm** ou **yarn**
- **Backend API** en cours d'exécution (voir [cow-care-backend](../cow-care-backend/README.md))

## 📦 Installation

### 1. Naviguer vers le répertoire

```bash
cd cow-care-front
```

### 2. Installer les dépendances

```bash
npm install
```

## ⚙️ Configuration

### 1. Créer le fichier de configuration

```bash
cp .env.example .env
```

### 2. Configurer les variables d'environnement

Éditez le fichier `.env` :

```env
# URL de l'API Backend
VITE_API_URL=http://localhost:8000

# URL de l'API Admin (si différente)
VITE_ADMIN_API_URL=http://localhost:8000/admin

# Activer/Désactiver les données mockées
VITE_USE_MOCK=false
```

> [!IMPORTANT]
> **Configuration de l'URL de l'API** :
> - L'URL doit correspondre au backend (par défaut `http://localhost:8000`)
> - Ne pas inclure de slash final
> - Mettre `VITE_USE_MOCK=false` pour utiliser la vraie API

## 🚀 Démarrage

### Mode Développement

```bash
npm run dev
```

L'application sera accessible sur **http://localhost:8080** (ou le port indiqué dans le terminal)

### Mode Production

```bash
# Compiler l'application
npm run build

# Prévisualiser la version de production
npm run preview
```

## 🧪 Scripts

```bash
# Lancer le serveur de développement
npm run dev

# Compiler l'application pour la production
npm run build

# Prévisualiser la version de production
npm run preview

# Vérifier la qualité du code
npm run lint

# Corriger automatiquement les problèmes de lint
npm run lint:fix

# Vérifier les types TypeScript
npm run type-check
```

## 📄 Architecture

### Structure du Projet

```
src/
├── admin/                    # Interface d'administration
│   ├── components/          # Composants admin
│   └── pages/               # Pages admin
├── assets/                  # Images et ressources statiques
├── components/              # Composants réutilisables
│   ├── ui/                 # Composants UI (shadcn/ui)
│   └── layout/             # Composants de mise en page
├── config/                  # Configuration
│   └── api.ts              # Configuration de l'API
├── constants/               # Constantes globales
│   ├── ui.ts               # Constantes UI
│   └── config.ts           # Configuration
├── features/                # Modules fonctionnels
│   ├── auth/               # Authentification
│   │   ├── components/     # Composants auth
│   │   ├── services/       # Services auth
│   │   └── types/          # Types auth
│   ├── cattle/             # Gestion du troupeau
│   │   ├── components/     # Composants cattle
│   │   ├── services/       # Services cattle
│   │   └── types/          # Types cattle
│   ├── dashboard/          # Tableau de bord
│   ├── events/             # Événements
│   └── references/         # Données de référence
├── hooks/                   # Hooks personnalisés
│   ├── useRecentEvents.ts
│   └── useAuth.ts
├── pages/                   # Pages principales
│   ├── DashboardPage.tsx
│   ├── CattleListPage.tsx
│   ├── CattleDetailsPage.tsx
│   └── LoginPage.tsx
├── services/                # Services API
│   ├── cattleService.ts
│   ├── eventService.ts
│   ├── referenceService.ts
│   └── authService.ts
├── types/                   # Définitions de types TypeScript
│   ├── cattle.ts
│   ├── event.ts
│   └── reference.ts
├── lib/                     # Utilitaires et configurations
│   └── utils.ts
├── App.tsx                  # Composant principal
└── main.tsx                 # Point d'entrée
```

### Flux de Données

1. **Composants** → appellent les **Hooks** ou **Services**
2. **Services** → font des requêtes HTTP à l'**API Backend**
3. **React Query** → gère le cache et l'état des données
4. **Types TypeScript** → assurent la cohérence des données

## 💻 Développement

### Conventions de Code

- **Composants** : PascalCase (ex: `CattleList.tsx`)
- **Hooks** : camelCase avec préfixe `use` (ex: `useRecentEvents.ts`)
- **Services** : camelCase avec suffixe `Service` (ex: `cattleService.ts`)
- **Types** : PascalCase (ex: `Cattle`, `Event`)
- **Constantes** : UPPER_SNAKE_CASE (ex: `API_BASE_URL`)

### Ajouter un Nouveau Composant shadcn/ui

```bash
npx shadcn-ui@latest add <component-name>
```

### Gestion de l'État

Le projet utilise **React Query** pour la gestion de l'état serveur :

```typescript
// Exemple d'utilisation
import { useQuery } from '@tanstack/react-query';
import { cattleService } from '@/services/cattleService';

const { data, isLoading, error } = useQuery({
  queryKey: ['cattle'],
  queryFn: cattleService.getAll,
});
```

### Authentification

L'authentification utilise JWT stocké dans `localStorage` :

```typescript
import { useAuth } from '@/hooks/useAuth';

const { user, login, logout, isAuthenticated } = useAuth();
```

## 🐛 Dépannage

### Problème : Le frontend ne se connecte pas au backend

**Erreur** : `Network Error` ou `Failed to fetch`

**Solution** :
1. Vérifier que le backend est démarré : http://localhost:8000/docs
2. Vérifier `VITE_API_URL` dans `.env`
3. Vérifier que le port correspond (8000 par défaut)
4. Vérifier la configuration CORS du backend

### Problème : Erreur CORS

**Erreur** : `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution** :
1. Vérifier que le backend autorise l'origine du frontend dans `CORS_ORIGINS`
2. Redémarrer le backend après modification

### Problème : Les données ne s'affichent pas

**Solution** :
1. Ouvrir les DevTools (F12) → Console pour voir les erreurs
2. Vérifier l'onglet Network pour voir les requêtes API
3. Vérifier que `VITE_USE_MOCK=false` dans `.env`
4. Vérifier que le backend a des données (charger les fixtures)

### Problème : Erreur de compilation TypeScript

**Erreur** : `Type 'X' is not assignable to type 'Y'`

**Solution** :
```bash
# Vérifier les types
npm run type-check

# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Problème : Port déjà utilisé

**Erreur** : `Port 8080 is already in use`

**Solution** :
```bash
# Arrêter le processus
fuser -k -n tcp 8080

# Ou utiliser un autre port
npm run dev -- --port 3000
```

### Problème : Les modifications ne sont pas prises en compte

**Solution** :
```bash
# Arrêter le serveur (Ctrl+C)
# Nettoyer le cache
rm -rf node_modules/.vite

# Relancer
npm run dev
```

### Activer les logs de debug

Dans le fichier `src/config/api.ts`, vous pouvez activer les logs :

```typescript
// Ajouter des intercepteurs pour logger les requêtes
axios.interceptors.request.use(request => {
  console.log('Starting Request', request);
  return request;
});
```

## 🔐 Sécurité

> [!WARNING]
> **Bonnes pratiques** :
> - Ne jamais commiter le fichier `.env`
> - Ne jamais stocker de secrets dans le code
> - Utiliser HTTPS en production
> - Valider toutes les entrées utilisateur
> - Gérer correctement les erreurs d'authentification

## 📝 Licence

Propriétaire - Ombiko

---

Pour plus d'informations, consultez le [README principal](../README.md) du projet.
