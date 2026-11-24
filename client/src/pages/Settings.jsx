
import { useState } from "react";
import "./Settings.css";

const API = "http://localhost:5001/api";

function Settings() {
  const [activeTab, setActiveTab] = useState("account");

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  const userId = user?._id || user?.id || "guest";

  const notificationKey = `campusloop_notifications_${userId}`;
  const privacyKey = `campusloop_privacy_${userId}`;

  const defaultNotifications = {
    messages: true,
    listingUpdates: true,
    announcements: false
  };

  const defaultPrivacy = {
    showEmail: false,
    showListings: true
  };

  const loadPreferences = (key, defaults) => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "null");
      return saved ? { ...defaults, ...saved } : defaults;
    } catch {
      return defaults;
    }
  };

  const [notifications, setNotifications] = useState(() =>
    loadPreferences(notificationKey, defaultNotifications)
  );

  const [privacy, setPrivacy] = useState(() =>
    loadPreferences(privacyKey, defaultPrivacy)
  );

  const [theme, setTheme] = useState(() =>
    localStorage.getItem("campusloop_theme") || "light"
  );

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: ""
  });

  const menuItems = [
    { id: "account", label: "Account", icon: "👤" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "privacy", label: "Privacy", icon: "🛡️" },
    { id: "appearance", label: "Appearance", icon: "🎨" },
    { id: "help", label: "Help & Support", icon: "❓" },
    { id: "about", label: "About CampusLoop", icon: "ℹ️" }
  ];

  const handleToggle = (section, key) => {
    if (section === "notifications") {
      setNotifications(prev => {
        const updated = { ...prev, [key]: !prev[key] };
        localStorage.setItem(notificationKey, JSON.stringify(updated));
        return updated;
      });
    } else {
      setPrivacy(prev => {
        const updated = { ...prev, [key]: !prev[key] };
        localStorage.setItem(privacyKey, JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleThemeChange = () => {
    const newTheme = theme === "light" ? "dark" : "light";
  
    setTheme(newTheme);
    localStorage.setItem("campusloop_theme", newTheme);
  
    document.documentElement.dataset.theme = newTheme;
  };

  const renderToggle = (checked, onChange) => (
    <label className="settings-switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <span className="settings-slider"></span>
    </label>
  );

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));

    setPasswordMessage({ type: "", text: "" });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const {
      currentPassword,
      newPassword,
      confirmPassword
    } = passwordForm;

    setPasswordMessage({ type: "", text: "" });

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "Please fill in all password fields."
      });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage({
        type: "error",
        text: "New password must be at least 8 characters."
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "New passwords do not match."
      });
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordMessage({
        type: "error",
        text: "New password must be different from current password."
      });
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setPasswordMessage({
        type: "error",
        text: "Please log in again."
      });
      return;
    }

    try {
      setPasswordLoading(true);

      const response = await fetch(`${API}/auth/change-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to change password.");
      }

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      setPasswordMessage({
        type: "success",
        text: data.message || "Password changed successfully!"
      });

    } catch (error) {
      setPasswordMessage({
        type: "error",
        text: error.message || "Something went wrong."
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const renderPasswordField = (label, name, visibilityKey) => (
    <div className="settings-password-field">
      <label htmlFor={name}>{label}</label>

      <div className="settings-password-input">
        <input
          id={name}
          type={showPasswords[visibilityKey] ? "text" : "password"}
          name={name}
          value={passwordForm[name]}
          onChange={handlePasswordChange}
          placeholder={`Enter ${label.toLowerCase()}`}
          autoComplete="off"
          required
        />

        <button
          type="button"
          onClick={() => togglePasswordVisibility(visibilityKey)}
        >
          {showPasswords[visibilityKey] ? "🙈" : "👁️"}
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <>
            <h2>Account Settings</h2>
            <p className="settings-description">
              Manage your personal account information.
            </p>

            <div className="settings-card">
              <div className="settings-profile">
                <div className="settings-avatar">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h3>{user?.name || "CampusLoop User"}</h3>
                  <p>{user?.email || "No email available"}</p>
                </div>
              </div>

              <div className="settings-info-row">
                <span>Full Name</span>
                <strong>{user?.name || "Not available"}</strong>
              </div>

              <div className="settings-info-row">
                <span>Email Address</span>
                <strong>{user?.email || "Not available"}</strong>
              </div>
            </div>
          </>
        );

      case "security":
        return (
          <>
            <h2>Security</h2>
            <p className="settings-description">
              Keep your CampusLoop account secure.
            </p>

            <div className="settings-card">
              <h3>Change Password</h3>
              <p>Update your password to keep your account secure.</p>

              <form
                className="settings-password-form"
                onSubmit={handleChangePassword}
              >
                {renderPasswordField(
                  "Current Password",
                  "currentPassword",
                  "current"
                )}

                {renderPasswordField(
                  "New Password",
                  "newPassword",
                  "new"
                )}

                {renderPasswordField(
                  "Confirm New Password",
                  "confirmPassword",
                  "confirm"
                )}

                {passwordMessage.text && (
                  <p
                    className={`settings-password-message ${passwordMessage.type}`}
                    role="alert"
                  >
                    {passwordMessage.text}
                  </p>
                )}

                <button
                  type="submit"
                  className="settings-save-button"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </>
        );

      case "notifications":
        return (
          <>
            <h2>Notifications</h2>
            <p className="settings-description">
              Choose which updates you want to receive.
            </p>

            <div className="settings-card">
              <div className="settings-option">
                <div>
                  <h3>Messages</h3>
                  <p>Updates when someone contacts you.</p>
                </div>
                {renderToggle(
                  notifications.messages,
                  () => handleToggle("notifications", "messages")
                )}
              </div>

              <div className="settings-option">
                <div>
                  <h3>Listing Updates</h3>
                  <p>Updates about your listed items.</p>
                </div>
                {renderToggle(
                  notifications.listingUpdates,
                  () => handleToggle("notifications", "listingUpdates")
                )}
              </div>

              <div className="settings-option">
                <div>
                  <h3>Announcements</h3>
                  <p>CampusLoop news and announcements.</p>
                </div>
                {renderToggle(
                  notifications.announcements,
                  () => handleToggle("notifications", "announcements")
                )}
              </div>
            </div>
          </>
        );

      case "privacy":
        return (
          <>
            <h2>Privacy</h2>
            <p className="settings-description">
              Control what other students can see.
            </p>

            <div className="settings-card">
              <div className="settings-option">
                <div>
                  <h3>Show Email Address</h3>
                  <p>Allow other students to see your email.</p>
                </div>
                {renderToggle(
                  privacy.showEmail,
                  () => handleToggle("privacy", "showEmail")
                )}
              </div>

              <div className="settings-option">
                <div>
                  <h3>Show My Listings</h3>
                  <p>Display your available listings on your profile.</p>
                </div>
                {renderToggle(
                  privacy.showListings,
                  () => handleToggle("privacy", "showListings")
                )}
              </div>
            </div>
          </>
        );

      case "appearance":
        return (
          <>
            <h2>Appearance</h2>
            <p className="settings-description">
              Customize how your Settings page looks.
            </p>

            <div className="settings-card">
              <div className="settings-option">
                <div>
                  <h3>Dark Mode</h3>
                  <p>
                    Switch between light and dark appearance.
                    Your preference will be saved automatically.
                  </p>
                </div>

                {renderToggle(
                  theme === "dark",
                  handleThemeChange
                )}
              </div>

              <div className="settings-theme-preview">
                <span>
                  {theme === "dark" ? "🌙 Dark mode is active" : "☀️ Light mode is active"}
                </span>
              </div>
            </div>
          </>
        );

      case "help":
        return (
          <>
            <h2>Help & Support</h2>
            <p className="settings-description">
              Find answers to common questions about CampusLoop.
            </p>

            <div className="settings-card">
              <h3>How CampusLoop Works</h3>
              <p>
                CampusLoop is a student marketplace where you can
                buy, sell, rent, borrow and swap items with other students.
              </p>
            </div>

            <div className="settings-card settings-faq-card">
              <h3>Frequently Asked Questions</h3>

              <details className="settings-faq">
                <summary>How can I sell an item?</summary>
                <p>
                  Open the List Item section, add your item's details,
                  upload an image, enter the price and submit your listing.
                </p>
              </details>

              <details className="settings-faq">
                <summary>How can I buy an item?</summary>
                <p>
                  Browse the marketplace, search or filter for an item,
                  open its details and contact the seller or send a
                  purchase request.
                </p>
              </details>

              <details className="settings-faq">
                <summary>Can I rent or borrow items?</summary>
                <p>
                  Yes. Browse listings marked for rent or borrow and
                  contact the seller to discuss the arrangement.
                </p>
              </details>

              <details className="settings-faq">
                <summary>How can I swap an item?</summary>
                <p>
                  Explore swap listings and contact the other student
                  to discuss the exchange.
                </p>
              </details>

              <details className="settings-faq">
                <summary>How can I manage my listings?</summary>
                <p>
                  Visit your Profile to view and manage the items
                  you have listed.
                </p>
              </details>

              <details className="settings-faq">
                <summary>Is an account required to use CampusLoop?</summary>
                <p>
                  You need to register and log in to access account-based
                  features such as listing items and sending purchase requests.
                </p>
              </details>
            </div>

            <div className="settings-card">
              <h3>Stay Safe</h3>
              <p>
                Always verify item details before making a purchase.
                Communicate clearly with other students and be careful
                when arranging exchanges or payments.
              </p>
            </div>
          </>
        );

      case "about":
        return (
          <>
            <h2>About CampusLoop</h2>
            <p className="settings-description">
              Everything about our campus marketplace.
            </p>

            <div className="settings-card">
              <h3>CampusLoop</h3>
              <p>
                A student marketplace to buy, sell, rent, borrow
                and swap items within your campus.
              </p>
              <p className="settings-note">Version 1.0.0</p>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`settings-page ${theme === "dark" ? "dark-theme" : ""}`}>
      <div className="settings-heading">
        <h1>Settings</h1>
        <p>Manage your account and preferences.</p>
      </div>

      <div className="settings-layout">
        <aside className="settings-sidebar">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`settings-menu-item ${
                activeTab === item.id ? "active" : ""
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </aside>

        <main className="settings-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default Settings;
