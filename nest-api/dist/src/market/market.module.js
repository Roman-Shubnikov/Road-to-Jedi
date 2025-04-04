"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const storage_module_1 = require("../storage/storage.module");
const market_service_1 = require("./market.service");
const market_controller_1 = require("./market.controller");
const entities_1 = require("./entities");
const entities_2 = require("../users/entities");
let MarketModule = class MarketModule {
};
MarketModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            typeorm_1.TypeOrmModule.forFeature([
                entities_1.MarketLogEntity,
                entities_2.UserEntity,
                entities_1.PurchasedIconEntity,
                entities_1.PurchasedColorEntity,
            ]),
            storage_module_1.StorageModule,
        ],
        controllers: [market_controller_1.MarketController],
        providers: [market_service_1.MarketService],
        exports: [typeorm_1.TypeOrmModule],
    })
], MarketModule);
exports.MarketModule = MarketModule;
//# sourceMappingURL=market.module.js.map