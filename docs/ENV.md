# 🔐 Variables d'environnement

Ce document liste toutes les variables d'environnement nécessaires pour configurer LevelUp.

## 📋 Backend

Créer un fichier `.env` dans `backend/level-up/` avec les variables suivantes :

```env
# Configuration de la base de données PostgreSQL
DATABASE_URL=postgresql://admin:password@localhost:5432/levelup

# Secret JWT pour l'authentification (à changer en production)
# Générer un secret sécurisé avec : openssl rand -base64 32
JWT_SECRET=votre_secret_jwt_super_securise_changez_moi

# Port du serveur Express
PORT=3000

# URL de l'API (utilisée pour Swagger)
API_URL=http://localhost:3000
```

### Description des variables

| Variable | Description | Exemple | Requis |
|----------|-------------|---------|--------|
| `DATABASE_URL` | URL de connexion PostgreSQL au format `postgresql://user:password@host:port/database` | `postgresql://admin:password@localhost:5432/levelup` | ✅ Oui |
| `JWT_SECRET` | Secret utilisé pour signer et vérifier les tokens JWT. **Doit être changé en production !** | `votre_secret_jwt_super_securise` | ✅ Oui |
| `PORT` | Port sur lequel le serveur Express écoute | `3000` | ❌ Non (défaut: 3000) |
| `API_URL` | URL de base de l'API utilisée dans la documentation Swagger | `http://localhost:3000` | ❌ Non |

---

## 🎨 Frontend

Créer un fichier `.env` dans `frontend/level-up/` avec la variable suivante :

```env
# URL de base de l'API backend
REACT_APP_API_BASE=http://localhost:5001/api
```

### Description des variables

| Variable | Description | Exemple | Requis |
|----------|-------------|---------|--------|
| `REACT_APP_API_BASE` | URL de base de l'API backend. Tous les appels API utiliseront cette URL comme préfixe. | `http://localhost:5001/api` | ✅ Oui |

### Note importante

Les variables d'environnement React doivent commencer par `REACT_APP_` pour être accessibles dans le code. Elles sont injectées au moment du build.

---

## 🐳 Docker Compose

Lors de l'utilisation de Docker Compose, les variables sont définies dans les fichiers `.env` respectifs ou directement dans `docker-compose.yml`.

### Configuration Docker Compose

Le fichier `docker-compose.yml` utilise les fichiers `.env` des services :

```yaml
services:
  backend:
    env_file:
      - ./backend/level-up/.env
  
  frontend:
    # Les variables sont passées via ARG dans le Dockerfile
    build:
      args:
        REACT_APP_API_BASE: ${REACT_APP_API_BASE:-http://localhost:5001/api}
```

---

## 🌍 Environnements

### Développement local

**Backend :**
```env
DATABASE_URL=postgresql://admin:password@localhost:5432/levelup
JWT_SECRET=dev_secret_change_in_production
PORT=3000
API_URL=http://localhost:3000
```

**Frontend :**
```env
REACT_APP_API_BASE=http://localhost:5001/api
```

### Production

**Backend :**
```env
DATABASE_URL=postgresql://user:password@production-db-host:5432/levelup
JWT_SECRET=<secret_généré_aléatoirement>
PORT=3000
API_URL=https://api.levelup.com
```

**Frontend :**
```env
REACT_APP_API_BASE=https://api.levelup.com/api
```

---

## 🔒 Sécurité

### Bonnes pratiques

1. **Ne jamais commiter les fichiers `.env`**
   - Vérifier que `.env` est dans `.gitignore`
   - Utiliser `.env.example` comme template

2. **Utiliser des secrets forts**
   - `JWT_SECRET` : Au moins 32 caractères aléatoires
   - Mots de passe de base de données : Complexes et uniques

3. **Variables différentes par environnement**
   - Ne pas réutiliser les secrets de production en développement
   - Utiliser des services de gestion de secrets (AWS Secrets Manager, HashiCorp Vault, etc.)

4. **Rotation des secrets**
   - Changer régulièrement les secrets en production
   - Planifier la rotation des tokens JWT

---

## 📝 Fichiers .env.example

Les fichiers `.env.example` servent de template et doivent être versionnés :

- `backend/level-up/.env.example`
- `frontend/level-up/.env.example`

Ces fichiers contiennent les variables nécessaires sans valeurs sensibles.

---

## 🧪 Tests

Pour les tests, utiliser une base de données de test séparée :

```env
DATABASE_URL=postgresql://admin:password@localhost:5432/levelup_test
JWT_SECRET=test_secret
NODE_ENV=test
```

---

## ❓ Dépannage

### Les variables ne sont pas chargées

1. Vérifier que le fichier `.env` existe dans le bon répertoire
2. Vérifier que `dotenv` est installé et configuré (backend)
3. Redémarrer le serveur après modification des variables
4. Pour React, reconstruire l'application (`npm run build`)

### Erreur de connexion à la base de données

1. Vérifier le format de `DATABASE_URL`
2. Vérifier que PostgreSQL est démarré
3. Vérifier les credentials (user, password)
4. Vérifier que la base de données existe

### Token JWT invalide

1. Vérifier que `JWT_SECRET` est défini
2. Vérifier que le même secret est utilisé partout
3. Vérifier que le token n'a pas expiré (7 jours)

---

## 📚 Ressources

- [Documentation Prisma - Environment Variables](https://www.prisma.io/docs/concepts/more/environment-variables)
- [React - Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Node.js - dotenv](https://github.com/motdotla/dotenv)
