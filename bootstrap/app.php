<?php

use App\Exceptions\ApiExceptionRenderer;
use App\Exceptions\InertiaErrorPage;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);

        // Behind a reverse proxy, $request->ip() would otherwise resolve to
        // the proxy's own address for every request, collapsing every IP-keyed
        // control (login lockout, rate limiters) into one shared bucket that a
        // single bad actor can exhaust.
        //
        // TRUSTED_PROXIES lists only the proxy address(es)/CIDR(s) this
        // deployment actually sits behind, never '*', which would let anyone
        // able to reach the app directly spoof X-Forwarded-For. Empty by
        // default (.env.example, local `php artisan serve`, tests), so nothing
        // is trusted and ip() resolves to the real, directly connecting peer.
        $trustedProxies = array_values(array_filter(array_map(
            'trim',
            explode(',', (string) env('TRUSTED_PROXIES', ''))
        )));

        if ($trustedProxies !== []) {
            $middleware->trustProxies(
                at: $trustedProxies,
                headers: Request::HEADER_X_FORWARDED_FOR
                    | Request::HEADER_X_FORWARDED_HOST
                    | Request::HEADER_X_FORWARDED_PORT
                    | Request::HEADER_X_FORWARDED_PROTO,
            );
        }
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // JSON clients get the {"error": "CODE", "fields"?: {...}} contract;
        // browser requests get the Inertia error page.
        ApiExceptionRenderer::register($exceptions);
        InertiaErrorPage::register($exceptions);
    })->create();
