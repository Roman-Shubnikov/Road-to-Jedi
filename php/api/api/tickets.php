<?php
class Tickets {
	protected $user = null;

	function __construct( Users $user ) {
		$this->user = $user;
	}

	public function getById( int $ticket_id, bool $need_full_author = true ) {
		$sql = "SELECT id, title, status, author_id, time
				FROM tickets WHERE id = $ticket_id";
		$res = db_get( $sql );
		$res = $res[0];

		if ( $need_full_author ) {
			$vkapi = new VKApi();
			$user = $vkapi->users_get( [-$res['author_id']], ['photo_200'] )[0];
		} else {
			$user = [
				'id' => -$res['author_id']
			];
		}

		$res['author'] = $user;
		return $this->_formatType( $res );
	}

	public function get( bool $unanswered = false, int $offset = 0, int $count = null ) {
		$cond = '';

		if ( $unanswered ) {
			$cond = "WHERE status = 0";
		}

		if ( $count === null ) {
			$count = CONFIG::ITEMS_PER_PAGE;
		}

		return $this->_get( $cond, $offset, $count );
	}
	public function getByModeratorAnswers( int $offset = 0, int $count = null, int $id ) {
		$author = $this->user->id;
		$sql = "SELECT id,text,ticket_id,mark,time FROM messages WHERE (mark = 1 or mark = 0) and author_id > 0 and author_id=$author ORDER BY time desc";
		$res = db_get( $sql );
		$ans = [];
		foreach ( $res as $message ) {
			$ans[] = ['id' => (int)$message['id'], 'text' => $message['text'], 'ticket_id' => (int)$message['ticket_id'], 'mark' => (int)$message['mark'], 'time' => (int)$message['time']];
		}
		return $ans;
	}

	public function getRandom() {
		$sql = "SELECT id FROM tickets WHERE status = 0 ORDER BY RAND() LIMIT 1";
		$res = db_get( $sql )[0];

		return $this->getById( $res['id'] );
	}

	public function getMy( int $offset = 0, int $count = null ) {
		$id = -$this->user->vk_id;
		$cond = "WHERE author_id = $id";

		if ( $count === null ) {
			$count = CONFIG::ITEMS_PER_PAGE;
		}

		return $this->_get( $cond, $offset, $count );
	}

	public function markMessage( int $message_id, int $mark ) {
		if ( $mark < 0 || $mark > 1 ) return false;

		$sql = "SELECT messages.id, messages.ticket_id, messages.author_id, messages.mark, messages.time, messages.text,
					   users.avatar_id, users.nickname, users.money, avatars.name as avatar_name, messages.approved
			    FROM messages 
				LEFT JOIN users
				ON messages.author_id > 0 AND messages.author_id = users.id
				LEFT JOIN avatars
				ON users.avatar_id = avatars.id
				WHERE messages.id = $message_id";
		$res = db_get( $sql )[0];

		$ticket = $this->getById( $res['ticket_id'] );

		if ( !$this->user->info['special'] ) {
			Show::error(32);
		}

		if( $res['author_id'] < 0) {
			Show::error(33);
		}

		if ( $res['mark'] != -1 ) {
			return false;
		}

		$data = [
			'mark' => (int) $mark,
			'approve_author_id' => (int) $_GET['vk_user_id']
		];

		// Сохраняем оценку в бд
		$result = db_edit( $data, "id = $message_id", 'messages' );

		// Увеличиваем счетчик оцененных ответов
		$auid = $res['author_id'];
		$good_or_bad = $mark == 1 ? 'good_answers' : 'bad_answers';
		$money = $mark == 1 ? 'money=money+10' : 'money=money';
		$sql = "UPDATE users SET $good_or_bad = $good_or_bad + 1, $money WHERE id = $auid";
		db_get( $sql );

		// $notification = substr( $res['text'], 0, 150 ).'...';
		$notification = 'Администрация оценила ваш ответ';


		$object = [
			'type' => $mark == 1 ? 'add_good_answer' : 'add_bad_answer',
			'object' => $ticket['id']
		];

		$avatar = CONFIG::AVATAR_PATH . '/' . $res['avatar_name'];
		SystemNotifications::send( $auid, $notification, $avatar, $object );

		return $result;
	}

