import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { debounce } from '../utils/helpers';

interface SearchBarProps {
  onSearch: (ingredients: string[], diet: string, cuisine: string, servings: number) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [diet, setDiet] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [servings, setServings] = useState<number>(0);

  const diets = ['', 'vegetarian', 'vegan', 'gluten free', 'ketogenic', 'paleo'];
  const cuisines = ['', 'italian', 'mexican', 'indian', 'chinese', 'japanese', 'thai', 'mediterranean'];
  const servingsOptions = [0, 2, 4, 6, 8, 10];

  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=${import.meta.env.VITE_SPOONACULAR_API_KEY}&query=${query}&number=5`
      );
      const data = await response.json();
      setSuggestions(data.map((item: { name: string }) => item.name));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  useEffect(() => {
    onSearch(ingredients, diet, cuisine, servings);
  }, [ingredients, diet, cuisine, servings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedFetchSuggestions(value);
  };

  const addIngredient = (ingredient: string) => {
    if (ingredient && !ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
      setInputValue('');
      setSuggestions([]);
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="flex flex-wrap gap-2 mb-2">
        {ingredients.map((ingredient) => (
          <span
            key={ingredient}
            className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-full flex items-center gap-1"
          >
            {ingredient}
            <X
              className="w-4 h-4 cursor-pointer"
              onClick={() => removeIngredient(ingredient)}
            />
          </span>
        ))}
      </div>
      
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 relative min-w-[200px]">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addIngredient(inputValue);
              }
            }}
            placeholder="Type ingredients..."
            className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" />
          
          {suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-lg shadow-lg">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => addIngredient(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        <select
          value={diet}
          onChange={(e) => setDiet(e.target.value)}
          className="px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Any Diet</option>
          {diets.map((d) => (
            <option key={d} value={d}>
              {d ? d.charAt(0).toUpperCase() + d.slice(1) : 'Any Diet'}
            </option>
          ))}
        </select>

        <select
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          className="px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Any Cuisine</option>
          {cuisines.map((c) => (
            <option key={c} value={c}>
              {c ? c.charAt(0).toUpperCase() + c.slice(1) : 'Any Cuisine'}
            </option>
          ))}
        </select>

        <select
          value={servings}
          onChange={(e) => setServings(Number(e.target.value))}
          className="px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="0">Any Servings</option>
          {servingsOptions.slice(1).map((s) => (
            <option key={s} value={s}>
              {s} Servings
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchBar;