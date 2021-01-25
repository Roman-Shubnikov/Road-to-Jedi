<?php

class SystemNotifications {
	
	protected $Connect;


	function __construct( DB $Connect ) {
		$this->Connect = $Connect;
	}

	public function send( int $owner_id, string $text, $image=null, array $object, string $comment=null ) {
		// $owner_id - id агента НЕ vk_id
		// $text - Текст в уведомлении который увидит пользователь
		// $image - Чаще всего требуется для money_transfer_send | money_transfer_give чтобы показать аватарку переводящего
		// $object - Ниже
		// $comment - Чаще всего требуется для money_transfer_send | money_transfer_give чтобы показать коментарий к переводу
		// Types
		// В object обязательно нужно передать массив где 2 поля "object" и "type" 
		// В "object" передать номер тикета (по смыслу уведомления)
		// В "type" передать одно на выбор приведённое ниже

		// add_good_answer - ответ оценён положительно
		// add_bad_answer - ответ оценён отрицательно
		// money_transfer_send - Вы отдали монетки пользователю
		// money_transfer_give - Монетки переведены пользователю
		// reply_approve - ответ одобрен
		// comment_add - к ответу добавлен комментарий
		// donut_add - выдан донат
		// donut_del - забрали донат
		// verification_send - подал заявку на верификацию
		// verification_approve - заявка на верификацию одобрена
		// verification_demiss - заявка на верификацию отклонена
		// report_approve - Мы рассмотрели жалобу....
		
		
		$data = [
			'owner_id' => $owner_id,
			'text' => $text,
			'image' => $image,
			'time' => time(),
			'object_type' => $object['type'],
			'object' => $object['object']
		];
		$res = $this->Connect->query("INSERT INTO notifications (owner_id,text,image,time,object_type,object, comment) VALUES (?,?,?,?,?,?,?)", [$owner_id,$text,$image,time(),$object['type'],$object['object'],$comment]);

		$sql = "SELECT users.vk_user_id, user_settings.notify FROM users 
				LEFT JOIN user_settings ON users.id=user_settings.aid
				WHERE users.id=?";
		$user = $this->Connect->db_get( $sql, [$owner_id] )[0];
		$ticket_id = $object['object'];
		$object_lol = $ticket_id != 0 ? "https://vk.com/app7409818#ticket_id={$ticket_id}" : '';
		
		

		if( $user['notify'] ) {
			$data = [
				'user_id' => $user['vk_user_id'],
				'random_id' => 0,
				'message' => "$text\n$object_lol",
				'dont_parse_links' => 1,
				'access_token' =>'9e1740c170fe79333a5512e6513f6036ba361fcc0dead0588f0a320e53831679b9bc7adc80208f370e11a',
				'v' => '5.120'
			];

			$query = http_build_query( $data );
			$url = "https://api.vk.com/method/messages.send?{$query}";
			file_get_contents( $url );

		}

		$id = $res[1];

		return [
			'notification_id' => $id
		];
	}
}


class Notifications {
	protected $user = [];

	function __construct( Users $user,DB $Connect ) {
		$this->user = $user;
		$this->Connect = $Connect;
	}
	public function approve() {
		return $this->Connect->query("UPDATE users SET noti=1 WHERE vk_user_id=?", [$this->user->vk_id])[0];
	}
	public function demiss() {
		return $this->Connect->query("UPDATE users SET noti=0 WHERE vk_user_id=?", [$this->user->vk_id])[0];
	}
	public function getCount() {
		$id = $this->user->id;

		$sql = "SELECT COUNT( id ) as count FROM notifications WHERE owner_id=? AND delivered = 0";
		$res = $this->Connect->db_get( $sql, [$id] )[0];

		return (int) $res['count'];
	}

	public function get() {
		$uid = $this->user->id;

		$sql = "SELECT * FROM notifications WHERE owner_id=? ORDER BY id DESC";
		$res = $this->Connect->db_get( $sql, [$uid] );

		$result = [];

		foreach ( $res as $item ) {
			$result[] = $this->_formateType( $item );
		}

		return $result;
	}

	public function markAsViewed() {
		$uid = $this->user->id;
		return $this->Connect->query("UPDATE notifications SET delivered=1 WHERE owner_id=?", [$uid])[0];
	}

	private function _formateType( array $data ) {
		$res = [
			'id' => (int) $data['id'],
			'time' => (int) $data['time'],
			'text' => $data['text'],
			'image' => $data['image'],
			'object' => [
				'type' => $data['object_type'],
				'object' => $data['object'] 
			],
			'comment' => $data['comment']
		];

		return $res;
	}
}