<?php
class Tickets
{
	protected $user = null;
	protected $Connect;

	function __construct(Users $user, DB $Connect, SystemNotifications $SYSNotif)
	{
		$this->user = $user;
		$this->Connect = $Connect;
		$this->SYSNOTIF = $SYSNotif;
	}

	public function getById(int $ticket_id, bool $need_full_author = true)
	{
		$sql = "SELECT id, title, status, author_id, time, donut, real_author
				FROM tickets WHERE id=?";
		$res = $this->Connect->db_get($sql, [$ticket_id]);
		if(!$res) Show::error(404);
		$res = $res[0];
		if ($res['donut']) {
			if (!$this->user->donut && ($this->user->info['permissions'] < CONFIG::PERMISSIONS['special'])) {
				Show::error(403);
			}
		}
		if ($res['status'] != 0 && ($this->user->info['permissions'] < CONFIG::PERMISSIONS['special'])) {
			$sql = "SELECT author_id FROM messages WHERE author_id=? AND ticket_id=?";
			if (count($this->Connect->db_get($sql, [$this->user->id, $ticket_id])) == 0) {
				Show::error(403);
			}
		}
		if ($need_full_author) {
			$vkapi = new VKApi();
			$user = $vkapi->users_get([-$res['author_id']], ['photo_200'])[0];
		} else {
			$user = [
				'id' => -$res['author_id']
			];
		}
		if((int)$res['real_author'] != $this->user->vk_id && $this->user->info['permissions'] < CONFIG::PERMISSIONS['special']){
			unset($res['real_author']);
		}
		$res['author'] = $user;
		return $this->_formatType($res);
	}

	public function get(bool $unanswered = false, int $offset = 0, int $count = null)
	{
		$cond = 'WHERE status=0';

		// if ($unanswered) {
		// 	if (($this->user->info['permissions'] >= CONFIG::PERMISSIONS['special']) || $this->user->donut) {
		// 		$cond = "WHERE status=0";
		// 	} else {
		// 		$cond = "WHERE status=0 and donut=0";
		// 	}
		// }

		if ($count === null) {
			$count = CONFIG::ITEMS_PER_PAGE;
		}
		return $this->_get($cond, $offset, $count);
	}
	public function getByModeratorAnswers(int $id, int $offset = 0, int $count = null)
	{
		$author = $this->user->id;
		$sql = "SELECT id,text,ticket_id,mark,time FROM messages WHERE author_id > 0 and author_id=? ORDER BY time desc";
		$res = $this->Connect->db_get($sql, [$author]);
		$ans = [];
		foreach ($res as $message) {
			$ans[] = ['id' => (int)$message['id'], 'text' => $message['text'], 'ticket_id' => (int)$message['ticket_id'], 'mark' => (int)$message['mark'], 'time' => (int)$message['time']];
		}
		return $ans;
	}

	public function getRandom()
	{
		$no_don = '';
		if (!$this->user->donut && ($this->user->info['permissions'] < CONFIG::PERMISSIONS['special'])) $no_don = 'AND donut=0';
		$sql = "SELECT id FROM tickets WHERE status=0 $no_don ORDER BY RAND() LIMIT 1";
		$res = $this->Connect->db_get($sql)[0];

		return $this->getById($res['id']);
	}

