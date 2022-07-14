<?php
class Faq {
    function __construct(DB $Connect, Users $Users) {
        $this->users = $Users;
		$this->Connect = $Connect;
    }

    public function getCategories() {
        $info = $this->Connect->db_get('SELECT id,title,icon_id,color FROM faq_categories');
        if(!$info) return [[], []];
        $res = [];
        $category_ids = [];
        foreach($info as $val){
            $res[] = [
                'id' => (int) $val['id'],
                'title' => (string) $val['title'],
                'icon_id' => (int) $val['icon_id'],
                'color' => (string) $val['color']
            ];
            $category_ids[] = (int) $val['id'];
        }
        return [$res, $category_ids];
    }
    public function getQuestionsByCategory($category, $offset, $count) {
        $category_ids = $this->getCategories()[1];
        if(!in_array($category, $category_ids)) Show::error(1602);
        $info = $this->Connect->db_get(
            "SELECT 
            id,
            category_id,
            question
            FROM faq_questions 
            WHERE category_id=?
            LIMIT $offset, $count", [$category]);
        if(!$info) return [];

        $res = [];
        foreach($info as $val){
            $res[] = [
                'id' => (int) $val['id'],
                'category_id' => (int) $val['category_id'],
                'question' => (string) $val['question'],
            ];
        }
        return $res;
    }
    public function getQuestionById($question_id) {
        $info = $this->Connect->db_get(
            "SELECT 
            id,
            category_id,
            question,
            answer,
            ismarkable,
            support_need 
            FROM faq_questions 
            WHERE id=?", [$question_id]);

        if(!$info) Show::error(404);
        $info = $info[0];
        $res = [
            'id' => (int) $info['id'],
            'category_id' => (int) $info['category_id'],
            'question' => (string) $info['question'],
            'answer' => (string) $info['answer'],
            'ismarkable' => (bool) $info['ismarkable'],
            'support_need' => (bool) $info['support_need'],
        ];
        return $res;
    }

    public function getQuestionsByName($name) {
        if(!(mb_strlen($name) > 0)) Show::error(9);
        $info = $this->Connect->db_get(
            "SELECT 
            id,
            category_id,
            question,
            answer,
            ismarkable,
            support_need 
            FROM faq_questions 
            WHERE question LIKE '%$name%' LIMIT 200");

        if(!$info) return [];
        $res = [];
        foreach($info as $val){
            $res[] = [
                'id' => (int) $val['id'],
                'category_id' => (int) $val['category_id'],
                'question' => (string) $val['question'],
                'answer' => (string) $val['answer'],
                'ismarkable' => (bool) $val['ismarkable'],
                'support_need' => (bool) $val['support_need'],
            ];
        }
        return $res;
    }
    public function addCategory($title, $icon_id, $color) {
        $lenTitle = mb_strlen($title);
        if($lenTitle == 0) Show::error(1605);
        if (!preg_match(CONFIG::REGEXP_VALID_HEX_COLOR, $color)) {
            Show::error(1600);
        }
        if($lenTitle >= CONFIG::MAX_FAQ_CATEGORY_LEN) Show::error(1601);
        return $this->Connect->query("INSERT INTO faq_categories (title,time,icon_id,color) VALUES (?,?,?,?)", [$title, time(), $icon_id, $color]);
    }
    public function addQuestion($category_id, $question, $answer, $ismarkable, $support_need) {
        $lenQuestion = mb_strlen($question);
        $lenAnswer = mb_strlen($answer);
        if($lenAnswer == 0 || $lenQuestion == 0) Show::error(1605);
        if($lenQuestion >= CONFIG::MAX_FAQ_QUESTION_LEN) Show::error(1604);
        if($lenAnswer >= CONFIG::MAX_FAQ_ANSWER_LEN) Show::error(1603);
        return $this->Connect->query("INSERT INTO faq_questions (category_id,question,time,answer,ismarkable,support_need) VALUES (?,?,?,?,?,?)", [$category_id, $question, time(), $answer, $ismarkable, $support_need]);

    }
    public function delQuestion($id){
        return $this->Connect->query("DELETE FROM faq_questions WHERE id=?", [$id]);
    }
    public function delCategory($id){
        return $this->Connect->query("DELETE FROM faq_categories WHERE id=?", [$id]);
    }
}