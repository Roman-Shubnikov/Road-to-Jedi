<?php


$mysqli = new mysqli( DB_HOST, DB_USER, DB_PASS, DB_NAME );
//$mysqli = new mysqli( "localhost", "mysql", "mysql", "jedi" );
$mysqli->set_charset( "utf8mb4" );

// var_dump( $mysqli->connect_error );

function db_get( string $sql, int $rowset = 0 ) {
	global $mysqli;

	$response = [];
	$result = $mysqli->query( $sql );

	if (!empty($result) && $result->num_rows > 0) {
		while ( $res = $result->fetch_array( MYSQLI_ASSOC ) ) {
			$response[] = $res;
		}
	}

	return $response;
}


function db_mget( string $sql ) {
	global $mysqli;

	$response = [];

	if ( $mysqli->multi_query( $sql ) ) {
		do {
			if ( $result = $mysqli->store_result() ) {
				while ( $res = $result->fetch_array( MYSQLI_ASSOC ) ) {
					$rowset[] = $res;
				}

				$response[] = $rowset;
				$result->free();
			}
		} while ( $mysqli->next_result() );
	}

	return $response;
}



function db_add( array $data, string $table ) {
	global $mysqli;

	$fields = [];
	$insert_data = [];

	foreach ( $data as $k => $v ) {
		$fields[] = $k;
		$insert_data[] = "'" . $mysqli->real_escape_string( $v ) . "'";
	}

	$s_fields = implode( ', ', $fields );
	$s_insert_data = implode( ',', $insert_data );

	$sql = "INSERT INTO {$table} ( {$s_fields} ) VALUES ( {$s_insert_data} );";

	return $mysqli->query( $sql );
}

function db_edit( array $data, string $condition, string $table ) {
	global $mysqli;

	$update_data = [];

	foreach ( $data as $k => $v ) {
		$update_data[] = "$k = '" . $mysqli->real_escape_string( $v ) . "'";
	}

	$set = implode( ', ', $update_data );

	$sql = "UPDATE {$table} SET {$set} WHERE {$condition}";

	return $mysqli->query( $sql );
}

function db_del( string $condition, string $table ) {
	global $mysqli;

	$sql = "DELETE FROM {$table} WHERE {$condition}";
	return $mysqli->query( $sql );
}