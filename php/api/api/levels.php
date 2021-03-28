<?php
class Levels {
    protected $Connect;
    protected $user = null;
    private $level;


	function __construct( Users $user, DB $Connect) {
        $this->users = $user;
        $this->Connect = $Connect;
    }

    public function getLevelInfo($lvl) {
        if($this->level !== null && $lvl === $this->level){
            return $this->level;
        }
        $this->level = $this->Connect->db_get("SELECT exp_to_lvl, exp_total FROM levels WHERE lvl = ?", [$lvl])[0];
        return $this->level;
    }

    public function getUserLvlInfo($agent_id) {


        return $this->Connect->db_get(
            "SELECT MAX(levels.lvl) as lvl, users.exp 
            FROM (SELECT levels.lvl FROM levels LEFT JOIN users ON users.id = ? WHERE exp_total - users.exp <= 0) as levels
            LEFT JOIN users ON users.id = ?", [$agent_id, $agent_id]);
        
    }
    public function changeExp($agent_id, $expSet) {

        $current_info = $this->Connect->db_get("SELECT id,lvl,exp FROM users WHERE id=?", [$agent_id]);

        $exp = (int) $current_info[0]['exp'];
        $lvl = (int) $current_info[0]['lvl'];

        $new_info = $this->Connect->db_get(
            "SELECT MAX(levels.lvl) as lvl
            FROM (SELECT levels.lvl FROM levels WHERE exp_total - ? <= 0) as levels", [$expSet]);
        $new_lvl = $new_info[0]['lvl'];
        $this->Connect->query("UPDATE users SET lvl=?, exp=? WHERE id=?", [$new_lvl, $expSet, $agent_id]);
        $exp_to_lvl = $this->Connect->db_get("SELECT exp_to_lvl FROM levels JOIN users ON users.lvl = levels.lvl AND users.id = ?", [$agent_id])[0]['exp_to_lvl'];

        return ['new_lvl' => (int)$new_lvl, 'exp_to_lvl' => (int)$exp_to_lvl];

    }

    public function addExp($agent_id, $exp) {
        $exp_user = $this->Connect->db_get("SELECT exp FROM users WHERE id=?", [$agent_id])[0]['exp'];
        $new_exp = $exp_user + $exp;
        return ['new_lvl_info' => $this->changeExp($agent_id, $new_exp), 'new_exp' => $new_exp];
    }
    public function removeExp($agent_id, $exp) {
        $exp_user = $this->Connect->db_get("SELECT exp FROM users WHERE id=?", [$agent_id])[0]['exp'];
        $new_exp = $exp_user - $exp;
        if($new_exp < 0) $new_exp = 0;
        return ['new_lvl_info' => $this->changeExp($agent_id, $new_exp), 'new_exp' => $new_exp];
    }
}