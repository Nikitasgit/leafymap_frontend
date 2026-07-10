# Documentation Frontend - Leafy Map

ttes
Application web de **découverte d'événements locaux** : carte interactive, agenda, profils d'organisateurs et gestion d'événements.

## 📑 Table des matières

1. [🚀 Commandes de base](#-commandes-de-base)
2. [📁 Architecture du projet](#-architecture-du-projet)
3. [🌍 Internationalisation (i18n)](#-internationalisation-i18n)
   - [Configuration](#configuration)
   - [Structure des routes](#structure-des-routes)
   - [Fonctionnement](#fonctionnement)
   - [Fichiers de traduction](#fichiers-de-traduction)
   - [Changement de langue](#changement-de-langue)
4. [🔑 Fonctionnalités principales](#-fonctionnalités-principales)
   - [Authentification](#1-authentification)
   - [Gestion d'état global (Redux)](#2-gestion-détat-global-redux)
   - [Hooks personnalisés](#3-hooks-personnalisés-30-hooks)
   - [Composants principaux](#4-composants-principaux)
   - [Pages et routes](#5-pages-et-routes)
   - [Intégrations](#6-intégrations)
5. [🎨 Styling](#-styling)
6. [🛠️ Conventions de code](#️-conventions-de-code)
   - [TypeScript](#typescript)
   - [Composants React](#composants-react)
   - [Hooks personnalisés](#hooks-personnalisés)
   - [Fichiers et dossiers](#fichiers-et-dossiers)
7. [🔧 Configuration](#-configuration)
8. [📦 Dépendances principales](#-dépendances-principales)
9. [🔄 Workflow de développement](#-workflow-de-développement)
10. [📝 Notes importantes](#-notes-importantes)
    - [SEO](#seo)
    - [Performance](#performance)
    - [Accessibilité](#accessibilité)
    - [Mobile](#mobile)
11. [🚢 Déploiement](#-déploiement)

---

## 🚀 Commandes de base

```bash
# Installation des dépendances
npm install

# Développement (port 3000 par défaut)
npm run dev

# Build de production
npm run build

# Démarrage en production
npm start

# Linting
npm run lint
```

## 📁 Architecture du projet

```
innovastay-frontend/
├── src/
│   ├── app/                    # App Router Next.js 15
│   │   ├── [locale]/          # Routes internationalisées
│   │   ├── i18n.ts            # Configuration i18n
│   │   └── sitemap.ts         # Génération sitemap
│   ├── components/            # Composants React réutilisables
│   ├── hooks/                 # Custom hooks
│   ├── store/                 # Redux Toolkit (state global)
│   ├── types/                 # Types TypeScript
│   ├── utils/                 # Fonctions utilitaires
│   ├── validations/           # Schémas de validation
│   ├── styles/                # Styles SCSS globaux
│   ├── middleware.ts          # Middleware Next.js
│   └── i18nConfig.ts          # Config des locales
├── public/
│   ├── locales/               # Fichiers de traduction
│   │   ├── fr/
│   │   │   ├── common.json
│   │   │   ├── marketing.json
│   │   │   └── subscription.json
│   │   └── en/
│   └── images/                # Images statiques
└── next.config.ts             # Configuration Next.js
```

## 🌍 Internationalisation (i18n)

### Configuration

- **Librairies** : `i18next`, `react-i18next`, `next-i18n-router`
- **Locales supportées** : Français (fr), Anglais (en)
- **Locale par défaut** : Français
- **Détection désactivée** : Locale explicite dans l'URL

### Structure des routes

```
/fr/...          # Routes en français
/en/...          # Routes en anglais
/fr/places       # Exemple : page des lieux en français
/en/places       # Exemple : page des lieux en anglais
```

### Fonctionnement

#### 1. Middleware (`middleware.ts`)

```typescript
// Intercepte toutes les requêtes et ajoute la locale à l'URL
export async function middleware(request: NextRequest) {
  const i18nResponse = i18nRouter(request, i18nConfig);
  return i18nResponse;
}
```

- **Redirection automatique** : `/` → `/fr/` (locale par défaut)
- **Préservation de la locale** : Navigation maintient la langue choisie
- **Exclut** : API, fichiers statiques, images

#### 2. Configuration (`i18nConfig.ts`)

```typescript
export const i18nConfig = {
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localeDetection: false, // Pas de détection auto
};
```

#### 3. Initialisation (`app/i18n.ts`)

- **Chargement dynamique** : Traductions importées à la demande
- **Namespaces** : `common`, `subscription`, `marketing`
- **Fallback** : Français si traduction manquante

#### 4. Provider (`components/Providers.tsx`)

```typescript
// Initialise i18next pour toute l'application
<I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
```

#### 5. Utilisation dans les composants

```typescript
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();

  return <h1>{t("welcome")}</h1>; // "Bienvenue sur mon site !"
}
```

### Fichiers de traduction

#### `public/locales/fr/common.json`

```json
{
  "nav": {
    "home": "Accueil",
    "map": "Carte",
    "messages": "Messages",
    "account": "Compte"
  },
  "placeTypes": {
    "food": "Alimentaire",
    "art": "Art",
    "craft": "Artisanat"
  }
}
```

#### Ajout de nouvelles traductions

1. Créer/modifier `public/locales/{locale}/{namespace}.json`
2. Ajouter le namespace dans `Providers.tsx` si nouveau
3. Utiliser `t("key")` dans les composants

### Changement de langue

```typescript
// URL-based : navigation directe
<Link href="/en/places">Switch to English</Link>

// L'utilisateur navigue entre /fr/... et /en/...
```

## 🔑 Fonctionnalités principales

### 1. Authentification

#### Système d'authentification

- **Redux state** : `authSlice.ts` gère l'état auth
- **Protected routes** : Redirection si non authentifié

#### Processus de connexion

1. **Formulaire** : Email/username + password
2. **Requête API** : `/api/auth/signin`
3. **Cookie** : Token JWT stocké automatiquement
4. **Redux** : User data chargée dans le store
5. **Redirection** : Vers la page account

#### Types d'utilisateurs et permissions

##### Guest (Invité)

- ✅ Consulter les lieux et événements
- ✅ Créer un profil **Creator** ou **Organizer**
- ❌ Créer des lieux
- ❌ Créer des événements

##### Creator (Créateur/Artisan)

- ✅ Créer **1 seul lieu** maximum (limite globale : 1 lieu par utilisateur)
- ✅ Créer des événements sur son lieu
- ✅ **Accepter/refuser** les demandes de partnership
- ❌ Créer des partnerships
- ✅ Profil avec nom d'artiste et catégories

##### Organizer (Organisateur)

- ✅ Créer **1 seul lieu** maximum (limite globale : 1 lieu par utilisateur)
- ✅ Créer des événements
- ✅ **Envoyer** des demandes de partnership
- ❌ Modifier le statut des partnerships

### 2. Gestion d'état global (Redux)

- **Store** : `src/store/index.ts`
- **Slices** :
  - `authSlice` : Utilisateur connecté, tokens
  - `appSlice` : État global de l'application

### 3. Hooks personnalisés (30+ hooks)

#### Authentification & Utilisateurs

- `useAuth()` : Gestion de l'authentification
- `useCurrentUser()` : Récupération de l'utilisateur connecté
- `useUser(userId)` : Récupération d'un utilisateur par ID
- `useRegister()` : Inscription d'un nouvel utilisateur
- `useSubmitUser()` : Mise à jour du profil utilisateur
- `useDeleteAccount()` : Suppression du compte

#### Places & Events

- `usePlace(placeId)` : Récupération d'un lieu
- `useFindPlaces()` : Recherche de lieux
- `usePlacesInView()` : Lieux visibles sur la carte
- `useSubmitPlace()` : Création/modification d'un lieu
- `useDeletePlace()` : Suppression d'un lieu
- `useEvent(eventId)` : Récupération d'un événement
- `usePlaceEvents()` : Événements d'un lieu
- `useSubmitEvent()` : Création/modification d'un événement
- `useDeleteEvent()` : Suppression d'un événement

#### Partnerships

#### Images

- `useImages()` : Images (peut filtrer par type : gallery, profile, cover, other)
- `useSubmitImages()` : Upload d'images
- `useDeleteImages()` : Suppression d'images

#### Utilitaires

- `useGeolocation()` : Position GPS
- `useToast()` : Notifications toast
- `useHandleApiErrors()` : Gestion centralisée des erreurs API
- `useLoading()` : État de chargement
- `useFindCreatorInPlaces()` : Recherche de créateurs
- `useFindUsers()` : Recherche d'utilisateurs

### 4. Composants principaux

- **Navbar** : Navigation responsive avec i18n
- **ConditionalFooter** : Footer adaptatif
- **AppInitializer** : Initialisation de l'app au chargement
- **Providers** : Wrapping Redux + i18n + Toaster

### 5. Pages et routes

#### Routes publiques

- `/[locale]` : Page d'accueil
- `/[locale]/places/[placeId]` : Détail d'un lieu
- `/[locale]/events/[eventId]` : Détail d'un événement
- `/[locale]/map` : Carte interactive
- `/[locale]/users/[userId]` : Profil public

#### Routes authentifiées

- `/[locale]/account` : Compte utilisateur
- `/[locale]/account/create` : Créer un profil Creator/Organizer (Guest uniquement)
- `/[locale]/account/update-creator` : Modifier profil Creator
- `/[locale]/account/settings` : Paramètres du compte
- `/[locale]/account/places/create` : Créer un lieu (1 max par utilisateur)
- `/[locale]/account/places/[placeId]` : Gérer un lieu (propriétaire uniquement)
- `/[locale]/account/places/[placeId]/events/create` : Créer un événement
- `/[locale]/account/places/[placeId]/events/[eventId]` : Modifier un événement
- `/[locale]/messages` : Messagerie

### 6. Intégrations

#### Mapbox GL

- **Librairie** : `mapbox-gl`, `react-map-gl`
- **Carte interactive** : Visualisation des lieux
- **Géolocalisation** : Recherche par position

#### Vercel Analytics

- **Analytics** : Suivi des performances
- **Speed Insights** : Métriques de vitesse

#### React DatePicker

- **Sélection de dates** : Pour les événements
- **Intégration** : Avec `date-fns`

#### Sonner (Toaster)

- **Notifications** : Toast personnalisés
- **Position** : Bottom-right
- **Thème** : Personnalisé avec styles

## 🎨 Styling

### SCSS Modules

- **Structure** : Un fichier `.scss` par composant
- **Modules CSS** : Styles scopés automatiquement
  - Les classes CSS sont transformées en identifiants uniques à la compilation
  - Exemple : `.button` devient `.HomePage_button__a3x2K` automatiquement
  - Évite les conflits de noms entre composants
  - Import : `import styles from './Component.module.scss'`
  - Usage : `<div className={styles.button}>`
- **Variables globales** : Dans `src/styles/`

### Thème

- **Palette** : Définie dans Figma puis CSS
- **Typography** : Police Roboto (Google Fonts),
- **Responsive** : Mobile-first approach

## 🛠️ Conventions de code

### TypeScript

- **Mode strict** : Typage rigoureux
- **Path alias** : `@/*` → `src/*`
- **Interfaces** : **SANS préfixe `I`** pour différencier du backend (ex: `User` au lieu de `IUser`)

#### Interfaces normales vs Populated

Le frontend utilise deux types d'interfaces pour gérer les données venant de l'API :

##### Interfaces normales

Correspondent aux données **brutes** venant de la base de données avec les IDs de référence.

```typescript
// types/user.ts
interface User {
  _id: string;
  username: string;
  email: string;
  image: string; // ID de l'image
  places: string[]; // Tableau d'IDs de places
  creatorCategories: string[]; // IDs des subcategories
}
```

##### Interfaces Populated

Utilisées quand les références sont **peuplées** avec les objets complets par l'API.

```typescript
// types/user.ts
interface UserPopulated
  extends Omit<User, "image" | "places" | "creatorCategories"> {
  image: Image; // Objet Image complet avec urls
  places: Place[]; // Objets Place complets
  creatorCategories: SubCategory[]; // Objets SubCategory complets
}
```

##### Utilisation dans les composants

```typescript
// Données non populées
const user: User = await fetchUser(id);
console.log(user.image); // string (ID)

// Données populées
const userWithDetails: UserPopulated = await fetchUserWithDetails(id);
console.log(userWithDetails.image.urls.original); // Accès direct aux URLs
console.log(userWithDetails.places[0].name); // Accès direct au nom du lieu
```

##### Convention de nommage

- **Interface de base** : `User`, `Place`, `Event` (SANS préfixe `I`)
- **Interface populated** : `UserPopulated`, `PlacePopulated`, `EventPopulated`
- **Différence avec backend** : Backend utilise `IUser`, frontend utilise `User`
- Utiliser le bon type selon ce que l'API retourne

### Composants React

- **Nommage** : PascalCase (ex: `UserProfile.tsx`)
- **Structure** :

  ```typescript
  interface Props { ... }

  export default function Component({ props }: Props) {
    return ...
  }
  ```

- **Hooks au début** : Avant la logique métier
- **Export default** : Pour les composants pages/layouts

### Hooks personnalisés

- **Nommage** : Préfixe `use` (ex: `useAuth.ts`)
- **Réutilisables** : Logique extraite des composants
- **Return** : Objet ou tuple selon le cas

### Fichiers et dossiers

#### Fichiers

- **Composants** : `ComponentName.tsx` (PascalCase)
- **Hooks** : `useHookName.ts` (camelCase)
- **Types** : `typeName.ts` (camelCase)
- **Utils** : `utilName.ts` (camelCase)

#### Dossiers

##### Dossiers de composants (PascalCase)

Quand un dossier regroupe un composant avec ses fichiers associés :

```
Button/
  ├── Button.tsx          # Composant principal
  ├── index.ts            # Export du composant
  ├── Button.module.scss  # Styles
  └── Button.types.ts     # Types (optionnel)
```

**Convention** : Nom en **PascalCase** (`Button`, `UserProfile`, `EventCard`)

##### Autres dossiers (camelCase)

Pour les dossiers utilitaires, hooks, types, etc. :

```
hooks/
  ├── useAuth.ts
  └── useToast.ts

utils/
  ├── formatDate.ts
  └── apiClient.ts

validations/
  ├── userSchema.ts
  └── placeSchema.ts
```

**Convention** : Nom en **camelCase** (`hooks`, `utils`, `validations`, `constants`)

##### Résumé

- **PascalCase** : Dossiers de composants (contenant composant + index + styles + types)
- **camelCase** : Tous les autres dossiers (hooks, utils, types, validations, etc.)

## 🔧 Configuration

### Variables d'environnement

```env
NEXT_PUBLIC_API_URL=https://...
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx...
```

### Next.js

- **Version** : 15.3.2 (App Router)
- **React** : 19.0.0
- **Node** : 20.x (engine requis)
- **SSR** : Par défaut pour les pages
- **Image optimization** : Composant `<Image>`

## 📦 Dépendances principales

- **Next.js** : Framework React
- **React** : Bibliothèque UI
- **Redux Toolkit** : State management
- **i18next** : Internationalisation
- **Axios** : Requêtes HTTP
- **Zod** : Validation côté client
- **Mapbox GL** : Cartographie
- **SCSS** : Préprocesseur CSS
- **Lucide React** : Icônes
- **Sonner** : Toast notifications

## 🔄 Workflow de développement

1. **Créer une feature branch** depuis `main`
2. **Développer** avec hot-reload (`npm run dev`)
3. **Tester** dans les deux locales (fr/en)
4. **Build local** pour vérifier (`npm run build`)
5. **Commit** et push
6. **Deploy preview** automatique sur Vercel

## 📝 Notes importantes

### SEO

- **Sitemap** : Généré automatiquement (`app/sitemap.ts`)
- **Robots.txt** : Dans `public/`
- **Metadata** : Configurée par page
- **Locales** : URLs différentes par langue

### Performance

- **Image optimization** : Utiliser `<Image>` de Next
- **Lazy loading** : Pour composants lourds

### Accessibilité

L'application respecte les standards d'accessibilité suivants :

#### Règles minimales obligatoires

##### Typographie

- **Taille minimum** : `12px` pour toutes les polices
- Jamais de texte en dessous de cette taille pour garantir la lisibilité
- Tailles recommandées :
  - Texte courant : 14-16px
  - Titres : 18px et plus

##### Contraste des couleurs

- Vérifier tous les contrastes texte/fond avec un outil (ex: Lighthouse)
- Éviter le texte gris clair sur fond blanc

##### Boutons et éléments interactifs

- **ARIA labels obligatoires** : Chaque bouton doit avoir un `aria-label` descriptif

```typescript
// ✅ Bon
<button aria-label="Fermer le menu">
  <CloseIcon />
</button>

// ❌ Mauvais (pas d'aria-label avec icône seule)
<button>
  <CloseIcon />
</button>
```

- Boutons cliquables au clavier (Enter/Space)
- Focus visible sur tous les éléments interactifs

#### Bonnes pratiques supplémentaires

- **Alt text** : Sur toutes les images
- **Keyboard navigation** : Navigation complète au clavier (Tab, Enter, Esc)
- **Structure sémantique** : Utiliser les balises HTML appropriées (`<header>`, `<nav>`, `<main>`, `<footer>`)
- **Labels de formulaires** : Associer chaque input à un `<label>`
- **Messages d'erreur** : Accessibles et descriptifs

### Mobile

- **Responsive design** : Tous les composants
- **Touch-friendly** : Boutons et interactions
- **Performance** : Optimisé pour mobile

## 🚢 Déploiement

- **Platform** : Vercel (ou autre plateforme)
- **URL** : yourdomain.com
- **Auto-deploy** : Sur push `main`
- **Preview** : Une URL par PR
