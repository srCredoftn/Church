#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/backup_frontend.sh [source_dir] [backup_dir]
# Default source: www.vaticannews.va
# Default backup dir: backups

SOURCE_DIR=${1:-"www.vaticannews.va"}
BACKUP_DIR=${2:-"backups"}
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
ARCHIVE_NAME="${BACKUP_DIR}/www-vaticannews-va-${TIMESTAMP}.tar.gz"

mkdir -p "${BACKUP_DIR}"
if [ ! -d "${SOURCE_DIR}" ]; then
  echo "Source directory '${SOURCE_DIR}' does not exist. Aborting."
  exit 1
fi

echo "Creating backup of ${SOURCE_DIR} -> ${ARCHIVE_NAME}"
tar -czf "${ARCHIVE_NAME}" "${SOURCE_DIR}"

echo "Backup complete: ${ARCHIVE_NAME}"
