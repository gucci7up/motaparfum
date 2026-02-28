<?php
require_once 'db.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
            $stmt->execute([$_GET['id']]);
            $product = $stmt->fetch();
            if ($product) {
                echo json_encode($product);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Product not found']);
            }
        } else {
            $stmt = $pdo->query('SELECT * FROM products ORDER BY created_at DESC');
            $products = $stmt->fetchAll();
            echo json_encode($products);
        }
        break;

    case 'POST':
    case 'PUT':
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
            // Check if it's an update disguised as POST (due to FormData limits with PUT)
            $isUpdate = isset($_GET['id']) || isset($_POST['_method']) && $_POST['_method'] === 'PUT';
            $updateId = isset($_GET['id']) ? $_GET['id'] : null;

            // Handle image: convert to base64 and store in DB (no filesystem writes needed)
            $imagePath = '';
            if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                $file = $_FILES['image'];
                $mime = mime_content_type($file['tmp_name']);
                $b64 = base64_encode(file_get_contents($file['tmp_name']));
                $imagePath = "data:{$mime};base64,{$b64}";
            } else {
                // Keep existing image during update, or use URL if provided
                if ($isUpdate && empty($_POST['image'])) {
                    $stmt = $pdo->prepare("SELECT image FROM products WHERE id = ?");
                    $stmt->execute([$updateId]);
                    $existing = $stmt->fetch();
                    $imagePath = $existing ? $existing['image'] : '';
                } else {
                    $imagePath = $_POST['image'] ?? '';
                }
            }

            $name = $_POST['name'] ?? '';
            $sku = $_POST['sku'] ?? '';
            $category = $_POST['category'] ?? '';
            $price = $_POST['price'] ?? 0;
            $stock = $_POST['stock'] ?? 0;
            $status = $_POST['status'] ?? 'In Stock';
            $gender = $_POST['gender'] ?? 'Unisex';
            $brand = $_POST['brand'] ?? '';

            if (!$isUpdate) {
                $id = uniqid();
                $sql = "INSERT INTO products (id, name, sku, category, price, stock, status, image, gender, brand) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                try {
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([
                        $id,
                        $name,
                        $sku,
                        $category,
                        $price,
                        $stock,
                        $status,
                        $imagePath,
                        $gender,
                        $brand
                    ]);
                    http_response_code(201);
                    echo json_encode(['id' => $id, 'message' => 'Product created', 'image' => $imagePath]);
                } catch (PDOException $e) {
                    http_response_code(500);
                    echo json_encode(['error' => $e->getMessage()]);
                }
            } else {
                $sql = "UPDATE products SET name=?, sku=?, category=?, price=?, stock=?, status=?, image=?, gender=?, brand=? WHERE id=?";
                try {
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([
                        $name,
                        $sku,
                        $category,
                        $price,
                        $stock,
                        $status,
                        $imagePath,
                        $gender,
                        $brand,
                        $updateId
                    ]);
                    echo json_encode(['message' => 'Product updated', 'image' => $imagePath]);
                } catch (PDOException $e) {
                    http_response_code(500);
                    echo json_encode(['error' => $e->getMessage()]);
                }
            }
        } elseif ($method === 'PUT') {
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data || !isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid JSON or missing ID']);
                break;
            }

            $sql = "UPDATE products SET name=?, sku=?, category=?, price=?, stock=?, status=?, image=?, gender=?, brand=? WHERE id=?";
            try {
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    $data['name'],
                    $data['sku'],
                    $data['category'],
                    $data['price'],
                    $data['stock'] ?? 0,
                    $data['status'],
                    $data['image'],
                    $data['gender'],
                    $data['brand'],
                    $_GET['id']
                ]);
                echo json_encode(['message' => 'Product updated']);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => $e->getMessage()]);
            }
        } elseif ($method === 'DELETE') {
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing ID']);
                break;
            }

            try {
                $stmt = $pdo->prepare('DELETE FROM products WHERE id = ?');
                $stmt->execute([$_GET['id']]);
                echo json_encode(['message' => 'Product deleted']);
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