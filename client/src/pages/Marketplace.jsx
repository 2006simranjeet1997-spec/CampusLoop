
import { useState } from "react";
import { Link } from "react-router-dom";

const items = [
  {
    id: 1,
    name: "Study Laptop",
    category: "Electronics",
    type: "Rent",
    price: 500,
    unit: "/ week",
    emoji: "💻",
  },
  {
    id: 2,
    name: "Engineering Books",
    category: "Books",
    type: "Sell",
    price: 350,
    unit: "",
    emoji: "📚",
  },
  {
    id: 3,
    name: "Wireless Headphones",
    category: "Electronics",
    type: "Sell",
    price: 800,
    unit: "",
    emoji: "🎧",
  },
  {
    id: 4,
    name: "Scientific Calculator",
    category: "Study Materials",
    type: "Borrow",
    price: 100,
    unit: "/ day",
    emoji: "🧮",
  },
  {
    id: 5,
    name: "College Backpack",
    category: "Accessories",
    type: "Swap",
    price: 0,
    unit: "",
    emoji: "🎒",
  },
  {
    id: 6,
    name: "Desk Lamp",
    category: "Accessories",
    type: "Sell",
    price: 250,
    unit: "",
    emoji: "💡",
  },
];

function Marketplace() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");

  const categories = [
    "All",
    "Electronics",
    "Books",
    "Study Materials",
    "Accessories",
  ];

  const types = ["All", "Sell", "Rent", "Borrow", "Swap"];

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || item.category === category;

    const matchesType = type === "All" || item.type === type;

    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <main className="marketplace-page">
      <section className="marketplace-header">
        <span className="section-label">STUDENT MARKETPLACE</span>
        <h1>Explore the Marketplace</h1>
        <p>Find what you need. Share what you don't.</p>

        <input
          type="text"
          placeholder="Search for books, electronics, accessories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="marketplace-search"
        />
      </section>

      <section className="marketplace-content">
        <div className="filter-group">
          <h3>Categories</h3>
          <div className="filter-options">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? "filter-btn active" : "filter-btn"}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3>Listing Type</h3>
          <div className="filter-options">
            {types.map((item) => (
              <button
                key={item}
                className={type === item ? "filter-btn active" : "filter-btn"}
                onClick={() => setType(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="marketplace-results">
          <div className="results-heading">
            <h2>Available Items</h2>
            <span>{filteredItems.length} items found</span>
          </div>

          <div className="marketplace-grid">
            {filteredItems.map((item) => (
              <article className="market-item-card" key={item.id}>
                <div className="market-item-image">
                  <span>{item.emoji}</span>
                  <span className="listing-type">{item.type}</span>
                </div>

                <div className="market-item-info">
                  <span className="item-category">{item.category}</span>
                  <h3>{item.name}</h3>
                  <p>
                    {item.price === 0
                      ? "Exchange for another item"
                      : `₹${item.price} ${item.unit}`}
                  </p>

                  <Link
                    to={`/item/${item.id}`}
                    className="view-item-btn"
                  >
                    View Details →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="empty-results">
              <h3>No items found</h3>
              <p>Try changing your search or filters.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Marketplace;
