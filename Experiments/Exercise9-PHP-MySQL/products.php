<?php
require_once __DIR__ . '/db.php';

$products = [];
$query = 'SELECT id, name, category, price, stock, description, created_at FROM products ORDER BY id DESC';
$result = $connection->query($query);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
    $result->free();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercise 9 - Product Listing</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <main>
        <h1>Exercise 9: Retrieve and Display Products</h1>
        <p><a href="add-product.php">Insert New Product</a></p>

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Description</th>
                    <th>Created</th>
                </tr>
            </thead>
            <tbody>
                <?php if (!$products): ?>
                    <tr>
                        <td colspan="7">No products found. Add products using the insert page.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($products as $product): ?>
                        <tr>
                            <td><?php echo (int)$product['id']; ?></td>
                            <td><?php echo htmlspecialchars($product['name'], ENT_QUOTES, 'UTF-8'); ?></td>
                            <td><?php echo htmlspecialchars($product['category'], ENT_QUOTES, 'UTF-8'); ?></td>
                            <td>$<?php echo number_format((float)$product['price'], 2); ?></td>
                            <td><?php echo (int)$product['stock']; ?></td>
                            <td><?php echo htmlspecialchars($product['description'], ENT_QUOTES, 'UTF-8'); ?></td>
                            <td><?php echo htmlspecialchars($product['created_at'], ENT_QUOTES, 'UTF-8'); ?></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </main>
</body>
</html>
