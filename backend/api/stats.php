<?php
require_once 'db.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query('SELECT * FROM stats');
        $stats = $stmt->fetchAll();

        // Format for the frontend
        $formattedStats = [];
        foreach ($stats as $stat) {
            $formattedStats[] = [
                'label' => $stat['label'],
                'value' => $stat['value'],
                'change' => $stat['change_value'],
                'icon' => $stat['icon'],
                'trend' => $stat['trend']
            ];
        }
        echo json_encode($formattedStats);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
}
?>