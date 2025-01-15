import { initializeApp } from '@firebase/app'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc, getDoc, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export const signIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUp = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signOut = () => {
  return auth.signOut();
};

interface SavedRecipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  healthScore: number;
  difficulty: 'easy' | 'medium' | 'hard';
  diets: string[];
}

export const saveRecipe = async (userId: string, recipeId: number, recipeData: SavedRecipe) => {
  try {
    const recipeRef = doc(db, 'users', userId, 'savedRecipes', recipeId.toString());
    await setDoc(recipeRef, {
      ...recipeData,
      savedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error saving recipe:', error);
    return false;
  }
};

export const unsaveRecipe = async (userId: string, recipeId: number) => {
  try {
    const recipeRef = doc(db, 'users', userId, 'savedRecipes', recipeId.toString());
    await deleteDoc(recipeRef);
    return true;
  } catch (error) {
    console.error('Error removing recipe:', error);
    return false;
  }
};

export const isSavedRecipe = async (userId: string, recipeId: number) => {
  try {
    const recipeRef = doc(db, 'users', userId, 'savedRecipes', recipeId.toString());
    const docSnap = await getDoc(recipeRef);
    return docSnap.exists();
  } catch (error) {
    console.error('Error checking saved recipe:', error);
    return false;
  }
};

export const getSavedRecipes = async (userId: string) => {
  try {
    const recipesRef = collection(db, 'users', userId, 'savedRecipes');
    const snapshot = await getDocs(recipesRef);
    return snapshot.docs.map(doc => ({
      id: parseInt(doc.id),
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting saved recipes:', error);
    return [];
  }
};