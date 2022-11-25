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
# Perl regexp search and replace file contents.
#
# Regarding `-0`; {@see https://unix.stackexchange.com/a/555955/259383}.
# It causes the search/replace to occur throughout the entire file contents.
# Without `-0` it would be searching on a line-by-line basis.
#
# @since 2022-02-28
#
# @param string ${1} Regular expression (PCRE).
# @param string ${2} Replacement string with optional backreferences.
# @param string ${3} File path to search & replace in.
#
# @output void No output.
# @return int `0` (true) on success.
##
function preg-replace-in-file() {
	local regexp="${1:-}";
	local replace="${2:-}";
	local file="${3:-}";

	perl -i -0wpe 's/'"${regexp}"'/'"$(esc-reg-brs "${replace}")"'/ug' "${file}";
};

##
# Perl regexp search and replace file contents (caSe-insensitive).
#
# Regarding `-0`; {@see https://unix.stackexchange.com/a/555955/259383}.
# It causes the search/replace to occur throughout the entire file contents.
# Without `-0` it would be searching on a line-by-line basis.
#
# @since 2022-02-28
#
# @param string ${1} Regular expression (PCRE).
# @param string ${2} Replacement string with optional backreferences.
# @param string ${3} File path to search & replace in.
#
# @output void No output.
# @return int `0` (true) on success.
##
function preg-ireplace-in-file() {
	local regexp="${1:-}";
	local replace="${2:-}";
	local file="${3:-}";

	perl -i -0wpe 's/'"${regexp}"'/'"$(esc-reg-brs "${replace}")"'/uig' "${file}";
};
