document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartSubtotal = document.getElementById("cart-subtotal");
    const cartTotal = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");
    const headerCartCount = document.getElementById("header-cart-count");

    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Display cart items
    function displayCartItems() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-message">
                    <p>Your cart is empty</p>
                    <a href="product.html" class="btn">Browse Products</a>
                </div>
            `;
            checkoutBtn.disabled = true;
            updateCartTotals();
            updateHeaderCartCount();
            return;
        }

        cartItemsContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.title}</h3>
                    <p class="price">$${item.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <span class="quantity">${item.quantity || 1}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                    <button class="remove-item" data-index="${index}">Remove</button>
                </div>
            </div>
        `).join("");

        // Add event listeners
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', decreaseQuantity);
        });

        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', increaseQuantity);
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', removeItem);
        });

        checkoutBtn.disabled = false;
        updateCartTotals();
        updateHeaderCartCount();
    }

    // Update quantity functions
    function decreaseQuantity(e) {
        const index = e.target.dataset.index;
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        }
        saveCart();
        displayCartItems();
    }

    function increaseQuantity(e) {
        const index = e.target.dataset.index;
        cart[index].quantity = (cart[index].quantity || 1) + 1;
        saveCart();
        displayCartItems();
    }

    // Remove item function
    function removeItem(e) {
        const index = e.target.dataset.index;
        cart.splice(index, 1);
        saveCart();
        displayCartItems();
    }

    // Update cart totals
    function updateCartTotals() {
        const subtotal = cart.reduce((sum, item) => {
            return sum + (item.price * (item.quantity || 1));
        }, 0);

        cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        cartTotal.textContent = `$${subtotal.toFixed(2)}`;
    }

    // Update header cart count
    function updateHeaderCartCount() {
        const totalItems = cart.reduce((sum, item) => {
            return sum + (item.quantity || 1);
        }, 0);
        headerCartCount.textContent = totalItems;
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Initialize cart display
    displayCartItems();

    // Checkout button handler
    checkoutBtn.addEventListener('click', () => {
        // In a real implementation, this would redirect to checkout
        alert('Proceeding to checkout!');
    });
});
