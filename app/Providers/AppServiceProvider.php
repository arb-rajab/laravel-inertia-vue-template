<?php

namespace App\Providers;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // API resources return their fields at the top level, without
        // Laravel's default "data" envelope.
        JsonResource::withoutWrapping();
    }
}
