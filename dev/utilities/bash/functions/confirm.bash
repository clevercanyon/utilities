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
# Performs a y|n confirmation.
#
# @since 2022-02-28
#
# @param string ${1} Question to ask.
#
# @output string Question.
# @return int `0` (true) if `y` (yes).
##
function confirm() {
	local question="${1:-}";

	if [[ -z "${question}" ]]; then
		question='Are you sure?';
	fi;
	read -p "${question}"' [y|n] ' -n 1 -r;

	if [[ "${REPLY:-}" =~ ^[Yy]$ ]]; then
		return 0;
	else
		return 1;
	fi;
}