	public function getMy(int $offset = 0, int $count = null)
	{
		$id = -$this->user->vk_id;
		$cond = "WHERE author_id = $id";

		if ($count === null) {
			$count = CONFIG::ITEMS_PER_PAGE;
		}

		return $this->_get($cond, $offset, $count);
	}
	public function getMyModeration() {
		$sql = "SELECT id,title,description,time FROM queue_quest WHERE author_id=? ORDER BY time desc";
		$res = $this->Connect->db_get($sql, [$this->user->vk_id]);
		$ans = [];
		if($res){
			foreach ($res as $question) {
				$ans[] = ['id' => (int)$question['id'], 'title' => $question['title'], 'description' => $question['description'], 'time' => (int)$question['time']];
			}
		}
		return $ans;
	}
	public function rate(int $ticket_id, int $rate) {
		if(!in_array($rate, [0,2])){
			Show::error(10, ['param' => 'rate']);
		}
		$res = $this->getById($ticket_id);
		if((int)$res['status'] == 1){
			return $this->_changeStatus($ticket_id, $rate);
		} else {
			Show::customError('Дождитесь получения ответа');
		}
		
		Show::error(403);
		
	}
	public function markMessage(int $message_id, int $mark)
	{
		if ($mark < 0 || $mark > 1) return false;

		$sql = "SELECT messages.id, messages.ticket_id, messages.author_id, messages.mark, messages.time, 
				messages.text, messages.comment, users.nickname, users.money, messages.approved
			    FROM messages 
				LEFT JOIN users
				ON messages.author_id > 0 AND messages.author_id = users.id
				WHERE messages.id=?";
		$res = $this->Connect->db_get($sql, [$message_id])[0];

		$ticket = $this->getById($res['ticket_id']);

		if ($this->user->info['permissions'] < CONFIG::PERMISSIONS['special']) {
			Show::error(32);
		}

		if ($res['author_id'] < 0) {
			Show::error(33);
		}

		if ($res['mark'] != -1) {
			Show::error(38);
		}
		if ($mark != 1 && !(bool)$res['comment']) {
			Show::error(37);
		}
		// Сохраняем оценку в бд
		$special_info = $this->Connect->db_get('SELECT age,mark_day,flash FROM users WHERE id=?', [$this->user->id])[0];
		if ($special_info['age'] <= $special_info['mark_day'] && $special_info['flash'] == 0) {
			$this->Connect->query("UPDATE users SET good_answers=good_answers+1, mark_day=mark_day+1, total_answers=total_answers+1, flash=? WHERE id=?", 
			[time(), $this->user->id]);
			$this->SYSNOTIF->send($this->user->id, 'Прометей отметил Вас', [
				'type' => 'flash_add',
				'object' => 0,
			]);
		} else {
			$this->Connect->query("UPDATE users SET good_answers=good_answers+1, mark_day=mark_day+1, total_answers=total_answers+1 WHERE id=?", [$this->user->id]);
		}
		$result = $this->Connect->query("UPDATE messages SET mark=?,approve_author_id=? WHERE id=?", [$mark, $this->user->vk_id, $message_id]);

		// Увеличиваем счетчик оцененных ответов
		$auid = $res['author_id'];
		$good_or_bad = $mark == 1 ? 'good_answers' : 'bad_answers';
		$rating = $mark == 1 ? 'coff_active=coff_active+16' : 'coff_active=coff_active-4';
		if ($ticket['donut']) {
			$money = $mark == 1 ? 'money=money+30,donuts=donuts+10' : 'money=money-30';
		} else {
			$money = $mark == 1 ? 'money=money+10' : 'money=money-30';
		}

		$sql = "UPDATE users SET $good_or_bad = $good_or_bad + 1, $rating, $money WHERE id=?";
		$this->Connect->query($sql, [$auid]);

		// $notification = substr( $res['text'], 0, 150 ).'...';
		$notification = 'Администрация оценила ваш ответ';
		$object = [
			'type' => $mark == 1 ? 'add_good_answer' : 'add_bad_answer',
			'object' => $ticket['id']
		];

		$avatar = CONFIG::AVATAR_PATH . '/default.png';
		$this->SYSNOTIF->send($auid, $notification, $object, $avatar);

		return $result;
	}

	public function add(string $title, string $text, int $author, bool $donut, $real_author=0)
	{
		// -$this->user->vk_id
		$res = $this->Connect->query("INSERT INTO tickets (title,author_id,status,time,donut,real_author) VALUES (?,?,?,?,?,?)", 
		[$title, -$author, 0, time(), (int)$donut, $real_author]);
		$id = $res[1];
		if (!$res[1]) {
			Show::error(0);
		}

		$this->sendMessage($id, $text, -$author);

		return ['ticket_id' => $id];
	}

