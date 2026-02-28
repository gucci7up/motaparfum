<?php
require_once 'db.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';

// Function to check if the user is an admin
function isAdmin()
{
    global $pdo, $authHeader;
    if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches))
        return false;
    $token = $matches[1];
    $stmt = $pdo->prepare('SELECT id FROM admins WHERE token = ?');
    $stmt->execute([$token]);
    return $stmt->fetch() !== false;
}

if ($method === 'GET') {
    if (!isAdmin()) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }

    try {
        $stmt = $pdo->query('SELECT * FROM leads ORDER BY created_at DESC');
        $leads = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($leads);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }

} elseif ($method === 'POST') {
    // Public route: allowing customers to create new leads before going to WhatsApp
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data || !isset($data['name']) || !isset($data['phone']) || !isset($data['product_name'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing fields']);
        exit;
    }

    try {
        $stmt = $pdo->prepare('INSERT INTO leads (name, phone, product_name, status) VALUES (?, ?, ?, "New")');
        $stmt->execute([$data['name'], $data['phone'], $data['product_name']]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }

} elseif ($method === 'PUT') {
    if (!isAdmin()) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['id']) || !isset($data['status'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing ID or status']);
        exit;
    }

    try {
        $stmt = $pdo->prepare('UPDATE leads SET status = ? WHERE id = ?');
        $stmt->execute([$data['status'], $data['id']]);
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }

} elseif ($method === 'DELETE') {
    if (!isAdmin()) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing ID']);
        exit;
    }

    try {
        $stmt = $pdo->prepare('DELETE FROM leads WHERE id = ?');
        $stmt->execute([$data['id']]);
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
}
?>