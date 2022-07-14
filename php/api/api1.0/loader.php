<?php
require "users.php";
require "account.php";
require "tickets.php";
require "notifications.php";
require "promocodes.php";
require "reports.php";
require "folowers.php";
require "recommendations.php";
require "settings.php";
require "levels.php";
require "shop.php";
require "faq.php";
require "testsInspector.php";


$Connect = new DB();
$users = new Users($user_id, $Connect);
$settings = new Settings($Connect, $users);
$notifications = new Notifications($users, $Connect);
$sysnotifications = new SystemNotifications($Connect);
$account = new Account($users, $Connect, $sysnotifications);
$tickets = new Tickets($users, $Connect, $sysnotifications);
$promocodes = new Promocodes($users, $Connect, $sysnotifications);
$reports = new Reports($users, $Connect, $account);
$followers = new Followers($users, $Connect);
$recommended = new Recomendations($users, $Connect, $followers);
$levels = new Levels($users, $Connect);
$faq = new Faq($Connect,$users);
$testsInspector = new TestsInspector($users, $Connect);
