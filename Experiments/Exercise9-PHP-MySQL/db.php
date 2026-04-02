<?php
$host = '127.0.0.1';
$user = 'root';
$password = '';
$database = 'web_tech_lab';

$connection = new mysqli($host, $user, $password, $database);

if ($connection->connect_error) {
    die('Database connection failed: ' . $connection->connect_error);
}
