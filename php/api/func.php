<?php

function response( $data ) {
	$pretty = isset($_GET['debug']) ? JSON_PRETTY_PRINT : 0;
	echo json_encode( $data, JSON_UNESCAPED_UNICODE | $pretty );
}

function offset_count( int &$offset, int &$count ) {
	if ( $offset < 0 ) $offset = 0;
	if ( $count < 0 ) $count = ITEMS_PER_PAGE;

	if ( $count > MAX_ITEMS_COUNT ) $count = MAX_ITEMS_COUNT;
}

function check_params( $params ) {
	foreach ( $params as $name => $param ) {
		$required = $param['required'];
		$type = $param['type'];

		if ( $required && !isset( $_REQUEST[$name] ) ) {
			throw new Exception( ERRORS[1], 1 );
		} else if ( !isset( $_REQUEST[$name]) ) {
			continue;
		}

		$ok_type = true;

		switch( $type ) {
			case 'int':
				if ( !is_numeric( $_REQUEST[$name] )) $ok_type = false;
				break;
			case 'float':
				if ( !is_float( $_REQUEST[$name] ) ) $ok_type = false;
				break;
			case 'string':
				if ( !is_string( $_REQUEST[$name] ) ) $ok_type = false;
				break;
			case 'float':
				if ( !is_float( $_REQUEST[$name] ) ) $ok_type = false;
				
		}

		if ( !$ok_type ) {
			throw new Exception( ERRORS[2], 2 );
		}
	}
}

function error( $ex ) {
	$code = $ex->getCode();
	$msg = $ex->getMessage();

	if ( $code == 0 ) $msg = ERRORS[0];

	$data = [
		'result' => false,
		'error' => [
			'code' => $code,
			'message' => $msg
		]
	];

	response( $data );
}

function ok( $data ) {
	$data = [
		'result' => true,
		'response' => $data
	];

	response( $data );
	exit;
}

function check_sign() {
	$sign_params = []; 

	foreach ( $_GET as $name => $value ) { 
    	if ( strpos( $name, 'vk_' ) !== 0 ) { // Получаем только vk параметры из query 
    		continue; 
    	} 

		$sign_params[$name] = $value; 
	}

	ksort( $sign_params );
	$sign_params_query = http_build_query( $sign_params );
	$sign = rtrim( strtr( base64_encode( hash_hmac( 'sha256', $sign_params_query, VK_APP_SECRET, true ) ), '+/', '-_' ), '=' ); 

	$status = ( $sign === $_GET['sign'] );

	return $status;
}



function flood_control() {
	$time = time();

	if ( !$_SESSION['flood_control'] ) {
		$_SESSION['flood_control'] = [
			'count' => 1,
			'last' => $time
		];

		return true;
	}


	if ( $time < isset($_SESSION['flood_control']['until']) ) {
		return false;
	}

	if ( isset( $_SESSION['flood_control']['until'] ) && $time > $_SESSION['flood_control']['until'] ) {
		unset( $_SESSION['flood_control']['until'] );
		$_SESSION['flood_control']['count'] = 1;

		return true;
	}


	if ( $_SESSION['flood_control']['count'] + 1 > FLOOD_CONTROL ) {
		if ( !isset( $_SESSION['flood_control']['until'] ) ) {
			$_SESSION['flood_control']['until'] = $time + FLOOD_CONTROL_BAN;
		}

		return false;
	}


	if ( $_SESSION['flood_control']['last'] != $time ) {
		$_SESSION['flood_control']['count'] = 1;
		$_SESSION['flood_control']['last'] = $time;

		return true;
	}


	$_SESSION['flood_control']['count']++;
	$_SESSION['flood_control']['last'] = $time;

	return true;
}