	public function add( string $title, string $text ) {
		if ( !$this->user->info['special'] ) {
			Show::error(403);
		}
		$title = trim( $title );
		$text = trim( $text );

		if ( mb_strlen( $title ) > CONFIG::MAX_TICKETS_TITLE_LEN ) {
			Show::error(20);
		}

		if ( mb_strlen( $text ) > CONFIG::MAX_TICKETS_TEXT_LEN ) {
			Show::error(21);
		}

		if ( mb_strlen( $title ) < CONFIG::MIN_MESSAGE_LEN ) {
			Show::error(24);
		}

		if ( mb_strlen( $text ) < CONFIG::MIN_MESSAGE_LEN ) {
			Show::error(23);
		}


		$data = [
			'title' => $title,
			'author_id' => -$this->user->vk_id,
			'status' => 0,
			'time' => time()
		];

		global $mysqli;

		$res = db_add( $data, 'tickets' );
		$id = $mysqli->insert_id;
		if ( !$res ) {
			Show::error(0);
		}

		$message = $this->sendMessage( $id, $text );

		return ['ticket_id' => $id];
	}

	public function sendMessage( int $ticket_id, string $text ) {
		$ticket = $this->getById( $ticket_id, false );
		$text = trim( $text );
		if ( !$ticket['id'] ) {
			Show::error(404);
		}

		if ( $ticket['status'] == 2 ) {
			Show::error(30);
		}

		if ( mb_strlen( $text ) > CONFIG::MAX_TICKETS_TEXT_LEN ) {
			Show::error(21);
		}

		if ( mb_strlen( $text ) < CONFIG::MIN_MESSAGE_LEN ) {
			Show::error(23);
		}

		$uid = $this->user->id;
		$is_author = false;

		if ( $ticket['author']['id'] == $this->user->vk_id ) {
			$uid = -$this->user->vk_id;
			$is_author = true;
		}

		$message = [
			'ticket_id' => $ticket_id,
			'author_id' => $uid,
			'approved' => 0,
			'mark' => -1,
			'time' => time(),
			'text' => str_replace("XD", "😆", $text)
		];

		$res = db_add( $message, 'messages' );

		if ( !$res ) {
			Show::error(0);
		}

		global $mysqli;
		$id = $mysqli->insert_id;

		if ( $is_author ) {
			$data = [
				'status' => 0
			];

			db_edit( $data, "id = $ticket_id", 'tickets' );
		}


		// Сомнительная фича, непонятно зачем. Однажды может сломаться. Хардкод да и только
		// if ( !$this->user->info['special'] && !$is_author ) {
		// 	$data = [
		// 		'peer_id' => 2000000004,
		// 		'random_id' => time(),
		// 		'message' => "Поступил новый ответ на вопрос!\nСкорей беги проверять.\nhttps://vk.com/app7409818#ticket_id={$ticket_id}\n\nТвой Витёк...",
		// 		'access_token' =>'f8373822789d677c55a24c195cb74bd4b97ee014e00adc7a3c8a1985d31c5527c281cd2936dc2ff76a31b',
		// 		'v' => 5.103
		// 	];

		// 	$query = http_build_query( $data );
		// 	$url = "https://api.vk.com/method/messages.send?{$query}";
		// 	file_get_contents( $url );
		// }


		return [
			'message_id' => $id
		];
	}

