import { useState, useEffect } from 'react';
import { getSavedRecipes } from '../services/firebase';

export const useSavedRecipes = (userId: string | undefined) => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSavedRecipes = async () => {
      if (!userId) {
        setSavedRecipes([]);
        setLoading(false);
        return;
      }

      try {
        const recipes = await getSavedRecipes(userId);
        setSavedRecipes(recipes);
      } catch (error) {
        console.error('Error loading saved recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSavedRecipes();
  }, [userId]);

  return { savedRecipes, loading };
};