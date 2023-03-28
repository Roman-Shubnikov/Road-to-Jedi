import { RoleEnum } from '@app/core/enums';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: RoleEnum[]) => import("@nestjs/common").CustomDecorator<string>;
