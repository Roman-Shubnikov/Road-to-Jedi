"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPersent = void 0;
const getPersent = (full_number, part_number, round = true) => {
    let persent = Math.min(part_number / full_number * 100, 100);
    if (round)
        return Math.floor(persent);
    return persent;
};
exports.getPersent = getPersent;
//# sourceMappingURL=getPersent.js.map