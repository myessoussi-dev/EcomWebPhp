const PRODUCTS_API = "../../backend/api/products.php";
const CHECKOUT_API = "../../backend/api/checkout.php";

let products = [];
let cart = JSON.parse(localStorage.getItem("shop_cart") || "[]");

function money(value) {
  return `${Number(value).toFixed(2)} DT`;
}

function saveCart() {
  localStorage.setItem("shop_cart", JSON.stringify(cart));
}

function findProduct(productId) {
  return products.find((product) => Number(product.id) === Number(productId));
}

function cartQuantity(productId) {
  const item = cart.find((line) => Number(line.product_id) === Number(productId));
  return item ? item.quantity : 0;
}

function renderProducts() {
  const container = document.getElementById("products-list");
  const productCount = document.getElementById("product-count");

  productCount.innerText = `${products.length} produits`;

  if (!products.length) {
    container.innerHTML = '<p class="text-muted">Aucun produit disponible.</p>';
    return;
  }

  container.innerHTML = products.map((product) => {
    const disabled = Number(product.stock) <= cartQuantity(product.id);
    const initial = product.name.trim().charAt(0).toUpperCase();

    return `
      <div class="col-md-6 col-lg-3">
        <article class="card product-card">
          <div class="product-visual" style="background:${product.image_color};">${initial}</div>
          <div class="card-body">
            <div class="product-category">${product.category}</div>
            <h3 class="h5 mt-1">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="price-row">
              <span class="price">${money(product.price)}</span>
              <span class="stock">${product.stock} en stock</span>
            </div>
            <button class="btn btn-dark" data-add-product="${product.id}" ${disabled ? "disabled" : ""}>
              Ajouter au panier
            </button>
          </div>
        </article>
      </div>
    `;
  }).join("");
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const count = document.getElementById("cart-count");
  const totalElement = document.getElementById("cart-total");

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => {
    const product = findProduct(item.product_id);
    return sum + (product ? Number(product.price) * item.quantity : 0);
  }, 0);

  count.innerText = totalQuantity;
  totalElement.innerText = money(total);

  if (!cart.length) {
    container.innerHTML = '<p class="text-muted">Votre panier est vide.</p>';
    return;
  }

  container.innerHTML = cart.map((item) => {
    const product = findProduct(item.product_id);
    if (!product) return "";

    return `
      <div class="cart-item">
        <div>
          <strong>${product.name}</strong>
          <div class="text-muted">${money(product.price)} x ${item.quantity}</div>
        </div>
        <div class="cart-actions">
          <button class="btn btn-outline-dark" data-decrease="${product.id}" type="button">-</button>
          <span>${item.quantity}</span>
          <button class="btn btn-outline-dark" data-increase="${product.id}" type="button">+</button>
          <button class="btn btn-outline-danger" data-remove="${product.id}" type="button">x</button>
        </div>
      </div>
    `;
  }).join("");
}

function addToCart(productId) {
  const product = findProduct(productId);
  if (!product) return;

  const existing = cart.find((item) => Number(item.product_id) === Number(productId));
  if (existing) {
    if (existing.quantity < Number(product.stock)) existing.quantity += 1;
  } else {
    cart.push({ product_id: Number(productId), quantity: 1 });
  }

  saveCart();
  renderProducts();
  renderCart();
}

function updateQuantity(productId, delta) {
  const product = findProduct(productId);
  const item = cart.find((line) => Number(line.product_id) === Number(productId));
  if (!product || !item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    cart = cart.filter((line) => Number(line.product_id) !== Number(productId));
  } else if (item.quantity > Number(product.stock)) {
    item.quantity = Number(product.stock);
  }

  saveCart();
  renderProducts();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => Number(item.product_id) !== Number(productId));
  saveCart();
  renderProducts();
  renderCart();
}

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-product]");
  const increaseButton = event.target.closest("[data-increase]");
  const decreaseButton = event.target.closest("[data-decrease]");
  const removeButton = event.target.closest("[data-remove]");

  if (addButton) addToCart(addButton.dataset.addProduct);
  if (increaseButton) updateQuantity(increaseButton.dataset.increase, 1);
  if (decreaseButton) updateQuantity(decreaseButton.dataset.decrease, -1);
  if (removeButton) removeFromCart(removeButton.dataset.remove);
});

document.getElementById("checkout-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const message = document.getElementById("checkout-message");
  if (!cart.length) {
    message.className = "mt-3 mb-0 text-danger";
    message.innerText = "Ajoutez au moins un produit au panier.";
    return;
  }

  const formData = new FormData(event.target);
  const payload = {
    customer: Object.fromEntries(formData.entries()),
    items: cart
  };

  fetch(CHECKOUT_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then((res) => {
      return res.json().then((data) => {
        if (!res.ok) throw new Error(data.error || "Commande refusee");
        return data;
      });
    })
    .then((data) => {
      message.className = "mt-3 mb-0 text-success";
      message.innerText = "Redirection vers Stripe...";
      window.location.href = data.checkout_url;
    })
    .catch((error) => {
      message.className = "mt-3 mb-0 text-danger";
      message.innerText = error.message || "Impossible de confirmer la commande.";
    });
});

function loadProducts() {
  return fetch(PRODUCTS_API)
    .then((res) => {
      if (!res.ok) throw new Error("Unable to load products");
      return res.json();
    })
    .then((data) => {
      products = data.products || [];
      renderProducts();
      renderCart();
    })
    .catch(() => {
      document.getElementById("products-list").innerHTML = '<p class="text-danger">Impossible de charger les produits.</p>';
    });
}

loadProducts();
