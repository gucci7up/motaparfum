CREATE DATABASE IF NOT EXISTS `motaparfum_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `motaparfum_db`;

CREATE TABLE IF NOT EXISTS `products` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `sku` varchar(100) NOT NULL,
  `category` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `status` enum('In Stock','Low Stock','Out of Stock') NOT NULL DEFAULT 'In Stock',
  `image` text NOT NULL,
  `gender` enum('Hombres','Mujeres','Unisex') NOT NULL,
  `brand` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `stats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stat_key` varchar(50) NOT NULL,
  `label` varchar(100) NOT NULL,
  `value` varchar(100) NOT NULL,
  `change_value` varchar(50) NOT NULL,
  `icon` varchar(50) NOT NULL,
  `trend` enum('up','down') NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `stat_key` (`stat_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(64) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `categories` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert mock data
INSERT INTO `categories` (`id`, `name`) VALUES
('c1', 'Woody Exotic'),
('c2', 'Fresh Aquatic'),
('c3', 'Floral Night'),
('c4', 'Oriental Gold'),
('c5', 'Essenze di Roma'),
('c6', 'Radiance Series')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO `products` (`id`, `name`, `sku`, `category`, `price`, `status`, `image`, `gender`, `brand`) VALUES
('1', 'Royal Oud Premium', 'RD-RO-001', 'Woody Exotic', 14500.00, 'In Stock', 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=400&h=500', 'Hombres', 'Essenze di Roma'),
('2', 'Ocean Breeze Intense', 'RD-OB-042', 'Fresh Aquatic', 9800.00, 'In Stock', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400&h=500', 'Hombres', 'Parfum de Luxe'),
('3', 'Midnight Rose Noir', 'RD-MR-008', 'Floral Night', 12200.00, 'Low Stock', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=400&h=500', 'Mujeres', 'Radiance Series'),
('4', 'Golden Amber Spirit', 'RD-GA-015', 'Oriental Gold', 16900.00, 'In Stock', 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=400&h=500', 'Unisex', 'Prestige Bloom'),
('5', 'Fragancia Imperial', 'RD-FI-099', 'Essenze di Roma', 8200.00, 'In Stock', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400&h=500', 'Hombres', 'Essenze di Roma'),
('6', 'Velvet Rose', 'RD-VR-102', 'Radiance Series', 7900.00, 'In Stock', 'https://images.unsplash.com/photo-1585120040315-2241b774ad0f?auto=format&fit=crop&q=80&w=400&h=500', 'Mujeres', 'Radiance Series')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO `stats` (`stat_key`, `label`, `value`, `change_value`, `icon`, `trend`) VALUES
('total_products', 'Total Products', '1,240', '12%', 'package', 'up'),
('recent_clicks', 'Recent Clicks', '8,432', '5%', 'mouse-pointer', 'up'),
('whatsapp_leads', 'WhatsApp Leads', '156', '8%', 'message-square', 'up'),
('revenue_growth', 'Revenue Growth', '$12.5k', '18%', 'dollar-sign', 'up')
ON DUPLICATE KEY UPDATE value=VALUES(value);

-- Default admin user: admin / admin123
INSERT INTO `admins` (`username`, `password`) VALUES
('admin', '$2y$10$wT0rX1Z1g6R1Q4Q6H8Q4H.M2w.y1K1w.p1Q1R1R1R1R1R1R1R1R1R')
ON DUPLICATE KEY UPDATE id=id;
