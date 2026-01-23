# 🚀 LevelUp

[![CI/CD Pipeline](https://github.com/USERNAME/LevelUp/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/USERNAME/LevelUp/actions)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

**LevelUp** est une application web de suivi d'objectifs et d'habitudes avec un système de gamification. L'application permet aux utilisateurs de définir des objectifs, de suivre leurs habitudes quotidiennes, et de progresser à travers un système de niveaux et de points d'expérience (XP).

## 📋 Table des matières

- [Fonctionnalités principales](#-fonctionnalités-principales)
- [Stack technique](#-stack-technique)
- [Structure du projet](#-structure-du-projet)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
  - [Installation avec Docker (Recommandé)](#installation-avec-docker-recommandé)
  - [Installation manuelle](#installation-manuelle)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Documentation API](#-documentation-api)
- [Architecture](#-architecture)
- [Tests](#-tests)
- [Déploiement](#-déploiement)
- [Contribution](#-contribution)
- [License](#-license)

## ✨ Fonctionnalités principales

### 🎯 Gestion des objectifs
- Création, modification et suppression d'objectifs
- Définition de priorités (faible, moyenne, élevée)
- Catégorisation des objectifs
- Définition de dates de début et d'échéance
- Suivi de l'état (actif, complété, abandonné)
- Décomposition en étapes (steps) pour une progression détaillée

### 📊 Suivi des habitudes
- Création d'habitudes quotidiennes ou hebdomadaires
- Enregistrement des complétions (logs)
- Calcul automatique des séries (streaks)
- Taux de complétion par habitude
- Archivage des habitudes

### 📈 Statistiques et Dashboard
- Vue d'ensemble des objectifs et habitudes
- Statistiques globales (taux de complétion, nombre d'habitudes suivies)
- Statistiques par catégorie
- Graphiques de progression

### 🎮 Système de gamification
- Système de niveaux (levels)
- Points d'expérience (XP)
- Progression basée sur les accomplissements

### 🔐 Authentification
- Inscription et connexion sécurisées
- Authentification JWT
- Gestion de profil utilisateur

## 🛠 Stack technique

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express.js 5.2.1
- **Base de données**: PostgreSQL 15
- **ORM**: Prisma 5.22.0
- **Authentification**: JWT (jsonwebtoken 9.0.3)
- **Sécurité**: bcrypt 6.0.0
- **Documentation API**: Swagger (swagger-jsdoc, swagger-ui-express)

### Frontend
- **Framework**: React 19.2.3
- **Routing**: React Router DOM 7.12.0
- **Styling**: Tailwind CSS 3.4.19
- **Graphiques**: Recharts 3.6.0
- **Icônes**: Lucide React 0.562.0
- **Build**: React Scripts 5.0.1

### DevOps & Infrastructure
- **Containerisation**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Web Server**: Nginx (pour le frontend en production)

## 📁 Structure du projet

```
LevelUp/
├── backend/
│   └── level-up/
│       ├── src/
│       │   ├── app.js                 # Configuration Express
│       │   ├── server.js              # Point d'entrée serveur
│       │   ├── prisma.js              # Client Prisma
│       │   ├── config/
│       │   │   └── swagger.js         # Configuration Swagger
│       │   ├── controllers/          # Contrôleurs (logique métier)
│       │   ├── services/             # Services (logique applicative)
│       │   ├── routes/               # Routes API
│       │   ├── middleware/           # Middlewares (auth, etc.)
│       │   └── utils/                # Utilitaires
│       ├── prisma/
│       │   ├── schema.prisma         # Schéma de base de données
│       │   └── migrations/           # Migrations Prisma
│       ├── Dockerfile
│       ├── package.json
│       └── .env.example
├── frontend/
│   └── level-up/
│       ├── src/
│       │   ├── components/           # Composants React
│       │   ├── pages/                # Pages de l'application
│       │   ├── services/             # Services API
│       │   ├── context/              # Contextes React (Auth)
│       │   └── hooks/                # Hooks personnalisés
│       ├── public/
│       ├── Dockerfile
│       ├── nginx.conf
│       ├── package.json
│       └── .env.example
├── .github/
│   └── workflows/
│       └── ci.yml                    # Pipeline CI/CD
├── docker-compose.yml                # Configuration Docker Compose
└── README.md
```

## 📋 Prérequis

- **Node.js** 20 ou supérieur
- **npm** ou **yarn**
- **PostgreSQL** 15 ou supérieur
- **Docker** et **Docker Compose** (optionnel, pour l'installation avec Docker)

## 🚀 Installation

### Installation avec Docker (Recommandé)

1. **Cloner le repository**
   ```bash
   git clone https://github.com/USERNAME/LevelUp.git
   cd LevelUp
   ```

2. **Configurer les variables d'environnement**
   
   Créer les fichiers `.env` à partir des exemples :
   ```bash
   cp backend/level-up/.env.example backend/level-up/.env
   cp frontend/level-up/.env.example frontend/level-up/.env
   ```
   
   Éditer `backend/level-up/.env` :
   ```env
   DATABASE_URL=postgresql://admin:password@postgres:5432/levelup
   JWT_SECRET=votre_secret_jwt_super_securise
   PORT=3000
   API_URL=http://localhost:5001
   ```
   
   Éditer `frontend/level-up/.env` :
   ```env
   REACT_APP_API_BASE=http://localhost:5001/api
   ```

3. **Lancer avec Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Accéder à l'application**
   - Frontend : http://localhost:3000
   - Backend API : http://localhost:5001
   - Documentation API (Swagger) : http://localhost:5001/api-docs

### Installation manuelle

#### Backend

1. **Naviguer vers le dossier backend**
   ```bash
   cd backend/level-up
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer la base de données**
   
   Créer un fichier `.env` :
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/levelup
   JWT_SECRET=votre_secret_jwt_super_securise
   PORT=3000
   API_URL=http://localhost:3000
   ```

4. **Générer le client Prisma**
   ```bash
   npx prisma generate
   ```

5. **Exécuter les migrations**
   ```bash
   npx prisma migrate deploy
   ```

6. **Lancer le serveur**
   ```bash
   npm run dev
   ```

   Le serveur sera accessible sur http://localhost:3000

#### Frontend

1. **Naviguer vers le dossier frontend**
   ```bash
   cd frontend/level-up
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   
   Créer un fichier `.env` :
   ```env
   REACT_APP_API_BASE=http://localhost:3000/api
   ```

4. **Lancer l'application**
   ```bash
   npm start
   ```

   L'application sera accessible sur http://localhost:3000

## ⚙️ Configuration

### Variables d'environnement

Pour une documentation complète des variables d'environnement, consultez [docs/ENV.md](./docs/ENV.md).

**Backend** (`backend/level-up/.env`) :
- `DATABASE_URL` : URL de connexion PostgreSQL
- `JWT_SECRET` : Secret pour signer les tokens JWT
- `PORT` : Port du serveur Express (défaut: 3000)
- `API_URL` : URL de l'API (pour Swagger)

**Frontend** (`frontend/level-up/.env`) :
- `REACT_APP_API_BASE` : URL de base de l'API backend

**Note** : Créez les fichiers `.env` à partir des templates `.env.example` (voir [docs/ENV.md](./docs/ENV.md) pour plus de détails).

## 📖 Utilisation

### Première utilisation

1. **Créer un compte**
   - Accéder à la page d'inscription
   - Remplir le formulaire (nom, email, mot de passe)
   - Se connecter avec vos identifiants

2. **Créer un objectif**
   - Cliquer sur "Objectifs" dans le menu
   - Cliquer sur "Nouvel objectif"
   - Remplir les informations (titre, description, catégorie, priorité, dates)
   - Optionnellement, ajouter des étapes

3. **Créer une habitude**
   - Cliquer sur "Habitudes" dans le menu
   - Cliquer sur "Nouvelle habitude"
   - Définir la fréquence (quotidienne ou hebdomadaire)
   - Enregistrer vos complétions quotidiennes

4. **Consulter vos statistiques**
   - Accéder au Dashboard pour une vue d'ensemble
   - Consulter les statistiques détaillées dans la section "Statistiques"

## 📚 Documentation API

La documentation complète de l'API est disponible via Swagger UI à l'adresse :
- **Développement** : http://localhost:5001/api-docs
- **Production** : https://levelup-1gqw.onrender.com/api-docs

### Endpoints principaux

#### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur
- `PUT /api/auth/me` - Mise à jour du profil

#### Objectifs
- `GET /api/goals` - Liste des objectifs
- `POST /api/goals` - Créer un objectif
- `GET /api/goals/:id` - Détails d'un objectif
- `PUT /api/goals/:id` - Modifier un objectif
- `PATCH /api/goals/:id/complete` - Marquer comme complété
- `PATCH /api/goals/:id/abandon` - Abandonner un objectif
- `DELETE /api/goals/:id` - Supprimer un objectif

#### Habitudes
- `GET /api/habits` - Liste des habitudes
- `POST /api/habits` - Créer une habitude
- `PUT /api/habits/:id` - Modifier une habitude
- `DELETE /api/habits/:id` - Archiver une habitude

#### Logs d'habitudes
- `POST /api/habitsLog/:id/log` - Enregistrer une complétion
- `GET /api/habitsLog/:id/logs` - Historique des logs
- `DELETE /api/habitsLog/:id/log/:date` - Supprimer un log

#### Statistiques
- `GET /api/stats` - Statistiques globales
- `GET /api/stats/goals` - Statistiques des objectifs
- `GET /api/stats/habits` - Statistiques des habitudes

#### Dashboard
- `GET /api/dashboard` - Vue d'ensemble

Pour plus de détails, consultez la [documentation API complète](./docs/API.md).

### Documentation complète

- [📚 Documentation API](./docs/API.md) - Tous les endpoints de l'API
- [🗄️ Schéma de base de données](./docs/DATABASE.md) - Structure de la base de données
- [🧮 Algorithmes de calcul](./docs/ALGORITHMS.md) - Calculs de streaks, progression, etc.
- [🏗️ Architecture technique](./docs/ARCHITECTURE.md) - Architecture du système
- [🔐 Variables d'environnement](./docs/ENV.md) - Configuration des variables d'environnement

## 🏗 Architecture

### Backend

L'architecture backend suit le pattern MVC (Model-View-Controller) :

- **Routes** : Définissent les endpoints et délèguent aux contrôleurs
- **Controllers** : Gèrent les requêtes HTTP et les réponses
- **Services** : Contiennent la logique métier
- **Models** : Définis via Prisma Schema

### Frontend

L'architecture frontend utilise :

- **Pages** : Composants de page principaux
- **Components** : Composants réutilisables
- **Services** : Appels API
- **Context** : Gestion d'état globale (AuthContext)

Pour plus de détails, consultez la [documentation technique](./docs/ARCHITECTURE.md).

## 🧪 Tests

### Backend

```bash
cd backend/level-up
npm test
```

### Frontend

```bash
cd frontend/level-up
npm test
```

## 🚢 Déploiement

Le projet est configuré pour un déploiement automatique via GitHub Actions vers Render.com.

### Déploiement manuel

1. **Build du frontend**
   ```bash
   cd frontend/level-up
   npm run build
   ```

2. **Build des images Docker**
   ```bash
   docker-compose build
   ```

3. **Déploiement**
   - Suivre les instructions de votre plateforme de déploiement
   - Configurer les variables d'environnement
   - Exécuter les migrations Prisma

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez consulter le fichier [CONTRIBUTING.md](./CONTRIBUTING.md) pour les bonnes pratiques de contribution.

## 📄 License

Ce projet est sous licence ISC.

---

**Développé avec ❤️ pour vous aider à atteindre vos objectifs !**
