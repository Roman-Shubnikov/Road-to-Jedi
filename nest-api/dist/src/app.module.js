"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const schedule_1 = require("@nestjs/schedule");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const guards_1 = require("../libs/core/src/guards");
const entities_1 = require("./users/entities");
const users_module_1 = require("./users/users.module");
const storage_module_1 = require("./storage/storage.module");
const market_module_1 = require("./market/market.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.DB_HOST,
                port: +((_a = process.env.DB_PORT) !== null && _a !== void 0 ? _a : ''),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                synchronize: true,
                autoLoadEntities: true,
            }),
            schedule_1.ScheduleModule.forRoot(),
            typeorm_1.TypeOrmModule.forFeature([entities_1.UserEntity]),
            users_module_1.UsersModule,
            storage_module_1.StorageModule,
            market_module_1.MarketModule,
        ],
        controllers: [],
        providers: [
            { provide: core_1.APP_GUARD, useClass: guards_1.AuthorizationGuard },
            { provide: core_1.APP_GUARD, useClass: guards_1.RolesGuard },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map