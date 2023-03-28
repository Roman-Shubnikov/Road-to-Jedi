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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const enums_1 = require("../../libs/core/src/enums");
const entities_1 = require("./entities");
const config_1 = require("@nestjs/config");
let UsersService = class UsersService {
    constructor(configService, usersRepository) {
        this.configService = configService;
        this.usersRepository = usersRepository;
    }
    async onApplicationBootstrap() {
        await this.seedAdmins();
    }
    async seedAdmins() {
    }
    async isAdmin(user) {
        return { isAdmin: user.permissions === enums_1.RoleEnum.ADMIN };
    }
    async findOne(id) {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user)
            throw new common_1.HttpException('Пользователь не найден.', common_1.HttpStatus.NO_CONTENT);
        return Object.assign({}, user);
    }
    async changeRole(id, role) {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) {
            throw new common_1.HttpException('Пользователь не найден', common_1.HttpStatus.NOT_FOUND);
        }
        return await this.usersRepository.save(Object.assign(Object.assign({}, user), { role }));
    }
    async getSelf(user) {
        return user;
    }
    async getStaff() {
        let staff = await this.usersRepository.findBy({ permissions: enums_1.RoleEnum.SPECIAL });
        let ids = staff.map((user) => user.id);
        return ids;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.UserEntity)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map