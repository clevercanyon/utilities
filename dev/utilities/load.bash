#!/usr/bin/env bash
##
# Clever Canyon™ {@see https://clevercanyon.com}
#
#  CCCCC  LL      EEEEEEE VV     VV EEEEEEE RRRRRR      CCCCC    AAA   NN   NN YY   YY  OOOOO  NN   NN ™
# CC      LL      EE      VV     VV EE      RR   RR    CC       AAAAA  NNN  NN YY   YY OO   OO NNN  NN
# CC      LL      EEEEE    VV   VV  EEEEE   RRRRRR     CC      AA   AA NN N NN  YYYYY  OO   OO NN N NN
# CC      LL      EE        VV VV   EE      RR  RR     CC      AAAAAAA NN  NNN   YYY   OO   OO NN  NNN
#  CCCCC  LLLLLLL EEEEEEE    VVV    EEEEEEE RR   RR     CCCCC  AA   AA NN   NN   YYY    OOOO0  NN   NN
##

##
# Loads bash functions.
#
# @since 2022-02-28
##
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
