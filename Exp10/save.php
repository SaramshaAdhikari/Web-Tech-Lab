<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use POST.'
    ]);
    exit;
}

require_once __DIR__ . '/db.php';

try {
    $connection = getDatabaseConnection();
    ensureUsersTable($connection);

    $raw = file_get_contents('php://input');
    $payload = json_decode($raw, true);

    if (!is_array($payload)) {
        $payload = $_POST;
    }

    $fullname = trim($payload['fullname'] ?? '');
    if ($fullname === '') {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'Full name is required.'
        ]);
        exit;
    }

    $email = trim($payload['email'] ?? '');
    $age = trim((string)($payload['age'] ?? ''));
    $birthday = trim($payload['birthday'] ?? '');
    $bio = trim($payload['bio'] ?? '');
    $satisfaction = trim((string)($payload['satisfaction'] ?? ''));
    $gender = trim($payload['gender'] ?? '');
    $interests = trim($payload['interests'] ?? '');
    $country = trim($payload['country'] ?? '');

    $statement = $connection->prepare(
        "INSERT INTO users (fullname, email, age, birthday, bio, satisfaction, gender, interests, country)
         VALUES (?, ?, NULLIF(?, ''), NULLIF(?, ''), ?, NULLIF(?, ''), ?, ?, ?)"
    );

    if (!$statement) {
        throw new Exception('Prepare failed: ' . $connection->error);
    }

    $statement->bind_param(
        'sssssssss',
        $fullname,
        $email,
        $age,
        $birthday,
        $bio,
        $satisfaction,
        $gender,
        $interests,
        $country
    );

    if (!$statement->execute()) {
        throw new Exception('Insert failed: ' . $statement->error);
    }

    echo json_encode([
        'success' => true,
        'message' => 'Record saved successfully.',
        'id' => $statement->insert_id
    ]);
} catch (Throwable $error) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $error->getMessage()
    ]);
}
