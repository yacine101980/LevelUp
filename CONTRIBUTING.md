# 🤝 Guide de contribution - LevelUp

Merci de votre intérêt pour contribuer à LevelUp ! Ce document fournit les directives et les bonnes pratiques pour contribuer au projet.

## 📋 Table des matières

- [Code de conduite](#code-de-conduite)
- [Comment contribuer](#comment-contribuer)
- [Processus de développement](#processus-de-développement)
- [Standards de code](#standards-de-code)
- [Tests](#tests)
- [Commit messages](#commit-messages)
- [Pull Requests](#pull-requests)

## 📜 Code de conduite

### Nos standards

- Soyez respectueux et inclusif
- Acceptez les critiques constructives avec grâce
- Concentrez-vous sur ce qui est meilleur pour la communauté
- Montrez de l'empathie envers les autres membres de la communauté

## 🚀 Comment contribuer

### Signaler un bug

1. Vérifiez que le bug n'a pas déjà été signalé dans les [Issues](https://github.com/USERNAME/LevelUp/issues)
2. Si le bug n'existe pas, créez une nouvelle issue avec :
   - Un titre clair et descriptif
   - Une description détaillée du problème
   - Les étapes pour reproduire le bug
   - Le comportement attendu vs le comportement actuel
   - Des captures d'écran si applicable
   - Informations sur l'environnement (OS, navigateur, version Node.js, etc.)

### Proposer une fonctionnalité

1. Vérifiez que la fonctionnalité n'a pas déjà été proposée
2. Créez une issue avec le label `enhancement`
3. Décrivez clairement :
   - Le problème que la fonctionnalité résout
   - La solution proposée
   - Les alternatives considérées
   - L'impact sur l'application existante

### Contribuer au code

1. **Fork** le repository
2. **Clone** votre fork localement
   ```bash
   git clone https://github.com/VOTRE-USERNAME/LevelUp.git
   cd LevelUp
   ```
3. **Créez une branche** pour votre fonctionnalité/correction
   ```bash
   git checkout -b feature/ma-nouvelle-fonctionnalite
   # ou
   git checkout -b fix/correction-bug
   ```
4. **Faites vos modifications**
5. **Testez** vos changements
6. **Commitez** vos modifications (voir [Commit messages](#commit-messages))
7. **Pushez** vers votre fork
   ```bash
   git push origin feature/ma-nouvelle-fonctionnalite
   ```
8. **Ouvrez une Pull Request** sur le repository principal

## 🔄 Processus de développement

### Structure des branches

- `main` : Branche principale, code stable et déployé
- `develop` : Branche de développement
- `feature/*` : Nouvelles fonctionnalités
- `fix/*` : Corrections de bugs
- `docs/*` : Modifications de documentation
- `refactor/*` : Refactorisation de code

### Workflow Git

1. **Synchroniser avec upstream**
   ```bash
   git fetch upstream
   git checkout develop
   git merge upstream/develop
   ```

2. **Créer votre branche**
   ```bash
   git checkout -b feature/ma-fonctionnalite develop
   ```

3. **Développer et tester**
   - Faire des commits réguliers
   - Tester localement
   - S'assurer que les tests passent

4. **Pousser et créer une PR**
   ```bash
   git push origin feature/ma-fonctionnalite
   ```

## 📝 Standards de code

### Backend (Node.js/Express)

#### Style de code

- Utiliser des **noms de variables descriptifs**
- Préférer `const` et `let` à `var`
- Utiliser des **fonctions async/await** plutôt que les callbacks
- Gérer les erreurs avec `try/catch`
- Commenter le code complexe

#### Structure des fichiers

```
src/
├── controllers/    # Gestion des requêtes HTTP
├── services/      # Logique métier
├── routes/        # Définition des routes
├── middleware/    # Middlewares Express
└── utils/         # Fonctions utilitaires
```

#### Exemple de code

```javascript
// ✅ Bon
const getUserGoals = async (userId) => {
  try {
    const goals = await prisma.goal.findMany({
      where: { user_id: userId },
      include: { steps: true }
    })
    return goals
  } catch (error) {
    console.error('Error fetching goals:', error)
    throw new Error('Failed to fetch goals')
  }
}

// ❌ Mauvais
const getGoals = async (id) => {
  return prisma.goal.findMany({ where: { user_id: id } })
}
```

### Frontend (React)

#### Style de code

- Utiliser des **composants fonctionnels** avec hooks
- Nommer les composants en **PascalCase**
- Utiliser **Tailwind CSS** pour le styling
- Extraire la logique réutilisable dans des **hooks personnalisés**

#### Structure des composants

```jsx
// ✅ Bon
const GoalCard = ({ goal, onComplete }) => {
  const handleComplete = () => {
    onComplete(goal.id)
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-xl font-bold">{goal.title}</h3>
      <button onClick={handleComplete}>Compléter</button>
    </div>
  )
}

// ❌ Mauvais
const Goal = ({ g, f }) => {
  return <div><h3>{g.title}</h3><button onClick={f}>OK</button></div>
}
```

### Base de données

#### Migrations Prisma

- Créer une migration pour chaque changement de schéma
- Nommer les migrations de manière descriptive
- Tester les migrations sur une base de données de test

```bash
npx prisma migrate dev --name add_user_avatar_field
```

#### Requêtes

- Utiliser Prisma pour toutes les requêtes
- Éviter les requêtes SQL brutes sauf nécessité absolue
- Utiliser `include` pour les relations plutôt que plusieurs requêtes

## 🧪 Tests

### Backend

- Écrire des tests pour les services et contrôleurs
- Utiliser un framework de test (Jest, Mocha, etc.)
- Maintenir une couverture de code > 80%

```javascript
// Exemple de test
describe('Goal Service', () => {
  it('should create a goal', async () => {
    const goal = await createGoal(userId, {
      title: 'Test Goal',
      priority: 'high'
    })
    expect(goal.title).toBe('Test Goal')
  })
})
```

### Frontend

- Tester les composants avec React Testing Library
- Tester les interactions utilisateur
- Tester les appels API avec des mocks

```javascript
// Exemple de test
describe('GoalCard', () => {
  it('renders goal title', () => {
    render(<GoalCard goal={{ title: 'Test' }} />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

## 💬 Commit messages

### Format

Utiliser le format conventionnel :

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `docs` : Documentation
- `style` : Formatage, point-virgules manquants, etc.
- `refactor` : Refactorisation
- `test` : Ajout de tests
- `chore` : Maintenance, dépendances, etc.

### Exemples

```bash
feat(goals): add goal completion with XP reward

Implement XP system when a goal is completed.
User receives 100 XP points upon goal completion.

Closes #123
```

```bash
fix(auth): resolve JWT token expiration issue

Fix token expiration not being checked properly.
Tokens now expire correctly after 7 days.

Fixes #456
```

## 🔍 Pull Requests

### Avant de soumettre

- [ ] Le code suit les standards du projet
- [ ] Les tests passent localement
- [ ] La documentation est à jour
- [ ] Les commits suivent le format conventionnel
- [ ] Le code a été testé manuellement

### Template de PR

```markdown
## Description
Brève description des changements

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Comment tester
Instructions pour tester les changements

## Checklist
- [ ] Code testé
- [ ] Documentation mise à jour
- [ ] Pas de warnings
- [ ] Tests passent
```

### Processus de review

1. Au moins un mainteneur doit approuver la PR
2. Les tests CI doivent passer
3. Les conflits doivent être résolus
4. La PR sera mergée dans `develop` puis dans `main`

## 📚 Ressources

- [Documentation API](./docs/API.md)
- [Schéma de base de données](./docs/DATABASE.md)
- [Algorithmes](./docs/ALGORITHMS.md)
- [Architecture](./docs/ARCHITECTURE.md)

## ❓ Questions ?

Si vous avez des questions, n'hésitez pas à :
- Ouvrir une issue avec le label `question`
- Contacter les mainteneurs

Merci de contribuer à LevelUp ! 🎉
