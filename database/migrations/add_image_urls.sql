-- Migration: Add image_url column to product table
-- Date: 2026-05-29

USE ecommerce_store;

-- Add image_url column if it doesn't exist
ALTER TABLE product ADD COLUMN image_url VARCHAR(500) NULL AFTER image_color;

-- Update existing products with image URLs
UPDATE product SET image_url = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80' WHERE name = 'Casque Audio Pro';
UPDATE product SET image_url = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80' WHERE name = 'Montre Connectee Pulse';
UPDATE product SET image_url = 'https://images.unsplash.com/photo-1587829191301-e8e4c4d8dd8d?auto=format&fit=crop&w=900&q=80' WHERE name = 'Clavier Mecanique K90';
UPDATE product SET image_url = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80' WHERE name = 'Sac Urbain 24L';
UPDATE product SET image_url = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80' WHERE name = 'Sneakers Aero';
UPDATE product SET image_url = 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?auto=format&fit=crop&w=900&q=80' WHERE name = 'Lampe Desk Mini';
UPDATE product SET image_url = 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80' WHERE name = 'Souris Precision X';
UPDATE product SET image_url = 'https://images.unsplash.com/photo-1591644351981-5e8e6bab0a54?auto=format&fit=crop&w=900&q=80' WHERE name = 'Chargeur Rapide 65W';
