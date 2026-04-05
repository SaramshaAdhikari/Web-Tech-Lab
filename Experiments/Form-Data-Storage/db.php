<?php
// Update these values to match your local MySQL setup.
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'web_tech_lab');

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
