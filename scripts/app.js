document.addEventListener("DOMContentLoaded", () => {
    const cartIcon = document.getElementById("cart-icon");
    const cartModal = document.getElementById("cart-modal");
    const closeCart = document.getElementById("close-cart");
    const cartCount = document.getElementById("cart-count");
    const cartItemsContainer = document.getElementById("cart-items");
    let cart = [];

    // Open Cart
    if (cartIcon && cartModal) {
        cartIcon.addEventListener("click", () => {
            cartModal.style.display = "block";
            updateCartDisplay();
        });
    }

    // Close Cart
    if (closeCart && cartModal) {
        closeCart.addEventListener("click", () => {
            cartModal.style.display = "none";
        });
    }

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
                <a href="product.html?id=${product.id}" class="product-link">
                    <img src="${product.image}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <p>$${product.price}</p>
                </a>
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
        if (cartItemsContainer) {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
                document.getElementById("cart-count").textContent = '0';
                return;
            }

            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}" width="60">
                    <div class="cart-item-details">
                        <h4>${item.title}</h4>
                        <p>Color: ${item.color}</p>
                        <p>Size: ${item.size}</p>
                        <p>Qty: ${item.quantity}</p>
                        <p>Price: $${(item.price * item.quantity).toFixed(2)}</p>
                        <button class="remove-item" data-id="${item.id}" data-color="${item.color}" data-size="${item.size}">Remove</button>
                    </div>
                </div>
            `).join("");

            // Calculate and display cart total
            const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const totalElement = document.createElement('div');
            totalElement.className = 'cart-total';
            totalElement.textContent = `Total: $${cartTotal.toFixed(2)}`;
            cartItemsContainer.appendChild(totalElement);

            // Add event listeners to remove buttons with comprehensive error handling
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function(e) {
                    try {
                        const id = this.dataset.id;
                        const color = this.dataset.color;
                        const size = this.dataset.size;
                        
                        // Get current cart with fallback to empty array
                        let cart;
                        try {
                            cart = JSON.parse(localStorage.getItem("cart")) || [];
                        } catch (e) {
                            console.error("Error parsing cart:", e);
                            cart = [];
                        }
                        
                        // Create new cart without the item to remove
                        const newCart = cart.filter(item => {
                            // Convert all sizes to lowercase for consistent comparison
                            const itemSize = item.size ? item.size.toLowerCase() : '';
                            const targetSize = size ? size.toLowerCase() : '';
                            return !(item.id === id && 
                                   item.color === color && 
                                   itemSize === targetSize);
                        });
                        
                        // Verify removal actually occurred
                        if (newCart.length < cart.length) {
                            // Success - item was removed
                            localStorage.setItem("cart", JSON.stringify(newCart));
                            updateCartDisplay();
                        } else {
                            // Failed to remove - corrupt cart data
                            console.warn("Failed to remove item - resetting cart");
                            localStorage.removeItem("cart");
                            updateCartDisplay();
                        }
                        
                        // Force UI update regardless
                        const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
                        document.getElementById("cart-count").textContent = 
                            updatedCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
                            
                    } catch (error) {
                        console.error("Error removing item:", error);
                        // Last resort - completely reset cart
                        localStorage.removeItem("cart");
                        updateCartDisplay();
                        document.getElementById("cart-count").textContent = '0';
                    }
                });
            });
        }
    }

    function resetCart(hardReset = false) {
        try {
            // Clear all cart-related data
            localStorage.removeItem("cart");
            cart = [];
            
            // Reset UI elements
            if (cartCount) cartCount.textContent = '0';
            if (cartItemsContainer) {
                cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            }
            
            console.log("Cart has been reset" + (hardReset ? " (hard reset)" : ""));
            
            // Only reload if hard reset requested
            if (hardReset) {
                window.location.reload();
            }
        } catch (e) {
            console.error("Error resetting cart:", e);
            if (hardReset) window.location.reload();
        }
    }

    // Initialize cart with validation
    function initCart() {
        try {
            const cartData = localStorage.getItem("cart");
            if (!cartData) {
                resetCart();
                return;
            }
            
            const parsedCart = JSON.parse(cartData);
            if (!Array.isArray(parsedCart)) {
                throw new Error("Invalid cart data format");
            }
            
            cart = parsedCart;
            if (cartCount) cartCount.textContent = cart.length;
        } catch (e) {
            console.error("Error initializing cart:", e);
            resetCart(true); // Hard reset if initialization fails
        }
    }

    // Initialize cart on page load
    initCart();
    updateCartDisplay();

    fetchProducts();
});

