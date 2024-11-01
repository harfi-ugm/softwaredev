import React, { useState, useEffect, useReducer, useContext, useCallback } from 'react';
import './App.css'
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
  const [favoriteSearchTerm, setFavoriteSearchTerm] = useState(''); // New state for favorite search
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [favorites, dispatch] = useReducer(favoritesReducer, []);
  const [filteredFavorites, setFilteredFavorites] = useState([]); // New state for filtered favorites

  // API key for Spoonacular
  const API_KEY = 'e4af26cc9fae477a9b159f4c02d7d705';

  // Toggle theme
  const toggleTheme = () => setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));

  useEffect(() => {
    document.body.className = theme; // Apply theme class directly to body
  }, [theme]);
  
  // Fetch recipes from Spoonacular API when searchTerm updates
  useEffect(() => {
    const fetchRecipes = async () => {
      if (!searchTerm) return; // skip fetch if search term is empty
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${searchTerm}`
        );
        const data = await response.json();
        setRecipes(data.results || []);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
if(searchTerm){
    fetchRecipes();}
  }, [searchTerm]);




  // Filter recipes by search term
  useEffect(() => {
    setFilteredRecipes(
      recipes.filter(recipe => recipe.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, recipes]);

    // Updates `filteredFavorites` each time favorites list changes
    useEffect(() => {
      setFilteredFavorites(
        favorites.filter(recipe => recipe.title.toLowerCase().includes(favoriteSearchTerm.toLowerCase()))
      );
    }, [favorites, favoriteSearchTerm]);

  // Filter favorites by favorite search term when search button is clicked
  const handleFavoriteSearch = () => {
    setFilteredFavorites(
      favorites.filter(recipe => recipe.title.toLowerCase().includes( searchTerm.toLowerCase()))
    );
  };


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
          </header>
          
          <h2>Favorites</h2>
          <div className="favorites-section">
            <div className="searchbar">
              <input
               type="text"
               placeholder="Search Favorite Recipes"
               value={favoriteSearchTerm}
               onChange={e => setFavoriteSearchTerm(e.target.value)} // Filter favorites
            />  
            <button onClick={handleFavoriteSearch}>Search</button> {/* New search button */}
          </div>
          <div className="favorites">
            {filteredFavorites.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
            </div>
          </div>
        
         

          <div className="searchbar">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <button onClick={() => setFilteredRecipes(recipes)}>Search</button>
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
      <button className="favorite-button" onClick={() => toggleFavorite(recipe)}>
        {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      </button>
    </div>
  );
};

export default App;
