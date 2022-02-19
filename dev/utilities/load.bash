#!/usr/bin/env bash

cd "$(dirname "${BASH_SOURCE[0]}")" || exit 1;

. ./bash/partials/strict-mode;
. ./bash/partials/shell-options;
. ./bash/partials/stack-trace;

for ___file in ./bash/functions/**; do
	# shellcheck source=bash/functions/**;
	[[ -f "${___file}" ]] && . "${___file}";
done; unset ___file;