	public function getMessages( int $ticket_id, int $offset = 0, int $count = null ) {
		$viewer = $this->user->id;
		if ( $count === null ) {
			$count = CONFIG::ITEMS_PER_PAGE;
		}

		offset_count( $offset, $count );

		$ticket = $this->getById( $ticket_id );
		$author_ticket = -$ticket['author']['id'];
		$is_author = ( $this->user->vk_id == $ticket['author']['id'] );
		$cond = '';

		if ( $is_author ) {
			$cond = "AND ( messages.author_id < 0 OR messages.approved = 1 )";
		} else {
			if(!$this->user->info['special']){
				$cond = "AND (messages.author_id = $author_ticket OR messages.author_id = $viewer OR messages.approved = 1)";
			}else{
				$cond = "AND (messages.mark=-1 or messages.mark=1 or messages.author_id = $viewer)";
			}
			
		}

		$sql = "SELECT messages.id, messages.ticket_id, messages.author_id, messages.mark, messages.time, messages.text,
					   users.avatar_id, users.nickname, users.special, avatars.name as avatar_name, messages.approved, messages.comment, messages.comment_author_id, messages.edit_time
			    FROM messages 
				LEFT JOIN users
				ON messages.author_id > 0 AND messages.author_id = users.id
				LEFT JOIN avatars
				ON users.avatar_id = avatars.id
				WHERE messages.ticket_id = $ticket_id $cond
				LIMIT $offset, $count";
		$res = db_get( $sql );

		$result = [];

		foreach ( $res as $message ) {
			if ( $message['author_id'] < 0 ) {
				$message['user'] = $ticket['author'];
				$message['user']['is_moderator'] = false;
			} else {
				$message['user'] = [
					'id' => (int) $message['author_id'],
					'nickname' => $message['nickname'],
					'avatar' => [
						'id' => (int) $message['avatar_id'],
						'url' => $message['avatar_name'] ? CONFIG::AVATAR_PATH . '/' . $message['avatar_name'] : CONFIG::AVATAR_PATH . '/' . rand(1,24) . '.png',
					],
					'is_moderator' => true,
					'is_special' => (bool) $message['special'],
					
				];
			}
			if ( $ticket['author']['id'] == $this->user->vk_id ) {
				unset( $message['approved'] );
			}


			$result[] = $this->_formatMessage( $message );
		}
		
		return $result;
	}

	public function approve( int $message_id ) {
		if ( !$this->user->info['special'] ) {
			Show::error(403);
		}

		$sql = "SELECT messages.id, messages.ticket_id, messages.author_id, messages.mark, messages.time, messages.text,
					   users.avatar_id, users.nickname, users.special, avatars.name as avatar_name, messages.approved
			    FROM messages 
				LEFT JOIN users
				ON messages.author_id > 0 AND messages.author_id = users.id
				LEFT JOIN avatars
				ON users.avatar_id = avatars.id
				WHERE messages.id = $message_id";
		$res = db_get( $sql )[0];

		if ( empty( $res ) ) {
			Show::error(404);
		}

		if ( $res['author_id'] < 0 ) {
			Show::error(22);
		}

		if ( $res['approved'] ) {
			return true;
		}

		$ticket = $this->getById( $res['ticket_id'] );

		// $notification = substr( $res['text'], 0, 150 ).'...';
		$notification = 'Администрация одобрила ваш ответ';

		$auid = Users::getIdByVKId( $ticket['author']['id'] );
		$object = [
			'type' => 'ticket_reply',
			'object' => $ticket['id']
		];

		$avatar = CONFIG::AVATAR_PATH . '/' . $res['avatar_name'];
		SystemNotifications::send( $auid, $notification, $avatar, $object );


		if ( $res['author_id'] != $this->user->id ) {
			$notification = substr( $res['text'], 0, 150 ).'...';
			$auid = $res['author_id'];
			$object = [
				'type' => 'reply_approve',
				'object' => $ticket['id']
			];

			$avatar = CONFIG::AVATAR_PATH . '/' . $this->user->info['avatar_name'];
			SystemNotifications::send( $auid, $notification, $avatar, $object );
		}

		$ticket_id = $ticket['id'];

		$data = [
			'status' => 1
		];
		db_edit( $data, "id = $ticket_id", 'tickets' );


		// Увеличиваем счетчик ответов
		$author_id = $res['author_id'];
		$sql = "UPDATE users SET total_answers = total_answers + 1 WHERE id = $author_id";
		db_get( $sql );

        $sql = "UPDATE users SET money = money + 2 WHERE id = $author_id";
        db_get( $sql );

		$result = db_edit( ['approved' => 1], "id = $message_id", 'messages' );
		return $result;
	}

