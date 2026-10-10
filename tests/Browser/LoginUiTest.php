<?php

use App\Models\User;

// Real-browser tests (Pest Browser Testing, driven by Playwright). They need
// the frontend assets built (`npm run build`) and Playwright's Chromium
// installed (`npx playwright install chromium`), so they are excluded from
// `composer test` and run with `composer test:e2e`.

test('a signed-out visitor is redirected from the dashboard to the login page', function () {
    visit('/dashboard')
        ->assertPathIs('/login')
        ->assertSee('Log in');
});

test('a user can log in through the form and land on the dashboard', function () {
    User::factory()->admin()->create([
        'email' => 'admin@example.test',
        'password' => bcrypt('correct-password'),
    ]);

    visit('/login')
        ->fill('email', 'admin@example.test')
        ->fill('password', 'correct-password')
        ->click('button[type="submit"]')
        ->assertPathIs('/dashboard')
        ->assertSee('Signed in as');
});

test('wrong credentials show an error and stay on the login page', function () {
    visit('/login')
        ->fill('email', 'nobody@example.test')
        ->fill('password', 'wrong')
        ->click('button[type="submit"]')
        ->assertSee('These credentials do not match our records.')
        ->assertPathIs('/login');
});
