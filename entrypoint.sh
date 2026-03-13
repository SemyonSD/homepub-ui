#!/bin/sh
set -e
export PORT="${PORT:-80}"
export API_UPSTREAM="${API_UPSTREAM:-http://api:3000}"
# Derive host for SNI (Render requires correct SNI for TLS)
export API_UPSTREAM_HOST="${API_UPSTREAM_HOST:-$(echo "$API_UPSTREAM" | sed -e 's|https\?://||' -e 's|/.*||')}"
envsubst '${PORT} ${API_UPSTREAM} ${API_UPSTREAM_HOST}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'
