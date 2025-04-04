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
		$shortInfo = $this->user->getById($agent_id);
		if(!empty($shortInfo['banned'])){
			Show::error(8);
		}
		if($timeban){
			$timeban = time() + $timeban;
		}
		return $this->Connect->query("INSERT INTO banned (vk_user_id,reason,time_end,moderator_vk_id) VALUES (?,?,?,?)", 
		[$shortInfo['vk_id'], (string)$ban_reason, $timeban, $moderator_id])[0];
	}
	public function getBansUser($agent_id){
		$shortInfo = $this->user->getById($agent_id);
		return $this->Connect->db_get("SELECT COUNT(*) FROM banned WHERE vk_user_id=?", [$shortInfo['vk_id']]);
	}
	public function Verification($agent_id, $give=TRUE){
		
		if ($give) {
			return $this->Connect->query("UPDATE users SET verified=? WHERE id=?", [time(),$agent_id])[0];
		}
		return $this->Connect->query("UPDATE users SET verified=0 WHERE id=?", [$agent_id])[0];
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
			'type' => 'verification_send',
			'object' => 0,
		];
		$this->SYSNOTIF->send( $aid, $notification, $object);
		return $this->Connect->query("INSERT INTO request_verification (vk_id,aid,title,descverf,time) VALUES (?,?,?,?,?)", 
		[$this->user->vk_id, $aid,$title,$desc,time()])[0];
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

	public function publicProfile($agent_id, $isPublic=TRUE){
		return $this->Connect->query("UPDATE users SET public=? WHERE id=?", [(int)$isPublic, $agent_id]);
	}
	public function setPublicStatus($agent_id, $status){
		if(mb_strlen($status) > CONFIG::MAX_PUBLIC_STATUS_LENGTH) Show::error(1400);
		return $this->Connect->query("UPDATE users SET publicStatus=? WHERE id=?", [$status, $agent_id]);
	}
}