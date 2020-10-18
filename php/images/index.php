<?php


header( 'Access-Control-Allow-Origin: *' );

ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

require 'api/config.php';
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


$method = $_GET['method'];

$params = [
	'account.get' => [],
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
		$offset = (int) $_GET['offset'] ?? 0;
		$count = $_GET['count'] ?? ITEMS_PER_PAGE;

		ok( $tickets->getMy( $offset, $count ) );

	case 'tickets.get':
		$offset = (int) isset($_GET['offset']) ?? 0;
		$count = $_GET['count'] ?? ITEMS_PER_PAGE;
		$unanswered = (bool) $_GET['unanswered'] ?? false;

		ok( $tickets->get( $unanswered, $offset, $count ) );

	case 'ticket.getMessages':
		$id = (int) $_GET['ticket_id'];
		$offset = (int) isset($_GET['offset']) ?? 0;
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

		ok( $tickets->getById( $id ) );

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
}