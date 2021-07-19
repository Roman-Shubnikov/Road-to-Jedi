<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
require './db.php';
require "../Utils/config.php";
header("Content-Type: application/json; encoding=utf-8");

const ERRORS = [
    1 => "Общая ошибка.",
    2 => "Временная ошибка базы данных.",
    10 => "Несовпадение вычисленной и переданной подписи.",
    11 => "В запросе нет необходимых полей;Ошибки целостности запроса.",
    20 => "Товара не существует.",
    21 => "Товара нет в наличии.",
    22 => "Пользователя не существует.",
    100 => "Неизвестный статус заказа",
    101 => "Заказ не найден в системе",
];

class Show_pay {
    private static function show( $object ) {
        // echo json_encode($object, JSON_UNESCAPED_UNICODE);
        echo json_encode($object, JSON_PRETTY_PRINT);
    }
    public static function response($object) {
        $response['response'] = $object;
        self::show($response);
        exit;
    } 
    public static function error($number, bool $critical, string $msg=null) {
        self::show([
            'error' => [
                'error_code' => $number,
                'error_msg' => $msg ? $msg : ERRORS[$number],
                'critical' => $critical
            ]
        ]);
        exit;
    }
}
function formatProducts($object) {
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
function formatNotify($object) {
    return [
        'notification_type' => (string)$object['notification_type'],
        'app_id' => (int)$object['app_id'],
        'user_id' => (int)$object['user_id'],
        'receiver_id' => (int)$object['receiver_id'],
        'order_id' => (int)$object['order_id'],
        'version' => (string)$object['version'],

    ];
}

function getProductByName($name) {
    global $connect;
    $res = $connect->db_get("SELECT id as item_id,title,photo_id,price,discount,item_name,in_stock FROM products WHERE item_name=?", [$name]);
    if(!$res) Show_pay::error(20, true);
    $res = formatProducts($res[0]);
    if(!$res['in_stock']) Show_pay::error(21, true);
    $res['photo_url'] = CONFIG::PRODUCTS_AVATAR_PATH . "/" . $res['photo_id'] . '.png';
    
    return $res;

}

function getOrderByIdVk($id) {
    global $connect;
    $res = $connect->db_get("SELECT 
    app_order_id,
    user_id, 
    receiver_id,
    date,
    status,
    item_id,
    item_name,
    item_title,
    item_photo_url,
    item_price,
    item_discount,
    order_id
    FROM purchases_voices
    WHERE order_id=?", [$id]);

    if(!$res) Show_pay::error(101, true);
    return $res[0];

}

function getUserByVkId($user_id) {
    global $connect;
    $res = $connect->db_get("SELECT id,vk_user_id,money FROM users WHERE vk_user_id=?", [$user_id]);
    if(!$res) Show_pay::error(22, true);
    return $res[0];
}


$connect = new DB_pay();

$input = $_POST;
// $input = $_GET;
// Проверка подписи
$sig = $input['sig'];
unset($input['sig']);
ksort($input);
$str = '';
foreach ($input as $k => $v) {
  $str .= $k.'='.$v;
}

if ($sig != md5($str.CONFIG::SECRET_KEY)) {
    Show_pay::error(10, true);
}
$base_notify = formatNotify($input);
// Подпись правильная
switch ($input['notification_type']) {
    case 'get_item':
    case 'get_item_test':
        // Получение информации о товаре
        $item_name = $input['item']; // наименование товара
        $item = getProductByName($item_name);
        $item['expiration'] = 600;
        if(str_starts_with($item_name, 'money_')) {
            Show_pay::response($item);
        }
        break;

    case 'order_status_change_test':
    case 'order_status_change':
        if ($input['status'] == 'chargeable') {
            $order_id = $base_notify['order_id'];
            $reciver_info = getUserByVkId($base_notify['receiver_id']);
            $item = getProductByName($input['item']);
            $res = $connect->query("INSERT INTO 
            purchases_voices 
            (
                user_id, 
                receiver_id,
                date,
                status,
                item_id,
                item_name,
                item_title,
                item_photo_url,
                item_price,
                item_discount,
                order_id
            )
            VALUES 
            (?,?,?,?,?,?,?,?,?,?,?)",
            [
                $base_notify['user_id'],
                $base_notify['receiver_id'],
                $input['date'],
                $input['status'],
                $input['item_id'],
                $input['item'],
                $input['item_title'],
                $input['item_photo_url'],
                $input['item_price'],
                $item['discount'],
                $order_id,
            ]);
            $app_order_id = $res[1];
            if(str_starts_with($item['item_name'], 'money_')) {
                $pre_cost = explode('_', $item['item_name']);
                $cost = intval(end($pre_cost));
                $connect->query("UPDATE users SET money=? WHERE vk_user_id=?", [$reciver_info['money']+$cost, $base_notify['receiver_id']]);
            }
            // Код проверки товара, включая его стоимость
            // Получающийся у вас идентификатор заказа.
            
            
            Show_pay::response([
                'order_id' => (int)$order_id,
                'app_order_id' => (int)$app_order_id,
            ]);
        }elseif($input['status'] == 'refunded') {
            $order_id = $base_notify['order_id'];
            $order_info = getOrderByIdVk($order_id);
            $reciver_info = getUserByVkId($base_notify['receiver_id']);
            if(str_starts_with($item['item_name'], 'money_')) {
                $cost = intval(end(explode('_', $item['item_name'])));
                $connect->query("UPDATE users SET money=? WHERE vk_user_id=?", [$reciver_info['money']-$cost, $base_notify['receiver_id']]);
            }
            Show_pay::response([
                'order_id' => (int)$order_id,
                'app_order_id' => (int)$order_info['app_order_id'],
            ]);
        } else {
            Show_pay::error(100, true);
        }
        break;
}

