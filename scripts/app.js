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
// Auth Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Form toggle functionality
    const loginToggle = document.getElementById('login-toggle');
    const signupToggle = document.getElementById('signup-toggle');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const toSignup = document.getElementById('to-signup');
    const toLogin = document.getElementById('to-login');

    function toggleForms(showLogin) {
        if (showLogin) {
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
            loginToggle.classList.add('active');
            signupToggle.classList.remove('active');
        } else {
            loginForm.classList.remove('active');
            signupForm.classList.add('active');
            loginToggle.classList.remove('active');
            signupToggle.classList.add('active');
        }
    }

    loginToggle.addEventListener('click', () => toggleForms(true));
    signupToggle.addEventListener('click', () => toggleForms(false));
    toSignup.addEventListener('click', (e) => {
        e.preventDefault();
        toggleForms(false);
    });
    toLogin.addEventListener('click', (e) => {
        e.preventDefault();
        toggleForms(true);
    });

    // Password visibility toggle
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
        });
    });

    // Password strength indicator
    const passwordInput = document.getElementById('signup-password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

    passwordInput.addEventListener('input', function() {
        const strength = calculatePasswordStrength(this.value);
        updateStrengthIndicator(strength);
    });

    function calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length > 7) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^A-Za-z0-9]/)) strength++;
        return strength;
    }

    function updateStrengthIndicator(strength) {
        const colors = ['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71'];
        const texts = ['Weak', 'Fair', 'Good', 'Strong'];
        strengthBar.style.width = `${strength * 25}%`;
        strengthBar.style.backgroundColor = colors[strength - 1] || colors[0];
        strengthText.textContent = texts[strength - 1] || texts[0];
    }

    // Form submission with backend integration
    document.getElementById('login-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        if (!validateLoginForm()) return;
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Logging in...';
            
            // Mock successful login for testing
            const mockUser = {
                id: 1,
                name: 'Test User',
                email: document.getElementById('login-email').value
            };
            
            // Simulate API response
            const data = {
                token: 'mock-token',
                user: mockUser
            };
            
            console.log('Mock login successful', data);

            // Store token and user data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect to home page after login
            window.location.href = 'index.html';
            
        } catch (error) {
            showFormError(form, error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });

    document.getElementById('signup-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        if (!validateSignupForm()) return;
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating account...';
            
            // Mock successful signup for testing
            const mockUser = {
                id: 2,
                name: document.getElementById('signup-name').value,
                email: document.getElementById('signup-email').value
            };
            
            // Simulate API response
            const data = {
                token: 'mock-token',
                user: mockUser
            };
            
            console.log('Mock signup successful', data);

            // Store token and user data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect to home page after signup
            window.location.href = 'index.html';
            
        } catch (error) {
            showFormError(form, error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });

    /**
     * Displays an error message in the form
     * @param {HTMLFormElement} form - The form element
     * @param {string} message - The error message to display
     */
    function showFormError(form, message) {
        const errorContainer = form.querySelector('.form-error') || createErrorContainer(form);
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
        errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    /**
     * Creates a styled error container for form validation messages
     * @param {HTMLFormElement} form - The form element
     * @returns {HTMLDivElement} The created error container
     */
    function createErrorContainer(form) {
        const container = document.createElement('div');
        container.className = 'form-error';
        Object.assign(container.style, {
            color: '#e74c3c',
            margin: '1rem 0',
            padding: '0.5rem',
            backgroundColor: '#fdecea',
            borderRadius: '4px',
            display: 'none'
        });
        form.insertBefore(container, form.firstChild);
        return container;
    }

    function validateLoginForm() {
        const email = document.getElementById('login-email');
        const password = document.getElementById('login-password');
        let isValid = true;

        // Email validation
        if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            email.nextElementSibling.textContent = 'Please enter a valid email';
            isValid = false;
        } else {
            email.nextElementSibling.textContent = '';
        }

        // Password validation
        if (!password.value) {
            password.nextElementSibling.textContent = 'Please enter your password';
            isValid = false;
        } else {
            password.nextElementSibling.textContent = '';
        }

        return isValid;
    }

    function validateSignupForm() {
        const name = document.getElementById('signup-name');
        const email = document.getElementById('signup-email');
        const password = document.getElementById('signup-password');
        const confirm = document.getElementById('signup-confirm');
        let isValid = true;

        // Name validation
        if (!name.value) {
            name.nextElementSibling.textContent = 'Please enter your full name';
            isValid = false;
        } else {
            name.nextElementSibling.textContent = '';
        }

        // Email validation
        if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            email.nextElementSibling.textContent = 'Please enter a valid email';
            isValid = false;
        } else {
            email.nextElementSibling.textContent = '';
        }

        // Password validation
        if (!password.value || password.value.length < 8) {
            password.nextElementSibling.textContent = 'Password must be at least 8 characters';
            isValid = false;
        } else if (!password.value.match(/[A-Z]/) || !password.value.match(/[0-9]/)) {
            password.nextElementSibling.textContent = 'Password must contain at least one uppercase letter and one number';
            isValid = false;
        } else {
            password.nextElementSibling.textContent = '';
        }

        // Confirm password validation
        if (password.value !== confirm.value) {
            confirm.nextElementSibling.textContent = 'Passwords do not match';
            isValid = false;
        } else {
            confirm.nextElementSibling.textContent = '';
        }

        return isValid;
    }
});
