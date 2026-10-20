const listingForm = document.getElementById("listingForm");
const itemImage = document.getElementById("itemImage");
const imagePreview = document.getElementById("imagePreview");
const formMessage = document.getElementById("formMessage");

let selectedImage = null;

itemImage.addEventListener("change", () => {
    const file = itemImage.files[0];

    imagePreview.replaceChildren();
    imagePreview.classList.remove("visible");
    selectedImage = null;

    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {
        showMessage("Please choose a valid image file.", "error");
        itemImage.value = "";
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showMessage("Image size must be 5 MB or less.", "error");
        itemImage.value = "";
        return;
    }

    selectedImage = file;

    const image = document.createElement("img");
    const imageUrl = URL.createObjectURL(file);

    image.src = imageUrl;
    image.alt = "Selected item preview";

    image.onload = () => URL.revokeObjectURL(imageUrl);

    const caption = document.createElement("p");
    caption.textContent = file.name;

    imagePreview.append(image, caption);
    imagePreview.classList.add("visible");
    showMessage("", "");
});

listingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("itemName").value.trim();
    const category = document.getElementById("category").value;
    const price = Number(document.getElementById("price").value);
    const condition = document.getElementById("condition").value;
    const description = document.getElementById("description").value.trim();
    const sellerName = document.getElementById("sellerName").value.trim();
    const contact = document.getElementById("contact").value.trim();
    const confirmed = document.getElementById("confirmDetails").checked;

    if (!name || !category || !condition || !description || !sellerName || !contact) {
        showMessage("Please complete all required fields.", "error");
        return;
    }

    if (!Number.isFinite(price) || price < 0 || price > 1000000) {
        showMessage("Please enter a valid price between ₹0 and ₹10,00,000.", "error");
        return;
    }

    if (!confirmed) {
        showMessage("Please confirm that your information is accurate.", "error");
        return;
    }

    // Demo object only. Nothing is saved to a server yet.
    const listing = {
        name,
        category,
        price,
        condition,
        description,
        sellerName,
        contact,
        imageName: selectedImage ? selectedImage.name : null
    };

    console.log("CampusLoop demo listing:", listing);

    showMessage(
        "Your listing form is complete! This is a frontend demo, so the item has not been saved to the Marketplace yet.",
        "success"
    );

    listingForm.reset();
    selectedImage = null;
    imagePreview.replaceChildren();
    imagePreview.classList.remove("visible");
});

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = "form-message";

    if (type) {
        formMessage.classList.add(type);
    }
}
