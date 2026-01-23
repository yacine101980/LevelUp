const API_BASE = process.env.REACT_APP_API_BASE;

const parseError = async (response, fallback) => {
  try {
    const data = await response.json();
    return data.message || fallback;
  } catch {
    return response.statusText || fallback;
  }
};

export const getDashboardAPI = async (token) => {
  const response = await fetch(`${API_BASE}/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(await parseError(response, 'Erreur lors du chargement du dashboard'));
  }
  return await response.json();
};

