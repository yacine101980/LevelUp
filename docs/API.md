# 📚 Documentation API LevelUp

Cette documentation décrit l'ensemble des endpoints de l'API LevelUp.

## Base URL

- **Développement** : `http://localhost:5001/api`
- **Production** : `https://levelup-1gqw.onrender.com/api`

## Authentification

L'API utilise l'authentification JWT (JSON Web Token). Pour accéder aux endpoints protégés, inclure le token dans l'en-tête `Authorization` :

```
Authorization: Bearer <votre_token_jwt>
```

Les tokens expirent après 7 jours.

---

## 🔐 Authentification

### POST /api/auth/register

Inscrire un nouvel utilisateur.

**Requête :**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Réponse 201 :**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2024-01-15T10:00:00Z"
}
```

**Erreurs :**
- `409` : Utilisateur déjà existant
- `400` : Champs manquants

---

### POST /api/auth/login

Connecter un utilisateur.

**Requête :**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse 200 :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erreurs :**
- `401` : Identifiants invalides

---

### POST /api/auth/logout

Déconnecter un utilisateur (stateless - le frontend supprime le token).

**Headers :** `Authorization: Bearer <token>`

**Réponse 200 :**
```json
{
  "message": "Logged out successfully"
}
```

---

### GET /api/auth/me

Récupérer le profil de l'utilisateur connecté.

**Headers :** `Authorization: Bearer <token>`

**Réponse 200 :**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "level": 5,
  "xp_points": 1250,
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-20T15:30:00Z"
}
```

---

### PUT /api/auth/me

Mettre à jour le profil utilisateur.

**Headers :** `Authorization: Bearer <token>`

**Requête :**
```json
{
  "name": "Jane Doe",
  "password": "newpassword123"
}
```

