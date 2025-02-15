# Gourmet Guru 🍳

A modern, feature-rich recipe discovery application built with React, TypeScript, and Tailwind CSS. This application helps users find, save, and manage recipes with an intuitive interface and powerful search capabilities.

![Gourmet Guru](https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1000)

## Features ✨

- **Advanced Recipe Search**

  - Search by ingredients
  - Filter by diet preferences (vegetarian, vegan, gluten-free, etc.)
  - Filter by cuisine type (Italian, Mexican, Indian, etc.)
  - Filter by serving size

- **Recipe Details**

  - Comprehensive recipe information
  - Step-by-step cooking instructions
  - Required ingredients with measurements
  - Cooking time and difficulty level
  - Price per serving
  - Health score
  - Diet type and cuisine information

- **User Features**

  - User authentication (signup/login)
  - Save favorite recipes
  - View saved recipes collection
  - Dark mode support

- **Recipe Categories**
  - Organized by difficulty (Easy, Medium, Hard)
  - Diet-based categorization
  - Cuisine-based organization

## Technology Stack 🛠️

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **API**: Spoonacular API
- **Icons**: Lucide React
- **State Management**: React Context
- **Build Tool**: Vite
- **Toast Notifications**: React Hot Toast

## Getting Started 🚀

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd recipe-finder
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   VITE_SPOONACULAR_API_KEY=your_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## Environment Variables 🔑

- `VITE_SPOONACULAR_API_KEY`: Your Spoonacular API key

## Project Structure 📁

```
src/
├── components/          # React components
│   ├── AuthModal.tsx   # Authentication modal
│   ├── RecipeCard.tsx  # Recipe card component
│   ├── SearchBar.tsx   # Search functionality
│   └── SavedRecipes.tsx# Saved recipes component
├── context/            # React context
│   └── AuthContext.tsx # Authentication context
├── services/           # External services
│   ├── api.ts         # Spoonacular API integration
│   └── firebase.ts    # Firebase configuration
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── App.tsx           # Main application component
└── main.tsx         # Application entry point
```

## Features in Detail 📝

### Recipe Search

- Real-time search suggestions
- Multiple filter combinations
- Advanced search parameters

### Recipe Display

- Grid layout for recipe cards
- Detailed recipe modal
- Comprehensive recipe information

### User Authentication

- Email/password authentication
- Protected routes for saved recipes
- User profile management

### Responsive Design

- Mobile-first approach
- Dark mode support
- Adaptive layout

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments 🙏

- [Spoonacular API](https://spoonacular.com/food-api) for recipe data
- [Firebase](https://firebase.google.com/) for authentication and database
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide React](https://lucide.dev/) for icons
