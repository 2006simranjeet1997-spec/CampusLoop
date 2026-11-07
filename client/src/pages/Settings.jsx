
import { useState } from "react";
import "./Settings.css";

function Settings() {
  const [activeTab, setActiveTab] = useState("account");

  const [notifications, setNotifications] = useState({
    messages: true,
    listingUpdates: true,
    announcements: false
  });

  const [privacy, setPrivacy] = useState({
    showEmail: false,
    showListings: true
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

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleToggle = (section, key) => {
    if (section === "notifications") {
      setNotifications(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    } else {
      setPrivacy(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    }
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
              <h3>Password</h3>
              <p>Protect your account with a strong password.</p>
              <p className="settings-note">
                Password management will be available here.
              </p>
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
              Customize how CampusLoop looks.
            </p>

            <div className="settings-card">
              <h3>Theme</h3>
              <p>Choose your preferred appearance.</p>
              <p className="settings-note">
                Light theme is currently active. Theme customization
                will be implemented later.
              </p>
            </div>
          </>
        );

      case "help":
        return (
          <>
            <h2>Help & Support</h2>
            <p className="settings-description">
              Need help using CampusLoop?
            </p>

            <div className="settings-card">
              <h3>How CampusLoop Works</h3>
              <p>Learn how to buy, sell, rent, borrow and swap items.</p>
            </div>

            <div className="settings-card">
              <h3>Contact Support</h3>
              <p>Support contact options will be added here.</p>
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
    <div className="settings-page">
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
