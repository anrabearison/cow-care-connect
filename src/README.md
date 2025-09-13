# Système de Gestion du Bétail

Une application moderne de gestion du troupeau développée avec React, TypeScript et Tailwind CSS.

## Fonctionnalités

- **Gestion du troupeau**: Suivi complet des animaux avec photos, informations et historique
- **Administration**: Interface d'administration avec React Admin
- **Authentification**: Système de connexion sécurisé avec rôles utilisateurs
- **Historique**: Suivi des événements et traitements pour chaque animal
- **Responsive**: Interface adaptée aux mobiles et tablettes

## Architecture des données

L'application est conçue pour basculer facilement entre données de test et vraies APIs :

### Mode développement (données mockées)
- Utilise `src/data/mockData.ts` pour les données de test
- Authentification simulée avec latence réseau
- Parfait pour le développement et les démonstrations

### Mode production (vraies APIs)
- Se connecte aux vraies APIs configurées dans `src/config/api.ts`
- Authentification JWT avec refresh token
- Gestion d'erreurs complète

### Configuration

Les URLs d'API peuvent être configurées via les variables d'environnement :

```env
# URL de base pour les APIs
VITE_API_URL=https://api.ferme-mg.com

# URL pour l'administration React Admin
VITE_ADMIN_API_URL=https://api.ferme-mg.com/admin
```

### Services disponibles

- **CattleService**: Gestion CRUD complète des bovins
- **AuthService**: Authentification et gestion des sessions
- **Hooks React**: `useCattle`, `useCattleById` pour une intégration facile

### Basculement automatique

L'application bascule automatiquement entre mock et vraies données selon :
- `import.meta.env.DEV` : true en développement, false en production
- Configuration dans `src/config/api.ts`

## Installation

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Build pour la production
npm run build
```

## Structure du projet

```
src/
├── config/          # Configuration API et environnement
├── services/        # Services pour l'accès aux données
├── hooks/           # Hooks React personnalisés
├── data/            # Données mockées pour le développement
├── pages/           # Pages de l'application
├── components/      # Composants réutilisables
├── admin/           # Interface d'administration
└── types/           # Types TypeScript
```

## Technologies

- **React 18** avec TypeScript
- **Tailwind CSS** pour le styling
- **React Admin** pour l'interface d'administration
- **React Router** pour la navigation
- **Radix UI** pour les composants de base
- **Vite** comme bundler