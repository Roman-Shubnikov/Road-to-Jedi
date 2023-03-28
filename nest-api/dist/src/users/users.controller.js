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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../../libs/core/src/decorators");
const enums_1 = require("../../libs/core/src/enums");
const entities_1 = require("./entities");
const users_service_1 = require("./users.service");
const dto_1 = require("./dto");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async isAdmin(user) {
        return this.usersService.isAdmin(user);
    }
    async changeRole(id, { role }) {
        return this.usersService.changeRole(+id, role);
    }
    async getSelf(user) {
        return this.usersService.getSelf(user);
    }
    async getStaff() {
        return this.usersService.getStaff();
    }
};
__decorate([
    (0, common_1.Post)('isAdmin'),
    (0, swagger_1.ApiOperation)({ summary: 'Узнать администратор или нет' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK }),
    __param(0, (0, decorators_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.UserEntity]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "isAdmin", null);
__decorate([
    (0, common_1.Put)('role/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Сменить роль пользователя' }),
    (0, decorators_1.Roles)(enums_1.RoleEnum.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.ChangeUserRoleDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changeRole", null);
__decorate([
    (0, common_1.Get)('getSelf'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить информацию о себе' }),
    __param(0, (0, decorators_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.UserEntity]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getSelf", null);
__decorate([
    (0, common_1.Get)('getStaff'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить информацию о редакторах сообщества' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getStaff", null);
UsersController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Пользователи'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map