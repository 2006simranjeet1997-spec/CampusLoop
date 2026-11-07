
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => Boolean(localStorage.getItem("token"))
  );
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateAuth = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("token")));

      try {
        setUser(JSON.parse(localStorage.getItem("user")) || null);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("authChanged", updateAuth);

    return () => {
      window.removeEventListener("authChanged", updateAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setUser(null);
    setMenuOpen(false);

    window.dispatchEvent(new Event("authChanged"));
    navigate("/login");
  };

  const initial = user?.name?.charAt(0).toUpperCase() || "U";

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
        {isLoggedIn ? (
          <>
            <Link to="/list-item" className="list-btn">
              + List an Item
            </Link>

            <div className="profile-menu">
              <button
                className="profile-icon"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Open profile menu"
              >
                {initial}
              </button>

              {menuOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <strong>{user?.name || "CampusLoop User"}</strong>
                    <small>{user?.email || ""}</small>
                  </div>

                  <Link to="/profile" onClick={() => setMenuOpen(false)}>
                    My Profile
                  </Link>

                  <Link to="/settings" onClick={() => setMenuOpen(false)}>
                    Settings
                  </Link>

                  <button onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>

            <Link to="/signup" className="signup-btn">
              Sign Up
            </Link>

            <Link to="/list-item" className="list-btn">
              + List an Item
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
