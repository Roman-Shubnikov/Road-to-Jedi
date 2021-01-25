<?php
class Settings {
    function __construct(DB $Connect, Users $users) {
        $this->Connect = $Connect;
        $this->users = $users;
        $this->settings = [];
        $this->_get();
        if( empty($this->settings) ){
            $this->_register();
            $this->_get();
        }

        $this->valid_values = [
            'public' => 'bool',
            'notify' => 'bool',
            'hide_donut' => 'bool',
        ];

    }

    public function complSettings(string $setting, int $value){
        if(in_array($value, [0,1])) $value = (bool) $value;
        $this->checkValidNameSetting($setting, $value);
        return $this->Connect->query("UPDATE user_settings SET $setting=? WHERE aid=?", [(int)$value, $this->users->id]);
    }
    public function getOneSetting($setting){
        $this->checkValidNameSetting($setting);
        $res = $this->settings[$setting];
        $res = ($res == 0 || $res == 1) ? (bool) $res : $res; 
        return $res;

    }

    private function _get(){
        $res = $this->Connect->db_get("SELECT * FROM user_settings WHERE aid=?", [$this->users->id]);
        $this->settings = $res ? $res[0] : [];
    }
    private function _register(){
        $this->Connect->query("INSERT INTO user_settings (aid) VALUES (?)", [$this->users->id]);
    }

    public function checkValidNameSetting($name, $value=NULL){
        if(!array_key_exists($name, $this->settings)) Show::error(1500, ['name' => $name]);
        if ($value != NULL){
            $type = $this->valid_values[$name];
            $ok_type = TRUE;
            switch( $type ) {
                case 'int':
                    if (!is_numeric($value)) $ok_type = false;
                    break;
                case 'float':
                    if (!is_float($value)) $ok_type = false;
                    break;
                case 'string':
                    if (!is_string($value)) $ok_type = false;
                    break;
                case 'bool':
                    if (!is_bool($value)) $ok_type = false;
                    break;
                case 'intorstr':
                    if (!is_string($value) && !is_numeric($value)) $ok_type = false;
            }
            if($ok_type) return TRUE;
        }else{
            return TRUE;
        }
        return FALSE;
    }
}