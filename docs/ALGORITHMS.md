# 🧮 Algorithmes de calcul LevelUp

Cette documentation décrit les algorithmes utilisés pour calculer les statistiques, les séries (streaks), et la progression dans l'application LevelUp.

## 📊 Calcul des séries (Streaks)

### Algorithme de calcul de streak

Le streak représente le nombre de jours consécutifs où une habitude a été complétée, en partant d'aujourd'hui et en remontant dans le temps.

**Implémentation :** `backend/level-up/src/services/habitStats.service.js`

```javascript
const calculateStreak = (logs) => {
  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0) // Normaliser à minuit

  // Trier les logs par date décroissante (du plus récent au plus ancien)
  const sortedLogs = logs.sort((a, b) => new Date(b.date) - new Date(a.date))

  for (const log of sortedLogs) {
    const logDate = new Date(log.date)
    logDate.setHours(0, 0, 0, 0) // Normaliser à minuit

    // Si la date du log correspond à la date attendue (jour consécutif)
    if (logDate.getTime() === currentDate.getTime()) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1) // Passer au jour précédent
    } else {
      // Si la date ne correspond pas, la série est rompue
      break
    }
  }

  return streak
}
```

### Explication

1. **Normalisation des dates** : Toutes les dates sont normalisées à minuit (00:00:00) pour éviter les problèmes de fuseaux horaires
2. **Parcours rétroactif** : L'algorithme part d'aujourd'hui et remonte dans le temps
3. **Vérification de continuité** : Pour chaque jour, on vérifie si un log existe pour ce jour exact
4. **Arrêt à la première interruption** : Dès qu'un jour manque, le streak s'arrête

### Exemple

**Logs disponibles :**
- 2024-01-20 (aujourd'hui) ✓
- 2024-01-19 ✓
- 2024-01-18 ✓
- 2024-01-17 ✗ (manquant)
- 2024-01-16 ✓

**Résultat :** Streak = 3 jours (20, 19, 18)

---

## 📈 Taux de complétion (Completion Rate)

### Algorithme de calcul du taux de complétion

Le taux de complétion représente le pourcentage de jours où une habitude a été complétée depuis sa date de début.

**Implémentation :** `backend/level-up/src/services/habitStats.service.js`

```javascript
const getHabitStats = async (habitId, userId) => {
  const habit = await prisma.habit.findFirst({
    where: { id: habitId, user_id: userId, is_archived: false }
  })

  const logs = await prisma.habitLog.findMany({
    where: { habit_id: habitId },
    orderBy: { date: 'desc' }
  })

  // Calculer le nombre de jours depuis le début
  const startDate = new Date(habit.start_date)
  startDate.setHours(0, 0, 0, 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1

  // Calculer le taux de complétion
  const completionRate = daysSinceStart > 0
    ? Math.round((logs.length / daysSinceStart) * 100)
    : 0

  return {
    habitId,
    streak: calculateStreak(logs),
    completionRate,
    totalLogs: logs.length,
    daysSinceStart
  }
}
```

### Formule

```
Taux de complétion = (Nombre de logs / Nombre de jours depuis le début) × 100
```

### Exemple

**Habitude créée le :** 2024-01-01  
**Date actuelle :** 2024-01-20  
**Nombre de logs :** 15

**Calcul :**
- Jours depuis le début : 20 jours
- Taux de complétion : (15 / 20) × 100 = 75%

---

## 🎯 Taux de complétion des objectifs

### Algorithme global

**Implémentation :** `backend/level-up/src/services/stats.service.js`

```javascript
const getGlobalStats = async (userId) => {
  const goals = await prisma.goal.findMany({
    where: { user_id: userId }
  })

  const completedGoals = goals.filter(g => g.status === 'completed').length

  return {
    goalsCompletionRate: goals.length
      ? Math.round((completedGoals / goals.length) * 100)
      : 0,
    habitsTracked: habits.length,
    habitLogs: logs.length
  }
}
```

### Formule

```
Taux de complétion des objectifs = (Objectifs complétés / Total d'objectifs) × 100
```

### Exemple

**Total d'objectifs :** 10  
**Objectifs complétés :** 7

**Résultat :** 70%

---

## 📊 Statistiques par catégorie

### Algorithme de groupement

**Implémentation :** `backend/level-up/src/services/stats.service.js`

```javascript
const getGoalStatsByCategory = async (userId) => {
  const goals = await prisma.goal.groupBy({
    by: ['category', 'status'],
    where: { user_id: userId },
    _count: true
  })

  return goals
}
```

### Résultat

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
  },
  {
    "category": "Santé",
    "status": "active",
    "_count": 1
  }
]
```

---

## 🎮 Système de progression (XP et Levels)

### État actuel

Le système de gamification (XP et levels) est **prévu mais pas encore implémenté**. Les champs `xp_points` et `level` existent dans le modèle `User`, mais les algorithmes de calcul ne sont pas encore développés.

### Proposition d'implémentation

#### Attribution d'XP

```javascript
// Points d'XP par action
const XP_VALUES = {
  HABIT_COMPLETED: 10,        // Compléter une habitude
  GOAL_COMPLETED: 100,         // Compléter un objectif
  STEP_COMPLETED: 25,          // Compléter une étape
  STREAK_MILESTONE_7: 50,      // Streak de 7 jours
  STREAK_MILESTONE_30: 200,    // Streak de 30 jours
  STREAK_MILESTONE_100: 500    // Streak de 100 jours
}
```

#### Calcul du niveau

```javascript
const calculateLevel = (xpPoints) => {
  // Formule : Level = floor(sqrt(XP / 100)) + 1
  // Exemple : 2500 XP = Level 6
  return Math.floor(Math.sqrt(xpPoints / 100)) + 1
}

