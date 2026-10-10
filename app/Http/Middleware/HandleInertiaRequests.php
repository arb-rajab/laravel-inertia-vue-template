<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Props shared with every Inertia page.
     *
     * `auth.user` is an explicit allow-list of the fields a page might show,
     * not the whole model (hidden attributes are already excluded, but an
     * allow-list does not rely on that alone).
     *
     * `csrfToken` is for pages that POST with fetch() directly instead of
     * Inertia's own axios instance, which would attach the equivalent
     * XSRF-TOKEN header automatically.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ] : null,
            ],
            'csrfToken' => csrf_token(),
            'appName' => config('app.name'),
        ];
    }
}
