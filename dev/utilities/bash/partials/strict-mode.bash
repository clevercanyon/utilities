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
# Sets strict mode options.
#
# {@see https://o5p.me/pnUV7g}.
#
# @since 2022-02-28
##
set -o  nounset;
set -o  errexit;
set -o errtrace;
set -o pipefail;

##
# Traps errors for easier debugging.
#
# {@see https://o5p.me/8eGn9c}.
#
# @param int ${1} Exit status code.
#
# @since 2022-02-28
##
function stack-trace() {
	local last_command_status_code=$?;
	set +o xtrace; # Don't trace the tracer.

	local diagnostic_lines=();
	local diagnostic_report='';
	local exit_status_code="${1:-1}";

	diagnostic_lines+=( '----------------------------------------------------------------------' );

	if [[ -n "${C10N_BASH_STACK_TRACE_SCRIPT_DESCRIPTION:-}" ]]; then
		diagnostic_lines+=( "${C10N_BASH_STACK_TRACE_SCRIPT_DESCRIPTION}" );
		diagnostic_lines+=( '----------------------------------------------------------------------' );
	fi;
	diagnostic_lines+=( 'Error in '"${BASH_SOURCE[1]}"':'"${BASH_LINENO[0]}" );
	diagnostic_lines+=( '`'"${BASH_COMMAND}"'` exited with status `'"${last_command_status_code}"'`.' );

	if [[ ${#FUNCNAME[@]} -gt 2 ]]; then
		diagnostic_lines+=( 'Stack Trace:' );
		for (( _i=1; _i < ${#FUNCNAME[@]}-1; _i++ )); do
			diagnostic_lines+=( " ${_i}: ${BASH_SOURCE[${_i}+1]}:${BASH_LINENO[${_i}]} ${FUNCNAME[${_i}]}(...)" );
		done;
	fi;
	diagnostic_lines+=( 'Exiting with status `'"${exit_status_code}"'`.' );
	diagnostic_report="$( IFS=$'\n'; echo "${diagnostic_lines[*]}"; )";

	if [[ "${C10N_BASH_STACK_TRACE_SLACK_NOTIFY:-}" == true && -n "${C10N_SLACK_NOTIFY_TOKEN:-}" ]]; then
		slack-notify --message="${diagnostic_report}" --emoji=:danger_icon:;
	fi;
	echo "${diagnostic_report}"; # Prints diagnostics.
	exit "${exit_status_code}";  # Preserves exit status.
};
trap stack-trace ERR;
