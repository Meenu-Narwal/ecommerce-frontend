document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartSubtotal = document.getElementById("cart-subtotal");
    const cartTotal = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");
    const headerCartCount = document.getElementById("cart-count");

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
        if (cart.length === 0) return;
        
        // Show checkout form overlay
        const checkoutOverlay = document.createElement('div');
        checkoutOverlay.className = 'checkout-overlay';
        checkoutOverlay.innerHTML = `
            <div class="checkout-modal">
                <h2>Checkout</h2>
                <form id="checkout-form">
                    <div class="form-group">
                        <label for="name">Full Name</label>
                        <input type="text" id="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" required>
                    </div>
                    <div class="form-group">
                        <label for="address">Shipping Address</label>
                        <textarea id="address" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="payment">Payment Method</label>
                        <select id="payment" required>
                            <option value="">Select payment</option>
                            <option value="credit">Credit Card</option>
                            <option value="paypal">PayPal</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="cancel-checkout">Cancel</button>
                        <button type="submit" class="submit-order">Place Order</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(checkoutOverlay);

        // Handle form submission
        document.getElementById('checkout-form').addEventListener('submit', (e) => {
            e.preventDefault();
            processOrder();
        });

        // Handle cancel
        document.querySelector('.cancel-checkout').addEventListener('click', () => {
            document.body.removeChild(checkoutOverlay);
        });
    });

    function processOrder() {
        // In a real implementation, you would:
        // 1. Validate form data
        // 2. Send order to server
        // 3. Handle response
        // 4. Clear cart on success
        
        // For demo purposes:
        alert('Order placed successfully!');
        cart = [];
        localStorage.removeItem('cart');
        displayCartItems();
        document.body.removeChild(document.querySelector('.checkout-overlay'));
    }
});
