import { categories } from '../../data/catalog.js'

export default function FiltersSidebar({ selectedCategory, onCategoryChange, onSortChange, sort }) {
  return (
    <aside className="panel filters">
      <div className="filter-group">
        <span className="filter-title">Categories</span>
        <label className="check-row"><span>All products</span><input checked={!selectedCategory} name="category" onChange={() => onCategoryChange('')} type="radio" /></label>
        {categories.map((category) => (
          <label className="check-row" key={category.slug}><span>{category.name}</span><input checked={selectedCategory === category.slug} name="category" onChange={() => onCategoryChange(category.slug)} type="radio" /></label>
        ))}
      </div>
      <label className="label">Sort by
        <select className="select" onChange={(event) => onSortChange(event.target.value)} value={sort}>
          <option value="featured">Featured</option><option value="rating">Top rated</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option>
        </select>
      </label>
    </aside>
  )
}
