# Football Academy - Centre de Formation d'Excellence

Plateforme web professionnelle pour un centre de formation de football, avec une architecture **frontend/backend separee** :
- **Backend** : Laravel 12 (API REST)
- **Frontend** : React 19 + TypeScript + Tailwind CSS 4

---

## Objectif du projet

Ce site web sert de vitrine professionnelle pour un centre de formation de football africain qui souhaite :
- Se presenter aux clubs europeens et aux scouts
- Mettre en avant ses joueurs, son programme et ses infrastructures
- Etablir des partenariats avec des clubs professionnels

---

## Les 7 piliers du projet

### 1. Dossier de presentation officiel du centre

Le site fait office de dossier de presentation digital avec :

- **Nom du centre de formation** et identite visuelle
- **Localisation** et coordonnees de contact
- **Vision et projet sportif** : former les joueurs et les hommes de demain
- **Objectifs** :
  - Formation technique et tactique de haut niveau
  - Education et suivi scolaire obligatoire
  - Developpement physique et mental des joueurs
  - Placement des joueurs dans des clubs professionnels
- **Age des joueurs formes** : U13, U15, U17, U19 (11 a 18 ans)
- **Methodologie d'entrainement** :
  - Technique individuelle (maitrise du ballon, dribble, passes, frappes)
  - Tactique collective (systemes de jeu, pressing, transitions)
  - Preparation physique (endurance, vitesse, force, coordination)
  - Mental (concentration, confiance, esprit d'equipe)
- **Encadrement** : entraineurs diplomes (Licence CAF A/B), preparateur physique, medecin sportif, educateurs
- **Partenariats existants** : RSC Anderlecht, PSV Eindhoven, KRC Genk
- **Infrastructures** : terrains, internat, salle de musculation, salle d'etude, bureau medical

> Le contenu est disponible en francais. Une version anglaise est prevue (champs bilingues FR/EN dans la base de donnees).

### 2. Photos et videos professionnelles

La page **Galerie** (`/gallery`) permet de presenter :

- Les terrains d'entrainement
- L'internat (chambres, refectoire, salle d'etude)
- La salle de musculation
- Les seances d'entrainement
- Les matchs des jeunes
- La video de presentation du centre (2-3 minutes)

> Systeme de filtrage par categorie (terrains, internat, entrainement, matchs) et par type (photo/video).

### 3. Profils des meilleurs talents

La section **Joueurs** (`/players`) presente des fiches joueurs completes :

| Champ | Description |
|-------|-------------|
| Nom / Prenom | Identite du joueur |
| Annee de naissance | Date de naissance complete |
| Poste | Attaquant, Milieu, Defenseur, Gardien |
| Taille / Poids | Mensurations du joueur |
| Pied fort | Droit ou gauche |
| Nationalite | Pays d'origine |
| Categorie | U13, U15, U17, U19 |
| Statistiques | Matchs joues, buts, passes decisives |
| Video highlights | Lien vers la video YouTube/Vimeo |
| Biographie | Texte de presentation (FR et EN) |

> Chaque joueur a sa propre page de profil detaillee (`/players/{id}`).
> Les joueurs "featured" apparaissent en page d'accueil.

### 4. Site internet professionnel

Ce projet **est** le site web du centre. Il inclut :

- **Site web complet** avec 7 pages principales :
  - Accueil (`/`) - Hero, stats, apercu des joueurs et du programme
  - Le Centre (`/about`) - Vision, objectifs, methodologie, infrastructures, staff, partenaires
  - Joueurs (`/players`) - Catalogue filtrable de tous les joueurs
  - Programme (`/program`) - Planning hebdomadaire, axes de developpement, categories
  - Galerie (`/gallery`) - Galerie photos/videos
  - Tournois (`/tournaments`) - Evenements et journees de detection
  - Contact (`/contact`) - Formulaire de contact et informations

- **Liens reseaux sociaux** dans le footer :
  - Instagram
  - YouTube
  - LinkedIn

> Design responsive (mobile, tablette, desktop), professionnel et moderne avec les couleurs vert/or.

### 5. Programme sportif annuel

La page **Programme** (`/program`) explique en detail :

