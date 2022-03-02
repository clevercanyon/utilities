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
# Perfoms a version comparison.
#
# @since 2022-02-28
#
# @param string ${1} Version to compare.
# @param string ${2} Version to compare to.
# @param string ${3} Operator for comparison.
#
# @output void No output.
# @return int `0` (true) if comparison is true.
##
function version-compare() {
  local v1="'${1:-}'"; # Version 1.
  local v2="'${2:-}'"; # Version 2.
  local op="'${3:-}'"; # Comparison operator.

  if can-run php && [[ "$(php -r 'echo (int) version_compare('"${v1}"', '"${v2}"', '"${op}"');')" == 1 ]]; then
    return 0;
  else
    return 1;
  fi;
};
