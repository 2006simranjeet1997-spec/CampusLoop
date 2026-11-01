
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        CampusLoop
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/marketplace">Marketplace</Link>
        <Link to="/how-it-works">How It Works</Link>
        <Link to="/about">About</Link>
      </div>

      <div className="nav-actions">
        <Link to="/login">Login</Link>
        <Link to="/signup" className="signup-btn">
          Sign Up
        </Link>
        <Link to="/list-item" className="list-btn">
          + List an Item
        </Link>
        <Link to="/profile" className="profile-icon">
          S
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
