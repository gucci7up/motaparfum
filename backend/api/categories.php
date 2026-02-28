<?php
require_once 'db.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query('SELECT * FROM categories ORDER BY created_at DESC');
        $categories = $stmt->fetchAll();
        echo json_encode($categories);
        break;

    case 'POST':
    case 'DELETE':
        // Protected methods require Bearer token
        $authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';

        if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized - Token missing']);
            exit;
        }

        $token = $matches[1];

        // Verify token against database
        $stmt = $pdo->prepare('SELECT id FROM admins WHERE token = ?');
        $stmt->execute([$token]);
        if (!$stmt->fetch()) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized - Invalid token']);
            exit;
        }

        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data || !isset($data['name'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid JSON or missing name']);
                break;
            }

            $id = uniqid('cat_');
            $sql = "INSERT INTO categories (id, name) VALUES (?, ?)";
            try {
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$id, $data['name']]);
                http_response_code(201);
                echo json_encode(['id' => $id, 'name' => $data['name'], 'message' => 'Category created']);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => $e->getMessage()]);
            }
        } elseif ($method === 'DELETE') {
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing category ID']);
                break;
            }

            try {
                $stmt = $pdo->prepare('DELETE FROM categories WHERE id = ?');
                $stmt->execute([$_GET['id']]);
                echo json_encode(['message' => 'Category deleted']);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => $e->getMessage()]);
            }
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
        break;
}
?>