<?php 
class Promocodes {
	protected $user = null;
    protected $Connect;


    function __construct( Users $user,DB $Connect,SystemNotifications $SYSNotif ) {
		$this->user = $user;
		$this->Connect = $Connect;
		$this->SYSNOTIF = $SYSNotif;
    }

    public function check(string $promocode){
        if(preg_match("/^[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}$/", $promocode)){
            $res = $this->Connect->db_get("SELECT id,cost from promocodes WHERE code=? LIMIT 1", [$promocode]);
            if(empty($res)){
                Show::error(1015);
            }
            $res = $res[0];
            return ['id' => $res['id'], 'cost' => $res['cost']];
        }
        Show::error(1016);
    }

    public function activate($promocode){
        $uid = $this->user->vk_id;
        $check = $this->check($promocode);
        $cost = $check['cost'];
        $balance = $this->user->info['money'];
        $edit = $this->Connect->query("UPDATE users SET money=? WHERE vk_user_id=?", [$balance + $cost,$uid]);
        $this->Connect->query("DELETE FROM promocodes WHERE code=? LIMIT 1", [$promocode]);
        $object = [
			'type' => 'promo_activate'
        ];
        $notif = "Вы активировали промокод на $cost монет(ок)";
        $this->SYSNOTIF->send($this->user->id, $notif, null, $object);
        return ['id' => $check['id'], 'cost' => $check['cost'], 'edit' => $edit];
    }
}
