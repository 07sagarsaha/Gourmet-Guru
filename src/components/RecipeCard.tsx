import React from "react";
import {
  Clock,
  Users,
  BookmarkPlus,
  Bookmark,
  Heart,
  DollarSign,
  UtensilsCrossed,
  Globe,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { saveRecipe, unsaveRecipe, isSavedRecipe } from "../services/firebase";
import { toast } from "react-hot-toast";

interface RecipeCardProps {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  healthScore: number;
  difficulty: "easy" | "medium" | "hard";
  pricePerServing: number;
  diets: string[];
  cuisines: string[];
  onClick: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  title,
  image,
  readyInMinutes,
  servings,
  healthScore,
  difficulty,
  pricePerServing,
  diets,
  cuisines,
  onClick,
}) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      isSavedRecipe(user.uid, id).then(setIsSaved);
    }
  }, [user, id]);

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please log in to save recipes");
      return;
    }

    try {
      if (isSaved) {
        await unsaveRecipe(user.uid, id);
        toast.success("Recipe removed from saved recipes");
      } else {
        await saveRecipe(user.uid, id, {
          id,
          title,
          image,
          readyInMinutes,
          servings,
          healthScore,
          difficulty,
          diets,
        });
        toast.success("Recipe saved successfully");
      }
      setIsSaved(!isSaved);
    } catch (error) {
      toast.error("Failed to save recipe");
    }
  };

  const getDietType = () => {
    if (diets == null) return "unknown";
    if (diets.includes("vegan")) return "Vegan";
    if (diets.includes("vegetarian")) return "Vegetarian";

    return "Non-Veg";
  };

  const difficultyColor = {
    easy: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
    hard: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
  }[difficulty];

  const dietColor = {
    Vegan:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100",
    Vegetarian: "bg-lime-100 text-lime-800 dark:bg-lime-800 dark:text-lime-100",
    "Non-Veg":
      "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100",
    unknown: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
  }[getDietType()];

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
      onClick={onClick}
    >
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold line-clamp-2 dark:text-white min-h-14 ">
            {title}
          </h3>
          <button
            onClick={handleSave}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            {isSaved ? (
              <Bookmark className="w-5 h-5 text-blue-500" />
            ) : (
              <BookmarkPlus className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between text-gray-600 dark:text-gray-300 mb-2 pr-2">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{readyInMinutes}min</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{servings}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2  justify-between">
          <div className=" flex items-center">
            <Heart className="w-4 h-4 mr-1 text-red-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Health Score: {Math.round(healthScore)}
            </span>
          </div>
          <div className="my-2 flex gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs ${difficultyColor}`}
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs ${dietColor}`}>
              {getDietType()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
