
import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home-page">
      <section className="hero-section">

        {/* Decorative background */}
        <div className="hero-circle hero-circle-left"></div>
        <div className="hero-circle hero-circle-right"></div>
        <div className="dot-pattern dots-left"></div>
        <div className="dot-pattern dots-right"></div>

        {/* Floating category cards */}
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

        {/* Decorative text */}
        <div className="side-note left-note">
          <span>✳</span>
          <p>Same campus<br />More possibilities</p>
        </div>

        <div className="side-note right-note">
          <span>♡</span>
          <p>Students<br />Helping Students</p>
        </div>

        {/* Main hero content */}
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
    <div className="item-card">
      <div className="item-image">💻</div>
      <span className="item-category">Electronics</span>
      <h3>Study Laptop</h3>
      <p>Available for rent</p>
      <strong>₹500 / week</strong>
    </div>

    <div className="item-card">
      <div className="item-image">📚</div>
      <span className="item-category">Books</span>
      <h3>Engineering Books</h3>
      <p>Available for sale</p>
      <strong>₹350</strong>
    </div>

    <div className="item-card">
      <div className="item-image">🎧</div>
      <span className="item-category">Accessories</span>
      <h3>Wireless Headphones</h3>
      <p>Available for sale</p>
      <strong>₹800</strong>
    </div>
  </div>
</section>


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


<section className="why-section">
  <div className="why-heading">
    <span className="section-label">WHY CAMPUSLOOP?</span>
    <h2>More Than Just a Marketplace</h2>
    <p>A smarter way to share resources and connect with your campus community.</p>
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
