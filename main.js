const productsPerPage = 4; // Display four items per page
let currentPage = 1;
let products = [];
let filteredProducts = [];
let cart = [];

async function fetchProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    products = await response.json();
    filteredProducts = products;
    populateCategoryFilter();
    applyFilters();
    setupPagination();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

function displayProducts() {
  const container = document.getElementById("products-container");
  container.innerHTML = "";
  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const paginatedProducts = filteredProducts.slice(start, end);

  paginatedProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div class="product-details">
                <h2>${product.title}</h2>
                <p>Price: $${product.price}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
    container.appendChild(productCard);
  });
}

function setupPagination() {
  const paginationContainer = document.getElementById("pagination-container");
  paginationContainer.innerHTML = "";
  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);

  for (let i = 1; i <= pageCount; i++) {
    const button = document.createElement("button");
    button.innerText = i;
    button.addEventListener("click", () => {
      currentPage = i;
      displayProducts();
    });
    paginationContainer.appendChild(button);
  }
}

function populateCategoryFilter() {
  const categoryFilter = document.getElementById("category-filter");
  const categories = [...new Set(products.map((product) => product.category))];

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.text = category;
    categoryFilter.appendChild(option);
  });
}

function applyFilters() {
  const searchQuery = document
    .getElementById("search-input")
    .value.toLowerCase();
  const selectedCategory = document.getElementById("category-filter").value;
  const selectedPriceRange = document.getElementById("price-filter").value;

  filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery);
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesPrice =
      selectedPriceRange === "all" ||
      (selectedPriceRange === "0-50" && product.price <= 50) ||
      (selectedPriceRange === "51-100" &&
        product.price > 50 &&
        product.price <= 100) ||
      (selectedPriceRange === "101-150" &&
        product.price > 100 &&
        product.price <= 150) ||
      (selectedPriceRange === "151-200" &&
        product.price > 150 &&
        product.price <= 200) ||
      (selectedPriceRange === "200+" && product.price > 200);
    return matchesSearch && matchesCategory && matchesPrice;
  });

  currentPage = 1;
  displayProducts();
  setupPagination();
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  const cartItem = cart.find((item) => item.id === productId);

  if (cartItem) {
    cartItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  displayCart();
}

function removeFromCart(productId) {
  const index = cart.findIndex((item) => item.id === productId);
  if (index !== -1) {
    cart.splice(index, 1); // Remove the item from the cart array
    displayCart(); // Update the cart display
  }
}

function displayCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalContainer = document.getElementById("cart-total");
  const cartTotalQuantityContainer = document.getElementById(
    "cart-total-quantity"
  );
  cartItemsContainer.innerHTML = "";

  cart.forEach((item) => {
    const cartItemElement = document.createElement("li");
    cartItemElement.textContent = `${item.title} - $${item.price} x ${item.quantity}`;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => removeFromCart(item.id)); // Add event listener to remove the item
    cartItemElement.appendChild(removeButton);

    cartItemsContainer.appendChild(cartItemElement);
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartTotalContainer.textContent = `Total Price: $${total.toFixed(2)}`;
  cartTotalQuantityContainer.textContent = `Total Quantity: ${totalQuantity}`;
}

fetchProducts();
