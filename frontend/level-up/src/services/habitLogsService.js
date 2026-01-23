const API_BASE = process.env.REACT_APP_API_BASE;

const parseError = async (response, fallback) => {
  try {
    const data = await response.json();
    return data.message || fallback;
  } catch {
    return response.statusText || fallback;
  }
};

export const getHabitLogsAPI = async (
  token,
  habitId,
  { start_date, end_date } = {}
) => {
  const params = new URLSearchParams();
  if (start_date) params.set('start_date', start_date);
  if (end_date) params.set('end_date', end_date);

  const response = await fetch(
    `${API_BASE}/habitsLog/${habitId}/logs${
      params.toString() ? `?${params.toString()}` : ''
    }`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!response.ok) {
    throw new Error(await parseError(response, 'Erreur lors du chargement des logs'));
  }

  const data = await response.json();

  // Normalisation: même shape que l’UI attend (date YYYY-MM-DD + completed bool)
  return data.map((log) => ({
    date: new Date(log.date).toISOString().split('T')[0],
    completed: !!log.is_completed,
    notes: log.notes || '',
  }));
};

export const logHabitTodayAPI = async (token, habitId, { notes } = {}) => {
  const response = await fetch(`${API_BASE}/habitsLog/${habitId}/log`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ notes }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Erreur lors de l'ajout du log"));
  }

  return await response.json();
};

export const deleteHabitLogAPI = async (token, habitId, dateYYYYMMDD) => {
  const response = await fetch(
    `${API_BASE}/habitsLog/${habitId}/log/${dateYYYYMMDD}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    throw new Error(await parseError(response, 'Erreur lors de la suppression du log'));
  }

  // 204 => pas de body JSON
  return true;
};


