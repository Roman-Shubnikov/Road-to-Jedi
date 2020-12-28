<?php

// ini_set('error_reporting', E_ERROR);
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// mysqli_report(MYSQLI_REPORT_STRICT); 


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
    header('Access-Control-Allow-Headers: token, Content-Type');
    header('Access-Control-Max-Age: 1728000');
    header('Content-Length: 0');
    header('Content-Type: text/plain');
    die();
}
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require("Utils/config.php");
require("Utils/Show.php");
require("Utils/AccessCheck.php");
require("Utils/FludControl.php");
require("Utils.php");
require 'api/db.php';
require 'vkapi.php';

set_exception_handler( 'exceptionerror' );

require 'api/api/users.php';
require 'api/api/account.php';
require 'api/api/tickets.php';
require 'api/api/notifications.php';
require 'api/api/promocodes.php';
require 'api/api/reports.php';
require 'api/api/folowers.php';

session_id( $_GET['vk_user_id'] );
session_start();


function exceptionerror( $ex ) {
	// $code = $ex->getCode();
	// $msg = $ex->getMessage();

	// if ( $code == 0 ) $msg = CONFIG::ERRORS[0];
	// $data = [
	// 	'result' => false,
	// 	'error' => [
	// 		'code' => $code,
	// 		'message' => $msg
	// 	]
	// 	];
	Show::error(0);

	// $pretty = isset($data['debug']) ? JSON_PRETTY_PRINT : 0;
	// echo json_encode( $data, JSON_UNESCAPED_UNICODE | $pretty );
}
function offset_count( int &$offset, int &$count ) {
	if ( $offset < 0 ) $offset = 0;
	if ( $count < 0 ) $count = CONFIG::ITEMS_PER_PAGE;

	if ( $count > CONFIG::MAX_ITEMS_COUNT ) $count = CONFIG::MAX_ITEMS_COUNT;
}

new AccessCheck();
new FludControl();

