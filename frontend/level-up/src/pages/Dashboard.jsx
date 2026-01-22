import React, { useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Trophy, Target, Flame, TrendingUp, Star } from 'lucide-react';
import { ProgressChart } from '../components/ProgressChart';

export default function Dashboard() {
  // Utilisation de notre hook personnalisé
  const [goals] = useLocalStorage('goals', []);
  const [habits] = useLocalStorage('habits', []);
  const [stats, setStats] = useLocalStorage('userStats', {
    totalPoints: 0,
    level: 1,
    badges: [],
  });

  // Calculs des données
  const activeGoals = goals.filter(g => !g.completedAt);
  const completedGoals = goals.filter(g => g.completedAt);
  
  const totalSteps = goals.reduce((acc, goal) => acc + (goal.steps ? goal.steps.length : 0), 0);
  const completedSteps = goals.reduce(
    (acc, goal) => acc + (goal.steps ? goal.steps.filter(s => s.completed).length : 0),
    0
  );

  const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);

  useEffect(() => {
    // Système de points (Gamification)
    let points = 0;
    points += completedGoals.length * 100;
    points += completedSteps * 10;
    points += habits.reduce((acc, h) => acc + (h.streak || 0) * 5, 0);

    const level = Math.floor(points / 500) + 1;

    setStats(prev => ({
      ...prev,
      totalPoints: points,
      level: level,
    }));
  }, [goals, habits, completedGoals.length, completedSteps, setStats]);

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Bonjour ! 👋</h2>
            <p className="text-indigo-100 text-lg">
              Continuez votre progression vers vos objectifs
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5" />
              <span className="text-sm font-medium">Niveau</span>
            </div>
            <div className="text-3xl font-bold">{stats.level}</div>
          </div>
        </div>
        
        {/* Barre d'XP */}
        <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-lg p-1">
          <div
            className="bg-white rounded-md h-3 transition-all duration-500"
            style={{ width: `${((stats.totalPoints % 500) / 500) * 100}%` }}
          />
        </div>
        <p className="text-sm text-indigo-100 mt-2">
          {stats.totalPoints % 500} / 500 points jusqu'au niveau {stats.level + 1}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Carte Objectifs */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{activeGoals.length}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Objectifs actifs</h3>
        </div>

        {/* Carte Progression */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0}%
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Progression globale</h3>
        </div>

        {/* Carte Streak */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{maxStreak}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Meilleure série</h3>
        </div>

        {/* Carte Points */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.totalPoints}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Points totaux</h3>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progression des 7 derniers jours</h3>
        <ProgressChart habits={habits} />
      </div>

      {/* Message vide si pas de données */}
      {activeGoals.length === 0 && habits.length === 0 && (
        <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">Vous n'avez pas encore d'objectifs ou d'habitudes. Commencez par en créer !</p>
        </div>
      )}
    </div>
  );
}