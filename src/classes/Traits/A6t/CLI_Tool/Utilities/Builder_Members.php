<?php
/**
 * Clever Canyon™ {@see https://clevercanyon.com}
 *
 *  CCCCC  LL      EEEEEEE VV     VV EEEEEEE RRRRRR      CCCCC    AAA   NN   NN YY   YY  OOOOO  NN   NN ™
 * CC      LL      EE      VV     VV EE      RR   RR    CC       AAAAA  NNN  NN YY   YY OO   OO NNN  NN
 * CC      LL      EEEEE    VV   VV  EEEEE   RRRRRR     CC      AA   AA NN N NN  YYYYY  OO   OO NN N NN
 * CC      LL      EE        VV VV   EE      RR  RR     CC      AAAAAAA NN  NNN   YYY   OO   OO NN  NNN
 *  CCCCC  LLLLLLL EEEEEEE    VVV    EEEEEEE RR   RR     CCCCC  AA   AA NN   NN   YYY    OOOO0  NN   NN
 */
// <editor-fold desc="Strict types, namespace, use statements, and other headers.">

/**
 * Declarations & namespace.
 *
 * @since 2021-12-25
 */
declare( strict_types = 1 );
namespace Clever_Canyon\Utilities\Traits\A6t\CLI_Tool\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

/**
 * File-specific.
 *
 * @since 2021-12-15
 */
use GetOpt\{GetOpt as Parser, Command, Option, Operand};

// </editor-fold>

/**
 * Interface members.
 *
 * @since 2021-12-15
 *
 * @see   U\I7e\CLI_Tool
 */
trait Builder_Members {
	/**
	 * Builds options.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|null $command_name Command name.
	 * @param array       $option_cfgs  Option configurations.
	 *
	 * @return Option[] An array of option instances.
	 */
	protected function build_options( /* string|null */ ?string $command_name, array $option_cfgs ) : array {
		foreach ( $option_cfgs as $_option => $_config ) {
			$_short        = $_config[ 'short' ] ?? null;
			$_long         = $_config[ 'long' ] ?? null;
			$_multiple     = $_config[ 'multiple' ] ?? null;
			$_required     = $_config[ 'required' ] ?? null;     // Is the --option itself required?
			$_arg_required = $_config[ 'arg_required' ] ?? null; // Is the --option=argument required?
			$_arg_optional = $_config[ 'arg_optional' ] ?? null; // Is the --option=argument optional?
			$_description  = $_config[ 'description' ] ?? null;
			$_validator    = $_config[ 'validator' ] ?? null;
			$_default      = $_config[ 'default' ] ?? null;

			if ( $_multiple ) {
				$_mode = Parser::MULTIPLE_ARGUMENT;
			} elseif ( $_arg_required || false === $_arg_optional ) {
				$_mode = Parser::REQUIRED_ARGUMENT;
			} elseif ( $_arg_optional || false === $_arg_required ) {
				$_mode = Parser::OPTIONAL_ARGUMENT;
			} else {
				$_mode = Parser::NO_ARGUMENT;
			}
			$options[ $_option ] = Option::create( $_short, $_long ?? $_option, $_mode );
			$options[ $_option ]->setDescription( $_description ?? '' );
			$options[ $_option ]->setValidation( $_validator ?? [ U\Func::class, 'noop_true' ] );

			if ( isset( $_default ) ) {
				$options[ $_option ]->setDefaultValue( $_default );
			}
			if ( $_required ) {
				$this->required_options[ $command_name ?: '' ]             ??= [];
				$this->required_options[ $command_name ?: '' ][ $_option ] = $options[ $_option ];
			}
		}
		return $options ?? [];
	}

	/**
	 * Builds operands.
	 *
	 * @since 2021-12-15
	 *
	 * @param string|null $command_name Command name.
	 * @param array       $operand_cfgs Operand configurations.
	 *
	 * @return Operand[] An array of operand instances, else empty array.
	 *
	 * @throws \InvalidArgumentException On invalid args.
	 */
	protected function build_operands( /* string|null */ ?string $command_name, array $operand_cfgs ) : array {
		foreach ( $operand_cfgs as $_operand => $_config ) {
			$_multiple    = $_config[ 'multiple' ] ?? null;
			$_required    = $_config[ 'required' ] ?? null; // Is the ... [operand] required?
			$_optional    = $_config[ 'optional' ] ?? null; // Is the ... [operand] optional?
			$_description = $_config[ 'description' ] ?? null;
			$_validator   = $_config[ 'validator' ] ?? null;
			$_default     = $_config[ 'default' ] ?? null;

			if ( $_multiple && ( $_required || false === $_optional ) ) {
				$_mode = Operand::MULTIPLE | Operand::REQUIRED;
			} elseif ( $_multiple ) {
				$_mode = Operand::MULTIPLE;
			} elseif ( $_required || false === $_optional ) {
				$_mode = Operand::REQUIRED;
			} else {
				$_mode = Operand::OPTIONAL;
			}
			$operands[ $_operand ] = Operand::create( $_operand, $_mode );
			$operands[ $_operand ]->setDescription( $_description ?? '' );
			$operands[ $_operand ]->setValidation( $_validator ?: [ U\Func::class, 'noop_true' ] );

			if ( $_multiple && ! isset( $_default ) ) {
				$_default = ''; // Avoids a bug in GetOpt class.
			}
			if ( isset( $_default ) ) {
				$operands[ $_operand ]->setDefaultValue( $_default );
			}
			if ( $_required ) {
				$this->required_operands[ $command_name ?: '' ]              ??= [];
				$this->required_operands[ $command_name ?: '' ][ $_operand ] = $operands[ $_operand ];
			}
		}
		return $operands ?? [];
	}
}
