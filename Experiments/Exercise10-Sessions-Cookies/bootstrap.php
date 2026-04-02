<?php
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

function h(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

function require_login(): void
{
    if (empty($_SESSION['user_email'])) {
        header('Location: login.php');
        exit;
    }
}

if (!isset($_SESSION['cart_items'])) {
    $_SESSION['cart_items'] = 0;
}

$currency = $_COOKIE['preferred_currency'] ?? 'USD';
$theme = $_COOKIE['preferred_theme'] ?? 'light';
