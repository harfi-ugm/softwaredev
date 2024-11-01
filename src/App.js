import React, { useState, useEffect, useReducer, useContext, useCallback } from 'react';

// Context for theme and favorites management
const ThemeContext = React.createContext();
const FavoritesContext = React.createContext();

// Reducer for managing favorites
const favoritesReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_FAVORITE':
      return [...state, action.recipe];
    case 'REMOVE_FAVORITE':
      return state.filter(recipe => recipe.id !== action.id);
    default:
      return state;
  }
};

const App = () => {
  const [theme, setTheme] = useState('light');
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [favorites, dispatch] = useReducer(favoritesReducer, []);

  // API key for Spoonacular
  const API_KEY = '22aec26d7b0d4b81921e0a9ab5fedec3';

  // Toggle theme
  const toggleTheme = () => setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));

  // Fetch recipes from Spoonacular API
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?query=${searchTerm}&apiKey=${API_KEY}`
        );
        const data = await response.json();
        setRecipes(data.results || []);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    // Only fetch recipes if there is a search term
    if (searchTerm) {
      fetchRecipes();
    }
  }, [searchTerm]);

  // Filter recipes by search term
  useEffect(() => {
    setFilteredRecipes(
      recipes.filter(recipe => recipe.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, recipes]);

  // Add or remove favorite
  const toggleFavorite = useCallback(recipe => {
    const isFavorite = favorites.find(fav => fav.id === recipe.id);
    if (isFavorite) {
      dispatch({ type: 'REMOVE_FAVORITE', id: recipe.id });
    } else {
      dispatch({ type: 'ADD_FAVORITE', recipe });
    }
  }, [favorites]);

  return (
    <ThemeContext.Provider value={theme}>
      <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
        <div className={`app ${theme}`}>
          <header>
            <button onClick={toggleTheme}>Change Theme</button>
            <input
              type="text"
              placeholder="Search Recipes"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <button onClick={() => setFilteredRecipes(recipes)}>Search recipes</button>
          </header>
          
          <h2>Favorites</h2>
          <div className="favorites">
            {favorites.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          
          <h2>Recipes</h2>
          <div className="recipes">
            {filteredRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      </FavoritesContext.Provider>
    </ThemeContext.Provider>
  );
};

const RecipeCard = ({ recipe }) => {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const isFavorite = favorites.some(fav => fav.id === recipe.id);

  return (
    <div className="recipe-card">
      <img src={`https://spoonacular.com/recipeImages/${recipe.id}-312x231.jpg`} alt={recipe.title} />
      <h3>{recipe.title}</h3>
      <button onClick={() => toggleFavorite(recipe)}>
        {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      </button>
    </div>
  );
};

export default App;
