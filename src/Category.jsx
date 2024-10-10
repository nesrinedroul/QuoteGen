
import './App.css';

function Category({ categories, setCategory }) {
  return (
    <div className="category-selector">
      <label htmlFor="category" className="category-label">Choose a Category:</label>
      <select id="category" onChange={(e) => setCategory(e.target.value)} className="category-select" defaultValue="">
        <option value="" disabled>Choose a category</option>
        {categories.map((cat, index) => (
         
          <option key={`${cat}-${index}`} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Category;
