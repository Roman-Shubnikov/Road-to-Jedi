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
exports.PurchasedIconEntity = void 0;
const entities_1 = require("../../users/entities");
const typeorm_1 = require("typeorm");
let PurchasedIconEntity = class PurchasedIconEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PurchasedIconEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_1.UserEntity, (user) => user.purchased_icons, { cascade: true }),
    __metadata("design:type", entities_1.UserEntity)
], PurchasedIconEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PurchasedIconEntity.prototype, "icon_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PurchasedIconEntity.prototype, "purchased_at", void 0);
PurchasedIconEntity = __decorate([
    (0, typeorm_1.Entity)('purchased_icons')
], PurchasedIconEntity);
exports.PurchasedIconEntity = PurchasedIconEntity;
//# sourceMappingURL=purchased_icons.entity.js.map