	public function sendMessage(int $ticket_id, string $text, int $author = null)
	{
		$ticket = $this->getById($ticket_id, false);
		$text = trim($text);
		if (!$ticket['id']) Show::error(404);

		if ($ticket['status'] == 2 || $ticket['status'] == 1) Show::error(30);

		if (mb_strlen($text) >= CONFIG::MAX_TICKETS_TEXT_LEN) Show::error(21);

		if (mb_strlen($text) <= CONFIG::MIN_MESSAGE_LEN) Show::error(23);

		$uid = $this->user->id;
		$author = $author ? $author : -$this->user->vk_id;
		$is_author = false;
		if($this->user->info['permissions'] >= CONFIG::PERMISSIONS['special']){
			$is_author = true;
			$uid = $author;
		}
		// if($ticket['author']['id'] == -$author){
		// 	$is_author = true;
		// 	$uid = $author;
		// }
		$text = Utils::replaceSymbols($text);
		$res = $this->Connect->query("INSERT INTO messages (ticket_id, author_id, approved, mark, time, text) VALUES (?,?,?,?,?,?)", 
		[$ticket_id, $uid, 0, -1, time(), $text]);
		if (!$res[1]) {
			Show::error(0);
		}
		$id = $res[1];

		if ($is_author) {
			$this->Connect->query("UPDATE tickets SET status=0 WHERE id=?", [$ticket_id]);
		}

		return [
			'message_id' => $id
		];
	}
	public function isLimitReach(int $ticket_id)
	{
		$viewer = $this->user->id;
		$viewer_user = $this->user->vk_id;
		$special_time = time() - 7200;
		$sql = "SELECT id
			    FROM messages 
				WHERE ticket_id=? and (author_id=? OR author_id=?) and time>?";
		$res = $this->Connect->db_get($sql, [$ticket_id, $viewer, $viewer_user, $special_time]);
		if (count($res) > 3) {
			return true;
		}
		return false;
	}
	public function getMessages(int $ticket_id, int $offset = 0, int $count = null)
	{
		$viewer = $this->user->id;
		$vk_view = -$this->user->vk_id;
		if ($count === null) {
			$count = CONFIG::ITEMS_PER_PAGE;
		}

		offset_count($offset, $count);

		$ticket = $this->getById($ticket_id);
		$author_ticket = -$ticket['author']['id'];
		$is_author = ($this->user->vk_id == $ticket['author']['id']);
		$cond = '';

		if ($is_author) {
			$cond = "AND ( messages.author_id < 0 OR messages.approved = 1 OR messages.author_id=$vk_view )";
		} else {
			if ($this->user->info['permissions'] < CONFIG::PERMISSIONS['special']) {
				$cond = "AND (messages.author_id = $author_ticket OR messages.author_id = $viewer OR messages.approved = 1)";
			} else {
				$cond = "AND (messages.mark=-1 or messages.mark=1 or messages.author_id = $viewer) OR (messages.mark=0 AND comment=null)";
			}
		}

		$sql = "SELECT messages.id, 
					messages.ticket_id, 
					messages.author_id, 
					messages.mark, 
					messages.time, 
					messages.text,
					users.avatarId, 
					users.nickname, 
					files.path as avatar_path, 
					messages.approved,
					messages.chance_posit,
					messages.comment, 
					messages.comment_author_id, 
					messages.edit_time,
					specials.nickname as comment_author_nickname,
					files_special.path as comment_author_avatar_path,
					messages.comment_time,
					mark_authors.id as mark_author_id,
					mark_authors.nickname as mark_author_nickname
			    FROM messages 
				LEFT JOIN users
				ON messages.author_id > 0 AND messages.author_id = users.id
				LEFT JOIN users as specials
				ON messages.comment_author_id = specials.id
				LEFT JOIN files
				ON users.avatarId = files.id
				LEFT JOIN files as files_special
				ON specials.avatarId = files.id
				LEFT JOIN users as mark_authors
				ON messages.approve_author_id = mark_authors.vk_user_id
				WHERE messages.ticket_id=? $cond
				LIMIT $offset, $count";
		$res = $this->Connect->db_get($sql, [$ticket_id]);

		$result = [];

		foreach ($res as $message) {
			if ($message['author_id'] < 0) {
				$message['user'] = $ticket['author'];
				$message['user']['is_moderator'] = false;
			} else {
				$message['user'] = [
					'id' => (int) $message['author_id'],
					'nickname' => $message['nickname'],
					'avatar' => [
						'id' => (int) $message['avatarId'],
						'url' => $message['avatar_path'] ? CONFIG::S3_FILES_PATH . '/' . $message['avatar_path'] : CONFIG::AVATAR_PATH . '/default.png',
					],
					'is_moderator' => true,
					'is_special' => (bool) $this->user->info['permissions'] >= CONFIG::PERMISSIONS['special'],

				];
			}
			if ($ticket['author']['id'] == $this->user->vk_id) {
				unset($message['approved']);
			}


			$result[] = $this->_formatMessage($message);
		}

		return $result;
	}

