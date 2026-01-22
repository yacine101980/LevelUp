const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5001/api';

const parseError = async (response, fallback) => {
  try {
    const data = await response.json();
    return data.message || fallback;
  } catch {
    return response.statusText || fallback;
  }
};

export const getGlobalStatsAPI = async (token) => {
  const response = await fetch(`${API_BASE}/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(await parseError(response, 'Erreur lors du chargement des statistiques'));
  }
  return await response.json();
};

export const getGoalStatsAPI = async (token) => {
  const response = await fetch(`${API_BASE}/stats/goals`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(await parseError(response, 'Erreur lors du chargement des statistiques des objectifs'));
  }
  return await response.json();
};

export const getHabitStatsAPI = async (token) => {
  const response = await fetch(`${API_BASE}/stats/habits`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(await parseError(response, 'Erreur lors du chargement des statistiques des habitudes'));
  }
  return await response.json();
};

