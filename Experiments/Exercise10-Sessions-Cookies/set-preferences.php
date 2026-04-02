<?php
require_once __DIR__ . '/bootstrap.php';
require_login();

$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $selectedCurrency = $_POST['currency'] ?? 'USD';
    $selectedTheme = $_POST['theme'] ?? 'light';

    $allowedCurrencies = ['USD', 'EUR', 'INR'];
    $allowedThemes = ['light', 'dark'];

    if (!in_array($selectedCurrency, $allowedCurrencies, true)) {
        $selectedCurrency = 'USD';
    }

    if (!in_array($selectedTheme, $allowedThemes, true)) {
        $selectedTheme = 'light';
    }

    setcookie('preferred_currency', $selectedCurrency, time() + (86400 * 30), '/');
    setcookie('preferred_theme', $selectedTheme, time() + (86400 * 30), '/');

    $message = 'Preferences saved in cookies.';
    $currency = $selectedCurrency;
    $theme = $selectedTheme;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercise 10 - Preferences</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <main>
        <h1>Set Cookie Preferences</h1>
        <nav>
            <a href="dashboard.php">Dashboard</a>
            <a href="cart.php">Cart</a>
            <a href="logout.php">Logout</a>
        </nav>

        <?php if ($message): ?>
            <div class="msg ok"><?php echo h($message); ?></div>
        <?php endif; ?>

        <form method="post" action="">
            <label for="currency">Currency</label>
            <select id="currency" name="currency">
                <option value="USD" <?php echo $currency === 'USD' ? 'selected' : ''; ?>>USD</option>
                <option value="EUR" <?php echo $currency === 'EUR' ? 'selected' : ''; ?>>EUR</option>
                <option value="INR" <?php echo $currency === 'INR' ? 'selected' : ''; ?>>INR</option>
            </select>

            <label for="theme">Theme</label>
            <select id="theme" name="theme">
                <option value="light" <?php echo $theme === 'light' ? 'selected' : ''; ?>>Light</option>
                <option value="dark" <?php echo $theme === 'dark' ? 'selected' : ''; ?>>Dark</option>
            </select>

            <button type="submit">Save Preferences</button>
        </form>
    </main>
</body>
</html>
