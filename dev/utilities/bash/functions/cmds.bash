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
# Runs a command using `${PATH}`; ignoring functions.
#
# Takes `${PATH}` into consideration.
#
# @since 2022-02-28
#
# @param string ${1} Command name.
# @param mixed ...${@} Variadic.
#
# @output mixed Based on command being run.
# @return int Exit status of command being run.
##
function ::() {
  if [[ "${1:-}" == cd || "${1:-}" == dirs ]]; then
    builtin "${@}";
  else
    command "${@}"; # <https://askubuntu.com/q/512770>
  fi;
};

##
# Runs a command using `${PATH}`; ignoring functions.
#
# Forces a system default `${PATH}` via `-p` option.
#
# @since 2022-02-28
#
# @param string ${1} Command name.
# @param mixed ...${@} Variadic.
#
# @output mixed Based on command being run.
# @return int Exit status of command being run.
##
function :::() {
  if [[ "${1:-}" == cd || "${1:-}" == dirs ]]; then
    builtin "${@}";
  else
    command -p "${@}"; # <https://askubuntu.com/q/512770>
  fi;
};
