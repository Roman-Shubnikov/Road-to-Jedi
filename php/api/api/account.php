<?php 
class Account {
	protected $user = null;
	protected $Connect;

	function __construct( Users $user,DB $Connect ) {
		$this->user = $user;
		$this->Connect = $Connect;
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
	public function Ban_User($agent_id, $ban=FALSE, $ban_reason=NULL){
		if ( !$this->user->info['special'] ) {
			Show::error(403);
		}
		$data = [
			'banned' => (int) $ban,
			'ban_reason' => (string)$ban_reason,
		];
		return $this->Connect->query("UPDATE users SET banned=?,ban_reason=? WHERE id=?", [$ban, (string)$ban_reason, $agent_id])[0];
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
		
		// global $mysqli;
		// return $mysqli->error;
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