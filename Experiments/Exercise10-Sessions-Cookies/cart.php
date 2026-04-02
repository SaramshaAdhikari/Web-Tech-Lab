<?php
require_once __DIR__ . '/bootstrap.php';
require_login();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'add') {
        $_SESSION['cart_items'] += 1;
    }

    if ($action === 'remove' && $_SESSION['cart_items'] > 0) {
        $_SESSION['cart_items'] -= 1;
    }

    header('Location: cart.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercise 10 - Cart</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <main>
        <h1>Cart (Session Persistence)</h1>
        <nav>
            <a href="dashboard.php">Dashboard</a>
            <a href="set-preferences.php">Preferences</a>
            <a href="logout.php">Logout</a>
        </nav>

        <p><span class="badge">User: <?php echo h($_SESSION['user_email']); ?></span></p>
        <p><span class="badge">Preferred Currency: <?php echo h($currency); ?></span></p>

        <h2>Session Cart Count: <?php echo (int)$_SESSION['cart_items']; ?></h2>

        <form method="post" action="">
            <input type="hidden" name="action" value="add">
            <button type="submit">Add Item</button>
        </form>

        <form method="post" action="">
            <input type="hidden" name="action" value="remove">
            <button type="submit">Remove Item</button>
        </form>
    </main>
</body>
</html>
