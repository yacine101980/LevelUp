import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trophy, Target, Flame, TrendingUp, Star, BarChart3 } from 'lucide-react';
import { CategoryChart } from '../components/CategoryChart';
import { getDashboardAPI } from '../services/dashboardService';
import { getGlobalStatsAPI, getGoalStatsAPI, getHabitStatsAPI } from '../services/statsService';
import { getHabitsAPI } from '../services/habitsService';

export default function Dashboard() {
  const { user,  } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [globalStats, setGlobalStats] = useState(null);
  const [goalStats, setGoalStats] = useState([]);
  const [habitStats, setHabitStats] = useState([]);
  const [, setHabits] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Pas de token trouvé');
        setLoading(false);
        return;
      }
      
      // Charger toutes les données en parallèle
      const [dashboard, stats, goalsStats, habitsStats, habitsData] = await Promise.all([
        getDashboardAPI(token),
        getGlobalStatsAPI(token),
        getGoalStatsAPI(token),
        getHabitStatsAPI(token),
        getHabitsAPI(token),
      ]);


      setDashboardData(dashboard);
      setGlobalStats(stats);
      setGoalStats(goalsStats);
      setHabitStats(habitsStats);
      setHabits(habitsData);
      setError(null);
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
      console.error('Détails de l\'erreur:', error.message);
      setError(error.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculs pour l'affichage
  const userLevel = user?.level || 1;
  const userXp = user?.xp_points || 0;
  // const xpForNextLevel = userLevel * 500;
  const xpProgress = userXp % 100;
  const xpPercentage = (xpProgress / 100) * 100;

  // const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);

  if (error) {
    return (
      <div className="space-y-6 p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Erreur de chargement</h3>
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Bonjour {user?.name || ''} ! 👋</h2>
            <p className="text-indigo-100 text-lg">
              Continuez votre progression vers vos objectifs
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5" />
              <span className="text-sm font-medium">Niveau</span>
            </div>
            <div className="text-3xl font-bold">{userLevel}</div>
          </div>
        </div>
        
        {/* Barre d'XP */}
        <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-lg p-1">
          <div
            className="bg-white rounded-md h-3 transition-all duration-500"
            style={{ width: `${xpPercentage}%` }}
          />
        </div>
        <p className="text-sm text-indigo-100 mt-2">
          {100-userXp} points Jusqu'au niveau {userLevel + 1}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Carte Objectifs actifs */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {dashboardData?.goals?.active ?? '...'}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Objectifs actifs</h3>
          {dashboardData && (
            <p className="text-xs text-gray-400 mt-1">
              Total: {dashboardData.goals?.total || 0} | Complétés: {dashboardData.goals?.completed || 0}
            </p>
          )}
        </div>

        {/* Carte Taux de complétion */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {globalStats?.goalsCompletionRate || 0}%
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Taux de complétion</h3>
        </div>

        {/* Carte Habitudes suivies */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Flame className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {dashboardData?.habits?.active ?? '...'}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Habitudes suivies</h3>
          {dashboardData && (
            <p className="text-xs text-gray-400 mt-1">
            </p>
          )}
        </div>

        {/* Carte Points XP */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{userXp}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Points XP</h3>
        </div>
      </div>

      {/* Stats détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stats des objectifs par catégorie */}
        {goalStats && goalStats.length > 0 && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Objectifs par catégorie</h3>
            <CategoryChart goalStats={goalStats} />
          </div>
        )}

        {/* Stats des habitudes */}
        {habitStats && habitStats.length > 0 && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Statistiques des habitudes</h3>
            </div>
            <div className="space-y-3">
              {habitStats.map((stat) => (
                <div key={stat.habitId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-700">{stat.name}</span>
                    <span className="text-xs text-gray-500 ml-2 capitalize">
                      ({stat.frequency})
                    </span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">{stat.totalLogs}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Message vide si pas de données */}
      {dashboardData && dashboardData.goals?.total === 0 && dashboardData.habits?.active === 0 && (
        <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">
            Vous n'avez pas encore d'objectifs ou d'habitudes. Commencez par en créer !
          </p>
        </div>
      )}

    </div>
  );
}