<?php
require('../php/vkapi.php');
require('../php/Utils/config.php');
$found = false;
$new_author = NULL;
$deactivated = NULL;
while (!$found) {
    $authors = [];
    for($i=1;$i<=10;$i++) {
        $authors[] = rand(1000, 659999999);
    }
    $vk = new VKApi();
    $info = $vk->users_get($authors);
    
    foreach($info as $author) {
        if($new_author && $deactivated) {
            $found = true;
            break;
        }
        if(!isset($author['deactivated'])) {
            $new_author = $author['id'];
        } else {
            $deactivated = $author['id'];
        }
    }
}