- **Nombre d'entrainements par semaine** : 5 seances + match le week-end
  - Lundi : Technique (16h-18h)
  - Mardi : Physique (7h-8h) + Tactique (16h-18h)
  - Mercredi : Match/Jeu reduit (10h-12h) + Analyse video (14h-15h)
  - Jeudi : Technique (16h-18h)
  - Vendredi : Physique (7h-8h) + Tactique (16h-18h)
  - Samedi : Match officiel ou amical
  - Dimanche : Repos/Recuperation

- **Competitions jouees** : championnat, tournois nationaux et internationaux
- **Suivi scolaire** : cours du matin obligatoires, aide aux devoirs, langues
- **Developpement individuel** :
  - Plan de progression avec objectifs individuels
  - Rapport mensuel (technique, physique, comportemental)
  - Analyse video personnalisee

### 6. Strategie de contact avec les clubs

La page **Contact** (`/contact`) permet de :

- Envoyer un message directement (formulaire avec sujets : partenariat, scouting, inscription, tournoi)
- Voir la liste des **clubs cibles** :
  - RSC Anderlecht (Belgique)
  - PSV Eindhoven (Pays-Bas)
  - Borussia Monchengladbach (Allemagne)
  - KRC Genk (Belgique)
  - Club Brugge (Belgique)
  - Standard de Liege (Belgique)
  - Ajax Amsterdam (Pays-Bas)
  - FC Metz (France)

> En base de donnees, un modele `ContactClub` permet de suivre les contacts avec les clubs (statut : prospect, contacte, en discussion, partenariat).

### 7. Tournois et journees de detection

La page **Tournois** (`/tournaments`) permet de :

- Lister tous les evenements a venir, en cours et termines
- Presenter les details : nom, categorie, dates, lieu, description
- Inviter les scouts europeens a :
  - Tournoi U17 / U19
  - Matchs amicaux internationaux
  - Stages

---

## Les 3 choses les plus importantes pour la visibilite

1. **Video professionnelle du centre** - A uploader dans la galerie
2. **Highlights des meilleurs joueurs** - Champ `highlight_video` dans chaque fiche joueur
3. **Dossier PDF professionnel** - Le site lui-meme fait office de dossier digital ; un PDF peut etre genere a partir du contenu

---

## Architecture & Stack technique

```
football_academy/
├── backend/          # Laravel 12 - API REST
├── frontend/         # React 19 + TypeScript + Tailwind CSS 4
└── README.md
```

| Technologie | Version | Role |
|-------------|---------|------|
| Laravel | 12 | Backend PHP, API REST |
| React | 19 | Frontend SPA |
| TypeScript | 5.7 | Typage statique frontend |
| Tailwind CSS | 4.0 | Styles et design responsive |
| Vite | 7 | Build tool et HMR |
| React Router | 7 | Navigation client-side |
| Axios | 1.x | Client HTTP pour l'API |
| SQLite | 3 | Base de donnees (dev) |

### Communication Frontend / Backend

- Le frontend tourne sur `http://localhost:3000`
- Le backend tourne sur `http://localhost:8000`
- Vite proxy automatiquement les requetes `/api/*` vers le backend
- En production, configurer un reverse proxy (Nginx) ou deployer separement

---

## Installation

### Prerequis

- PHP 8.2+
- Composer
- Node.js 18+
- npm

### Backend (Laravel API)

```bash
cd backend

# Installer les dependances PHP
composer install

# Configurer l'environnement
cp .env.example .env
php artisan key:generate

# Creer la base de donnees et migrer
touch database/database.sqlite
php artisan migrate

# Remplir la base avec des donnees d'exemple
php artisan db:seed

# Lancer le serveur API
php artisan serve
```

L'API sera accessible sur `http://localhost:8000/api/`.

### Frontend (React TypeScript)

```bash
cd frontend

# Installer les dependances
npm install

# Lancer le serveur de developpement
npm run dev
```

Le site sera accessible sur `http://localhost:3000`.

### Build de production

```bash
cd frontend
npm run build
```

Les fichiers de production seront dans `frontend/dist/`.

---

## Structure du projet

### Backend (`backend/`)

