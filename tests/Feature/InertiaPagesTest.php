<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('the welcome page renders with no signed-in user shared', function () {
    $this->get('/')->assertInertia(fn (Assert $page) => $page
        ->component('Welcome')
        ->where('auth.user', null)
        ->has('csrfToken'));
});

test('the shared auth.user prop is an allow-list, never the whole model', function () {
    $user = User::factory()->admin()->create(['name' => 'Ada']);

    $this->actingAs($user)->get('/dashboard')->assertInertia(fn (Assert $page) => $page
        ->component('Dashboard')
        ->where('auth.user.name', 'Ada')
        ->where('auth.user.role', 'admin')
        ->missing('auth.user.password')
        ->missing('auth.user.id'));
});

test('the dashboard redirects a guest to the login page', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

test('the login page redirects an already signed-in user away', function () {
    $this->actingAs(User::factory()->create())->get('/login')->assertRedirect();
});
