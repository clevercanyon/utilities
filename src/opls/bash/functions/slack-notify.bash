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
# Slack notifier.
#
# Required permissions:
# - `chat:write`
# - `chat:write.customize`
# - `chat:write.public`
#
# @since 2022-02-28
#
# @param string --message|-m|${1}  Markdown message.
#
# @param string --emoji|-e|${2}    Optional emoji. Overrides default for Slack app.
#                                  Default is environment variable `C10N_SLACK_NOTIFY_EMOJI`.
#                                  If empty, Slack will fall back on the icon configured for the app.
#
# @param string --username|-u|${3} Optional username. Overrides default for Slack app.
#                                  Default is environment variable `C10N_SLACK_NOTIFY_USERNAME`.
#                                  If empty, Slack will fall back on the username configured for the app.
#
# @param string --channel|-c|${4}  Optional channel ID; i.e., where to send the message.
#                                  Default is environment variable `C10N_SLACK_NOTIFY_CHANNEL`.
#                                  Required if env var is not set. Must have one way or the other.
#
# @param string --token|-t|${5}    Optional bot API token with adequate permissions.
#                                  Default is environment variable: `C10N_SLACK_NOTIFY_TOKEN`.
#                                  Required if env var is not set. Must have one way or the other.
#
# @output void No output.
# @return int `0` (true) on success.
##
function slack-notify() {
	local message='';
	local emoji='';
	local username='';
	local channel='';
	local token='';

	eval set -- "$( getopt \
		--long 'message:,emoji:,username:,channel:,token:' \
		--options 'm:e:u:c:t:' \
		-- "${0}" "${@}" \
	)";
	while [ "$#" -gt 0 ]; do local _o=${1}; shift;
		case "${_o}" in
			--)                        shift; break;;
			-m | --message)  message="${1}";  shift;;
			-e | --emoji)    emoji="${1}";    shift;;
			-u | --username) username="${1}"; shift;;
			-c | --channel)  channel="${1}";  shift;;
			-t | --token)    token="${1}";    shift;;
		esac;
	done;
	if [[ -z "${message}" ]]; then message="${1:-}"; fi;
	if [[ -z "${emoji}" ]]; then emoji="${2:-}"; fi;
	if [[ -z "${username}" ]]; then username="${3:-}"; fi;
	if [[ -z "${channel}" ]]; then channel="${4:-}"; fi;
	if [[ -z "${token}" ]]; then token="${5:-}"; fi;

	if [[ -z "${emoji}" ]]; then emoji="${C10N_SLACK_NOTIFY_EMOJI:-}"; fi;
	if [[ -z "${username}" ]]; then username="${C10N_SLACK_NOTIFY_USERNAME:-}"; fi;
	if [[ -z "${channel}" ]]; then channel="${C10N_SLACK_NOTIFY_CHANNEL:-}"; fi;
	if [[ -z "${token}" ]]; then token="${C10N_SLACK_NOTIFY_TOKEN:-}"; fi;

	if [[ -n "${emoji}" && : != "${emoji:0:1}" ]]; then emoji=:"${emoji}":; fi;

	if [[  -z "${message}" \
		|| -z "${channel}" \
		|| -z "${token}" ]];
	then
	    return 1; # Not possible.
	fi;
	local json_data="$(cat <<-ooo
		{
			"text"      : $(json-encode "${message}"),
			$( [[ -n "${emoji}" ]] && echo '"icon_emoji": '"$(json-encode "${emoji}")"',' )
			$( [[ -n "${username}" ]] && echo '"username"  : '"$(json-encode "${username}")"',' )
			"channel"   : $(json-encode "${channel}"),
			"parse"     : "none",
			"mrkdwn"    : true
		}
		ooo
	)"; # Removes empty lines.
	json_data="$( echo "${json_data}" | awk NF )";

	curl --silent --show-error --request POST \
		--header 'authorization: Bearer '"${token}" \
		--header 'content-Type: application/json; charset=utf-8' \
		--data "${json_data}" https://slack.com/api/chat.postMessage \
		--output /dev/null;
};
