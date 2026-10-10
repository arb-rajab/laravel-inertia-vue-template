<?php

namespace Tests\Concerns;

use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * RefreshDatabase's migrate:fresh runs against config('database.default')
 * unless told otherwise, which is the app's restricted runtime connection: a
 * role that deliberately cannot create or drop tables. Routing just this
 * schema-bootstrap step through the owning `pgsql_migrator` connection keeps
 * every other test query (the app code under test) running as the real,
 * restricted runtime role, the same as production.
 *
 * This is a wrapper trait rather than an override on Tests\TestCase because
 * PHP resolves a trait used directly on a class ahead of a method inherited
 * from its parent; for a single trait, a method declared on the trait itself
 * takes precedence over one it pulls in from another trait it uses.
 */
trait RefreshesDatabaseAsMigrator
{
    use RefreshDatabase;

    protected function migrateFreshUsing()
    {
        return array_merge(
            [
                '--database' => 'pgsql_migrator',
                '--drop-views' => $this->shouldDropViews(),
                '--drop-types' => $this->shouldDropTypes(),
            ],
            $this->seeder() ? ['--seeder' => $this->seeder()] : ['--seed' => $this->shouldSeed()],
        );
    }
}
