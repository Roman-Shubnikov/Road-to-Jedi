<?php

class VKApi {
	protected const V = 5.124;
	protected const ENDPOINT = 'https://api.vk.com/method';
	protected const LANG = 'ru';

	protected $token = null;

	function __construct( string $token = null ) {
		if ( $token === null ) {
			$this->token = CONFIG::VK_APP_TOKEN;
			return;
		}

		$this->token = $token;
	}

	protected function _request( string $method, array $data ) {
		$url = self::ENDPOINT . '/' . $method;

		$data['access_token'] = $this->token;
		$data['lang'] = self::LANG;
		$data['v'] = self::V;

		$query_string = http_build_query( $data );

		$curl = curl_init();
		curl_setopt_array( $curl, [
			CURLOPT_URL => $url,
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_POST => true,
			CURLOPT_POSTFIELDS => $query_string
		] );

		$response = curl_exec( $curl );
		curl_close( $curl );

		$result = json_decode( $response, true );

		if ( isset( $result['error'] ) ) {
			throw new Exception( $result['error']['error_msg'], $result['error']['error_code'] );
		}

		return $result['response'];
	}


	public function users_get( array $user_ids, array $fields = [], bool $array_key = false ) {
		$ids = implode( ',', $user_ids );
		$fields = implode( ',', $fields );

		$data = [
			'user_ids' => $ids,
			'fields' => $fields
		];

		$res = $this->_request( 'users.get', $data );
		$ret = [];

		if ( $array_key ) {
			foreach ( $res as $user ) {
				$ret[$user['id']] = $user;
			}

			return $ret;
		}

		return $res;
	}

	public function groups_isMember( int $group_id, int $user_id ) {
		$data = [
			'group_id' => $group_id,
			'user_id' => $user_id
		];

		return $this->_request( 'groups.isMember', $data );
	}

	public function sendNotification(array $user_ids, $message, $fragment=null){
		$data = [
			'message' => $message,
			'user_ids' => $user_ids,
			'fragment' => $fragment,
		];
		return $this->_request( 'notifications.sendMessage', $data );
	}
	public function sendMessage($user_id, $text){
		$data = [
			'user_id' => $user_id,
			'random_id' => 0,
			'message' => "$text",
			'dont_parse_links' => 1,
			'access_token' =>$this->token,
			'v' => '5.120'
		];

		return $this->_request( 'messages.send', $data );
	}
}