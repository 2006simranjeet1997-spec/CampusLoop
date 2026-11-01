
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">CampusLoop</Link>
          <p>
            Your campus, your community.
            Buy, sell, rent and share with fellow students.
          </p>
        </div>

        <div className="footer-links">
          <h3>Explore</h3>
          <Link to="/">Home</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/how-it-works">How It Works</Link>
        </div>

        <div className="footer-links">
          <h3>Account</h3>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
          <Link to="/profile">My Profile</Link>
        </div>

        <div className="footer-links">
          <h3>Discover</h3>
          <Link to="/about">About Us</Link>
          <Link to="/list-item">List an Item</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 CampusLoop. All rights reserved.</p>
        <p>Built for students, by students. 💜</p>
      </div>
    </footer>
  );
}

export default Footer;