$params = [
	'account.get' => [],
	'account.delete' => [],
	'account.setAge' => [
		'age' => [
			'type' => 'int',
			'required' => true
		]
	],
	'account.getVerfStatus' => [],
	'account.sendRequestVerf' => [
		'title' => [
			'type' => 'string',
			'required' => true
		],
		'description' => [
			'type' => 'string',
			'required' => true
		],
		'cond1' => [
			'type' => 'bool',
			'required' => true
		],
	],
	'account.changeScheme' => [
		'scheme' => [
			'type' => 'int',
			'required' => true
		]
	],
	'account.Flash' => [
		'agent_id' => [
			'type' => 'int',
			'required' => true,
		],
		'give' => [
			'type' => 'int',
			'required' => false,
			'default' => 1,
		],
	],
	'account.ban' => [
		'agent_id' => [
			'type' => 'int',
			'required' => true
		],
		'timeban' => [
			'type' => 'int',
			'required' => true,
		],
		'reason' => [
			'type' => 'string',
			'required' => false,
			'default' => NULL
		]
	],
	'account.public' => [
		'public' => [
			'type' => 'bool',
			'required' => true
		]
	],
	'user.getById' => [
		'id' => [
			'type' => 'int',
			'required' => true
		]
	],

	'users.getByIds' => [
		'ids' => [
			'type' => 'string',
			'required' => true
		]
	],
	'users.getRandom' => [],
	'users.getTop' => [
		'staff' => [
			'type' => 'bool',
			'required' => false
		]
	],
	
	'ticket.getRandom' => [],

	'tickets.getMy' => [
		'offset' => [
			'type' => 'int',
			'required' => false
		],

		'count' => [
			'type' => 'int',
			'required' => false
		]
	],

	'tickets.get' => [
		'offset' => [
			'type' => 'int',
			'required' => false
		],

		'count' => [
			'type' => 'int',
			'required' => false
		],

		'unanswered' => [
			'type' => 'int',
			'required' => false
		]
	],
	'tickets.getByModeratorAnswers' => [
		'offset' => [
			'type' => 'int',
			'required' => false
		],

		'count' => [
			'type' => 'int',
			'required' => false
		],
	],

	'ticket.markMessage' => [
		'message_id' => [
			'type' => 'int',
			'required' => true
		],

		'mark' => [
			'type' => 'int',
			'required' => true
		]
	],
	'ticket.unmarkMessage' => [
		'message_id' => [
			'type' => 'int',
			'required' => true
		],
	],

	'ticket.add' => [
		'title' => [
			'type' => 'string',
			'required' => true
		],

		'text' => [
			'type' => 'string',
			'required' => true
		],
		'user' => [
			'type' => 'int',
			'required' => true,
		],
		'donut_only' => [
			'type' => 'bool',
			'required' => true,
		],
	],

	'ticket.sendMessage' => [
		'ticket_id' => [
			'type' => 'int',
			'required' => true
		],

		'text' => [
			'type' => 'string',
			'required' => true
		]
	],

	'ticket.editMessage' => [
		'message_id' => [
			'type' => 'int',
			'required' => true
		],

		'text' => [
			'type' => 'string',
			'required' => true
		]
	],

	'ticket.commentMessage' => [
		'message_id' => [
			'type' => 'int',
			'required' => true
		],

		'text' => [
			'type' => 'string',
			'required' => true
		]
	],

	'ticket.editComment' => [
		'message_id' => [
			'type' => 'int',
			'required' => true
		],

		'text' => [
			'type' => 'string',
			'required' => true
		]
	],

	'ticket.deleteComment' => [
		'message_id' => [
			'type' => 'int',
			'required' => true
		]
	],

	'ticket.getMessages' => [
		'ticket_id' => [
			'type' => 'int',
			'required' => true
		],

		'offset' => [
			'type' => 'int',
			'required' => false
		],

		'count' => [
			'type' => 'int',
			'required' => false
		],
	],

	'ticket.getById' => [
		'ticket_id' => [
			'type' => 'int',
			'required' => true
		]
	],

	'ticket.approveReply' => [
		'message_id' => [
			'type' => 'int',
			'required' => true
		]
	],

	'tickets.getByModerator' => [
		'moderator_id' => [
			'type' => 'int',
			'required' => true
		],

		'mark' => [
			'type' => 'int',
			'required' => false
		],

		'offset' => [
			'type' => 'int',
			'required' => false
		],

		'count' => [
			'type' => 'int',
			'required' => false
		],
	],

	// 'ticket.deleteMessage' => [
	// 	'message_id' => [
	// 		'type' => 'int',
	// 		'required' => true
	// 	]
	// ],

	'ticket.close' => [
		'ticket_id' => [
			'type' => 'int',
			'required' => true
		]
	],

	'ticket.open' => [
		'ticket_id' => [
			'type' => 'int',
			'required' => true
		]
	],
	'shop.changeAvatar' => [
		'avatar_id' => [
			'type' => 'int',
			'required' => true
		]
	],
	'shop.changeId' => [
		'change_id' => [
			'type' => 'string',
			'required' => true
		] 
	],
	'shop.resetId' => [],
	'shop.buyDiamond' => [],
	'shop.checkPromo' => [
		'promocode' => [
			'type' => 'string',
			'required' => true
		],
	],
	'shop.activatePromo' => [
		'promocode' => [
			'type' => 'string',
			'required' => true
		],
	],
	'transfers.send' => [
		'send_to' => [
			'type' => 'intorstr',
			'required' => true
		],
		'summa' => [
			'type' => 'int',
			'required' => true
		],
		'comment' => [
			'type' => 'string',
			'required' => true
		]
	],
	'followers.subscribe' => [
		'agent_id' => [
			'type' => 'int',
			'required' => true
		]
	],
	'followers.unsubscribe' => [
		'agent_id' => [
			'type' => 'int',
			'required' => true
		]
	],
	'followers.getFollowers' => [
		'offset' => [
			'type' => 'int',
			'required' => true
		],
		'count' => [
			'type' => 'int',
			'required' => true
		],
		'agent_id' => [
			'type' => 'int',
			'required' => false
		]
	],
	'notifications.get' => [],
	'notifications.markAsViewed' => [],
	'notifications.getCount' => [],
	'notifications.approve' => [],
	'notifications.demiss' => [],

	
	'special.getAllMessages' => [
		'offset' => [
			'type' => 'int',
			'required' => true
		],
		'count' => [
			'type' => 'int',
			'required' => true
		],
	],
	'special.getNewMessages' => [
		'offset' => [
			'type' => 'int',
			'required' => true
		],
		'count' => [
			'type' => 'int',
			'required' => true
		],
	],
	'special.getNewModerationTickets' => [
		'offset' => [
			'type' => 'int',
			'required' => true
		],
		'count' => [
			'type' => 'int',
			'required' => true
		],
	],
	'special.addNewModerationTicket' => [
		'title' => [
			'type' => 'string',
			'required' => true
		],
		'text' => [
			'type' => 'string',
			'required' => true
		],
		'donut_only' => [
			'type' => 'bool',
			'required' => true
		],
	],
	'special.delModerationTicket' => [
		'id_ans' => [
			'type' => 'int',
			'required' => true
		],
	],
	'special.approveModerationTicket' => [
		'id_ans' => [
			'type' => 'int',
			'required' => true
		],
	],
	'admin.getVerificationRequests' => [
		'offset' => [
			'type' => 'int',
			'required' => true
		],
		'count' => [
			'type' => 'int',
			'required' => true
		],
	],
	'admin.denyVerificationRequest' => [
		'id_request' => [
			'type' => 'int',
			'required' => true
		],
	],
	'admin.approveVerificationRequest' => [
		'id_request' => [
			'type' => 'int',
			'required' => true
		],
	],
	'reports.send' => [
		'type' => [
			'type' => 'int',
			'required' => true
		],
		'name' => [
			'type' => 'int',
			'required' => true
		],
		'id_rep' => [
			'type' => 'int',
			'required' => true
		],
		'comment' => [
			'type' => 'string',
			'required' => False,
		],
	],
	'reports.getReports' => [
		'offset' => [
			'type' => 'int',
			'required' => true
		],
		'count' => [
			'type' => 'int',
			'required' => true
		],
	],
	'reports.denyReport' => [
		'id_request' => [
			'type' => 'int',
			'required' => true
		],
	],
	'reports.approveReport' => [
		'id_request' => [
			'type' => 'int',
			'required' => true
		],
	],
];
$user_id = (int) $_GET['vk_user_id'];
$method = $_GET['method'];

