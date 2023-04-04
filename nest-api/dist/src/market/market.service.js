"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const enums_1 = require("../../libs/core/src/enums");
const entities_1 = require("../users/entities");
const config_1 = require("@nestjs/config");
const storage_service_1 = require("../storage/storage.service");
const Jimp = require("jimp");
const plugin_color_1 = require("@jimp/plugin-color");
const hasha = require("hasha");
const utils_1 = require("../../libs/utils/src");
const products_enum_1 = require("./enums/products.enum");
const money_operations_enum_1 = require("./enums/money-operations.enum");
const entities_2 = require("./entities");
const enums_2 = require("./enums");
let MarketService = class MarketService {
    constructor(configService, storageService, usersRepository, marketLogRepository, purchasedIconRepository, purchasedColorRepository) {
        this.configService = configService;
        this.storageService = storageService;
        this.usersRepository = usersRepository;
        this.marketLogRepository = marketLogRepository;
        this.purchasedIconRepository = purchasedIconRepository;
        this.purchasedColorRepository = purchasedColorRepository;
    }
    async getAvalibleIcons() {
        const icons = await this.storageService.getFolder(this.configService.get('S3_PATH_TO_AVATAR_ICONS_PNG'));
        const icons_names = icons.Contents.map(icon => icon.Key.split('/').at(-1));
        return icons_names;
    }
    async createCustomAvatar(user, backgroundColor, icon_name) {
        if (!await this.purchasedIconRepository.findOneBy({ user: { id: user.id }, icon_name }))
            throw new common_1.ForbiddenException('Указанная иконка не приобретена');
        if (!await this.purchasedIconRepository.findOneBy({ user: { id: user.id }, icon_name }))
            throw new common_1.ForbiddenException('Указанный цвет не приобретён');
        const size = 600;
        const avatar = new Jimp(size, size, backgroundColor);
        const icon_path = this.configService.get('S3_PATH_TO_AVATAR_ICONS_PNG') + '/' + icon_name;
        const iconWithJimp = await Jimp.read(this.storageService.bucketPath + '/' + icon_path);
        iconWithJimp.color([{ apply: plugin_color_1.ColorActionName.LIGHTEN, params: [size / 2] }]);
        avatar.composite(iconWithJimp, (size - iconWithJimp.getWidth()) / 2, (size - iconWithJimp.getHeight()) / 2);
        const newBuffer = await avatar.getBufferAsync(Jimp.MIME_PNG);
        const filename = `avagen${await hasha.async(icon_name + user.id + (0, utils_1.getTime)(), {
            algorithm: 'md5',
        })}.png`;
        const path = this.configService.get('S3_PATH_TO_AVATARS') + '/' + filename;
        const savedFile = await this.storageService.upload(user, path, newBuffer, enums_1.ImageTypesEnum.PNG);
        savedFile.bucket_path = this.storageService.bucketPath;
        return savedFile;
    }
    async installAvatar(user, hash) {
        const fileInfo = await this.storageService.save(user, hash);
        const cost = +this.configService.get('MARKET_COST_INSTALL_NEW_AVATAR');
        await this.manageUserMoney(user, products_enum_1.ProductsEnum.AVATAR, money_operations_enum_1.MoneyOperationsEnum['-'], cost);
        return this.usersRepository.save(Object.assign(Object.assign({}, user), { avatar: fileInfo }));
    }
    async buyIcon(user, icon_name) {
        const allIcons = await this.getAvalibleIcons();
        if (!allIcons.includes(icon_name))
            throw new common_1.NotFoundException('Иконка не найдена в каталоге');
        if (await this.purchasedIconRepository.findOneBy({ user: { id: user.id }, icon_name }))
            throw new common_1.BadRequestException('Иконка уже куплена');
        const cost = +this.configService.get('MARKET_COST_ICON');
        await this.manageUserMoney(user, products_enum_1.ProductsEnum.ICON, money_operations_enum_1.MoneyOperationsEnum['-'], cost);
        return this.purchasedIconRepository.save({ user, icon_name, purchased_at: (0, utils_1.getTime)() });
    }
    async buyColor(user, color) {
        if (!enums_2.ColorsAllEnum.includes(color))
            throw new common_1.NotFoundException('Цвет не найден в каталоге');
        if (await this.purchasedColorRepository.findOneBy({ color, user: { id: user.id } }))
            throw new common_1.BadRequestException('Цвет уже куплен');
        const cost = +this.configService.get('MARKET_COST_COLOR');
        await this.manageUserMoney(user, products_enum_1.ProductsEnum.COLOR, money_operations_enum_1.MoneyOperationsEnum['-'], cost);
        return this.purchasedColorRepository.save({ user, color, purchased_at: (0, utils_1.getTime)() });
    }
    async getMyIcons(user) {
        return {
            url_to_png: this.storageService.bucketPath + '/' + this.configService.get('S3_PATH_TO_AVATAR_ICONS_PNG'),
            url_to_icons: this.storageService.bucketPath + '/' + this.configService.get('S3_PATH_TO_AVATAR_ICONS'),
            items: await this.purchasedIconRepository.find({ where: { user: { id: user.id } } })
        };
    }
    async getMyColors(user) {
        return {
            items: await this.purchasedColorRepository.find({ where: { user: { id: user.id } } })
        };
    }
    async marketLogger(user, product, operation, cost) {
        return await this.marketLogRepository.save({
            user,
            product,
            operation,
            cost,
            operation_at: (0, utils_1.getTime)(),
        });
    }
    async manageUserMoney(user, productType, operation, cost) {
        let money = user.money;
        if (operation === money_operations_enum_1.MoneyOperationsEnum['+']) {
            money += cost;
        }
        else if (operation === money_operations_enum_1.MoneyOperationsEnum['-']) {
            if (money < cost)
                throw new common_1.PreconditionFailedException('Недостаточно средств');
            money -= cost;
        }
        await this.marketLogger(user, productType, operation, cost);
        return this.usersRepository.save(Object.assign(Object.assign({}, user), { money }));
    }
};
MarketService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.UserEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_2.MarketLogEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(entities_2.PurchasedIconEntity)),
    __param(5, (0, typeorm_1.InjectRepository)(entities_2.PurchasedColorEntity)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        storage_service_1.StorageService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MarketService);
exports.MarketService = MarketService;
//# sourceMappingURL=market.service.js.map