const PRODUCTS_API = "../../backend/api/products.php";
const CHECKOUT_API = "../../backend/api/checkout.php";
const ORDERS_API = "../../backend/api/orders.php";
const INVOICE_API = "../../backend/api/invoice.php";

let products = [];
let cart = JSON.parse(localStorage.getItem("shop_cart") || "[]");

function money(value) {
  return `${Number(value).toFixed(2)} DT`;
}

function readJsonResponse(res, fallbackMessage) {
  const contentType = res.headers.get("Content-Type") || "";

  if (!contentType.includes("application/json")) {
    return res.text().then(() => {
      throw new Error(fallbackMessage);
    });
  }

  return res.json().then((data) => {
    if (!res.ok) throw new Error(data.error || fallbackMessage);
    return data;
  });
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
      return readJsonResponse(res, "Commande refusee");
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

document.getElementById("history-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const email = String(formData.get("email") || "").trim();
  loadOrderHistory(email);
});

function renderOrderHistory(orders, email) {
  const container = document.getElementById("orders-history");
  const message = document.getElementById("history-message");

  if (!orders.length) {
    message.className = "mt-3 text-muted";
    message.innerText = "Aucune commande trouvee pour cet email.";
    container.innerHTML = "";
    return;
  }

  message.className = "mt-3 text-success";
  message.innerText = `${orders.length} commande(s) trouvee(s).`;
  container.innerHTML = orders.map((order) => {
    const canDownloadInvoice = order.payment_status === "paid";
    const items = order.items.map((item) => {
      return `<li>${item.product_name} - ${item.quantity} x ${money(item.unit_price)}</li>`;
    }).join("");
    const invoiceButton = canDownloadInvoice
      ? `<button class="btn btn-outline-dark btn-sm d-block mt-2 w-100" type="button" data-invoice-id="${order.id}" data-invoice-email="${email}">
          Facture PDF
        </button>`
      : `<button class="btn btn-outline-secondary btn-sm d-block mt-2" type="button" disabled>
          Facture disponible apres paiement
        </button>`;

    return `
      <article class="order-card">
        <div class="order-card-header">
          <div>
            <h3 class="h6 mb-1">Commande #${order.id}</h3>
            <div class="order-meta">${order.created_at}</div>
            <div class="order-meta">Paiement: ${order.payment_status}</div>
          </div>
          <div class="text-end">
            <strong>${money(order.total)}</strong>
            ${invoiceButton}
          </div>
        </div>
        <ul class="order-items">${items}</ul>
      </article>
    `;
  }).join("");
}

function loadOrderHistory(email) {
  const message = document.getElementById("history-message");

  message.className = "mt-3 text-muted";
  message.innerText = "Chargement de l'historique...";

  fetch(`${ORDERS_API}?email=${encodeURIComponent(email)}`)
    .then((res) => {
      return readJsonResponse(res, "Historique indisponible");
    })
    .then((data) => renderOrderHistory(data.orders || [], email))
    .catch((error) => {
      message.className = "mt-3 text-danger";
      message.innerText = error.message || "Impossible de charger l'historique.";
      document.getElementById("orders-history").innerHTML = "";
    });
}

document.addEventListener("click", (event) => {
  const invoiceButton = event.target.closest("[data-invoice-id]");
  if (!invoiceButton) return;

  const originalText = invoiceButton.innerText;
  const pdfWindow = window.open("", "_blank");

  if (pdfWindow) {
    pdfWindow.document.write("<p>Generation de la facture...</p>");
    pdfWindow.document.close();
  }

  invoiceButton.disabled = true;
  invoiceButton.innerText = "Generation...";

  fetch(INVOICE_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      order_id: Number(invoiceButton.dataset.invoiceId),
      email: invoiceButton.dataset.invoiceEmail
    })
  })
    .then((res) => {
      if (!res.ok) {
        return readJsonResponse(res, "Facture indisponible");
      }

      return res.blob();
    })
    .then((blob) => {
      const pdfUrl = URL.createObjectURL(blob);

      if (pdfWindow) {
        pdfWindow.location.href = pdfUrl;
      } else {
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = `facture-${invoiceButton.dataset.invoiceId}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }

      setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);
    })
    .catch((error) => {
      if (pdfWindow) pdfWindow.close();
      alert(error.message || "Impossible de generer la facture.");
    })
    .finally(() => {
      invoiceButton.disabled = false;
      invoiceButton.innerText = originalText;
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
