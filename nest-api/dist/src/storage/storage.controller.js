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
exports.StorageController = void 0;
const decorators_1 = require("../../libs/core/src/decorators");
const enums_1 = require("../../libs/core/src/enums");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("@nestjs/typeorm");
const hasha = require("hasha");
const storage_service_1 = require("./storage.service");
const entities_1 = require("../users/entities");
const typeorm_2 = require("typeorm");
const entities_2 = require("./entities");
const enums_2 = require("../../libs/core/src/enums");
let StorageController = class StorageController {
    constructor(storageService, filesRepository) {
        this.storageService = storageService;
        this.filesRepository = filesRepository;
    }
    async download(filename) {
        var _a;
        const file = await this.storageService.getBufferObject(filename);
        const mimeTypes = {
            jpg: 'image/jpg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            webp: 'image/webp',
        };
        const ext = filename.split('.').at(-1);
        return new common_1.StreamableFile(file, {
            type: (_a = mimeTypes[ext]) !== null && _a !== void 0 ? _a : 'application/octet-stream',
        });
    }
    async upload(user, file) {
        const ext = file.originalname.split('.').at(-1);
        const filename = `${await hasha.async(file.originalname, {
            algorithm: 'md5',
        })}.${ext}`;
        const path = `own/${filename}`;
        return await this.storageService.upload(user, path, file.buffer, file.mimetype);
    }
    async delete(user, fileId) {
        const fileInfo = await this.filesRepository.findOne({ relations: { owner: true }, where: { id: +fileId } });
        if (!fileInfo)
            throw new common_1.NotFoundException('Файл не найден');
        if (fileInfo.owner.id !== user.id)
            throw new common_1.ForbiddenException('Вы не являетесь владельцем этого файла');
        return await this.storageService.delete(fileInfo.id);
    }
};
__decorate([
    (0, common_1.Get)(':filename'),
    (0, decorators_1.SkipAuthorization)(),
    (0, swagger_1.ApiOperation)({ summary: 'Скачать файл из хранилища' }),
    __param(0, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "download", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (req, file, cb) => {
            if (!Object.values(enums_2.allowedFileTypes).includes(file.mimetype)) {
                cb(new common_1.ForbiddenException('Этот тип файлов не поддерживается для загрузки'), false);
            }
        }, })),
    (0, swagger_1.ApiOperation)({ summary: 'Загрузить файл в хранилище' }),
    (0, decorators_1.Roles)(enums_1.RoleEnum.ADMIN),
    __param(0, (0, decorators_1.User)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.UserEntity, Object]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "upload", null);
__decorate([
    (0, common_1.Delete)(':fileId'),
    (0, swagger_1.ApiOperation)({ summary: 'Удалить файл из хранилища' }),
    __param(0, (0, decorators_1.User)()),
    __param(1, (0, common_1.Param)('fileId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.UserEntity, String]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "delete", null);
StorageController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Файловое хранилище'),
    (0, common_1.Controller)('storage'),
    __param(1, (0, typeorm_1.InjectRepository)(entities_2.FileEntity)),
    __metadata("design:paramtypes", [storage_service_1.StorageService,
        typeorm_2.Repository])
], StorageController);
exports.StorageController = StorageController;
//# sourceMappingURL=storage.controller.js.map