	public function approve(int $message_id)
	{

		$sql = "SELECT messages.id, messages.ticket_id, messages.author_id, messages.mark, messages.time, messages.text,
				 users.nickname, messages.approved
			    FROM messages 
				LEFT JOIN users
				ON messages.author_id > 0 AND messages.author_id = users.id
				WHERE messages.id=$message_id";
		$res = $this->Connect->db_get($sql)[0];

		if (empty($res)) {
			Show::error(404);
		}
		if ($res['author_id'] < 0) {
			Show::error(22);
		}

		if ($res['approved']) {
			return true;
		}

		$ticket = $this->getById($res['ticket_id']);

		$notification = 'Администрация одобрила ваш ответ';
		$auid = $res['author_id'];
		$object = [
			'type' => 'reply_approve',
			'object' => $ticket['id']
		];

		$avatar = CONFIG::AVATAR_PATH . '/default.png';
		$this->SYSNOTIF->send($auid, $notification, $object, $avatar);

		$ticket_id = $ticket['id'];

		$this->Connect->query("UPDATE tickets SET status=1 WHERE id=?", [$ticket_id]);

		// Увеличиваем счетчик ответов
		$author_id = $res['author_id'];
		$sql = "UPDATE users SET coff_active=coff_active+20 WHERE id=?";
		$this->Connect->query($sql, [$author_id]);

		$sql = "UPDATE users SET money = money + 20 WHERE id=?";
		$this->Connect->query($sql, [$author_id]);

		$sql = "UPDATE messages SET approved=1 WHERE id=?";
		$res = $this->Connect->query($sql, [$message_id]);

		return $res;
	}

	public function commentMessage(int $message_id, string $text)
	{
		$sql = "SELECT id, ticket_id, author_id, comment, mark
				FROM messages WHERE id=?";
		$res = $this->Connect->db_get($sql, [$message_id])[0];

		$author_id = $res['author_id'];

		if (empty($res)) {
			Show::error(404);
		}

		if ($author_id < 0 || !empty($res['comment'])) {
			Show::error(25);
		}

		$len = mb_strlen($text);

		if ($len > CONFIG::MAX_TICKETS_TEXT_LEN) {
			Show::error(21);
		}

		if ($len < CONFIG::MIN_MESSAGE_LEN) {
			Show::error(23);
		}
		$auid = $this->user->id;
		$notification = "Администрация оставила комментарий к вашему ответу";
		$object = [
			'type' => 'comment_add',
			'object' => $res['ticket_id']
		];
		$comment_time = 0;
		if($res['mark'] === -1) {
			$comment_time = time();
		}
		$text = Utils::replaceSymbols($text);

		$this->SYSNOTIF->send($res['author_id'], $notification, $object, CONFIG::AVATAR_PATH . '/default.png');
		return $this->Connect->query("UPDATE messages SET comment=?, comment_author_id=?, comment_time=? WHERE id=?", [$text, $auid, $comment_time, $message_id])[0];
	}

	public function editComment(int $message_id, string $new_text)
	{
		$sql = "SELECT messages.id, messages.ticket_id, messages.author_id, messages.comment, messages.comment_author_id
			    FROM messages 
				WHERE messages.id=?";
		$res = $this->Connect->db_get($sql, [$message_id])[0];

		if (empty($res)) {
			Show::error(404);
		}

		if ($res['comment_author_id'] !== $this->user->id) {
			Show::error(403);
		}
		$len = mb_strlen($new_text);

		if ($len > CONFIG::MAX_TICKETS_TEXT_LEN) {
			Show::error(21);
		}

		if ($len < CONFIG::MIN_MESSAGE_LEN) {
			Show::error(23);
		}
		$new_text = Utils::replaceSymbols($new_text);
		$auid = $this->user->id;
		$res = $this->Connect->query("UPDATE messages SET comment=?, comment_author_id=?, comment_time=? WHERE id=?", [$new_text, $auid, time(), $message_id]);
		return $res[0];
	}

