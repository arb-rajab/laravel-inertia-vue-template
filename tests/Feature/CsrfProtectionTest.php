<?php

use App\Models\User;
use Illuminate\Testing\TestResponse;

// Laravel's CSRF middleware skips verification entirely whenever
// app()->runningUnitTests() is true: every ordinary Pest feature test,
// including every actingAs()->postJson() call, is exempt. Asserting "the
// route works" therefore proves nothing about CSRF being enforced. This file
// defeats that escape hatch by rebinding the container's 'env' value away from
// 'testing', so the real token-matching logic runs on a real route.

function bypassCsrfTestingShortcut(): void
{
    app()->instance('env', 'production');
}

function csrfSessionCookieFrom(TestResponse $response): ?string
{
    $name = config('session.cookie');

    foreach ($response->headers->getCookies() as $cookie) {
        if ($cookie->getName() === $name) {
            return $cookie->getValue();
        }
    }

    return null;
}

test('a state-changing request without a CSRF token is rejected, even from an authenticated session', function () {
    bypassCsrfTestingShortcut();

    // actingAs() authenticates the guard directly, independent of session
    // cookies: this proves the rejection is not "you were not logged in".
    $this->actingAs(User::factory()->create())
        ->postJson('/logout')
        ->assertStatus(419);
});

test('a state-changing request with a valid CSRF token succeeds', function () {
    bypassCsrfTestingShortcut();

    $user = User::factory()->create();
    $sessionCookieName = config('session.cookie');

    // Establish a real session with a plain GET, capture its actual CSRF token
    // and session cookie, then forward both on the state-changing request:
    // exactly what a browser does via the XSRF-TOKEN cookie.
    $bootstrap = $this->actingAs($user)->getJson('/api/v1/me');
    $bootstrap->assertOk();

    $token = session()->token();
    $sessionId = csrfSessionCookieFrom($bootstrap);
    expect($token)->not->toBeNull();
    expect($sessionId)->not->toBeNull();

    $this->actingAs($user)
        ->withUnencryptedCookie($sessionCookieName, $sessionId)
        ->withHeaders(['X-CSRF-TOKEN' => $token])
        ->postJson('/logout')
        ->assertOk();
});
