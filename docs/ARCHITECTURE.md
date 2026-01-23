# 🏗️ Architecture technique LevelUp

Cette documentation décrit l'architecture technique de l'application LevelUp.

## 📐 Vue d'ensemble

LevelUp est une application web full-stack avec une architecture séparée entre le frontend et le backend, communiquant via une API REST.

```
┌─────────────┐         HTTP/REST         ┌─────────────┐
│   Frontend  │ ◄──────────────────────► │   Backend   │
│   (React)   │                           │  (Express)  │
└─────────────┘                           └──────┬──────┘
                                                 │
                                                 ▼
                                          ┌─────────────┐
                                          │  PostgreSQL │
                                          │  (Prisma)   │
                                          └─────────────┘
```

## 🎨 Frontend

### Stack technique

- **Framework** : React 19.2.3
- **Routing** : React Router DOM 7.12.0
- **Styling** : Tailwind CSS 3.4.19
- **Graphiques** : Recharts 3.6.0
- **Build** : React Scripts 5.0.1

### Architecture

```
frontend/level-up/src/
├── components/          # Composants réutilisables
│   ├── GoalCard.jsx
│   ├── HabitCard.jsx
│   ├── GoalForm.jsx
│   └── ...
├── pages/               # Pages de l'application
│   ├── Dashboard.jsx
│   ├── Goals.jsx
│   ├── Habits.jsx
│   ├── Login.jsx
│   └── Register.jsx
├── services/            # Services API
│   ├── authService.js
│   ├── goalsService.js
│   ├── habitsService.js
│   └── ...
├── context/             # Contextes React
│   └── AuthContext.js
└── hooks/               # Hooks personnalisés
    └── useLocalStorage.js
```

### Flux de données

```
User Action → Component → Service → API → Backend
                ▲                              │
                └──────── Response ────────────┘
```

### Gestion d'état

- **AuthContext** : Gestion de l'authentification globale
- **Local Storage** : Persistance du token JWT
- **State local** : État des composants individuels

### Exemple de service

```javascript
// services/goalsService.js
const API_BASE = process.env.REACT_APP_API_BASE

export const getGoals = async (token) => {
  const response = await fetch(`${API_BASE}/goals`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return response.json()
}
```

## ⚙️ Backend

### Stack technique

- **Runtime** : Node.js 20
- **Framework** : Express.js 5.2.1
- **ORM** : Prisma 5.22.0
- **Base de données** : PostgreSQL 15
- **Authentification** : JWT (jsonwebtoken)
- **Documentation** : Swagger

### Architecture

```
backend/level-up/src/
├── app.js                 # Configuration Express
├── server.js              # Point d'entrée
├── prisma.js              # Client Prisma
├── config/
│   └── swagger.js        # Configuration Swagger
├── controllers/           # Contrôleurs (logique HTTP)
│   ├── auth.controller.js
│   ├── goals.controller.js
│   └── ...
├── services/              # Services (logique métier)
│   ├── auth.service.js
│   ├── goals.service.js
│   └── ...
├── routes/                # Routes API
│   ├── auth.routes.js
│   ├── goals.routes.js
│   └── ...
├── middleware/            # Middlewares
│   └── auth.middleware.js
└── utils/                 # Utilitaires
    └── jwt.js
```

### Pattern MVC

Le backend suit le pattern **MVC (Model-View-Controller)** :

- **Model** : Défini via Prisma Schema
- **View** : Réponses JSON (pas de vues HTML)
- **Controller** : Gère les requêtes HTTP

### Flux de requête

```
HTTP Request → Route → Middleware (Auth) → Controller → Service → Prisma → Database
                                                                        │
Response ← JSON ← Controller ← Service ← Prisma ←─────────────────────┘
```

### Exemple de route

```javascript
// routes/goals.routes.js
router.get('/', authMiddleware, goalsController.list)

// controllers/goals.controller.js
exports.list = async (req, res) => {
  try {
    const goals = await goalsService.getGoals(req.userId, req.query)
    res.json(goals)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// services/goals.service.js
exports.getGoals = (userId, filters) => {
  return prisma.goal.findMany({
    where: { user_id: userId, ...filters },
    include: { steps: true }
  })
}
```

