document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const productImage = document.getElementById("product-image");
    const zoomLens = document.getElementById("zoom-lens");
    const zoomResult = document.getElementById("zoom-result");
    const productTitle = document.getElementById("product-title");
    const productDescription = document.getElementById("product-description");
    const productPriceEl = document.getElementById("product-price");
    const totalPriceEl = document.getElementById("total-price");
    const quantityInput = document.getElementById("quantity");
    const increaseBtn = document.getElementById("increase");
    const decreaseBtn = document.getElementById("decrease");
    const addToCartBtn = document.getElementById("add-to-cart");
    const cartCount = document.getElementById("cart-count");
    const colorOptions = document.querySelectorAll(".color-option");
    const sizeSelect = document.getElementById("size");
    const cartFeedback = document.getElementById("cart-feedback");

    let productPrice = 0;
    let selectedColor = "";
    let selectedSize = "";

    // Initialize image zoom
    function initImageZoom() {
        if (!productImage || !zoomLens || !zoomResult) return;

        productImage.addEventListener("mousemove", moveLens);
        productImage.addEventListener("mouseleave", () => {
            zoomLens.style.display = "none";
            zoomResult.style.display = "none";
        });

        function moveLens(e) {
            e.preventDefault();
            
            // Calculate lens position
            const pos = getCursorPos(e);
            let x = pos.x - (zoomLens.offsetWidth / 2);
            let y = pos.y - (zoomLens.offsetHeight / 2);

            // Prevent lens from going outside image
            x = Math.max(0, Math.min(x, productImage.width - zoomLens.offsetWidth));
            y = Math.max(0, Math.min(y, productImage.height - zoomLens.offsetHeight));

            // Set lens position and show zoom
            zoomLens.style.left = `${x}px`;
            zoomLens.style.top = `${y}px`;
            zoomLens.style.display = "block";
            
            // Calculate zoom result
            // Adjust zoom to show more of the image
            const zoomFactor = 2.5;
            zoomResult.style.backgroundImage = `url(${productImage.src})`;
            zoomResult.style.backgroundSize = `${productImage.width * zoomFactor}px ${productImage.height * zoomFactor}px`;
            zoomResult.style.backgroundPosition = `-${x * zoomFactor}px -${y * zoomFactor}px`;
            zoomResult.style.display = "block";
        }

        function getCursorPos(e) {
            const rect = productImage.getBoundingClientRect();
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }
    }

    // Color selection with better visual feedback
    colorOptions.forEach(option => {
        option.addEventListener("click", () => {
            // Remove selection from all options
            colorOptions.forEach(opt => {
                opt.classList.remove("selected");
                opt.style.border = "2px solid transparent";
                opt.style.transform = "scale(1)";
            });
            
            // Highlight selected option
            option.classList.add("selected");
            option.style.border = "2px solid #ff6600";
            option.style.transform = "scale(1.05)";
            option.style.transition = "all 0.2s ease";
            
            // Store selected color
            selectedColor = option.dataset.color;
            
            // Show selection in feedback area
            cartFeedback.textContent = `Selected color: ${selectedColor}`;
            cartFeedback.style.display = "block";
            cartFeedback.style.color = "#ff6600";
            setTimeout(() => {
                cartFeedback.style.display = "none";
            }, 1500);
        });
    });

    // Size selection
    sizeSelect.addEventListener("change", () => {
        selectedSize = sizeSelect.value;
    });

    // Quantity controls
    increaseBtn.addEventListener("click", () => {
        quantityInput.value = parseInt(quantityInput.value) + 1;
        updateTotalPrice();
    });

    decreaseBtn.addEventListener("click", () => {
        if (quantityInput.value > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
            updateTotalPrice();
        }
    });

    quantityInput.addEventListener("change", () => {
        if (quantityInput.value < 1) quantityInput.value = 1;
        if (quantityInput.value > 10) quantityInput.value = 10;
        updateTotalPrice();
    });

    function updateTotalPrice() {
        const total = productPrice * parseInt(quantityInput.value);
        totalPriceEl.textContent = `$${total.toFixed(2)}`;
    }

    // Add to cart functionality
    addToCartBtn.addEventListener("click", () => {
        if (!selectedColor) {
            cartFeedback.textContent = "Please select a color";
            cartFeedback.style.display = "block";
            setTimeout(() => {
                cartFeedback.style.display = "none";
            }, 2000);
            return;
        }
        
        // Ensure size is properly set (even if 'small' is selected)
        if (!selectedSize) {
            selectedSize = sizeSelect.options[0].value; // Default to first size option
        }
        const product = {
            id: new URLSearchParams(window.location.search).get("id"),
            title: productTitle.textContent,
            price: productPrice,
            image: productImage.src,
            color: selectedColor,
            size: selectedSize,
            quantity: parseInt(quantityInput.value)
        };

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        
        // Check if product with same id, color and size already exists
        const existingItem = cart.find(item => 
            item.id === product.id && 
            item.color === product.color && 
            item.size === product.size
        );

        if (existingItem) {
            existingItem.quantity += product.quantity;
        } else {
            cart.push(product);
        }
        
        localStorage.setItem("cart", JSON.stringify(cart));

        // Show feedback
        cartFeedback.textContent = "Added to cart!";
        cartFeedback.style.display = "block";
        setTimeout(() => {
            cartFeedback.style.display = "none";
        }, 2000);

        // Update cart count
        updateCartCount();
    });

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalQuantity;
}

    // Load product data
    const productId = new URLSearchParams(window.location.search).get("id");
    if (productId) {
        fetch(`https://fakestoreapi.com/products/${productId}`)
            .then(res => res.json())
            .then(product => {
                productImage.src = product.image;
                productTitle.textContent = product.title;
                productDescription.textContent = product.description;
                productPrice = product.price;
                productPriceEl.textContent = `$${product.price.toFixed(2)}`;
                totalPriceEl.textContent = `$${product.price.toFixed(2)}`;
                
                // Initialize features after product loads
                initImageZoom();
                updateCartCount();
            })
            .catch(error => {
                console.error("Error loading product:", error);
                productTitle.textContent = "Error loading product";
            });
    } else {
        productTitle.textContent = "Product not found";
    }
});
