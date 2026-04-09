<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use GET.'
    ]);
    exit;
}

require_once __DIR__ . '/db.php';

try {
    $connection = getDatabaseConnection();
    ensureUsersTable($connection);

    $sql = "SELECT * FROM users ORDER BY id DESC";

    $result = $connection->query($sql);
    if (!$result) {
        throw new Exception('Fetch failed: ' . $connection->error);
    }

    $records = [];
    while ($row = $result->fetch_assoc()) {
        $records[] = [
            'fullname' => (string)($row['fullname'] ?? ''),
            'email' => (string)($row['email'] ?? ''),
            'age' => (string)($row['age'] ?? ''),
            'country' => (string)($row['country'] ?? ''),
            'created_at' => (string)($row['created_at'] ?? '')
        ];
    }

    echo json_encode($records);
} catch (Throwable $error) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $error->getMessage()
    ]);
}
