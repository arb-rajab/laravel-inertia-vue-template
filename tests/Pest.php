<?php

use Tests\Concerns\RefreshesDatabaseAsMigrator;
use Tests\TestCase;

// RefreshesDatabaseAsMigrator is a trait applied through Pest's uses(), not a
// method override on Tests\TestCase: Pest's generated test classes `use` the
// trait directly, and PHP resolves a trait used directly on a class ahead of
// a method inherited from its parent, so an override on TestCase would be
// silently shadowed.
uses(TestCase::class, RefreshesDatabaseAsMigrator::class)->in('Feature');
uses(TestCase::class, RefreshesDatabaseAsMigrator::class)->in('Browser');

// Feature tests render Inertia pages without a built front end: stub out the
// @vite() directive instead of requiring `npm run build` first. Browser tests
// need the real built assets, so they are deliberately not covered.
pest()->beforeEach(fn () => $this->withoutVite())->in('Feature');

pest()->group('browser')->in('Browser');
