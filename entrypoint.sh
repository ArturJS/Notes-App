#!/bin/sh

# shellcheck disable=SC2086
exec wait-for --timeout "${WAIT_FOR_TIMEOUT:-30}" $WAIT_FOR_HOSTS -- \
  nightwatch "$@"