$data = file_get_contents('php://input');
$data = json_decode($data, true);
// if($user_id == 413636725){
// 	var_dump($data);
// }

if(!$data){
	$data = $_POST;
}

if ( !isset( $params[$method] ) ) {
	Show::error(405);
}
Utils::checkParams($params[$method], $data);

$Connect = new DB();
$users = new Users( $user_id, $Connect );
$notifications = new Notifications( $users,$Connect );
$sysnotifications = new SystemNotifications( $Connect );
$account = new Account( $users,$Connect,$sysnotifications );
$tickets = new Tickets( $users,$Connect,$sysnotifications );
$promocodes = new Promocodes($users, $Connect, $sysnotifications);
$reports = new Reports($users, $Connect, $account);
$followers = new Followers($users, $Connect);


function getBalance() {
	global $Connect, $user_id;
    return $Connect->db_get("SELECT money FROM users WHERE vk_user_id=?", [$user_id])[0]['money'];
}


switch ( $method ) {
	case 'account.delete':
		Show::response( $account->deleteAccount());

	case 'account.setAge':
		$age = $data['age'];
		if($age < 10 || $age > 100){
			Show::error(1009);
		}
		Show::response( $account->ChangeAge($age));

	case 'account.get':
		Show::response( $users->getMy() );
	
	case 'account.changeScheme':
		$scheme = $data['scheme'];
		if(!in_array($scheme, [0,1,2])){
			Show::error(1010);
		}
		Show::response( $account->changeScheme($scheme) );
	
	case 'account.Flash':
		$agent_id = $data['agent_id'];
		$give = (bool)$data['give'];
		Show::response( $account->Prometay($agent_id, $give) );

	case 'account.ban':
		$agent_id = $data['agent_id'];
		if($agent_id < 0){
			$agent_id = $users->getIdByVKId(-$agent_id);
		}
		$ban_reason = (string) $data['reason'];
		$timeban = (int) $data['timeban'];
		Show::response( $account->Ban_User( $agent_id,$ban_reason, $timeban ) );

	case 'account.getVerfStatus':
		Show::response( $account->getVerfStatus() );

	case 'account.sendRequestVerf':
		$title = trim((string) $data['title']);
		$desc = trim((string) $data['description']);
		// $number = (int) $data['phone_number'];
		// $sign_number = (string) $data['phone_sign'];
		if(preg_match(CONFIG::REGEXP_VALID_TEXT, $title) && preg_match(CONFIG::REGEXP_VALID_TEXT, $desc)){
			$conditions = (bool)$data['cond1'];
			if(mb_strlen($title) > 5 && mb_strlen($desc) > 10 && mb_strlen($title) <= 2000 && mb_strlen($desc) <= 2000){
				if($conditions){
					// $sign_num_construct = CONFIG::APP_ID . CONFIG::SECRET_KEY . $user_id . 'phone_number' . $number;
					// $shasignature = rtrim(strtr(base64_encode(hash('sha256', $sign_num_construct, true)), '+/', '-_'), '=');
					// if($sign_number === $shasignature){
						Show::response( $account->NewRequestVerf($title, $desc) );
					// }else{
					// 	Show::error(1102);
					// }
				}else{
					Show::error(1101);
				}
			}else{
				Show::error(1100);
			}
		}else{
			Show::error(1105);
		}
	case 'account.public':
		$isPublic = (bool)$data['public'];
		Show::response($account->publicProfile($isPublic));
	
	case 'user.getById':
		$id = (int) $data['id'];
		$res = $users->getById( $id );
		$followsUser = $followers->getFollowers($id, 3, 0);
		$res['followers'] = $followsUser;

		Show::response( $res );

	case 'users.getByIds':
		$ids = $data['ids'];
		Show::response( $users->getByIds( $ids ) );

	case 'users.getTop':
		$staff = ($data['staff'] != null) ? (int) $data['staff'] : false;
		if($staff){
			if ( !$users->info['special'] ) {
				$staff = false;
			}
		}
		Show::response( $users->getTop($staff) );
	
	case 'users.getRandom':
		Show::response( $users->getRandom() );

	case 'ticket.getRandom':
		$res = $tickets->getRandom();
		if($res){
			Show::response( $res );
		}
		Show::error(36);

	case 'tickets.getMy':
		$offset = isset($data['offset']) ? (int) $data['offset'] : 0;
		$count = $data['count'] ?? CONFIG::ITEMS_PER_PAGE;

		Show::response( $tickets->getMy( $offset, $count ) );

	case 'tickets.getByModeratorAnswers':
		$offset = isset($data['offset']) ? (int) $data['offset'] : 0;
		$count = $data['count'] ?? CONFIG::ITEMS_PER_PAGE;
		$id = $users->id;
		Show::response( $tickets->getByModeratorAnswers( $offset, $count, $id) );

	case 'tickets.get':
		$offset = isset($data['offset']) ? (int) $data['offset'] : 0;
		$count = $data['count'] ?? CONFIG::ITEMS_PER_PAGE;
		$unanswered = (bool) $data['unanswered'] ?? false;

		Show::response( $tickets->get( $unanswered, $offset, $count ) );

	case 'ticket.getMessages':
		$id = (int) $data['ticket_id'];
		$offset = 0;
		$count = 1000;

		Show::response( ['messages' => $tickets->getMessages( $id, $offset, $count ), 'limitReach' => $tickets->isLimitReach($id)] );

	case 'ticket.sendMessage':
		$id = isset( $data['ticket_id'] ) ? $data['ticket_id'] : $data['ticket_id'];
		$text = trim($data['text']);
		if($tickets->isLimitReach($id)){
			Show::error(35);
		}

		Show::response( $tickets->sendMessage( $id, $text ) );

	case 'ticket.editMessage':
		$id = $data['message_id'];
		$text = trim($data['text']);

		Show::response( $tickets->editMessage( $id, $text ) );

	case 'ticket.commentMessage':
		$id = $data['message_id'];
		$text = trim($data['text']);

		Show::response( $tickets->commentMessage( $id, $text ) );

	case 'ticket.editComment':
		$id = $data['message_id'];
		$text = trim($data['text']);

		Show::response( $tickets->editComment( $id, $text ) );

	case 'ticket.deleteComment':
		$id = $data['message_id'];

		Show::response( $tickets->deleteComment( $id ) );

	case 'ticket.add':
		$title = $data['title'];
		$text = trim($data['text']);
		$userQue = (int) $data['user'];
		$donut = (bool) $data['donut_only'];
		if($userQue > 0){
			$userQue = -$userQue;
		}
		Show::response( $tickets->add( $title, $text, $userQue, $donut ) );

	case 'ticket.getById':
		$id = (int) $data['ticket_id'];

		$offset = 0;
		$count = 1000;
		$messages = $tickets->getMessages( $id, $offset, $count );
		$info = $tickets->getById( $id );
		
		if($info) {
			Show::response( 
				[
				'info' => $info,
				'messages' => $messages,
				'limitReach' => $tickets->isLimitReach($id)
				]
			);
		} else {
			Show::error(34);
		}

	case 'ticket.approveReply':
		$id = (int) $data['message_id'];

		Show::response( $tickets->approve( $id ) );

	case 'ticket.close':
		$id = (int) $data['ticket_id'];

		Show::response( $tickets->close( $id ) );

	case 'ticket.open':
		$id = (int) $data['ticket_id'];

		Show::response( $tickets->open( $id ) );

	case 'tickets.getByModerator':
		$mid = (int) $data['moderator_id'];
		$mark = isset( $data['mark'] ) ? $data['mark'] : -1;
		$offset = (int) $data['offset'] ?? 0;
		$count = $data['count'] ?? CONFIG::ITEMS_PER_PAGE;

		Show::response( $tickets->getByModerator( $mid, $mark, $offset, $count ) );

	case 'ticket.markMessage':
		$id = (int) $data['message_id'];
		$mark = (int) $data['mark'];

		Show::response( $tickets->markMessage( $id, $mark ) );

	case 'ticket.unmarkMessage':
		$id = (int) $data['message_id'];
		$sql = "SELECT messages.id, messages.ticket_id, messages.author_id, messages.mark, messages.time, messages.text,
					   users.avatar_id, users.nickname, users.money, avatars.name as avatar_name, messages.approved
			    FROM messages 
				LEFT JOIN users
				ON messages.author_id > 0 AND messages.author_id = users.id
				LEFT JOIN avatars
				ON users.avatar_id = avatars.id
				WHERE messages.id=?";
		$res = $Connect->db_get( $sql,[$id] )[0];
		if ( !$users->info['special'] ) {
			Show::error(32);
		}
		if( $res['author_id'] < 0) {
			Show::error(33);
		}
		if ( $res['mark'] == -1 ) {
			Show::error(39);
		}
		$mark = $res['mark'];
		$auid = $res['author_id'];
		$good_or_bad = $mark == 1 ? 'good_answers' : 'bad_answers';
		$money = $mark == 1 ? 'money=money-10' : 'money=money';
		$sql = "UPDATE users SET $good_or_bad = $good_or_bad - 1, $money WHERE id=?";
		$Connect->query( $sql,[$auid]);

		Show::response( $Connect->query("UPDATE messages SET mark=-1, approve_author_id=null WHERE id=?", [$id]));

	// case 'ticket.deleteMessage':
	// 	$id = (int) $data['message_id'];
	// 	Show::response( $tickets->deleteMessage( $id ) );

	case 'notifications.get':
		Show::response( $notifications->get() );

	case 'notifications.markAsViewed':
		Show::response( $notifications->markAsViewed() );

	case 'notifications.getCount':
		Show::response( $notifications->getCount() );

	case 'notifications.approve':
		Show::response( $notifications->approve() );

	case 'notifications.demiss':
		Show::response( $notifications->demiss() );

	case 'shop.changeId':
		$id = trim($data['change_id']);
		$len = mb_strlen($id);
		if(is_numeric($id)){
			Show::error(1013);
		}
		if(preg_match(CONFIG::REGEXP_VALID_NAME, $id)){
			if( $len < 11 && $len > 0 ) {
				$balance_profile = getBalance();
				if( $balance_profile >= CONFIG::NICKNAME_CHANGE_PRICE ) {
					$check_id = $Connect->db_get("SELECT id FROM users WHERE nickname = ?", [$id, $id]);
					if( count($check_id) == 0 ) {
						$Connect->query("UPDATE users SET money=? WHERE vk_user_id=?", [$balance_profile - CONFIG::NICKNAME_CHANGE_PRICE,$user_id]);
						$Connect->query("UPDATE users SET nickname=? WHERE vk_user_id=?", [$id, $user_id]);
						Show::response(
							['balance' => $balance_profile - 2]
						);
					} else {
						Show::error(1003);
					}
				} else {
					Show::error(1002);
				}
			} else {
				Show::error(1004);
			}
		}else{
			Show::error(1012);
		}
		break;
	case 'shop.resetId':
		$Connect->query("UPDATE users SET nickname=? WHERE vk_user_id=?", [null, $user_id]);
		Show::response();

	case 'shop.changeAvatar':
		$id = $data['avatar_id'];
		if( $id <= CONFIG::AVATARS_COUNT && $id > 0 ) {
			$balance = getBalance();
			if( $balance >= CONFIG::AVATAR_PRICE ) {
				$edit = $Connect->query("UPDATE users SET money=?,avatar_id=? WHERE vk_user_id=?", [$balance - CONFIG::AVATAR_PRICE,$id,$user_id]);
				Show::response(['edit' => $edit]);
			} else {
				Show::error(1002);
			}
		} else {
			Show::error(1008);
		}
	case 'shop.buyDiamond':
		if(!$users->info['diamond']){
			$balance = getBalance();
			if( $balance >= CONFIG::DIAMOND_PRICE ) {
				$edit = $Connect->query("UPDATE users SET money=?,diamond=1 WHERE vk_user_id=?", [$balance - CONFIG::DIAMOND_PRICE,$user_id]);
				Show::response(['edit' => $edit]);
			} else {
				Show::error(1002);
			}
		}else{
			Show::error(1014);
		}
	case 'shop.checkPromo':
		$promo = (string)$data['promocode'];
		Show::response($promocodes->check($promo));

	case 'shop.activatePromo':
		$promo = (string)$data['promocode'];
		Show::response($promocodes->activate($promo));

	case 'transfers.send':
		$summa = (int) $data['summa'];
		$send_to = trim($data['send_to']);
		$comment = trim($data['comment']) ? trim($data['comment']) : null;
		$balance_profile = getBalance();
		if($comment){
			$len = mb_strlen($comment);
			if($len >= 100){
				Show::error(7);
			}
		}
		if( $summa > 0 && $summa !== 0 ) {
			if( $balance_profile >= $summa ) {
				if(is_numeric($send_to)){
					$balanceTo = $Connect->db_get("SELECT * FROM users WHERE id=?", [$send_to])[0];
				}else{
					$balanceTo = $Connect->db_get("SELECT * FROM users WHERE nickname=?", [$send_to])[0];
				}
				
				if( $balanceTo ) {
					$idTo = $balanceTo['id'];
					$avatarTo = $balanceTo['avatar_id'];
					$userInfo = $Connect->db_get("SELECT * FROM users WHERE vk_user_id=?", [$user_id])[0];
					$idWhoSend = $userInfo['id'];
					$avatarIdWhoSend = $userInfo['avatar_id'];
					$avatar = CONFIG::AVATAR_PATH.'/'. $Connect->db_get("SELECT * FROM avatars WHERE id=?", [$avatarIdWhoSend])[0]['name'];
					$avatarTo = CONFIG::AVATAR_PATH.'/'.$Connect->db_get("SELECT * FROM avatars WHERE id=?", [$avatarTo])[0]['name'];
					if( $balanceTo['vk_user_id'] != $user_id ) {

						$help = $Connect->query("UPDATE users SET money=? WHERE id=?", [$balanceTo['money'] + $summa, $idTo]);

						$sysnotifications->send($idTo, "Вам поступил перевод в размере $summa монеток от агента #$idWhoSend", $avatar, [
							'type' => 'money_transfer_give',
							'object' => 0
						], $comment);
						$sysnotifications->send($idWhoSend, "Вы успешно перевели $summa монеток агенту #$idTo", $avatarTo, [
							'type' => 'money_transfer_send',
							'object' => 0
						]);
						$Connect->query("UPDATE users SET money=? WHERE vk_user_id=?", [$balance_profile - $summa, $user_id]);

						Show::response(['money' => $balance_profile - $summa, 'help' => $help, 'avatar' => $avatarTo]);
					} else {
						Show::error(1007);
					}
				} else {
					Show::error(1005);
				}
			} else {
				Show::error(1011);
			}
		} else {
			Show::error(1006);
		}
	case 'followers.subscribe':
		$agent_id = (int)$data['agent_id'];
		$followers->subscribe($users->id, $agent_id);

	case 'followers.unsubscribe':
		$agent_id = (int)$data['agent_id'];
		$followers->unsubscribe($users->id, $agent_id);

	case 'followers.getFollowers':
		$count = (int) $data['count'];
		$offset = (int) $data['offset'];
		$agent_id = $data['agent_id'] ? (int) $data['agent_id'] : $users->id;
		if($count > 200) $count = 200;
		if($count <= 0) $count = 1;
		$followers->getFollowers($agent_id, $count, $offset);

	case 'special.getAllMessages':
		$count = (int) $data['count'];
		$offset = (int) $data['offset'];
		if ( !$users->info['special'] ) {
			Show::error(403);
		}
		Show::response( $Connect->db_get("SELECT * FROM messages WHERE author_id>0 order by id asc LIMIT $offset, $count"));

	case 'special.getNewMessages':
		$count = (int) $data['count'];
		$offset = (int) $data['offset'];
		if ( !$users->info['special'] ) {
			Show::error(403);
		}
		$res = $Connect->db_get(
			"SELECT tickets.id, COUNT(messages.id) as count_unmark
			FROM tickets 
			LEFT JOIN messages on tickets.id=messages.ticket_id
			WHERE messages.mark=-1 AND messages.author_id>0
			GROUP BY tickets.id ORDER BY COUNT(messages.id) DESC LIMIT $offset, $count"
			);
		$out = [];
		foreach($res as $val){
			$out[] = ['id' => (int)$val['id'], 'count_unmark' => (int)$val['count_unmark']];
		}
		Show::response($out);


	case 'special.addNewModerationTicket':
		$title = trim($data['title']);
		$text = trim($data['text']);
		$donut = (bool) $data['donut_only'];
		if ( !$users->info['generator'] ) {
			Show::error(403);
		}

		if ( mb_strlen( $title ) >= CONFIG::MAX_TICKETS_TITLE_LEN ) {
			Show::error(20);
		}

		if ( mb_strlen( $text ) >= CONFIG::MAX_TICKETS_TEXT_LEN ) {
			Show::error(21);
		}

		if ( mb_strlen( $title ) <= CONFIG::MIN_MESSAGE_LEN ) {
			Show::error(24);
		}

		if ( mb_strlen( $text ) <= CONFIG::MIN_MESSAGE_LEN ) {
			Show::error(23);
		}
		$res = $Connect->query("INSERT INTO queue_quest (title, description, donut, time, author_id) VALUES (?,?,?,?,?)", [$title,$text,(int)$donut, time(), $users->vk_id]);
		$id = $res[1];
		if ( !$res[1] ) {
			Show::error(0);
		}
		Show::response(['quest_id' => $id]);

	case 'special.delModerationTicket':
		$id_answer = $data['id_ans'];
		if ( !$users->info['special'] ) {
			Show::error(403);
		}
		$res = $Connect->db_get("SELECT author_id,time FROM queue_quest WHERE id=?", [$id_answer]);
		if($res){
			$Connect->query("UPDATE users SET bad_answers=bad_answers-1 WHERE vk_user_id=?", [$res[0]['author_id']]);
			$Connect->query("UPDATE users SET bad_answers=bad_answers+1 WHERE vk_user_id=?", [$users->vk_id]);
		}
		Show::response($Connect->query("DELETE FROM queue_quest WHERE id=?", [$id_answer]));

	case 'special.approveModerationTicket':
		$id_answer = $data['id_ans'];
		if ( !$users->info['special'] ) {
			Show::error(403);
		}
		$res = $Connect->db_get("SELECT author_id,time FROM queue_quest WHERE id=?", [$id_answer]);
		if($res){
			$Connect->query("UPDATE users SET bad_answers=bad_answers+1 WHERE vk_user_id=?", [$res[0]['author_id']]);
			$Connect->query("UPDATE users SET bad_answers=bad_answers+1 WHERE vk_user_id=?", [$users->vk_id]);
		}
		Show::response($Connect->query("UPDATE queue_quest SET moder=1 WHERE id=?", [$id_answer]));

	case 'special.getNewModerationTickets':
		$count = (int) $data['count'];
		$offset = (int) $data['offset'];
		if ( !$users->info['special'] ) {
			Show::error(403);
		}
		$res = $Connect->db_get(
			"SELECT id, title, description, donut, time
			FROM queue_quest 
			WHERE moder=0 ORDER BY time DESC LIMIT $offset, $count"
			);
		$out = [];
		foreach($res as $val){
			$out[] = ['id' => (int)$val['id'], 'title' => (string)$val['title'], 'description' => (string)$val['description'], 'time' => (int)$val['time'],];
		}
		Show::response($out);
		
	case 'admin.getVerificationRequests':
		$count = (int) $data['count'];
		$offset = (int) $data['offset'];
		if ( $users->info['special'] < 2 ) {
			Show::error(403);
		}
		$res = $Connect->db_get(
			"SELECT id, vk_id, aid, title, descverf, time
			FROM request_verification 
			WHERE inactive=0
			ORDER BY time DESC LIMIT $offset, $count"
			);
		$out = [];
		foreach($res as $val){
			$out[] = ['id' => (int)$val['id'], 
			'vk_id' => (int)$val['vk_id'], 
			'aid' => (int)$val['aid'], 
			'title' => (string)$val['title'], 
			'description' => (string)$val['descverf'], 
			'time' => (int)$val['time'],];
		}
		Show::response($out);

	case 'admin.approveVerificationRequest':
		$id_request = $data['id_request'];
		if ( $users->info['special'] < 2 ) {
			Show::error(403);
		}
		$res = $Connect->db_get("SELECT id, aid, title, descverf, time FROM request_verification WHERE id=?", [$id_request]);
		if($res){
			$account->Verification($res[0]['aid']);
			$object = [
				'type' => 'verification_approve'
			];
			$sysnotifications->send($res[0]['aid'], "Запрос на верификацию одобрен", null, $object);

		}
		Show::response($Connect->query("UPDATE request_verification SET inactive=1 WHERE id=?", [$id_request]));

	case 'admin.denyVerificationRequest':
		$id_request = $data['id_request'];
		if ( $users->info['special'] < 2 ) {
			Show::error(403);
		}
		$res = $Connect->db_get("SELECT id, aid, title, descverf, time FROM request_verification WHERE id=?", [$id_request]);
		if($res){
			$object = [
				'type' => 'verification_demiss'
			];
			$sysnotifications->send($res[0]['aid'], "Запрос на верификацию отклонён", null, $object);
		}
		Show::response($Connect->query("UPDATE request_verification SET inactive=1 WHERE id=?", [$id_request]));


	case 'reports.send':
		$type_rep = $data['type'];
		$name = $data['name'];
		$id_rep = $data['id_rep'];
		$comment = trim($data['comment']);
		$reports->send($type_rep, $name, $id_rep, $comment);
		
	case 'reports.getReports':
		$count = (int) $data['count'];
		$offset = (int) $data['offset'];
		$res = $reports->get($count, $offset);
		Show::response($res);

	case 'reports.approveReport':
		$id_request = $data['id_request'];
		$reports->approve($id_request);

	case 'reports.denyReport':
		$id_request = $data['id_request'];
		$reports->deny($id_request);
}			