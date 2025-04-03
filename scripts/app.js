document.addEventListener("DOMContentLoaded", () => {
    const cartIcon = document.getElementById("cart-icon");
    const cartModal = document.getElementById("cart-modal");
    const closeCart = document.getElementById("close-cart");
    const cartCount = document.getElementById("cart-count");
    const cartItemsContainer = document.getElementById("cart-items");
    let cart = [];

    // Open Cart
    cartIcon.addEventListener("click", () => {
        cartModal.style.display = "block";
        updateCartDisplay();
    });

    // Close Cart
    closeCart.addEventListener("click", () => {
        cartModal.style.display = "none";
    });

    // Fetch Products Dynamically
    async function fetchProducts() {
        const response = await fetch("https://fakestoreapi.com/products");
        const products = await response.json();
        displayProducts(products);
    }

    function displayProducts(products) {
        const productContainer = document.getElementById("products-container");
        productContainer.innerHTML = "";

        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>$${product.price}</p>
                <button onclick="addToCart('${product.title}', ${product.price})">Add to Cart</button>
            `;
            productContainer.appendChild(productCard);
        });
    }

    window.addToCart = (name, price) => {
        cart.push({ name, price });
        cartCount.textContent = cart.length;
    };

    function updateCartDisplay() {
        cartItemsContainer.innerHTML = cart.map(item => `<p>${item.name} - $${item.price}</p>`).join("");
    }

    fetchProducts();
});
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
});

// Fetch products from FakeStore API
function fetchProducts() {
    const productGrid = document.getElementById("product-grid");

    // Display a loading message
    productGrid.innerHTML = "<p>Loading products...</p>";

    fetch("https://fakestoreapi.com/products")
        .then(response => response.json())
        .then(products => {
            productGrid.innerHTML = ""; // Clear loading message

            products.forEach(product => {
                const productCard = document.createElement("div");
                productCard.classList.add("product-card");

                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <p>${product.description.substring(0, 80)}...</p>
                    <div class="price">$${product.price.toFixed(2)}</div>
                    <button class="add-to-cart" onclick="addToCart('${product.title}', ${product.price})">Add to Cart</button>
                `;

                productGrid.appendChild(productCard);
            });
        })
        .catch(error => {
            console.error("Error fetching products:", error);
            productGrid.innerHTML = "<p>Failed to load products. Please try again later.</p>";
        });
}

// Add to Cart (Placeholder Function)
function addToCart(name, price) {
    alert(`Added "${name}" to cart - Price: $${price.toFixed(2)}`);
}
