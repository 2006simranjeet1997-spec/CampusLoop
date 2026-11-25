
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";

const API = `${API_URL}/api`;

function Home() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH REAL FEATURED LISTINGS
  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API}/listings`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch featured items.");
        }

        setFeaturedItems((data.listings || []).slice(0, 3));
      } catch (err) {
        console.error("Featured items error:", err);
        setError(err.message || "Unable to load featured items.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  // EMOJI BASED ON CATEGORY
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
    <main className="home-page">
      <section className="hero-section">

        <div className="hero-circle hero-circle-left"></div>
        <div className="hero-circle hero-circle-right"></div>
        <div className="dot-pattern dots-left"></div>
        <div className="dot-pattern dots-right"></div>

        <div className="floating-card laptop-card">
          <div className="card-icon">💻</div>
          <div>
            <h3>Laptops</h3>
            <p>Buy · Rent · Swap</p>
          </div>
        </div>

        <div className="floating-card books-card">
          <div className="card-icon">📚</div>
          <div>
            <h3>Books</h3>
            <p>Buy · Sell · Share</p>
          </div>
        </div>

        <div className="floating-card clothes-card">
          <div className="card-icon">👕</div>
          <div>
            <h3>Clothing</h3>
            <p>Buy · Sell · Swap</p>
          </div>
        </div>

        <div className="side-note left-note">
          <span>✳</span>
          <p>Same campus<br />More possibilities</p>
        </div>

        <div className="side-note right-note">
          <span>♡</span>
          <p>Students<br />Helping Students</p>
        </div>

        <div className="hero-content">
          <span className="hero-label">CAMPUS MARKETPLACE</span>

          <h1>
            What you need is already
            <span>on campus.</span>
          </h1>

          <p className="hero-description">
            Borrow, sell, swap, or share items with students around you.
            <br />
            Sustainable. Affordable. Student to student.
          </p>

          <div className="hero-actions">
            <Link to="/marketplace" className="hero-primary-btn">
              Explore Marketplace <span>→</span>
            </Link>

            <Link to="/list-item" className="hero-secondary-btn">
              List an Item
            </Link>
          </div>
        </div>

        <div className="scroll-indicator">↓</div>
      </section>

      {/* FEATURED ITEMS */}
      <section className="featured-section">
        <div className="section-heading">
          <div>
            <span className="section-label">EXPLORE CAMPUS FINDS</span>
            <h2>Featured Items</h2>
            <p>Discover useful things shared by students around you.</p>
          </div>

          <Link to="/marketplace" className="view-all-btn">
            View All →
          </Link>
        </div>

        <div className="featured-grid">
          {loading ? (
            <div className="featured-message">
              <h3>Loading featured items...</h3>
              <p>Please wait while we fetch campus listings.</p>
            </div>
          ) : error ? (
            <div className="featured-message">
              <h3>Unable to load featured items</h3>
              <p>{error}</p>
            </div>
          ) : featuredItems.length === 0 ? (
            <div className="featured-message">
              <h3>No listings available yet</h3>
              <p>Be the first student to list an item!</p>
              <Link to="/list-item" className="view-all-btn">
                List an Item →
              </Link>
            </div>
          ) : (
            featuredItems.map((item) => (
              <article className="item-card" key={item._id}>
                <div className="item-image">
                  {item.imageUrl ? (
                    <img
                      src={
                        item.imageUrl.startsWith("http")
                          ? item.imageUrl
                          : `${API_URL}${item.imageUrl}`
                      }
                      alt={item.itemName}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span>{getEmoji(item.category)}</span>
                  )}
                </div>

                <span className="item-category">
                  {item.category}
                </span>

                <h3>{item.itemName}</h3>

                <p>
                  {item.listingType === "Swap"
                    ? "Available for exchange"
                    : item.listingType === "Rent"
                    ? "Available for rent"
                    : item.listingType === "Borrow"
                    ? "Available to borrow"
                    : "Available for sale"}
                </p>

                <strong>
                  {item.price === 0
                    ? "Price on request"
                    : item.listingType === "Rent"
                    ? `₹${item.price} / rent`
                    : item.listingType === "Swap"
                    ? "Exchange"
                    : `₹${item.price}`}
                </strong>

                <Link
                  to={`/item/${item._id}`}
                  className="view-item-btn"
                >
                  View Item →
                </Link>
              </article>
            ))
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="how-heading">
          <span className="section-label">SIMPLE & EASY</span>
          <h2>How CampusLoop Works</h2>
          <p>Get what you need in just three simple steps.</p>
        </div>

        <div className="how-grid">
          <div className="how-card">
            <div className="how-icon">🔍</div>
            <span className="step-number">01</span>
            <h3>Explore</h3>
            <p>
              Browse items listed by students on your campus.
              Find exactly what you need.
            </p>
          </div>

          <div className="how-card">
            <div className="how-icon">🤝</div>
            <span className="step-number">02</span>
            <h3>Connect</h3>
            <p>
              Contact the student directly and discuss
              the item, price or exchange.
            </p>
          </div>

          <div className="how-card">
            <div className="how-icon">🎉</div>
            <span className="step-number">03</span>
            <h3>Exchange</h3>
            <p>
              Meet on campus, complete your exchange
              and enjoy a smarter student community.
            </p>
          </div>
        </div>
      </section>

      {/* WHY CAMPUSLOOP */}
      <section className="why-section">
        <div className="why-heading">
          <span className="section-label">WHY CAMPUSLOOP?</span>
          <h2>More Than Just a Marketplace</h2>
          <p>
            A smarter way to share resources and connect with your campus community.
          </p>
        </div>

        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon">🎓</div>
            <h3>Made for Students</h3>
            <p>A marketplace designed around student needs and campus life.</p>
          </div>

          <div className="why-card">
            <div className="why-icon">💰</div>
            <h3>Budget Friendly</h3>
            <p>Save money by buying, renting and exchanging items with others.</p>
          </div>

          <div className="why-card">
            <div className="why-icon">🌱</div>
            <h3>Sustainable Living</h3>
            <p>Give pre-loved items a second life instead of letting them go to waste.</p>
          </div>

          <div className="why-card">
            <div className="why-icon">🤝</div>
            <h3>Campus Community</h3>
            <p>Connect with fellow students and make campus life easier.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
