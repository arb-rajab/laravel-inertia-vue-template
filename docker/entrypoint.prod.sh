#!/bin/sh
set -eu

# Config and view caching happen at container start, not at image build time:
# config:cache bakes the current environment into a compiled file, and this
# image is generic across deployments with different environment variables.
#
# route:cache is deliberately not run: the Inertia page routes in
# routes/web.php are closures, which Laravel cannot serialise, so it would
# crash-loop every start. Move them to controllers before adding it.
php artisan config:cache
php artisan view:cache

exec "$@"