	public function deleteComment(int $message_id)
	{

		$sql = "SELECT messages.id, messages.ticket_id, messages.author_id, messages.comment, messages.comment_author_id
			    FROM messages 
				WHERE messages.id=?";
		$res = $this->Connect->db_get($sql, [$message_id])[0];

		if (empty($res)) {
			Show::error(404);
		}

		if ($res['comment_author_id'] !== $this->user->id && $this->user->info['permissions'] < CONFIG::PERMISSIONS['admin']) {
			Show::error(403);
		}
		$res = $this->Connect->query("UPDATE messages SET comment=NULL, comment_author_id=0, comment_time=0 WHERE id=?", [$message_id]);
		return $res[0];
	}
	public function delete(int $ticket_id) {
		return $this->Connect->query("DELETE FROM tickets WHERE id=?", [$ticket_id])[0];
	}
	public function deleteMessage(int $message_id)
	{

		$sql = "SELECT messages.id, messages.time, messages.ticket_id, messages.author_id,
				messages.mark
			    FROM messages 
				WHERE messages.id=?";
		$res = $this->Connect->db_get($sql, [$message_id])[0];
		$author = (int)$res['author_id'];
		$time_create = (int) $res['time'];
		if (empty($res)) {
			Show::error(404);
		}
		if($time_create < time() - 120) Show::error(43); // Нельзя удалять сообщение если прошло 2 минуты
		
		if ($res['mark'] != -1) {
			Show::error(403);
		}
		if ($author == $this->user->id || ($author < 0 && ($this->user->info['permissions'] >= CONFIG::PERMISSIONS['special'])) || $author == -$this->user->vk_id) {
			return $this->Connect->query("DELETE FROM messages WHERE id=?", [$message_id]);
		}
		Show::error(403);
	}

	public function getByModerator(int $moderator_id, int $mark = -1, int $offset = 0, int $count = null)
	{
		$auid = $moderator_id;

		if ($count === null) {
			$count = CONFIG::ITEMS_PER_PAGE;
		}

		offset_count($offset, $count);

		$sql = "SELECT ticket_id FROM messages ";

		if ($mark == 0 || $mark == 1) {
			$sql .= "WHERE mark = $mark AND author_id = $auid AND approved = 1 GROUP BY ticket_id";
		} else {
			$sql .= "WHERE author_id = $auid AND approved = 1 GROUP BY ticket_id";
		}

		$sql .= " LIMIT $offset, $count";
		$res = $this->Connect->db_get($sql);

		$a_ids = [];

		foreach ($res as $id) {
			$a_ids[] = $id['ticket_id'];
		}

		$s_ids = implode(',', $a_ids);
		$cond = "WHERE id IN( $s_ids )";

		return $this->_get($cond, $offset, $count);
	}

	public function editMessage(int $message_id, string $text)
	{
		$sql = "SELECT messages.id, tickets.status,messages.mark, messages.ticket_id, messages.author_id, messages.approved
			    FROM messages LEFT JOIN tickets
				ON messages.ticket_id = tickets.id
				WHERE messages.id=?";
		$res = $this->Connect->db_get($sql, [$message_id])[0];
		$author = (int)$res['author_id'];
		if (empty($res)) {
			Show::error(404);
		}
		
		if ($author != $this->user->id && $author != -$this->user->vk_id) {
			Show::error(403);
		}
		if ($res['status'] == 1 || $res['status'] == 2) {
			Show::error(30);
		}
		if ($res['approved'] || $res['mark'] != -1) {
			Show::error(31);
		}

		if (mb_strlen($text) > CONFIG::MAX_TICKETS_TEXT_LEN) {
			Show::error(21);
		}

		if (mb_strlen($text) < CONFIG::MIN_MESSAGE_LEN) {
			Show::error(23);
		}
		$text = Utils::replaceSymbols($text);
		return $this->Connect->query("UPDATE messages SET edit_time=?, text=?, comment=NULL, comment_author_id=0, comment_time=0 WHERE id=?", [time(), $text, $message_id]);
	}

	public function close(int $ticket_id)
	{
		return $this->_changeStatus($ticket_id, 2);
	}

	public function open(int $ticket_id)
	{
		return $this->_changeStatus($ticket_id, 0);
	}
	public function uploadFile($file) {
		$exp_file = explode('.', $file['name']);
		$filepath = CONFIG::ATTACHMENTS_PATH .'/'. substr(md5($file['name']), 0, 16).'.'.end($exp_file);
		if(move_uploaded_file($file['tmp_name'], $filepath)) {
			Show::response(['filepath' => $filepath]);
		}else {
			Show::error(0);
		}
		
	}

	private function _changeStatus(int $ticket_id, int $status)
	{
		$ticket = $this->getById($ticket_id);

		if (!$ticket['id']) {
			Show::error(404);
		}

		if ($this->user->vk_id !== $ticket['author']['id'] && ($this->user->info['permissions'] < CONFIG::PERMISSIONS['special'])) {
			Show::error(403);
		}
		return $this->Connect->query("UPDATE tickets SET status=? WHERE id=?", [$status, $ticket_id]);
	}

