
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import "./Profile.css";

const API = `${API_URL}/api`;

function Profile() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [openingChat, setOpeningChat] = useState(null);

  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // BUYER PURCHASE REQUESTS
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  // SELLER PURCHASE REQUESTS
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [receivedLoading, setReceivedLoading] = useState(false);
  const [processingRequest, setProcessingRequest] = useState(null);

  // SWAP OFFERS
  const [receivedSwapOffers, setReceivedSwapOffers] = useState([]);
  const [mySwapOffers, setMySwapOffers] = useState([]);
  const [swapOffersLoading, setSwapOffersLoading] = useState(false);
  const [processingSwapOffer, setProcessingSwapOffer] = useState(null);

  // TRANSACTIONS
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [processingTransaction, setProcessingTransaction] = useState(null);

  // WISHLIST
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [removingWishlistItem, setRemovingWishlistItem] = useState(null);

  // LISTING EDITING
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

  // IMAGE EDITING
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const currentUserId = String(user?._id || user?.id || "");

  // COMMON AUTH HEADERS
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`
  });

  // HELPER: GET ID FROM POPULATED OR UNPOPULATED FIELD
  const getId = value => String(value?._id || value || "");

  // OPEN OR CREATE PURCHASE CHAT
  const handleOpenPurchaseChat = async requestId => {
    try {
      setOpeningChat(requestId);

      const response = await fetch(
        `${API}/chat/purchase/${requestId}`,
        {
          method: "POST",
          headers: getAuthHeaders()
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not open chat.");
      }

      navigate("/chat");
    } catch (error) {
      console.error("Error opening purchase chat:", error);
      alert(error.message || "Could not open chat.");
    } finally {
      setOpeningChat(null);
    }
  };

  // FETCH MY LISTINGS
  const fetchMyListings = async () => {
    try {
      const response = await fetch(`${API}/listings/my`, {
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch listings.");
      }

      setMyListings(data.listings || []);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  // FETCH BUYER PURCHASE REQUESTS
  const fetchPurchaseRequests = async () => {
    try {
      setRequestsLoading(true);

      const response = await fetch(`${API}/purchase-requests/my`, {
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch requests.");
      }

      setPurchaseRequests(data.requests || []);
    } catch (error) {
      console.error("Error fetching purchase requests:", error);
    } finally {
      setRequestsLoading(false);
    }
  };

  // FETCH SELLER PURCHASE REQUESTS
  const fetchReceivedRequests = async () => {
    try {
      setReceivedLoading(true);

      const response = await fetch(`${API}/purchase-requests/received`, {
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch received requests."
        );
      }

      setReceivedRequests(data.requests || []);
    } catch (error) {
      console.error("Error fetching received requests:", error);
    } finally {
      setReceivedLoading(false);
    }
  };

  // FETCH RECEIVED SWAP OFFERS
  const fetchReceivedSwapOffers = async () => {
    try {
      const response = await fetch(`${API}/swaps/received`, {
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch received swap offers.");
      }

      setReceivedSwapOffers(data.offers || []);
    } catch (error) {
      console.error("Error fetching received swap offers:", error);
    }
  };

  // FETCH MY OUTGOING SWAP OFFERS
  const fetchMySwapOffers = async () => {
    try {
      const response = await fetch(`${API}/swaps/my`, {
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch your swap offers.");
      }

      setMySwapOffers(data.offers || []);
    } catch (error) {
      console.error("Error fetching outgoing swap offers:", error);
    }
  };

  // REFRESH BOTH SWAP OFFER LISTS
  const refreshSwapOffers = async () => {
    setSwapOffersLoading(true);

    try {
      await Promise.all([
        fetchReceivedSwapOffers(),
        fetchMySwapOffers()
      ]);
    } finally {
      setSwapOffersLoading(false);
    }
  };

  // FETCH TRANSACTIONS
  const fetchTransactions = async () => {
    try {
      setTransactionsLoading(true);

      const response = await fetch(`${API}/transactions/my`, {
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch transactions.");
      }

      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setTransactionsLoading(false);
    }
  };

  // FETCH WISHLIST
  const fetchWishlist = async () => {
    try {
      setWishlistLoading(true);

      const response = await fetch(`${API}/users/wishlist`, {
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch wishlist.");
      }

      setWishlist(data.wishlist || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  // INITIAL DATA FETCH
  useEffect(() => {
    fetchMyListings();
    fetchPurchaseRequests();
    fetchReceivedRequests();
    refreshSwapOffers();
    fetchTransactions();

    if (token) {
      fetchWishlist();
    }
  }, []);

  // REFRESH ALL SWAP-RELATED DATA AFTER AN ACTION
  const refreshAfterSwapAction = async () => {
    await Promise.all([
      refreshSwapOffers(),
      fetchMyListings()
    ]);
  };

  // REMOVE ITEM FROM WISHLIST
  const handleRemoveWishlist = async listingId => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this item from your wishlist?"
    );

    if (!confirmed) return;

    try {
      setRemovingWishlistItem(listingId);

      const response = await fetch(
        `${API}/users/wishlist/${listingId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders()
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to remove wishlist item.");
      }

      setWishlist(prev =>
        prev.filter(item => item._id !== listingId)
      );

      alert("Item removed from your wishlist!");
    } catch (error) {
      console.error("Error removing wishlist item:", error);
      alert(error.message || "Something went wrong.");
    } finally {
      setRemovingWishlistItem(null);
    }
  };

  // SELLER: ACCEPT OR REJECT PURCHASE REQUEST
  const handleRequestAction = async (requestId, status) => {
    const action = status === "Accepted" ? "accept" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this purchase request?`
    );

    if (!confirmed) return;

    try {
      setProcessingRequest(requestId);

      const response = await fetch(
        `${API}/purchase-requests/${requestId}`,
        {
          method: "PATCH",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update purchase request.");
        return;
      }

      setReceivedRequests(prev =>
        prev.map(request =>
          request._id === requestId
            ? { ...request, status }
            : request
        )
      );

      if (status === "Accepted") {
        const acceptedRequest = receivedRequests.find(
          request => request._id === requestId
        );

        const listingId = acceptedRequest?.listing?._id;

        if (listingId) {
          setMyListings(prev =>
            prev.map(item =>
              item._id === listingId
                ? { ...item, status: "Reserved" }
                : item
            )
          );

          setReceivedRequests(prev =>
            prev.map(request =>
              request.listing?._id === listingId &&
              request.status === "Pending"
                ? { ...request, status: "Rejected" }
                : request
            )
          );
        }
      }

      await fetchReceivedRequests();
      await fetchMyListings();

      alert(data.message || `Request ${status.toLowerCase()} successfully!`);
    } catch (error) {
      console.error("Error updating purchase request:", error);
      alert("Something went wrong while updating the request.");
    } finally {
      setProcessingRequest(null);
    }
  };

  // SELLER: ACCEPT OR REJECT SWAP OFFER
  const handleSwapOfferAction = async (offerId, status) => {
    const action = status === "Accepted" ? "accept" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this swap offer?`
    );

    if (!confirmed) return;

    try {
      setProcessingSwapOffer(offerId);

      const response = await fetch(`${API}/swaps/${offerId}`, {
        method: "PATCH",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update swap offer.");
      }

      await refreshAfterSwapAction();

      alert(
        data.message ||
        `Swap offer ${status.toLowerCase()} successfully!`
      );
    } catch (error) {
      console.error("Error updating swap offer:", error);
      alert(error.message || "Something went wrong.");
    } finally {
      setProcessingSwapOffer(null);
    }
  };

  // SWAP: SELECT PAYMENT METHOD
  const handleSelectSwapPayment = async (offerId, paymentMethod) => {
    const confirmed = window.confirm(
      `Select ${paymentMethod} for the additional swap payment?`
    );

    if (!confirmed) return;

    try {
      setProcessingSwapOffer(offerId);

      const response = await fetch(
        `${API}/swaps/${offerId}/payment-method`,
        {
          method: "PATCH",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ paymentMethod })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not select payment method.");
      }

      await refreshSwapOffers();

      alert(data.message || "Payment method selected successfully.");
    } catch (error) {
      console.error("Swap payment method error:", error);
      alert(error.message || "Something went wrong.");
    } finally {
      setProcessingSwapOffer(null);
    }
  };

  // SWAP: SIMULATE DEMO ONLINE PAYMENT
  const handleSwapDemoPayment = async offerId => {
    const confirmed = window.confirm(
      "Simulate a successful demo payment for the price difference?"
    );

    if (!confirmed) return;

    try {
      setProcessingSwapOffer(offerId);

      const response = await fetch(
        `${API}/swaps/${offerId}/demo-payment`,
        {
          method: "POST",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ outcome: "success" })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Demo payment failed.");
      }

      await refreshSwapOffers();

      alert(data.message || "Demo swap payment successful!");
    } catch (error) {
      console.error("Swap demo payment error:", error);
      alert(error.message || "Something went wrong.");
    } finally {
      setProcessingSwapOffer(null);
    }
  };

  // SWAP: CONFIRM CASH RECEIVED FOR COD
  const handleConfirmSwapCOD = async offerId => {
    const confirmed = window.confirm(
      "Have you received the additional cash payment from the other user?"
    );

    if (!confirmed) return;

    try {
      setProcessingSwapOffer(offerId);

      const response = await fetch(
        `${API}/swaps/${offerId}/confirm-cod`,
        {
          method: "PATCH",
          headers: getAuthHeaders()
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not confirm COD payment.");
      }

      await refreshSwapOffers();

      alert(data.message || "Cash payment confirmed!");
    } catch (error) {
      console.error("Swap COD confirmation error:", error);
      alert(error.message || "Something went wrong.");
    } finally {
      setProcessingSwapOffer(null);
    }
  };

  // SWAP: CONFIRM PHYSICAL ITEM HANDOVER
  const handleConfirmSwapHandover = async offerId => {
    const confirmed = window.confirm(
      "Confirm that you have physically handed over or received your swap item?"
    );

    if (!confirmed) return;

    try {
      setProcessingSwapOffer(offerId);

      const response = await fetch(
        `${API}/swaps/${offerId}/confirm-handover`,
        {
          method: "PATCH",
          headers: getAuthHeaders()
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not confirm item handover.");
      }

      await refreshAfterSwapAction();

      alert(data.message || "Handover confirmation saved.");
    } catch (error) {
      console.error("Swap handover error:", error);
      alert(error.message || "Something went wrong.");
    } finally {
      setProcessingSwapOffer(null);
    }
  };

  // BUYER: CANCEL PURCHASE REQUEST
  const handleCancelRequest = async requestId => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this purchase request?"
    );

    if (!confirmed) return;

    try {
      setProcessingRequest(requestId);

      const response = await fetch(
        `${API}/purchase-requests/${requestId}/cancel`,
        {
          method: "PATCH",
          headers: getAuthHeaders()
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to cancel purchase request.");
        return;
      }

      setPurchaseRequests(prev =>
        prev.map(request =>
          request._id === requestId
            ? { ...request, status: "Cancelled" }
            : request
        )
      );

      alert(data.message || "Purchase request cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling purchase request:", error);
      alert("Something went wrong while cancelling the request.");
    } finally {
      setProcessingRequest(null);
    }
  };

  // BUYER: CREATE TRANSACTION
  const createTransaction = async (requestId, paymentMethod) => {
    try {
      setProcessingTransaction(requestId);

      const response = await fetch(`${API}/transactions`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          purchaseRequestId: requestId,
          paymentMethod
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Could not create transaction.");
        return;
      }

      await fetchTransactions();

      alert(
        paymentMethod === "COD"
          ? "Cash on Delivery selected successfully!"
          : "Demo payment created successfully!"
      );
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("Something went wrong while creating the transaction.");
    } finally {
      setProcessingTransaction(null);
    }
  };

  // BUYER: SIMULATE DEMO ONLINE PAYMENT
  const handleDemoPayment = async (transactionId, outcome = "success") => {
    const message =
      outcome === "success"
        ? "Simulate a successful demo payment?"
        : "Simulate a failed demo payment?";

    if (!window.confirm(message)) return;

    try {
      setProcessingTransaction(transactionId);

      const response = await fetch(
        `${API}/transactions/${transactionId}/demo-payment`,
        {
          method: "PATCH",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ outcome })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Demo payment failed.");
        return;
      }

      await fetchTransactions();

      alert(
        outcome === "success"
          ? "Demo payment successful!"
          : "Demo payment failed. You can retry it."
      );
    } catch (error) {
      console.error("Error processing demo payment:", error);
      alert("Something went wrong during demo payment.");
    } finally {
      setProcessingTransaction(null);
    }
  };

  // SELLER: CONFIRM COD PAYMENT
  const handleConfirmCOD = async transactionId => {
    const confirmed = window.confirm(
      "Have you received the cash from the buyer?"
    );

    if (!confirmed) return;

    try {
      setProcessingTransaction(transactionId);

      const response = await fetch(
        `${API}/transactions/${transactionId}/confirm-cod`,
        {
          method: "PATCH",
          headers: getAuthHeaders()
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Could not confirm COD payment.");
        return;
      }

      await fetchTransactions();

      alert(data.message || "COD payment confirmed!");
    } catch (error) {
      console.error("Error confirming COD:", error);
      alert("Something went wrong while confirming COD.");
    } finally {
      setProcessingTransaction(null);
    }
  };

  // SELLER: COMPLETE TRANSACTION
  const handleCompleteTransaction = async transactionId => {
    const confirmed = window.confirm(
      "Confirm that the item has been handed over to the buyer?"
    );

    if (!confirmed) return;

    try {
      setProcessingTransaction(transactionId);

      const response = await fetch(
        `${API}/transactions/${transactionId}/complete`,
        {
          method: "PATCH",
          headers: getAuthHeaders()
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Could not complete transaction.");
        return;
      }

      await fetchTransactions();
      await fetchMyListings();
      await fetchReceivedRequests();
      await fetchPurchaseRequests();

      alert(data.message || "Transaction completed successfully!");
    } catch (error) {
      console.error("Error completing transaction:", error);
      alert("Something went wrong while completing the transaction.");
    } finally {
      setProcessingTransaction(null);
    }
  };

  // UPDATE LISTING STATUS
  const updateStatus = async (listingId, status) => {
    try {
      const response = await fetch(
        `${API}/listings/${listingId}/status`,
        {
          method: "PATCH",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json"
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

      alert(data.message || "Listing updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  // OPEN EDIT FORM
  const handleEdit = item => {
    if (item.status === "Reserved" || item.status === "Swapped") {
      alert("This item is reserved or already swapped and cannot be edited.");
      return;
    }

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
          : `${API_URL}${item.imageUrl}`
        : ""
    );
  };

  // HANDLE EDIT INPUTS
  const handleEditChange = e => {
    const { name, value } = e.target;

    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // HANDLE EDIT IMAGE
  const handleEditImageChange = e => {
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
  const saveEditedListing = async e => {
    e.preventDefault();

    if (!editingListing || saving) return;

    setSaving(true);

    try {
      const submissionData = new FormData();

      Object.entries(editForm).forEach(([key, value]) => {
        submissionData.append(
          key,
          key === "price" ? Number(value) : value
        );
      });

      if (editImage) {
        submissionData.append("image", editImage);
      }

      const response = await fetch(
        `${API}/listings/${editingListing._id}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
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
  const deleteListing = async listingId => {
    const item = myListings.find(listing => listing._id === listingId);

    if (
      item?.status === "Reserved" ||
      item?.status === "Swapped"
    ) {
      alert("This item is reserved or already swapped and cannot be deleted.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this listing?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API}/listings/${listingId}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

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

  const reservedListings = myListings.filter(
    item => item.status === "Reserved"
  );

  // TRANSACTION LOOKUP BY PURCHASE REQUEST
  const getTransactionForRequest = requestId => {
    return transactions.find(
      transaction =>
        transaction.purchaseRequest?._id === requestId ||
        transaction.purchaseRequest === requestId
    );
  };

  // FIND ACTIVE SWAP OFFER CONNECTED TO A LISTING
  const getSwapOfferForListing = listingId => {
    const allOffers = [...mySwapOffers, ...receivedSwapOffers];

    return allOffers.find(offer => {
      const isActive =
        offer.status === "Accepted" ||
        offer.status === "Completed";

      const requestedId = getId(offer.requestedListing);
      const offeredId = getId(offer.offeredListing);

      return (
        isActive &&
        (
          requestedId === String(listingId) ||
          offeredId === String(listingId)
        )
      );
    });
  };

  // FILTER SELLER TRANSACTIONS
  const sellerTransactions = transactions.filter(transaction => {
    const sellerId = transaction.seller?._id || transaction.seller;
    const sellerEmail = transaction.seller?.email;

    return (
      (user?._id && sellerId === user._id) ||
      (user?.email && sellerEmail === user.email)
    );
  });

  // RENDER SWAP PAYMENT AND HANDOVER SECTION
  const renderSwapProgress = offer => {
    const payerId = getId(offer.paymentDueFrom);
    const offeredById = getId(offer.offeredBy);
    const listingOwnerId = getId(offer.listingOwner);

    const isPayer = currentUserId === payerId;

    const isOfferedBy = currentUserId === offeredById;
    const isListingOwner = currentUserId === listingOwnerId;

    const isParticipant = isOfferedBy || isListingOwner;

    const paymentReceiverId =
      payerId === offeredById
        ? listingOwnerId
        : offeredById;

    const isPaymentReceiver =
      currentUserId === paymentReceiverId;

    const isProcessing = processingSwapOffer === offer._id;

    if (
      offer.status !== "Accepted" &&
      offer.status !== "Completed"
    ) {
      return null;
    }

    return (
      <div className="transaction-panel swap-progress-panel">
        <h4>Swap Payment & Handover</h4>

        <div className="transaction-info">
          <p>
            <strong>Price Difference:</strong>{" "}
            ₹{offer.priceDifference || 0}
          </p>

          <p>
            <strong>Payment Status:</strong>{" "}
            <span
              className={`transaction-status ${
                (offer.paymentStatus || "Pending").toLowerCase()
              }`}
            >
              {offer.paymentStatus}
            </span>
          </p>

          {offer.priceDifference > 0 && (
            <>
              <p>
                <strong>Payment Method:</strong>{" "}
                {offer.paymentMethod || "Not selected"}
              </p>

              <p>
                <strong>Who pays:</strong>{" "}
                {isPayer
                  ? "You are responsible for the price difference."
                  : isPaymentReceiver
                    ? "The other participant must pay you."
                    : "Payment participant information unavailable."}
              </p>
            </>
          )}

          {offer.paymentReference && (
            <p>
              <strong>Payment Reference:</strong>{" "}
              {offer.paymentReference}
            </p>
          )}
        </div>

        {/* NO EXTRA PAYMENT */}
        {offer.paymentStatus === "NotRequired" && (
          <p className="transaction-success">
            Equal-value exchange. No additional payment is required.
          </p>
        )}

        {/* PAYER SELECTS PAYMENT METHOD */}
        {offer.paymentStatus === "Pending" &&
          !offer.paymentMethod &&
          isPayer && (
            <div className="transaction-actions">
              <p>
                Select how you want to pay ₹{offer.priceDifference}.
              </p>

              <button
                onClick={() =>
                  handleSelectSwapPayment(offer._id, "Demo Online")
                }
                disabled={isProcessing}
              >
                {isProcessing
                  ? "Please wait..."
                  : "Demo Online Payment"}
              </button>

              <button
                className="secondary-payment-btn"
                onClick={() =>
                  handleSelectSwapPayment(offer._id, "COD")
                }
                disabled={isProcessing}
              >
                Cash on Delivery
              </button>

              <small>
                Demo Online is simulated for project testing. It does not
                transfer real money.
              </small>
            </div>
          )}

        {/* DEMO ONLINE PAYMENT */}
        {offer.paymentStatus === "Pending" &&
          offer.paymentMethod === "Demo Online" &&
          isPayer && (
            <div className="transaction-actions">
              <p>
                Complete the demo payment of ₹{offer.priceDifference}.
              </p>

              <button
                onClick={() => handleSwapDemoPayment(offer._id)}
                disabled={isProcessing}
              >
                {isProcessing
                  ? "Processing..."
                  : "Complete Demo Payment"}
              </button>
            </div>
          )}

        {offer.paymentStatus === "Pending" &&
          offer.paymentMethod === "Demo Online" &&
          !isPayer && (
            <p className="transaction-note">
              Waiting for the other participant to complete the demo payment.
            </p>
          )}

        {/* COD PAYMENT */}
        {offer.paymentStatus === "Pending" &&
          offer.paymentMethod === "COD" &&
          isPayer && (
            <p className="transaction-note">
              Please pay ₹{offer.priceDifference} in cash to the other
              participant during the exchange. They must confirm receipt.
            </p>
          )}

        {offer.paymentStatus === "Pending" &&
          offer.paymentMethod === "COD" &&
          isPaymentReceiver && (
            <div className="transaction-actions">
              <p>
                Confirm only after you have actually received ₹
                {offer.priceDifference} in cash.
              </p>

              <button
                onClick={() => handleConfirmSwapCOD(offer._id)}
                disabled={isProcessing}
              >
                {isProcessing
                  ? "Confirming..."
                  : "Confirm Cash Received"}
              </button>
            </div>
          )}

        {/* PAYMENT COMPLETED */}
        {offer.paymentStatus === "Paid" && (
          <p className="transaction-success">
            Additional payment has been completed.
          </p>
        )}

        {/* HANDOVER CONFIRMATION */}
        {(offer.paymentStatus === "NotRequired" ||
          offer.paymentStatus === "Paid") &&
          isParticipant && (
            <div className="transaction-actions">
              <h4>Confirm Item Handover</h4>

              <p>
                Both participants must confirm that the physical items have
                been exchanged.
              </p>

              {offer.status === "Completed" ? (
                <p className="transaction-success">
                  Exchange completed! Both listings are now marked as Swapped.
                </p>
              ) : (
                <>
                  <p>
                    <strong>Your confirmation:</strong>{" "}
                    {(isOfferedBy && offer.offeredByConfirmed) ||
                    (isListingOwner && offer.listingOwnerConfirmed)
                      ? "Confirmed"
                      : "Waiting for your confirmation"}
                  </p>

                  <p>
                    <strong>Other participant:</strong>{" "}
                    {(isOfferedBy && offer.listingOwnerConfirmed) ||
                    (isListingOwner && offer.offeredByConfirmed)
                      ? "Confirmed"
                      : "Waiting for confirmation"}
                  </p>

                  {!(
                    (isOfferedBy && offer.offeredByConfirmed) ||
                    (isListingOwner && offer.listingOwnerConfirmed)
                  ) ? (
                    <button
                      onClick={() =>
                        handleConfirmSwapHandover(offer._id)
                      }
                      disabled={isProcessing}
                    >
                      {isProcessing
                        ? "Confirming..."
                        : "Confirm Item Handover"}
                    </button>
                  ) : (
                    <p className="transaction-note">
                      Your handover is confirmed. Waiting for the other
                      participant.
                    </p>
                  )}
                </>
              )}
            </div>
          )}
      </div>
    );
  };

  // RENDER A SWAP OFFER CARD
  const renderSwapOfferCard = (offer, offerType) => {
    const offeredItem = offer.offeredListing;
    const requestedItem = offer.requestedListing;

    const isOutgoing = offerType === "outgoing";

    const otherUser = isOutgoing
      ? offer.listingOwner
      : offer.offeredBy;

    const payerId = getId(offer.paymentDueFrom);
    const offeredById = getId(offer.offeredBy);

    return (
      <div className="buyer-request-card" key={offer._id}>
        <div className="request-main-content">
          <h4>
            {isOutgoing ? "Your offer for: " : "Swap offer for: "}
            {requestedItem?.itemName || "Item unavailable"}
          </h4>

          <p>
            {isOutgoing ? "Listing owner: " : "Offered by: "}
            {otherUser?.name || "Unknown student"}
          </p>

          <p>
            {isOutgoing ? "Your offered item: " : "Their offered item: "}
            {offeredItem?.itemName || "Item unavailable"}
          </p>

          <p>
            Requested item's estimated value: ₹
            {offer.requestedPrice}
          </p>

          <p>
            Offered item's estimated value: ₹
            {offer.offeredPrice}
          </p>

          {offer.priceDifference > 0 ? (
            <>
              <p>
                <strong>
                  Price difference: ₹{offer.priceDifference}
                </strong>
              </p>

              <p>
                {payerId === offeredById
                  ? isOutgoing
                    ? "You are responsible for paying the difference."
                    : "The person offering the item pays the difference."
                  : isOutgoing
                    ? "The listing owner is responsible for paying the difference."
                    : "You are responsible for paying the difference."}
              </p>
            </>
          ) : (
            <p>
              <strong>
                Equal-value exchange — no extra payment.
              </strong>
            </p>
          )}

          {offeredItem?._id && (
            <p>
              <Link to={`/item/${offeredItem._id}`}>
                View Offered Item →
              </Link>
            </p>
          )}

          {requestedItem?._id && (
            <p>
              <Link to={`/item/${requestedItem._id}`}>
                View Requested Item →
              </Link>
            </p>
          )}

          {/* ONLY LISTING OWNER CAN ACCEPT OR REJECT */}
          {!isOutgoing && offer.status === "Pending" && (
            <div className="profile-listing-actions">
              <button
                onClick={() =>
                  handleSwapOfferAction(offer._id, "Accepted")
                }
                disabled={processingSwapOffer === offer._id}
              >
                {processingSwapOffer === offer._id
                  ? "Processing..."
                  : "Accept Swap"}
              </button>

              <button
                onClick={() =>
                  handleSwapOfferAction(offer._id, "Rejected")
                }
                disabled={processingSwapOffer === offer._id}
              >
                Reject
              </button>
            </div>
          )}

          {/* PAYMENT AND HANDOVER FOR BOTH PARTICIPANTS */}
          {renderSwapProgress(offer)}
        </div>

        <span
          className={`profile-status ${
            offer.status === "Accepted" ||
            offer.status === "Completed"
              ? "available"
              : "other"
          }`}
        >
          {offer.status}
        </span>
      </div>
    );
  };

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

      <div className="profile-section-card">
        <h3>Marketplace Activity</h3>

        <div className="profile-info-row">
          <span>Reserved Listings</span>
          <strong>{reservedListings.length}</strong>
        </div>

        <div className="profile-info-row">
          <span>My Transactions</span>
          <strong>{transactions.length}</strong>
        </div>

        <div className="profile-info-row">
          <span>Saved Items</span>
          <strong>{wishlist.length}</strong>
        </div>

        <div className="profile-info-row">
          <span>My Swap Offers</span>
          <strong>
            {mySwapOffers.length + receivedSwapOffers.length}
          </strong>
        </div>
      </div>
    </>
  );

  // WISHLIST TAB
  const renderWishlist = () => (
    <>
      <div className="profile-listing-heading">
        <div>
          <h2>Saved Items ❤️</h2>
          <p className="profile-description">
            Keep track of the items you are interested in.
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={fetchWishlist}
          disabled={wishlistLoading}
        >
          {wishlistLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {wishlistLoading ? (
        <div className="profile-section-card">
          <p>Loading your saved items...</p>
        </div>
      ) : wishlist.length === 0 ? (
        <div className="profile-section-card wishlist-empty">
          <div className="wishlist-empty-icon">♡</div>

          <h3>Your wishlist is empty</h3>

          <p>
            Save items you like from the marketplace and find them here.
          </p>

          <Link to="/marketplace" className="profile-action-link">
            Explore Marketplace →
          </Link>
        </div>
      ) : (
        <>
          <div className="wishlist-results-heading">
            <span>{wishlist.length} saved items</span>
          </div>

          <div className="profile-listings-grid wishlist-grid">
            {wishlist.map(item => {
              if (!item || !item._id) {
                return null;
              }

              return (
                <div
                  className="profile-listing-card wishlist-card"
                  key={item._id}
                >
                  <div className="profile-listing-image">
                    {item.imageUrl ? (
                      <img
                        src={
                          item.imageUrl.startsWith("http")
                            ? item.imageUrl
                            : `${API_URL}${item.imageUrl}`
                        }
                        alt={item.itemName}
                      />
                    ) : (
                      <span>📦</span>
                    )}

                    <span className="wishlist-card-heart">♥</span>
                  </div>

                  <div className="profile-listing-details">
                    <span className="item-category">
                      {item.category}
                    </span>

                    <h3>{item.itemName}</h3>

                    <p>{item.listingType}</p>

                    <strong>
                      {item.listingType === "Swap"
                        ? "Available for swap"
                        : item.price === 0
                          ? "Price on request"
                          : `₹${item.price}`}
                    </strong>

                    <span
                      className={`profile-status ${
                        item.status === "Available"
                          ? "available"
                          : "other"
                      }`}
                    >
                      {item.status || "Status unavailable"}
                    </span>

                    <div className="wishlist-card-actions">
                      <Link to={`/item/${item._id}`}>
                        View Details →
                      </Link>

                      <button
                        className="wishlist-remove-btn"
                        onClick={() => handleRemoveWishlist(item._id)}
                        disabled={removingWishlistItem === item._id}
                      >
                        {removingWishlistItem === item._id
                          ? "Removing..."
                          : "Remove"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );

  // BUYER TRANSACTION CARD
  const renderBuyerTransaction = request => {
    const transaction = getTransactionForRequest(request._id);

    const isProcessing =
      processingTransaction === request._id ||
      processingTransaction === transaction?._id;

    if (
      request.status !== "Accepted" &&
      request.status !== "Completed"
    ) {
      return null;
    }

    if (!transaction) {
      return (
        <div className="transaction-panel">
          <h4>Continue with your purchase</h4>

          <p>
            Your request has been accepted. Choose how you want to pay.
          </p>

          <div className="transaction-actions">
            <button
              onClick={() =>
                createTransaction(request._id, "Demo Online")
              }
              disabled={isProcessing}
            >
              {isProcessing ? "Please wait..." : "Demo Online Payment"}
            </button>

            <button
              className="secondary-payment-btn"
              onClick={() => createTransaction(request._id, "COD")}
              disabled={isProcessing}
            >
              Cash on Delivery
            </button>
          </div>

          <small>
            Demo payment is for project testing only. No real money is
            transferred.
          </small>
        </div>
      );
    }

    return (
      <div className="transaction-panel">
        <h4>Transaction Details</h4>

        <div className="transaction-info">
          <p>
            <strong>Amount:</strong> ₹{transaction.amount}
          </p>

          <p>
            <strong>Payment Method:</strong> {transaction.paymentMethod}
          </p>

          <p>
            <strong>Payment Status:</strong>{" "}
            <span
              className={`transaction-status ${transaction.paymentStatus.toLowerCase()}`}
            >
              {transaction.paymentStatus}
            </span>
          </p>

          <p>
            <strong>Transaction Status:</strong>{" "}
            {transaction.transactionStatus}
          </p>

          {transaction.paymentReference && (
            <p>
              <strong>Payment Reference:</strong>{" "}
              {transaction.paymentReference}
            </p>
          )}
        </div>

        {transaction.paymentMethod === "Demo Online" &&
          transaction.transactionStatus === "Payment Pending" && (
            <div className="transaction-actions">
              <button
                onClick={() =>
                  handleDemoPayment(transaction._id, "success")
                }
                disabled={isProcessing}
              >
                {isProcessing
                  ? "Processing..."
                  : transaction.paymentStatus === "Failed"
                    ? "Retry Demo Payment"
                    : "Complete Demo Payment"}
              </button>
            </div>
          )}

        {transaction.paymentMethod === "COD" &&
          transaction.paymentStatus === "Pending" && (
            <p className="transaction-note">
              Please pay the seller in cash when you receive the item.
              The seller will confirm the payment.
            </p>
          )}

        {transaction.transactionStatus === "Completed" && (
          <p className="transaction-success">
            Your transaction has been completed successfully.
          </p>
        )}
      </div>
    );
  };

  // BUYER DASHBOARD
  const renderBuyer = () => (
    <>
      <h2>Buyer Dashboard</h2>

      <p className="profile-description">
        Track your purchase requests, payments and shopping activity.
      </p>

      <div className="profile-stats">
        <div className="profile-stat-card">
          <span>Total Requests</span>
          <h3>{purchaseRequests.length}</h3>
        </div>

        <div className="profile-stat-card">
          <span>Pending</span>
          <h3>
            {purchaseRequests.filter(
              request => request.status === "Pending"
            ).length}
          </h3>
        </div>

        <div className="profile-stat-card">
          <span>Accepted</span>
          <h3>
            {purchaseRequests.filter(
              request => request.status === "Accepted"
            ).length}
          </h3>
        </div>
      </div>

      <div className="profile-section-card">
        <div className="profile-listing-heading">
          <h3>My Purchase Requests</h3>

          <button
            className="refresh-button"
            onClick={() => {
              fetchPurchaseRequests();
              fetchTransactions();
            }}
          >
            Refresh
          </button>
        </div>

        {requestsLoading ? (
          <p>Loading your requests...</p>
        ) : purchaseRequests.length === 0 ? (
          <>
            <p>You haven't sent any purchase requests yet.</p>

            <Link to="/marketplace" className="profile-action-link">
              Explore Marketplace →
            </Link>
          </>
        ) : (
          <div className="buyer-requests-list">
            {purchaseRequests.map(request => (
              <div className="buyer-request-card" key={request._id}>
                <div className="request-main-content">
                  <h4>
                    {request.listing?.itemName || "Item unavailable"}
                  </h4>

                  <p>
                    Seller: {request.seller?.name || "Unknown"}
                  </p>

                  <p>
                    {request.message || "No message added."}
                  </p>

                  {request.listing?._id && (
                    <Link to={`/item/${request.listing._id}`}>
                      View Item →
                    </Link>
                  )}

                  {request.status === "Pending" && (
                    <div className="profile-listing-actions">
                      <button
                        onClick={() => handleCancelRequest(request._id)}
                        disabled={processingRequest === request._id}
                      >
                        {processingRequest === request._id
                          ? "Cancelling..."
                          : "Cancel Request"}
                      </button>
                    </div>
                  )}

                  {(request.status === "Accepted" ||
                    request.status === "Completed") && (
                    <>
                      {renderBuyerTransaction(request)}

                      <button
                        className="profile-chat-btn"
                        onClick={() =>
                          handleOpenPurchaseChat(request._id)
                        }
                        disabled={openingChat === request._id}
                      >
                        {openingChat === request._id
                          ? "Opening Chat..."
                          : "💬 Chat with Seller"}
                      </button>
                    </>
                  )}
                </div>

                <span
                  className={`profile-status ${
                    request.status === "Accepted"
                      ? "available"
                      : "other"
                  }`}
                >
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* OUTGOING SWAP OFFERS */}
      <div className="profile-section-card">
        <div className="profile-listing-heading">
          <h3>My Swap Offers 🔄</h3>

          <button
            className="refresh-button"
            onClick={refreshSwapOffers}
            disabled={swapOffersLoading}
          >
            {swapOffersLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {swapOffersLoading ? (
          <p>Loading your swap offers...</p>
        ) : mySwapOffers.length === 0 ? (
          <p>You haven't sent any swap offers yet.</p>
        ) : (
          <div className="buyer-requests-list">
            {mySwapOffers.map(offer =>
              renderSwapOfferCard(offer, "outgoing")
            )}
          </div>
        )}
      </div>

      <Link to="/marketplace" className="profile-action-link">
        Browse More Items →
      </Link>
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

  // SELLER TRANSACTION CARD
  const renderSellerTransaction = transaction => {
    const isProcessing = processingTransaction === transaction._id;

    return (
      <div className="seller-transaction-card" key={transaction._id}>
        <div>
          <h4>
            {transaction.listing?.itemName || "Item"}
          </h4>

          <p>
            Buyer: {transaction.buyer?.name || "Unknown"}
          </p>

          <p>
            Buyer Email: {transaction.buyer?.email || "Not available"}
          </p>

          <p>
            Amount: ₹{transaction.amount}
          </p>

          <p>
            Payment Method: {transaction.paymentMethod}
          </p>

          <p>
            Payment Status:{" "}
            <span
              className={`transaction-status ${transaction.paymentStatus.toLowerCase()}`}
            >
              {transaction.paymentStatus}
            </span>
          </p>

          <p>
            Transaction Status: {transaction.transactionStatus}
          </p>

          {transaction.paymentReference && (
            <p>
              Payment Reference: {transaction.paymentReference}
            </p>
          )}
        </div>

        <div className="transaction-actions">
          {transaction.paymentMethod === "COD" &&
            transaction.paymentStatus === "Pending" && (
              <button
                onClick={() => handleConfirmCOD(transaction._id)}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Confirm Cash Received"}
              </button>
            )}

          {transaction.paymentStatus === "Paid" &&
            transaction.transactionStatus === "Confirmed" && (
              <button
                onClick={() =>
                  handleCompleteTransaction(transaction._id)
                }
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Complete Handover"}
              </button>
            )}

          {transaction.transactionStatus === "Completed" && (
            <span className="transaction-success">
              Handover Completed
            </span>
          )}
        </div>
      </div>
    );
  };

  // SELLER DASHBOARD
  const renderSeller = () => (
    <>
      <h2>Seller Dashboard</h2>

      <p className="profile-description">
        Manage your listings, purchase requests, swap offers and transactions.
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

      {/* RECEIVED PURCHASE REQUESTS */}
      <div className="profile-section-card">
        <div className="profile-listing-heading">
          <h3>Received Purchase Requests</h3>

          <button
            className="refresh-button"
            onClick={fetchReceivedRequests}
            disabled={receivedLoading}
          >
            {receivedLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {receivedLoading ? (
          <p>Loading received requests...</p>
        ) : receivedRequests.length === 0 ? (
          <p>You haven't received any purchase requests yet.</p>
        ) : (
          <div className="buyer-requests-list">
            {receivedRequests.map(request => (
              <div className="buyer-request-card" key={request._id}>
                <div className="request-main-content">
                  <h4>
                    {request.listing?.itemName || "Item unavailable"}
                  </h4>

                  <p>
                    Buyer: {request.buyer?.name || "Unknown"}
                  </p>

                  <p>
                    Email: {request.buyer?.email || "Not available"}
                  </p>

                  <p>
                    Message: {request.message || "No message added."}
                  </p>

                  {request.listing?._id && (
                    <Link to={`/item/${request.listing._id}`}>
                      View Item →
                    </Link>
                  )}

                  {request.status === "Pending" && (
                    <div className="profile-listing-actions">
                      <button
                        onClick={() =>
                          handleRequestAction(request._id, "Accepted")
                        }
                        disabled={processingRequest === request._id}
                      >
                        {processingRequest === request._id
                          ? "Processing..."
                          : "Accept"}
                      </button>

                      <button
                        onClick={() =>
                          handleRequestAction(request._id, "Rejected")
                        }
                        disabled={processingRequest === request._id}
                      >
                        {processingRequest === request._id
                          ? "Processing..."
                          : "Reject"}
                      </button>
                    </div>
                  )}

                  {(request.status === "Accepted" ||
                    request.status === "Completed") && (
                    <button
                      className="profile-chat-btn"
                      onClick={() =>
                        handleOpenPurchaseChat(request._id)
                      }
                      disabled={openingChat === request._id}
                    >
                      {openingChat === request._id
                        ? "Opening Chat..."
                        : "💬 Chat with Buyer"}
                    </button>
                  )}
                </div>

                <span
                  className={`profile-status ${
                    request.status === "Accepted"
                      ? "available"
                      : "other"
                  }`}
                >
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RECEIVED SWAP OFFERS */}
      <div className="profile-section-card">
        <div className="profile-listing-heading">
          <h3>Received Swap Offers 🔄</h3>

          <button
            className="refresh-button"
            onClick={refreshSwapOffers}
            disabled={swapOffersLoading}
          >
            {swapOffersLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {swapOffersLoading ? (
          <p>Loading swap offers...</p>
        ) : receivedSwapOffers.length === 0 ? (
          <p>You haven't received any swap offers yet.</p>
        ) : (
          <div className="buyer-requests-list">
            {receivedSwapOffers.map(offer =>
              renderSwapOfferCard(offer, "received")
            )}
          </div>
        )}
      </div>

      {/* SELLER TRANSACTIONS */}
      <div className="profile-section-card">
        <div className="profile-listing-heading">
          <h3>My Transactions</h3>

          <button
            className="refresh-button"
            onClick={fetchTransactions}
            disabled={transactionsLoading}
          >
            {transactionsLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {transactionsLoading ? (
          <p>Loading transactions...</p>
        ) : sellerTransactions.length === 0 ? (
          <p>You don't have any transactions yet.</p>
        ) : (
          <div className="seller-transactions-list">
            {sellerTransactions.map(transaction =>
              renderSellerTransaction(transaction)
            )}
          </div>
        )}
      </div>

      {/* MY LISTINGS */}
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
                        : `${API_URL}${item.imageUrl}`
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
                  {item.status !== "Reserved" &&
                    item.status !== "Swapped" && (
                      <>
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
                      </>
                    )}

                  {(item.status === "Reserved" ||
                    item.status === "Swapped") && (
                    <>
                      <p className="reserved-message">
                        {item.status === "Swapped"
                          ? "This item has been exchanged successfully."
                          : "This item is reserved while the swap is in progress."}
                      </p>

                      {/* SHOW SWAP PAYMENT PANEL ON RESERVED LISTINGS */}
                      {item.status === "Reserved" &&
                        (() => {
                          const swapOffer = getSwapOfferForListing(item._id);

                          return swapOffer ? (
                            renderSwapProgress(swapOffer)
                          ) : (
                            <p className="transaction-note">
                              Swap payment details are loading. Please
                              refresh your swap offers.
                            </p>
                          );
                        })()}
                    </>
                  )}
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

          <button
            className={activeTab === "wishlist" ? "active" : ""}
            onClick={() => {
              setActiveTab("wishlist");
              fetchWishlist();
            }}
          >
            ❤️ Saved Items ({wishlist.length})
          </button>
        </aside>

        <main className="profile-content">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "buyer" && renderBuyer()}
          {activeTab === "seller" && renderSeller()}
          {activeTab === "wishlist" && renderWishlist()}
        </main>
      </div>
    </div>
  );
}

export default Profile;
