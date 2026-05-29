# EcomWebPhp

A full-stack e-commerce application built with a PHP backend and a React + Vite frontend.

## Project overview

- **Backend**: PHP, PDO / MySQL, Stripe payment integration, JWT authentication.
- **Frontend**: React with Vite, client-side cart, checkout flow, login/register, order history.
- **Database**: MySQL / MariaDB schema in `database/ecommerce.sql`.
- **Purpose**: demonstrate user authentication, product listing, cart checkout, payment confirmation, and order history.

## Architecture

- `backend/`
  - `public/index.php` is the single PHP entry point for API requests.
  - `routes/` dispatches requests to controllers.
  - `Controller/` contains request handling logic.
  - `DAO/` contains database access objects.
  - `Entity/` contains domain models.
  - `Service/` contains Stripe and authentication services.
- `frontend/`
  - React app powered by Vite.
  - `src/pages/` contains main app pages.
  - `src/services/` contains API clients.
  - `src/state/` contains auth state management.
- `database/`
  - `ecommerce.sql` defines tables and seed product data.

## Requirements

### Backend

- PHP 8+ with `pdo` extension
- MySQL / MariaDB
- Composer

### Frontend

- Node.js 18+ (or compatible)
- npm

## Setup

### 1. Database

1. Create a database named `ecommerce_store`.
2. Run `database/ecommerce.sql` against your MySQL server.
3. Update `backend/.env` with your DB connection values.

Example `.env` values:

```env
DB_HOST=127.0.0.1:3307
DB_NAME=ecommerce_store
DB_USER=root
DB_PASS=

STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...
JWT_SECRET=jwt_super_secret_key_for_ecommerce_app_32_chars
```

### 2. Backend dependencies

From `backend/`:

```bash
cd backend
composer install
```

### 3. Frontend dependencies

From `frontend/`:

```bash
cd frontend
npm install
```

## Run locally

### Backend

```bash
cd backend
php -S 127.0.0.1:8000 -t public
```

This serves the backend API from `http://127.0.0.1:8000`.

### Frontend

```bash
cd frontend
npm run dev
```

This serves the frontend at `http://localhost:5173` (or another port if 5173 is busy).

## Key API endpoints

### Backend routes

- `POST /checkout.php` — create order and Stripe checkout session.
- `GET /payment_success.php?session_id=...` — confirm Stripe payment and finalize order.
- `POST /login` — user authentication.
- `POST /signup` — user registration.
- `GET /products` — product list.
- `GET /orders?email=...` — order history by email.
- `POST /invoice.php` — generate invoice (PDF) for an order.

## Checkout flow

1. User fills checkout form.
2. Frontend sends POST JSON to `/checkout.php`.
3. Backend route `backend/routes/ecommerce.php` routes request to `CheckoutController::store()`.
4. Backend verifies auth, validates stock, creates order + items, creates Stripe session.
5. Backend returns JSON including `checkout_url`.
6. Frontend redirects user to Stripe.
7. After payment, Stripe redirects to `/payment-success?session_id=...`.
8. Frontend page `PaymentSuccessPage.jsx` calls `/payment_success.php` with `session_id`.
9. Backend `PaymentController::success()` checks Stripe session, decrements stock, marks order as paid, and returns `{ success: true, order_id }`.

## Important files

### Backend

- `backend/public/index.php` — entry point and CORS handling.
- `backend/routes/ecommerce.php` — ecommerce route definitions.
- `backend/Controller/CheckoutController.php` — checkout request processing.
- `backend/Controller/PaymentController.php` — Stripe payment confirmation processing.
- `backend/DAO/EcommerceProductDAO.php` — product stock lookup and update.
- `backend/DAO/OrderDAO.php` — order persistence and order item retrieval.
- `backend/Service/StripePaymentService.php` — Stripe session creation and retrieval.
- `backend/middleware/AuthMiddleware.php` — JWT authentication.

### Frontend

- `frontend/src/pages/CheckoutPage.jsx` — checkout UI and order submission.
- `frontend/src/pages/PaymentSuccessPage.jsx` — payment confirmation page.
- `frontend/src/services/orderService.js` — checkout API client.
- `frontend/src/services/apiClient.js` — common API request wrapper.
- `frontend/src/state/AuthProvider.jsx` — auth state and JWT persistence.

## Notes

- The backend uses a single entry point (`backend/public/index.php`) and routes requests through PHP route files.
- Stock is protected using row-level locking (`SELECT ... FOR UPDATE`) and `UPDATE ... WHERE stock >= ?`.
- The project does not include automated tests by default.
- Use Stripe test keys for local development.

## Troubleshooting

- If login fails, verify the database `users` table contains the expected account and that the email/YOUR_DB_PASSWORD are correct.
- If checkout fails with `Product unavailable`, verify your cart quantities do not exceed the current `product.stock`.
- If Stripe session calls fail, verify `STRIPE_SECRET_KEY` and `VITE_STRIPE_PUBLIC_KEY` are set correctly.

## License

This project does not include a license file by default.
