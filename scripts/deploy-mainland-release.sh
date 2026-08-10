#!/usr/bin/env bash

set -Eeuo pipefail

readonly DEPLOY_PATH="/var/www/maayuan-docs"
readonly STAGING_ROOT="/var/www/maayuan-docs-staging"
readonly INCOMING_PATH="${STAGING_ROOT}/incoming"
readonly PREVIOUS_PATH="${DEPLOY_PATH}_old"

if (( EUID != 0 )); then
  echo "This deployment script must run as root." >&2
  exit 1
fi

if [[ ! -d "${INCOMING_PATH}" || -L "${INCOMING_PATH}" ]]; then
  echo "Incoming release is missing or is not a regular directory: ${INCOMING_PATH}" >&2
  exit 1
fi

if [[ ! -f "${INCOMING_PATH}/index.html" ]]; then
  echo "Incoming release does not contain index.html." >&2
  exit 1
fi

rm -rf -- "${PREVIOUS_PATH}"

had_previous_release=false
if [[ -e "${DEPLOY_PATH}" || -L "${DEPLOY_PATH}" ]]; then
  mv -- "${DEPLOY_PATH}" "${PREVIOUS_PATH}"
  had_previous_release=true
fi

restore_previous_release() {
  rm -rf -- "${DEPLOY_PATH}"
  if [[ "${had_previous_release}" == true && -e "${PREVIOUS_PATH}" ]]; then
    mv -- "${PREVIOUS_PATH}" "${DEPLOY_PATH}"
  fi
}

if ! mv -- "${INCOMING_PATH}" "${DEPLOY_PATH}"; then
  restore_previous_release
  echo "Failed to activate the incoming release; the previous release was restored." >&2
  exit 1
fi

if ! chown -R root:root "${DEPLOY_PATH}" || ! chmod -R u=rwX,go=rX "${DEPLOY_PATH}"; then
  restore_previous_release
  echo "Failed to secure the new release; the previous release was restored." >&2
  exit 1
fi

rm -rf -- "${PREVIOUS_PATH}"
echo "✅ Switched mainland site to the new version successfully"
