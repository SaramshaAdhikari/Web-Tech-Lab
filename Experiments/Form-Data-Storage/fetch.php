<?php
header('Content-Type: application/json; charset=utf-8');

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

    $sql = "
        SELECT fullname, email, age, birthday, bio, satisfaction, gender, interests, country
        FROM users
        ORDER BY id DESC
    ";

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
            'birthday' => (string)($row['birthday'] ?? ''),
            'bio' => (string)($row['bio'] ?? ''),
            'satisfaction' => (string)($row['satisfaction'] ?? ''),
            'gender' => (string)($row['gender'] ?? ''),
            'interests' => (string)($row['interests'] ?? ''),
            'country' => (string)($row['country'] ?? '')
        ];
    }

    echo json_encode([
        'success' => true,
        'records' => $records
    ]);
} catch (Throwable $error) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $error->getMessage()
    ]);
}
