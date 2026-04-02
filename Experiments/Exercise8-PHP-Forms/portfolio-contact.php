<?php
$errors = [];
$success = false;
$values = [
    'name' => '',
    'email' => '',
    'subject' => '',
    'message' => ''
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $values['name'] = trim($_POST['name'] ?? '');
    $values['email'] = trim($_POST['email'] ?? '');
    $values['subject'] = trim($_POST['subject'] ?? '');
    $values['message'] = trim($_POST['message'] ?? '');

    if ($values['name'] === '' || strlen($values['name']) < 2) {
        $errors[] = 'Name must be at least 2 characters.';
    }

    if (!filter_var($values['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Enter a valid email address.';
    }

    if ($values['subject'] === '') {
        $errors[] = 'Subject is required.';
    }

    if ($values['message'] === '' || strlen($values['message']) < 10) {
        $errors[] = 'Message must be at least 10 characters.';
    }

    if (!$errors) {
        $success = true;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercise 8 - Portfolio Form Handling</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <main>
        <h1>Exercise 8: Portfolio Contact Form (PHP Validation)</h1>

        <?php if ($errors): ?>
            <div class="error-list">
                <strong>Please fix the following:</strong>
                <ul>
                    <?php foreach ($errors as $error): ?>
                        <li><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>

        <?php if ($success): ?>
            <div class="success-box">
                <strong>Form submitted successfully.</strong>
                <p>Name: <?php echo htmlspecialchars($values['name'], ENT_QUOTES, 'UTF-8'); ?></p>
                <p>Email: <?php echo htmlspecialchars($values['email'], ENT_QUOTES, 'UTF-8'); ?></p>
                <p>Subject: <?php echo htmlspecialchars($values['subject'], ENT_QUOTES, 'UTF-8'); ?></p>
                <p>Message: <?php echo nl2br(htmlspecialchars($values['message'], ENT_QUOTES, 'UTF-8')); ?></p>
            </div>
        <?php endif; ?>

        <form method="post" action="">
            <label for="name">Name</label>
            <input id="name" name="name" type="text" value="<?php echo htmlspecialchars($values['name'], ENT_QUOTES, 'UTF-8'); ?>" required>

            <label for="email">Email</label>
            <input id="email" name="email" type="email" value="<?php echo htmlspecialchars($values['email'], ENT_QUOTES, 'UTF-8'); ?>" required>

            <label for="subject">Subject</label>
            <input id="subject" name="subject" type="text" value="<?php echo htmlspecialchars($values['subject'], ENT_QUOTES, 'UTF-8'); ?>" required>

            <label for="message">Message</label>
            <textarea id="message" name="message" rows="5" required><?php echo htmlspecialchars($values['message'], ENT_QUOTES, 'UTF-8'); ?></textarea>

            <button type="submit">Submit Contact Form</button>
        </form>
    </main>
</body>
</html>
