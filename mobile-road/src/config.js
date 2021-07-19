import React from 'react';
import { Div, FormStatus } from "@vkontakte/vkui";

import { 
    Icon28CancelCircleOutline,
    Icon28BoxHeartOutline,
    Icon28KeyboardOutline,
    Icon28BuildingOutline,
    Icon28LocationMapOutline,
    Icon28UserSquareOutline,
    Icon28BugOutline,
    Icon28MoneyWadOutline,
    Icon28PincodeLockOutline,
    Icon28LaptopOutline,
    Icon28DonateOutline,
    Icon28WorkOutline,
    

} from '@vkontakte/icons';
export const API_URL = "https://xelene.ru/road/php/index.php?";
export const AVATARS_URL = "https://xelene.ru/road/php/images/avatars/";
export const LINKS_VK = { 
    donut_article: "https://vk.com/@jedi_road-unikalnyi-kontent-vk-donut",
    probability_article: "https://vk.com/@team.jedi-glossarik-dlya-specialnyh-agentov?anchor=veroyatnost-otsenivania-otvetov-eto-chto-takoe",
    support_jedi: 'https://vk.me/special_help',
    communuty_jedi: 'https://vk.com/jedi_road',
    fantoms_article: 'https://vk.com/@jedi_road-ohota-na-fantomov-nevidimovichei',
    market_info_article: 'https://vk.com/@jedi_road-sistema-nachisleniya-ballov-i-shop',
    market_info_donut_article: 'https://vk.com/@jedi_road-vk-donut-for-road-to-jedi',

};
export const MESSAGE_NO_VK = (
    <Div>
        <FormStatus 
        header="Внимание! Важная информация" 
        mode="default">
            Сервис не имеет отношения к Администрации ВКонтакте, а также их разработкам.
        </FormStatus>
    </Div>
    );
export const LINK_APP = "https://vk.com/jedi_road_app";
export const CONVERSATION_LINK = "https://vk.me/join/zyWQzsgQ9iw6V2YAfbwiGtuO883rnYhXwAY=";
export const SPECIAL_NORM = 50;
export const GENERATOR_NORM = 200;
export const PERMISSIONS = {
    user: -1,
    agent: 0,
    special: 1,
    admin: 20,
};

export const JediIcons28 = {
    0: Icon28CancelCircleOutline,
    1: Icon28BoxHeartOutline,
    2: Icon28KeyboardOutline,
    3: Icon28BuildingOutline,
    4: Icon28LocationMapOutline,
    5: Icon28UserSquareOutline,
    6: Icon28BugOutline,
    7: Icon28DonateOutline,
    8: Icon28MoneyWadOutline,
    9: Icon28LaptopOutline,
    10: Icon28PincodeLockOutline,
    11: Icon28WorkOutline,

    
    

}

