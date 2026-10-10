# CLAUDE.md

Repo-specific notes for coding sessions on this Laravel + Inertia + Vue
template. Concrete lessons only; update this file when a session learns
something that would have saved a round trip.

## Layout in one breath

Laravel 12 in the repo root; the Inertia/Vue app is in `resources/js`
(`Pages/`, `Layouts/`, `Components/`, `lib/`, `composables/`, `widget/`).
Vitest tests live in `tests/js`, Pest tests in `tests/Feature` and
`tests/Browser`.

## Fresh-container setup (nothing persists between sessions)

- Postgres roles and databases do not exist yet. Run the bootstrap SQL as the
  `postgres` OS user: `sudo -u postgres psql -v ON_ERROR_STOP=1 -f
  docker/postgres/init/01-roles-and-database.sql`. Never use `psql -h
  127.0.0.1 -U postgres`: with no password configured it hangs on a prompt
  forever instead of failing. Start the server first (`service postgresql
  start`).
- `cp .env.example .env && php artisan key:generate`, then `php artisan
  migrate --database=pgsql_migrator`. A missing `APP_KEY` only shows up as
  `MissingAppKeyException` on the first real HTTP request, not in migrations
  or Pest (`.env.testing` ships a throwaway key).
- `node_modules` is absent too: `npm ci` before `npm run lint` or `npm test`.
- `SQLSTATE[42501] permission denied for table X` against a database created
  some other way is a missing grant on the runtime role, not a bug; the
  bootstrap SQL sets default privileges for tables the migrator creates later.

## Composer in a sandbox

- Anonymous GitHub API zipball downloads get rate-limited: use `composer
  install --prefer-source`. Run `-vvv` and read the last `[403]` URL, not the
  last "Syncing ..." line, to see which package really failed.
- `phpstan/phpstan` has no `source` in its Packagist metadata, so
  `--prefer-source` cannot help it. Either skip `larastan/larastan` locally
  (remove it from `require-dev`, run your tests, then `git checkout --
  composer.json composer.lock`; CI installs it fine) or point a temporary
  `path` repository at the pinned phar. Never commit that workaround.
- As root, `composer <script>` aborts ("no plugin should be loaded if running
  as super user"). Call `./vendor/bin/pest` and `./vendor/bin/pint` directly,
  or set `COMPOSER_ALLOW_SUPERUSER=1`.

## Tests

- `composer test` is `pest --exclude-group=browser`; the browser suite is
  `composer test:e2e` and needs `npm run build` plus Playwright's Chromium
  (`npx playwright install chromium`; if the environment already has one,
  point Playwright at it instead of downloading another).
- `pestphp/pest-plugin-browser` needs the `sockets` and `pcntl` PHP extensions
  for every `pest` run once it is installed, not only the browser suite.
- Never use SQLite. The runtime/migrator role split is Postgres-only.
- Laravel skips CSRF verification during any Pest run. To prove CSRF is
  enforced, rebind the container's `env` away from `testing` (see
  `tests/Feature/CsrfProtectionTest.php`).
- The test HTTP client does not carry cookies between requests: to test
  session behaviour across requests, forward the issued cookie by hand (see
  `tests/Feature/LoginRateLimitTest.php`).
- `Tests\Concerns\RefreshesDatabaseAsMigrator` is applied with Pest's `uses()`,
  not as an override on `TestCase`: a trait used directly on a class wins over
  a method inherited from its parent, so a `TestCase` override would be
  silently shadowed.
- `TrustProxies` keeps static state for the whole PHP process: reset it with
  `TrustProxies::flushState()` before and after any test that touches it.
- Run `./vendor/bin/pint` once at the end of a batch of edits rather than
  formatting file by file.

## Front end

- Vitest runs on happy-dom with Vue Test Utils. Inertia's `usePage()` only
  works inside a running Inertia app, so tests mock `@inertiajs/vue3` (see
  `tests/js/Login.test.js`).
- Pages that POST with `fetch()` instead of Inertia's `useForm` must send the
  shared `csrfToken` prop as `X-CSRF-TOKEN`; `lib/api.js` (`postJson`) does.
- Tailwind only generates classes it finds in `content` (see
  `tailwind.config.js`): build class names whole, never by string
  concatenation.
- The widget bundle is a separate Vite build (`vite.widget.config.js`) that
  must not import Inertia, Blade or Laravel's asset manifest: it runs on a
  third-party page.
- Error pages are rendered by `App\Exceptions\InertiaErrorPage` only when
  `APP_DEBUG=false`; a request that did not match any route has no `auth`
  shared prop, so layouts must read it defensively.

## Gotchas in production images

- `route:cache` cannot serialise the closure routes in `routes/web.php`; the
  entrypoint therefore caches only config and views. Move the closures to
  controllers before adding it.
- Behind a proxy set `TRUSTED_PROXIES` to the proxy address/CIDR (never `*`),
  or every IP-keyed control collapses into one bucket.
- `npm ci` on an Alpine/musl Node image trips npm's optional-dependency bug;
  the Dockerfiles use `node:22-slim`.

## Static analysis

Larastan level 8 over `app/`. Fix findings; do not add baseline entries or
`@phpstan-ignore` to silence them.
