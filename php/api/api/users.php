<?php

class Users {
	public $vk_id = null;
	public $id = null;
	public $info = [];
	protected $is_first_start = false;


	function __construct( int $vk_user_id ) {
		$this->vk_id = $vk_user_id;
		$this->_get();


		if ( empty( $this->info ) ) {
			$this->is_first_start = true;
			$this->_register();

			$this->_get();
		}
		if (!$this->info['age']){
			$this->is_first_start = true;
		}
		$this->id = $this->info['id'];

		if ( $this->info['banned'] ) {
			Show::customError(CONFIG::ERRORS[5] . $this->info['ban_reason']);
			// throw new Exception( ERRORS[5] . $this->info['ban_reason'], 5 );
		}
	}
	public function ChangeAge($age) {
		$aid = $this->id;

		$data = [
			'age' => $age
		];
		return db_edit( $data, "id = $aid", 'users' );
	}
	public function Ban_User($agent_id, $ban=FALSE, $ban_reason=NULL){
		if ( !$this->info['special'] ) {
			Show::error(403);
		}
		$data = [
			'banned' => (int) $ban,
			'ban_reason' => (string)$ban_reason,
		];
		return db_edit( $data, "id = $agent_id", 'users' );
	}
	public function Prometay($agent_id, $give=TRUE){
		if ( !$this->info['special'] ) {
			Show::error(403);
		}
		$data = [
			'flash' => (int) $give,
		];
		return db_edit( $data, "id = $agent_id", 'users' );
	}
	public function getMy() {
		$info = $this->info;
		$info['is_first_start'] = $this->is_first_start;

		$notifications = new Notifications( $this );
		$info['notifications_count'] = $notifications->getCount();

		return $this->_formatType( $info );
	}

	public function getById( int $id ) {
		$sql = "SELECT users.id, users.last_activity, users.registered, users.good_answers,
						users.bad_answers, users.total_answers, users.avatar_id,  users.noti, users.money,users.age,
						avatars.name as avatar_name, users.flash, users.verified, users.nickname, users.banned, users.ban_reason
				FROM users
				LEFT JOIN avatars
				ON users.avatar_id = avatars.id
				WHERE users.id = $id;";
		$res = db_get( $sql );

		if ( empty( $res ) ) {
			Show::error(404);
		}

		return $this->_formatType( $res[0] );
	}

	public function getByIds( string $ids, $order = '' ) {
		$a_ids = explode( ',', $ids );
		$ids = [];

		foreach ( $a_ids as $i => $id ) {
			if ( !is_numeric( $id ) ) continue;
			if ( $i >= CONFIG::MAX_ITEMS_COUNT ) break;

			$ids[] = (int) $id;
		}

		if ( count( $ids ) == 0 ) return [];
		$s_ids = implode( ',', $ids );
		$result = [];

		$sql = "SELECT users.id, users.last_activity, users.registered, users.good_answers,
						users.bad_answers, users.total_answers, users.avatar_id, users.money,users.age,
						avatars.name as avatar_name, users.money, users.flash, users.verified, users.nickname, users.banned, users.ban_reason
				FROM users
				LEFT JOIN avatars
				ON users.avatar_id = avatars.id
				WHERE users.id IN ( $s_ids ) $order";
		$res = db_get( $sql );

		foreach ( $res as $item ) {
			$result[] = $this->_formatType( $item );
		} 

		return $result;
	}

	public function getTop() {
		$count = CONFIG::MAX_ITEMS_COUNT;

		$sql = "SELECT id FROM users ORDER BY good_answers DESC LIMIT 0, $count";
		$ids = db_get( $sql );

		$a_ids = [];

		foreach ( $ids as $id ) {
			$a_ids[] = $id['id'];
		}

		$s_ids = implode( ',', $a_ids );

		return $this->getByIds( $s_ids, 'ORDER BY good_answers DESC' );
	}
	public function getRandom() {
		$sql = "SELECT vk_user_id FROM users ORDER BY RAND() LIMIT 1";
		$res = db_get( $sql )[0];
		return -$res['id'];
	}

	public static function getIdByVKId( int $vk_id ) {
		$sql = "SELECT id FROM users WHERE vk_user_id = $vk_id";
		$res = db_get( $sql )[0];

		return $res['id'];
	}

	private function _get() {
		$time = time();
		$user_id = $this->vk_id;

		$sql = "UPDATE users SET last_activity = $time WHERE vk_user_id = $user_id;
				SELECT users.id, users.last_activity, users.registered, users.good_answers,users.age,
						users.bad_answers, users.total_answers, users.avatar_id, users.money, users.money, users.banned, users.noti,
						avatars.name as avatar_name, users.special, users.banned, users.ban_reason, users.flash, users.verified, users.nickname
				FROM users
				LEFT JOIN avatars
				ON users.avatar_id = avatars.id
				WHERE users.vk_user_id = $user_id;";
		$res = db_mget( $sql )[0][0];

		if ( !$res['special'] ) {
			unset( $res['special'] );
		}

		$this->info = $res ?? [];
	}

	private function _register() {
		$time = time();
		// $sql = "SELECT COUNT( id ) as count FROM avatars";
		// $res = db_get( $sql );
		// $avatars_count = $res[0]['count'];

		$avatars_count = 24;

		$data = [
			'vk_user_id' => $this->vk_id,
			'registered' => $time,
			'last_activity' => $time,
			'nickname' => '',
			'avatar_id' => rand( 1, $avatars_count )
		];

		return db_add( $data, 'users' );
	}
	private function _formatType( array $data ) {
		if ( empty( $data ) ) {
			Show::error(404);
		}

		$is_online = time() < $data['last_activity'] + CONFIG::ONLINE_TIME;

		if ( !$data['id'] ) {
			return [];
		}

		if( $data['banned'] !== 1 ) {
			$res = [
				'id' => (int) $data['id'],
				'online' => [
					'is_online' => (bool) $is_online,
					'last_seen' => (int) $data['last_activity']
				],
				'avatar' => [
					'id' => (int) $data['avatar_id'],
					'url' => CONFIG::AVATAR_PATH . '/' . $data['avatar_name']
				],
				'good_answers' => (int) $data['good_answers'],
				'bad_answers' => (int) $data['bad_answers'],
				'total_answers' => (int) $data['total_answers'],
				'registered' => (int) $data['registered'],
				'flash' => (bool) $data['flash'],
				'verified' => (bool) $data['verified'],
				'balance' => (float) $data['money']
			];	
		}
		 
		if ( isset( $data['noti'] ) ) {
			$res['noti'] = (bool) $data['noti'];
 		}


		if ( isset( $data['is_first_start'] ) ) {
			$res['is_first_start'] = (bool) $data['is_first_start'];
		}

		if ( !empty( $data['nickname'] ) ) $res['nickname'] = $data['nickname'];

		if ( isset( $data['special'] ) ) {
			$res['special'] = (bool) $data['special'];
		}

		if ( isset( $data['notifications_count'] ) ) {
			$res['notifications_count'] = (int) $data['notifications_count'];
		}

		return $res;
	}
}