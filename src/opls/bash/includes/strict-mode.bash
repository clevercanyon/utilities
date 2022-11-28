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
	set +o xtrace;

	if [[ true == "${stack_traced:-}" ]];
		then return 0; # One time only.
	fi; stack_traced=true;

	local diagnostic_lines=();
	local slack_diagnostic_lines=();

	local diagnostic_report='';
	local slack_diagnostic_report='';

	local last_command="${1:-}";
	local last_command_status_code="${2:-1}";

	# Dividing lines are exactly 100 bytes in length.
	diagnostic_lines+=( '----------------------------------------------------------------------------------------------------' );
	if [[ -n "${C10N_BASH_STACK_TRACE_SCRIPT_DESCRIPTION:-}" ]]; then
		diagnostic_lines+=(       "${C10N_BASH_STACK_TRACE_SCRIPT_DESCRIPTION}" );
		diagnostic_lines+=(       '----------------------------------------------------------------------------------------------------' );
	fi;
	if [[ -n "${C10N_BASH_STACK_TRACE_SCRIPT_SLACK_DESCRIPTION:-}" ]]; then
		slack_diagnostic_lines+=( "${C10N_BASH_STACK_TRACE_SCRIPT_SLACK_DESCRIPTION}" );
		slack_diagnostic_lines+=( '----------------------------------------------------------------------------------------------------' );
	fi;
	diagnostic_lines+=(       'Error in '"${BASH_SOURCE[1]}"':'"${BASH_LINENO[0]}" );
	slack_diagnostic_lines+=( 'Error in '"${BASH_SOURCE[1]}"':'"${BASH_LINENO[0]}" );

	diagnostic_lines+=(       '`'"${last_command}"'` exited with status `'"${last_command_status_code}"'`.' );
	slack_diagnostic_lines+=( '`'"${last_command}"'` exited with status `'"${last_command_status_code}"'`.' );

	if [[ ${#FUNCNAME[@]} -gt 2 ]]; then
		diagnostic_lines+=(       'Stack Trace:' );
		slack_diagnostic_lines+=( 'Stack Trace:' );

		for (( _i=1; _i < ${#FUNCNAME[@]}-1; _i++ )); do
			diagnostic_lines+=(       " ${_i}: ${BASH_SOURCE[${_i}+1]}:${BASH_LINENO[${_i}]} ${FUNCNAME[${_i}]}(...)" );
			slack_diagnostic_lines+=( " ${_i}: ${BASH_SOURCE[${_i}+1]}:${BASH_LINENO[${_i}]} ${FUNCNAME[${_i}]}(...)" );
		done;
	fi;
	diagnostic_lines+=(       'Exiting with status `'"${last_command_status_code}"'`.' );
	slack_diagnostic_lines+=( 'Exiting with status `'"${last_command_status_code}"'`.' );

	diagnostic_report="$(       IFS=$'\n'; echo "${diagnostic_lines[*]}"; )";
	slack_diagnostic_report="$( IFS=$'\n'; echo "${slack_diagnostic_report[*]}"; )";

	if [[ "${C10N_BASH_STACK_TRACE_SLACK_NOTIFY:-}" == true && -n "${C10N_SLACK_NOTIFY_TOKEN:-}" ]]; then
		slack-notify --message="${slack_diagnostic_report}" --emoji=:danger_icon:;
	fi;
	echo "${diagnostic_report}"; exit "${last_command_status_code}"; # Preserves exit status.
};
trap 'stack-trace "${BASH_COMMAND}" "${?}";' ERR;
