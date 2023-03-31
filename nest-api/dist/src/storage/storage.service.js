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
var StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("./entities");
const utils_1 = require("../../libs/utils/src");
const hasha = require("hasha");
let StorageService = StorageService_1 = class StorageService {
    constructor(configService, filesRepository) {
        this.configService = configService;
        this.filesRepository = filesRepository;
        this.bucket = this.configService.get('S3_STORAGE_BUCKET');
        this.bucketPath = 'https://' + this.bucket + '.' + this.configService.get('S3_HOST');
        this.host = 'https://' + this.configService.get('S3_HOST');
        this.logger = new common_1.Logger(StorageService_1.name);
        this.s3 = new client_s3_1.S3Client({
            endpoint: this.host,
            credentials: {
                accessKeyId: this.configService.get('S3_ROOT_USER'),
                secretAccessKey: this.configService.get('S3_ROOT_PASSWORD'),
            },
            region: this.configService.get('S3_REGION')
        });
    }
    async getFolder(path) {
        let input = {
            Bucket: this.bucket,
            Prefix: path,
        };
        const icons = await this.s3.send(new client_s3_1.ListObjectsCommand(input));
        return icons;
    }
    async upload(user, path, buffer, mimeType) {
        try {
            let inputData = {
                Bucket: this.bucket,
                Key: path,
                Body: buffer,
                ContentType: mimeType,
            };
            let count = await this.filesRepository.createQueryBuilder('files')
                .select('COUNT(*)', 'count')
                .where('files.owner = :user', { user: user.id })
                .getRawOne();
            if (count > +this.configService.get('S3_FILE_LIMIT_PER_USER')) {
                const oldNotSavedFile = await this.filesRepository.findOne({
                    where: {
                        saved: false,
                        owner: {
                            id: user.id
                        }
                    },
                    order: {
                        created_at: "ASC",
                    }
                });
                if (!oldNotSavedFile)
                    throw new common_1.ForbiddenException('Лимит загрузки файлов исчерпан');
                await this.filesRepository.remove(oldNotSavedFile);
            }
            await this.s3.send(new client_s3_1.PutObjectCommand(inputData));
            this.logger.log(`saved ${path}`);
            return await this.filesRepository.save({
                owner: user,
                path,
                created_at: (0, utils_1.getTime)(),
                hash: await hasha.async(buffer, { algorithm: 'md5' }),
                mimeType,
            });
        }
        catch (error) {
            let err = `failed to save ${path}`;
            this.logger.error(err);
            this.logger.error(error);
            throw new common_1.BadGatewayException(err);
        }
    }
    async save(user, hash) {
        let fileInfo = await this.filesRepository.findOneBy({ saved: false, hash });
        if (!fileInfo)
            throw new common_1.NotFoundException('Файл не найден');
        fileInfo.owner = user;
        fileInfo.saved = true;
        return this.filesRepository.save(fileInfo);
    }
    async has(path) {
        try {
            await this.s3.send(new client_s3_1.GetObjectCommand({ Bucket: this.bucket, Key: path }));
            return true;
        }
        catch (_a) {
            return false;
        }
    }
    async get(filename) {
        try {
            const data = await this.s3.send(new client_s3_1.GetObjectCommand({ Bucket: this.bucket, Key: filename }));
            return data;
        }
        catch (_a) {
            throw new common_1.HttpException('не удалось получить файл', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async getBufferObject(filename) {
        const fileInfo = await this.get(filename);
        return Buffer.from(fileInfo.Body.toString());
    }
    async delete(fileId) {
        try {
            const fileInfo = await this.filesRepository.findOneBy({ id: fileId });
            await this.s3.send(new client_s3_1.DeleteObjectCommand({ Bucket: this.bucket, Key: fileInfo.path }));
            await this.filesRepository.remove(fileInfo);
            this.logger.log(`deleted ${fileId}`);
            return true;
        }
        catch (error) {
            let err = `failed to delete ${fileId}`;
            this.logger.error(err);
            this.logger.error(error);
            throw new common_1.BadGatewayException(err);
        }
    }
};
StorageService = StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.FileEntity)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository])
], StorageService);
exports.StorageService = StorageService;
//# sourceMappingURL=storage.service.js.map