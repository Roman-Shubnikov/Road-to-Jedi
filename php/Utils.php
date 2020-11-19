<?php

class Utils {
    private $VK;
    private $DB;

    public function __construct($vk) {
       $this->VK = $vk;
    //    $this->DB = new DB();
    }
    public static function checkParams( $params ) {
        $newdata = [];
        foreach ( (array) $params as $name => $param ) {
            $required = $param['required'];
            $type = $param['type'];
            $default_value = isset($param['default']) ? $param['default'] : NULL;
            if($required) {
                if(!isset($_REQUEST[$name])){
                    Show::customError("Один из необходимых параметров не передан", array("pharam" => $name, 'type' => $type));
                }
                
            } else if(!isset($data[$name])) {
                $newdata[$name] = $default_value;
                continue;

            }

            $ok_type = true;

            switch( $type ) {
                case 'int':
                    if (!is_numeric($_REQUEST[$name])) $ok_type = false;
                    break;
                case 'float':
                    if (!is_float($_REQUEST[$name])) $ok_type = false;
                    break;
                case 'string':
                    if (!is_string($_REQUEST[$name])) $ok_type = false;
                    break;
                case 'bool':
                    if (!is_bool($_REQUEST[$name])) $ok_type = false;
                    break;
                case 'intorstr':
                    if (!is_string($_REQUEST[$name]) && !is_numeric($_REQUEST[$name])) $ok_type = false;
            }

            if (!$ok_type) {
                
                Show::error( 2, [$name => $type] );
            }
            $newdata[$name] = $_REQUEST[$name];
        }
        return $newdata;
    }
}
