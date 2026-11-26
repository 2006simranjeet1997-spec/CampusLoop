
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_URL } from "../config";

function ItemDetails() {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);

  // SWAP STATES
  const [showSwapForm, setShowSwapForm] = useState(false);
  const [mySwapListings, setMySwapListings] = useState([]);
  const [selectedListingId, setSelectedListingId] = useState("");
  const [swapLoading, setSwapLoading] = useState(false);
  const [fetchingMyListings, setFetchingMyListings] = useState(false);

  // Fetch item from MongoDB
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/listings/${id}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Item not found.");
        }

        setItem(data.listing);

      } catch (err) {
        console.error("Item details error:", err);
        setError(err.message || "Unable to load item.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  // Send purchase request
  const handlePurchaseRequest = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first to contact the seller.");
      return;
    }

    try {
      setRequestLoading(true);

      const response = await fetch(
        `${API_URL}/api/purchase-requests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            listingId: id,
            message: "",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to send purchase request."
        );
      }

      alert("Purchase request sent successfully!");

    } catch (err) {
      console.error("Purchase request error:", err);
      alert(err.message || "Unable to send purchase request.");
    } finally {
      setRequestLoading(false);
    }
  };

  // Open swap form and fetch user's listings
  const handleOpenSwapForm = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first to make a swap offer.");
      return;
    }

    setShowSwapForm(true);
    setFetchingMyListings(true);
    setSelectedListingId("");

    try {
      const response = await fetch(
        `${API_URL}/api/listings/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to fetch your listings."
        );
      }

      const availableSwapListings = (data.listings || []).filter(
        (listing) =>
          listing.listingType === "Swap" &&
          listing.status === "Available" &&
          listing._id !== id
      );

      setMySwapListings(availableSwapListings);

    } catch (err) {
      console.error("Fetch my swap listings error:", err);
      alert(err.message || "Unable to load your swap listings.");
      setShowSwapForm(false);
    } finally {
      setFetchingMyListings(false);
    }
  };

  // Send swap offer
  const handleSendSwapOffer = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    if (!selectedListingId) {
      alert("Please select an item to offer.");
      return;
    }

    try {
      setSwapLoading(true);

      const response = await fetch(
        `${API_URL}/api/swaps`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            requestedListingId: id,
            offeredListingId: selectedListingId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to send swap offer."
        );
      }

      alert("Your swap offer has been sent successfully!");

      setShowSwapForm(false);
      setSelectedListingId("");

    } catch (err) {
      console.error("Send swap offer error:", err);
      alert(err.message || "Unable to send swap offer.");
    } finally {
      setSwapLoading(false);
    }
  };

  // Selected listing details
  const selectedListing = mySwapListings.find(
    (listing) => listing._id === selectedListingId
  );

  // Calculate price difference
  const requestedPrice = Number(item?.price || 0);
  const offeredPrice = Number(selectedListing?.price || 0);

  const priceDifference = Math.abs(
    requestedPrice - offeredPrice
  );

  // Category emoji
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

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading item details...</h2>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="page-container">
        <h2>Item not found</h2>
        <p>{error}</p>
        <Link to="/marketplace">Back to Marketplace</Link>
      </div>
    );
  }

  return (
    <main className="item-details-page">

      <Link to="/marketplace" className="back-link">
        ← Back to Marketplace
      </Link>

      <div className="details-container">

        <div className="details-image">
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
            getEmoji(item.category)
          )}
        </div>

        <div className="details-info">

          <span className="section-label">
            {item.category}
          </span>

          <h1>{item.itemName}</h1>

          <span className="details-type">
            {item.listingType}
          </span>

          <h2>
            {item.listingType === "Swap"
              ? "Exchange"
              : item.price === 0
              ? "Price on request"
              : `₹${item.price}`}
          </h2>

          <div className="details-divider"></div>

          <h3>About this item</h3>

          <p>{item.description}</p>

          <p>
            <strong>Condition:</strong> {item.condition}
          </p>

          <div className="seller-box">

            <div className="seller-avatar">
              {item.seller?.name?.charAt(0).toUpperCase() || "S"}
            </div>

            <div>
              <h4>{item.seller?.name || "CampusLoop Student"}</h4>
              <p>Student Seller</p>
            </div>

          </div>

          {item.listingType === "Swap" ? (
            <button
              className="contact-seller-btn"
              onClick={handleOpenSwapForm}
            >
              Offer an Item to Swap
            </button>
          ) : (
            <button
              className="contact-seller-btn"
              onClick={handlePurchaseRequest}
              disabled={requestLoading}
            >
              {requestLoading
                ? "Sending Request..."
                : "Contact Seller"}
            </button>
          )}

        </div>

      </div>

      {/* SWAP OFFER MODAL */}
      {showSwapForm && (
        <div
          onClick={() => setShowSwapForm(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              color: "#222",
              padding: "28px",
              borderRadius: "14px",
              width: "100%",
              maxWidth: "480px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
          >

            <h2 style={{ marginTop: 0 }}>
              Offer an Item to Swap
            </h2>

            <p style={{ color: "#666" }}>
              Choose one of your available Swap listings to
              offer in exchange for <strong>{item.itemName}</strong>.
            </p>

            {fetchingMyListings ? (
              <p>Loading your available items...</p>
            ) : mySwapListings.length === 0 ? (
              <div>
                <p>
                  You don't have any available Swap listings yet.
                </p>

                <Link to="/list-item">
                  List an item for Swap
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSendSwapOffer}>

                <label
                  htmlFor="swapListing"
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                  }}
                >
                  Select your item
                </label>

                <select
                  id="swapListing"
                  value={selectedListingId}
                  onChange={(e) =>
                    setSelectedListingId(e.target.value)
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    marginBottom: "18px",
                  }}
                >
                  <option value="">
                    Choose an item
                  </option>

                  {mySwapListings.map((listing) => (
                    <option
                      key={listing._id}
                      value={listing._id}
                    >
                      {listing.itemName} - ₹{listing.price}
                    </option>
                  ))}
                </select>

                {selectedListing && (
                  <div
                    style={{
                      background: "#f5f7fa",
                      padding: "16px",
                      borderRadius: "10px",
                      marginBottom: "18px",
                    }}
                  >
                    <h4 style={{ marginTop: 0 }}>
                      Your Swap Offer
                    </h4>

                    <p>
                      <strong>Your item:</strong>{" "}
                      {selectedListing.itemName}
                    </p>

                    <p>
                      <strong>Your item's value:</strong>{" "}
                      ₹{offeredPrice}
                    </p>

                    <p>
                      <strong>Requested item:</strong>{" "}
                      {item.itemName}
                    </p>

                    <p>
                      <strong>Requested item's value:</strong>{" "}
                      ₹{requestedPrice}
                    </p>

                    <div
                      style={{
                        borderTop: "1px solid #ddd",
                        paddingTop: "12px",
                        marginTop: "12px",
                      }}
                    >
                      {priceDifference === 0 ? (
                        <p style={{ color: "green", fontWeight: "600" }}>
                          Equal value exchange. No additional payment!
                        </p>
                      ) : offeredPrice < requestedPrice ? (
                        <p style={{ color: "#b45309", fontWeight: "600" }}>
                          You may need to pay ₹{priceDifference} extra.
                        </p>
                      ) : (
                        <p style={{ color: "green", fontWeight: "600" }}>
                          The other user may need to pay you ₹{priceDifference} extra.
                        </p>
                      )}
                    </div>

                    <small style={{ color: "#777" }}>
                      Final payment details will be handled after
                      the seller accepts your offer.
                    </small>
                  </div>
                )}

                <button
                  type="submit"
                  className="contact-seller-btn"
                  disabled={swapLoading || !selectedListingId}
                  style={{
                    width: "100%",
                    marginBottom: "10px",
                  }}
                >
                  {swapLoading
                    ? "Sending Offer..."
                    : "Send Swap Offer"}
                </button>

              </form>
            )}

            <button
              type="button"
              onClick={() => setShowSwapForm(false)}
              style={{
                width: "100%",
                padding: "11px",
                background: "#eee",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                marginTop: "8px",
              }}
            >
              Close
            </button>

          </div>
        </div>
      )}

    </main>
  );
}

export default ItemDetails;
