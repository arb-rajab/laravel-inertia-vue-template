<?php

namespace App\Exceptions;

use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * Renders the `Error` Inertia page for 403, 404, 500 and 503 responses to
 * browser (non-JSON) requests, so errors keep the application layout instead
 * of Laravel's bare error views. In debug mode Laravel's own error page is
 * kept, because the stack trace is what a developer wants there. JSON
 * requests are handled by ApiExceptionRenderer and never reach this.
 */
final class InertiaErrorPage
{
    /** @var list<int> */
    private const STATUSES = [403, 404, 500, 503];

    public static function register(Exceptions $exceptions): void
    {
        $exceptions->respond(function (Response $response, Throwable $e, Request $request): Response {
            $status = $response->getStatusCode();

            if (app()->hasDebugModeEnabled()
                || ! in_array($status, self::STATUSES, true)
                || $request->is('api/*')
                || $request->expectsJson()) {
                return $response;
            }

            return Inertia::render('Error', ['status' => $status])
                ->toResponse($request)
                ->setStatusCode($status);
        });
    }
}
