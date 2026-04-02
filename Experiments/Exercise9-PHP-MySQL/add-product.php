<?php
require_once __DIR__ . '/db.php';

$errors = [];
$success = '';

$name = '';
$category = '';
$price = '';
$stock = '';
$description = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $category = trim($_POST['category'] ?? '');
    $price = trim($_POST['price'] ?? '');
    $stock = trim($_POST['stock'] ?? '');
    $description = trim($_POST['description'] ?? '');

    if ($name === '') {
        $errors[] = 'Product name is required.';
    }

    if ($category === '') {
        $errors[] = 'Category is required.';
    }

    if (!is_numeric($price) || (float)$price < 0) {
        $errors[] = 'Price must be a non-negative number.';
    }

    if (!ctype_digit($stock)) {
        $errors[] = 'Stock must be a whole number.';
    }

    if (!$errors) {
        $statement = $connection->prepare(
            'INSERT INTO products (name, category, price, stock, description) VALUES (?, ?, ?, ?, ?)'
        );

        if ($statement) {
            $floatPrice = (float)$price;
            $intStock = (int)$stock;
            $statement->bind_param('ssdis', $name, $category, $floatPrice, $intStock, $description);

            if ($statement->execute()) {
                $success = 'Product inserted successfully.';
                $name = '';
                $category = '';
                $price = '';
                $stock = '';
                $description = '';
            } else {
                $errors[] = 'Failed to insert product: ' . $statement->error;
            }

            $statement->close();
        } else {
            $errors[] = 'Could not prepare insert statement.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercise 9 - Add Product</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <main>
        <h1>Exercise 9: Insert Product (PHP + MySQL)</h1>
        <p><a href="products.php">View Product Listing</a></p>

        <?php if ($success): ?>
            <div class="msg ok"><?php echo htmlspecialchars($success, ENT_QUOTES, 'UTF-8'); ?></div>
        <?php endif; ?>

        <?php if ($errors): ?>
            <div class="msg err">
                <ul>
                    <?php foreach ($errors as $error): ?>
                        <li><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>

        <form method="post" action="">
            <label for="name">Product Name</label>
            <input id="name" name="name" type="text" value="<?php echo htmlspecialchars($name, ENT_QUOTES, 'UTF-8'); ?>" required>

            <label for="category">Category</label>
            <input id="category" name="category" type="text" value="<?php echo htmlspecialchars($category, ENT_QUOTES, 'UTF-8'); ?>" required>

            <label for="price">Price</label>
            <input id="price" name="price" type="number" step="0.01" min="0" value="<?php echo htmlspecialchars($price, ENT_QUOTES, 'UTF-8'); ?>" required>

            <label for="stock">Stock</label>
            <input id="stock" name="stock" type="number" min="0" value="<?php echo htmlspecialchars($stock, ENT_QUOTES, 'UTF-8'); ?>" required>

            <label for="description">Description</label>
            <textarea id="description" name="description" rows="4"><?php echo htmlspecialchars($description, ENT_QUOTES, 'UTF-8'); ?></textarea>

            <button type="submit">Insert Product</button>
        </form>
    </main>
</body>
</html>
