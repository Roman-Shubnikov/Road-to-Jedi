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
let MarketController = class MarketController {
    constructor(marketService) {
        this.marketService = marketService;
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
        return enums_1.ColorsAllEnum;
    }
    async getAvalibleIcons() {
        return this.marketService.getAvalibleIcons();
    }
    async buyIcon(user, iconName) {
        await this.marketService.buyIcon(user, iconName);
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
    __metadata("design:paramtypes", [entities_1.UserEntity, Object]),
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
    (0, swagger_1.ApiOperation)({ summary: 'Получить доступные к покупке иконки' }),
    __param(0, (0, decorators_1.User)()),
    __param(1, (0, common_1.Param)('iconName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.UserEntity, String]),
    __metadata("design:returntype", Promise)
], MarketController.prototype, "buyIcon", null);
MarketController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Маркет'),
    (0, common_1.Controller)('market'),
    __metadata("design:paramtypes", [market_service_1.MarketService])
], MarketController);
exports.MarketController = MarketController;
//# sourceMappingURL=market.controller.js.map