
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <span className="section-tag">ABOUT CAMPUSLOOP</span>

        <h1>
          A smarter way to <span>share</span> on campus.
        </h1>

        <p>
          CampusLoop is a student-focused marketplace where your campus
          becomes a community of sharing, saving and discovering.
        </p>

        <Link to="/marketplace" className="about-button">
          Explore Marketplace
        </Link>
      </section>

      <section className="about-story">
        <div className="about-story-content">
          <span className="section-tag">OUR STORY</span>
          <h2>Built for students, by students.</h2>

          <p>
            Every student has something they no longer need, while another
            student might be looking for exactly that item.
          </p>

          <p>
            CampusLoop brings these students together. Instead of buying
            everything new, students can buy, sell, rent, borrow and swap
            items within their campus community.
          </p>
        </div>

        <div className="about-highlight">
          <div className="highlight-icon">🎓</div>
          <h3>One campus. Endless possibilities.</h3>
          <p>
            Making student life more affordable, convenient and connected.
          </p>
        </div>
      </section>

      <section className="about-values">
        <div className="section-heading">
          <span className="section-tag">WHAT WE BELIEVE IN</span>
          <h2>More than just a marketplace.</h2>
          <p>We're building a better campus experience through sharing.</p>
        </div>

        <div className="value-grid">
          <div className="value-card">
            <div className="value-icon">💰</div>
            <h3>Save More</h3>
            <p>
              Find affordable items and help fellow students save money.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">♻️</div>
            <h3>Reuse More</h3>
            <p>
              Give useful items a second life instead of letting them go
              to waste.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">🤝</div>
            <h3>Connect More</h3>
            <p>
              Build connections with students through sharing and
              exchanging.
            </p>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <h2>Ready to explore your campus marketplace?</h2>
        <p>Discover something useful or share something with others.</p>
        <Link to="/marketplace" className="about-button">
          Get Started
        </Link>
      </section>
    </div>
  );
}

export default About;
