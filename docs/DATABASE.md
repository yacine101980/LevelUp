# 🗄️ Schéma de base de données LevelUp

Cette documentation décrit le schéma de base de données de l'application LevelUp.

## Vue d'ensemble

La base de données utilise **PostgreSQL** et est gérée via **Prisma ORM**. Le schéma comprend 5 modèles principaux : `User`, `Goal`, `Step`, `Habit`, et `HabitLog`.

## Diagramme ER

```
User (1) ────< (N) Goal
User (1) ────< (N) Habit
Goal (1) ────< (N) Step
Habit (1) ────< (N) HabitLog
```

## Modèles

### User (Utilisateur)

Représente un utilisateur de l'application.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| `id` | `Int` | PK, Auto-increment | Identifiant unique |
| `email` | `String` | Unique, Requis | Adresse email (utilisée pour la connexion) |
| `password` | `String` | Requis | Mot de passe hashé (bcrypt) |
| `name` | `String` | Requis | Nom de l'utilisateur |
| `level` | `Int` | Défaut: 1 | Niveau de l'utilisateur (gamification) |
| `xp_points` | `Int` | Défaut: 0 | Points d'expérience accumulés |
| `created_at` | `DateTime` | Défaut: now() | Date de création |
| `updated_at` | `DateTime` | Auto-update | Date de dernière mise à jour |

**Relations :**
- `goals` : Relation 1-N avec `Goal`
- `habits` : Relation 1-N avec `Habit`

**Index :**
- Index unique sur `email`

---

### Goal (Objectif)

Représente un objectif défini par l'utilisateur.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| `id` | `Int` | PK, Auto-increment | Identifiant unique |
| `title` | `String` | Requis | Titre de l'objectif |
| `description` | `String?` | Optionnel | Description détaillée |
| `category` | `String?` | Optionnel | Catégorie (ex: "Apprentissage", "Santé") |
| `priority` | `Priority` | Défaut: medium | Priorité (low, medium, high) |
| `status` | `GoalStatus` | Défaut: active | Statut (active, completed, abandoned) |
| `start_date` | `DateTime?` | Optionnel | Date de début |
| `deadline` | `DateTime?` | Optionnel | Date d'échéance |
| `completed_at` | `DateTime?` | Optionnel | Date de complétion |
| `user_id` | `Int` | FK, Requis | Référence à `User.id` |
| `created_at` | `DateTime` | Défaut: now() | Date de création |
| `updated_at` | `DateTime` | Auto-update | Date de dernière mise à jour |

**Relations :**
- `user` : Relation N-1 avec `User`
- `steps` : Relation 1-N avec `Step`

**Enums :**
- `Priority` : `low`, `medium`, `high`
- `GoalStatus` : `active`, `completed`, `abandoned`

---

### Step (Étape)

Représente une étape d'un objectif.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| `id` | `Int` | PK, Auto-increment | Identifiant unique |
| `title` | `String` | Requis | Titre de l'étape |
| `deadline` | `DateTime?` | Optionnel | Date d'échéance de l'étape |
| `is_completed` | `Boolean` | Défaut: false | Statut de complétion |
| `order` | `Int?` | Optionnel | Ordre d'affichage |
| `goal_id` | `Int` | FK, Requis | Référence à `Goal.id` |
| `created_at` | `DateTime` | Défaut: now() | Date de création |
| `completed_at` | `DateTime?` | Optionnel | Date de complétion |

**Relations :**
- `goal` : Relation N-1 avec `Goal`

---

### Habit (Habitude)

Représente une habitude suivie par l'utilisateur.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| `id` | `Int` | PK, Auto-increment | Identifiant unique |
| `name` | `String` | Requis | Nom de l'habitude |
| `description` | `String?` | Optionnel | Description |
| `category` | `String?` | Optionnel | Catégorie |
| `frequency` | `Frequency` | Requis | Fréquence (daily, weekly) |
| `weekly_target` | `Int?` | Optionnel | Cible hebdomadaire (si frequency = weekly) |
| `start_date` | `DateTime?` | Optionnel | Date de début |
| `is_archived` | `Boolean` | Défaut: false | Statut d'archivage (soft delete) |
| `user_id` | `Int` | FK, Requis | Référence à `User.id` |
| `created_at` | `DateTime` | Défaut: now() | Date de création |
| `updated_at` | `DateTime` | Auto-update | Date de dernière mise à jour |

