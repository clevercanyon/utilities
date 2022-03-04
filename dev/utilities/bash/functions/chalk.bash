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
# ---------------------------------------------------------------------------------------------------------------------
# Chalk; i.e., colorized output.
# ---------------------------------------------------------------------------------------------------------------------

##
# Outputs a new line.
#
# @since 2022-02-28
#
# @output string New line.
# @return int `0` (true) on success.
##
function chalk-new-line() { echo; };

##
# Outputs a horizontal line.
#
# @since 2022-02-28
#
# @output string Horizontal line.
# @return int `0` (true) on success.
##
function chalk-horiz-line {
	echo '----------------------------------------------------------------------------------------------------';
}

##
# Outputs a string in default color.
#
# @since 2022-02-28
#
# @param string ${1} String.
#
# @output string Colorized string.
# @return int `0` (true) on success.
##
function chalk-output() { echo -e "${1:-}"; };

##
# Outputs a string in heading color.
#
# @since 2022-02-28
#
# @param string ${1} String.
#
# @output string Colorized string.
# @return int `0` (true) on success.
##
function chalk-heading() {
	if ! is-256-colors; then
		echo "${1:-}";
	elif is-chalk-on-dark-bg; then
		echo -e "\e[38;5;212m\e[1m${1:-}\e[0m\e[39m";
	else
		echo -e "\e[38;5;132m\e[1m${1:-}\e[0m\e[39m";
	fi;
};

##
# Outputs a string in default color (dimmed).
#
# Typically used to output verbose details.
#
# @since 2022-02-28
#
# @param string ${1} String.
#
# @output string Colorized string.
# @return int `0` (true) on success.
##
function chalk-log() {
	if ! is-256-colors; then
		echo "${1:-}";
	elif is-chalk-on-dark-bg; then
		echo -e "\e[38;5;255m\e[2m${1:-}\e[0m\e[39m";
	else
		echo -e "\e[38;5;232m\e[2m${1:-}\e[0m\e[39m";
	fi;
};

# ---------------------------------------------------------------------------------------------------------------------
# Colorized output inspired by Bootstrap alerts: `info|warning|danger|success`.
# ---------------------------------------------------------------------------------------------------------------------
# The hilite variants below use a background instead; i.e., behind white text to grab extra attention.
# Note: `info` = blue, `warning` = orange, `danger` = red, `success` = green.
# {@see https://getbootstrap.com/docs/4.0/components/alerts/}.

##
# Outputs string in a dynamic blue color.
#
# @since 2022-02-28
#
# @param string ${1} String.
#
# @output string Colorized string.
# @return int `0` (true) on success.
##
function chalk-info() {
	if ! is-256-colors; then
		echo "${1:-}";
	elif is-chalk-on-dark-bg; then
		echo -e "\e[38;5;39m\e[1m${1:-}\e[0m\e[39m";
	else
		echo -e "\e[38;5;26m\e[1m${1:-}\e[0m\e[39m";
	fi;
};

##
# Outputs string in a dynamic blue color (hilite variant).
#
# Uses a background behind white text to grab extra attention.
#
# @since 2022-02-28
#
# @param string ${1} String.
#
# @output string Colorized string.
# @return int `0` (true) on success.
##
function chalk-info-hilite() {
	if ! is-256-colors; then
		echo "${1:-}";
	else
		echo -e "\e[38;5;255m\e[48;5;26m\e[1m${1:-}\e[0m\e[49m\e[39m";
	fi;
};

##
# Outputs string in a dynamic orange color.
#
# @since 2022-02-28
#
# @param string ${1} String.
#
# @output string Colorized string.
# @return int `0` (true) on success.
##
function chalk-warning() {
	if ! is-256-colors; then
		echo "${1:-}";
	elif is-chalk-on-dark-bg; then
		echo -e "\e[38;5;214m\e[1m${1:-}\e[0m\e[39m";
	else
		echo -e "\e[38;5;130m\e[1m${1:-}\e[0m\e[39m";
	fi;
};

