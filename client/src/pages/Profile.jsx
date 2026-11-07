
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingListing, setEditingListing] = useState(null);

  const [editForm, setEditForm] = useState({
    itemName: "",
    category: "",
    listingType: "",
    price: "",
    condition: "",
    description: ""
  });

  const [saving, setSaving] = useState(false);

  // Image editing states
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // FETCH MY LISTINGS
  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5001/api/listings/my",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (response.ok) {
          setMyListings(data.listings || []);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, []);

  // UPDATE LISTING STATUS
  const updateStatus = async (listingId, status) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/listings/${listingId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ status })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update listing.");
        return;
      }

      setMyListings(prev =>
        prev.map(item =>
          item._id === listingId ? data.listing : item
        )
      );

      alert(data.message);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  // OPEN EDIT FORM
  const handleEdit = (item) => {
    setEditingListing(item);

    setEditForm({
      itemName: item.itemName,
      category: item.category,
      listingType: item.listingType,
      price: item.price,
      condition: item.condition,
      description: item.description
    });

    setEditImage(null);

    setEditImagePreview(
      item.imageUrl
        ? item.imageUrl.startsWith("http")
          ? item.imageUrl
          : `http://localhost:5001${item.imageUrl}`
        : ""
    );
  };

  // HANDLE EDIT INPUTS
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // HANDLE EDIT IMAGE
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG and WEBP images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5 MB.");
      e.target.value = "";
      return;
    }

    if (editImagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(editImagePreview);
    }

    setEditImage(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  // SAVE EDITED LISTING
  const saveEditedListing = async (e) => {
    e.preventDefault();

    if (!editingListing || saving) return;

    setSaving(true);

    try {
      // Create FormData
      const submissionData = new FormData();

      Object.entries(editForm).forEach(([key, value]) => {
        submissionData.append(
          key,
          key === "price" ? Number(value) : value
        );
      });

      // Attach new image only if selected
      if (editImage) {
        submissionData.append("image", editImage);
      }

      const response = await fetch(
        `http://localhost:5001/api/listings/${editingListing._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: submissionData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update listing.");
        return;
      }

      setMyListings(prev =>
        prev.map(item =>
          item._id === editingListing._id
            ? { ...item, ...data.listing }
            : item
        )
      );

      setEditingListing(null);
      setEditImage(null);
      setEditImagePreview("");

      alert("Listing updated successfully!");

    } catch (error) {
      console.error(error);
      alert("Something went wrong while updating the listing.");
    } finally {
      setSaving(false);
    }
  };

  // CANCEL EDITING
  const cancelEdit = () => {
    if (editImagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(editImagePreview);
    }

    setEditingListing(null);
    setEditImage(null);
    setEditImagePreview("");
  };

  // DELETE LISTING
  const deleteListing = async (listingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this listing?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5001/api/listings/${listingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete listing.");
        return;
      }

      setMyListings(prev =>
        prev.filter(item => item._id !== listingId)
      );

      if (editingListing?._id === listingId) {
        cancelEdit();
      }

      alert("Listing deleted successfully!");

    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  // LISTING STATISTICS
  const activeListings = myListings.filter(
    item => item.status === "Available"
  );

  const soldListings = myListings.filter(
    item => item.status === "Sold"
  );

  // OVERVIEW TAB
  const renderOverview = () => (
    <>
      <h2>Dashboard Overview</h2>

      <p className="profile-description">
        Welcome back, {user?.name || "Student"}!
      </p>

      <div className="profile-stats">
        <div className="profile-stat-card">
          <span>My Listings</span>
          <h3>{myListings.length}</h3>
        </div>

        <div className="profile-stat-card">
          <span>Active Listings</span>
          <h3>{activeListings.length}</h3>
        </div>

        <div className="profile-stat-card">
          <span>Sold Items</span>
          <h3>{soldListings.length}</h3>
        </div>
      </div>

      <div className="profile-section-card">
        <h3>Account Information</h3>

        <div className="profile-info-row">
          <span>Name</span>
          <strong>{user?.name || "Not available"}</strong>
        </div>

        <div className="profile-info-row">
          <span>Email</span>
          <strong>{user?.email || "Not available"}</strong>
        </div>
      </div>

      <div className="profile-section-card">
        <h3>Quick Actions</h3>

        <div className="profile-quick-actions">
          <Link to="/marketplace">Browse Marketplace</Link>
          <Link to="/list-item">List an Item</Link>
          <Link to="/settings">Account Settings</Link>
        </div>
      </div>
    </>
  );

  // BUYER DASHBOARD
  const renderBuyer = () => (
    <>
      <h2>Buyer Dashboard</h2>

      <p className="profile-description">
        Manage your shopping activity on CampusLoop.
      </p>

      <div className="profile-section-card">
        <h3>Saved Items</h3>

        <p>You haven't saved any items yet.</p>

        <Link to="/marketplace" className="profile-action-link">
          Explore Marketplace →
        </Link>
      </div>

      <div className="profile-section-card">
        <h3>My Enquiries</h3>

        <p>Your seller enquiries will appear here.</p>

        <p className="profile-muted">
          Enquiry tracking is coming soon.
        </p>
      </div>
    </>
  );

  // EDIT LISTING FORM
  const renderEditForm = () => (
    editingListing && (
      <div className="profile-section-card edit-listing-form">
        <h3>Edit Listing</h3>

        <form onSubmit={saveEditedListing}>
          <label>Item Name</label>

          <input
            type="text"
            name="itemName"
            value={editForm.itemName}
            onChange={handleEditChange}
            required
          />

          <label>Category</label>

          <select
            name="category"
            value={editForm.category}
            onChange={handleEditChange}
            required
          >
            <option value="Electronics">Electronics</option>
            <option value="Books">Books</option>
            <option value="Study Materials">Study Materials</option>
            <option value="Accessories">Accessories</option>
            <option value="Others">Others</option>
          </select>

          <label>Listing Type</label>

          <select
            name="listingType"
            value={editForm.listingType}
            onChange={handleEditChange}
            required
          >
            <option value="Sell">Sell</option>
            <option value="Rent">Rent</option>
            <option value="Borrow">Borrow</option>
            <option value="Swap">Swap</option>
          </select>

          <label>Price (₹)</label>

          <input
            type="number"
            name="price"
            value={editForm.price}
            onChange={handleEditChange}
            min="0"
            required
          />

          <label>Condition</label>

          <select
            name="condition"
            value={editForm.condition}
            onChange={handleEditChange}
            required
          >
            <option value="New">New</option>
            <option value="Like New">Like New</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>

          <label>Description</label>

          <textarea
            name="description"
            value={editForm.description}
            onChange={handleEditChange}
            required
          />

          {/* IMAGE REPLACEMENT */}
          <label>Update Item Image</label>

          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleEditImageChange}
          />

          <small>JPG, PNG or WEBP. Maximum size: 5 MB.</small>

          {editImagePreview && (
            <div className="image-preview">
              <img
                src={editImagePreview}
                alt="Item preview"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "contain",
                  borderRadius: "10px"
                }}
              />
            </div>
          )}

          <div className="edit-form-actions">
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={cancelEdit}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  );

  // SELLER DASHBOARD
  const renderSeller = () => (
    <>
      <h2>Seller Dashboard</h2>

      <p className="profile-description">
        Manage everything you have listed on CampusLoop.
      </p>

      <div className="profile-stats">
        <div className="profile-stat-card">
          <span>Total Listings</span>
          <h3>{myListings.length}</h3>
        </div>

        <div className="profile-stat-card">
          <span>Available</span>
          <h3>{activeListings.length}</h3>
        </div>

        <div className="profile-stat-card">
          <span>Sold</span>
          <h3>{soldListings.length}</h3>
        </div>
      </div>

      <div className="profile-listing-heading">
        <h3>My Items</h3>

        <Link to="/list-item">+ Add New Item</Link>
      </div>

      {renderEditForm()}

      {loading ? (
        <p>Loading your listings...</p>
      ) : myListings.length === 0 ? (
        <div className="profile-section-card">
          <h3>No listings yet</h3>

          <p>
            Start selling, renting or swapping items with other students.
          </p>

          <Link to="/list-item" className="profile-action-link">
            List Your First Item →
          </Link>
        </div>
      ) : (
        <div className="profile-listings-grid">
          {myListings.map(item => (
            <div className="profile-listing-card" key={item._id}>
              <div className="profile-listing-image">
                {item.imageUrl ? (
                  <img
                    src={
                      item.imageUrl.startsWith("http")
                        ? item.imageUrl
                        : `http://localhost:5001${item.imageUrl}`
                    }
                    alt={item.itemName}
                  />
                ) : (
                  <span>📦</span>
                )}
              </div>

              <div className="profile-listing-details">
                <h3>{item.itemName}</h3>

                <p>
                  {item.category} · {item.listingType}
                </p>

                <strong>₹{item.price}</strong>

                <span
                  className={`profile-status ${
                    item.status === "Available"
                      ? "available"
                      : "other"
                  }`}
                >
                  {item.status}
                </span>

                <Link to={`/item/${item._id}`}>
                  View Item →
                </Link>

                <div className="profile-listing-actions">
                  <button onClick={() => handleEdit(item)}>
                    Edit
                  </button>

                  {item.status !== "Sold" && (
                    <button
                      onClick={() => updateStatus(item._id, "Sold")}
                    >
                      Mark as Sold
                    </button>
                  )}

                  {item.status !== "Unavailable" && (
                    <button
                      onClick={() =>
                        updateStatus(item._id, "Unavailable")
                      }
                    >
                      Mark Unavailable
                    </button>
                  )}

                  {item.status !== "Available" && (
                    <button
                      onClick={() =>
                        updateStatus(item._id, "Available")
                      }
                    >
                      Mark Available
                    </button>
                  )}

                  <button
                    className="delete-listing-btn"
                    onClick={() => deleteListing(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className="profile-page">
      <div className="profile-heading">
        <div className="profile-avatar">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>

        <div>
          <h1>{user?.name || "CampusLoop Student"}</h1>
          <p>{user?.email || ""}</p>
          <span>CampusLoop Student Account</span>
        </div>
      </div>

      <div className="profile-dashboard">
        <aside className="profile-sidebar">
          <button
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            👤 Overview
          </button>

          <button
            className={activeTab === "buyer" ? "active" : ""}
            onClick={() => setActiveTab("buyer")}
          >
            🛍️ Buyer Dashboard
          </button>

          <button
            className={activeTab === "seller" ? "active" : ""}
            onClick={() => setActiveTab("seller")}
          >
            🏪 Seller Dashboard
          </button>
        </aside>

        <main className="profile-content">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "buyer" && renderBuyer()}
          {activeTab === "seller" && renderSeller()}
        </main>
      </div>
    </div>
  );
}

export default Profile;
