<?php
require_once 'db.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query('SELECT setting_key, setting_value FROM settings');
        $settings = [];
        while ($row = $stmt->fetch()) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }

        // Provide defaults if table is empty
        if (empty($settings)) {
            $settings = [
                'store_name' => 'Luxury Perfume RD',
                'support_email' => 'support@motaparfum.store',
                'whatsapp_number' => '+1 809 555 0199',
                'primary_color' => '#F2B90D'
            ];
        }

        echo json_encode($settings);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    $authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';

    if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }

    $token = $matches[1];
    $stmt = $pdo->prepare('SELECT id FROM admins WHERE token = ?');
    $stmt->execute([$token]);
    if (!$stmt->fetch()) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }

    if (!empty($_POST)) {
        $data = $_POST;
    } else {
        $data = json_decode(file_get_contents('php://input'), true);
    }

    if (!$data && empty($_FILES)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data']);
        exit;
    }

    try {
        $pdo->beginTransaction();
        $stmt = $pdo->prepare('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?');

        if ($data) {
            foreach ($data as $key => $value) {
                if ($key !== 'store_logo_file') {
                    $stmt->execute([$key, $value, $value]);
                }
            }
        }

        // Handle file upload
        if (isset($_FILES['store_logo_file'])) {
            if ($_FILES['store_logo_file']['error'] === UPLOAD_ERR_OK) {
                $uploadDir = __DIR__ . '/uploads/';
                if (!is_dir($uploadDir)) {
                    if (!mkdir($uploadDir, 0777, true)) {
                        throw new PDOException('Failed to create uploads directory.');
                    }
                }

                $file = $_FILES['store_logo_file'];
                $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

                if (in_array($extension, $allowedExtensions)) {
                    $filename = 'logo_' . time() . '.' . $extension;
                    $targetPath = $uploadDir . $filename;

                    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
                        $fileUrl = '/api/uploads/' . $filename;
                        $stmt->execute(['store_logo', $fileUrl, $fileUrl]);
                    } else {
                        throw new PDOException('Failed to move uploaded file.');
                    }
                } else {
                    throw new PDOException('Invalid file extension.');
                }
            } else {
                throw new PDOException('Upload error: ' . $_FILES['store_logo_file']['error']);
            }
        }

        $pdo->commit();
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
}
?>