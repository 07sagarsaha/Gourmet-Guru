import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useSavedRecipes } from '../hooks/useSavedRecipes';
import RecipeCard from './RecipeCard';

interface SavedRecipesProps {
  onRecipeClick: (id: number) => void;
}

const SavedRecipes: React.FC<SavedRecipesProps> = ({ onRecipeClick }) => {
  const { user } = useAuth();
  const { savedRecipes, loading } = useSavedRecipes(user?.uid);

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">
          Please log in to view your saved recipes
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Loading saved recipes...</p>
      </div>
    );
  }

  if (savedRecipes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">
          You haven't saved any recipes yet
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {savedRecipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          {...recipe}
          onClick={() => onRecipeClick(recipe.id)}
        />
      ))}
    </div>
  );
};

export default SavedRecipes;