<?php
class Shop {
    protected $Connect;
    protected $user = null;

	function __construct( Users $user, DB $Connect, Levels $levels) {
        $this->users = $user;
        $this->Connect = $Connect;
        $this->levels = $levels;
        $this->products = [
            'ghosts' => 1,
            'nickname' => 2,
        ];
    }
    public function logger($cost, $product){
        $this->Connect->query("INSERT INTO purchases (aid, product_id, cost, time) VALUES (?,?,?,?)", [$this->users->id, $this->products[$product], $cost, time()]);
    }
    private function formatProducts($object) {
        return [
            'item_id' => (int) $object['item_id'],
            'title' => (string) $object['title'],
            'photo_id' => (int) $object['photo_id'],
            'price' => (int) $object['price'],
            'discount' => (int) $object['discount'],
            'item_name' => (string) $object['item_name'],
            'in_stock' => (bool) $object['in_stock'],
        ];
    }
    public static function formatSubscription($object) {
        return [
            'item_id' => (int) $object['item_id'],
            'title' => (string) $object['title'],
            'photo_id' => (int) $object['photo_id'],
            'photo_url' => CONFIG::SUBSCRIBTIONS_AVATAR_PATH . "/" . $object['photo_id'] . '.png',
            'price' => (int) $object['price'],
            'period' => (int) $object['period'],
            'name' => (string) $object['name'],
            'trial_duration' => (int) $object['trial_duration'],
        ];
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
        if($this->users->info['permissions'] >= CONFIG::PERMISSIONS['special']) {
            $new_balance = $balance;
        }
        $this->logger(CONFIG::NICKNAME_CHANGE_PRICE, 'nickname');
        $this->Connect->query("UPDATE users SET nickname=?, money=? WHERE vk_user_id=?", [$nickname,$new_balance, $this->users->vk_id]);
        return $new_balance;
			
    }
    public function buyGhosts($count){
        $all_price = $count * CONFIG::GHOST_PRICE;
        $balance = $this->users->info['money'];
        if ($balance < $all_price) {
            Show::error(1002);
        }
        $new_balance = $balance - $all_price;
        $this->logger($all_price, 'ghosts');
        $this->Connect->query("UPDATE users SET money=? WHERE vk_user_id=?", [$new_balance, $this->users->vk_id]);
        return $this->levels->addExp($this->users->id, $count);
    }

    public function getProductByName($name) {
        $res = $this->Connect->db_get("SELECT id as item_id,title,photo_id,price,discount,item_name,in_stock FROM products WHERE item_name=?", [$name]);
        if(!$res) Show::error(1019);
        $res = $this->formatProducts($res[0]);
        if(!$res['in_stock']) Show::error(1020);
        $res['photo_url'] = CONFIG::PRODUCTS_AVATAR_PATH . "/" . $res['photo_id'] . 'png';
        return $res;
    }
    public function getProductsVoices() {
        $res = $this->Connect->db_get("SELECT id as item_id,title,photo_id,price,discount,item_name,in_stock FROM products");
        $products = [];
        // $subscriptions = [];
        foreach($res as $item) {
            $pre_out = $this->formatProducts($item);
            $pre_out['photo_url'] = CONFIG::PRODUCTS_AVATAR_PATH . "/" . $pre_out['photo_id'] . '.png';
            unset($pre_out['photo_id']);
            if(!($this->users->donut && $item['item_name'] == 'subscription_donut')){
                $products[] = $pre_out;
            } 
            
        }
        // $res = $this->Connect->db_get("SELECT id as item_id,title,photo_id,price,period,trial_duration,name FROM subscriptions_info");
        // foreach($res as $item) {
        //     $pre_out = $this->formatSubscription($item);
        //     unset($pre_out['photo_id']);
        //     $subscriptions[] = $pre_out;
        // }
        // $out = [
        //     'products' => $products,
        //     'subscriptions' => $subscriptions,
        // ];

        return $products;
    }


}