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
//     public function get_id_expert($user_id) {
//         $results = $this->DB->get("SELECT idexp FROM experts where idvk=?", [$user_id])[0]['idexp'];
//         return $results;
//     }
//     public function get_id_user_api($user_fetch){
//         if(is_numeric($user_fetch)) {
//             $user_id_done = $user_fetch;
//         } else {
//             $user_fetch = explode("/",str_replace(array("https://", "http://"), "", trim($user_fetch)))[1];
//             try{
//                 $UsersInfo = $this->VK->users()->get(CONFIG::VK_APP_TOKEN, array(
//                     'user_ids' => $user_fetch,
//                 ))[0];
//                 $user_id_done = $UsersInfo['id'];
//             } catch (Exception $e) {
//                 Show::error(0);
//             }
//         }
//         return $user_id_done;
//     }
//     public function check_registration($user_id){
//         /*
//         / return regged,isexp,ismoder,user_id
//         */
//         $user_id = self::get_id_user_api($user_id);
//         $isexp = false;
//         $ismoder = false;
//         $regged = false;
//         if(in_array($user_id, CONFIG::ADMINS)){
//             $isexp = true;
//             $ismoder = true;
//             $regged = true;
//             return [$regged,$isexp,$ismoder,$user_id];
//         }
//         if(self::get_id_expert($user_id)){
//             $isexp = true;
//             $regged = true;
//             return [$regged,$isexp,$ismoder,$user_id];
//         }
//         $info = $this->DB->get("SELECT idvk,access FROM users where idvk=?",[$user_id])[0];
//         if($info['idvk']){
//             $ismoder = (bool) $info['access'];
//             if($ismoder){
//                 $isexp = true;
//             }
//             return [true,$isexp,$ismoder,$user_id];
//         }
//         return [$regged,$isexp,$ismoder,$user_id];
        
//     }
    

}
