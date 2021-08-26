<?php

// error_reporting(E_ALL);
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

// set_exception_handler('exceptionerror');

require 'api/api/users.php';
require 'api/api/account.php';
require 'api/api/tickets.php';
require 'api/api/notifications.php';
require 'api/api/promocodes.php';
require 'api/api/reports.php';
require 'api/api/folowers.php';
require 'api/api/recommendations.php';
require 'api/api/settings.php';
require 'api/api/levels.php';
require 'api/api/shop.php';
require 'api/api/faq.php';
require 'api/api/testsInspector.php';

session_id($_GET['vk_user_id']);
session_start();


function exceptionerror($ex)
{
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
function offset_count(int &$offset, int &$count)
{
	if ($offset < 0) $offset = 0;
	if ($count < 0) $count = CONFIG::ITEMS_PER_PAGE;

	if ($count > CONFIG::MAX_ITEMS_COUNT) $count = CONFIG::MAX_ITEMS_COUNT;
}

new AccessCheck();
new FludControl();

$params = [
	'settings.get' => [
		'parameters' => [
			'setting' => [
				'type' => 'string',
				'required' => true
			]
		],
		'perms' => CONFIG::PERMISSIONS['user']
	],
	'settings.set' => [
		'parameters' => [
			'setting' => [
				'type' => 'string',
				'required' => true
			],
			'value' => [
				'type' => 'int',
				'required' => true
			]
		],
		'perms' => CONFIG::PERMISSIONS['user']
	],

	'account.get' => [
		'parameters' => [],
		'perms' => CONFIG::PERMISSIONS['user']
	],
	// 'account.delete' => [],
	'account.setAge' => [
		'parameters' => [
			'age' => [
				'type' => 'int',
				'required' => true
			]
		]
	],
	'account.getVerfStatus' => [
		'parameters' => [],
	],
	'account.sendRequestVerf' => [
		'parameters' => [
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
		]
	],
	'account.changeScheme' => [
		'parameters' => [
			'scheme' => [
				'type' => 'int',
				'required' => true
			]
		],
		'perms' => CONFIG::PERMISSIONS['user']
	],
	'account.ban' => [
		'parameters' => [
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
		'perms' => CONFIG::PERMISSIONS['special']
	],
	'account.public' => [
		'parameters' => [
			'public' => [
				'type' => 'bool',
				'required' => true
			]
		]

	],
	'account.changeStatus' => [
		'parameters' => [
			'status' => [
				'type' => 'string',
				'required' => true
			]
		]
	],
	'user.getById' => [
		'parameters' => [
			'id' => [
				'type' => 'int',
				'required' => true
			]
		]
	],

	'users.getByIds' => [
		'parameters' => [
			'ids' => [
				'type' => 'string',
				'required' => true
			]
		]
	],
	'users.getRandom' => [
		'parameters' => []
	],
	'users.getTop' => [
		'parameters' => [
			'staff' => [
				'type' => 'bool',
				'required' => false
			],
			'type' => [
				'type' => 'string',
				'required' => false,
				'default' => 'all',
			],
		]
	],

	'ticket.getRandom' => [
		'parameters' => []
	],

	'tickets.getMy' => [
		'parameters' => [
			'offset' => [
				'type' => 'int',
				'required' => false
			],

			'count' => [
				'type' => 'int',
				'required' => false
			]
		],
		'perms' => CONFIG::PERMISSIONS['user']
	],
	'tickets.getMyModeration' => [
		'parameters' => [],
		'perms' => CONFIG::PERMISSIONS['user']
	],

	'tickets.get' => [
		'parameters' => [
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
		'perms' => CONFIG::PERMISSIONS['agent']
	],
	'tickets.getByModeratorAnswers' => [
		'parameters' => [
			'offset' => [
				'type' => 'int',
				'required' => false
			],

			'count' => [
				'type' => 'int',
				'required' => false
			],
		]
	],
	'ticket.rate' => [
		'parameters' => [
			'ticket_id' => [
				'type' => 'int',
				'required' => true
			],

			'rate' => [
				'type' => 'int',
				'required' => true
			]
		],
		'perms' => CONFIG::PERMISSIONS['user']
	],
	'ticket.markMessage' => [
		'parameters' => [
			'message_id' => [
				'type' => 'int',
				'required' => true
			],

			'mark' => [
				'type' => 'int',
				'required' => true
			]
		],
		'perms' => CONFIG::PERMISSIONS['special']
	],
	'ticket.unmarkMessage' => [
		'parameters' => [
			'message_id' => [
				'type' => 'int',
				'required' => true
			],
		],
		'perms' => CONFIG::PERMISSIONS['special'],
	],

	// 'ticket.add' => [
	// 	'parameters' => [
	// 		'title' => [
	// 			'type' => 'string',
	// 			'required' => true
	// 		],

	// 		'text' => [
	// 			'type' => 'string',
	// 			'required' => true
	// 		],
	// 		'user' => [
	// 			'type' => 'int',
	// 			'required' => true,
	// 		],
	// 		'donut_only' => [
	// 			'type' => 'bool',
	// 			'required' => true,
	// 		],
	// 	],
	// 	'perms' => CONFIG::PERMISSIONS['special'],
	// ],

	'ticket.sendMessage' => [
		'parameters' => [
			'ticket_id' => [
				'type' => 'int',
				'required' => true
			],

			'text' => [
				'type' => 'string',
				'required' => true
			]
		],
		'perms' => CONFIG::PERMISSIONS['user']
	],

	'ticket.editMessage' => [
		'parameters' => [
			'message_id' => [
				'type' => 'int',
				'required' => true
			],

			'text' => [
				'type' => 'string',
				'required' => true
			]
		],
		'perms' => CONFIG::PERMISSIONS['user']
	],

	'ticket.commentMessage' => [
		'parameters' => [
			'message_id' => [
				'type' => 'int',
				'required' => true
			],

			'text' => [
				'type' => 'string',
				'required' => true
			]
		],
		'perms' => CONFIG::PERMISSIONS['special'],
	],

	'ticket.editComment' => [
		'parameters' => [
			'message_id' => [
				'type' => 'int',
				'required' => true
			],

			'text' => [
				'type' => 'string',
				'required' => true
			]
		],
		'perms' => CONFIG::PERMISSIONS['special'],
	],

	'ticket.deleteComment' => [
		'parameters' => [
			'message_id' => [
				'type' => 'int',
				'required' => true
			]
		],
		'perms' => CONFIG::PERMISSIONS['special'],
	],

	'ticket.getMessages' => [
		'parameters' => [
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
		'perms' => CONFIG::PERMISSIONS['user']
	],

	'ticket.getById' => [
		'parameters' => [
			'ticket_id' => [
				'type' => 'int',
				'required' => true
			]
		],
		'perms' => CONFIG::PERMISSIONS['user']
	],

	'ticket.approveReply' => [
		'parameters' => [
			'message_id' => [
				'type' => 'int',
				'required' => true
			],
		],
		'perms' => CONFIG::PERMISSIONS['special'],
		
	],

	'tickets.getByModerator' => [
		'parameters' => [
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
		]
	],

	'ticket.deleteMessage' => [
		'parameters' => [
			'message_id' => [
				'type' => 'int',
				'required' => true
			]
		],
		'perms' => CONFIG::PERMISSIONS['user']
	],

	'ticket.close' => [
		'parameters' => [
			'ticket_id' => [
				'type' => 'int',
				'required' => true
			]
		],
		'perms' => CONFIG::PERMISSIONS['special'],
	],

	'ticket.open' => [
		'parameters' => [
			'ticket_id' => [
				'type' => 'int',
				'required' => true
			]
		],
		'perms' => CONFIG::PERMISSIONS['special'],
	],
	'shop.changeAvatar' => [
		'parameters' => [
			'avatar_id' => [
				'type' => 'int',
				'required' => true
			]
		]
	],
	'shop.changeDonutAvatars' => [
		'parameters' => [
			'avatar_id' => [
				'type' => 'int',
				'required' => true
			]
		]
	],
	'shop.changeId' => [
		'parameters' => [
			'change_id' => [
				'type' => 'string',
				'required' => true
			]
		]
	],
	'shop.buyGhosts' => [
		'parameters' => [
			'count' => [
				'type' => 'int',
				'required' => true
			]
		]
	],
	'shop.resetId' => [
		'parameters' => []
	],
	'shop.buyDiamond' => [
		'parameters' => []
	],
	'shop.buyRecommendations' => [
		'parameters' => []
	],
	'shop.checkPromo' => [
		'parameters' => [
			'promocode' => [
				'type' => 'string',
				'required' => true
			],
		]
	],
	'shop.activatePromo' => [
		'parameters' => [
			'promocode' => [
				'type' => 'string',
				'required' => true
			],
		]
	],
	'shop.getProducts' => [
		'parameters' => [],
	],
	'transfers.send' => [
		'parameters' => [
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
		]
	],
	'followers.subscribe' => [
		'parameters' => [
			'agent_id' => [
				'type' => 'int',
				'required' => true
			]
		]
	],
	'followers.unsubscribe' => [
		'parameters' => [
			'agent_id' => [
				'type' => 'int',
				'required' => true
			]
		]
	],
	'followers.getFollowers' => [
		'parameters' => [
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
		]
	],
	'notifications.get' => [
		'parameters' => []
	],
	'notifications.markAsViewed' => [
		'parameters' => []
	],
	'notifications.getCount' => [
		'parameters' => []
	],
	'notifications.approve' => [
		'parameters' => []
	],
	'notifications.demiss' => [
		'parameters' => []
	],


	'special.getAllMessages' => [
		'parameters' => [
			'offset' => [
				'type' => 'int',
				'required' => true
			],
			'count' => [
				'type' => 'int',
				'required' => true
			],
		],
		'perms' => CONFIG::PERMISSIONS['special'],
	],
	'special.getNewMessages' => [
		'parameters' => [
			'offset' => [
				'type' => 'int',
				'required' => true
			],
			'count' => [
				'type' => 'int',
				'required' => true
			],
		],
		'perms' => CONFIG::PERMISSIONS['special'],
	],
	'special.getNewModerationTickets' => [
		'parameters' => [
			'offset' => [
				'type' => 'int',
				'required' => true
			],
			'count' => [
				'type' => 'int',
				'required' => true
			],
		],
		'perms' => CONFIG::PERMISSIONS['special'],
	],
	'ticket.addNewModerationTicket' => [
		'parameters' => [
			'title' => [
				'type' => 'string',
				'required' => true
			],
			'text' => [
				'type' => 'string',
				'required' => true
			],
		],
		'perms' => CONFIG::PERMISSIONS['user']
	],
	'special.delModerationTicket' => [
		'parameters' => [
			'id_ans' => [
				'type' => 'int',
				'required' => true
			],
		],
		'perms' => CONFIG::PERMISSIONS['special'],
	],
	'special.approveModerationTicket' => [
		'parameters' => [
			'id_ans' => [
				'type' => 'int',
				'required' => true
			],
		],
		'perms' => CONFIG::PERMISSIONS['special'],
	],
	'admin.getVerificationRequests' => [
		'parameters' => [
			'offset' => [
				'type' => 'int',
				'required' => true
			],
			'count' => [
				'type' => 'int',
				'required' => true
			],
		],
		'perms' => CONFIG::PERMISSIONS['admin'],
	],
	'admin.denyVerificationRequest' => [
		'parameters' => [
			'id_request' => [
				'type' => 'int',
				'required' => true
			],
		],
		'perms' => CONFIG::PERMISSIONS['admin'],
	],
	'admin.approveVerificationRequest' => [
		'parameters' => [
			'id_request' => [
				'type' => 'int',
				'required' => true
			],
		],
		'perms' => CONFIG::PERMISSIONS['admin'],
	],
	'reports.send' => [
		'parameters' => [
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
		]
	],
	'reports.getReports' => [
		'parameters' => [
			'offset' => [
				'type' => 'int',
				'required' => true
			],
			'count' => [
				'type' => 'int',
				'required' => true
			],
		],
		'perms' => CONFIG::PERMISSIONS['admin'],
	],
	'reports.denyReport' => [
		'parameters' => [
			'id_request' => [
				'type' => 'int',
				'required' => true
			],
		],
		'perms' => CONFIG::PERMISSIONS['admin'],
	],
	'reports.approveReport' => [
		'parameters' => [
			'id_request' => [
				'type' => 'int',
				'required' => true
			],
		],
		'perms' => CONFIG::PERMISSIONS['admin'],
	],
	'recommendations.get' => [
		'parameters' => []
	],
	'faq.addCategory' => [
		'parameters' => [
			'title' => [
				'type' => 'string',
				'required' => true
			],
			'icon_id' => [
				'type' => 'int',
				'required' => true
			],
			'color' => [
				'type' => 'string',
				'required' => true
			],
		],
		'perms' => CONFIG::PERMISSIONS['admin'],
	],
	'faq.delCategory' => [
		'parameters' => [
			'category_id' => [
				'type' => 'int',
				'required' => true
			],
		],
		'perms' => CONFIG::PERMISSIONS['admin'],
	],
	'faq.addQuestion' => [
		'parameters' => [
			'category_id' => [
				'type' => 'int',
				'required' => true
			],
			'question' => [
				'type' => 'string',
				'required' => true
			],
			'answer' => [
				'type' => 'string',
				'required' => true
			],
			'ismarkable' => [
				'type' => 'bool',
				'required' => true
			],
			'support_need' => [
				'type' => 'bool',
				'required' => true
			],
		],
		'perms' => CONFIG::PERMISSIONS['admin'],
	],
	'faq.delQuestion' => [
		'parameters' => [
			'question_id' => [
				'type' => 'int',
				'required' => true
			],
		],
		'perms' => CONFIG::PERMISSIONS['admin'],
	],
	'faq.getCategories' => [
		'parameters' => [],
		'perms' => CONFIG::PERMISSIONS['user']
	],
	'faq.getQuestionsByCategory' => [
		'parameters' => [
			'category_id' => [
				'type' => 'int',
				'required' => true
			],
			'offset' => [
				'type' => 'int',
				'required' => false,
				'default' => 0,
			],
			'count' => [
				'type' => 'int',
				'required' => false,
				'default' => 200,
			],
		],
		'perms' => CONFIG::PERMISSIONS['user']
	],
	'faq.getQuestionById' => [
		'parameters' => [
			'id' => [
				'type' => 'int',
				'required' => true
			],
		],
		'perms' => CONFIG::PERMISSIONS['user']
	],
	'faq.getQuestionByName' => [
		'parameters' => [
			'name' => [
				'type' => 'string',
				'required' => true
			],
		],
		'perms' => CONFIG::PERMISSIONS['user']
	],
	'tests.sendAnswers' => [
		'parameters' => [
			'answers' => [
				'type' => 'array',
				'required' => true
			],
		],
		'perms' => CONFIG::PERMISSIONS['user']
	],
	'tests.startTest' => [
		'parameters' => [
			'test_id' => [
				'type' => 'int',
				'required' => true
			],
		],
		'perms' => CONFIG::PERMISSIONS['user']
	],
];
$user_id = (int) $_GET['vk_user_id'];
$method = $_GET['method'];

$data = file_get_contents('php://input');
$data = json_decode($data, true);

if (!$data) {
	$data = $_POST;
}

if (!isset($params[$method])) {
	Show::error(405);
}
$data = Utils::checkParams($params[$method]['parameters'], $data);

$Connect = new DB();
$users = new Users($user_id, $Connect);
$settings = new Settings($Connect, $users);
$notifications = new Notifications($users, $Connect);
$sysnotifications = new SystemNotifications($Connect);
$account = new Account($users, $Connect, $sysnotifications);
$tickets = new Tickets($users, $Connect, $sysnotifications);
$promocodes = new Promocodes($users, $Connect, $sysnotifications);
$reports = new Reports($users, $Connect, $account);
$followers = new Followers($users, $Connect);
$recommended = new Recomendations($users, $Connect, $followers);
$levels = new Levels($users, $Connect);
$faq = new Faq($Connect,$users);
$testsInspector = new TestsInspector($users, $Connect);

$perms_need = CONFIG::PERMISSIONS['agent'];
if(isset($params[$method]['perms'])) {
	$perms_need = $params[$method]['perms'];
}
if ($users->info['permissions'] < $perms_need) {
	Show::error(403);
}

function getBalance()
{
	global $Connect, $user_id;
	return $Connect->db_get("SELECT money FROM users WHERE vk_user_id=?", [$user_id])[0]['money'];
}
if($users->info['permissions'] >= CONFIG::PERMISSIONS['special']) {
	error_reporting(E_ALL);
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
}


switch ($method) {
		// case 'account.delete':
		// 	Show::response( $account->deleteAccount());

	case 'settings.get':
		$setting = $data['setting'];
		Show::response($settings->getOneSetting($setting));

	case 'settings.set':
		$setting = $data['setting'];
		$value = $data['value'];
		Show::response($settings->complSettings($setting, $value));

	case 'account.setAge':
		$age = $data['age'];
		if ($age < 10 || $age > 100) {
			Show::error(1009);
		}
		Show::response($account->ChangeAge($age));

	case 'account.get':
		$res = $users->getMy();
		$followsUser = $followers->getFollowers($users->id, 20, 0);
		$res['followers'] = $followsUser;
		$res['is_recommended'] = $recommended->is_recommended($users->id);
		if ($users->donut) {
			$res['donut_chat_link'] = CONFIG::DONUT_CHAT_LINK;
		}
		$res['settings'] = [
			'public' => $settings->getOneSetting('public'),
			'notify' => $settings->getOneSetting('notify'),
			'hide_donut' => $settings->getOneSetting('hide_donut'),
			'change_color_donut' => $settings->getOneSetting('change_color_donut'),

		];
		$res['levels']['exp_to_lvl'] = $levels->getLevelInfo($res['levels']['lvl'])['exp_to_lvl'];
		$res['levels']['exp'] = $res['levels']['exp'] - $levels->getLevelInfo($res['levels']['lvl'])['exp_total'];
		if ($users->info['generator']) {
			$res['settings']['generator_noty'] = $settings->getOneSetting('generator_noty');
		}
		Show::response($res);

	case 'account.changeScheme':
		$scheme = $data['scheme'];
		if (!in_array($scheme, [0, 1, 2])) {
			Show::error(1010);
		}
		Show::response($account->changeScheme($scheme));

	case 'account.ban':
		$agent_id = $data['agent_id'];
		if ($agent_id < 0) {
			$agent_id = $users->getIdByVKId(-$agent_id);
		}
		$ban_reason = (string) $data['reason'];
		$timeban = (int) $data['timeban'];
		Show::response($account->Ban_User($agent_id, $ban_reason, $timeban));

	case 'account.getVerfStatus':
		Show::response($account->getVerfStatus());

	case 'account.sendRequestVerf':
		$title = trim((string) $data['title']);
		$desc = trim((string) $data['description']);
		// $number = (int) $data['phone_number'];
		// $sign_number = (string) $data['phone_sign'];
		if (preg_match(CONFIG::REGEXP_VALID_TEXT, $title) && preg_match(CONFIG::REGEXP_VALID_TEXT, $desc)) {
			$conditions = (bool)$data['cond1'];
			if (mb_strlen($title) > 5 && mb_strlen($desc) > 10 && mb_strlen($title) <= 2000 && mb_strlen($desc) <= 2000) {
				if ($conditions) {
					// $sign_num_construct = CONFIG::APP_ID . CONFIG::SECRET_KEY . $user_id . 'phone_number' . $number;
					// $shasignature = rtrim(strtr(base64_encode(hash('sha256', $sign_num_construct, true)), '+/', '-_'), '=');
					// if($sign_number === $shasignature){
					Show::response($account->NewRequestVerf($title, $desc));
					// }else{
					// 	Show::error(1102);
					// }
				} else {
					Show::error(1101);
				}
			} else {
				Show::error(1100);
			}
		} else {
			Show::error(1105);
		}
	case 'account.public':
		$isPublic = (bool)$data['public'];
		Show::response($account->publicProfile($users->id, $isPublic));

	case 'account.changeStatus':
		$status = trim((string)$data['status']);
		Show::response($account->setPublicStatus($users->id, $status));


	case 'user.getById':
		$id = (int) $data['id'];
		$res = $users->getById($id);
		$followsUser = $followers->getFollowers($id, 3, 0);
		$isFollower = $followers->checkSubscribe($users->id, $id);
		$res['followers'] = $followsUser;
		$res['subscribe'] = (bool) $isFollower;

		Show::response($res);

	case 'users.getByIds':
		$ids = $data['ids'];
		Show::response($users->getByIds($ids));

	case 'users.getTop':
		$staff = ($data['staff'] != null) ? (int) $data['staff'] : false;
		$type = $data['type'];
		if(!in_array($type, CONFIG::TYPES_TOP_GET)) Show::error(1550);
		if ($staff) {
			if (!($users->info['permissions'] >= CONFIG::PERMISSIONS['special'])) {
				$staff = false;
			}
		}
		Show::response($users->getTop($type, $staff));

	case 'users.getRandom':
		Show::response($users->getRandom());

	case 'ticket.getRandom':
		$res = $tickets->getRandom();
		if ($res) {
			Show::response($res);
		}
		Show::error(36);

	case 'tickets.getMy':
		$offset = isset($data['offset']) ? (int) $data['offset'] : 0;
		$count = $data['count'] ?? CONFIG::ITEMS_PER_PAGE;
		if ($count > CONFIG::ITEMS_PER_PAGE) $count = CONFIG::ITEMS_PER_PAGE;

		Show::response($tickets->getMy($offset, $count));
	
	case 'tickets.getMyModeration':
		Show::response($tickets->getMyModeration());

	case 'tickets.getByModeratorAnswers':
		$offset = isset($data['offset']) ? (int) $data['offset'] : 0;
		$count = $data['count'] ?? CONFIG::ITEMS_PER_PAGE;
		if ($count > CONFIG::ITEMS_PER_PAGE) $count = CONFIG::ITEMS_PER_PAGE;
		$id = $users->id;
		Show::response($tickets->getByModeratorAnswers($offset, $count, $id));

	case 'tickets.get':
		$offset = isset($data['offset']) ? (int) $data['offset'] : 0;
		$count = $data['count'] ?? CONFIG::ITEMS_PER_PAGE;
		if ($count > CONFIG::ITEMS_PER_PAGE) $count = CONFIG::ITEMS_PER_PAGE;
		$unanswered = (bool) $data['unanswered'] ?? false;

		Show::response($tickets->get($unanswered, $offset, $count));

	case 'ticket.getMessages':
		$id = (int) $data['ticket_id'];
		$offset = 0;
		$count = 1000;

		Show::response(['messages' => $tickets->getMessages($id, $offset, $count), 'limitReach' => $tickets->isLimitReach($id)]);

	case 'ticket.sendMessage':
		$id = isset($data['ticket_id']) ? $data['ticket_id'] : $data['ticket_id'];
		$text = trim($data['text']);
		if ($tickets->isLimitReach($id)) {
			Show::error(35);
		}

		Show::response($tickets->sendMessage($id, $text));

	case 'ticket.editMessage':
		$id = $data['message_id'];
		$text = trim($data['text']);

		Show::response($tickets->editMessage($id, $text));

	case 'ticket.commentMessage':
		$id = $data['message_id'];
		$text = trim($data['text']);

		Show::response($tickets->commentMessage($id, $text));

	case 'ticket.editComment':
		$id = $data['message_id'];
		$text = trim($data['text']);

		Show::response($tickets->editComment($id, $text));

	case 'ticket.deleteComment':
		$id = $data['message_id'];

		Show::response($tickets->deleteComment($id));

	// case 'ticket.add':
	// 	$title = $data['title'];
	// 	$text = trim($data['text']);
	// 	$userQue = (int) $data['user'];
	// 	$donut = (bool) $data['donut_only'];
	// 	$real_author = isset($data['real_author']) ? (int) $data['real_author'] : $users->vk_id;
	// 	if ($userQue > 0) {
	// 		$userQue = -$userQue;
	// 	}
	// 	Show::response($tickets->add($title, $text, $userQue, $donut, $real_author));

	case 'ticket.getById':
		$id = (int) $data['ticket_id'];

		$offset = 0;
		$count = 1000;
		$messages = $tickets->getMessages($id, $offset, $count);
		$info = $tickets->getById($id);

		if ($info) {
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

		Show::response($tickets->approve($id));

	case 'ticket.rate':
		$id = (int) $data['ticket_id'];
		$rate = (int) $data['rate'];

		Show::response($tickets->rate($id, $rate));

	case 'ticket.close':
		$id = (int) $data['ticket_id'];

		Show::response($tickets->close($id));

	case 'ticket.open':
		$id = (int) $data['ticket_id'];

		Show::response($tickets->open($id));

	case 'tickets.getByModerator':
		$mid = (int) $data['moderator_id'];
		$mark = isset($data['mark']) ? $data['mark'] : -1;
		$offset = (int) $data['offset'] ?? 0;
		$count = $data['count'] ?? CONFIG::ITEMS_PER_PAGE;
		if ($count > CONFIG::ITEMS_PER_PAGE) $count = CONFIG::ITEMS_PER_PAGE;

		Show::response($tickets->getByModerator($mid, $mark, $offset, $count));

	case 'ticket.markMessage':
		$id = (int) $data['message_id'];
		$mark = (int) $data['mark'];

		Show::response($tickets->markMessage($id, $mark));

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
		$res = $Connect->db_get($sql, [$id])[0];
		if ($res['author_id'] < 0) {
			Show::error(33);
		}
		if ($res['mark'] == -1) {
			Show::error(39);
		}
		$mark = $res['mark'];
		$auid = $res['author_id'];
		$good_or_bad = $mark == 1 ? 'good_answers' : 'bad_answers';
		$money = $mark == 1 ? 'money=money-10' : 'money=money';
		$sql = "UPDATE users SET $good_or_bad = $good_or_bad - 1, $money WHERE id=?";
		$Connect->query($sql, [$auid]);

		Show::response($Connect->query("UPDATE messages SET mark=-1, approve_author_id=null WHERE id=?", [$id]));

	case 'ticket.deleteMessage':
		$id = (int) $data['message_id'];
		Show::response($tickets->deleteMessage($id));

	case 'notifications.get':
		Show::response($notifications->get());

	case 'notifications.markAsViewed':
		Show::response($notifications->markAsViewed());

	case 'notifications.getCount':
		Show::response($notifications->getCount());

	case 'notifications.approve':
		Show::response($notifications->approve());

	case 'notifications.demiss':
		Show::response($notifications->demiss());

	case 'shop.changeId':
		$shop = new Shop($users, $Connect, $levels);
		$nick = trim($data['change_id']);
		Show::response(['balance' => $shop->changeNickname($nick)]);
		break;
	case 'shop.buyGhosts':
		$shop = new Shop($users, $Connect, $levels);
		$count = (int) $data['count'];
		Show::response($shop->buyGhosts($count));
		break;
	case 'shop.resetId':
		$Connect->query("UPDATE users SET nickname=? WHERE vk_user_id=?", [null, $user_id]);
		Show::response();

	case 'shop.changeAvatar':
		$id = $data['avatar_id'];
		$balance = $users->info['money'];

		if ($id > CONFIG::AVATARS_COUNT || $id <= 0) Show::error(1008);
		if ($balance < CONFIG::AVATAR_PRICE) Show::error(1002);
		if ($users->info['avatar_name'] == $id) Show::error(1018);

		$edit = $Connect->query("UPDATE users SET money=?,avatar_id=? WHERE vk_user_id=?", [$balance - CONFIG::AVATAR_PRICE, $id, $user_id]);
		Show::response(['edit' => $edit]);

	case 'shop.changeDonutAvatars':
		$id = (int)$data['avatar_id'];
		$balance = $users->info['donuts'];
		if (!$users->donut) Show::error(1017);
		if ($id > CONFIG::DONUT_AVATARS_COUNT || $id <= 0) Show::error(1008);
		if ($balance < CONFIG::DONUT_AVATAR_PRICE) Show::error(1002);
		$id += 1000;
		if ($users->info['avatar_name'] == $id) Show::error(1018);

		$edit = $Connect->query("UPDATE users SET donuts=?,avatar_id=? WHERE vk_user_id=?", [$balance - CONFIG::DONUT_AVATAR_PRICE, $id, $user_id]);
		Show::response(['edit' => $edit]);

	case 'shop.buyRecommendations':
		$balance = $users->info['money'];
		if ($balance < CONFIG::RECOMMENDATIONS_PRICE) Show::error(1002);
		$Connect->query("UPDATE users SET money=? WHERE vk_user_id=?", [$balance - CONFIG::RECOMMENDATIONS_PRICE, $user_id]);
		Show::response($recommended->add($users->id));

	case 'shop.buyDiamond':
		$balance = $users->info['money'];

		if ($users->info['diamond']) Show::error(1014);
		if ($balance < CONFIG::DIAMOND_PRICE) Show::error(1002);

		$edit = $Connect->query("UPDATE users SET money=?,diamond=1 WHERE vk_user_id=?", [$balance - CONFIG::DIAMOND_PRICE, $user_id]);
		Show::response(['edit' => $edit]);

	case 'shop.checkPromo':
		$promo = (string)$data['promocode'];
		Show::response($promocodes->check($promo));

	case 'shop.activatePromo':
		$promo = (string)$data['promocode'];
		Show::response($promocodes->activate($promo));

	case 'shop.getProducts':
		$shop = new Shop($users, $Connect, $levels);
		Show::response($shop->getProductsVoices());

	case 'transfers.send':
		$summa = (int) $data['summa'];
		$send_to = trim($data['send_to']);
		$comment = trim($data['comment']) ? trim($data['comment']) : null;
		$balance_profile = getBalance();
		if ($comment) {
			$len = mb_strlen($comment);
			if ($len >= 100) {
				Show::error(7);
			}
		}
		if ($summa <= 0) Show::error(1006);

		if ($balance_profile < $summa) Show::error(1011);

		if (is_numeric($send_to)) {
			$balanceTo = $Connect->db_get("SELECT * FROM users WHERE id=?", [$send_to])[0];
		} else {
			$balanceTo = $Connect->db_get("SELECT * FROM users WHERE nickname=?", [$send_to])[0];
		}
		if (!$balanceTo) Show::error(1005);
		if ($balanceTo['vk_user_id'] == $user_id) Show::error(1007);

		$idTo = $balanceTo['id'];
		$avatarTo = $balanceTo['avatar_id'];
		$userInfo = $Connect->db_get("SELECT * FROM users WHERE vk_user_id=?", [$user_id])[0];
		$idWhoSend = $userInfo['id'];
		$avatarIdWhoSend = $userInfo['avatar_id'];
		$avatar = CONFIG::AVATAR_PATH . '/' . $Connect->db_get("SELECT * FROM avatars WHERE id=?", [$avatarIdWhoSend])[0]['name'];
		$avatarTo = CONFIG::AVATAR_PATH . '/' . $Connect->db_get("SELECT * FROM avatars WHERE id=?", [$avatarTo])[0]['name'];

		$help = $Connect->query("UPDATE users SET money=? WHERE id=?", [$balanceTo['money'] + $summa, $idTo]);

		$sysnotifications->send($idTo, "Вам поступил перевод в размере $summa монеток от агента #$idWhoSend", [
			'type' => 'money_transfer_give',
			'object' => 0
		], $avatar, $comment);
		$sysnotifications->send($idWhoSend, "Вы успешно перевели $summa монеток агенту #$idTo", [
			'type' => 'money_transfer_send',
			'object' => 0
		], $avatarTo);
		$Connect->query("UPDATE users SET money=? WHERE vk_user_id=?", [$balance_profile - $summa, $user_id]);
		Show::response(['money' => $balance_profile - $summa, 'help' => $help, 'avatar' => $avatarTo]);


	case 'followers.subscribe':
		$agent_id = (int)$data['agent_id'];
		Show::response($followers->subscribe($users->id, $agent_id));

	case 'followers.unsubscribe':
		$agent_id = (int)$data['agent_id'];
		Show::response($followers->unsubscribe($users->id, $agent_id));

	case 'followers.getFollowers':
		$count = (int) $data['count'];
		if ($count > CONFIG::ITEMS_PER_PAGE) $count = CONFIG::ITEMS_PER_PAGE;
		$offset = (int) $data['offset'];
		$agent_id = $data['agent_id'] ? (int) $data['agent_id'] : $users->id;
		if ($count > 200) $count = 200;
		if ($count <= 0) $count = 1;
		Show::response($followers->getFollowers($agent_id, $count, $offset));

	case 'special.getAllMessages':
		$count = (int) $data['count'];
		if ($count > CONFIG::ITEMS_PER_PAGE) $count = CONFIG::ITEMS_PER_PAGE;
		$offset = (int) $data['offset'];
		Show::response($Connect->db_get("SELECT * FROM messages WHERE author_id>0 order by id asc LIMIT $offset, $count"));

	case 'special.getNewMessages':
		$count = (int) $data['count'];
		if ($count > CONFIG::ITEMS_PER_PAGE) $count = CONFIG::ITEMS_PER_PAGE;
		$offset = (int) $data['offset'];
		$res = $Connect->db_get(
			"SELECT tickets.id, COUNT(messages.id) as count_unmark
			FROM tickets 
			LEFT JOIN messages on tickets.id=messages.ticket_id
			WHERE messages.mark=-1 AND messages.author_id>0 AND (messages.comment_author_id = 0 OR messages.comment_author_id IS NULL OR comment_time<edit_time)
			GROUP BY tickets.id ORDER BY COUNT(messages.id) DESC LIMIT $offset, $count"
		);
		$out = [];
		foreach ($res as $val) {
			$out[] = ['id' => (int)$val['id'], 'count_unmark' => (int)$val['count_unmark']];
		}
		Show::response($out);


	case 'ticket.addNewModerationTicket':
		$title = trim($data['title']);
		$text = trim($data['text']);
		if ($users->info['generator'] != 1) {
			Show::error(403);
		}

		$res = $Connect->db_get("SELECT COUNT(*) as count_q FROM queue_quest WHERE author_id=?", [$users->vk_id]);
		if($res){
			$count = $res[0]['count_q'];
			if($count > CONFIG::MAX_QUESTIONS_BY_PERSON){
				Show::error(42);
			}
		}
		if (mb_strlen($title) >= CONFIG::MAX_TICKETS_TITLE_LEN) {
			Show::error(20);
		}

		if (mb_strlen($text) >= CONFIG::MAX_TICKETS_TEXT_LEN) {
			Show::error(21);
		}

		if (mb_strlen($title) <= CONFIG::MIN_MESSAGE_LEN) {
			Show::error(24);
		}

		if (mb_strlen($text) <= CONFIG::MIN_MESSAGE_LEN) {
			Show::error(23);
		}
		$res = $Connect->query("INSERT INTO queue_quest (title, description, time, author_id) VALUES (?,?,?,?)", [$title, $text, time(), $users->vk_id]);
		$id = $res[1];
		if (!$res[1]) {
			Show::error(0);
		}
		Show::response(['quest_id' => $id]);

	case 'special.delModerationTicket':
		$id_answer = $data['id_ans'];
		$res = $Connect->db_get("SELECT author_id,description,time FROM queue_quest WHERE id=?", [$id_answer]);
		if ($res) {
			$Connect->query("UPDATE users SET bad_answers=bad_answers+1 WHERE vk_user_id=?", [$users->vk_id]);
			if ($settings->getOneSetting('generator_noty')) {
				try {
					$vk = new VkApi(CONFIG::VK_GROUP_TOKEN);
					$substractingText = substr($res[0]['description'], 0, 200);
					if (mb_strlen($res[0]['description']) > 200) {
						$substractingText .= '...';
					}
					$vk->sendMessage($res[0]['author_id'], 
					"Ваш вопрос рассмотрен нашими модераторами и был отклонен, рекомендуем прочитать правила составления ответов:\n\n» $substractingText");
				} catch (Exception $e) {

				}
			}
		}

		Show::response($Connect->query("DELETE FROM queue_quest WHERE id=?", [$id_answer]));

	case 'special.approveModerationTicket':
		$id_answer = $data['id_ans'];
		$res = $Connect->db_get("SELECT author_id,title,description,time FROM queue_quest WHERE id=?", [$id_answer]);
		if ($res) {
			$res = $res[0];
			$title = $res['title'];
			$desc = $res['description'];
			$real_author = $res['author_id'];
			$author = rand(1000, 659999999);
			$Connect->query("UPDATE users SET bad_answers=bad_answers+1 WHERE vk_user_id=?", [$users->vk_id]);
			if ($settings->getOneSetting('generator_noty')) {
				try{
					$vk = new VkApi(CONFIG::VK_GROUP_TOKEN);
					$substractingText = substr($desc, 0, 200);
					if (mb_strlen($desc) > 200) {
						$substractingText .= '...';
					}
					$vk->sendMessage($real_author, "Ваш вопрос рассмотрен нашими модераторами и был принят на очередь для агентов поддержки:\n\n» $substractingText");
				} catch (Exception $e) { 

				}
			}
			
			$donut_rand = false;
			$rnd = rand(0,99);
			if ($rnd>80){
				$donut_rand = true;
			}
			$tickets->add($title, $desc, $author, $donut_rand, $real_author);
			
		}
		Show::response($Connect->query('DELETE FROM queue_quest WHERE id=?', [$id_answer]));
		

	case 'special.getNewModerationTickets':
		$count = (int) $data['count'];
		if ($count > CONFIG::ITEMS_PER_PAGE) $count = CONFIG::ITEMS_PER_PAGE;
		$offset = (int) $data['offset'];
		$res = $Connect->db_get(
			"SELECT id, title, description, time
			FROM queue_quest ORDER BY time DESC LIMIT $offset, $count"
		);
		$out = [];
		foreach ($res as $val) {
			$out[] = ['id' => (int)$val['id'], 'title' => (string)$val['title'], 'description' => (string)$val['description'], 'time' => (int)$val['time'],];
		}
		Show::response($out);

	case 'admin.getVerificationRequests':
		$count = (int) $data['count'];
		if ($count > CONFIG::ITEMS_PER_PAGE) $count = CONFIG::ITEMS_PER_PAGE;
		$offset = (int) $data['offset'];
		$res = $Connect->db_get(
			"SELECT id, vk_id, aid, title, descverf, time
			FROM request_verification 
			WHERE inactive=0
			ORDER BY time DESC LIMIT $offset, $count"
		);
		$out = [];
		foreach ($res as $val) {
			$out[] = [
				'id' => (int)$val['id'],
				'vk_id' => (int)$val['vk_id'],
				'aid' => (int)$val['aid'],
				'title' => (string)$val['title'],
				'description' => (string)$val['descverf'],
				'time' => (int)$val['time'],
			];
		}
		Show::response($out);

	case 'admin.approveVerificationRequest':
		$id_request = $data['id_request'];
		$res = $Connect->db_get("SELECT id, aid, title, descverf, time FROM request_verification WHERE id=?", [$id_request]);
		if ($res) {
			$account->Verification($res[0]['aid']);
			$object = [
				'type' => 'verification_approve',
				'object' => 0
			];
			$sysnotifications->send($res[0]['aid'], "Запрос на верификацию одобрен", $object);
		}
		Show::response($Connect->query("UPDATE request_verification SET inactive=1 WHERE id=?", [$id_request]));

	case 'admin.denyVerificationRequest':
		$id_request = $data['id_request'];
		$res = $Connect->db_get("SELECT id, aid, title, descverf, time FROM request_verification WHERE id=?", [$id_request]);
		if ($res) {
			$object = [
				'type' => 'verification_demiss',
				'object' => 0,
			];
			$sysnotifications->send($res[0]['aid'], "Запрос на верификацию отклонён", $object);
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
	case 'recommendations.get':
		$res = $recommended->getRecommendations(0, 3, $users->id);
		Show::response($res);

	case 'faq.addCategory':
		$title =  (string) $data['title'];
		$icon_id = (int) $data['icon_id'];
		$color = mb_strtolower((string) $data['color']);
		Show::response($faq->addCategory($title, $icon_id, $color));

	case 'faq.delCategory':
		$category_id = (int) $data['category_id'];
		Show::response($faq->delCategory($category_id));

	case 'faq.addQuestion':
		$category_id = (int) $data['category_id'];
		$question = (string) $data['question'];
		$answer = (string) $data['answer'];
		$ismarkable = (int) $data['ismarkable'];
		$support_need = (int) $data['support_need'];

		Show::response($faq->addQuestion($category_id, $question, $answer, $ismarkable, $support_need));

	case 'faq.delQuestion':
		$question_id = (int) $data['question_id'];
		Show::response($faq->delQuestion($question_id));

	case 'faq.getCategories':
		Show::response($faq->getCategories()[0]);

	case 'faq.getQuestionsByCategory':
		$count = (int) $data['count'];
		if ($count > CONFIG::ITEMS_PER_PAGE) $count = CONFIG::ITEMS_PER_PAGE;
		$offset = (int) $data['offset'];
		$category = (int) $data['category_id'];
		Show::response($faq->getQuestionsByCategory($category, $offset, $count));

	case 'faq.getQuestionById':
		$question_id = (int) $data['id'];
		Show::response($faq->getQuestionById($question_id));
	
	case 'faq.getQuestionByName':
		$name = (string) $data['name'];
		Show::response($faq->getQuestionsByName($name));
	
	case 'tests.startTest':
		$test_id = $data['test_id'];
		Show::response($testsInspector->startTest($test_id));

	case 'tests.sendAnswers':
		$answers = $data['answers'];
		Show::response($testsInspector->checkAnswers($answers));

}
