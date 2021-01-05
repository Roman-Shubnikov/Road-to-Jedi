<?php
class Recomendations {
    protected $Connect;
    protected $user = null;
    protected $account;


	function __construct( Users $user, DB $Connect, Followers $followers) {
        $this->users = $user;
        $this->Connect = $Connect;
        $this->followers = $followers;
    }
    public function getRecommendations($offset, $count){
        $recommendet = $this->Connect->db_get("SELECT aid FROM recommendations LIMIT $offset, $count");
		if(!$recommendet) Show::response([]);
		$ids = [];
		foreach($recommendet as $val){
			$ids[] = $val['aid'];
		}
		
		$res = $this->users->getByIds($ids);
		foreach($res as $key => $val){
			$res[$key]['followers'] = $this->followers->getFollowers($val['id'], 3, 0);
        }
        return $res;
    }
    public function is_recommended($agent_id){
        $recommendet = $this->Connect->db_get("SELECT aid FROM recommendations WHERE aid=?", [$agent_id]);
        if($recommendet) return true;
        return false;
    }

    public function add($agent_id){
        if(!$this->is_recommended($agent_id)){
            return $this->Connect->query("INSERT INTO recommendations (aid, time) VALUES (?,?)", [$agent_id, time()]);
        }
        Show::error(1450);
    }
}