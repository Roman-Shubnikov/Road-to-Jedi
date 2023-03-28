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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketLogEntity = void 0;
const entities_1 = require("../../users/entities");
const typeorm_1 = require("typeorm");
const money_operations_enum_1 = require("../enums/money-operations.enum");
const products_enum_1 = require("../enums/products.enum");
let MarketLogEntity = class MarketLogEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MarketLogEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_1.UserEntity, (user) => user.id, { cascade: true }),
    __metadata("design:type", entities_1.UserEntity)
], MarketLogEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MarketLogEntity.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MarketLogEntity.prototype, "operation", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MarketLogEntity.prototype, "cost", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MarketLogEntity.prototype, "operation_at", void 0);
MarketLogEntity = __decorate([
    (0, typeorm_1.Entity)('market_logs')
], MarketLogEntity);
exports.MarketLogEntity = MarketLogEntity;
//# sourceMappingURL=marketlog.entity.js.map