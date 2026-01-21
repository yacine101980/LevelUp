const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5001/api';

export const getGoalsAPI = async (token, filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const response = await fetch(`${API_BASE}/goals?${query}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    let errorMessage = 'Erreur lors de la récupération des objectifs';
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  const data = await response.json();
  return data.map(goal => ({
    ...goal,
    steps: goal.steps ? goal.steps.map(step => ({
      ...step,
      completed: step.is_completed || step.completed || false,
      is_completed: undefined
    })) : []
  }));
};

export const createGoalAPI = async (token, data) => {
  const response = await fetch(`${API_BASE}/goals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    let errorMessage = 'Erreur lors de la création de l\'objectif';
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  return await response.json();
};

export const getGoalAPI = async (token, id) => {
  const response = await fetch(`${API_BASE}/goals/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    let errorMessage = 'Erreur lors de la récupération de l\'objectif';
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  return await response.json();
};

export const updateGoalAPI = async (token, id, data) => {
  const response = await fetch(`${API_BASE}/goals/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    let errorMessage = 'Erreur lors de la mise à jour de l\'objectif';
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  return await response.json();
};

export const completeGoalAPI = async (token, id) => {
  const response = await fetch(`${API_BASE}/goals/${id}/complete`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    let errorMessage = 'Erreur lors de la completion de l\'objectif';
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  return await response.json();
};

export const deleteGoalAPI = async (token, id) => {
  const response = await fetch(`${API_BASE}/goals/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    let errorMessage = 'Erreur lors de la suppression de l\'objectif';
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  return {sucess: true};
};

// Fonctions pour gérer les steps individuellement
export const createStepAPI = async (token, goalId, data) => {
  const response = await fetch(`${API_BASE}/steps/${goalId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    let errorMessage = 'Erreur lors de la création de l\'étape';
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  return await response.json();
};

export const updateStepAPI = async (token, stepId, data) => {
  const response = await fetch(`${API_BASE}/steps/${stepId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    let errorMessage = 'Erreur lors de la mise à jour de l\'étape';
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  return await response.json();
};

export const completeStepAPI = async (token, stepId) => {
  const response = await fetch(`${API_BASE}/steps/${stepId}/complete`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    let errorMessage = 'Erreur lors de la completion de l\'étape';
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  return await response.json();
};

export const deleteStepAPI = async (token, stepId) => {
  const response = await fetch(`${API_BASE}/steps/${stepId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    let errorMessage = 'Erreur lors de la suppression de l\'étape';
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  return await response.json();
};