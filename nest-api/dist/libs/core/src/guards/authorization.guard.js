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
exports.AuthorizationGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto = require("crypto");
const querystring_1 = require("querystring");
const entities_1 = require("../../../../src/users/entities");
const core_1 = require("@nestjs/core");
const decorators_1 = require("../decorators");
const utils_1 = require("../../../utils/src");
const TOKEN_LIFETIME = 12 * 60 * 60 * 1000;
let AuthorizationGuard = class AuthorizationGuard {
    constructor(configService, usersRepository, reflector) {
        this.configService = configService;
        this.usersRepository = usersRepository;
        this.reflector = reflector;
        this.secret = this.configService.get('VK_SECRET');
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        if (this.reflector.get(decorators_1.SKIP_AUTHORIZATION, context.getHandler())) {
            return true;
        }
        const authorization = request.headers['authorization'];
        if (!authorization || authorization.trim() === '') {
            throw new common_1.UnauthorizedException('Не указан токен в Authorization');
        }
        const [type, token] = authorization.split(' ');
        if (!token || type !== 'Bearer') {
            throw new common_1.UnauthorizedException('Токен невалиден, не хватает Bearer');
        }
        const data = (0, querystring_1.parse)(token);
        const vk_user_id = Number.parseInt(data.vk_user_id);
        const sign = data.sign;
        const signParams = {};
        for (const key of Object.keys(data).sort())
            if (key.slice(0, 3) === 'vk_')
                signParams[key] = data[key];
        const stringParams = (0, querystring_1.stringify)(signParams);
        const signHash = crypto
            .createHmac('sha256', this.secret)
            .update(stringParams)
            .digest('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=$/, '');
        if (sign !== signHash) {
            throw new common_1.UnauthorizedException('Не совпадает подпись');
        }
        let user = await this.usersRepository.findOne({
            where: { vk_user_id }
        });
        let currentTime = (0, utils_1.getTime)();
        if (!user) {
            throw new common_1.UnauthorizedException('Чтобы пользоваться этим разделом, вначале станьте агентом');
        }
        else {
            await this.usersRepository.save({ id: user.id, last_activity: currentTime });
        }
        request.user = user;
        return true;
    }
};
AuthorizationGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.UserEntity)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository,
        core_1.Reflector])
], AuthorizationGuard);
exports.AuthorizationGuard = AuthorizationGuard;
//# sourceMappingURL=authorization.guard.js.map