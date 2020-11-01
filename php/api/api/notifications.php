<?php

class SystemNotifications {
	function __construct() {}

	public static function send( int $owner_id, string $text, string $image, array $object ) {
		$data = [
			'owner_id' => $owner_id,
			'text' => $text,
			'image' => $image,
			'time' => time(),
			'object_type' => $object['type'],
			'object' => $object['object']
		];

		$res = db_add( $data, 'notifications' );

		$sql = "SELECT * FROM users WHERE id = $owner_id";
		$user = db_get( $sql )[0];
		$ticket_id = $object['object'];
		$object_lol = $ticket_id != 0 ? "https://vk.com/app7409818#ticket_id={$ticket_id}" : '';

		if( $user['noti'] ) {
			$data = [
				'user_id' => $user['vk_user_id'],
				'random_id' => time(),
				'message' => "$text\n$object_lol\n\nТвой Витёк...",
				'access_token' =>'f8373822789d677c55a24c195cb74bd4b97ee014e00adc7a3c8a1985d31c5527c281cd2936dc2ff76a31b',
				'v' => '5.120'
			];

			$query = http_build_query( $data );
			$url = "https://api.vk.com/method/messages.send?{$query}";
			file_get_contents( $url );
		}

		global $mysqli;
		$id = $mysqli->insert_id;

		return [
			'notification_id' => $id
		];
	}
}


class Notifications {
	protected $user = [];

	function __construct( Users $user ) {
		$this->user = $user;
	}

	public function getCount() {
		$id = $this->user->id;

		$sql = "SELECT COUNT( id ) as count FROM notifications WHERE owner_id = $id AND delivered = 0";
		$res = db_get( $sql )[0];

		return (int) $res['count'];
	}

	public function get() {
		$uid = $this->user->id;

		$sql = "SELECT * FROM notifications WHERE owner_id = $uid ORDER BY id DESC";
		$res = db_get( $sql );

		$result = [];

		foreach ( $res as $item ) {
			$result[] = $this->_formateType( $item );
		}

		return $result;
	}

	public function markAsViewed() {

		$uid = $this->user->id;

		$data = [
			'delivered' => 1
		];

		return db_edit( $data, "owner_id = $uid", 'notifications' );
	}

	private function _formateType( array $data ) {
		$res = [
			'id' => (int) $data['id'],
			'time' => (int) $data['time'],
			'text' => $data['text'],
			'image' => $data['image'],
			'object' => [
				'type' => $data['object_type'],
				'object' => $data['object'] 
			],
			'comment' => $data['comment']
		];

		return $res;
	}
}