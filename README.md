# 🐮 Ombiko (Cow Care Front)

Application de gestion d'élevage bovin moderne, construite avec React, TypeScript et Vite.

## 🚀 Fonctionnalités

- **Tableau de bord** : Vue d'ensemble du troupeau, statistiques de santé et événements récents.
- **Gestion du Troupeau** : Suivi détaillé de chaque animal (santé, reproduction, généalogie).
- **Authentification** : Système de connexion sécurisé avec gestion des rôles (Admin/Utilisateur).
- **Interface Responsive** : Optimisée pour mobile, tablette et desktop.

## 🛠 Technologies

- **Core** : React 18, TypeScript, Vite
- **State Management** : React Query (TanStack Query)
- **UI/UX** : Tailwind CSS, shadcn/ui, Lucide Icons
- **Routing** : React Router DOM
- **Feedback** : Sonner (Toasts)

## 🏗 Architecture et Optimisations

Le projet suit une architecture modulaire et a bénéficié d'optimisations majeures :

- **Performance** :
  - Gestion optimisée du cache avec QueryClient
  - Mémorisation des composants et fonctions critiques (useCallback, memo)
  - Lazy loading des ressources
- **Code Quality** :
  - Typage strict TypeScript (pas de `any`)
  - Hooks personnalisés (ex: `useRecentEvents`)
  - Constantes centralisées pour la maintenance

## 📦 Installation

1. Cloner le dépôt :
```bash
git clone <votre-repo>
cd cow-care-front
```

2. Installer les dépendances :
```bash
npm install
```

3. Lancer le serveur de développement :
```bash
npm run dev
```

## 🧪 Scripts

- `npm run dev` : Lance le serveur de développement
- `npm run build` : Compile l'application pour la production
- `npm run preview` : Prévisualise la version de production
- `npm run lint` : Vérifie la qualité du code

## 📄 Structure du Projet

```
src/
├── admin/          # Interface d'administration
├── assets/         # Images et ressources statiques
├── components/     # Composants réutilisables (UI, Layout)
├── constants/      # Constantes globales (UI, Config)
├── data/           # Données mockées (pour le développement)
├── features/       # Modules fonctionnels (Auth, Cattle, etc.)
├── hooks/          # Hooks personnalisés
├── pages/          # Pages principales
├── types/          # Définitions de types TypeScript
└── lib/            # Utilitaires et configurations
```
