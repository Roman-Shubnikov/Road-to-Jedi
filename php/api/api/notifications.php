<?php

class SystemNotifications {
	
	protected $Connect;


	function __construct(DB $Connect ) {
		$this->Connect = $Connect;
	}

	public function send( int $owner_id, string $text, string $image, array $object, string $comment=null ) {
		$data = [
			'owner_id' => $owner_id,
			'text' => $text,
			'image' => $image,
			'time' => time(),
			'object_type' => $object['type'],
			'object' => $object['object']
		];
		$res = $this->Connect->query("INSERT INTO notifications (owner_id,text,image,time,object_type,object, comment) VALUES (?,?,?,?,?,?,?)", [$owner_id,$text,$image,time(),$object['type'],$object['object'],$comment]);

		$sql = "SELECT * FROM users WHERE id=?";
		$user = $this->Connect->db_get( $sql, [$owner_id] )[0];
		$ticket_id = $object['object'];
		$object_lol = $ticket_id != 0 ? "https://vk.com/app7409818#ticket_id={$ticket_id}" : '';

		if( $user['noti'] ) {
			$data = [
				'user_id' => $user['vk_user_id'],
				'random_id' => 0,
				'message' => "$text\n$object_lol",
				'access_token' =>'9e1740c170fe79333a5512e6513f6036ba361fcc0dead0588f0a320e53831679b9bc7adc80208f370e11a',
				'v' => '5.120'
			];

			$query = http_build_query( $data );
			$url = "https://api.vk.com/method/messages.send?{$query}";
			file_get_contents( $url );
		}

		$id = $res[1];

		return [
			'notification_id' => $id
		];
	}
}


class Notifications {
	protected $user = [];

	function __construct( Users $user,DB $Connect ) {
		$this->user = $user;
		$this->Connect = $Connect;
	}

	public function getCount() {
		$id = $this->user->id;

		$sql = "SELECT COUNT( id ) as count FROM notifications WHERE owner_id=? AND delivered = 0";
		$res = $this->Connect->db_get( $sql, [$id] )[0];

		return (int) $res['count'];
	}

	public function get() {
		$uid = $this->user->id;

		$sql = "SELECT * FROM notifications WHERE owner_id=? ORDER BY id DESC";
		$res = $this->Connect->db_get( $sql, [$uid] );

		$result = [];

		foreach ( $res as $item ) {
			$result[] = $this->_formateType( $item );
		}

		return $result;
	}

	public function markAsViewed() {
		$uid = $this->user->id;
		return $this->Connect->query("UPDATE notifications SET delivered=1 WHERE owner_id=?", [$uid])[0];
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