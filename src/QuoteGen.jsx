import  { useState, useEffect } from 'react';
import axios from 'axios';
import Category from './Category';
import './App.css';

function QuoteGen() {
  const [quote, setQuote] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]); 
  const [showFavorites, setShowFavorites] = useState(false);


  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favoriteQuotes')) || [];
    setFavorites(storedFavorites);
  }, []);


  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://api.quotable.io/tags');
      setCategories(response.data.map(tag => tag.name));
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(['inspire', 'love', 'life']);
    }
  };

 
  const fetchQuote = async (selectedCategory) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://api.quotable.io/random?tags=${selectedCategory}`);
      setQuote(response.data.content);
    } catch (error) {
      console.error('Error fetching quote:', error);
      setQuote('Failed to fetch quote');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (category) fetchQuote(category);
  }, [category]);

  const saveToFavorites = () => {
    if (!favorites.includes(quote)) {
      const newFavorites = [...favorites, quote];
      setFavorites(newFavorites);
      localStorage.setItem('favoriteQuotes', JSON.stringify(newFavorites)); 
    }
  };


  const removeFromFavorites = (quoteToRemove) => {
    const updatedFavorites = favorites.filter((fav) => fav !== quoteToRemove);
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteQuotes', JSON.stringify(updatedFavorites)); 
  };

  return (
    <div className="quote-generator-container">
      <Category categories={categories} setCategory={setCategory} />
      <div className="quote-container">
        {loading ? <p className="loading">Loading...</p> : <p className="quote">{quote}</p>}
      </div>
      <button className="new-quote-btn" onClick={() => fetchQuote(category)} disabled={!category}>
        New Quote
      </button>
      <button className="save-quote-btn" onClick={saveToFavorites} disabled={!quote}>
        Save to Favorites
      </button>
      <button className="fav-quotes-btn" onClick={() => setShowFavorites(!showFavorites)}>
        {showFavorites ? 'Hide Favorite Quotes' : 'Show Favorite Quotes'}
      </button>

      {showFavorites && (
        <div className="favorites-container">
          <h2>Your Favorite Quotes</h2>
          {favorites.length === 0 ? (
            <p>No favorites yet.</p>
          ) : (
            <ul>
              {favorites.map((favQuote, index) => (
                <li key={`${favQuote}-${index}`}>
                  <span>{favQuote}</span>
                  <button className="remove-quote-btn" onClick={() => removeFromFavorites(favQuote)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
export default QuoteGen;
