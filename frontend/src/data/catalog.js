export const categories = [
  { id: 1, name: 'New Arrivals', slug: 'new-arrivals', description: 'Fresh pieces selected for the season ahead.', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80' },
  { id: 2, name: 'Footwear', slug: 'footwear', description: 'Everyday sneakers, sandals, and refined essentials.', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80' },
  { id: 3, name: 'Accessories', slug: 'accessories', description: 'Useful finishing touches with a premium feel.', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80' },
  { id: 4, name: 'Home Goods', slug: 'home-goods', description: 'Calm objects for better rooms and rituals.', image: 'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?auto=format&fit=crop&w=900&q=80' },
]

export const products = [
  { id: 101, name: 'Linen Utility Jacket', slug: 'linen-utility-jacket', category: 'new-arrivals', categoryName: 'New Arrivals', description: 'A lightweight structured jacket with breathable linen, oversized pockets, and a relaxed everyday silhouette.', price: 128, oldPrice: 158, stock: 18, rating: 4.8, badge: 'New', image: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&q=80' },
  { id: 102, name: 'Everyday Runner', slug: 'everyday-runner', category: 'footwear', categoryName: 'Footwear', description: 'Cushioned low-profile sneakers designed for city days, quick errands, and long weekend walks.', price: 96, stock: 24, rating: 4.7, badge: 'Best seller', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80' },
  { id: 103, name: 'Market Tote', slug: 'market-tote', category: 'accessories', categoryName: 'Accessories', description: 'Durable canvas tote with reinforced handles, internal pockets, and room for a full day out.', price: 58, stock: 40, rating: 4.6, badge: 'Eco', image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=80' },
  { id: 104, name: 'Ceramic Pour Set', slug: 'ceramic-pour-set', category: 'home-goods', categoryName: 'Home Goods', description: 'A hand-glazed pour-over set for slow mornings, crafted with a warm matte finish.', price: 72, stock: 12, rating: 4.9, badge: 'Limited', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80' },
  { id: 105, name: 'Soft Knit Polo', slug: 'soft-knit-polo', category: 'new-arrivals', categoryName: 'New Arrivals', description: 'A polished knit polo with gentle texture, clean ribbing, and a breathable cotton blend.', price: 84, stock: 31, rating: 4.5, badge: 'New', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80' },
  { id: 106, name: 'Minimal Watch', slug: 'minimal-watch', category: 'accessories', categoryName: 'Accessories', description: 'Slim stainless steel watch with a clean face, sapphire glass, and leather strap.', price: 140, oldPrice: 175, stock: 15, rating: 4.8, badge: 'Sale', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80' },
  { id: 107, name: 'Trail Sandal', slug: 'trail-sandal', category: 'footwear', categoryName: 'Footwear', description: 'Adjustable warm-weather sandals with grippy soles and water-friendly straps.', price: 68, stock: 21, rating: 4.4, badge: 'Travel', image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=900&q=80' },
  { id: 108, name: 'Woven Storage Basket', slug: 'woven-storage-basket', category: 'home-goods', categoryName: 'Home Goods', description: 'Natural fiber basket for throws, plants, towels, and small-space organization.', price: 46, stock: 35, rating: 4.6, badge: 'Handmade', image: 'https://images.unsplash.com/photo-1618220252344-8ec99ec624b1?auto=format&fit=crop&w=900&q=80' },
]

export const orders = [
  { id: 'ORD-2048', date: 'May 18, 2026', status: 'Delivered', total: 224, items: 3 },
  { id: 'ORD-1982', date: 'April 29, 2026', status: 'Shipped', total: 72, items: 1 },
  { id: 'ORD-1844', date: 'March 12, 2026', status: 'Delivered', total: 186, items: 2 },
]
