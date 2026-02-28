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
    // Get Authorization header using multiple fallback methods
    // This is needed because Apache/Nginx sometimes strip the header before PHP sees it
    $authHeader = '';
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    } elseif (function_exists('getallheaders')) {
        $headers = getallheaders();
        foreach ($headers as $k => $v) {
            if (strtolower($k) === 'authorization') {
                $authHeader = $v;
                break;
            }
        }
    } elseif (isset($_SERVER['Authorization'])) {
        $authHeader = $_SERVER['Authorization'];
    }

    if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized – no auth header found.']);
        exit;
    }

    $token = $matches[1];
    $stmt = $pdo->prepare('SELECT id FROM admins WHERE token = ?');
    $stmt->execute([$token]);
    if (!$stmt->fetch()) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized – invalid token.']);
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

        // Read base64 logo from file upload (convert in PHP, store in DB - no filesystem needed)
        if (isset($_FILES['store_logo_file']) && $_FILES['store_logo_file']['error'] === UPLOAD_ERR_OK) {
            $file = $_FILES['store_logo_file'];
            $mime = mime_content_type($file['tmp_name']);
            $b64data = base64_encode(file_get_contents($file['tmp_name']));
            $dataUrl = "data:{$mime};base64,{$b64data}";
            $stmt->execute(['store_logo', $dataUrl, $dataUrl]);
        } elseif (!empty($data) && array_key_exists('store_logo', $data)) {
            // URL-based logo passed as a regular form field
            $val = $data['store_logo'];
            $stmt->execute(['store_logo', $val, $val]);
        }

        // Save all other fields (skip raw logo keys already handled)
        $skip = ['store_logo_file', 'store_logo'];
        if ($data) {
            foreach ($data as $key => $value) {
                if (!in_array($key, $skip)) {
                    $stmt->execute([$key, $value, $value]);
                }
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