**Réponse 200 :**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "Jane Doe",
  "updated_at": "2024-01-20T15:30:00Z"
}
```

---

## 🎯 Objectifs (Goals)

### GET /api/goals

Récupérer la liste des objectifs de l'utilisateur.

**Headers :** `Authorization: Bearer <token>`

**Query Parameters :**
- `status` (optionnel) : `active`, `completed`, `abandoned`
- `priority` (optionnel) : `low`, `medium`, `high`

**Réponse 200 :**
```json
[
  {
    "id": 1,
    "title": "Apprendre React",
    "description": "Maîtriser les fondamentaux de React",
    "category": "Apprentissage",
    "priority": "high",
    "status": "active",
    "start_date": "2024-01-15T00:00:00Z",
    "deadline": "2024-06-30T23:59:59Z",
    "completed_at": null,
    "user_id": 1,
    "steps": [
      {
        "id": 1,
        "title": "Installer React",
        "deadline": "2024-02-01T23:59:59Z",
        "is_completed": true,
        "order": 1
      }
    ],
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-20T15:30:00Z"
  }
]
```

---

### POST /api/goals

Créer un nouvel objectif.

**Headers :** `Authorization: Bearer <token>`

**Requête :**
```json
{
  "title": "Apprendre React",
  "description": "Maîtriser les fondamentaux de React",
  "category": "Apprentissage",
  "priority": "high",
  "start_date": "2024-01-15T00:00:00Z",
  "deadline": "2024-06-30T23:59:59Z",
  "steps": [
    {
      "title": "Installer React",
      "deadline": "2024-02-01T23:59:59Z",
      "completed": false
    }
  ]
}
```

**Réponse 201 :**
```json
{
  "id": 1,
  "title": "Apprendre React",
  "description": "Maîtriser les fondamentaux de React",
  "category": "Apprentissage",
  "priority": "high",
  "status": "active",
  "start_date": "2024-01-15T00:00:00Z",
  "deadline": "2024-06-30T23:59:59Z",
  "user_id": 1
}
```

---

### GET /api/goals/:id

Récupérer un objectif spécifique.

**Headers :** `Authorization: Bearer <token>`

**Réponse 200 :**
```json
{
  "id": 1,
  "title": "Apprendre React",
  "description": "Maîtriser les fondamentaux de React",
  "category": "Apprentissage",
  "priority": "high",
  "status": "active",
  "start_date": "2024-01-15T00:00:00Z",
  "deadline": "2024-06-30T23:59:59Z",
  "user_id": 1,
  "steps": []
}
```

**Erreurs :**
- `404` : Objectif non trouvé

---

### PUT /api/goals/:id

Mettre à jour un objectif.

**Headers :** `Authorization: Bearer <token>`

**Requête :**
```json
{
  "title": "Apprendre React et Next.js",
  "description": "Maîtriser React et Next.js",
  "priority": "high"
}
```

**Réponse 200 :**
```json
{
  "id": 1,
  "title": "Apprendre React et Next.js",
  "description": "Maîtriser React et Next.js",
  "priority": "high",
  "status": "active"
}
```

---

### PATCH /api/goals/:id/complete

Marquer un objectif comme complété.

**Headers :** `Authorization: Bearer <token>`

**Réponse 200 :**
```json
{
  "id": 1,
  "title": "Apprendre React",
  "status": "completed",
  "completed_at": "2024-01-20T15:30:00Z"
}
```

---

### PATCH /api/goals/:id/abandon

Abandonner un objectif.

**Headers :** `Authorization: Bearer <token>`

**Réponse 200 :**
```json
{
  "id": 1,
  "title": "Apprendre React",
  "status": "abandoned"
}
```

---

### DELETE /api/goals/:id

Supprimer un objectif.

**Headers :** `Authorization: Bearer <token>`

**Réponse 204 :** Pas de contenu

---

## 📊 Habitudes (Habits)

### GET /api/habits

Récupérer la liste des habitudes actives de l'utilisateur.

**Headers :** `Authorization: Bearer <token>`

**Réponse 200 :**
```json
[
  {
    "id": 1,
    "name": "Méditation matinale",
    "description": "10 minutes de méditation chaque matin",
    "category": "Bien-être",
    "frequency": "daily",
    "weekly_target": null,
    "start_date": "2024-01-15T00:00:00Z",
    "is_archived": false,
    "user_id": 1,
    "habitLogs": [],
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-20T15:30:00Z"
  }
]
```

---

### POST /api/habits

Créer une nouvelle habitude.

**Headers :** `Authorization: Bearer <token>`

**Requête :**
```json
{
  "name": "Méditation matinale",
  "description": "10 minutes de méditation chaque matin",
  "category": "Bien-être",
  "frequency": "daily",
  "weekly_target": null,
  "start_date": "2024-01-15T00:00:00Z"
}
```

**Réponse 201 :**
```json
{
  "id": 1,
  "name": "Méditation matinale",
  "description": "10 minutes de méditation chaque matin",
  "category": "Bien-être",
  "frequency": "daily",
  "weekly_target": null,
  "start_date": "2024-01-15T00:00:00Z",
  "is_archived": false,
  "user_id": 1
}
```

---

### PUT /api/habits/:id

Mettre à jour une habitude.

**Headers :** `Authorization: Bearer <token>`

**Requête :**
```json
{
  "name": "Méditation du soir",
  "description": "15 minutes de méditation chaque soir",
  "frequency": "daily"
}
```

**Réponse 200 :**
```json
{
  "id": 1,
  "name": "Méditation du soir",
  "description": "15 minutes de méditation chaque soir",
  "frequency": "daily",
  "is_archived": false
}
```

---

### DELETE /api/habits/:id

Archiver une habitude (soft delete).

**Headers :** `Authorization: Bearer <token>`

**Réponse 200 :**
```json
{
  "id": 1,
  "name": "Méditation matinale",
  "is_archived": true
}
```

---

## 📝 Logs d'habitudes (Habit Logs)

### POST /api/habitsLog/:id/log

Enregistrer une complétion d'habitude pour aujourd'hui.

**Headers :** `Authorization: Bearer <token>`

**Requête (optionnel) :**
```json
{
  "notes": "J'ai bien aimé la méditation aujourd'hui !"
}
```

**Réponse 201 :**
```json
{
  "id": 1,
  "habit_id": 1,
  "date": "2024-01-20T00:00:00Z",
  "is_completed": true,
  "notes": "J'ai bien aimé la méditation aujourd'hui !",
  "created_at": "2024-01-20T10:00:00Z"
}
```

**Erreurs :**
- `409` : Habitude déjà enregistrée pour aujourd'hui
- `404` : Habitude non trouvée

---

### GET /api/habitsLog/:id/logs

Récupérer l'historique des logs d'une habitude.

**Headers :** `Authorization: Bearer <token>`

**Query Parameters :**
- `start_date` (optionnel) : Date de début (YYYY-MM-DD)
- `end_date` (optionnel) : Date de fin (YYYY-MM-DD)

**Réponse 200 :**
```json
[
  {
    "id": 1,
    "habit_id": 1,
    "date": "2024-01-20T00:00:00Z",
    "is_completed": true,
    "notes": "J'ai bien aimé la méditation aujourd'hui !",
    "created_at": "2024-01-20T10:00:00Z"
  }
]
```

---

### DELETE /api/habitsLog/:id/log/:date

Supprimer un log d'habitude spécifique.

**Headers :** `Authorization: Bearer <token>`

**Réponse 204 :** Pas de contenu

---

## 📈 Statistiques

### GET /api/stats

Récupérer les statistiques globales de l'utilisateur.

**Headers :** `Authorization: Bearer <token>`

**Réponse 200 :**
```json
{
  "goalsCompletionRate": 75,
  "habitsTracked": 5,
  "habitLogs": 120
}
```

---

### GET /api/stats/goals

Récupérer les statistiques des objectifs par catégorie.

**Headers :** `Authorization: Bearer <token>`

**Réponse 200 :**
```json
[
  {
    "category": "Apprentissage",
    "status": "active",
    "_count": 3
  },
  {
    "category": "Apprentissage",
    "status": "completed",
    "_count": 2
  }
]
```

---

### GET /api/stats/habits

Récupérer les statistiques des habitudes.

**Headers :** `Authorization: Bearer <token>`

**Réponse 200 :**
```json
[
  {
    "habitId": 1,
    "name": "Méditation matinale",
    "totalLogs": 45,
    "frequency": "daily"
  }
]
```

---

### GET /api/habitsLog/:id/stats

Récupérer les statistiques d'une habitude spécifique.

**Headers :** `Authorization: Bearer <token>`

**Réponse 200 :**
```json
{
  "habitId": 1,
  "streak": 15,
  "completionRate": 85,
  "totalLogs": 45,
  "daysSinceStart": 53
}
```

---

## 🏠 Dashboard

### GET /api/dashboard

Récupérer les données du dashboard.

**Headers :** `Authorization: Bearer <token>`

**Réponse 200 :**
```json
{
  "goals": {
    "total": 10,
    "completed": 7,
    "active": 3
  },
  "habits": {
    "active": 5,
    "logs": 120
  }
}
```

---

## 🪜 Étapes (Steps)

### POST /api/steps/:id

Créer une étape pour un objectif.

**Headers :** `Authorization: Bearer <token>`

**Requête :**
```json
{
  "title": "Installer React",
  "deadline": "2024-02-01T23:59:59Z",
  "order": 1
}
```

**Réponse 201 :**
```json
{
  "id": 1,
  "title": "Installer React",
  "deadline": "2024-02-01T23:59:59Z",
  "is_completed": false,
  "order": 1,
  "goal_id": 1
}
```

---

### PUT /api/steps/:id

Mettre à jour une étape.

**Headers :** `Authorization: Bearer <token>`

**Requête :**
```json
{
  "title": "Installer React et Next.js",
  "deadline": "2024-02-05T23:59:59Z",
  "order": 1
}
```

**Réponse 200 :**
```json
{
  "id": 1,
  "title": "Installer React et Next.js",
  "deadline": "2024-02-05T23:59:59Z",
  "is_completed": false,
  "order": 1,
  "goal_id": 1
}
```

---

### PATCH /api/steps/:id/complete

Marquer une étape comme complétée.

**Headers :** `Authorization: Bearer <token>`

**Réponse 200 :**
```json
{
  "id": 1,
  "title": "Installer React",
  "is_completed": true,
  "completed_at": "2024-01-20T15:30:00Z",
  "goal_id": 1
}
```

---

### DELETE /api/steps/:id

Supprimer une étape.

**Headers :** `Authorization: Bearer <token>`

**Réponse 204 :** Pas de contenu

---

## Codes d'erreur

| Code | Description |
|------|-------------|
| `200` | Succès |
| `201` | Créé avec succès |
| `204` | Succès sans contenu |
| `400` | Requête invalide |
| `401` | Non autorisé |
| `404` | Ressource non trouvée |
| `409` | Conflit (ex: ressource déjà existante) |
| `500` | Erreur serveur |

---

## Documentation Swagger

Pour une documentation interactive, accédez à :
- **Développement** : http://localhost:5001/api-docs
- **Production** : https://levelup-1gqw.onrender.com/api-docs
