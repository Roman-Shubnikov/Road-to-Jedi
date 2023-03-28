"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const storage_controller_1 = require("./storage.controller");
const storage_service_1 = require("./storage.service");
const entities_1 = require("./entities");
let StorageModule = class StorageModule {
};
StorageModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            common_1.CacheModule.register(),
            typeorm_1.TypeOrmModule.forFeature([entities_1.FileEntity])
        ],
        controllers: [storage_controller_1.StorageController],
        providers: [storage_service_1.StorageService],
        exports: [storage_service_1.StorageService, config_1.ConfigModule],
    })
], StorageModule);
exports.StorageModule = StorageModule;
//# sourceMappingURL=storage.module.js.map