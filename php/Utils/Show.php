<?php
class Show {
    private static function ok( $object ) {
        // echo json_encode($object, JSON_UNESCAPED_UNICODE);
        echo json_encode($object, JSON_PRETTY_PRINT);

        
    }

    public static function response( $object = [] ) {
        $response = [
            'result' => true,
        ];
        $response['response'] = $object;

        self::ok($response);
        exit;
    }

    public static function error( $number, $json=[] ) {
        self::ok([
            'result' => false,
            'error' => [
                'error_code' => $number,
                'message' => CONFIG::ERRORS[$number],
                'error_obj' => $json
            ]
        ]);
        exit;
    }

    public static function customError( $text, $json=[] ) {
        self::ok([
            'result' => false,
            'error' => [
                'error_code' => 0,
                'message' => $text,
                'error_obj' => $json
            ]
        ]);
        exit;
    }
}