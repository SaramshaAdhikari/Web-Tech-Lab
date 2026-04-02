<?php
require_once __DIR__ . '/bootstrap.php';
require_login();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercise 10 - Dashboard</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <main>
        <h1>Exercise 10: Session and Cookie Dashboard</h1>
        <p>
            <span class="badge">Logged in as: <?php echo h($_SESSION['user_email']); ?></span>
            <span class="badge">Login time: <?php echo h($_SESSION['login_time']); ?></span>
        </p>

        <nav>
            <a href="dashboard.php">Dashboard</a>
            <a href="cart.php">Cart</a>
            <a href="set-preferences.php">Preferences</a>
            <a href="logout.php">Logout</a>
        </nav>

        <section>
            <h2>Cookie-backed Preferences</h2>
            <p><strong>Preferred Currency:</strong> <?php echo h($currency); ?></p>
            <p><strong>Preferred Theme:</strong> <?php echo h($theme); ?></p>
        </section>

        <section>
            <h2>Session-backed Cart Snapshot</h2>
            <p><strong>Items in cart:</strong> <?php echo (int)$_SESSION['cart_items']; ?></p>
            <p>Open the cart page to add/remove items and verify persistence across pages.</p>
        </section>
    </main>
</body>
</html>
