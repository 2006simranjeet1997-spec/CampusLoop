
import { useParams, Link } from "react-router-dom";

const items = [
  {
    id: 1,
    name: "Study Laptop",
    category: "Electronics",
    type: "Rent",
    price: "₹500 / week",
    emoji: "💻",
    description: "A laptop suitable for assignments, coding and everyday college work.",
  },
  {
    id: 2,
    name: "Engineering Books",
    category: "Books",
    type: "Sell",
    price: "₹350",
    emoji: "📚",
    description: "Engineering textbooks in good condition for college students.",
  },
  {
    id: 3,
    name: "Wireless Headphones",
    category: "Electronics",
    type: "Sell",
    price: "₹800",
    emoji: "🎧",
    description: "Wireless headphones for music, lectures and online classes.",
  },
  {
    id: 4,
    name: "Scientific Calculator",
    category: "Study Materials",
    type: "Borrow",
    price: "₹100 / day",
    emoji: "🧮",
    description: "Scientific calculator available for short-term borrowing.",
  },
  {
    id: 5,
    name: "College Backpack",
    category: "Accessories",
    type: "Swap",
    price: "Exchange",
    emoji: "🎒",
    description: "A college backpack available for exchange with another useful item.",
  },
  {
    id: 6,
    name: "Desk Lamp",
    category: "Accessories",
    type: "Sell",
    price: "₹250",
    emoji: "💡",
    description: "A desk lamp suitable for studying in your room.",
  },
];

function ItemDetails() {
  const { id } = useParams();
  const item = items.find((product) => product.id === Number(id));

  if (!item) {
    return (
      <div className="page-container">
        <h2>Item not found</h2>
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
          {item.emoji}
        </div>

        <div className="details-info">
          <span className="section-label">{item.category}</span>
          <h1>{item.name}</h1>
          <span className="details-type">{item.type}</span>

          <h2>{item.price}</h2>

          <div className="details-divider"></div>

          <h3>About this item</h3>
          <p>{item.description}</p>

          <div className="seller-box">
            <div className="seller-avatar">S</div>
            <div>
              <h4>CampusLoop Student</h4>
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
