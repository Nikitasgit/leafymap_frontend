# Documentation Frontend - Leafy Map

Application web de **découverte d'événements locaux** : carte interactive, agenda, profils d'organisateurs et gestion d'événements.

Architecture modulaire par feature en place. Historique de la migration : [REFACTORING.md](./REFACTORING.md).

## Table des matières

1. [Commandes de base](#commandes-de-base)
2. [Architecture du projet](#architecture-du-projet)
3. [Internationalisation (i18n)](#internationalisation-i18n)
4. [Fonctionnalités principales](#fonctionnalités-principales)
5. [Styling](#styling)
6. [Conventions de code](#conventions-de-code)
7. [Configuration](#configuration)
8. [Dépendances principales](#dépendances-principales)
9. [Workflow de développement](#workflow-de-développement)
10. [Notes importantes](#notes-importantes)
11. [Déploiement](#déploiement)

---

## Commandes de base

```bash
# Installation des dépendances
npm install

# Développement (port 3001)
npm run dev

# Build de production
npm run build

# Démarrage en production
npm start

# Linting / dead code
npm run lint
npm run knip

# Tests unitaires (Vitest)
npm test

# E2E Playwright (Chromium)
npm run playwright:install
npm run test:e2e
```

## Architecture du projet

Le frontend suit une **architecture modulaire par feature** (style [Bulletproof React](https://github.com/alan2207/bulletproof-react) / *vertical slice*). C'est le pendant frontend de la **Clean Architecture** du backend : co-localisation par domaine métier et **règle de dépendance unidirectionnelle**.

### Règle de dépendance

```
shared ← features ← app
         ↑
       store   (configureStore + hooks typés ; les slices vivent dans features/*/model)
```

- `shared/` ne dépend jamais de `features/` ni de `app/`
- Une feature importe `shared/` librement
- Entre features : uniquement via le barrel public `@/features/<name>` (pas d'import profond)
- `app/` reste fin : routing App Router → containers de features

Les frontières sont en `error` via `eslint-plugin-boundaries` dans `eslint.config.mjs`. Les imports profonds d’une feature (`api/`, `model/`, `hooks/`, `components/`, …) restent autorisés ; le barrel `@/features/<name>` est le point d’entrée public.

### Arborescence cible

```
leafymap-frontend/
├── src/
│   ├── app/                      # Next.js App Router (routing, layouts, pages)
│   │   └── [locale]/            # Routes internationalisées
│   ├── features/                 # Modules métier verticaux
│   │   └── <feature>/
│   │       ├── api/              # Appels HTTP du domaine
│   │       ├── components/       # UI (dossiers camelCase, fichiers PascalCase)
│   │       ├── hooks/
│   │       ├── model/            # Redux slice + selectors
│   │       ├── types/
│   │       ├── validations/
│   │       └── index.ts          # API publique de la feature
│   ├── shared/                   # Noyau transverse
│   │   ├── api/                  # apiClient, erreurs, normalizers
│   │   ├── ui/                   # Design system (ex-components/common)
│   │   ├── hooks/                # Hooks génériques
│   │   ├── lib/ / utils/ / config/ / types/ / styles/
│   ├── store/                    # configureStore uniquement
│   └── proxy.ts                  # Routing i18n (Next.js proxy)
├── public/                       # Assets statiques + locales i18n
└── next.config.ts
```

### Alias TypeScript

- `@/*` → `src/*` (ex. `@/features/auth`, `@/shared/api/client`)

### État de la migration

Les passes décrites dans [REFACTORING.md](./REFACTORING.md) sont faites (`shared/`, features métier, design system sous `shared/ui`). Features : `account`, `admin`, `announcements`, `auth`, `categories`, `comments`, `creator`, `eventBookings`, `eventInvitations`, `events`, `favorites`, `follows`, `home`, `map`, `messages`, `notifications`, `partnerships`, `places`, `products`, `reviews`, `users`.

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
/fr/map          # Exemple : carte en français
/en/map          # Exemple : carte en anglais
```

### Fonctionnement

#### 1. Proxy (`src/proxy.ts`)

Next.js 16 n’utilise plus `middleware.ts` pour ce routage. `src/proxy.ts` intercepte les requêtes et préfixe l’URL avec la locale :

```typescript
export async function proxy(request: NextRequest) {
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
- **Namespaces** (`src/i18nConfig.ts`) : `common`, `subscription`, `marketing`, `errors`, `validation`, `events`, `auth`, `messages`, `notifications`, `map`, `account`, `profile`, `reviews`, `admin`
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

Le `userType` courant est `guest` ou `creator`. `organizer` n’est plus une valeur de `userType` (ça reste un libellé de catégorie / de copie). Le rôle admin (`user` / `admin`) est distinct.

##### Guest

- Consulter la carte, les événements et les profils publics
- Passer en profil **creator**

##### Creator

- Un seul lieu par utilisateur
- Créer et gérer des événements
- Profil créateur (catégorie, description, image)

Les partenariats sont des invitations entre utilisateurs (`pending` → `accepted`), pas un droit réservé à un type `organizer`.

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

- `/[locale]` : Accueil
- `/[locale]/map` : Carte
- `/[locale]/events/[eventId]` : Détail d’un événement
- `/[locale]/users/[userId]` : Profil public
- `/[locale]/legal/cgu`
- `/[locale]/auth/signin`, `register`, `forgot-password`, `reset-password`, `verify-email`, `resend-verification`, `check-email`, `accept-cgu`

#### Routes authentifiées

- `/[locale]/account` : Compte
- `/[locale]/account/create` : Passer en profil creator
- `/[locale]/account/update-creator`
- `/[locale]/account/settings`
- `/[locale]/account/places/create` et `/[locale]/account/places/[placeId]`
- `/[locale]/account/places/[placeId]/events/create` et `.../events/[eventId]`
- `/[locale]/account/events/create` et `/[locale]/account/events/[eventId]`
- `/[locale]/inbox` : Messagerie

#### Admin

- `/[locale]/admin/users` et `/[locale]/admin/users/[userId]`
- `/[locale]/admin/announcements`, `.../new`, `.../[announcementId]`

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
- **API** : `featureApi.ts` (camelCase)
- **Utils** : `utilName.ts` (camelCase)

#### Dossiers

##### Features (`src/features/<feature>/`)

Segments en minuscules : `api/`, `components/`, `hooks/`, `model/`, `types/`, `validations/`, plus `index.ts` (API publique).

##### Dossiers de composants (camelCase)

Quand un dossier regroupe un composant avec ses fichiers associés :

```
signinForm/
  ├── SigninForm.tsx
  ├── index.ts
  ├── SigninForm.module.scss
  └── SigninForm.types.ts   # optionnel
```

**Convention** : dossier en **camelCase** (`button`, `signinForm`, `eventCard`) ; fichiers du composant en **PascalCase**. Sur macOS (FS case-insensitive), renommer en deux temps : `git mv Old tmp && git mv tmp new`.

##### Shared et segments techniques (camelCase / lowercase)

```
shared/
  ├── api/
  ├── ui/
  ├── hooks/
  └── utils/

features/auth/hooks/
  ├── useAuth.ts
  └── useCurrentUser.ts
```

**Convention** : features, segments, shared et dossiers de composants en **camelCase** / minuscules ; fichiers de composants en **PascalCase**.

##### Résumé

- **PascalCase** : fichiers de composants (`SigninForm.tsx`)
- **camelCase / lowercase** : features, segments (`api`, `hooks`, `model`), dossiers de composants, `shared/`

## 🔧 Configuration

### Variables d'environnement

Voir `env.example`.

```env
# npm run dev sur l’hôte : même port que PORT du backend (env.example backend = 5001)
NEXT_PUBLIC_API_URL=http://localhost:5001
# Docker Compose force http://localhost:5002 (le compose écrase cette variable)
# API_URL=http://api:5002   # SSR uniquement quand le front tourne dans Compose. Ne pas définir sur Vercel.

NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx...
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
```

`API_URL` n’est lue que pour les fetch **serveur** (`src/shared/api/client.ts`). Le navigateur utilise toujours `NEXT_PUBLIC_API_URL`.

### Next.js

- **Version** : 16.3.5 (App Router)
- **React** : 19.2
- **Node** : `>=22` (`engines` dans `package.json`)
- **SSR** : Par défaut pour les pages
- **Image optimization** : Composant `<Image>` (hôtes distants dans `next.config.ts` : bucket S3, avatars Google)

## 📦 Dépendances principales

- **Next.js** : Framework React
- **React** : Bibliothèque UI
- **Redux Toolkit** : State management
- **i18next** : Internationalisation
- **Axios** : Requêtes HTTP
- **Zod** : Validation côté client
- **Mapbox GL** : Tuiles de la carte (le géocodage passe par l’API)
- **MUI** : Composants Material
- **SCSS** : Préprocesseur CSS
- **Socket.IO client** : Messagerie temps réel
- **Google OAuth** : `@react-oauth/google`
- **Lucide React** : Icônes
- **Sonner** : Toast notifications
- **Vitest** / **Playwright** : Tests unitaires et e2e

## 🔄 Workflow de développement

1. **Créer une feature branch** depuis la branche de travail (`develop` aujourd’hui ; la production Vercel suit `main`)
2. **Développer** avec hot-reload (`npm run dev`, port 3001)
3. **Tester** dans les deux locales (fr/en)
4. **Vérifier** `npm run lint`, `npm test`, `npm run build`
5. **Pull request vers `main`** : la CI GitHub Actions (lint, Vitest, build) tourne sur les PR et les push vers `main`
6. **Merge sur `main`** : Vercel publie la production. Les autres branches peuvent avoir une preview, selon le projet Vercel

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

Le frontend et l’API sont **deux dépôts Git**, déployés séparément. Un correctif d’écran ne redéploie pas l’API.

| | Frontend | API |
| --- | --- | --- |
| Dépôt | `leafymap_frontend` | `leafymap_backend` |
| Hôte | **Vercel** | **Render**, web service **Node** (pas l’image Docker) |
| Branche de production | `main` | `main` |
| CI | push + PR vers `main` | PR vers `main` seulement |

Domaines du site : `https://leafymap.com` et `https://www.leafymap.com`. L’URL canonique de l’app (`APP_PRODUCTION_URL` dans `src/shared/config/app.ts`) est **`https://www.leafymap.com`**. Les liens e-mail de l’API pointent vers l’apex `https://leafymap.com` (voir le README backend).

Les images ne sont pas hébergées par Vercel : l’API les stocke sur **AWS S3** et renvoie des URLs signées.

### Vercel

1. Projet connecté au dépôt `leafymap_frontend`, framework **Next.js**, **Node 22** (le `engines` du `package.json` est `>=22`).
2. Commandes par défaut : installation des dépendances, build `npm run build` (`next build`). Vercel **n’exécute pas** `npm start` et ignore le port `3001` de ce script : c’est le runtime Vercel qui sert le build.
3. Branche de production : `main`. Un push sur `main` publie le site. Un push sur `develop` ne met pas à jour la production.
4. Variables d’environnement, pour **Production** et pour **Preview** si les previews doivent appeler l’API. Les `NEXT_PUBLIC_*` sont figées **au build** : les changer impose un nouveau déploiement.

```env
NEXT_PUBLIC_API_URL=https://<origine-publique-du-service-render>
NEXT_PUBLIC_MAPBOX_TOKEN=pk....
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<le même Client ID que GOOGLE_CLIENT_ID côté API>
```

Ne pas définir `API_URL` sur Vercel. Elle ne sert que lorsque le serveur Next tourne **dans Docker Compose** et doit joindre le service `api` (`http://api:5002`). Sans elle, les fetch serveur utilisent `NEXT_PUBLIC_API_URL`, ce qui est le bon comportement sur Vercel.

`NEXT_PUBLIC_API_URL` est l’origine seule (`https://…`), sans chemin `/api` et sans slash final.

### Session cross-origine

Le navigateur est sur Vercel, l’API sur Render. Axios envoie les cookies (`withCredentials: true`). En production le JWT est un cookie `httpOnly`, `Secure`, `SameSite=None`. Ça ne marche que si :

- les deux hôtes sont en **HTTPS** (Vercel et Render terminent TLS) ;
- l’API tourne avec `NODE_ENV=production` (Render le définit). Sinon le cookie reste `SameSite=Lax` / non `Secure`, et le login depuis `leafymap.com` ne pose pas la session.

Le CORS n’est pas configuré dans Vercel : la liste d’origines est dans le backend (`https://leafymap.com` et `https://www.leafymap.com`).

### Checklist

- [ ] Node 22 sélectionné dans le projet Vercel
- [ ] `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_MAPBOX_TOKEN`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID` renseignées sur l’environnement déployé
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` identique à `GOOGLE_CLIENT_ID` Render
- [ ] `API_URL` absente sur Vercel
- [ ] CI verte sur la PR vers `main` (lint, Vitest, `next build`)
- [ ] Après merge : déploiement Vercel réussi
- [ ] Login depuis `https://www.leafymap.com` (cookie cross-site) et affichage de la carte (token Mapbox)
