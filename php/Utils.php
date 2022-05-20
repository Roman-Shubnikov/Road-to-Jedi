<?php
class Utils {

    function __construct($vk) {
       $this->VK = $vk;
    }
    public static function checkParams( $params, $data ) {
        $newdata = [];
        foreach ( (array) $params as $name => $param ) {
            $required = $param['required'];
            $type = $param['type'];
            $default_value = isset($param['default']) ? $param['default'] : NULL;
            if($required) {
                if(!isset($data[$name])){
                    Show::customError("Один из необходимых параметров не передан", array("pharam" => $name, 'type' => $type));
                }
                
            } else if(!isset($data[$name])) {
                $newdata[$name] = $default_value;
                continue;

            }

            $ok_type = true;

            switch( $type ) {
                case 'int':
                    if (!is_numeric($data[$name])) $ok_type = false;
                    break;
                case 'float':
                    if (!is_float($data[$name])) $ok_type = false;
                    break;
                case 'string':
                    if (!is_string($data[$name])) $ok_type = false;
                    break;
                case 'bool':
                    if (!is_bool($data[$name])) $ok_type = false;
                    break;
                case 'array':
                    if (!is_array($data[$name])) $ok_type = false;
                    break;
                case 'intorstr':
                    if (!is_string($data[$name]) && !is_numeric($data[$name])) $ok_type = false;
            }

            if (!$ok_type) {
                
                Show::error( 2, [$name => $type] );
            }
            $newdata[$name] = $data[$name];
        }
        return $newdata;
    }
    public static function replaceSymbols($text) {
        $text = preg_replace('/"(.*?)"/', '«$1»', $text);
        $text = str_replace("XD", "😆", $text);
        $text = str_replace("--", "—", $text);
        return $text;
    }
    public static function numInSegment($num, $segment) {
        return $num >= $segment[0] && $num <= $segment[1];
    }
}
