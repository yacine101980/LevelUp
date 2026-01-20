import { useState, useCallback } from "react";

export function useLocalStorage(key, initialValue) {
  // 1. Initialiser l'état
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // 2. Mettre à jour (Version optimisée avec useCallback)
  const setValue = useCallback((value) => {
    try {
      // On utilise la forme fonctionnelle de setStoredValue
      // Cela nous permet d'accéder à la "oldValue" sans l'ajouter aux dépendances
      setStoredValue((oldValue) => {
        const valueToStore = value instanceof Function ? value(oldValue) : value;
        
        // On sauvegarde dans le localStorage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        
        // On retourne la nouvelle valeur pour mettre à jour l'état React
        return valueToStore;
      });
    } catch (error) {
      console.error(error);
    }
  }, [key]); // La fonction ne sera recréée que si la "key" change

  return [storedValue, setValue];
}