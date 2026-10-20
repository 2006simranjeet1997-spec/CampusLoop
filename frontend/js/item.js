
const items = {
    book: {
        name: "Engineering Mathematics Book",
        price: 250,
        category: "Books",
        condition: "Good",
        emoji: "📚",
        seller: "Aarav Sharma",
        description: "A useful engineering mathematics book for college students. Suitable for revision, practice, and semester preparation."
    },

    laptop: {
        name: "Laptop",
        price: 1200,
        category: "Electronics",
        condition: "Used",
        emoji: "💻",
        seller: "Riya Verma",
        description: "A pre-owned laptop listed by a fellow student. Contact the seller to ask about its specifications and working condition."
    },

    hoodie: {
        name: "Campus Hoodie",
        price: 350,
        category: "Clothing",
        condition: "Good",
        emoji: "👕",
        seller: "Ananya Singh",
        description: "A comfortable campus hoodie. Check the size and condition with the seller before arranging an exchange."
    },

    calculator: {
        name: "Scientific Calculator",
        price: 400,
        category: "Electronics",
        condition: "Good",
        emoji: "🧮",
        seller: "Kabir Mehta",
        description: "A scientific calculator for engineering calculations, practice sessions, and exam preparation."
    },

    notes: {
        name: "Computer Science Notes",
        price: 100,
        category: "Notes",
        condition: "Good",
        emoji: "📝",
        seller: "Mehak Kaur",
        description: "Computer science study notes that can help with revision. Ask the seller which subjects and topics are included."
    },

    backpack: {
        name: "College Backpack",
        price: 300,
        category: "Accessories",
        condition: "Used",
        emoji: "🎒",
        seller: "Arjun Malhotra",
        description: "A pre-owned backpack for carrying books and everyday college essentials. Ask the seller about its size and condition."
    }
};

const params = new URLSearchParams(window.location.search);
const itemId = params.get("id");
const item = items[itemId];

if (item) {
    document.getElementById("itemVisual").textContent = item.emoji;
    document.getElementById("itemCategory").textContent = item.category;
    document.getElementById("itemName").textContent = item.name;
    document.getElementById("itemPrice").textContent = `₹${item.price}`;
    document.getElementById("itemCondition").textContent = item.condition;
    document.getElementById("itemDescription").textContent = item.description;
    document.getElementById("sellerName").textContent = item.seller;
    document.getElementById("modalItemName").textContent =
        `You're enquiring about: ${item.name}`;

    document.title = `${item.name} | CampusLoop`;
} else {
    document.getElementById("itemVisual").textContent = "🔎";
    document.getElementById("itemCategory").textContent = "Item not found";
    document.getElementById("itemName").textContent = "Sorry, item not found";
    document.getElementById("itemPrice").textContent = "";
    document.getElementById("itemCondition").textContent = "—";
    document.getElementById("itemDescription").textContent =
        "This item link may be incorrect. Please return to the Marketplace and choose another item.";
    document.getElementById("sellerName").textContent = "No seller available";
    document.getElementById("contactSeller").disabled = true;
    document.getElementById("contactSeller").style.opacity = "0.5";
}

const modal = document.getElementById("contactModal");
const contactButton = document.getElementById("contactSeller");
const closeModal = document.getElementById("closeModal");
const sendMessage = document.getElementById("sendMessage");
const messageInput = document.getElementById("messageInput");
const messageStatus = document.getElementById("messageStatus");

contactButton.addEventListener("click", () => {
    modal.classList.add("show");
});

closeModal.addEventListener("click", () => {
    modal.classList.remove("show");
});

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.classList.remove("show");
    }
});

sendMessage.addEventListener("click", () => {
    if (!messageInput.value.trim()) {
        messageStatus.textContent = "Please write a message first.";
        return;
    }

    messageStatus.textContent =
        "Demo only: your message has not been sent. Messaging will be connected when we build the backend.";
});
