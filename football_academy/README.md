# Football Academy - Plateforme de Centre de Formation

Plateforme web professionnelle pour un centre de formation de football. Elle sert de vitrine digitale pour attirer clubs europeens, recruteurs et partenaires, tout en permettant la gestion complete des joueurs, du staff, des entrainements et des evenements.

---

## Table des matieres

- [Fonctionnalites publiques](#fonctionnalites-publiques)
- [Espace administration](#espace-administration)
- [Pages publiques en detail](#pages-publiques-en-detail)
- [Pages admin en detail](#pages-admin-en-detail)
- [Generation de PDF](#generation-de-pdf)
- [Systeme bilingue](#systeme-bilingue)
- [API - Endpoints](#api---endpoints)
- [Base de donnees](#base-de-donnees)
- [Partie technique](#partie-technique)

---

## Fonctionnalites publiques

- **Page d'accueil** avec hero anime, statistiques, joueurs vedettes, programme, tournois a venir et CTA pour recruteurs
- **Presentation du centre** (vision, objectifs, methodologie, infrastructures, encadrement, partenaires)
- **Catalogue de joueurs** filtrable par categorie (U13, U15, U17, U19) et par poste (Gardien, Defenseur, Milieu, Attaquant)
- **Fiche joueur detaillee** avec photo, stats, biographie et video highlights
- **Programme d'entrainement** avec planning hebdomadaire visuel (grille 7 jours)
- **Galerie media** avec filtres par type (photos/videos) et par categorie
- **Tournois et evenements** avec statut (a venir, en cours, termine)
- **Formulaire de contact** pour les demandes de renseignements
- **Video de presentation** integree sur la page d'accueil (YouTube/embed)
- **Export PDF** du dossier de presentation du centre et des profils joueurs
- **Bilingue FR/EN** sur toutes les pages publiques avec switcher de langue
- **Design responsive** adapte mobile, tablette et desktop
- **Animations au scroll** (fade-in, slide) pour une navigation fluide
- **Scroll automatique** vers le haut lors de la navigation entre pages

---

## Espace administration

Accessible apres connexion (`/login`), l'espace admin permet de gerer l'integralite du contenu du site :

| Section | Route | Description |
|---------|-------|-------------|
| **Dashboard** | `/dashboard` | Vue d'ensemble avec statistiques rapides (joueurs, staff, tournois, galerie) |
| **Joueurs** | `/dashboard/players` | CRUD complet avec upload photo, stats, bio FR/EN, video highlights, statut vedette |
| **Planning** | `/dashboard/planning` | Gestion des seances d'entrainement par jour, heure, categorie, lieu, coach et couleur |
| **Galerie** | `/dashboard/gallery` | Upload et gestion des photos/videos avec categories |
| **Tournois** | `/dashboard/tournaments` | Creation d'evenements avec dates, lieu, description FR/EN et statut |
| **Partenaires** | `/dashboard/partners` | Gestion des clubs et partenaires avec logo, site web et description |
| **Encadrement** | `/dashboard/staff` | Gestion du staff technique avec photo, role, qualification et bio FR/EN |
| **Parametres** | `/dashboard/settings` | Personnalisation du site (nom, logo, couleurs, hero, contact, reseaux sociaux, video) |

Un bouton flottant (AdminFab) apparait sur les pages publiques lorsqu'un admin est connecte pour acceder rapidement au dashboard.

---

## Pages publiques en detail

### Accueil (`/`)
- Hero plein ecran avec image de fond, titre, sous-titre et badge configurables depuis les parametres
- Section statistiques (joueurs formes, entrainements/semaine, partenariats)
- Apercu de la vision du centre
- Grille des joueurs vedettes (6 max, marques `is_featured`)
- Apercu du programme sportif
- Prochains tournois (3 max)
- Section video de presentation (affichee si URL configuree dans les parametres)
- CTA pour recruteurs et clubs

### Le Centre (`/about`)
- Presentation de la vision et des objectifs du centre
- Methodologie d'entrainement en 4 axes (technique, tactique, physique, mental)
- Infrastructures (terrains, internat, salle de musculation, salle d'etude, vestiaires, bureau medical)
- Grille du staff avec photos et roles
- Grille des partenaires avec logos
- **Bouton "Telecharger le dossier PDF"** pour generer le dossier de presentation complet

### Joueurs (`/players`)
- Grille responsive (2 a 4 colonnes)
- Filtres par categorie d'age (U13, U15, U17, U19) et par poste (Gardien, Defenseur, Milieu, Attaquant)
- Cartes joueurs avec photo, nom, position et categorie
- Lien vers la fiche detaillee de chaque joueur

### Fiche Joueur (`/players/:id`)
- Photo grand format avec gradient
- Badge de position et categorie
- Informations personnelles (age, taille, poids, pied fort, nationalite)
- Statistiques (matchs joues, buts, passes decisives)
- Biographie (affichee selon la langue active FR/EN)
- Video highlights en iframe (YouTube/Vimeo)
- **Bouton "Telecharger le profil PDF"** pour generer la fiche joueur

### Programme (`/program`)
- Planning hebdomadaire en grille visuelle (lundi a dimanche)
- Seances avec code couleur, horaires, categorie, lieu et coach
- Axes de developpement detailles :
  - Technique (maitrise du ballon, passes, dribbles, frappes, jeu de tete)
  - Tactique (systemes de jeu, transitions, pressing, placement, analyse video)
  - Physique (endurance, vitesse, force, coordination, prevention des blessures)
  - Suivi scolaire (cours, devoirs, valeurs, langues, nutrition)

### Galerie (`/gallery`)
- Grille de medias avec filtres par type (photos/videos) et par categorie
- Titres bilingues FR/EN

### Tournois (`/tournaments`)
- Liste des evenements avec filtre par statut (a venir, en cours, termine)
- Cartes avec nom, categorie, dates, lieu et description bilingue
- Dates formatees selon la langue active

### Contact (`/contact`)
- Formulaire (nom, email, sujet au choix, message)
- Sujets : partenariat, scouting, inscription, tournoi, autre
- Coordonnees du centre (adresse, telephone, email)
- Liste des clubs cibles (8 clubs europeens)
- Liens vers les reseaux sociaux

---

## Pages admin en detail

### Dashboard (`/dashboard`)
- Message de bienvenue
- Statistiques rapides (nombre de joueurs, staff, tournois, medias)
- Cartes de navigation vers chaque section admin

### Gestion des joueurs (`/dashboard/players`)
- Tableau avec recherche par nom et filtre par categorie
- Modal de creation/edition avec tous les champs :
  - Infos personnelles (nom, prenom, date de naissance, nationalite)
  - Donnees physiques (taille, poids, poste, pied fort)
  - Statistiques (buts, passes, matchs joues)
  - Media (upload photo, URL video highlights)
  - Biographie FR et EN
  - Statut joueur vedette (is_featured)
- Suppression avec confirmation

### Gestion du planning (`/dashboard/planning`)
- Grille 7 jours avec toutes les seances d'entrainement
- Modal de creation/edition (jour, horaires debut/fin, titre, description, categorie, lieu, coach, couleur, ordre)
- Reordonnancement par drag & drop
- Suppression avec confirmation

### Gestion de la galerie (`/dashboard/gallery`)
- Liste des medias avec creation et upload
- Edition des titres FR/EN, type (photo/video), categorie, fichier et miniature

### Gestion des tournois (`/dashboard/tournaments`)
- Liste avec creation/edition/suppression
- Champs : nom, categorie, dates debut/fin, lieu, description FR/EN, statut (a venir, en cours, termine)

### Gestion des partenaires (`/dashboard/partners`)
- Liste avec creation/edition/suppression
- Champs : nom, type, logo (upload), site web, description FR/EN

### Gestion de l'encadrement (`/dashboard/staff`)
- Grille de cartes avec photo, nom, role et qualification
- Recherche par nom et filtre par role
- Roles predefinies : Entraineur principal, Entraineur adjoint, Preparateur physique, Medecin sportif, Kinesitherapeute, Directeur technique, Intendant, Autre
- Modal de creation/edition avec upload photo et bio FR/EN
- Suppression avec confirmation

### Parametres du site (`/dashboard/settings`)
- **Identite** : Nom de l'academie, URL du logo
- **Couleurs** : Principale, claire, foncee, accent, sombre
- **Hero** : Image de fond, titre, sous-titre, badge, URL video de presentation
- **Contact** : Email, telephone, adresse
- **Reseaux sociaux** : Facebook, Instagram, YouTube, LinkedIn, TikTok, Snapchat, X

---

## Generation de PDF

### Dossier de presentation du centre
Accessible depuis la page "Le Centre" via le bouton de telechargement. Genere un document A4 multi-pages contenant :
- Page de couverture avec nom de l'academie, slogan et coordonnees
- Vision et objectifs du centre
- Methodologie d'entrainement (technique, tactique, physique, mental)
- Infrastructures disponibles
- Programme sportif et categories d'age (U13, U15, U17, U19)
- Liste de l'encadrement technique avec roles et qualifications
- Liste des partenaires avec types
- Coordonnees completes et liens reseaux sociaux

### Profil joueur
Accessible depuis chaque fiche joueur via le bouton de telechargement. Genere un document A4 contenant :
- En-tete sombre avec nom, position, categorie et nationalite
- Informations personnelles (age, date de naissance, taille, poids, pied fort)
- Statistiques dans des boites colorees (matchs joues, buts, passes decisives)
- Biographie complete
- Pied de page avec coordonnees de l'academie

Les deux PDF s'adaptent automatiquement a la langue active (francais ou anglais).

---

## Systeme bilingue

Le site dispose d'un systeme de traduction francais/anglais complet :

- **Switcher de langue** dans la navbar desktop (bouton EN/FR) et dans le menu mobile (avec icone globe)
- **Persistance** du choix de langue dans le localStorage du navigateur
- **Fonction `t(fr, en)`** fournie par le `LanguageContext`, utilisee dans tous les composants pour afficher le texte selon la langue
- **Contenu dynamique bilingue** : les champs `bio_fr`/`bio_en`, `title_fr`/`title_en`, `description_fr`/`description_en` sont affiches selon la langue active
- **PDF bilingues** : les exports PDF generent le contenu dans la langue selectionnee
- **Dates localisees** : formatees en francais (01/03/2026) ou anglais (01/03/2026) selon la langue

---

## API - Endpoints

### Publics (sans authentification)

| Methode | Route | Description |
|---------|-------|-------------|
| GET | `/api/home` | Donnees de la page d'accueil (joueurs vedettes, staff, partenaires, tournois a venir) |
| GET | `/api/players` | Liste de tous les joueurs |
| GET | `/api/players/{id}` | Detail d'un joueur |
| GET | `/api/staff` | Liste du staff technique |
| GET | `/api/partners` | Liste des partenaires |
| GET | `/api/gallery` | Liste des medias (galerie) |
| GET | `/api/tournaments` | Liste des tournois |
| GET | `/api/training-sessions` | Planning hebdomadaire des seances |
| GET | `/api/settings/public` | Parametres publics du site |
| POST | `/api/contact` | Envoi du formulaire de contact |
| POST | `/api/login` | Connexion administrateur |
| POST | `/api/register` | Inscription administrateur |

### Proteges (authentification Sanctum requise)

| Methode | Route | Description |
|---------|-------|-------------|
| POST | `/api/logout` | Deconnexion |
| GET | `/api/user` | Informations de l'utilisateur connecte |
| GET/PUT | `/api/settings` | Lecture et mise a jour des parametres du site |
| POST | `/api/upload` | Upload de fichier image (max 5 Mo ; jpg, png, gif, svg, webp) |
| POST/PUT/DELETE | `/api/players[/{id}]` | CRUD joueurs |
| POST/PUT/DELETE | `/api/staff[/{id}]` | CRUD staff |
| POST/PUT/DELETE | `/api/partners[/{id}]` | CRUD partenaires |
| POST/PUT/DELETE | `/api/gallery[/{id}]` | CRUD galerie |
| POST/PUT/DELETE | `/api/tournaments[/{id}]` | CRUD tournois |
| POST/PUT/DELETE | `/api/training-sessions[/{id}]` | CRUD seances d'entrainement |
| POST | `/api/training-sessions/reorder` | Reordonnancement des seances (drag & drop) |

---

## Base de donnees

### Modeles

| Modele | Description | Champs principaux |
|--------|-------------|-------------------|
| **Player** | Profils des joueurs | first_name, last_name, date_of_birth, position, preferred_foot, height, weight, nationality, category, goals, assists, matches_played, bio_fr, bio_en, photo, highlight_video, is_featured |
| **Staff** | Encadrement technique | name, role, qualification, bio_fr, bio_en, photo |
| **Partner** | Partenaires et clubs | name, type, logo, website, description_fr, description_en |
| **GalleryItem** | Medias (photos/videos) | title_fr, title_en, type, category, file_path, thumbnail |
| **Tournament** | Tournois et evenements | name, category, start_date, end_date, location, description_fr, description_en, status |
| **TrainingSession** | Seances d'entrainement | day_of_week, start_time, end_time, title, description, category, location, coach, color, sort_order |
| **ContactClub** | CRM clubs contacts | club_name, country, contact_name, contact_role, email, status, notes |
| **SiteSetting** | Parametres du site | key, value (systeme cle-valeur) |
| **User** | Comptes administrateur | name, email, password |

### Donnees de demonstration (Seeder)

Le seeder (`php artisan db:seed`) fournit des donnees de test :
- 1 administrateur : `admin@football-academy.com` / `password`
- 4 membres du staff (entraineurs, medecin, preparateur physique)
- 8 joueurs repartis en U15, U17, U19
- 3 partenaires (RSC Anderlecht, PSV Eindhoven, KRC Genk)
- 3 tournois avec differents statuts
- 4 contacts clubs dans le CRM
- 10 seances d'entrainement reparties sur la semaine

---

## Partie technique

### Stack technologique

| Composant | Technologie | Version |
|-----------|-------------|---------|
| **Backend** | Laravel (PHP) | 12.x |
| **Frontend** | React + TypeScript | 19.x / 5.9 |
| **Styling** | Tailwind CSS | 4.2 |
| **Build** | Vite | 7.3 |
| **Authentification** | Laravel Sanctum | 4.x |
| **Client HTTP** | Axios | 1.13 |
| **PDF** | jsPDF | 4.2 |
| **Base de donnees** | SQLite (dev) | - |
| **Routing** | React Router | 7.x |

### Architecture du projet

```
football_academy/
├── backend/                        # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/Api/   # 11 controllers API
│   │   │   ├── AuthController.php
│   │   │   ├── HomeController.php
│   │   │   ├── PlayerController.php
│   │   │   ├── StaffController.php
│   │   │   ├── PartnerController.php
│   │   │   ├── GalleryController.php
│   │   │   ├── TournamentController.php
│   │   │   ├── TrainingSessionController.php
│   │   │   ├── ContactController.php
│   │   │   ├── UploadController.php
│   │   │   └── SiteSettingsController.php
│   │   └── Models/                 # 9 modeles Eloquent
│   ├── database/
│   │   ├── migrations/             # 12 migrations
│   │   └── seeders/                # Donnees de demonstration
│   ├── routes/api.php              # Definition des routes API
│   └── .env                        # Configuration environnement
│
├── frontend/                       # SPA React
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts           # Instance Axios (base URL, token)
│   │   │   └── endpoints.ts        # Fonctions d'appel API typees
│   │   ├── components/             # 6 composants reutilisables
│   │   │   ├── PlayerCard.tsx      # Carte joueur
│   │   │   ├── SectionTitle.tsx    # Titre de section
│   │   │   ├── Reveal.tsx          # Animation au scroll
│   │   │   ├── ScrollToTop.tsx     # Scroll haut sur navigation
│   │   │   ├── ProtectedRoute.tsx  # Protection routes admin
│   │   │   └── AdminFab.tsx        # Bouton flottant admin
│   │   ├── contexts/               # 3 contexts React
│   │   │   ├── AuthContext.tsx      # Authentification + token
│   │   │   ├── SettingsContext.tsx  # Parametres du site
│   │   │   └── LanguageContext.tsx  # Langue FR/EN + fonction t()
│   │   ├── hooks/
│   │   │   └── useReveal.ts        # Hook animation au scroll
│   │   ├── layouts/
│   │   │   ├── MainLayout.tsx      # Navbar + footer (pages publiques)
│   │   │   └── AdminLayout.tsx     # Sidebar (pages admin)
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Page d'accueil
│   │   │   ├── About.tsx           # Presentation du centre
│   │   │   ├── Players/
│   │   │   │   ├── Index.tsx       # Liste joueurs filtrable
│   │   │   │   └── Show.tsx        # Fiche joueur detaillee
│   │   │   ├── Gallery.tsx         # Galerie photos/videos
│   │   │   ├── Program.tsx         # Programme sportif
│   │   │   ├── Tournaments.tsx     # Tournois et evenements
│   │   │   ├── Contact.tsx         # Formulaire de contact
│   │   │   ├── Login.tsx           # Connexion
│   │   │   ├── Register.tsx        # Inscription
│   │   │   ├── Dashboard.tsx       # Tableau de bord admin
│   │   │   └── admin/
│   │   │       ├── Players.tsx     # CRUD joueurs
│   │   │       ├── Planning.tsx    # CRUD planning
│   │   │       ├── Gallery.tsx     # CRUD galerie
│   │   │       ├── Tournaments.tsx # CRUD tournois
│   │   │       ├── Partners.tsx    # CRUD partenaires
│   │   │       ├── Staff.tsx       # CRUD encadrement
│   │   │       └── Settings.tsx    # Parametres du site
│   │   ├── types/
│   │   │   └── index.ts            # Interfaces TypeScript
│   │   ├── utils/
│   │   │   ├── generateCenterPdf.ts  # PDF dossier du centre
│   │   │   └── generatePlayerPdf.ts  # PDF profil joueur
│   │   └── main.tsx                # Point d'entree + routes
│   ├── vite.config.ts              # Proxy API + plugins
│   └── package.json
│
└── README.md
```

### Installation et lancement

**Prerequis** : PHP 8.2+, Composer, Node.js 18+, npm

**Backend :**
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan db:seed
php artisan serve                   # http://localhost:8000
```

**Frontend :**
```bash
cd frontend
npm install
npm run dev                         # http://localhost:3000
```

Le frontend est configure avec un proxy Vite qui redirige `/api` et `/storage` vers `http://localhost:8000`.

### Build de production

```bash
cd frontend
npm run build                       # Genere frontend/dist/
```

### Compte admin par defaut

| Email | Mot de passe |
|-------|-------------|
| `admin@football-academy.com` | `password` |

### Communication Frontend / Backend

- Le frontend (React) tourne sur `http://localhost:3000` en developpement
- Le backend (Laravel) tourne sur `http://localhost:8000`
- Vite proxy les requetes `/api/*` et `/storage/*` vers le backend
- L'authentification utilise des tokens Bearer via Laravel Sanctum, stockes dans le localStorage
- Toutes les reponses API sont typees avec des interfaces TypeScript

### Gestion des fichiers

- Les fichiers sont uploades vers `/storage/uploads/` sur le serveur Laravel
- Formats acceptes : jpg, jpeg, png, gif, svg, webp
- Taille maximale : 5 Mo
- URL servie : `/storage/{chemin}`

### Theme et couleurs

Le theme est entierement personnalisable depuis les parametres admin. Couleurs par defaut :

| Variable CSS | Valeur | Usage |
|-------------|--------|-------|
| `--color-primary` | `#1B5E20` | Couleur principale (vert) |
| `--color-primary-light` | `#4CAF50` | Variante claire |
| `--color-primary-dark` | `#0D3B0F` | Variante foncee |
| `--color-accent` | `#FFD700` | Couleur d'accent (or) |
| `--color-dark` | `#1a1a2e` | Fond sombre (navbar, footer, hero) |

### Dependances principales

**Backend (Composer) :**
- `laravel/framework` ^12.0
- `laravel/sanctum` ^4.0

**Frontend (npm) :**
- `react` ^19.2.0
- `react-dom` ^19.2.0
- `react-router-dom` ^7.13.1
- `axios` ^1.13.6
- `tailwindcss` ^4.2.1
- `jspdf` ^4.2.0
- `jspdf-autotable` ^5.0.7
- `vite` ^7.3.1
- `typescript` ~5.9.3

---

## Licence

Projet prive - Tous droits reserves.
