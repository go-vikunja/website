#!/bin/sh

set -e

node /app/dist/server/entry.mjs &

exec nginx -g 'daemon off;'