**Relations :**
- `user` : Relation N-1 avec `User`
- `habitLogs` : Relation 1-N avec `HabitLog`

**Enums :**
- `Frequency` : `daily`, `weekly`

---

### HabitLog (Log d'habitude)

Représente un enregistrement de complétion d'habitude pour une date donnée.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| `id` | `Int` | PK, Auto-increment | Identifiant unique |
| `habit_id` | `Int` | FK, Requis | Référence à `Habit.id` |
| `date` | `DateTime` | Requis | Date de complétion |
| `is_completed` | `Boolean` | Défaut: true | Statut de complétion |
| `notes` | `String?` | Optionnel | Notes additionnelles |
| `created_at` | `DateTime` | Défaut: now() | Date de création |

**Relations :**
- `habit` : Relation N-1 avec `Habit`

**Contraintes :**
- Contrainte unique composite sur `(habit_id, date)` : Un seul log par habitude et par date

---

## Enums

### Priority

```prisma
enum Priority {
  low
  medium
  high
}
```

Utilisé pour définir la priorité d'un objectif.

---

### GoalStatus

```prisma
enum GoalStatus {
  active
  completed
  abandoned
}
```

Utilisé pour définir le statut d'un objectif.

---

### Frequency

```prisma
enum Frequency {
  daily
  weekly
}
```

Utilisé pour définir la fréquence d'une habitude.

---

## Relations détaillées

### User ↔ Goal
- **Type** : One-to-Many
- **Côté User** : `goals: Goal[]`
- **Côté Goal** : `user: User`, `user_id: Int`
- **Cascade** : Suppression en cascade (si un utilisateur est supprimé, ses objectifs sont supprimés)

### User ↔ Habit
- **Type** : One-to-Many
- **Côté User** : `habits: Habit[]`
- **Côté Habit** : `user: User`, `user_id: Int`
- **Cascade** : Suppression en cascade

### Goal ↔ Step
- **Type** : One-to-Many
- **Côté Goal** : `steps: Step[]`
- **Côté Step** : `goal: Goal`, `goal_id: Int`
- **Cascade** : Suppression en cascade

### Habit ↔ HabitLog
- **Type** : One-to-Many
- **Côté Habit** : `habitLogs: HabitLog[]`
- **Côté HabitLog** : `habit: Habit`, `habit_id: Int`
- **Cascade** : Suppression en cascade

---

## Index

### Index uniques

1. **User.email** : Garantit l'unicité des emails
2. **HabitLog(habit_id, date)** : Garantit un seul log par habitude et par date

---

## Migrations

Les migrations Prisma sont stockées dans `backend/level-up/prisma/migrations/`.

### Commandes Prisma

```bash
# Générer le client Prisma
npx prisma generate

# Créer une nouvelle migration
npx prisma migrate dev --name nom_de_la_migration

# Appliquer les migrations en production
npx prisma migrate deploy

# Visualiser la base de données
npx prisma studio
```

---

## Exemples de requêtes

### Récupérer un utilisateur avec ses objectifs et habitudes

```prisma
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    goals: {
      include: {
        steps: true
      }
    },
    habits: {
      include: {
        habitLogs: true
      }
    }
  }
})
```

### Récupérer les habitudes avec leurs statistiques

```prisma
const habits = await prisma.habit.findMany({
  where: { user_id: userId, is_archived: false },
  include: {
    habitLogs: {
      orderBy: { date: 'desc' }
    }
  }
})
```

---

## Notes importantes

1. **Soft Delete** : Les habitudes utilisent un soft delete via `is_archived` plutôt qu'une suppression physique
2. **Dates** : Toutes les dates sont stockées en UTC
3. **Passwords** : Les mots de passe sont hashés avec bcrypt (10 rounds)
4. **XP et Levels** : Actuellement stockés mais le calcul automatique n'est pas encore implémenté
