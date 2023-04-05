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
exports.MarketController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../../libs/core/src/decorators");
const entities_1 = require("../users/entities");
const dto_1 = require("./dto");
const market_service_1 = require("./market.service");
const enums_1 = require("./enums");
const config_1 = require("@nestjs/config");
let MarketController = class MarketController {
    constructor(marketService, configService) {
        this.marketService = marketService;
        this.configService = configService;
    }
    async createCustomAvatar(user, body) {
        return this.marketService.createCustomAvatar(user, body.color, body.icon_name);
    }
    async installAvatar(user, hash) {
        return this.marketService.installAvatar(user, hash);
    }
    async buyColor(user, body) {
        await this.marketService.buyColor(user, body.color);
        return true;
    }
    async getAvalibleColors() {
        return enums_1.ColorsAllEnum.map(v => ({ color: v }));
    }
    async getAvalibleIcons() {
        return this.marketService.getAvalibleIcons();
    }
    async buyIcon(user, iconName) {
        await this.marketService.buyIcon(user, iconName);
        return true;
    }
    async getMyIcons(user) {
        return await this.marketService.getMyIcons(user);
    }
    async getMyColors(user) {
        return await this.marketService.getMyColors(user);
    }
    async getPrices() {
        const data = {
            nickname: +this.configService.get('MARKET_COST_INSTALL_NEW_NICKNAME'),
            new_avatar: +this.configService.get('MARKET_COST_INSTALL_NEW_AVATAR'),
            new_color: +this.configService.get('MARKET_COST_COLOR'),
            new_icon: +this.configService.get('MARKET_COST_ICON'),
        };
        return data;
    }
    async setNickname(user, body) {
        await this.marketService.setNickname(user, body.nickname);
        return true;
    }
    async deleteNickname(user) {
        await this.marketService.setNickname(user, null);
        return true;
    }
};
__decorate([
    (0, common_1.Post)('createCustomAvatar'),
    (0, swagger_1.ApiOperation)({ summary: 'Создать кастомную аватарку' }),
    __param(0, (0, decorators_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.UserEntity, dto_1.CreateCustomAvatarDto]),
    __metadata("design:returntype", Promise)
], MarketController.prototype, "createCustomAvatar", null);
__decorate([
    (0, common_1.Post)('installAvatar/:hash'),
    (0, swagger_1.ApiOperation)({ summary: 'Установить аватарку' }),
    __param(0, (0, decorators_1.User)()),
    __param(1, (0, common_1.Param)('hash')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.UserEntity, String]),
    __metadata("design:returntype", Promise)
], MarketController.prototype, "installAvatar", null);
__decorate([
    (0, common_1.Post)('buyColor'),
    (0, swagger_1.ApiOperation)({ summary: 'Купить цвет' }),
    __param(0, (0, decorators_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.UserEntity, dto_1.BuyColorDto]),
    __metadata("design:returntype", Promise)
], MarketController.prototype, "buyColor", null);
__decorate([
    (0, common_1.Get)('getAvalibleColors'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить доступные к покупке цвета' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MarketController.prototype, "getAvalibleColors", null);
__decorate([
    (0, common_1.Get)('getAvalibleIcons'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить доступные к покупке иконки' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MarketController.prototype, "getAvalibleIcons", null);
__decorate([
    (0, common_1.Post)('buyIcon/:iconName'),
    (0, swagger_1.ApiOperation)({ summary: 'Купить иконку' }),
    __param(0, (0, decorators_1.User)()),
    __param(1, (0, common_1.Param)('iconName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.UserEntity, String]),
    __metadata("design:returntype", Promise)
], MarketController.prototype, "buyIcon", null);
__decorate([
    (0, common_1.Get)('getMyIcons'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить купленные иконки' }),
    __param(0, (0, decorators_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.UserEntity]),
    __metadata("design:returntype", Promise)
], MarketController.prototype, "getMyIcons", null);
__decorate([
    (0, common_1.Get)('getMyColors'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить купленные цвета' }),
    __param(0, (0, decorators_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.UserEntity]),
    __metadata("design:returntype", Promise)
], MarketController.prototype, "getMyColors", null);
__decorate([
    (0, common_1.Get)('getPrices'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить актуальные цены на товары' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MarketController.prototype, "getPrices", null);
__decorate([
    (0, common_1.Put)('nickname'),
    (0, swagger_1.ApiOperation)({ summary: 'Установить ник' }),
    __param(0, (0, decorators_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.UserEntity, dto_1.SetNicknameDto]),
    __metadata("design:returntype", Promise)
], MarketController.prototype, "setNickname", null);
__decorate([
    (0, common_1.Delete)('nickname'),
    (0, swagger_1.ApiOperation)({ summary: 'Удалить ник' }),
    __param(0, (0, decorators_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.UserEntity]),
    __metadata("design:returntype", Promise)
], MarketController.prototype, "deleteNickname", null);
MarketController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Маркет'),
    (0, common_1.Controller)('market'),
    __metadata("design:paramtypes", [market_service_1.MarketService,
        config_1.ConfigService])
], MarketController);
exports.MarketController = MarketController;
//# sourceMappingURL=market.controller.js.map