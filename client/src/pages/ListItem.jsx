
import { useEffect, useState } from "react";

function ListItem() {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    listingType: "",
    price: "",
    condition: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (!image) {
      setImagePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(image);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [image]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5 MB.");
      e.target.value = "";
      return;
    }

    setImage(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.itemName.trim() ||
        !formData.category ||
        !formData.listingType ||
        !formData.price ||
        !formData.condition ||
        !formData.description.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    alert("Your item listing form is ready! Backend integration coming soon.");

    console.log("Listing details:", formData);
    console.log("Selected image:", image);
  };

  return (
    <div className="list-item-page">
      <div className="listing-container">
        <h1>List an Item</h1>
        <p className="listing-subtitle">
          Share something with students on your campus.
        </p>

        <form className="listing-form" onSubmit={handleSubmit}>
          <h2>Item Information</h2>

          <div className="form-group">
            <label htmlFor="itemName">Item Name</label>
            <input
              type="text"
              id="itemName"
              name="itemName"
              placeholder="Enter item name"
              value={formData.itemName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="Electronics">Electronics</option>
              <option value="Books">Books</option>
              <option value="Clothing">Clothing</option>
              <option value="Furniture">Furniture</option>
              <option value="Sports">Sports</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="listingType">Listing Type</label>
            <select
              id="listingType"
              name="listingType"
              value={formData.listingType}
              onChange={handleChange}
              required
            >
              <option value="">Select listing type</option>
              <option value="Sell">Sell</option>
              <option value="Rent">Rent</option>
              <option value="Borrow">Borrow</option>
              <option value="Swap">Swap</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (₹)</label>
            <input
              type="number"
              id="price"
              name="price"
              placeholder="Enter price"
              min="0"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="condition">Condition</label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              required
            >
              <option value="">Select condition</option>
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="itemImage">Upload Item Image</label>
            <input
              type="file"
              id="itemImage"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageChange}
            />
            <small>JPG, PNG or WEBP. Maximum size: 5 MB.</small>

            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Selected item preview" />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="remove-image"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe your item..."
              rows="5"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="publish-button">
            Publish Listing
          </button>
        </form>
      </div>
    </div>
  );
}

export default ListItem;
