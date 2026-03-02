<?php
require_once 'db.php';

header('Content-Type: application/json');

try {
    // Current admin user we want to insert/update
    $username = 'gucci7up@gmail.com';
    // Bcrypt hash for "Gucci1826"
    $hash = '$2b$10$Ky5xtdkYAb5wwqRGX/v22ge0wokpwSvi0jNYvh0I8/9Pj5vYtLLR2';

    // Ensure the table exists first just in case
    $pdo->exec("CREATE TABLE IF NOT EXISTS `admins` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `username` varchar(100) NOT NULL,
      `password` varchar(255) NOT NULL,
      `token` varchar(64) DEFAULT NULL,
      `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`),
      UNIQUE KEY `username` (`username`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // Insert or update the administrator
    $stmt = $pdo->prepare('INSERT INTO admins (username, password) VALUES (?, ?) ON DUPLICATE KEY UPDATE password = ?');
    $stmt->execute([$username, $hash, $hash]);

    echo json_encode(['success' => true, 'message' => "Admin user '$username' initialized successfully with the new password."]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database operation failed', 'details' => $e->getMessage()]);
}
?>