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


// require 'api/api/config.php';



require("Utils/config.php");
require("Utils/Show.php");
require("Utils/AccessCheck.php");
require("Utils/FludControl.php");
require("Utils.php");
require 'api/db.php';
// require 'api/func.php';
require 'vkapi.php';

// set_exception_handler( 'exceptionerror' );

require 'api/api/users.php';
require 'api/api/account.php';
require 'api/api/tickets.php';
require 'api/api/notifications.php';

session_id( $_GET['vk_user_id'] );
session_start();


function exceptionerror( $ex ) {
	$code = $ex->getCode();
	$msg = $ex->getMessage();

	if ( $code == 0 ) $msg = CONFIG::ERRORS[0];

	$data = [
		'result' => false,
		'error' => [
			'code' => $code,
			'message' => $msg
		]
	];

	$pretty = isset($data['debug']) ? JSON_PRETTY_PRINT : 0;
	echo json_encode( $data, JSON_UNESCAPED_UNICODE | $pretty );
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
		// 'phone_number' => [
		// 	'type' => 'int',
		// 	'required' => true
		// ],
		// 'phone_sign' => [
		// 	'type' => 'string',
		// 	'required' => true
		// ],
		'cond1' => [
			'type' => 'bool',
			'required' => true
		],
		// 'cond2' => [
		// 	'type' => 'int',
		// 	'required' => true
		// ],
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
		]
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

	'ticket.deleteMessage' => [
		'message_id' => [
			'type' => 'int',
			'required' => true
		]
	],

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
	'notifications.get' => [],
	'notifications.markAsViewed' => [],
	'notifications.getCount' => [],
	'notifications.approve' => [],
	'notifications.demiss' => [],

	
	'special.getAllMessages' => [
		'offset' => [
			'type' => 'intorstr',
			'required' => true
		],
		'count' => [
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
	case 'user.getById':
		$id = (int) $data['id'];
		Show::response( $users->getById( $id ) );

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
		if($userQue > 0){
			$userQue = -$userQue;
		}
		Show::response( $tickets->add( $title, $text, $userQue ) );

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

	case 'ticket.deleteMessage':
		$id = (int) $data['message_id'];
		Show::response( $tickets->deleteMessage( $id ) );

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

	case 'special.getAllMessages':
		$count = (int) $data['count'];
		$offset = (int) $data['offset'];
		if ( !$users->info['special'] ) {
			Show::error(403);
		}
		Show::response( $Connect->db_get("SELECT * FROM messages WHERE author_id>0 order by id asc LIMIT $offset, $count"));
}