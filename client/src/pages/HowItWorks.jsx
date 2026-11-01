
import { Link } from "react-router-dom";

function HowItWorks() {
  return (
    <div className="how-page">
      <section className="how-hero">
        <span className="section-tag">SIMPLE. SMART. STUDENT-FRIENDLY.</span>

        <h1>
          How CampusLoop <span>Works</span>
        </h1>

        <p>
          Buy, sell, rent, borrow and swap items within your campus.
          Everything you need, just a few clicks away.
        </p>
      </section>

      <section className="how-steps">
        <div className="section-heading">
          <span className="section-tag">THREE SIMPLE STEPS</span>
          <h2>Get started with CampusLoop</h2>
          <p>Your campus marketplace experience starts here.</p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <div className="step-icon">🔍</div>
            <h3>Explore Items</h3>
            <p>
              Browse the marketplace and discover books, electronics,
              accessories and other useful student essentials.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <div className="step-icon">💬</div>
            <h3>Connect with Students</h3>
            <p>
              Find an item that interests you and connect with its seller
              to discuss the details.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-icon">🤝</div>
            <h3>Exchange & Enjoy</h3>
            <p>
              Complete your exchange and give useful items a new home
              within your campus community.
            </p>
          </div>
        </div>
      </section>

      <section className="how-options">
        <div className="section-heading">
          <span className="section-tag">FLEXIBLE FOR EVERY STUDENT</span>
          <h2>What can you do on CampusLoop?</h2>
        </div>

        <div className="options-grid">
          <div className="option-card">
            <span>🛍️</span>
            <div>
              <h3>Buy</h3>
              <p>Find affordable pre-owned items from fellow students.</p>
            </div>
          </div>

          <div className="option-card">
            <span>💸</span>
            <div>
              <h3>Sell</h3>
              <p>List things you no longer need and earn from them.</p>
            </div>
          </div>

          <div className="option-card">
            <span>📚</span>
            <div>
              <h3>Rent</h3>
              <p>Get access to useful items without buying them.</p>
            </div>
          </div>

          <div className="option-card">
            <span>🙌</span>
            <div>
              <h3>Borrow</h3>
              <p>Borrow something you need for a short period.</p>
            </div>
          </div>

          <div className="option-card">
            <span>🔄</span>
            <div>
              <h3>Swap</h3>
              <p>Exchange items with other students.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-cta">
        <h2>Your next great find is on campus.</h2>
        <p>Start exploring and make the most of your campus community.</p>
        <Link to="/marketplace" className="about-button">
          Explore Marketplace
        </Link>
      </section>
    </div>
  );
}

export default HowItWorks;
