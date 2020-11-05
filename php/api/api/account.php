<?php 
class Account {
	protected $user = null;

	function __construct( Users $user ) {
		$this->user = $user;
    }

    public function ChangeAge($age) {
		$aid = $this->user->id;

		$data = [
			'age' => $age
		];
		return db_edit( $data, "id = $aid", 'users' );
	}
	public function ChangeScheme($scheme) {
		$aid = $this->user->id;

		$data = [
			'scheme' => $scheme
		];
		return db_edit( $data, "id = $aid", 'users' );
	}
	public function deleteAccount() {
		$aid = $this->user->id;
		return db_del("id = $aid", 'users' );
	}
	public function Ban_User($agent_id, $ban=FALSE, $ban_reason=NULL){
		if ( !$this->user->info['special'] ) {
			Show::error(403);
		}
		$data = [
			'banned' => (int) $ban,
			'ban_reason' => (string)$ban_reason,
		];
		return db_edit( $data, "id = $agent_id", 'users' );
	}
	public function Prometay($agent_id, $give=TRUE){
		if ( !$this->user->info['special'] ) {
			Show::error(403);
		}
		
		if ($give) {
			$data = [
				'flash' => 1,
				'flashtime' => time(),
			];
			return db_edit( $data, "id = $agent_id", 'users' );
		}
		$data = [
			'flash' => 0,
			'flashtime' => 0,
		];
		return db_edit( $data, "id = $agent_id", 'users' );
    }
    public function NewRequestVerf($title, $desc, $number){
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
            'number' => $number,
            'time' => time(),
		];
		
		// global $mysqli;
		// return $mysqli->error;
		return db_add($data, 'request_verification');
	}
	public function getVerfStatus(){
		// 0 - Не верифицирован
		// 1 - Верифицирован
		// 2 - Заявка рассматривается
		$status = 0;
		$aid = $this->user->id;
		$sql = "SELECT verified from users where id=$aid";
		$res = db_get( $sql );
		if ( empty( $res ) ) {
			Show::error(404);
		}
		if($res[0]['verified']){
			$status = 1;
		}
		if(!$status){
			$sql = "SELECT time from request_verification where aid=$aid and inactive=0";
			$res = db_get( $sql );
			if ( !empty( $res ) ) {
				$status = 2;
			}
		}
		// global $mysqli;
		// return $mysqli->error;
		return $status;
	}
}