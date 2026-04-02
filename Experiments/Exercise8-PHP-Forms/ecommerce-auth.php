<?php
$registerErrors = [];
$loginErrors = [];
$registerSuccess = false;
$loginSuccess = false;

$registerData = [
    'full_name' => '',
    'email' => '',
    'phone' => ''
];

$loginData = [
    'login_email' => ''
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $formType = $_POST['form_type'] ?? '';

    if ($formType === 'register') {
        $registerData['full_name'] = trim($_POST['full_name'] ?? '');
        $registerData['email'] = trim($_POST['email'] ?? '');
        $registerData['phone'] = trim($_POST['phone'] ?? '');
        $password = $_POST['password'] ?? '';
        $confirmPassword = $_POST['confirm_password'] ?? '';

        if ($registerData['full_name'] === '' || strlen($registerData['full_name']) < 2) {
            $registerErrors[] = 'Full name must be at least 2 characters.';
        }

        if (!filter_var($registerData['email'], FILTER_VALIDATE_EMAIL)) {
            $registerErrors[] = 'Enter a valid registration email.';
        }

        if (!preg_match('/^[0-9\-\+\s]{7,20}$/', $registerData['phone'])) {
            $registerErrors[] = 'Enter a valid phone number.';
        }

        if (strlen($password) < 8) {
            $registerErrors[] = 'Password must be at least 8 characters.';
        }

        if ($password !== $confirmPassword) {
            $registerErrors[] = 'Password and confirm password must match.';
        }

        if (!$registerErrors) {
            $registerSuccess = true;
        }
    }

    if ($formType === 'login') {
        $loginData['login_email'] = trim($_POST['login_email'] ?? '');
        $loginPassword = $_POST['login_password'] ?? '';

        if (!filter_var($loginData['login_email'], FILTER_VALIDATE_EMAIL)) {
            $loginErrors[] = 'Enter a valid login email.';
        }

        if ($loginPassword === '') {
            $loginErrors[] = 'Password is required.';
        }

        if (!$loginErrors) {
            $loginSuccess = true;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercise 8 - E-commerce Forms Handling</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <main>
        <h1>Exercise 8: E-commerce Registration and Login (PHP Validation)</h1>

        <div class="grid">
            <section>
                <h2>Registration Form</h2>

                <?php if ($registerErrors): ?>
                    <div class="error-list">
                        <strong>Registration errors:</strong>
                        <ul>
                            <?php foreach ($registerErrors as $error): ?>
                                <li><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                <?php endif; ?>

                <?php if ($registerSuccess): ?>
                    <div class="success-box">
                        Registration validated for <?php echo htmlspecialchars($registerData['full_name'], ENT_QUOTES, 'UTF-8'); ?>.
                    </div>
                <?php endif; ?>

                <form method="post" action="">
                    <input type="hidden" name="form_type" value="register">

                    <label for="full_name">Full Name</label>
                    <input id="full_name" name="full_name" type="text" value="<?php echo htmlspecialchars($registerData['full_name'], ENT_QUOTES, 'UTF-8'); ?>" required>

                    <label for="email">Email</label>
                    <input id="email" name="email" type="email" value="<?php echo htmlspecialchars($registerData['email'], ENT_QUOTES, 'UTF-8'); ?>" required>

                    <label for="phone">Phone</label>
                    <input id="phone" name="phone" type="text" value="<?php echo htmlspecialchars($registerData['phone'], ENT_QUOTES, 'UTF-8'); ?>" required>

                    <label for="password">Password</label>
                    <input id="password" name="password" type="password" required>

                    <label for="confirm_password">Confirm Password</label>
                    <input id="confirm_password" name="confirm_password" type="password" required>

                    <button type="submit">Validate Registration</button>
                </form>
            </section>

            <section>
                <h2>Login Form</h2>

                <?php if ($loginErrors): ?>
                    <div class="error-list">
                        <strong>Login errors:</strong>
                        <ul>
                            <?php foreach ($loginErrors as $error): ?>
                                <li><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                <?php endif; ?>

                <?php if ($loginSuccess): ?>
                    <div class="success-box">
                        Login input validated for <?php echo htmlspecialchars($loginData['login_email'], ENT_QUOTES, 'UTF-8'); ?>.
                    </div>
                <?php endif; ?>

                <form method="post" action="">
                    <input type="hidden" name="form_type" value="login">

                    <label for="login_email">Email</label>
                    <input id="login_email" name="login_email" type="email" value="<?php echo htmlspecialchars($loginData['login_email'], ENT_QUOTES, 'UTF-8'); ?>" required>

                    <label for="login_password">Password</label>
                    <input id="login_password" name="login_password" type="password" required>

                    <button type="submit">Validate Login</button>
                </form>
            </section>
        </div>
    </main>
</body>
</html>
