"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUSES_ACHIEVEMENTS = exports.PRESETS_MESSAGES = exports.IS_MOBILE = exports.viewsStructure = exports.JediIcons28 = exports.PERMISSIONS = exports.PUBLIC_STATUS_LIMIT = exports.GENERATOR_NORM = exports.SPECIAL_NORM = exports.SPEC_COURCE_LINKS = exports.CONVERSATION_LINK = exports.LINK_APP = exports.blueBackground = exports.HISTORY_IMAGES = exports.POST_TEXTS = exports.MESSAGE_NO_VK = exports.LINKS_VK = exports.AVATARS_URL = exports.SOCKET_URL = exports.API_URL = void 0;
const react_1 = __importDefault(require("react"));
const vkui_1 = require("@vkontakte/vkui");
const icons_1 = require("@vkontakte/icons");
exports.API_URL = "https://xelene.ru/road/php/index.php?";
exports.SOCKET_URL = 'wss://af4a-95-27-192-198.eu.ngrok.io/';
exports.AVATARS_URL = "https://xelene.ru/road/php/images/avatars/";
exports.LINKS_VK = {
    donut_article: "https://vk.com/@jedi_road-unikalnyi-kontent-vk-donut",
    probability_article: "https://vk.com/@sartj-glossarii?anchor=veroyatnost-otsenivania-otvetov-eto-chto-takoe",
    support_jedi: 'https://vk.me/special_help',
    communuty_jedi: 'https://vk.com/jedi_road',
    fantoms_article: 'https://vk.com/@jedi_road-ohota-na-fantomov-nevidimovichei',
    market_info_article: 'https://vk.com/@jedi_road-sistema-nachisleniya-ballov-i-shop',
    market_info_donut_article: 'https://vk.com/@jedi_road-vk-donut-for-road-to-jedi',
    verification: 'https://vk.com/@jedi_road-chto-takoe-verifikaciya-i-kak-ee-poluchit-galochku',
};
exports.MESSAGE_NO_VK = (<vkui_1.Div>
        <vkui_1.FormStatus mode="default">
            Сервис не относится на прямую к социальной сети ВКонтакте.
        </vkui_1.FormStatus>
    </vkui_1.Div>);
exports.POST_TEXTS = {
    prometay: {
        text: "Раздаю отличные ответы в [https://vk.com/vkagentsapp|VK Агенты] по максимуму — это я от усердия теперь горю или мне наконец-то дали значок Прометея в Профиле RtJ? 🎉\n\n#RoadtoJedi #Прометей",
        image: "photo605436158_457240007"
    },
    verif: {
        text: "Доказал, что достоин, — верифицировал Профиль [https://vk.com/vkagentsapp|VK Агенты].\n\nА у вас уже есть такая галочка?\n\n#RoadtoJedi #Верификация",
        image: "photo605436158_457240006"
    },
    donut: {
        text: "Поддерживаю любимое сообщество и приложение [https://vk.com/vkagentsapp|VK Агенты].\n\nПриятно чувствовать себя агентом и выделяться среди остальных ;)\n\n#RoadtoJedi #VKDonut",
        image: "photo605436158_457240005"
    }
};
exports.HISTORY_IMAGES = {
    prometay: {
        image: "https://sun9-25.userapi.com/impf/y-48TlRZRKfvy6XPPv60iFFHRA1MVPknRFG8TA/ZgjfvgntI3A.jpg?size=607x1080&quality=96&sign=3bbcb679fce21acee714391359f764bd"
    },
    verif: {
        image: "https://sun9-32.userapi.com/impf/GTxLdOv-QScQqakIoBgM9cKQHLMx53ajTEWJrw/lsWE91Rdf4g.jpg?size=454x807&quality=96&sign=238abb9ba7b1fea3e26e2354c16a65dd"
    },
    donut: {
        image: "https://sun9-32.userapi.com/impf/ZSrMdpua6pPTqA6HYVXjEGm1QHkiPerFPVpBlQ/2q3uSkrkrsk.jpg?size=454x807&quality=96&sign=6d7c6695992142447101ae34ff36ff04"
    }
};
exports.blueBackground = {
    backgroundColor: 'var(--accent)'
};
exports.LINK_APP = "https://vk.com/vkagentsapp";
exports.CONVERSATION_LINK = "https://vk.me/join/zyWQzsgQ9iw6V2YAfbwiGtuO883rnYhXwAY=";
exports.SPEC_COURCE_LINKS = {
    cource: "https://vk.com/@sartj-course",
    conversation: 'https://vk.me/join/yzDBN6UvFS72yXvKBNqUkXZMilz/6NJ/Arg=',
    community: 'https://vk.com/club212134873',
    messages_help: 'https://vk.com/gim201542328',
};
exports.SPECIAL_NORM = 50;
exports.GENERATOR_NORM = 200;
exports.PUBLIC_STATUS_LIMIT = 70;
exports.PERMISSIONS = {
    user: -1,
    agent: 0,
    special: 1,
    admin: 20,
};
exports.JediIcons28 = {
    0: icons_1.Icon28CancelCircleOutline,
    1: icons_1.Icon28BoxHeartOutline,
    2: icons_1.Icon28KeyboardOutline,
    3: icons_1.Icon28BuildingOutline,
    4: icons_1.Icon28LocationMapOutline,
    5: icons_1.Icon28UserSquareOutline,
    6: icons_1.Icon28BugOutline,
    7: icons_1.Icon28DonateOutline,
    8: icons_1.Icon28MoneyWadOutline,
    9: icons_1.Icon28LaptopOutline,
    10: icons_1.Icon28PincodeLockOutline,
    11: icons_1.Icon28WorkOutline,
};
exports.viewsStructure = {
    Questions: {
        navName: 'Questions',
        name: 'Вопросы',
        panels: {
            homepanel: 'home',
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
            homepanel: 'home',
        }
    },
    Disconnect: {
        navName: 'disconnect',
        name: 'Ошибка сети',
        panels: {
            homepanel: 'load',
        }
    }
};
exports.IS_MOBILE = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
// name_user - Автор тикета
// agent_uni_name - имя агента в зависимости от ника и id
// agent_uni_name_full - имя агента в зависимости от ника и id если нет ника то полностью агент поддержки ...
// agent_id - id агента
// text - текущее значение инпута
const STANDART_GREETING = 'Здравствуйте, %name_user%!';
const STANDART_GREETING_2 = 'Приветствую, %name_user%!';
const STANDART_GREETING_3 = 'Доброго времени суток, %name_user%!';
const STANDART_GREETING_4 = 'Приветствуем, %name_user%!';
exports.PRESETS_MESSAGES = [
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
exports.STATUSES_ACHIEVEMENTS = {
    not_recived: 'not_recived',
    recived: 'recived',
    progress: 'progress',
};
