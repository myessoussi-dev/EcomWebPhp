CREATE DATABASE IF NOT EXISTS ecommerce_store
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ecommerce_store;

DROP TABLE IF EXISTS order_item;
DROP TABLE IF EXISTS customer_order;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS user;

CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  phone VARCHAR(40) NULL,
  address TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  category VARCHAR(80) NOT NULL,
  description TEXT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  image_color VARCHAR(20) NOT NULL DEFAULT '#2563eb',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer_order (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'pending_payment',
  payment_status VARCHAR(40) NOT NULL DEFAULT 'unpaid',
  stripe_checkout_session_id VARCHAR(255) NULL,
  stripe_payment_intent_id VARCHAR(255) NULL,
  paid_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_user
    FOREIGN KEY (user_id)
    REFERENCES user(id)
    ON DELETE CASCADE
);

CREATE TABLE order_item (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_item_order
    FOREIGN KEY (order_id)
    REFERENCES customer_order(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_item_product
    FOREIGN KEY (product_id)
    REFERENCES product(id)
);

INSERT INTO product (name, category, description, price, stock, image_color) VALUES
('Casque Audio Pro', 'Audio', 'Casque sans fil confortable avec reduction de bruit et autonomie longue duree.', 249.00, 18, '#2563eb'),
('Montre Connectee Pulse', 'Accessoires', 'Montre connectee avec suivi sport, notifications et autonomie de 7 jours.', 179.00, 24, '#16a34a'),
('Clavier Mecanique K90', 'Informatique', 'Clavier compact retroeclaire avec switches tactiles et chassis robuste.', 129.00, 15, '#dc2626'),
('Sac Urbain 24L', 'Lifestyle', 'Sac a dos resistant pour laptop, cours et voyages courts.', 69.00, 32, '#9333ea'),
('Sneakers Aero', 'Mode', 'Baskets legeres pour un usage quotidien avec semelle confortable.', 119.00, 21, '#ea580c'),
('Lampe Desk Mini', 'Maison', 'Lampe de bureau LED avec intensite reglable et design minimal.', 39.00, 40, '#0891b2'),
('Souris Precision X', 'Informatique', 'Souris ergonomique avec capteur precis et boutons programmables.', 59.00, 27, '#4f46e5'),
('Chargeur Rapide 65W', 'Accessoires', 'Chargeur USB-C compact pour telephone, tablette et ordinateur portable.', 45.00, 35, '#0f766e');
