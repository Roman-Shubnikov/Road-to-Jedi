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
export const LINK_APP = 'https://vk.com/trainingapp';
export const AVATARS_URL = "https://xelene.ru/road/php/images/avatars/";
export const LINKS_VK = { 
    donut_article: "https://vk.com/@jedi_road-unikalnyi-kontent-vk-donut",
    probability_article: "https://vk.com/@sartj-glossarii?anchor=veroyatnost-otsenivania-otvetov-eto-chto-takoe",
    support_jedi: 'https://vk.me/special_help',
    communuty_jedi: 'https://vk.com/jedi_road',
    fantoms_article: 'https://vk.com/@jedi_road-ohota-na-fantomov-nevidimovichei',
    market_info_article: 'https://vk.com/@jedi_road-sistema-nachisleniya-ballov-i-shop',
    market_info_donut_article: 'https://vk.com/@jedi_road-vk-donut-for-road-to-jedi',
    verification: 'https://vk.com/@jedi_road-chto-takoe-verifikaciya-i-kak-ee-poluchit-galochku',

};
export const MESSAGE_NO_VK = (
    <Div>
        <FormStatus 
        mode="default">
            Сервис не относится на прямую к социальной сети ВКонтакте.
        </FormStatus>
    </Div>
    );
export const POST_TEXTS = {
        prometay: {
          text: `Раздаю отличные ответы в [${LINK_APP}|VK Агенты] по максимуму — это я от усердия теперь горю или мне наконец-то дали значок Прометея в Профиле RtJ? 🎉\n\n#RoadtoJedi #Прометей`,
          image: "photo605436158_457240007"
        },
        verif: {
          text: `Доказал, что достоин, — верифицировал Профиль [${LINK_APP}|VK Агенты].\n\nА у вас уже есть такая галочка?\n\n#RoadtoJedi #Верификация`,
          image: "photo605436158_457240006"
        },
        donut: {
          text: `Поддерживаю любимое сообщество и приложение [${LINK_APP}|VK Агенты].\n\nПриятно чувствовать себя агентом и выделяться среди остальных ;)\n\n#RoadtoJedi #VKDonut`,
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
export const blueBackground = {
  backgroundColor: 'var(--accent)'
};
export const CONVERSATION_LINK = "https://vk.me/join/eEvxpRk0UBwLO0iy02xy0bJaMCevCEZu_rU=";
export const SPEC_COURCE_LINKS = {
  cource: "https://vk.com/@sartj-course",
  conversation: 'https://vk.me/join/yzDBN6UvFS72yXvKBNqUkXZMilz/6NJ/Arg=',
  community: 'https://vk.com/club212134873',
  messages_help: 'https://vk.com/gim201542328',

};
export const SPECIAL_NORM = 50;
export const GENERATOR_NORM = 200;
export const PUBLIC_STATUS_LIMIT = 70;
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

export const viewsStructure = {
  Questions: {
    navName: 'Questions',
    name: 'Вопросы',
    panels: {
      homepanel: 'questions',
    }
  },
  Advice: {
    navName: 'Advice',
    name: 'Обзор',
    panels: {
      homepanel: 'advice',

    }
  },
  Top: {
    navName: 'Top',
    name: 'Статистика',
    panels: {
      homepanel: 'top',
    }
  },
  Moderation: {
    navName: 'Moderation',
    name: 'Управление',
    panels: {
      homepanel: 'questions',
    }
  },
  Profile: {
    navName: 'Profile',
    name: 'Профиль',
    panels: {
      homepanel: 'profile',
    }
  },
  Disconnect: {
    navName: 'disconnect',
    name: 'Ошибка сети',
    panels: {
      homepanel: 'load',
    }
  }
}
export const IS_MOBILE = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));


// name_user - Автор тикета
// agent_uni_name - имя агента в зависимости от ника и id
// agent_uni_name_full - имя агента в зависимости от ника и id если нет ника то полностью агент поддержки ...
// agent_id - id агента
// text - текущее значение инпута
const STANDART_GREETING = 'Здравствуйте, %name_user%!';
const STANDART_GREETING_2 = 'Приветствую, %name_user%!';
const STANDART_GREETING_3 = 'Доброго времени суток, %name_user%!';
const STANDART_GREETING_4 = 'Приветствуем, %name_user%!';
export const PRESETS_MESSAGES = [
  STANDART_GREETING + '\n\n%text%\n\nВсегда с Вами,%agent_uni_name%\nПоддержка ВКонтакте',
  STANDART_GREETING + '\n\n%text%\n\nС уважением,\nКоманда Поддержки ВКонтакте',
  STANDART_GREETING + '\n\n%text%\n\nС уважением и теплом,\nКоманда Поддержки ВКонтакте',
  STANDART_GREETING + '\n\n%text%\n\nВсегда с Вами,\nКоманда Поддержки ВКонтакте',
  STANDART_GREETING + '\n\n%text%\n\nВаша Поддержка ВКонтакте',
  STANDART_GREETING + '\n\n%text%\n\nС уважением,\nВаш Агент Поддержки %agent_uni_name%',
  STANDART_GREETING_2 + '\n\n%text%\n\nАгент Поддержки %agent_uni_name%',
  STANDART_GREETING + '\n\n%text%\n\nС теплом,\nКоманда Поддержки ВКонтакте',
  STANDART_GREETING + '\n\n%text%\n\nС уважением,\nКоманда Поддержки ВКонтакте',
  STANDART_GREETING + '\n\n%text%\n\nС уважением,\nАгент Поддержки ВКонтакте %agent_uni_name%',
  STANDART_GREETING + '\n\n%text%\n\nС уважением,\nВаша команда Поддержки ВКонтакте\n------------\n%agent_uni_name_full%',
  STANDART_GREETING + '\n\n%text%\n\nС уважением,\nАгент %agent_uni_name%',
  STANDART_GREETING_3 + '\n\n%text%\n\nВсегда рядом,\nКоманда Поддержки ВКонтакте',
  STANDART_GREETING_4 + '\n\n%text%\n\nAll day, all night\nКоманда Поддержки ВКонтакте',
  STANDART_GREETING + '\n\n%text%\n\nНа связи с Вами,\nКоманда Поддержки',
  STANDART_GREETING + '\n\n%text%\n\nВо тьме ночной, при свете дня!\nКоманда Поддержки ВКонтакте',
  STANDART_GREETING + '\n\n%text%\n\nДобра и тепла,\nВаша Поддержка',
  STANDART_GREETING + '\n\n%text%\n\nWe never sleep,\nКоманда Поддержки ВКонтакте',
  STANDART_GREETING_4 + '\n\n%text%\n\nAll day, all night\nКоманда Поддержки ВКонтакте 🍂',
  STANDART_GREETING + '\n\n%text%\n\nХорошего настроения,\nКоманда Поддержки ВКонтакте',
];

export const STATUSES_ACHIEVEMENTS = {
  not_recived: 'not_recived',
  recived: 'recived',
  progress: 'progress',

}