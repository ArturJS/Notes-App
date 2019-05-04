#!/bin/sh

SEL_STATUS_URL="${SELENIUM_HUB_URL}/wd/hub/status"

# set -e: exit asap if a command exits with a non-zero status
set -e

echo "Waiting for Selenium Hub to be ready..."

# Selenium <= 3.3.1 then: while ! curl -s "${SEL_STATUS_URL}" | jq '.status' | grep "13"; do
# SUCESS_CMD="jq .status | grep 13"

# Selenium >= 3.5.0 then: while ! curl -s "${SEL_STATUS_URL}" | jq '.status' | grep "0"; do
SUCESS_CMD="jq .status | grep 0"

while ! curl -s "${SEL_STATUS_URL}" | sh -c "${SUCESS_CMD}"; do
  echo -n '.'
  sleep 1
done
sleep 5
echo "Done wait-selenium-hub.sh"
