
const listingsGrid = document.getElementById("listingsGrid");
const emptyState = document.getElementById("emptyState");
const profileModal = document.getElementById("profileModal");
const profileForm = document.getElementById("profileForm");
const profileMessage = document.getElementById("profileMessage");

let profile = {
    name: "CampusLoop Student",
    email: "student@example.com"
};

let listings = [
    {
        id: 1,
        name: "Engineering Mathematics Book",
        category: "Books",
        price: 250,
        condition: "Good",
        emoji: "📚"
    },
    {
        id: 2,
        name: "Scientific Calculator",
        category: "Electronics",
        price: 400,
        condition: "Like New",
        emoji: "🧮"
    },
    {
        id: 3,
        name: "College Backpack",
        category: "Accessories",
        price: 300,
        condition: "Used",
        emoji: "🎒"
    }
];

function renderProfile() {
    document.getElementById("profileName").textContent = profile.name;
    document.getElementById("profileEmail").textContent = profile.email;
}

function renderListings() {
    listingsGrid.replaceChildren();

    document.getElementById("totalListings").textContent = listings.length;
    document.getElementById("availableListings").textContent = listings.length;

    emptyState.classList.toggle("show", listings.length === 0);

    listings.forEach((item) => {
        const card = document.createElement("article");
        card.className = "listing-card";

        const visual = document.createElement("div");
        visual.className = "listing-visual";
        visual.textContent = item.emoji;

        const details = document.createElement("div");
        details.className = "listing-details";

        const category = document.createElement("p");
        category.className = "listing-category";
        category.textContent = item.category;

        const name = document.createElement("h3");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.className = "listing-price";
        price.textContent = `₹${item.price}`;

        const condition = document.createElement("p");
        condition.className = "listing-condition";
        condition.textContent = `Condition: ${item.condition}`;

        const actions = document.createElement("div");
        actions.className = "listing-actions";

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => editListing(item.id));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";
        deleteButton.addEventListener("click", () => deleteListing(item.id));

        actions.append(editButton, deleteButton);
        details.append(category, name, price, condition, actions);
        card.append(visual, details);
        listingsGrid.append(card);
    });
}

function editListing(id) {
    const item = listings.find((listing) => listing.id === id);

    if (!item) return;

    const newName = prompt("Enter item name:", item.name);
    if (newName === null) return;

    const newPrice = prompt("Enter item price:", item.price);
    if (newPrice === null) return;

    const cleanName = newName.trim();
    const priceNumber = Number(newPrice);

    if (!cleanName || !Number.isFinite(priceNumber) || priceNumber < 0) {
        alert("Please enter a valid item name and price.");
        return;
    }

    item.name = cleanName;
    item.price = priceNumber;

    renderListings();
}

function deleteListing(id) {
    const confirmed = confirm("Are you sure you want to delete this demo listing?");

    if (!confirmed) return;

    listings = listings.filter((item) => item.id !== id);
    renderListings();
}

document.getElementById("editProfileButton").addEventListener("click", () => {
    document.getElementById("editName").value = profile.name;
    document.getElementById("editEmail").value = profile.email;
    profileMessage.textContent = "";
    profileModal.classList.add("show");
});

document.getElementById("closeModal").addEventListener("click", () => {
    profileModal.classList.remove("show");
});

profileModal.addEventListener("click", (event) => {
    if (event.target === profileModal) {
        profileModal.classList.remove("show");
    }
});

profileForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("editName").value.trim();
    const email = document.getElementById("editEmail").value.trim();

    if (!name || !email) {
        profileMessage.textContent = "Please fill in both fields.";
        return;
    }

    profile.name = name;
    profile.email = email;

    renderProfile();
    profileModal.classList.remove("show");

    alert("Profile updated for this demo session.");
});

document.getElementById("logoutButton").addEventListener("click", (event) => {
    event.preventDefault();

    const confirmed = confirm("Return to the CampusLoop login page?");

    if (confirmed) {
        window.location.href = "login.html";
    }
});

renderProfile();
renderListings();
