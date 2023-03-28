"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipAuthorization = exports.SKIP_AUTHORIZATION = void 0;
const common_1 = require("@nestjs/common");
exports.SKIP_AUTHORIZATION = 'skip-authorization';
const SkipAuthorization = () => (0, common_1.SetMetadata)(exports.SKIP_AUTHORIZATION, true);
exports.SkipAuthorization = SkipAuthorization;
//# sourceMappingURL=auth-skip.decorator.js.map