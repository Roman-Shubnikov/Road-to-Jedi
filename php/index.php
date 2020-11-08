<?php

// ini_set('error_reporting', E_ALL);
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

function getBalance() {
    $user_id = $_GET['vk_user_id'];

    return db_get("SELECT money FROM users WHERE vk_user_id = $user_id")[0]['money'];
}
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

	$pretty = isset($_GET['debug']) ? JSON_PRETTY_PRINT : 0;
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
			'type' => 'int',
			'required' => true
		],
		'cond2' => [
			'type' => 'int',
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
		'banned' => [
			'type' => 'bool',
			'required' => false,
			'default' => FALSE
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
	'users.getTop' => [],
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

	'ticket.add' => [
		'title' => [
			'type' => 'string',
			'required' => true
		],

		'text' => [
			'type' => 'string',
			'required' => true
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
	'transfers.send' => [
		'send_to' => [
			'type' => 'int',
			'required' => true
		],
		'summa' => [
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
	'transfers.send' => [
		'send_to' => [
			'type' => 'int',
			'required' => true
		],
		'summa' => [
			'type' => 'int',
			'required' => true
		]
	],
	'notifications.get' => [],
	'notifications.markAsViewed' => [],
	'notifications.getCount' => [],
];
$user_id = (int) $_GET['vk_user_id'];
$method = $_GET['method'];

if ( !isset( $params[$method] ) ) {
	Show::error(405);
}
Utils::checkParams($params[$method]);

$users = new Users( $user_id );
$account = new Account( $users );
$tickets = new Tickets( $users );
$notifications = new Notifications( $users );

switch ( $method ) {
	case 'account.delete':
		Show::response( $account->deleteAccount());

	case 'account.setAge':
		$age = $_REQUEST['age'];
		if($age < 10 || $age > 100){
			Show::error(1009);
		}
		Show::response( $account->ChangeAge($age));

	case 'account.get':
		Show::response( $users->getMy() );
	
	case 'account.changeScheme':
		$scheme = $_REQUEST['scheme'];
		if(!in_array($scheme, [0,1,2])){
			Show::error(1010);
		}
		Show::response( $account->changeScheme($scheme) );
	
	case 'account.Flash':
		$agent_id = $_REQUEST['agent_id'];
		$give = (bool)$_REQUEST['give'];
		Show::response( $account->Prometay($agent_id, $give) );

	case 'account.ban':
		$agent_id = $_REQUEST['agent_id'];
		if($agent_id < 0){
			$agent_id = $users->getIdByVKId(-$agent_id);
		}
		$banned = (bool) $_REQUEST['banned'];
		$ban_reason = (string) $_REQUEST['reason'];
		Show::response( $account->Ban_User( $agent_id, $banned, $ban_reason ) );

	case 'account.getVerfStatus':
		Show::response( $account->getVerfStatus() );

	case 'account.sendRequestVerf':
		$title = (string) $_REQUEST['title'];
		$desc = (string) $_REQUEST['description'];
		// $number = (int) $_REQUEST['phone_number'];
		// $sign_number = (string) $_REQUEST['phone_sign'];
		$conditions = (bool)$_REQUEST['cond1'] && (bool)$_REQUEST['cond2'];
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
	case 'user.getById':
		$id = (int) $_GET['id'];
		Show::response( $users->getById( $id ) );

	case 'users.getByIds':
		$ids = $_GET['ids'];
		Show::response( $users->getByIds( $ids ) );

	case 'users.getTop':
		Show::response( $users->getTop() );
	
	case 'users.getRandom':
		Show::response( $users->getRandom() );

	case 'ticket.getRandom':
		Show::response( $tickets->getRandom() );

	case 'tickets.getMy':
		$offset = isset($_GET['offset']) ? (int) $_GET['offset'] : 0;
		$count = $_GET['count'] ?? CONFIG::ITEMS_PER_PAGE;

		Show::response( $tickets->getMy( $offset, $count ) );

	case 'tickets.getByModeratorAnswers':
		$offset = isset($_GET['offset']) ? (int) $_GET['offset'] : 0;
		$count = $_GET['count'] ?? CONFIG::ITEMS_PER_PAGE;
		$id = $users->id;
		Show::response( $tickets->getByModeratorAnswers( $offset, $count, $id) );

	case 'tickets.get':
		$offset = isset($_GET['offset']) ? (int) $_GET['offset'] : 0;
		$count = $_GET['count'] ?? CONFIG::ITEMS_PER_PAGE;
		$unanswered = (bool) $_GET['unanswered'] ?? false;

		Show::response( $tickets->get( $unanswered, $offset, $count ) );

	case 'ticket.getMessages':
		$id = (int) $_GET['ticket_id'];
		$offset = 0;
		$count = 1000;

		Show::response( $tickets->getMessages( $id, $offset, $count ) );

	case 'ticket.sendMessage':
		$id = isset( $_POST['ticket_id'] ) ? $_POST['ticket_id'] : $_GET['ticket_id'];
		$text = trim($_REQUEST['text']);

		Show::response( $tickets->sendMessage( $id, $text ) );

	case 'ticket.editMessage':
		$id = isset( $_POST['message_id'] ) ? $_POST['message_id'] : $_GET['message_id'];
		$text = trim($_REQUEST['text']);

		Show::response( $tickets->editMessage( $id, $text ) );

	case 'ticket.commentMessage':
		$id = isset( $_POST['message_id'] ) ? $_POST['message_id'] : $_GET['message_id'];
		$text = trim($_REQUEST['text']);

		Show::response( $tickets->commentMessage( $id, $text ) );

	case 'ticket.editComment':
		$id = isset( $_POST['message_id'] ) ? $_POST['message_id'] : $_GET['message_id'];
		$text = trim($_REQUEST['text']);

		Show::response( $tickets->editComment( $id, $text ) );

	case 'ticket.deleteComment':
		$id = isset( $_POST['message_id'] ) ? $_POST['message_id'] : $_GET['message_id'];

		Show::response( $tickets->deleteComment( $id ) );

	case 'ticket.add':
		$title = $_POST['title'];
		$text = trim($_REQUEST['text']);

		Show::response( $tickets->add( $title, $text ) );

	case 'ticket.getById':
		$id = (int) $_GET['ticket_id'];

		$offset = 0;
		$count = 1000;
		$info = $tickets->getById( $id );
		$messages = $tickets->getMessages( $id, $offset, $count );
		if($info) {
			Show::response( 
				[
				'info' => $tickets->getById( $id ),
				'messages' => $tickets->getMessages( $id, $offset, $count )
				]
			);
		} else {
			Show::error(34);
		}

	case 'ticket.approveReply':
		$id = (int) $_GET['message_id'];

		Show::response( $tickets->approve( $id ) );

	case 'ticket.close':
		$id = (int) $_GET['ticket_id'];

		Show::response( $tickets->close( $id ) );

	case 'ticket.open':
		$id = (int) $_GET['ticket_id'];

		Show::response( $tickets->open( $id ) );

	case 'tickets.getByModerator':
		$mid = (int) $_GET['moderator_id'];
		$mark = isset( $_GET['mark'] ) ? $_GET['mark'] : -1;
		$offset = (int) $_GET['offset'] ?? 0;
		$count = $_GET['count'] ?? CONFIG::ITEMS_PER_PAGE;

		Show::response( $tickets->getByModerator( $mid, $mark, $offset, $count ) );

	case 'ticket.markMessage':
		$id = (int) $_REQUEST['message_id'];
		$mark = (int) $_REQUEST['mark'];

		Show::response( $tickets->markMessage( $id, $mark ) );

	case 'ticket.deleteMessage':
		$id = (int) $_GET['message_id'];
		Show::response( $tickets->deleteMessage( $id ) );

	case 'notifications.get':
		Show::response( $notifications->get() );

	case 'notifications.markAsViewed':
		Show::response( $notifications->markAsViewed() );

	case 'notifications.getCount':
		Show::response( $notifications->getCount() );
	case 'shop.changeId':
		$id = $_REQUEST['change_id'];
		$user_id = $_GET['vk_user_id'];
		$len = mb_strlen($id);
		if( $len < 11 && $len > 0 ) {
			$balance_profile = getBalance();
			if( $balance_profile >= 200 ) {
				$check_id = db_get("SELECT id FROM users WHERE id = $id OR nickname = $id");
				if( count($check_id) == 0 ) {
					db_edit(['money' => $balance_profile - 200], "vk_user_id=$user_id", 'users');
					db_edit(['nickname' => $id], "vk_user_id=$user_id", 'users');
					Show::response(
						['balance' => $balance_profile - 200]
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
		break;

	case 'transfers.send':
		$summa = $_REQUEST['summa'];
		$send_to = $_REQUEST['send_to'];
		$balance_profile = getBalance();
		$id = $_GET['vk_user_id'];
		if( $summa > 0 && $summa !== 0 ) {
			if( $balance_profile >= $summa ) {
				$balanceTo = db_get("SELECT * FROM users WHERE id = $send_to OR nickname = $send_to")[0];
				if( $balanceTo ) {
					$idTo = $balanceTo['id'];
					$avatarTo = $balanceTo['avatar_id'];
					$userInfo = db_get("SELECT * FROM users WHERE vk_user_id = $id")[0];
					$idWhoSend = $userInfo['id'];
					$avatarIdWhoSend = $userInfo['avatar_id'];
					$avatar = CONFIG::AVATAR_PATH.'/'.db_get("SELECT * FROM avatars WHERE id = $avatarIdWhoSend")[0]['name'];
					$avatarTo = CONFIG::AVATAR_PATH.'/'.db_get("SELECT * FROM avatars WHERE id = $avatarTo")[0]['name'];
					if( $balanceTo['vk_user_id'] !== $id ) {
						$help = db_edit([
							'money' => $balanceTo['money'] + $summa
						], "id=$idTo", 'users');
						SystemNotifications::send($idTo, "Вам поступил перевод в размере $summa монеток от агента номер $idWhoSend", $avatar, [
							'type' => 'money_transfer_give',
							'object' => 0
						]);
						SystemNotifications::send($idWhoSend, "Вы успешно перевели $summa монеток агенту номер $idTo", $avatarTo, [
							'type' => 'money_transfer_send',
							'object' => 0
						]);
						db_edit([
							'money' => $balance_profile - $summa
						], "vk_user_id=$id", 'users');
						Show::response(['money' => $balance_profile - $summa, 'help' => $help, 'avatar' => $avatarTo]);
					} else {
						Show::error(1007);
					}
				} else {
					Show::error(1005);
				}
			} else {
				Show::error(1002);
			}
		} else {
			Show::error(1006);
		}
	break;

	case 'shop.changeAvatar':
		$id = $_REQUEST['avatar_id'];
		if( $id <= 17 && $id > 0 ) {
			$balance = getBalance();
			$user_id = $_GET['vk_user_id'];
			if( $balance >= 300 ) {
				$edit = db_edit([
					'money' => $balance - 300,
					'avatar_id' => $id
				], "vk_user_id=$user_id", 'users');
				Show::response(['edit' => $edit]);
			} else {
				Show::error(1002);
			}
		} else {
			Show::error(1008);
		}
	break;
	
}