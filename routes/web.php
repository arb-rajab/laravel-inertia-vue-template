<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Login and logout live here, not under /api: they are an Inertia page plus a
| session-bootstrap concern, not part of the JSON API contract. `guest` and
| `auth` are Laravel's own middleware aliases.
|
| The embeddable widget (resources/js/widget/) is a standalone Vite build
| (public/widget.js), not a page route: see vite.widget.config.js.
|
*/

Route::get('/login', [AuthenticatedSessionController::class, 'create'])
    ->middleware('guest')
    ->name('login');
Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('guest');
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

Route::get('/', fn () => Inertia::render('Welcome'));

Route::get('/dashboard', fn () => Inertia::render('Dashboard'))
    ->middleware('auth')
    ->name('dashboard');
