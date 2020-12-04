<?php

class Users {
	public $vk_id = null;
	public $id = null;
	public $info = [];
	protected $is_first_start = false;
	protected $Connect;


	function __construct( int $vk_user_id, DB $Connect ) {
		$this->Connect = $Connect;
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
			$ban = $this->info['banned'];
			Show::error(5, ['reason' => $ban['reason'], 'time_end' => (int)$ban['time_end']]);
			// throw new Exception( ERRORS[5] . $this->info['ban_reason'], 5 );
		}
	}
	
	public function getMy() {
		$info = $this->info;
		$info['is_first_start'] = $this->is_first_start;

		$notifications = new Notifications( $this, $this->Connect);
		$info['notifications_count'] = $notifications->getCount();

		return $this->_formatType( $info );
	}
	public function checkBanned(int $vk_id, bool $all=false, $inactive=false){
		if($inactive){
			$sql = "SELECT reason, time_end FROM banned WHERE vk_user_id=? ORDER BY time_end DESC";
		}else{
			$sql = "SELECT reason, time_end FROM banned WHERE vk_user_id=? AND (time_end>? AND time_end != 0) ORDER BY time_end DESC";
		}
		if(!$all){
			$sql .= " LIMIT 1";
		}
		if($inactive){
			$banned = $this->Connect->db_get($sql, [$vk_id]);
		}else{
			$banned = $this->Connect->db_get($sql, [$vk_id, time()]);
		}
		if(empty($banned)){
			return false;
		}else{
			if(count($banned) == 1){
				$res = $banned;
			}else{
				$res = [];
				foreach($banned as $val) {
					$res[] = ['reason' => $val['reason'], 'time_end' => $val['time_end']];
				}
			}
		}
		
		return $res;
	}

	public function getById( int $id ) {
		$sql = "SELECT users.id, users.last_activity, users.registered, users.good_answers, users.special, 
				users.bad_answers, users.avatar_id, avatars.name as avatar_name, users.flash, users.verified, users.donut, users.diamond, users.nickname,
				users.money, users.age, users.scheme, users.vk_user_id
				FROM users
				LEFT JOIN avatars
				ON users.avatar_id = avatars.id
				WHERE users.id=?";
		$res = $this->Connect->db_get( $sql, [$id] );

		if ( empty( $res ) ) {
			Show::error(40);
		}
		$res = $res[0];
		$ban = $this->checkBanned($res['vk_user_id']);
		if($ban){
			$res['banned'] = $ban[0];
		}
		
		return $this->_formatType( $res );
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

		$sql = "SELECT users.id, users.last_activity, users.registered, users.good_answers, users.special, 
						users.bad_answers, users.total_answers, users.avatar_id, users.money,users.age, users.scheme,
						avatars.name as avatar_name, users.money, users.flash, users.verified,users.donut, users.diamond, users.nickname
				FROM users
				LEFT JOIN avatars
				ON users.avatar_id = avatars.id
				WHERE users.id IN ( $s_ids ) AND users.vk_user_id NOT IN (SELECT vk_user_id FROM banned where time_end>?) $order";
		$res = $this->Connect->db_get( $sql, [time()] );

		foreach ( $res as $item ) {
			$result[] = $this->_formatType( $item );
		} 

		return $result;
	}

	public function getTop($staff) {
		$count = CONFIG::MAX_ITEMS_COUNT;
		$sql = "SELECT id FROM users where special=? ORDER BY good_answers DESC LIMIT 0, $count";
		$ids = $this->Connect->db_get( $sql, [$staff ? 1 : 0] );

		$a_ids = [];

		foreach ( $ids as $id ) {
			$a_ids[] = $id['id'];
		}

		$s_ids = implode( ',', $a_ids );

		return $this->getByIds( $s_ids, 'ORDER BY good_answers DESC' );
	}
	public function getRandom() {
		$sql = "SELECT vk_user_id FROM users ORDER BY RAND() LIMIT 1";
		$res = $this->Connect->db_get( $sql, )[0];
		return -$res['id'];
	}

	public function getIdByVKId( int $vk_id ) {
		$sql = "SELECT id FROM users WHERE vk_user_id=?";
		$res = $this->Connect->db_get( $sql,[$vk_id] )[0];

		return $res['id'];
	}

	private function _get() {
		$time = time();
		$user_id = $this->vk_id;
		$this->Connect->query("UPDATE users SET last_activity=? WHERE vk_user_id=?", [$time,$user_id]);
		$sql = "SELECT users.id, users.last_activity, users.registered, users.good_answers,users.age,users.vk_user_id,
						users.bad_answers, users.total_answers, users.avatar_id, users.money, users.noti, users.scheme,
						users.special, users.flash, users.verified,users.donut,users.nickname,users.diamond,avatars.name as avatar_name
				FROM users
				LEFT JOIN avatars
				ON users.avatar_id = avatars.id
				WHERE users.vk_user_id=?";
		$res = $this->Connect->db_get( $sql, [$user_id] )[0];
		$ban = $this->checkBanned($user_id);
		if($ban){
			$res['banned'] = $ban[0];
		}
		if ( !$res['special'] ) {
			unset( $res['special'] );
		}
		

		$this->info = $res ?? [];
	}

	private function _register() {
		$time = time();
		$res = $this->Connect->query("INSERT INTO users (vk_user_id,registered,last_activity,nickname,avatar_id) VALUES (?,?,?,?,?)", [$this->vk_id,$time,$time,'',rand( 1, CONFIG::AVATARS_COUNT )]);
		return $res;
	}
	private function _formatType( array $data ) {
		if ( empty( $data ) ) {
			Show::error(404);
		}

		$is_online = time() < $data['last_activity'] + CONFIG::ONLINE_TIME;

		if ( !$data['id'] ) {
			return [];
		}
		if( empty($data['banned']) || !$data['special']) {
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
				'registered' => (int) $data['registered'],
				'flash' => (bool) $data['flash'],
				'verified' => (bool) $data['verified'],
				'donut' => (bool) $data['donut'],
				'diamond' => (bool) $data['diamond'],
			];	
		}
		if(!empty($data['banned'])){
			$res['banned'] = $data['banned'];
		}
		if ( $this->info['special']) { 
			if(isset($data['vk_user_id'])){
				$res['vk_id'] = (int)$data['vk_user_id'];
			}
			$res['marked'] = (int) $data['good_answers'];
			
		}

		if ( isset( $data['is_first_start'] ) ) {
			$res['is_first_start'] = (bool) $data['is_first_start'];
		}

		if ( !empty( $data['nickname'] ) ) $res['nickname'] = $data['nickname'];

		if ( isset( $data['special'] ) ) {
			$res['special'] = (bool) $data['special'];
		}
		if((int) $data['id'] == $this->id || $this->info['special']){
			$res['noti'] = (bool)$data['noti'];
			$res['balance'] = (int)$data['money'];
			$res['age'] = (int)$data['age'];
			$res['scheme'] = (int)$data['scheme'];
		}
		if ( isset( $data['notifications_count'] ) ) {
			$res['notif_count'] = (int) $data['notifications_count'];
		}

		return $res;
	}
}