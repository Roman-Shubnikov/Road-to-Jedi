<?php

class AccessCheck {
    function __construct() {
        $params = self::getParams();

        $query_params = $params[0];
        $sign_params = $params[1];
        self::check( $query_params, $sign_params );
    }

    public static function getParams() {
        $url = "https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
        $query_params = [];
        $sign_params = [];

        parse_str(parse_url($url, PHP_URL_QUERY), $query_params);
        foreach ($query_params as $name => $value) {
            if (strpos($name, 'vk_') !== 0) {
                continue;
            }
            $sign_params[$name] = $value;
        }

        return [$query_params, $sign_params];
    }

    public static function check( $query_params, $sign_params ) {
        ksort($sign_params);
        $sign_params_query = http_build_query($sign_params);
        $sign = rtrim(strtr(base64_encode(hash_hmac('sha256', $sign_params_query, CONFIG::SECRET_KEY, true)), '+/', '-_'), '=');
        if( $sign !== $query_params['sign'] ) {
            Show::error(4);
        }
    }
}