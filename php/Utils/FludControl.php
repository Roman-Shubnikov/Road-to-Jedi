<?php

class FludControl {
    public function __construct() {
        $time = time();

        if (!$_SESSION['flood_control']) {
            $_SESSION['flood_control'] = [
                'count' => 1,
                'last' => $time
            ];

            return true;
        }

        if(isset($_SESSION['flood_control']['until'])){
            if ($time < $_SESSION['flood_control']['until']) {
                self::error( $_SESSION['flood_control']['until'] - time());
            }
        }

        if (isset( $_SESSION['flood_control']['until'] ) && $time > $_SESSION['flood_control']['until']) {
            unset( $_SESSION['flood_control']['until'] );
            $_SESSION['flood_control']['count'] = 1;

            return true;
        }


        if ($_SESSION['flood_control']['count'] + 1 > CONFIG::FLOOD_CONTROL) {
            if (!isset($_SESSION['flood_control']['until'])) {
                $_SESSION['flood_control']['until'] = $time + CONFIG::FLOOD_CONTROL_BAN;
            }

            // self::error($time + CONFIG::FLOOD_CONTROL_BAN - time());
        }


        if ($_SESSION['flood_control']['last'] !== $time) {
            $_SESSION['flood_control']['count'] = 1;
            $_SESSION['flood_control']['last'] = $time;

            return true;
        }


        $_SESSION['flood_control']['count']++;
        $_SESSION['flood_control']['last'] = $time;

        return true;
    }

    private static function error( $time ) {
        Show::customError("Вы превысили лимит запросов, осталось подождать: $time", []);
    }
}