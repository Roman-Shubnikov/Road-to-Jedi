<?php
require("Utils/config.php");
require("Utils/Show.php");
require("Utils/AccessCheck.php");
require("Utils/FludControl.php");
require("Utils.php");
require 'api/db.php';
// require 'api/func.php';
require 'vkapi.php';

// set_exception_handler( 'exceptionerror' );

require 'api/api/users.php';
require 'api/api/account.php';
require 'api/api/tickets.php';
require 'api/api/notifications.php';


$id = 'Ликвидатор';
$check_id = db_get("SELECT id FROM users WHERE id= '$id' or nickname = '$id'");
var_dump($check_id);
if( count($check_id) == 0 ) {
}