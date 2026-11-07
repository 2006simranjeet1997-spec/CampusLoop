
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Marketplace() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    "All",
    "Electronics",
    "Books",
    "Study Materials",
    "Accessories",
    "Others",
  ];

  const types = ["All", "Sell", "Rent", "Borrow", "Swap"];

  // Fetch listings from backend
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (search.trim()) {
          params.append("search", search.trim());
        }

        if (category !== "All") {
          params.append("category", category);
        }

        if (type !== "All") {
          params.append("listingType", type);
        }

        const response = await fetch(
          `http://localhost:5001/api/listings?${params.toString()}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch listings.");
        }

        setItems(data.listings);

      } catch (err) {
        console.error("Marketplace error:", err);
        setError(err.message || "Unable to load marketplace items.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [search, category, type]);

  // Emoji based on category
  const getEmoji = (category) => {
    const emojis = {
      Electronics: "💻",
      Books: "📚",
      "Study Materials": "🧮",
      Accessories: "🎒",
      Others: "📦",
    };

    return emojis[category] || "📦";
  };

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
                className={
                  category === item
                    ? "filter-btn active"
                    : "filter-btn"
                }
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
                className={
                  type === item
                    ? "filter-btn active"
                    : "filter-btn"
                }
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
            <span>{items.length} items found</span>
          </div>

          {loading ? (
            <div className="empty-results">
              <h3>Loading marketplace...</h3>
              <p>Please wait while we fetch available items.</p>
            </div>
          ) : error ? (
            <div className="empty-results">
              <h3>Something went wrong</h3>
              <p>{error}</p>
            </div>
          ) : (
            <>
              <div className="marketplace-grid">

                {items.map((item) => (
                  <article
                    className="market-item-card"
                    key={item._id}
                  >

                    <div className="market-item-image">

                      {item.imageUrl ? (
                        <img
                          src={
                            item.imageUrl.startsWith("http")
                              ? item.imageUrl
                              : `http://localhost:5001${item.imageUrl}`
                          }
                          alt={item.itemName}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <span>{getEmoji(item.category)}</span>
                      )}

                      <span className="listing-type">
                        {item.listingType}
                      </span>

                    </div>

                    <div className="market-item-info">

                      <span className="item-category">
                        {item.category}
                      </span>

                      <h3>{item.itemName}</h3>

                      <p>
                        {item.listingType === "Swap"
                          ? "Exchange for another item"
                          : item.price === 0
                          ? "Price on request"
                          : `₹${item.price}`}
                      </p>

                      <Link
                        to={`/item/${item._id}`}
                        className="view-item-btn"
                      >
                        View Details →
                      </Link>

                    </div>

                  </article>
                ))}

              </div>

              {items.length === 0 && (
                <div className="empty-results">
                  <h3>No items found</h3>
                  <p>Try changing your search or filters.</p>
                </div>
              )}
            </>
          )}

        </div>

      </section>

    </main>
  );
}

export default Marketplace;
