<?php
// Load credentials from environment variables or an untracked db.local.php file.
$config = [
    'host' => getenv('DB_HOST') ?: '',
    'user' => getenv('DB_USER') ?: '',
    'pass' => getenv('DB_PASS') ?: '',
    'name' => getenv('DB_NAME') ?: ''
];

$localConfigPath = __DIR__ . '/db.local.php';
if (is_file($localConfigPath)) {
    $localConfig = require $localConfigPath;
    if (is_array($localConfig)) {
        $config = array_merge($config, $localConfig);
    }
}

if ($config['host'] === '' || $config['user'] === '' || $config['pass'] === '' || $config['name'] === '') {
    throw new Exception('Missing database configuration. Use environment variables or create Experiments/Form-Data-Storage/db.local.php from Experiments/Form-Data-Storage/db.local.php.example.');
}

define('DB_HOST', $config['host']);
define('DB_USER', $config['user']);
define('DB_PASS', $config['pass']);
define('DB_NAME', $config['name']);

function getDatabaseConnection()
{
    static $connection = null;

    if ($connection instanceof mysqli) {
        return $connection;
    }

    $connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    if ($connection->connect_error) {
        throw new Exception('Database connection failed: ' . $connection->connect_error);
    }

    $connection->set_charset('utf8mb4');
    return $connection;
}

function ensureUsersTable(mysqli $connection)
{
    $sql = "
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fullname VARCHAR(255),
            email VARCHAR(255),
            age INT,
            birthday DATE,
            bio TEXT,
            satisfaction INT,
            gender VARCHAR(50),
            interests TEXT,
            country VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ";

    if (!$connection->query($sql)) {
        throw new Exception('Failed to ensure users table exists: ' . $connection->error);
    }
}
