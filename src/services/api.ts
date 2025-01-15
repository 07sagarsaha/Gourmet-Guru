import axios, { AxiosError } from 'axios';


const API_KEYS = [
  import.meta.env.VITE_SPOONACULAR_API_KEY_1,
  import.meta.env.VITE_SPOONACULAR_API_KEY_2,
];
const BASE_URL = 'https://api.spoonacular.com/recipes';

let currentApiKeyIndex = 0;

const getApiKey = () => {
  const apiKey = API_KEYS[currentApiKeyIndex];
  currentApiKeyIndex = (currentApiKeyIndex + 1) % API_KEYS.length;
  return apiKey;
};
const handleApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    if (error.response?.status === 401) {
      console.error('API Key is invalid or expired. Please check your Spoonacular API key.');
    } else if (error.response?.status === 402) {
      console.error('API quota exceeded. Please check your Spoonacular API usage.');
    } else {
      console.error('API Error:', error.response?.data?.message || error.message);
    }
  } else if (error instanceof Error) {
    console.error('Error:', error.message);
  }
  return null;
};

export const searchRecipesByIngredients = async (ingredients: string[]) => {
  try {
    const response = await axios.get(`${BASE_URL}/findByIngredients`, {
      params: {
        apiKey: getApiKey(),
        ingredients: ingredients.join(','),
        number: 12,
        ranking: 2,
        ignorePantry: true,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

export const getRecipeDetails = async (id: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}/information`, {
      params: {
        apiKey: getApiKey(),
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

export const searchRecipes = async (query: string, diet?: string, cuisine?: string, servings?: number) => {
  try {
    const params: any = {
      apiKey: getApiKey(),
      query,
      diet,
      cuisine,
      addRecipeInformation: true,
      addRecipeNutrition: true,
      number: 12,
    };

    if (servings > 0) {
      params.maxServings = servings;
      params.minServings = servings;
    }

    const response = await axios.get(`${BASE_URL}/complexSearch`, { params });
    return response.data.results;
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

export const getRandomRecipes = async (tags: string[] = [], servings?: number) => {
  try {
    const params: any = {
      apiKey: getApiKey(),
      number: 12,
      tags: tags.join(','),
      addRecipeInformation: true,
      addRecipeNutrition: true,
    };

    if (servings > 0) {
      params.maxServings = servings;
      params.minServings = servings;
    }

    const response = await axios.get(`${BASE_URL}/random`, { params });
    return response.data.recipes || [];
  } catch (error) {
    handleApiError(error);
    return [];
  }
};