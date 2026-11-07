
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function ItemDetails() {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch item from MongoDB using its ID
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5001/api/listings/${id}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Item not found.");
        }

        setItem(data.listing);

      } catch (err) {
        console.error("Item details error:", err);
        setError(err.message || "Unable to load item.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  // Category emoji
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

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading item details...</h2>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="page-container">
        <h2>Item not found</h2>
        <p>{error}</p>
        <Link to="/marketplace">Back to Marketplace</Link>
      </div>
    );
  }

  return (
    <main className="item-details-page">

      <Link to="/marketplace" className="back-link">
        ← Back to Marketplace
      </Link>

      <div className="details-container">

        <div className="details-image">
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
            getEmoji(item.category)
          )}
        </div>

        <div className="details-info">

          <span className="section-label">
            {item.category}
          </span>

          <h1>{item.itemName}</h1>

          <span className="details-type">
            {item.listingType}
          </span>

          <h2>
            {item.listingType === "Swap"
              ? "Exchange"
              : item.price === 0
              ? "Price on request"
              : `₹${item.price}`}
          </h2>

          <div className="details-divider"></div>

          <h3>About this item</h3>

          <p>{item.description}</p>

          <p>
            <strong>Condition:</strong> {item.condition}
          </p>

          <div className="seller-box">

            <div className="seller-avatar">
              {item.seller?.name?.charAt(0).toUpperCase() || "S"}
            </div>

            <div>
              <h4>{item.seller?.name || "CampusLoop Student"}</h4>
              <p>Student Seller</p>
            </div>

          </div>

          <button
            className="contact-seller-btn"
            onClick={() => alert("Seller contact feature coming soon!")}
          >
            Contact Seller
          </button>

        </div>

      </div>

    </main>
  );
}

export default ItemDetails;
