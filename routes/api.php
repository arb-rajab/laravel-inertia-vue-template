<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Routes here are versioned under /api/v1 and answer errors in RFC 9457
| Problem Details form (bootstrap/app.php). Routes that need the signed-in
| staff session add the `web` middleware group, which is what carries the
| session cookie and CSRF protection onto an api.php route: there is
| deliberately no Sanctum dependency.
|
*/

Route::prefix('v1')->group(function () {
    Route::middleware(['web', 'auth'])->group(function () {
        Route::get('/me', fn (Request $request) => response()->json([
            'name' => $request->user()?->name,
            'email' => $request->user()?->email,
            'role' => $request->user()?->role,
        ]));
    });
});
