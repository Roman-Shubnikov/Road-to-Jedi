<?php
class Reports {
    protected $Connect;
    protected $user = null;
    protected $account;


	function __construct( Users $user, DB $Connect, Account $account ) {
        $this->users = $user;
        $this->Connect = $Connect;
        $this->account = $account;
        $this->reasons = [
            1 => 'Оскорбление',
            2 => 'Порнография',
            3 => 'Введение в заблуждение',
            4 => 'Реклама',
            5 => 'Вредоносные ссылки',
            6 => 'Сообщение не по теме',
            7 => 'Издевательство',
            8 => 'Другое',
        ];
        $this->types = [1,2,3,4];
    }
    

    
    public function get($count, $offset){
        if ( $this->users->info['special'] < 2 ) {
			Show::error(403);
		}
		$res = $this->Connect->db_get(
			"SELECT id, aid, vk_id, type, comment, time, id_reporting, vk_id_reporting, material_id, name, materials
			FROM reports 
			ORDER BY time DESC LIMIT $offset, $count"
            );
		$out = [];
		foreach($res as $val){
            $out[] = ['id' => (int)$val['id'], 
                    'aid' => (int)$val['aid'], 
                    'vk_id' => (int)$val['vk_id'], 
                    'type' => (int)$val['type'], 
                    'comment' => (string) $val['comment'], 
                    'time' => (int)$val['time'],
                    'id_reporting' => (int)$val['id_reporting'],
                    'vk_id_reporting' => (int)$val['vk_id_reporting'],
                    'material_id' => (int)$val['material_id'],
                    'name' => (int)$val['name'],
                    'materials' => (string)$val['materials'],
        ];
        }
		return $out;
    }
    public function approve($id_request){
        if ( $this->users->info['special'] < 2 ) Show::error(403);

        $info_req = $this->Connect->db_get(
			"SELECT id, aid, vk_id, type, comment, time, id_reporting, name, material_id
            FROM reports WHERE id=?", [$id_request]);
        if(!$info_req) Show::error(404);
        
        $info_req = $info_req[0];
        $count_bans = $this->account->getBansUser($info_req['id_reporting']);

        $this->Connect->query("DELETE FROM reports WHERE id_reporting=?", [$info_req['id_reporting']]);
        $count_bans = $count_bans[0]['COUNT(*)'];
        $reason = $this->reasons[$info_req['name']];
        if($count_bans <= 10){
            if($count_bans == 0){
                $timeban = 600; // 10min
                $fullreason = "Вы были забанены по причине \"$reason\". Будьте внимательны, срок банов может увеличиваться.";
            }elseif($count_bans == 1){
                $timeban = 3600; // 1h
                $fullreason = "Вы были забанены по причине \"$reason\". Это уже не первый раз когда мы вас поймали! Будьте внимательны";
            }elseif($count_bans == 2){
                $timeban = 43200; // 12h
                $fullreason = "Вы были забанены по причине \"$reason\". Ваше поведение нам очень не нравится";
            }elseif($count_bans >= 3 && $count_bans <=7){
                $timeban = 172800; // 48h
                $fullreason = "Вы были забанены по причине \"$reason\". Мы увидели ваши частые нарушения, постарайтесь больше не нарушать правил. Иначе в будующем нам придётся с вами попрощаться";
            }elseif($count_bans >= 8){
                $timeban = 604800; //7d/week
                $fullreason = "Вы были забанены по причине \"$reason\". Астанавитесь";
            }
        }else{
            $timeban = 0;
            $fullreason = "Вы были забанены по причине \"$reason\". К сожелению, теперь, мы сможем разбанить вас только в исключительном случае :-(. Попробуйте связаться с нами";
        }
        $type = $info_req['type'];
        $material_id = $info_req['material_id'];
        if($type == 1) $this->Connect->query("UPDATE messages SET comment=NULL,comment_author_id=NULL WHERE id=?", [$material_id]);
        if($type == 3) $this->Connect->query("DELETE FROM messages WHERE id=?", [$material_id]);
        if($type == 4) $this->Connect->query("DELETE FROM queue_quest WHERE id=?", [$material_id]);
        Show::response($this->account->Ban_User($info_req['id_reporting'], $fullreason, $timeban));
    }

    public function deny($id_request){
        if ( $this->users->info['special'] < 2 ) {
			Show::error(403);
        }
        $info_req = $this->Connect->db_get(
			"SELECT id, aid, vk_id, type, comment, time, material_id, name
            FROM reports WHERE id=?", [$id_request]);
        if(!$info_req) Show::error(404);

        $this->Connect->query("DELETE FROM reports WHERE type=? AND material_id=? AND name=?", [$info_req[0]['type'], $info_req[0]['material_id'], $info_req[0]['name']]);
        Show::response($this->Connect->query("DELETE FROM reports WHERE id=?", [$id_request]));
    }

    public function send(int $type, int $name, int $id, string $comment){
        // type:
        // 1 - комментарий спец. агента
        // 2 - Профиль агентов
        // 3 - Ответы агентов
        // 4 - Вопросы от генераторов

        // name - Имя жалобы (Оскорбление, Мат, Реклама ....)
        // 1 - Оскорбление
        // 2 - Порнография
        // 3 - Введение в заблуждение
        // 4 - Реклама
        // 5 - Вредоносные ссылки
        // 6 - Сообщение не по теме
        // 7 - Издевательство
        // 8 - Другое
        // 
        // comment - Дополнительный комментарий модератору
        if($name == 8 && !(bool) $comment) Show::error(1202);
        if($name < 1 || $name > 8) Show::error(1201);

        $comment = ($comment != '') ? $comment : NULL;

        $response_user = [FALSE];

        if($type == 1){
            $shortinfo = $this->Connect->db_get("SELECT id,ticket_id,text,comment,comment_author_id FROM messages WHERE id=?", [$id]);
            if(!$shortinfo) Show::error(404);

            if($this->checkDuplicates($this->users->vk_id, $type, $shortinfo[0]['comment_author_id'], $id )) Show::error(1200);
            if($shortinfo[0]['comment_author_id'] == -1) Show::error(1203);
            $report_user_info = $this->Connect->db_get("SELECT id,vk_user_id FROM users WHERE id=?", [$shortinfo[0]['comment_author_id']]);
            
            $response_user = $this->Connect->query("INSERT INTO reports 
            (aid, vk_id, type, comment, time, id_reporting, vk_id_reporting, material_id, name, materials) 
            VALUES (?,?,?,?,?,?,?,?,?,?)",
            [$this->users->id, 
            $this->users->vk_id, 
            $type, 
            $comment, 
            time(), 
            $shortinfo[0]['comment_author_id'], 
            $report_user_info[0]['vk_user_id'], 
            $id, 
            $name, 
            "Сообщение:\n" . $shortinfo[0]['text'] . " Комментарий:\n" . $shortinfo[0]['comment']]);
            
        }
        
        if($type == 2){
            $user_info = $this->Connect->db_get("SELECT id,vk_user_id,publicStatus FROM users WHERE id=?", [$id]);
            if(!$user_info) Show::error(404);
                if($this->checkDuplicates($this->users->vk_id, $type, $user_info[0]['id'], $id)) Show::error(1200);
                $report_user_info = $this->Connect->db_get("SELECT id,vk_user_id FROM users WHERE id=?", [$user_info[0]['id']]);

                $response_user = $this->Connect->query("INSERT INTO reports 
                (aid, vk_id, type, comment, time, id_reporting, vk_id_reporting, material_id, name, materials) 
                VALUES (?,?,?,?,?,?,?,?,?,?)",
                [$this->users->id, 
                $this->users->vk_id, 
                $type, 
                $comment, 
                time(), 
                $user_info[0]['id'],
                $report_user_info[0]['vk_user_id'], 
                $id, 
                $name,
                $user_info[0]['publicStatus'],
                ]);
        }
        if($type == 3){
            $shortinfo = $this->Connect->db_get("SELECT id,author_id,text FROM messages WHERE id=?", [$id]);
            if(!$shortinfo) Show::error(404);
            if($this->checkDuplicates($this->users->vk_id, $type, $shortinfo[0]['author_id'], $id)) Show::error(1200);
            $report_user_info = $this->Connect->db_get("SELECT id,vk_user_id FROM users WHERE id=?", [$shortinfo[0]['author_id']]);

            $response_user = $this->Connect->query("INSERT INTO reports 
            (aid, vk_id, type, comment, time, id_reporting, vk_id_reporting, material_id, name, materials) 
            VALUES (?,?,?,?,?,?,?,?,?,?)",
            [$this->users->id, 
            $this->users->vk_id, 
            $type, 
            $comment, 
            time(), 
            $shortinfo[0]['author_id'], 
            $report_user_info[0]['vk_user_id'], 
            $id, 
            $name, 
            $shortinfo[0]['text']]);
        
        }
        if($type == 4){
            $res = $this->Connect->db_get("SELECT author_id,time,title,description FROM queue_quest WHERE id=?", [$id]);
            if(!$res) Show::error(404);
            
            $report_user_info = $this->Connect->db_get("SELECT id,vk_user_id FROM users WHERE vk_user_id=?", [$res[0]['author_id']]);
            if($this->checkDuplicates($this->users->vk_id, $type, $report_user_info[0]['id'], $id)) Show::error(1200);
            if(!$report_user_info) Show::error(40);

            $response_user = $this->Connect->query("INSERT INTO reports 
            (aid, vk_id, type, comment, time, id_reporting, vk_id_reporting, material_id, name, materials) 
            VALUES (?,?,?,?,?,?,?,?,?,?)",
            [$this->users->id, 
            $this->users->vk_id, 
            $type,
            $comment, 
            time(), 
            $report_user_info[0]['id'],
            $report_user_info[0]['vk_user_id'],
            $id,  
            $name, 
            $res[0]['title'] . "\n\n" . $res[0]['description'],
            ]);
        }
        Show::response($response_user);
        
        
    }

    public function checkDuplicates($vk_id, $type, $id_reporting, $material_id){
        return $this->Connect->db_get("SELECT id FROM reports WHERE vk_id=? and type=? and id_reporting=? and material_id=?", 
        [$vk_id, 
        $type, 
        $id_reporting, 
        $material_id ]);
    }
}