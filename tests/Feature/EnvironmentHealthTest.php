<?php

use function Pest\Laravel\get;

// Verifies the environment: the app boots, routes resolve, and Laravel's
// built-in health check responds. It is deliberately not a feature test.
test('the application boots and the health check responds', function () {
    get('/up')->assertStatus(200);
});
