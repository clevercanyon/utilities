#!/usr/bin/env bash

___cwd="$(pwd)"; # Remember CWD.
# Change directory for relative paths.
cd "$(dirname "${BASH_SOURCE[0]}")" || exit 1;

. ./bash/partials/strict-mode;
. ./bash/partials/shell-options;

for ___file in ./bash/functions/**; do
	# shellcheck source=bash/functions/**;
	[[ -f "${___file}" ]] && . "${___file}";
done; unset ___file;

# Move back to CWD.
cd "${___cwd}" || exit 1; # Restore.
unset ___cwd; # Housekeeping.