	public function commentMessage( int $message_id, string $text ) {
		if ( !$this->user->info['special'] ) {
			Show::error(403);
		}

		$sql = "SELECT messages.id, messages.ticket_id, messages.author_id, messages.comment
				FROM messages WHERE messages.id = $message_id";
		$res = db_get( $sql )[0];

		$author_id = $res['author_id'];

		$avatar_id = db_get("SELECT avatar_id from users WHERE id = $author_id")[0]['avatar_id'];
		$avatar_name = db_get("SELECT name from avatars WHERE id = $avatar_id")[0]['name'];

		if ( empty( $res ) ) {
			Show::error(404);
		}

		if ( $author_id < 0 || !empty( $res['comment'] ) ) {
			Show::error(25);
		}


		if ( mb_strlen( $text ) > CONFIG::MAX_TICKETS_TEXT_LEN ) {
			Show::error(21);
		}

		if ( mb_strlen( $text ) < CONFIG::MIN_MESSAGE_LEN ) {
			Show::error(23);
		}

		$auid = $this->user->id;
		$notification = substr( $_POST['text'], 0, 150 ).'...';
		$data = [
			'comment' => $text,
			'comment_author_id' => $auid
		];

		$object = [
			'type' => 'comment_add',
			'object' => $res['ticket_id']
		];

		SystemNotifications::send( $res['author_id'], $notification, CONFIG::AVATAR_PATH . '/' . $avatar_name, $object );

		return db_edit( $data, "id = $message_id", 'messages' );
	}

	public function editComment( int $message_id, string $new_text ) {
		if ( !$this->user->info['special'] ) {
			Show::error(403);
		}

		$sql = "SELECT messages.id, messages.ticket_id, messages.author_id, messages.comment, messages.comment_author_id
			    FROM messages 
				WHERE messages.id = $message_id";
		$res = db_get( $sql )[0];

		if ( empty( $res ) ) {
			Show::error(404);
		}

		if ( $res['comment_author_id'] !== $this->user->id ) {
			Show::error(403);
		}

		if ( mb_strlen( $new_text ) > CONFIG::MAX_TICKETS_TEXT_LEN ) {
			Show::error(21);
		}

		if ( mb_strlen( $new_text ) < CONFIG::MIN_MESSAGE_LEN ) {
			Show::error(23);
		}

		$auid = $this->user->id;
		$data = [
			'comment' => $new_text,
			'comment_author_id' => $auid
		];

		return db_edit( $data, "id = $message_id", 'messages' );
	}

	public function deleteComment( int $message_id ) {
		if ( !$this->user->info['special'] ) {
			Show::error(403);
		}

		$sql = "SELECT messages.id, messages.ticket_id, messages.author_id, messages.comment, messages.comment_author_id
			    FROM messages 
				WHERE messages.id = $message_id";
		$res = db_get( $sql )[0];

		if ( empty( $res ) ) {
			Show::error(404);
		}

		if ( $res['comment_author_id'] !== $this->user->id ) {
			Show::error(403);
		}

		$data = [
			'comment' => '',
			'comment_author_id' => 0
		];

		return db_edit( $data, "id = $message_id", 'messages' );
	}

	public function deleteMessage( int $message_id ) {
		$sql = "SELECT messages.id, messages.ticket_id, messages.author_id
			    FROM messages 
				WHERE messages.id = $message_id";
		$res = db_get( $sql )[0];

		if ( empty( $res ) ) {
			Show::error(404);
		}

		if ( $res['author_id'] < 0 && $this->user->info['special'] ) {
			Show::error(403);
		}

		if ( $res['author_id'] == $this->user->id || $res['author_id'] == -$this->user->vk_id || $this->user->info['special'] ) {
			return db_del( "id = $message_id", 'messages' );
		}

		Show::error(403);
	}

	public function getByModerator( int $moderator_id, int $mark = -1, int $offset = 0, int $count = null ) {
		$auid = $moderator_id;

		if ( $count === null ) {
			$count = CONFIG::ITEMS_PER_PAGE;
		}

		offset_count( $offset, $count );

		$sql = "SELECT ticket_id FROM messages ";

		if ( $mark == 0 || $mark == 1 ) {
			$sql .= "WHERE mark = $mark AND author_id = $auid AND approved = 1 GROUP BY ticket_id";
		} else {
			$sql .= "WHERE author_id = $auid AND approved = 1 GROUP BY ticket_id";
		}

		$sql .= " LIMIT $offset, $count";
		$res = db_get( $sql );

		$a_ids = [];

		foreach ( $res as $id ) {
			$a_ids[] = $id['ticket_id'];
		}

		$s_ids = implode( ',', $a_ids );
		$cond = "WHERE id IN( $s_ids )";
		
		return $this->_get( $cond, $offset, $count );
	}

