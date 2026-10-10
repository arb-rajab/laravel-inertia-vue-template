<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Scheduled commands go here, e.g. Schedule::command('your:command')->daily();
// A real `* * * * * php artisan schedule:run` cron entry (or a scheduler
// container) is required wherever this deploys.
