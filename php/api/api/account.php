<?php 
class Account {
	protected $user = null;
	protected $Connect;

	function __construct( Users $user,DB $Connect,SystemNotifications $SYSNotif ) {
		$this->user = $user;
		$this->Connect = $Connect;
		$this->SYSNOTIF = $SYSNotif;
    }

    public function ChangeAge($age) {
		$aid = $this->user->id;
		return $this->Connect->query("UPDATE users SET age=? WHERE id=?", [$age, $aid])[0];
	}
	public function ChangeScheme($scheme) {
		$aid = $this->user->id;
		return $this->Connect->query("UPDATE users SET scheme=? WHERE id=?", [$scheme, $aid])[0];
	
	}
	public function deleteAccount() {
		$aid = $this->user->id;
		return $this->Connect->query("DELETE FROM users WHERE id=?", [$aid])[0];
	}
	public function Ban_User($agent_id, $ban_reason=NULL, $timeban=0){
		$moderator_id = $this->user->vk_id;
		if ( !$this->user->info['special'] ) {
			Show::error(403);
		}
		$shortInfo = $this->user->getById($agent_id);
		if(!empty($shortInfo['banned'])){
			Show::error(8);
		}
		if($timeban){
			$timeban = time() + $timeban;
		}
		return $this->Connect->query("INSERT INTO banned (vk_user_id,reason,time_end,moderator_vk_id) VALUES (?,?,?,?)", [$shortInfo['vk_id'], (string)$ban_reason, $timeban, $moderator_id])[0];
	}
	public function Prometay($agent_id, $give=TRUE){
		if ( !$this->user->info['special'] ) {
			Show::error(403);
		}
		
		if ($give) {
			return $this->Connect->query("UPDATE users SET flash=1,flashtime=? WHERE id=?", [time(),$agent_id])[0];
		}
		return $this->Connect->query("UPDATE users SET flash=0,flashtime=0 WHERE id=?", [time(),$agent_id])[0];
    }
    public function NewRequestVerf($title, $desc){
		$aid = $this->user->id;
		if($this->user->info['verified']){
			Show::error(1103);
		}
		if($this->getVerfStatus() == 2){
			Show::error(1104);
		}
        $data = [
            'aid' => $aid,
            'title' => $title,
            'descverf' => $desc,
            // 'number' => $number,
            'time' => time(),
		];
		
		$notification = 'Вы подали заявку на верификацию';
		$object = [
			'type' => 'verification_send'
		];
		$this->SYSNOTIF->send( $aid, $notification, null, $object );
		return $this->Connect->query("INSERT INTO request_verification (aid,title,descverf,time) VALUES (?,?,?,?)", [$aid,$title,$desc,time()])[0];
	}
	public function getVerfStatus(){
		// 0 - Не верифицирован
		// 1 - Верифицирован
		// 2 - Заявка рассматривается
		$status = 0;
		$aid = $this->user->id;
		$sql = "SELECT verified from users where id=?";
		$res = $this->Connect->db_get( $sql, [$aid]);
		if ( empty( $res ) ) {
			Show::error(404);
		}
		if($res[0]['verified']){
			$status = 1;
		}
		if(!$status){
			$sql = "SELECT time from request_verification where aid=? and inactive=0";
			$res = $this->Connect->db_get( $sql,[$aid] );
			if ( !empty( $res ) ) {
				$status = 2;
			}
		}
		// global $mysqli;
		// return $mysqli->error;
		return $status;
	}
}