```
backend/
├── app/
│   ├── Http/Controllers/Api/
│   │   ├── HomeController.php          # Donnees page d'accueil
│   │   ├── PlayerController.php        # CRUD joueurs
│   │   ├── StaffController.php         # Liste staff
│   │   ├── PartnerController.php       # Liste partenaires
│   │   ├── GalleryController.php       # Galerie media
│   │   ├── TournamentController.php    # Tournois et evenements
│   │   └── ContactController.php       # Envoi message contact
│   └── Models/
│       ├── Player.php
│       ├── Staff.php
│       ├── Partner.php
│       ├── GalleryItem.php
│       ├── Tournament.php
│       └── ContactClub.php
├── database/
│   ├── migrations/
│   └── seeders/DatabaseSeeder.php
├── routes/api.php                      # Routes API
└── config/cors.php                     # Configuration CORS
```

### API Endpoints

| Methode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/home` | Donnees page d'accueil (joueurs featured, staff, partenaires, tournois) |
| GET | `/api/players` | Liste de tous les joueurs |
| GET | `/api/players/{id}` | Detail d'un joueur |
| GET | `/api/staff` | Liste du staff |
| GET | `/api/partners` | Liste des partenaires |
| GET | `/api/gallery` | Galerie media |
| GET | `/api/tournaments` | Liste des tournois |
| POST | `/api/contact` | Envoyer un message de contact |

### Frontend (`frontend/`)

```
frontend/
├── src/
│   ├── main.tsx                        # Point d'entree + Router
│   ├── index.css                       # Tailwind CSS + theme
│   ├── types/index.ts                  # Interfaces TypeScript
│   ├── api/
│   │   ├── client.ts                   # Instance Axios configuree
│   │   └── endpoints.ts               # Fonctions d'appel API
│   ├── layouts/
│   │   └── MainLayout.tsx              # Layout principal (navbar + footer)
│   ├── components/
│   │   ├── SectionTitle.tsx            # Titre de section reutilisable
│   │   └── PlayerCard.tsx              # Carte joueur
│   └── pages/
│       ├── Home.tsx                    # Page d'accueil
│       ├── About.tsx                   # Presentation du centre
│       ├── Players/
│       │   ├── Index.tsx               # Liste des joueurs (filtrable)
│       │   └── Show.tsx                # Fiche joueur detaillee
│       ├── Gallery.tsx                 # Galerie photos/videos
│       ├── Program.tsx                 # Programme sportif annuel
│       ├── Tournaments.tsx             # Tournois et evenements
│       └── Contact.tsx                 # Page de contact
├── index.html
├── vite.config.ts                      # Config Vite + proxy API
├── tsconfig.json
└── package.json
```

---

## Base de donnees

### Tables principales

- **players** : fiches joueurs (nom, poste, stats, video, bio FR/EN)
- **staff** : encadrement technique (entraineurs, medecin, preparateur)
- **partners** : clubs et organisations partenaires
- **gallery_items** : photos et videos du centre
- **tournaments** : tournois, stages et journees de detection
- **contact_clubs** : suivi des contacts avec les clubs (CRM basique)

---

## Personnalisation

### Modifier les informations du centre

- **Nom, adresse, contact** : modifier dans `frontend/src/layouts/MainLayout.tsx` et `frontend/src/pages/Contact.tsx`
- **Couleurs** : modifier les variables CSS dans `frontend/src/index.css` :
  - `--color-primary` : vert principal (#1B5E20)
  - `--color-accent` : or/jaune (#FFD700)
  - `--color-dark` : fond sombre (#1a1a2e)
- **Clubs cibles** : modifier la liste dans `frontend/src/pages/Contact.tsx`

### Ajouter du contenu

Via le seeder (`backend/database/seeders/DatabaseSeeder.php`) ou directement via l'API.

> Un panel d'administration (backoffice) pourra etre ajoute par la suite pour gerer le contenu sans code.

---

## Prochaines etapes

- [ ] Panel d'administration (CRUD joueurs, staff, galerie, tournois)
- [ ] Authentification admin (Laravel Sanctum)
- [ ] Upload de photos et videos
- [ ] Generation de PDF (dossier de presentation)
- [ ] Version anglaise complete (i18n)
- [ ] Integration YouTube pour les highlights
- [ ] SEO et meta tags Open Graph
- [ ] Formulaire d'inscription joueurs en ligne
- [ ] Systeme de newsletter
- [ ] Statistiques avancees par joueur (graphiques)

---

## Licence

Projet prive - Tous droits reserves.