	private function _get(string $cond, int $offset = 0, int $count = null)
	{
		if ($count === null) {
			$count = CONFIG::ITEMS_PER_PAGE;
		}

		offset_count($offset, $count);

		$sql = "SELECT id, title, status, author_id, time, donut
				FROM tickets $cond
				ORDER BY id DESC
				LIMIT $offset, $count";
		$res = $this->Connect->db_get($sql);

		$vkapi = new VKApi();
		$user_ids = [];
		$result = [];
		$users = [];
		$ticket_ids = [];
		$message_tickets_ids = [];
		
		foreach ($res as $ticket) {
			$user_ids[] = -$ticket['author_id'];
			$ticket_ids[] = $ticket['id'];
		}
		$tickets_string = implode(",", $ticket_ids);
		$viewer = $this->user->id;
		$sql = "SELECT ticket_id
				FROM messages WHERE ticket_id IN ( $tickets_string )
				AND author_id={$viewer} AND mark!=-1
				ORDER BY id DESC";
		$messages = $this->Connect->db_get($sql);
		foreach($messages as $message) {
			$message_tickets_ids[] = $message['ticket_id'];
		}
		foreach ($vkapi->users_get($user_ids, ['photo_200']) as $user) {
			$users[$user['id']] = $user;
		}


		foreach ($res as $ticket) {
			$ticket['author'] = $users[-$ticket['author_id']];
			if(!in_array($ticket['id'], $message_tickets_ids)){
				$result[] = $this->_formatType($ticket);
			}
			
		}

		return $result;
	}


	private function _formatType(array $data)
	{
		if (!$data['id']) {
			return [];
		}

		$res = [
			'id' => (int) $data['id'],
			'time' => (int) $data['time'],
			'title' => $data['title'],
			'author' => $data['author'],
			'status' => (int) $data['status'],
			'donut' => (bool) $data['donut'],
		];
		if(isset($data['real_author'])) $res['real_author'] = (int) $data['real_author'];
		return $res;
	}

	private function _formatMessage(array $data)
	{
		if (!$data['id']) {
			return [];
		}
		$res = [
			'id' => (int) $data['id'],
			'time' => (int) $data['time'],
			'ticket_id' => (int) $data['ticket_id'],
			'text' => $data['text'],
			'author' => $data['user'],
			'chance_posit' => (int) $data['chance_posit'],
			'approved' => isset($data['approved']) ? (bool) $data['approved'] : null
		];

		if (!empty($data['comment']) && $data['comment_author_id'] !== 0) {
			$bomb_time = 0;
			if($data['comment_time'] > $data['edit_time']){
				$bomb_time = $data['comment_time'] + 86400;
			}
			if($bomb_time < time()) $bomb_time = 0;
			$comment_data = [];
			$comment_data += [
				'text' => $data['comment'],
				'time' => (int)$data['comment_time'],
				'bomb_time' => (int) $bomb_time,
			];
			if($this->user->info['permissions'] >= CONFIG::PERMISSIONS['special']){
				$comment_data += [
					'author_id' => (int) $data['comment_author_id'],
					'nickname' => $data['comment_author_nickname'],
					'avatar' => $data['comment_author_avatar_path'],
				];
				
			}
			if($data['comment_author_id'] == -1){
				$comment_data = array_replace($comment_data, [
					'author_id' => -1,
					'nickname' => CONFIG::NAME_COMMENT_CLEANER,
					'avatar' => CONFIG::AVATAR_COMMENT_CLEANER,
				]);
			}
			$res['moderator_comment'] = $comment_data;
			
		}

		if ($data['edit_time'] > 0) {
			$res['is_edited'] = true;
			$res['edit_time'] = (int) $data['edit_time'];
		}

		if (!empty($data['nickname'])) $res['nickname'] = $data['nickname'];

		if ($data['author_id'] < 0) {
			unset($res['approved']);
		}

		if (!isset($data['approved'])) {
			unset($res['approved']);
		}

		if ($data['mark'] != -1) {
			$mark_info = [
				'mark' => (int) $data['mark']
			];
			if($this->user->info['permissions'] >= CONFIG::PERMISSIONS['special']){
				$mark_specials = [
					'mark_author_id' => (int) $data['mark_author_id'],
					'mark_author_nickname' => $data['mark_author_nickname'],
				];
				$mark_info = array_merge($mark_info, $mark_specials);
				
			}
			$res['mark'] = $mark_info;
		}

		return $res;
	}

}