const getXPForNextLevel = (currentLevel) => {
  // XP nécessaire pour le niveau suivant
  return Math.pow(currentLevel, 2) * 100
}

const getProgressToNextLevel = (currentXP, currentLevel) => {
  const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 100
  const xpForNextLevel = Math.pow(currentLevel, 2) * 100
  const xpNeeded = xpForNextLevel - xpForCurrentLevel
  const xpProgress = currentXP - xpForCurrentLevel
  
  return {
    progress: (xpProgress / xpNeeded) * 100,
    xpNeeded: xpNeeded - xpProgress
  }
}
```

#### Exemple de progression

| Level | XP Minimum | XP Maximum |
|-------|------------|------------|
| 1 | 0 | 99 |
| 2 | 100 | 399 |
| 3 | 400 | 899 |
| 4 | 900 | 1599 |
| 5 | 1600 | 2499 |
| 10 | 8100 | 9999 |

---

## 🔄 Mise à jour automatique

### Événements déclencheurs (à implémenter)

1. **Complétion d'habitude** : +10 XP
2. **Complétion d'étape** : +25 XP
3. **Complétion d'objectif** : +100 XP
4. **Streak de 7 jours** : +50 XP (bonus unique)
5. **Streak de 30 jours** : +200 XP (bonus unique)
6. **Streak de 100 jours** : +500 XP (bonus unique)

### Hook Prisma (exemple)

```javascript
// Dans prisma.js ou un service dédié
prisma.$use(async (params, next) => {
  const result = await next(params)
  
  if (params.model === 'HabitLog' && params.action === 'create') {
    // Ajouter XP pour complétion d'habitude
    await addXP(params.args.data.habit.user_id, XP_VALUES.HABIT_COMPLETED)
  }
  
  if (params.model === 'Goal' && params.action === 'update') {
    if (params.args.data.status === 'completed') {
      // Ajouter XP pour complétion d'objectif
      await addXP(params.args.where.user_id, XP_VALUES.GOAL_COMPLETED)
    }
  }
  
  return result
})
```

---

## 📝 Notes importantes

1. **Normalisation des dates** : Tous les calculs de dates normalisent à minuit pour éviter les problèmes de fuseaux horaires
2. **Performance** : Les calculs de streaks et de taux de complétion sont effectués à la demande, pas en temps réel
3. **Caching** : Pour améliorer les performances, on pourrait implémenter un cache pour les statistiques fréquemment consultées
4. **Précision** : Les pourcentages sont arrondis à l'entier le plus proche avec `Math.round()`

---

## 🔮 Améliorations futures

1. **Calcul en temps réel** : Mise à jour automatique des XP et levels
2. **Badges et achievements** : Système de récompenses basé sur les accomplissements
3. **Graphiques de progression** : Visualisation de l'évolution des streaks et XP
4. **Comparaisons** : Classements et comparaisons entre utilisateurs (optionnel)
5. **Notifications** : Alertes pour maintenir les streaks
