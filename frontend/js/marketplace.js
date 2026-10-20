
const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const categoryFilters = document.getElementById("categoryFilters");
const sortSelect = document.getElementById("sortSelect");
const itemCount = document.getElementById("itemCount");
const emptyState = document.getElementById("emptyState");
const resetFilters = document.getElementById("resetFilters");

const productCards = Array.from(
    productsGrid.querySelectorAll(".product-card")
);

let selectedCategory = "All";

function updateMarketplace() {
    const searchText = searchInput.value.trim().toLowerCase();
    const sortValue = sortSelect.value;

    let visibleProducts = productCards.filter((card) => {
        const category = card.dataset.category;
        const name = card.dataset.name.toLowerCase();
        const description = card.querySelector(
            ".product-description"
        ).textContent.toLowerCase();

        const matchesCategory =
            selectedCategory === "All" ||
            category === selectedCategory;

        const matchesSearch =
            name.includes(searchText) ||
            description.includes(searchText) ||
            category.toLowerCase().includes(searchText);

        return matchesCategory && matchesSearch;
    });

    if (sortValue === "low") {
        visibleProducts.sort(
            (a, b) => Number(a.dataset.price) - Number(b.dataset.price)
        );
    } else if (sortValue === "high") {
        visibleProducts.sort(
            (a, b) => Number(b.dataset.price) - Number(a.dataset.price)
        );
    }

    productsGrid.replaceChildren();

    visibleProducts.forEach((card) => {
        productsGrid.appendChild(card);
    });

    itemCount.textContent =
        `${visibleProducts.length} ${
            visibleProducts.length === 1 ? "item" : "items"
        }`;

    emptyState.hidden = visibleProducts.length !== 0;
    productsGrid.hidden = visibleProducts.length === 0;
}

// Category selection
categoryFilters.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-btn");

    if (!button) return;

    selectedCategory = button.dataset.category;

    categoryFilters.querySelectorAll(".filter-btn").forEach((filter) => {
        filter.classList.toggle("active", filter === button);
    });

    updateMarketplace();
});

// Search
searchInput.addEventListener("input", updateMarketplace);
searchButton.addEventListener("click", updateMarketplace);

// Sorting
sortSelect.addEventListener("change", updateMarketplace);

// Reset filters
resetFilters.addEventListener("click", () => {
    searchInput.value = "";
    selectedCategory = "All";
    sortSelect.value = "default";

    categoryFilters.querySelectorAll(".filter-btn").forEach((button) => {
        button.classList.toggle(
            "active",
            button.dataset.category === "All"
        );
    });

    updateMarketplace();
});

// Initial display
updateMarketplace();
