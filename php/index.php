<?php

// ini_set('error_reporting', E_ALL);
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// mysqli_report(MYSQLI_REPORT_ALL); 


header( 'Access-Control-Allow-Origin: *' );

require 'api/api/config.php';
require 'api/db.php';
require 'api/func.php';
require 'vkapi.php';

set_exception_handler( 'error' );

require 'api/api/users.php';
require 'api/api/tickets.php';
require 'api/api/notifications.php';

$check = check_sign();
if ( !$check ) {
	throw new Exception( ERRORS[4], 4 );
}

session_id( $_GET['vk_user_id'] );
session_start();

$control = flood_control();
if ( !$control ) {
	throw new Exception( ERRORS[3], 3 );
}
function getBalance() {
    $user_id = $_GET['vk_user_id'];

    return db_get("SELECT money FROM users WHERE vk_user_id = $user_id")[0]['money'];
}

$method = $_GET['method'];

$params = [
	'account.get' => [],
	'account.setAge' => [
		'age' => [
			'type' => 'int',
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
	'notifications.get' => [],
	'notifications.markAsViewed' => [],
	'notifications.getCount' => [],
];

if ( !isset( $params[$method] ) ) {
	throw new Exception( ERRORS[3456782], 3456782 );
}

check_params( $params[$method] );


$users = new Users( $_GET['vk_user_id'] );
$tickets = new Tickets( $users );
$notifications = new Notifications( $users );

switch ( $method ) {
	case 'account.setAge':
		$age = $_REQUEST['age'];
		ok( $users->ChangeAge($age));
	case 'account.get':
		ok( $users->getMy() );
	
	case 'user.getById':
		$id = (int) $_GET['id'];
		ok( $users->getById( $id ) );

	case 'users.getByIds':
		$ids = $_GET['ids'];
		ok( $users->getByIds( $ids ) );

	case 'users.getTop':
		ok( $users->getTop() );

	case 'ticket.getRandom':
		ok( $tickets->getRandom() );

	case 'tickets.getMy':
		$offset = isset($_GET['offset']) ? (int) $_GET['offset'] : 0;
		$count = $_GET['count'] ?? ITEMS_PER_PAGE;

		ok( $tickets->getMy( $offset, $count ) );

	case 'tickets.getByModeratorAnswers':
		$offset = isset($_GET['offset']) ? (int) $_GET['offset'] : 0;
		$count = $_GET['count'] ?? ITEMS_PER_PAGE;
		$id = $users->id;
		ok( $tickets->getByModeratorAnswers( $offset, $count, $id) );

	case 'tickets.get':
		$offset = isset($_GET['offset']) ? (int) $_GET['offset'] : 0;
		$count = $_GET['count'] ?? ITEMS_PER_PAGE;
		$unanswered = (bool) $_GET['unanswered'] ?? false;

		ok( $tickets->get( $unanswered, $offset, $count ) );

	case 'ticket.getMessages':
		$id = (int) $_GET['ticket_id'];
		$offset = isset($_GET['offset']) ? (int) $_GET['offset'] : 0;
		$count = $_GET['count'] ?? ITEMS_PER_PAGE;

		ok( $tickets->getMessages( $id, $offset, $count ) );

	case 'ticket.sendMessage':
		$id = isset( $_POST['ticket_id'] ) ? $_POST['ticket_id'] : $_GET['ticket_id'];
		$text = isset( $_POST['text'] ) ? $_POST['text'] : $_GET['text'];

		ok( $tickets->sendMessage( $id, $text ) );

	case 'ticket.editMessage':
		$id = isset( $_POST['message_id'] ) ? $_POST['message_id'] : $_GET['message_id'];
		$text = isset( $_POST['text'] ) ? $_POST['text'] : $_GET['text'];

		ok( $tickets->editMessage( $id, $text ) );

	case 'ticket.commentMessage':
		$id = isset( $_POST['message_id'] ) ? $_POST['message_id'] : $_GET['message_id'];
		$text = isset( $_POST['text'] ) ? $_POST['text'] : $_GET['text'];

		ok( $tickets->commentMessage( $id, $text ) );

	case 'ticket.editComment':
		$id = isset( $_POST['message_id'] ) ? $_POST['message_id'] : $_GET['message_id'];
		$text = isset( $_POST['text'] ) ? $_POST['text'] : $_GET['text'];

		ok( $tickets->editComment( $id, $text ) );

	case 'ticket.deleteComment':
		$id = isset( $_POST['message_id'] ) ? $_POST['message_id'] : $_GET['message_id'];

		ok( $tickets->deleteComment( $id ) );

	case 'ticket.add':
		$title = $_POST['title'];
		$text = $_POST['text'];

		ok( $tickets->add( $title, $text ) );

	case 'ticket.getById':
		$id = (int) $_GET['ticket_id'];

		$offset = 0;
		$count = 1000;
		$info = $tickets->getById( $id );
		$messages = $tickets->getMessages( $id, $offset, $count );
		if($info) {
			ok( 
				[
				'info' => $tickets->getById( $id ),
				'messages' => $tickets->getMessages( $id, $offset, $count )
				]
			);
		} else {
			throw new Exception( ERRORS[34], 34 );
		}

	case 'ticket.approveReply':
		$id = (int) $_GET['message_id'];

		ok( $tickets->approve( $id ) );

	case 'ticket.close':
		$id = (int) $_GET['ticket_id'];

		ok( $tickets->close( $id ) );

	case 'ticket.open':
		$id = (int) $_GET['ticket_id'];

		ok( $tickets->open( $id ) );

	case 'tickets.getByModerator':
		$mid = (int) $_GET['moderator_id'];
		$mark = isset( $_GET['mark'] ) ? $_GET['mark'] : -1;
		$offset = (int) $_GET['offset'] ?? 0;
		$count = $_GET['count'] ?? ITEMS_PER_PAGE;

		ok( $tickets->getByModerator( $mid, $mark, $offset, $count ) );

	case 'ticket.markMessage':
		$id = (int) $_GET['message_id'];
		$mark = (int) $_GET['mark'];

		ok( $tickets->markMessage( $id, $mark ) );

	case 'ticket.deleteMessage':
		$id = (int) $_GET['message_id'];
		ok( $tickets->deleteMessage( $id ) );

	case 'notifications.get':
		ok( $notifications->get() );

	case 'notifications.markAsViewed':
		ok( $notifications->markAsViewed() );

	case 'notifications.getCount':
		ok( $notifications->getCount() );
	case 'shop.changeId':
		$id = $_REQUEST['change_id'];
		$user_id = $_GET['vk_user_id'];

		$id = intval( $id );

		if( $id < 100000 && $id > 15000 ) {
			$balance_profile = getBalance();
			if( $balance_profile >= 200 ) {
				$check_id = db_get("SELECT id FROM users WHERE id = $id OR nickname = $id");
				if( count($check_id) == 0 ) {
					db_edit(['money' => $balance_profile - 200], "vk_user_id=$user_id", 'users');
					db_edit(['nickname' => $id], "vk_user_id=$user_id", 'users');
					ok(
						['balance' => $balance_profile - 200]
					);
				} else {
					throw new Exception( ERRORS[1003], 1003 );
				}
			} else {
				throw new Exception( ERRORS[1002], 1002 );
			}
		} else {
			throw new Exception( ERRORS[1004], 1004 );
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
					$avatar = AVATAR_PATH.'/'.db_get("SELECT * FROM avatars WHERE id = $avatarIdWhoSend")[0]['name'];
					$avatarTo = AVATAR_PATH.'/'.db_get("SELECT * FROM avatars WHERE id = $avatarTo")[0]['name'];
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
						ok(['money' => $balance_profile - $summa, 'help' => $help, 'avatar' => $avatarTo]);
					} else {
						throw new Exception( ERRORS[1007], 1007 );
					}
				} else {
					throw new Exception( ERRORS[1005], 1005 );
				}
			} else {
				throw new Exception( ERRORS[1002], 1002 );
			}
		} else {
			throw new Exception( ERRORS[1006], 1006 );
		}
	break;

	case 'shop.changeAvatar':
		$id = $_REQUEST['avatar_id'];
		if( $id <= 27 || $id > 1 ) {
			$balance = getBalance();
			$user_id = $_GET['vk_user_id'];
			if( $balance >= 300 ) {
				$edit = db_edit([
					'money' => $balance - 300,
					'avatar_id' => $id
				], "vk_user_id=$user_id", 'users');
				ok(['edit' => $edit]);
			} else {
				throw new Exception( ERRORS[1002], 1002 );
			}
		} else {
			throw new Exception( ERRORS[1008], 1008 );
		}
	break;
	
}