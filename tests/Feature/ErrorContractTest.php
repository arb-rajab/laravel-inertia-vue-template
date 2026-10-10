<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;

/*
 * The error contract documented on App\Exceptions\ApiExceptionRenderer:
 * JSON clients get {"error": "CODE"} (plus "fields" for validation), never
 * Laravel's default {"message": ...} shapes. Browser requests get the
 * Inertia `Error` page instead (App\Exceptions\InertiaErrorPage).
 */

test('a validation failure renders VALIDATION_FAILED with the offending fields', function () {
    postJson('/login', [])
        ->assertStatus(422)
        ->assertJsonPath('error', 'VALIDATION_FAILED')
        ->assertJsonStructure(['fields' => ['email', 'password']]);
});

test('an unauthenticated api request renders UNAUTHENTICATED', function () {
    getJson('/api/v1/me')->assertStatus(401)->assertExactJson(['error' => 'UNAUTHENTICATED']);
});

test('an unmatched api route renders NOT_FOUND', function () {
    getJson('/api/v1/nope')->assertStatus(404)->assertExactJson(['error' => 'NOT_FOUND']);
});

test('a disallowed method on an api route renders the generic HTTP_ERROR code', function () {
    $this->deleteJson('/api/v1/me')->assertStatus(405)->assertExactJson(['error' => 'HTTP_ERROR']);
});

test('a signed-in user gets their own data from the api', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)->getJson('/api/v1/me')
        ->assertOk()
        ->assertExactJson(['name' => $user->name, 'email' => $user->email, 'role' => 'admin']);
});

test('a browser 404 renders the Inertia Error page when debug is off', function () {
    config(['app.debug' => false]);

    $this->get('/definitely-not-a-route')
        ->assertStatus(404)
        ->assertInertia(fn (Assert $page) => $page->component('Error')->where('status', 404));
});

test('debug mode keeps the framework error page', function () {
    config(['app.debug' => true]);

    $this->get('/definitely-not-a-route')->assertStatus(404)->assertDontSee('data-page', false);
});
