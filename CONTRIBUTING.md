# Contributing

## Workflow

- **Branching:** trunk-based. Branch from `main` as `feat/<slug>`, `fix/<slug>`,
  `chore/<slug>` or `sec/<slug>`.
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/)
  (`feat:`, `fix:`, `docs:`, `test:`, `ci:`, `refactor:`, `chore:`).
- **Pull requests:** pass CI (lint, static analysis, tests, security scans) and
  use the PR template. Open an issue before a large change.

## Development setup

See [`README.md`](README.md#getting-started) for the full local setup.

Before opening a PR:

- `composer ci:check` must exit 0. It runs Pint (style), Larastan/PHPStan
  (static analysis) and the Pest suite (browser tests excluded).
- `npm run lint` and `npm test` must pass for frontend changes.
- Browser tests (`composer test:e2e`) need `npm run build` and Playwright's
  Chromium; run them when you touch a page or the login flow.

Run `composer lint:fix` and `npm run lint:fix` once at the end of a batch of
edits instead of formatting by hand.

## Reporting security issues

See [`SECURITY.md`](SECURITY.md). Do not use public issues for vulnerabilities.

## Code of conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md).
