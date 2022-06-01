<?php

class Users {
	public $vk_id = null;
	public $id = null;
	public $info = [];
	protected $is_first_start = false;
	protected $Connect;


	function __construct( int $vk_user_id, DB $Connect) {
		$this->Connect = $Connect;
		$this->vk_id = $vk_user_id;
		$this->_get();

		if ( empty( $this->info ) ) {
			$this->is_first_start = true;
			$this->_register();

			$this->_get();
		}
		// if (!$this->info['age']){
		// 	$this->is_first_start = true;
		// }
		$this->id = $this->info['id'];
		$this->donut = $this->info['donut'] > time() || $this->info['donut'] == 1;

		if ( isset($this->info['banned']) && $this->info['banned']) {
			$ban = $this->info['banned'];
			Show::error(5, ['reason' => $ban['reason'], 'time_end' => (int)$ban['time_end']]);
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
		$sql = "SELECT users.id, users.last_activity, users.registered, users.good_answers, users.permissions, users.generator, users.publicStatus, users.coff_active,
				users.bad_answers, users.avatar_id, avatars.name as avatar_name, users.flash, users.verified, users.donut, users.diamond, users.nickname, users.mark_day,
				users.money, users.age, users.scheme, users.vk_user_id, users.donuts,
				users.lvl, users.exp
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

	public function getByIds($ids, $order = '' ) {
		if(is_string($ids)){
			$a_ids = explode( ',', $ids );
		}else{
			$a_ids = $ids;
		}
		
		$ids = [];

		foreach ( $a_ids as $i => $id ) {
			if ( !is_numeric( $id ) ) continue;
			if ( $i >= CONFIG::MAX_ITEMS_COUNT ) break;

			$ids[] = (int) $id;
		}

		if ( count( $ids ) == 0 ) return [];
		$s_ids = implode( ',', $ids );
		$result = [];

		$sql = "SELECT users.id, users.vk_user_id,users.last_activity, users.registered, users.good_answers, users.permissions, users.generator,
						users.bad_answers, users.total_answers, users.avatar_id, users.money,users.age, users.scheme, users.publicStatus,users.coff_active,
						avatars.name as avatar_name, users.money, users.flash, users.verified,users.donut, users.diamond, users.nickname, users.donuts,
						users.lvl, users.exp
				FROM users
				LEFT JOIN avatars ON users.avatar_id=avatars.id
				WHERE users.id IN ( $s_ids ) AND users.vk_user_id NOT IN (SELECT vk_user_id FROM banned where time_end>?) $order";
		$res = $this->Connect->db_get( $sql, [time()] );

		foreach ( $res as $item ) {
			$result[] = $this->_formatType( $item );
		} 

		return $result;
	}

	public function getTop($type, $staff) {
		$count = CONFIG::MAX_ITEMS_COUNT;
		$order = 'ORDER BY users.good_answers DESC';
		switch($type){
			case 'all':
				$order = 'ORDER BY users.good_answers DESC';
				break;
			case 'rating':
				$order = 'AND coff_active > 0 ORDER BY coff_active DESC';
				break;
			case 'donut':
				$order = 'AND (donut=1 OR donut > ' . time() . ') ORDER BY coff_active DESC';
				break;
			case 'verif':
				$order = 'AND verified != 0 ORDER BY coff_active DESC';
				break;
			case 'flash':
				$order = 'AND flash != 0 ORDER BY coff_active DESC';
				break;
		}
		$staff = $staff ? CONFIG::PERMISSIONS['special'] : 0;

		$sql = "SELECT users.id, users.last_activity, users.vk_user_id, users.registered, users.good_answers, users.permissions, users.generator, users.mark_day,
						users.bad_answers, users.total_answers, users.avatar_id, users.money, users.age, users.scheme, users.publicStatus, users.coff_active,
						avatars.name as avatar_name, users.money, users.flash, users.verified,users.donut, users.diamond, users.nickname, users.donuts,
						users.lvl, users.exp
				FROM users
				LEFT JOIN avatars ON users.avatar_id=avatars.id
				WHERE users.vk_user_id NOT IN (SELECT vk_user_id FROM banned where time_end>?) AND users.permissions=? $order LIMIT $count";
		$res = $this->Connect->db_get( $sql, [time(), (int) $staff] );
		$result = [];
		foreach ( $res as $item ) {
			$result[] = $this->_formatType( $item );
		}
		return $result;
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
		$sql = "SELECT users.id, users.last_activity, users.registered, users.good_answers,users.age,users.vk_user_id,users.permissions, users.mark_day,
						users.bad_answers, users.total_answers, users.avatar_id, users.money, users.scheme, users.publicStatus,users.coff_active,
						users.generator, users.flash, users.verified, users.donut, users.nickname, users.diamond, avatars.name as avatar_name, users.donuts,
						users.lvl, users.exp
				FROM users
				LEFT JOIN avatars
				ON users.avatar_id = avatars.id
				WHERE users.vk_user_id=?";
		$res = $this->Connect->db_get( $sql, [$user_id] )[0];
		$ban = $this->checkBanned($user_id);
		if($ban){
			$res['banned'] = $ban[0];
		}
		
		$this->info = $res ?? [];
	}

	private function _register() {
		$time = time();
		$res = $this->Connect->query("INSERT IGNORE INTO users (vk_user_id,registered,last_activity,nickname,avatar_id) VALUES (?,?,?,?,?)", [$this->vk_id,$time,$time,NULL,rand( 1, CONFIG::AVATARS_COUNT )]);
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
		$info_settings = $this->Connect->db_get("SELECT public,hide_donut,change_color_donut FROM user_settings WHERE aid=?", [(int) $data['id']]);
		$is_public = $info_settings ? (bool) $info_settings[0]['public'] : FALSE;
		$is_hide_donut = $info_settings ? (bool) $info_settings[0]['hide_donut'] : FALSE;
		$changeColorNick = $info_settings ? $info_settings[0]['change_color_donut'] : FALSE;
		$donut = false;
		if($data['donut'] > time() || $data['donut'] == 1){
			$donut = true;
		}
		if( empty($data['banned']) || !($data['permissions'] < CONFIG::PERMISSIONS['special'])) {
			
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
				'donut' => $is_hide_donut ? false : (bool) $donut,
				'change_color_donut' => (bool)$changeColorNick,
				'public' => $is_public,
				'publicStatus' => $data['publicStatus'],
				'levels' => [
					'lvl' => (int) $data['lvl'],
					'exp' => (int) $data['exp'],
				],
				
			];	
		}
		$res['permissions'] = (int) $data['permissions'];
		if(!empty($data['banned'])){
			$res['banned'] = $data['banned'];
		}
		if (!($this->info['permissions'] < CONFIG::PERMISSIONS['special'])) { 
			$res['vk_id'] = (int)$data['vk_user_id'];
			$res['marked'] = (int) $data['good_answers'];
		}

		if ( isset( $data['is_first_start'] ) ) {
			$res['is_first_start'] = (bool) $data['is_first_start'];
		}

		if ( !empty( $data['nickname'] ) ) $res['nickname'] = $data['nickname'];

		if((int) $data['id'] == $this->id || !($this->info['permissions'] < CONFIG::PERMISSIONS['special'])){
			$res['noti'] = isset($data['noti']) ? (bool)$data['noti'] : false;
			$res['balance'] = (int)$data['money'];
			$res['donuts'] = (int)$data['donuts'];
			$res['scheme'] = (int)$data['scheme'];
			$res['donut'] = (bool) $donut;
			
			
		}
		if ( isset( $data['notifications_count'] ) ) {
			$res['notif_count'] = (int) $data['notifications_count'];
		}
		if((!array_key_exists('vk_id', $res) && $is_public) || $this->vk_id) $res['vk_id'] = (int)$data['vk_user_id'];
		if ($this->info['permissions'] >= CONFIG::PERMISSIONS['admin']) { 
			$res['coff_active'] = $data['coff_active'] / 10;
			$res['age'] = (int)$data['age'];
			$res['mark_day'] = (int)$data['mark_day'];
		}
		return $res;
	}
}