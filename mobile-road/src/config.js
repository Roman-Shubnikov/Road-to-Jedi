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
export const POST_TEXTS = {
        prometay: {
          text: "Раздаю отличные ответы в [https://vk.com/jedi_road_app|Road to Jedi] по максимуму — это я от усердия теперь горю или мне наконец-то дали значок Прометея в Профиле RtJ? 🎉\n\n#RoadtoJedi #Прометей",
          image: "photo605436158_457240007"
        },
        verif: {
          text: "Доказал, что достоин, — верифицировал Профиль [https://vk.com/jedi_road_app|Road to Jedi].\n\nА у вас уже есть такая галочка?\n\n#RoadtoJedi #Верификация",
          image: "photo605436158_457240006"
        },
        donut: {
          text: "Поддерживаю любимое сообщество и приложение [https://vk.com/jedi_road_app|Road to Jedi].\n\nПриятно чувствовать себя агентом и выделяться среди остальных ;)\n\n#RoadtoJedi #VKDonut",
          image: "photo605436158_457240005"
        }
      
      }
export const HISTORY_IMAGES = {
        prometay: {
          image: "https://sun9-25.userapi.com/impf/y-48TlRZRKfvy6XPPv60iFFHRA1MVPknRFG8TA/ZgjfvgntI3A.jpg?size=607x1080&quality=96&sign=3bbcb679fce21acee714391359f764bd"
        },
        verif: {
          image: "https://sun9-32.userapi.com/impf/GTxLdOv-QScQqakIoBgM9cKQHLMx53ajTEWJrw/lsWE91Rdf4g.jpg?size=454x807&quality=96&sign=238abb9ba7b1fea3e26e2354c16a65dd"
        },
        donut: {
          image: "https://sun9-32.userapi.com/impf/ZSrMdpua6pPTqA6HYVXjEGm1QHkiPerFPVpBlQ/2q3uSkrkrsk.jpg?size=454x807&quality=96&sign=6d7c6695992142447101ae34ff36ff04"
        }
      }
export const LINK_APP = "https://vk.com/jedi_road_app";
export const CONVERSATION_LINK = "https://vk.me/join/zyWQzsgQ9iw6V2YAfbwiGtuO883rnYhXwAY=";
export const SPECIAL_NORM = 50;
export const GENERATOR_NORM = 200;
export const PUBLIC_STATUS_LIMIT = 140;
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

