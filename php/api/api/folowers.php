<?php
class Followers {
    protected $Connect;
    protected $user = null;
    protected $account;


	function __construct( Users $user, DB $Connect) {
        $this->users = $user;
        $this->Connect = $Connect;
    }

    public function subscribe($from_id, $to_id){
        if($this->checkSubscribe($from_id, $to_id)) Show::error(1300);
        if($from_id == $to_id) Show::error(1302);
        $this->users->getById($to_id);
        return $this->Connect->query("INSERT INTO subscribes (from_id,to_id,time) VALUES (?,?,?)", [$from_id, $to_id, time()]);
    }
    
    public function unsubscribe($from_id, $to_id){
        if(!$this->checkSubscribe($from_id, $to_id)) Show::error(1301);
        $this->Connect->query("DELETE FROM subscribes WHERE from_id=? and to_id=?", [$from_id, $to_id]);
    }
    public function getFollowers($agent_id, $count, $offset, $isRand=TRUE){
        $rand = $isRand ? " ORDER BY RAND() " : '';
        $countFollowers = $this->Connect->db_get("SELECT COUNT(*) FROM subscribes WHERE to_id=?", [$agent_id]);
        $countNewFollowers = $this->Connect->db_get("SELECT COUNT(*) FROM subscribes WHERE to_id=? and time>=?", [$agent_id, time() - 43200]);
        $countFollowers = $countFollowers ? $countFollowers[0]['COUNT(*)'] : 0;
        $countNewFollowers = $countNewFollowers ? $countNewFollowers[0]['COUNT(*)'] : 0; 
        $Followers = $this->Connect->db_get("SELECT s.from_id, users.nickname, s.time, avatars.name as avatar_name
        FROM subscribes as s
        LEFT JOIN users ON s.from_id=users.id
        LEFT JOIN avatars ON users.avatar_id=avatars.id
        WHERE s.to_id=? 
        $rand
        LIMIT $offset,$count", [$agent_id]);
        return [(int)$countFollowers, (int)$countNewFollowers, $Followers];
    }
    public function checkSubscribe($from_id, $to_id){
        $Followers = (bool)$this->Connect->db_get("SELECT from_id,to_id,time FROM subscribes WHERE from_id=? and to_id=?", [$from_id, $to_id]);
        return $Followers;
    }
}