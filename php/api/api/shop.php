<?php
class Shop {
    protected $Connect;
    protected $user = null;

	function __construct( Users $user, DB $Connect, Levels $levels) {
        $this->users = $user;
        $this->Connect = $Connect;
        $this->levels = $levels;
    }

    public function changeNickname($nickname){
        $length = mb_strlen($nickname);
        if (!preg_match(CONFIG::REGEXP_VALID_NAME, $nickname)) {
            Show::error(1012);
        }
        if ($length > 11 || $length < 0) {
            Show::error(1004);
        }
        if (is_numeric($nickname)) {
			Show::error(1013);
		}
		$balance = $this->users->info['money'];
		if ($balance < CONFIG::NICKNAME_CHANGE_PRICE) {
            Show::error(1002);
        }
        $check_id = $this->Connect->db_get("SELECT id FROM users WHERE nickname=?", [$nickname]);
        if (count($check_id) != 0) {
            Show::error(1003);
        }
        $new_balance = $balance - CONFIG::NICKNAME_CHANGE_PRICE;
        $this->Connect->query("UPDATE users SET nickname=?, money=? WHERE vk_user_id=?", [$nickname,$new_balance, $this->users->id]);
        return $new_balance;
			
    }
    public function buyGhosts($count){
        $all_price = $count * CONFIG::GHOST_PRICE;
        $balance = $this->users->info['money'];
        if ($balance < $all_price) {
            Show::error(1002);
        }
        $new_balance = $balance - $all_price;
        $this->Connect->query("UPDATE users SET money=? WHERE vk_user_id=?", [$new_balance, $this->users->vk_id]);
        return $this->levels->addExp($this->users->id, $count);
    }


}