	public function editMessage( int $message_id, string $text ) {
		$sql = "SELECT messages.id, messages.ticket_id, messages.author_id, messages.approved
			    FROM messages 
				WHERE messages.id = $message_id";
		$res = db_get( $sql )[0];

		if ( empty( $res ) ) {
			Show::error(404);
		}

		if ( $res['author_id'] !== $this->user->id && $res['author_id'] !== -$this->user->vk_id ) {
			Show::error(403);
		}

		if ( $res['approved'] ) {
			Show::error(31);
		}

		if ( mb_strlen( $text ) > CONFIG::MAX_TICKETS_TEXT_LEN ) {
			Show::error(21);
		}

		if ( mb_strlen( $text ) < CONFIG::MIN_MESSAGE_LEN ) {
			Show::error(23);
		}

		$data = [
			'edit_time' => time(),
			'text' => str_replace("XD", "😆", $text)
		];

		return db_edit( $data, "id = $message_id", 'messages' );
	}

	public function close( int $ticket_id ) {
		return $this->_changeStatus( $ticket_id, 2 );
	}

	public function open( int $ticket_id ) {
		return $this->_changeStatus( $ticket_id, 0 );
	}

	private function _changeStatus( int $ticket_id, int $status ) {
		$ticket = $this->getById( $ticket_id );

		if ( !$ticket['id'] ) {
			Show::error(404);
		}

		if ( $this->user->vk_id !== $ticket['author']['id'] && !$this->user->info['special'] ) {
			Show::error(403);
		}

		$data = [
			'status' => $status
		];

		return db_edit( $data, "id = $ticket_id", 'tickets' );
	}

	private function _get( string $cond, int $offset = 0, int $count = null ) {
		if ( $count === null ) {
			$count = CONFIG::ITEMS_PER_PAGE;
		}

		offset_count( $offset, $count );

		$sql = "SELECT id, title, status, author_id, time
				FROM tickets $cond
				ORDER BY id DESC
				LIMIT $offset, $count";
		$res = db_get( $sql );

		$vkapi = new VKApi();
		$user_ids = [];
		$result = [];
		$users = [];

		foreach ( $res as $ticket ) {
			$user_ids[] = -$ticket['author_id'];
		}

		foreach ( $vkapi->users_get( $user_ids, ['photo_200'] ) as $user ) {
			$users[$user['id']] = $user;
		}

		
		foreach ( $res as $ticket ) {
			$ticket['author'] = $users[-$ticket['author_id']];
			$result[] = $this->_formatType( $ticket );
		}

		return $result;
	}


	private function _formatType( array $data ) {
		if ( !$data['id'] ) {
			return [];
		}

		$res = [
			'id' => (int) $data['id'],
			'time' => (int) $data['time'],
			'title' => $data['title'],
			'author' => $data['author'],
			'status' => (int) $data['status']
		];

		return $res;
	}

	private function _formatMessage( array $data ) {
		if ( !$data['id'] ) {
			return [];
		}

		$res = [
			'id' => (int) $data['id'],
			'time' => (int) $data['time'],
			'ticket_id' => (int) $data['ticket_id'],
			'text' => $data['text'],
			'author' => $data['user'],
			'mark' => (int) $data['mark'],
			'approved' => isset($data['approved']) ? (bool) $data['approved'] : null
		];

		if ( !empty( $data['comment'] ) && $data['comment_author_id'] !== 0 ) {
			$res['moderator_comment'] = [
				'author_id' => (int) $data['comment_author_id'],
				'is_special' => true,
				'text' => $data['comment']
			];
		}

		if ( $data['edit_time'] > 0 ) {
			$res['is_edited'] = true;
			$res['edit_time'] = (int) $data['edit_time'];
		}

		if ( !empty( $data['nickname'] ) ) $res['nickname'] = $data['nickname'];

		if ( $data['author_id'] < 0 ) {
			unset( $res['approved'] );
		}

		if ( !isset( $data['approved'] ) ) {
			unset( $res['approved'] );
		}

		if ( $data['mark'] == -1 ) {
			unset( $res['mark'] );
		}

		return $res;
	}
}