### Middleware d'authentification

```javascript
// middleware/auth.middleware.js
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}
```

## 🗄️ Base de données

### PostgreSQL avec Prisma

- **ORM** : Prisma
- **Migrations** : Prisma Migrate
- **Client** : Prisma Client (généré automatiquement)

### Schéma

Voir [DATABASE.md](./DATABASE.md) pour le schéma complet.

### Relations principales

- `User` 1-N `Goal`
- `User` 1-N `Habit`
- `Goal` 1-N `Step`
- `Habit` 1-N `HabitLog`

## 🐳 Docker

### Architecture Docker

```
docker-compose.yml
├── frontend (Nginx)
├── backend (Node.js)
└── postgres (PostgreSQL)
```

### Services

#### Backend

```dockerfile
FROM node:20
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
```

#### Frontend

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

#### PostgreSQL

```yaml
postgres:
  image: postgres:15
  environment:
    POSTGRES_USER: admin
    POSTGRES_PASSWORD: password
    POSTGRES_DB: levelup
  volumes:
    - postgres_data:/var/lib/postgresql/data
```

## 🔄 CI/CD

### GitHub Actions

Le pipeline CI/CD comprend :

1. **Frontend CI**
   - Installation des dépendances
   - Tests
   - Build

2. **Backend CI**
   - Installation des dépendances
   - Génération Prisma Client
   - Migrations
   - Tests
   - Build

3. **Docker Build**
   - Build des images Docker
   - Push vers Docker Hub

4. **Deploy**
   - Déploiement automatique vers Render.com (sur main)

Voir [.github/workflows/ci.yml](../.github/workflows/ci.yml)

## 🔐 Sécurité

### Authentification

- **JWT** : Tokens signés avec secret
- **Expiration** : 7 jours
- **Hash** : bcrypt pour les mots de passe (10 rounds)

### CORS

```javascript
app.use(cors()) // Configuré pour accepter les requêtes du frontend
```

### Validation

- Validation des données dans les contrôleurs
- Vérification des permissions (userId)
- Protection contre les injections SQL (Prisma)

## 📊 Performance

### Optimisations

1. **Requêtes Prisma** : Utilisation de `include` pour éviter N+1
2. **Index** : Index sur les champs fréquemment recherchés
3. **Caching** : À implémenter pour les statistiques

### Exemple d'optimisation

```javascript
// ❌ N+1 queries
const goals = await prisma.goal.findMany({ where: { user_id } })
for (const goal of goals) {
  goal.steps = await prisma.step.findMany({ where: { goal_id: goal.id } })
}

// ✅ Single query with include
const goals = await prisma.goal.findMany({
  where: { user_id },
  include: { steps: true }
})
```

## 🧪 Tests

### Structure

```
backend/level-up/tests/
├── unit/
│   ├── services/
│   └── utils/
└── integration/
    └── routes/

frontend/level-up/src/
└── __tests__/
    ├── components/
    └── services/
```

### Outils

- **Backend** : Jest ou Mocha
- **Frontend** : React Testing Library
- **E2E** : À implémenter (Cypress, Playwright)

## 📦 Déploiement

### Environnements

- **Development** : Local avec Docker Compose
- **Staging** : Render.com (optionnel)
- **Production** : Render.com

### Variables d'environnement

Voir [README.md](../README.md#configuration) pour la liste complète.

## 🔮 Améliorations futures

1. **Cache** : Redis pour les statistiques
2. **WebSockets** : Notifications en temps réel
3. **Microservices** : Séparation des services (optionnel)
4. **GraphQL** : Alternative à REST (optionnel)
5. **Monitoring** : APM, logs centralisés
6. **Tests E2E** : Automatisation complète

## 📚 Ressources

- [Documentation API](./API.md)
- [Schéma de base de données](./DATABASE.md)
- [Algorithmes](./ALGORITHMS.md)
- [Guide de contribution](../CONTRIBUTING.md)
