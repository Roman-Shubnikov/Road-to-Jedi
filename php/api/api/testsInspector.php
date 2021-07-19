<?php

function sort_by_num($a, $b) {
    if((int)$a['question_num'] == (int)$b['question_num']) return 0;
    return ((int)$a['question_num'] >= (int)$b['question_num']) ? 1 : -1;
}

class TestsInspector {
    protected $Connect;
    protected $user = null;


	function __construct(Users $user, DB $Connect) {
        $this->users = $user;
        $this->Connect = $Connect;

    }

    public function startTest(int $testId) {
        $queue = $this->createQueue($testId);
        return $queue;
    }
    public function reasonGenerator(bool $passed, $reason) {
        return ['passed' => $passed, 'reason' => $reason];
    }
    public function testUpdater($vk_id, $queue_id, $test_id, $passed) {
        $grant = ($passed) ? 1 : -1;
        $this->Connect->query("UPDATE tests_queue SET granted=?,time_end=? WHERE id=?", [$grant, time(), $queue_id]);
        if($passed) {
            switch($test_id) {
                case 1:
                    $this->Connect->query("UPDATE users SET permissions=0 WHERE vk_user_id=?", [$vk_id]);
                    break;
            }
        }
    }
    public function checkAnswers($answers) {
        $curr_time = time();
        $answers = array_combine(array_map('intval', array_keys($answers)), array_map('intval', array_values($answers)));
        $id_questions = array_keys($answers);
        $activeTest = $this->checkActiveTest($this->users->vk_id);
        $test_info = $this->getTestInfo((int)$activeTest['test_id']);
        
        if($curr_time - $activeTest['time_start'] > $test_info['time_test']) {
            $this->testUpdater($this->users->vk_id, (int)$activeTest['id'], (int)$activeTest['test_id'], false);
            return $this->reasonGenerator(false, 'Время истекло');
        }

        $questions = array_map('intval', explode(';', $activeTest['queue']));
        if(count($id_questions) != count($questions)) Show::error(1703);
        foreach($questions as $question) {
            if(!in_array($question, $id_questions)) Show::error(1704);
        }

        $true_answers = $this->Connect->db_get(
            "SELECT id,question_id
            FROM tests_answers
            WHERE is_true=1 AND question_id IN (" . implode(',', $id_questions) . ")"
        );
        $mistakes = 0;
        foreach($true_answers as $true_answ) {
            $user_answer = $answers[(int)$true_answ['question_id']];
            if((int)$true_answ['id'] != $user_answer) {
                $mistakes += 1;
            }
        }
        $max_mistakes = ((int)($test_info['count_questions'] * CONFIG::MISTAKES_PERSENT));
        if($mistakes > $max_mistakes) {
            $this->testUpdater($this->users->vk_id, (int)$activeTest['id'], (int)$activeTest['test_id'], false);
            return $this->reasonGenerator(false, "Слишком много ошибок в тесте ($mistakes)");
        }
        $this->testUpdater($this->users->vk_id, (int)$activeTest['id'], (int)$activeTest['test_id'], true);
        return $this->reasonGenerator(true, 'Вы успешно прошли тест и стали агентом. Сбросьте кеш приложения, чтобы получить новые права');
    }
    

    private function createQueue(int $testId) {
        $test_info = $this->getTestInfo($testId);
        if(!$test_info) Show::error(1700);;
        $res = $this->Connect->db_get("SELECT id,test_id,granted,time_end FROM tests_queue WHERE vk_user_id=? and test_id=?", [$this->users->vk_id, $testId]);
        if($res){
            $onTransition = [false, 0];
            $times_fail = [];
            foreach($res as $test) {
                $id = $test['id'];
                $test_id = $test['test_id'];
                $granted = $test['granted'];
                $time_end = $test['time_end'];
                if($test_id == $testId && $granted == 1) {
                    Show::error(1701);
                }
                if($granted == 0) {
                    $onTransition = [true, (int)$id];
                    break;
                }

                $times_fail[] = (int)$time_end;
            }
            if(!$onTransition[0]){
                if(!empty($times_fail)){
                    $time_last = time() - max($times_fail);
                    if($time_last < CONFIG::TIME_LIMITER) {
                        $time_last = CONFIG::TIME_LIMITER - $time_last;
                        $days = floor($time_last / 86400);
                        $hours = floor($time_last % 86400 / 3600);
                        $minutes = floor($time_last % 86400 % 3600 / 60);
                        $seconds = floor($time_last % 86400 % 3600 % 60);
                        $time_humany = $days . ' дн. ' . $hours . " ч. " . $minutes . ' мин. ' . $seconds . ' сек.';
                        Show::customError("Ещё не прошло достаточно времени с прохождения предыдущего теста. Времени осталось " . $time_humany);
                    }
                }
                
            } else {
                $this->Connect->query("UPDATE tests_queue SET granted=-1,time_end=? WHERE vk_user_id=? AND id=?", 
                [time(), $this->users->vk_id, $onTransition[1]]);
            }
            
        }
        $count_variants = [];
        $count_questions_in_test = $test_info['count_questions'];
        for($i=1;$i <= $count_questions_in_test;$i++){
            $count_variants[] = (int)$this->Connect->db_get("SELECT COUNT(*) as count_q FROM tests_questions_titles WHERE test_id=? and question_num=?", [$testId, $i])[0]['count_q'];
        }
        $questions = [];
        for($i=0,$c=1;$i < $count_questions_in_test;$i++,$c++) {
            $max_rand = ($count_variants[$i] - 1 < 0) ? 0 : $count_variants[$i] - 1;
            $questions[] = $this->Connect->db_get(
            "SELECT question_id,question_num,title
            FROM tests_questions_titles
            WHERE test_id=? AND question_num=? 
            LIMIT ". rand(0, $max_rand) .",1", [$testId, $c])[0];
        }
        $answers = [];
        foreach($questions as $quest){
            $answers[(int)$quest['question_id']] = $this->Connect->db_get(
                "SELECT id,question_id,is_true,answer
                FROM tests_answers 
                WHERE question_id=?",
                [$quest['question_id']]
            );
            
        }
        $questions_resp = [];
        // usort($questions, "sort_by_num");
        foreach($questions as $quest){
            $answers_question = [];
            foreach($answers[(int)$quest['question_id']] as $answer_in_q){
                $answers_question[] = [
                    "id" => $answer_in_q['id'],
                    "name" => $answer_in_q['answer']
                ];
            }
            shuffle($answers_question);
            $questions_resp[] = [
                "id" => $quest['question_id'],
                "question" => $quest['title'],
                "variants" => $answers_question,
            ];
        }
        $questions_queue = implode(';', array_keys($answers));
        $response = [
            "test_id" => $testId,
            "questions" => $questions_resp,
            "time_test" => (int)$test_info['time_test'],
        ];
        
        $this->Connect->query("INSERT INTO tests_queue (vk_user_id, test_id, queue, time_start) VALUES (?,?,?,?)", [$this->users->vk_id, $testId, $questions_queue, time()]);

        return $response;
    }
    public function getTestInfo(int $testId) {
        $res = $this->Connect->db_get("SELECT id,name,count_questions,time_test FROM tests_info WHERE id=?", [$testId]);
        return ($res) ? $res[0] : NULL;
    }
    public function checkActiveTest($vk_id) {
        $res = $this->Connect->db_get("SELECT id,vk_user_id, test_id, queue, time_start FROM tests_queue WHERE vk_user_id=? ORDER BY time_start DESC LIMIT 1", [$vk_id]);
        return ($res) ? $res[0] : NULL;
    }
}
