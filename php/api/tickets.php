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
			$count = ITEMS_PER_PAGE;
		}

		return $this->_get( $cond, $offset, $count );
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
			$count = ITEMS_PER_PAGE;
		}

		return $this->_get( $cond, $offset, $count );
	}

	public function markMessage( int $message_id, int $mark ) {
		if ( $mark < 0 || $mark > 1 ) return false;

		$user_id = $_GET['vk_user_id'];

		$sql = "SELECT messages.id, messages.ticket_id, messages.author_id, messages.mark, messages.time, messages.text,
					   users.avatar_id, users.nickname, users.money, avatars.name as avatar_name, messages.approved
			    FROM messages 
				LEFT JOIN users
				ON messages.author_id > 0 AND messages.author_id = users.id
				LEFT JOIN avatars
				ON users.avatar_id = avatars.id
				WHERE messages.id = $message_id";
		$res = db_get( $sql )[0];

		if ( empty( $res ) ) {
			throw new Exception( ERRORS[404], 404 );
		}

		$ticket = $this->getById( $res['ticket_id'] );

		if ( $ticket['author']['id'] != $this->user->vk_id ) {
			throw new Exception( ERRORS[403], 403 );
		}

		if ( $res['mark'] != -1 ) {
			return false;
		}

		$data = [
			'mark' => (int) $mark
		];

		// Сохраняем оценку в бд
		$result = db_edit( $data, "id = $message_id", 'messages' );

		// Увеличиваем счетчик оцененных ответов
		$auid = $res['author_id'];
		$good_or_bad = $mark == 1 ? 'good_answers' : 'bad_answers';

		$sql = "UPDATE users SET $good_or_bad = $good_or_bad + 1 WHERE id = $auid";
		db_get( $sql );

		return $result;
	}

	public function add( string $title, string $text ) {
		if ( mb_strlen( $title ) > MAX_TICKETS_TITLE_LEN ) {
			throw new Exception( ERRORS[20], 20 );
		}

		if ( mb_strlen( $text ) > MAX_TICKETS_TEXT_LEN ) {
			throw new Exception( ERRORS[21], 21 );
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
			throw new Exception( ERRORS[0], 0 );
		}

		$message = $this->sendMessage( $id, $text );

		return ['ticket_id' => $id];
	}

	public function sendMessage( int $ticket_id, string $text ) {
		$ticket = $this->getById( $ticket_id, false );

		if ( !$ticket['id'] ) {
			throw new Exception( ERROR[404], 404 );
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
			throw new Exception( ERRORS[0], 0 );
		}

		global $mysqli;

		$msg_id = $mysqli->insert_id;

		$data = [
			'status' => $is_author ? 0 : 1
		];

		db_edit( $data, "id = $ticket_id", 'tickets' );

		return [
			'message_id' => $msg_id
		];
	}

	public function getMessages( int $ticket_id, int $offset = 0, int $count = null ) {
		if ( $count === null ) {
			$count = ITEMS_PER_PAGE;
		}

		offset_count( $offset, $count );

		$ticket = $this->getById( $ticket_id );
		$is_author = ( $this->user->vk_id == $ticket['author']['id'] );
		$cond = '';

		if ( $is_author ) {
			$cond = "AND ( messages.author_id < 0 OR messages.approved = 1 )";
		}

		$sql = "SELECT messages.id, messages.ticket_id, messages.author_id, messages.mark, messages.time, messages.text,
					   users.avatar_id, users.nickname, avatars.name as avatar_name, messages.approved
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
						'url' => AVATAR_PATH . '/' . $message['avatar_name'],
					],
					'is_moderator' => true
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
			throw new Exception( ERRORS[403], 403 );
		}

		$sql = "SELECT messages.id, messages.ticket_id, messages.author_id, messages.mark, messages.time, messages.text,
					   users.avatar_id, users.nickname, avatars.name as avatar_name, messages.approved
			    FROM messages 
				LEFT JOIN users
				ON messages.author_id > 0 AND messages.author_id = users.id
				LEFT JOIN avatars
				ON users.avatar_id = avatars.id
				WHERE messages.id = $message_id";
		$res = db_get( $sql )[0];

		if ( empty( $res ) ) {
			throw new Exception( ERRORS[404], 404 );
		}

		if ( $res['author_id'] < 0 ) {
			throw new Exception( ERRORS[22], 22 );
		}

		if ( $res['author_id'] == $this->user->id ) {
			throw new Exception( ERRORS[403], 403 );
		}

		if ( $res['approved'] ) {
			return true;
		}

		$ticket = $this->getById( $res['ticket_id'] );

		$notification = substr( $ticket['title'], 0, 150 ).'...';
		$auid = Users::getIdByVKId( $ticket['author']['id'] );
		$object = [
			'type' => 'ticket_reply',
			'object' => $ticket['id']
		];

		$avatar = AVATAR_PATH . '/' . $res['avatar_name'];
		SystemNotifications::send( $auid, $notification, $avatar, $object );

		if ( $res['author_id'] != $this->user->id ) {
			$notification = substr( $res['text'], 0, 150 ).'...';
			$auid = $res['author_id'];
			$object = [
				'type' => 'reply_approve',
				'object' => $ticket['id']
			];

			$avatar = AVATAR_PATH . '/' . $this->user->info['avatar_name'];
			SystemNotifications::send( $auid, $notification, $avatar, $object );
		}

		// Увеличиваем счетчик ответов
		$author_id = $res['author_id'];
		$sql = "UPDATE users SET total_answers = total_answers + 1 WHERE id = $author_id";
		db_get( $sql );

        $sql = "UPDATE users SET money = money + 2 WHERE id = $author_id";
        db_get( $sql );

		$result = db_edit( ['approved' => 1], "id = $message_id", 'messages' );
		return $result;
	}

	public function getByModerator( int $moderator_id, int $mark = -1, int $offset = 0, int $count = null ) {
		$auid = $moderator_id;

		if ( $count === null ) {
			$count = ITEMS_PER_PAGE;
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

	private function _get( string $cond, int $offset = 0, int $count = null ) {
		if ( $count === null ) {
			$count = ITEMS_PER_PAGE;
		}

		offset_count( $offset, $count );

		$sql = "SELECT id, title, status, author_id, time
				FROM tickets $cond
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
			'approved' => (bool) $data['approved']
		];

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