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
# Loads utilities.
#
# @since 2022-02-28
##

___cwd="$(pwd)"; # Remember CWD.

if ! cd "$(dirname "${BASH_SOURCE[0]}")"; then
	echo -e "\e[38;5;255m\e[48;5;124m\e[1mFailed to CD into: ${BASH_SOURCE[0]}\e[0m\e[49m\e[39m";
	exit 1; # Exit w/ error status.
fi;
. ./includes/strict-mode.bash;
. ./includes/shell-options.bash;

for ___file in ./functions/**.bash; do
	# shellcheck source=functions/**.bash;
	[[ -f "${___file}" ]] && . "${___file}";
done;
cd "${___cwd}" || exit 1;    # Restore.
unset ___cwd; unset ___file; # Housekeeping.
