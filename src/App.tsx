import React, { useState, useEffect } from "react";
import {
  ChefHat,
  Moon,
  Sun,
  X,
  Clock,
  Users,
  Utensils,
  BookmarkIcon,
} from "lucide-react";
import SearchBar from "./components/SearchBar";
import RecipeCard from "./components/RecipeCard";
import AuthModal from "./components/AuthModal";
import SavedRecipes from "./components/SavedRecipes";
import {
  searchRecipes,
  getRecipeDetails,
  getRandomRecipes,
} from "./services/api";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { signOut } from "./services/firebase";
import { Toaster, toast } from "react-hot-toast";

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  healthScore: number;
  pricePerServing: number;
  diets: string[];
  cuisines: string[];
  difficulty?: "easy" | "medium" | "hard";
  instructions?: string;
  analyzedInstructions?: Array<{
    steps: Array<{
      number: number;
      step: string;
      ingredients?: Array<{
        name: string;
      }>;
      equipment?: Array<{
        name: string;
      }>;
    }>;
  }>;
  extendedIngredients?: Array<{
    original: string;
    amount: number;
    unit: string;
    name: string;
  }>;
}

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSavedRecipes, setShowSavedRecipes] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const loadRandomRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const randomRecipes = await getRandomRecipes();
      if (randomRecipes.length === 0) {
        setError(
          "No recipes found. Please check your API key or try again later."
        );
      }
      setRecipes(
        randomRecipes.map((recipe: Recipe) => ({
          ...recipe,
          difficulty: calculateDifficulty(recipe.readyInMinutes),
        }))
      );
    } catch (err) {
      setError("Failed to load recipes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const calculateDifficulty = (time: number): "easy" | "medium" | "hard" => {
    if (time <= 20) return "easy";
    if (time <= 45) return "medium";
    return "hard";
  };

  const handleSearch = async (
    ingredients: string[],
    diet: string,
    cuisine: string,
    servings: number
  ) => {
    try {
      setLoading(true);
      setError(null);

      if (ingredients.length === 0 && !diet && !cuisine && !servings) {
        await loadRandomRecipes();
        return;
      }

      const query = ingredients.join(",");
      const results = await searchRecipes(query, diet, cuisine, servings);

      if (results.length === 0) {
        setError("No recipes found matching your criteria.");
      }

      setRecipes(
        results.map((recipe: Recipe) => ({
          ...recipe,
          difficulty: calculateDifficulty(recipe.readyInMinutes),
        }))
      );
    } catch (err) {
      setError("Failed to search recipes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeClick = async (id: number) => {
    const details = await getRecipeDetails(id);
    if (details) {
      details.difficulty = calculateDifficulty(details.readyInMinutes);
      setSelectedRecipe(details);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const groupRecipesByDifficulty = (recipes: Recipe[]) => {
    return recipes.reduce((acc, recipe) => {
      const difficulty =
        recipe.difficulty || calculateDifficulty(recipe.readyInMinutes);
      if (!acc[difficulty]) {
        acc[difficulty] = [];
      }
      acc[difficulty].push(recipe);
      return acc;
    }, {} as Record<string, Recipe[]>);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Toaster position="top-right" />

      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">
                Gourmet Guru
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>
              {user ? (
                <>
                  <button
                    onClick={() => setShowSavedRecipes(!showSavedRecipes)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <BookmarkIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 dark:text-gray-300">
                      {user.email}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <SearchBar onSearch={handleSearch} />

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {showSavedRecipes ? (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold dark:text-white">
                Saved Recipes
              </h2>
              <button
                onClick={() => setShowSavedRecipes(false)}
                className="text-blue-600 hover:underline"
              >
                Back to All Recipes
              </button>
            </div>
            <SavedRecipes onRecipeClick={handleRecipeClick} />
          </div>
        ) : loading ? (
          <div className="mt-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Loading recipes...
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-12">
            {Object.entries(groupRecipesByDifficulty(recipes)).map(
              ([difficulty, recipes]) => (
                <div key={difficulty}>
                  <h2 className="text-2xl font-bold mb-4 dark:text-white capitalize">
                    {difficulty} Recipes
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {recipes.map((recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        {...recipe}
                        healthScore={recipe.healthScore}
                        onClick={() => handleRecipeClick(recipe.id)}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {selectedRecipe && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-2xl font-bold dark:text-white">
                  {selectedRecipe.title}
                </h2>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="p-6">
                <img
                  src={selectedRecipe.image}
                  alt={selectedRecipe.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />

                <div className="flex flex-wrap gap-3 justify-around mb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Time
                    </p>
                    <p className="font-semibold dark:text-white">
                      {selectedRecipe.readyInMinutes} min
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Servings
                    </p>
                    <p className="font-semibold dark:text-white">
                      {selectedRecipe.servings}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-center">
                    <Utensils className="h-5 w-5 text-blue-500" />

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Difficulty
                    </p>
                    <p className="  font-semibold dark:text-white capitalize ">
                      {selectedRecipe.difficulty}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 dark:text-white">
                    Ingredients
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedRecipe.extendedIngredients?.map(
                      (ingredient, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 dark:text-gray-300"
                        >
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          {ingredient.original}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 dark:text-white">
                    Instructions
                  </h3>
                  {selectedRecipe.analyzedInstructions?.[0]?.steps.map(
                    (step) => (
                      <div key={step.number} className="mb-4">
                        <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">
                          Step {step.number}
                        </p>
                        <p className="dark:text-gray-300">{step.step}</p>
                        {(step.equipment?.length > 0 ||
                          step.ingredients?.length > 0) && (
                          <div className="mt-2 text-sm">
                            {step.equipment?.length > 0 && (
                              <p className="text-gray-600 dark:text-gray-400">
                                Equipment:{" "}
                                {step.equipment.map((e) => e.name).join(", ")}
                              </p>
                            )}
                            {step.ingredients?.length > 0 && (
                              <p className="text-gray-600 dark:text-gray-400">
                                Ingredients used:{" "}
                                {step.ingredients.map((i) => i.name).join(", ")}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}

export default App;
