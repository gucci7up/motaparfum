<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$host = getenv('DB_HOST') ?: 'db';
$db = getenv('DB_NAME') ?: 'motaparfum_db';
$user = getenv('DB_USER') ?: 'user';
$pass = getenv('DB_PASS') ?: 'password';
$charset = 'utf8mb4';

// Check if Dokploy provided a DATABASE_URL
$dbUrl = getenv('DATABASE_URL');
if ($dbUrl) {
    // Example: mysql://user:password@host:port/dbname
    $parsedUrl = parse_url($dbUrl);
    $host = $parsedUrl['host'] ?? $host;
    $user = $parsedUrl['user'] ?? $user;
    $pass = $parsedUrl['pass'] ?? $pass;
    $db = isset($parsedUrl['path']) ? ltrim($parsedUrl['path'], '/') : $db;

    // Add port if provided
    if (isset($parsedUrl['port'])) {
        $host .= ';' . 'port=' . $parsedUrl['port'];
    }
}

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);

    // Check if tables exist and initialize if not (useful for first Dokploy start)
    $stmt = $pdo->query("SHOW TABLES LIKE 'products'");
    if ($stmt->rowCount() == 0) {
        $schemaPath = __DIR__ . '/../schema.sql';
        if (file_exists($schemaPath)) {
            $sql = file_get_contents($schemaPath);
            $pdo->exec($sql);
        }
    }
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed", "details" => escapeshellarg($e->getMessage())]);
    exit;
}
?>