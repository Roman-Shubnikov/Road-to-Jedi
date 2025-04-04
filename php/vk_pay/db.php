<?php
class DB_pay {
    public $mysql;
    function __construct()
    {
        $this->mysql;
    }
    private function connect() {
        try{
            $this->mysql = new PDO('mysql:dbname=' . CONFIG::DB_NAME . ';host=' . CONFIG::DB_HOST, 
            CONFIG::DB_USER, 
            CONFIG::DB_PASS, 
            array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8mb4'",
                    PDO::ATTR_PERSISTENT => true
                ));
		} catch (PDOException $e) {
			Show::error(2, false);
		}
    }
    public function db_get( $sql, $placeholders=[]) {
        $this->connect();
        $mysqli = $this->mysql;
        $query = $mysqli->prepare($sql);
        $query->execute($placeholders);
        $response = $query->fetchAll(PDO::FETCH_ASSOC);
        $errors = $mysqli->errorInfo();
        if($errors[1] != NULL){
            Show::error(2, false);
		}
		// if($query->errorInfo()[1]){
		// 	var_dump($query->errorInfo());
		// }
        return $response;
    }


    public function query( $sql, $placeholders=[] ) {
        $this->connect();
        $mysqli = $this->mysql;
        $query = $mysqli->prepare($sql);
        $query->execute($placeholders);
        $errors = $query->errorInfo();
        if($errors[1] != NULL){
            Show::error(2, false);
		}
		try{
			$insert_id = $mysqli->lastInsertId();
		}catch (Exception $e) {
			$insert_id = null;
		}
        return [true, $insert_id];
	}

}