##
# Outputs string in a dynamic orange color (hilite variant).
#
# Uses a background behind white text to grab extra attention.
#
# @since 2022-02-28
#
# @param string ${1} String.
#
# @output string Colorized string.
# @return int `0` (true) on success.
##
function chalk-warning-hilite() {
	if ! is-256-colors; then
		echo "${1:-}";
	else
		echo -e "\e[38;5;255m\e[48;5;130m\e[1m${1:-}\e[0m\e[49m\e[39m";
	fi;
};

##
# Outputs string in a dynamic red color.
#
# @since 2022-02-28
#
# @param string ${1} String.
#
# @output string Colorized string.
# @return int `0` (true) on success.
##
function chalk-danger() {
	if ! is-256-colors; then
		echo "${1:-}";
	elif is-chalk-on-dark-bg; then
		echo -e "\e[38;5;203m\e[1m${1:-}\e[0m\e[39m";
	else
		echo -e "\e[38;5;124m\e[1m${1:-}\e[0m\e[39m";
	fi;
};

##
# Outputs string in a dynamic red color (hilite variant).
#
# Uses a background behind white text to grab extra attention.
#
# @since 2022-02-28
#
# @param string ${1} String.
#
# @output string Colorized string.
# @return int `0` (true) on success.
##
function chalk-danger-hilite() {
	if ! is-256-colors; then
		echo "${1:-}";
	else
		echo -e "\e[38;5;255m\e[48;5;124m\e[1m${1:-}\e[0m\e[49m\e[39m";
	fi;
};

##
# Outputs string in a dynamic green color.
#
# @since 2022-02-28
#
# @param string ${1} String.
#
# @output string Colorized string.
# @return int `0` (true) on success.
##
function chalk-success() {
	if ! is-256-colors; then
		echo "${1:-}";
	elif is-chalk-on-dark-bg; then
		echo -e "\e[38;5;41m\e[1m${1:-}\e[0m\e[39m";
	else
		echo -e "\e[38;5;28m\e[1m${1:-}\e[0m\e[39m";
	fi;
};

##
# Outputs string in a dynamic green color (hilite variant).
#
# Uses a background behind white text to grab extra attention.
#
# @since 2022-02-28
#
# @param string ${1} String.
#
# @output string Colorized string.
# @return int `0` (true) on success.
##
function chalk-success-hilite() {
	if ! is-256-colors; then
		echo "${1:-}";
	else
		echo -e "\e[38;5;255m\e[48;5;28m\e[1m${1:-}\e[0m\e[49m\e[39m";
	fi;
};

# ---------------------------------------------------------------------------------------------------------------------
# Chalk utilities.
# ---------------------------------------------------------------------------------------------------------------------

##
# Determines whether to show dark|light background variants.
#
# {@see https://o5p.me/BAkbEq} for inspiration.
#
# @since 2022-02-28
#
# @param string ${1} String.
#
# @output string Colorized string.
# @return int `0` (true) if terminal has a dark background color.
#
# @todo This needs more work in the future.
##
function is-chalk-on-dark-bg() {
	if [[ -z "${COLORFGBG:-}" || "${COLORFGBG}" == '15;0' || "${COLORFGBG}" == '15;default;0' ]]; then
		return 0; # {@see https://o5p.me/BAkbEq}.
	else
		return 1;
	fi;
};

# ---------------------------------------------------------------------------------------------------------------------
# For testing.
# ---------------------------------------------------------------------------------------------------------------------

# chalk-heading 'chalk-heading';
# chalk-output 'chalk-output';
# chalk-log 'chalk-log';
# chalk-output
# chalk-info 'chalk-info';
# chalk-warning 'chalk-warning';
# chalk-danger 'chalk-danger';
# chalk-success 'chalk-success';
# chalk-output
# chalk-info-hilite 'chalk-info-hililte';
# chalk-warning-hilite 'chalk-warning-hililte';
# chalk-danger-hilite 'chalk-danger-hililte';
# chalk-success-hilite 'chalk-success-hililte';
