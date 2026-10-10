<?php

use Illuminate\Http\Middleware\TrustProxies;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// In a real deployment the app sits behind a reverse proxy. Without a
// trusted-proxy configuration, $request->ip() is the proxy's own address for
// every request, collapsing every IP-keyed control into one shared bucket.
// bootstrap/app.php wires TRUSTED_PROXIES into Laravel's TrustProxies
// middleware; these tests drive that exact mechanism.
//
// TrustProxies::at()/withHeaders() store *static* class state shared for the
// whole PHP process, so every test resets it before and after: otherwise one
// test's trusted-proxy configuration would leak into unrelated tests.
beforeEach(function () {
    TrustProxies::flushState();

    Route::middleware('web')->get('/_test/ip', fn (Request $request) => response()->json(['ip' => $request->ip()]));
});

afterEach(fn () => TrustProxies::flushState());

test('with no trusted proxy configured, a spoofed X-Forwarded-For is ignored and ip() is the direct peer', function () {
    $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.9'])
        ->getJson('/_test/ip', ['X-Forwarded-For' => '198.51.100.1'])
        ->assertJson(['ip' => '203.0.113.9']);
});

test('a request through the trusted proxy resolves ip() to the real client, not the proxy', function () {
    TrustProxies::at(['10.10.0.5']);
    TrustProxies::withHeaders(Request::HEADER_X_FORWARDED_FOR);

    $this->withServerVariables(['REMOTE_ADDR' => '10.10.0.5'])
        ->getJson('/_test/ip', ['X-Forwarded-For' => '203.0.113.7'])
        ->assertJson(['ip' => '203.0.113.7']);
});

test('a spoofed X-Forwarded-For from an address that is not the trusted proxy is not trusted', function () {
    TrustProxies::at(['10.10.0.5']);
    TrustProxies::withHeaders(Request::HEADER_X_FORWARDED_FOR);

    $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.50'])
        ->getJson('/_test/ip', ['X-Forwarded-For' => '1.2.3.4'])
        ->assertJson(['ip' => '198.51.100.50']);
});
