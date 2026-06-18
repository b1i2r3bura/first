<?php $pageTitle = 'Login | Daily Progress Report'; ?>
<?php include __DIR__ . '/../partials/header.php'; ?>

<section class="auth-layout">
    <div class="auth-panel">
        <p class="eyebrow">Welcome back</p>
        <h1>Login to your site workspace.</h1>
        <form action="<?= base_url('login.php') ?>" method="post" class="form-card">
            <label>Email address
                <input type="email" name="email" placeholder="admin@dailyprogress.test" required>
            </label>
            <label>Password
                <input type="password" name="password" placeholder="At least 6 characters" required minlength="6">
            </label>
            <button class="button primary full" type="submit">Login</button>
        </form>
        <p class="muted">No account yet? <a href="<?= base_url('register.php') ?>">Create one here</a>.</p>
    </div>
    <aside class="auth-note">
        <strong>Demo accounts</strong>
        <p>Admin: admin@dailyprogress.test</p>
        <p>Staff: staff@dailyprogress.test</p>
        <p>Password: password</p>
    </aside>
</section>

<?php include __DIR__ . '/../partials/footer.php'; ?>
