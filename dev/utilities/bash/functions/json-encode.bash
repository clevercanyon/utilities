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
# JSON-encodes (always as a string).
#
# @since 2022-02-28
#
# @param string ${1} String to encode.
#
# @output string JSON-encoded string.
# @return int `0` (true) on success.
##
function json-encode() {
	if can-run php; then
		echo -n "${1:-}" | php -r "echo json_encode( file_get_contents( 'php://stdin' ) );";

	else # This also supports everything that needs to be escaped (we think).
	# {@see https://tools.ietf.org/id/draft-ietf-json-rfc4627bis-09.html#rfc.section.7}.
		echo -n '"';
		echo -n "${1:-}" \
			| perl -0wpe 's/(\x8)/\\b/ug' \
			| perl -0wpe 's/(\x9)/\\t/ug' \
			| perl -0wpe 's/(\xA)/\\n/ug' \
			| perl -0wpe 's/(\xC)/\\f/ug' \
			| perl -0wpe 's/(\xD)/\\r/ug' \
			| perl -0wpe 's/(["\/\\])/\\$1/ug' \
			| perl -0wpe 's/\\\\(?=[btnfr])/\\/ug';
		echo -n '"';
	fi;
};
